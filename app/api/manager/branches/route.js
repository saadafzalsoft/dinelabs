import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { cleanSlug } from '@/lib/slug';

export async function GET(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: session.email });
    const tenantIds = [];
    if (session.tenantId) tenantIds.push(session.tenantId.toString());
    if (user?.tenantId && !tenantIds.includes(user.tenantId.toString())) {
      tenantIds.push(user.tenantId.toString());
    }

    const tenants = await db.collection('tenants').find({
      $or: [
        { _id: { $in: tenantIds } },
        { ownerEmail: session.email },
      ],
    }).toArray();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const branches = await Promise.all(
      tenants.map(async (t) => {
        const tid = t._id.toString();
        const todayOrders = await db.collection('orders').find({
          tenantId: tid,
          createdAt: { $gte: startOfToday },
        }).toArray();
        const sales = todayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);

        return {
          id: tid,
          slug: t.slug,
          name: t.restaurantName || t.name || t.slug,
          where: t.address || t.country || '',
          status: t.status === 'active' ? 'Open' : 'Paused',
          open: t.status === 'active',
          orders: todayOrders.length,
          sales: Math.round(sales * 100) / 100,
          isCurrent: tid === (session.tenantId?.toString() || user?.tenantId?.toString()),
        };
      })
    );

    return NextResponse.json(branches);
  } catch (error) {
    console.error('Branches GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, copyFromId } = body;
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Branch name is required' }, { status: 400 });
    }

    const db = await getDb();
    const slugBase = cleanSlug(name);
    let slug = slugBase;
    const existing = await db.collection('tenants').findOne({ slug });
    if (existing) {
      slug = `${slugBase}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newTenantId = new ObjectId().toString();
    const newTenant = {
      _id: newTenantId,
      restaurantName: name.trim(),
      slug,
      address: address?.trim() || '',
      ownerEmail: session.email,
      status: 'active',
      enabledModes: { delivery: false, pickup: true, dineIn: false },
      createdAt: new Date(),
    };

    await db.collection('tenants').insertOne(newTenant);

    if (copyFromId) {
      const [cats, prods] = await Promise.all([
        db.collection('categories').find({ tenantId: copyFromId.toString() }).toArray(),
        db.collection('products').find({ tenantId: copyFromId.toString() }).toArray(),
      ]);
      const catIdMap = new Map();
      for (const c of cats) {
        const newCid = new ObjectId().toString();
        catIdMap.set(c._id.toString(), newCid);
        await db.collection('categories').insertOne({ ...c, _id: newCid, tenantId: newTenantId });
      }
      for (const p of prods) {
        const newPid = new ObjectId().toString();
        const mappedCat = catIdMap.get(p.categoryId?.toString()) || p.categoryId;
        await db.collection('products').insertOne({ ...p, _id: newPid, tenantId: newTenantId, categoryId: mappedCat });
      }
    }

    return NextResponse.json({
      id: newTenantId,
      slug,
      name: newTenant.restaurantName,
      where: newTenant.address,
      status: 'Open',
      open: true,
      orders: 0,
      sales: 0,
      isCurrent: false,
    });
  } catch (error) {
    console.error('Branches POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

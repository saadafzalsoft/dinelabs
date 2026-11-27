import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest, getMasqueradeFromRequest } from '@/lib/auth';

async function getTenantId(request) {
  const session = getSessionFromRequest(request);
  if (!session) return null;
  if (session.role === 'superadmin') {
    const masquerade = getMasqueradeFromRequest(request);
    return masquerade ? masquerade.tenantId : null;
  }
  if (session.tenantId) return session.tenantId;
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: session.email });
  return user?.tenantId || null;
}

function getItemName(item) {
  if (!item?.name) return 'Item';
  if (typeof item.name === 'object') {
    return item.name.en || item.name.de || item.name.ar || Object.values(item.name)[0] || 'Item';
  }
  return String(item.name);
}

export async function GET(request) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const orders = await db.collection('orders')
      .find({ tenantId: tenantId.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    const map = new Map();
    for (const o of orders) {
      const name = o.customer?.name?.trim() || 'Guest';
      const phone = o.customer?.phone?.trim() || '';
      const key = phone || name.toLowerCase();
      const total = Number(o.total) || 0;
      const createdAt = o.createdAt ? new Date(o.createdAt) : new Date();

      if (!map.has(key)) {
        map.set(key, {
          name,
          phone,
          orders: 0,
          spent: 0,
          lastAt: createdAt.getTime(),
          firstAt: createdAt.getTime(),
          itemCounts: new Map(),
        });
      }

      const c = map.get(key);
      c.orders += 1;
      c.spent += total;
      if (createdAt.getTime() > c.lastAt) c.lastAt = createdAt.getTime();
      if (createdAt.getTime() < c.firstAt) c.firstAt = createdAt.getTime();

      for (const it of o.items || []) {
        const iName = getItemName(it);
        c.itemCounts.set(iName, (c.itemCounts.get(iName) || 0) + (Number(it.quantity || it.qty) || 1));
      }
    }

    const customers = Array.from(map.values())
      .map((c) => {
        let fav = 'Popular item';
        let maxCount = 0;
        for (const [itemName, count] of c.itemCounts.entries()) {
          if (count > maxCount) {
            maxCount = count;
            fav = itemName;
          }
        }
        return {
          name: c.name,
          phone: c.phone,
          orders: c.orders,
          spent: Math.round(c.spent * 100) / 100,
          lastAt: c.lastAt,
          firstAt: c.firstAt,
          fav,
        };
      })
      .sort((a, b) => b.orders - a.orders || b.spent - a.spent);

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Manager customers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

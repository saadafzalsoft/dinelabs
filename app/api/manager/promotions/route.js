import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest, getMasqueradeFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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

export async function GET(request) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const promos = await db.collection('promotions')
      .find({ tenantId: tenantId.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(promos);
  } catch (error) {
    console.error('Promotions GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const promo = {
      _id: new ObjectId().toString(),
      tenantId: tenantId.toString(),
      title: body.title || 'Promotion',
      sub: body.sub || 'Always on',
      kind: body.kind ?? 0,
      value: body.value || '10',
      code: body.code || '',
      on: body.on !== undefined ? Boolean(body.on) : true,
      used: 0,
      createdAt: new Date(),
    };

    const db = await getDb();
    await db.collection('promotions').insertOne(promo);
    return NextResponse.json(promo);
  } catch (error) {
    console.error('Promotions POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Promotion ID required' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('promotions').updateOne(
      { _id: id.toString(), tenantId: tenantId.toString() },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Promotions PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

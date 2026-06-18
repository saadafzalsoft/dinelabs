import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

async function checkSuperAdmin(request) {
  const sessionCookie = request.cookies.get('dinelabs_session')?.value;
  const session = verifyToken(sessionCookie);
  return session && session.role === 'superadmin';
}

export async function GET(request, { params }) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDb();
    
    const queryId = id.toString();
    let tenant = await db.collection('tenants').findOne({ _id: queryId });
    if (!tenant) {
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
      } catch (e) {}
    }
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    let manager = await db.collection('users').findOne({ tenantId: queryId, role: 'manager' });
    if (!manager) {
      try {
        manager = await db.collection('users').findOne({ tenantId: new ObjectId(queryId), role: 'manager' });
      } catch (e) {}
    }
    tenant.managerEmail = manager ? manager.email : 'N/A';

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error('Super tenant GET id error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDb();
    const queryId = id.toString();

    // Delete tenant
    let res = await db.collection('tenants').deleteOne({ _id: queryId });
    if (res.deletedCount === 0) {
      try {
        const { ObjectId } = require('mongodb');
        res = await db.collection('tenants').deleteOne({ _id: new ObjectId(queryId) });
      } catch (e) {}
    }

    // Delete users associated with this tenant
    await db.collection('users').deleteMany({ tenantId: queryId });
    try {
      const { ObjectId } = require('mongodb');
      await db.collection('users').deleteMany({ tenantId: new ObjectId(queryId) });
    } catch (e) {}

    // Delete orders associated with this tenant
    await db.collection('orders').deleteMany({ tenantId: queryId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Super tenant DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


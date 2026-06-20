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
    console.log('API Request: GET tenant for queryId =', queryId);
    
    let tenant = await db.collection('tenants').findOne({ _id: queryId });
    if (!tenant) {
      console.log('Query by string ID failed, trying ObjectId...');
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
      } catch (e) {
        console.log('ObjectId query failed with error:', e.message);
      }
    }
    
    console.log('API Request: Found tenant =', tenant ? tenant.name : 'null');
    
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

    // Get orders for stats (projecting only necessary fields for performance)
    const tenantOrders = await db.collection('orders').find({ tenantId: queryId }, { projection: { total: 1, createdAt: 1 } }).toArray();
    const ordersCount = tenantOrders.length;
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const ordersToday = tenantOrders.filter(o => new Date(o.createdAt) >= startOfToday).length;

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const revenueThisWeek = tenantOrders
      .filter(o => new Date(o.createdAt) >= oneWeekAgo)
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

    let lastOrderTime = 'No orders yet';
    let lastMin = 99999;
    if (tenantOrders.length > 0) {
      const sortedOrders = [...tenantOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      lastOrderTime = sortedOrders[0].createdAt;
      lastMin = Math.round((new Date().getTime() - new Date(lastOrderTime).getTime()) / 60000);
      if (lastMin < 0) lastMin = 0;
    }

    const seedHash = tenant.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const err = ordersCount > 0 ? (seedHash % 5) / 10 : 0.0;

    // Get products count
    let productsCount = await db.collection('products').countDocuments({ tenantId: queryId });
    if (productsCount === 0) {
      try {
        productsCount = await db.collection('products').countDocuments({ tenantId: new ObjectId(queryId) });
      } catch (e) {}
    }

    tenant.ordersToday = ordersToday;
    tenant.revenueThisWeek = revenueThisWeek;
    tenant.lastOrderTime = lastOrderTime;
    tenant.lastMin = lastMin;
    tenant.err = err;
    tenant.productsCount = productsCount;

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


import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { sendOrderStatusUpdateNotification } from '@/lib/notifications';

// GET handler: fetch a single order by ID (public access for guest tracking)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const db = await getDb();
    const matchIds = [id.toString()];
    try {
      matchIds.push(new ObjectId(id.toString()));
    } catch (e) {}

    const order = await db.collection('orders').findOne({ _id: { $in: matchIds } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, deliveryMinutes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'accepted', 'ready', 'shipped', 'declined', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    // Authenticate session
    const sessionCookie = request.cookies.get('dinelabs_session')?.value;
    const masqueradeCookie = request.cookies.get('dinelabs_masquerade')?.value;
    const session = verifyToken(sessionCookie);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let tenantId = session.tenantId;
    if (session.role === 'superadmin' && masqueradeCookie) {
      const masqueradeData = verifyToken(masqueradeCookie);
      if (masqueradeData) {
        tenantId = masqueradeData.tenantId;
      }
    } else {
      try {
        const db = await getDb();
        const user = await db.collection('users').findOne({ email: session.email });
        if (user && user.tenantId) {
          tenantId = user.tenantId;
        }
      } catch (e) {
        console.error('Dynamic tenant lookup failed, falling back:', e);
      }
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized tenant access' }, { status: 403 });
    }

    const db = await getDb();
    
    // Find order first to verify it belongs to this tenant
    const matchIds = [id.toString()];
    try {
      matchIds.push(new ObjectId(id.toString()));
    } catch (e) {}

    const order = await db.collection('orders').findOne({ _id: { $in: matchIds } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.tenantId.toString() !== tenantId.toString()) {
      return NextResponse.json({ error: 'Unauthorized tenant access to order' }, { status: 403 });
    }

    // Build update object
    const updateFields = { status, updatedAt: new Date() };
    if (deliveryMinutes !== undefined && deliveryMinutes !== null) {
      updateFields.deliveryMinutes = parseInt(deliveryMinutes);
    }

    const result = await db.collection('orders').updateOne(
      { _id: { $in: matchIds } },
      { $set: updateFields }
    );

    // Send status update notification to customer asynchronously
    try {
      const queryId = tenantId.toString();
      let tenant = await db.collection('tenants').findOne({ _id: queryId });
      if (!tenant) {
        try {
          tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
        } catch (e) {}
      }
      if (tenant) {
        // Fire and forget – don't block the response
        sendOrderStatusUpdateNotification(order, tenant, status, deliveryMinutes).catch(err => {
          console.error('Status notification error:', err);
        });
      }
    } catch (notifErr) {
      console.error('Error preparing status notification:', notifErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order status modification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

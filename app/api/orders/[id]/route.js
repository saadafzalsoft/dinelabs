import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'accepted', 'declined', 'completed'];
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

    const result = await db.collection('orders').updateOne(
      { _id: { $in: matchIds } },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order status modification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { sendOrderNotifications } from '@/lib/notifications';
import { checkIfStoreOpen } from '@/lib/timezone';

export async function POST(request) {
  try {
    const { tenantSlug, type, customer, items, subtotal, deliveryFee, total, language, notes } = await request.json();

    if (!tenantSlug || !type || !customer || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const db = await getDb();
    const tenant = await db.collection('tenants').findOne({ slug: tenantSlug.toLowerCase() });

    if (!tenant) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // 1. Subscription suspended checks
    if (tenant.status !== 'active') {
      return NextResponse.json({ error: 'This restaurant menu is currently browse-only (billing suspended).' }, { status: 403 });
    }

    // 2. Ordering mode enabled checks
    const modeKey = type === 'dine-in' ? 'dineIn' : type === 'pickup' ? 'pickup' : 'delivery';
    if (!tenant.enabledModes[modeKey]) {
      return NextResponse.json({ error: `Ordering via ${type} is not enabled for this restaurant.` }, { status: 403 });
    }

    // 3. Operating hours checks (evaluated in tenant local timezone)
    if (!checkIfStoreOpen(tenant.openingHours, tenant.country)) {
      return NextResponse.json({ error: 'This restaurant is currently closed. Ordering is disabled.' }, { status: 403 });
    }

    // Generate random 5 digit order number
    const orderNo = Math.floor(10000 + Math.random() * 90000);

    const newOrder = {
      _id: new ObjectId().toString(),
      tenantId: tenant._id.toString(),
      orderNo,
      status: 'pending',
      type,
      customer,
      items,
      subtotal: parseFloat(subtotal),
      deliveryFee: parseFloat(deliveryFee || 0),
      total: parseFloat(total),
      language: language || 'en',
      notes: notes || '',
      createdAt: new Date()
    };

    await db.collection('orders').insertOne(newOrder);

    // Dispatch notifications to configured manager alert channels asynchronously (non-blocking)
    sendOrderNotifications(newOrder, tenant).catch(notifErr => {
      console.error('Asynchronous notification dispatch error:', notifErr);
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: fetches orders for a specific tenant manager session (or masquerading session)
export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('dinelabs_session')?.value;
    const masqueradeCookie = request.cookies.get('dinelabs_masquerade')?.value;
    const session = verifyToken(sessionCookie);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let tenantId = session.tenantId;

    // Check if masquerading
    if (session.role === 'superadmin' && masqueradeCookie) {
      const masqueradeData = verifyToken(masqueradeCookie);
      if (masqueradeData) {
        tenantId = masqueradeData.tenantId;
      }
    } else if (!tenantId) {
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
      return NextResponse.json({ error: 'No tenant context found for session' }, { status: 400 });
    }

    const db = await getDb();
    const orders = await db.collection('orders')
      .find({ tenantId: tenantId.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Order fetching error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

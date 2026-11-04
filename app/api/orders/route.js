import { emitNewOrder } from '@/lib/orderEvents';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { sendOrderNotifications } from '@/lib/notifications';
import { checkIfStoreOpen } from '@/lib/timezone';
import { getClientIp, rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    // SECURITY: Limit order placement to 5 orders per 10 minutes per IP (Stops kitchen notification spamming)
    const MAX_ORDERS_PER_WINDOW = 5;
    const rl = rateLimit('orders_ip', clientIp, MAX_ORDERS_PER_WINDOW, 10 * 60);
    const rlHeaders = getRateLimitHeaders(rl, MAX_ORDERS_PER_WINDOW);

    if (!rl.allowed) {
      console.warn('[Security Alert] Order flood blocked for IP: ' + clientIp);
      return NextResponse.json(
        { error: 'You are placing orders too quickly. Please wait ' + Math.ceil(rl.retryAfter / 60) + ' minutes before submitting another order.' },
        { status: 429, headers: rlHeaders }
      );
    }

    const body = await request.json();
    const { tenantSlug, type, customer, items, subtotal, deliveryFee, total, language, notes, order_hp } = body;

    // SECURITY: Honeypot check for automated order bots
    if (order_hp) {
      console.warn('[Security Alert] Bot trapped in order placement honeypot from IP: ' + clientIp);
      return NextResponse.json(
        { error: 'Invalid order submission' },
        { status: 400, headers: rlHeaders }
      );
    }

    if (!tenantSlug || !type || !customer || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400, headers: rlHeaders });
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

    // Broadcast in real-time to mobile app and web manager stream
    emitNewOrder(tenant._id.toString(), newOrder);

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

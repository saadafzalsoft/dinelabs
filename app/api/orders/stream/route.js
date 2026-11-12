import { NextResponse } from 'next/server';
import { verifyToken, getSessionFromRequest, getMasqueradeFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { orderEvents } from '@/lib/orderEvents';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let tenantId = session.tenantId;

    if (session.role === 'superadmin') {
      const masqueradeData = getMasqueradeFromRequest(request);
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
        console.error('Dynamic tenant lookup failed for stream:', e);
      }
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant context found for session' }, { status: 400 });
    }

    const tid = String(tenantId);
    const encoder = new TextEncoder();
    let heartbeatTimer = null;
    let orderListener = null;

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connected event
        controller.enqueue(encoder.encode('event: connected\ndata: {"status":"connected"}\n\n'));

        // Keep-alive ping every 20 seconds to prevent proxy / NAT timeouts
        heartbeatTimer = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(':ping\n\n'));
          } catch (_) {
            clearInterval(heartbeatTimer);
          }
        }, 20000);

        // Listen for new orders for this specific tenant
        orderListener = (order) => {
          try {
            const payload = JSON.stringify(order);
            controller.enqueue(encoder.encode('event: new_order\ndata: ' + payload + '\n\n'));
          } catch (err) {
            console.error('SSE encode error:', err);
          }
        };

        orderEvents.on('order:' + tid, orderListener);
      },
      cancel() {
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        if (orderListener) orderEvents.off('order:' + tid, orderListener);
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Orders stream error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

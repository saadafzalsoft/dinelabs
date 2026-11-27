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

export async function GET(request) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const tid = tenantId.toString();
    const [notifs, tenant] = await Promise.all([
      db.collection('notifications').find({ tenantId: tid }).sort({ createdAt: -1 }).toArray().catch(() => []),
      db.collection('tenants').findOne({ _id: tid }),
    ]);

    if (notifs.length === 0 && tenant) {
      const storeName = tenant.restaurantName || tenant.name || 'your store';
      return NextResponse.json([
        {
          id: 'welcome-notif',
          type: 'welcome',
          title: `${storeName} is live on Dinelabs`,
          body: 'Your storefront, live order alerts, and menu management are active.',
          when: tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Active',
          unread: false,
        },
      ]);
    }

    return NextResponse.json(
      notifs.map((n) => ({
        id: n._id?.toString() || String(n.id),
        type: n.type || 'info',
        title: n.title || 'Notification',
        body: n.body || '',
        when: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '',
        unread: Boolean(n.unread),
      }))
    );
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const db = await getDb();
    const tid = tenantId.toString();

    if (body.markAll) {
      await db.collection('notifications').updateMany({ tenantId: tid }, { $set: { unread: false } });
    } else if (body.id) {
      await db.collection('notifications').updateOne({ _id: body.id, tenantId: tid }, { $set: { unread: false } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

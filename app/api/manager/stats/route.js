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
    const tid = tenantId.toString();

    const [orders, products, views] = await Promise.all([
      db.collection('orders').find({ tenantId: tid }).sort({ createdAt: -1 }).toArray(),
      db.collection('products').find({ tenantId: tid }).toArray(),
      db.collection('views').find({ tenantId: tid }).toArray().catch(() => []),
    ]);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - 6 * 86400000;
    const startOfMonth = startOfToday - 29 * 86400000;

    const validOrders = orders.filter((o) => !['declined', 'rejected', 'cancelled'].includes(o.status));

    const computePeriod = (sinceMs, bucketCount, bucketFn, labels) => {
      const subset = validOrders.filter((o) => new Date(o.createdAt).getTime() >= sinceMs);
      const sales = subset.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const count = subset.length;
      const avg = count ? sales / count : 0;
      const bars = new Array(bucketCount).fill(0);
      const topMap = new Map();

      for (const o of subset) {
        const idx = bucketFn(new Date(o.createdAt));
        if (idx >= 0 && idx < bucketCount) {
          bars[idx] += Number(o.total) || 0;
        }
        for (const it of o.items || []) {
          const name = getItemName(it);
          topMap.set(name, (topMap.get(name) || 0) + (Number(it.quantity || it.qty) || 1));
        }
      }

      const top = Array.from(topMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return {
        sales: Math.round(sales * 100) / 100,
        orders: count,
        avg: Math.round(avg * 100) / 100,
        prep: 18,
        views: views.length || count * 4,
        ch: { sales: 0, orders: 0, avg: 0, prep: 0, views: 0 },
        bars: bars.map((v) => Math.round(v * 100) / 100),
        labels,
        top,
      };
    };

    const today = computePeriod(
      startOfToday,
      12,
      (d) => Math.min(11, Math.max(0, Math.floor((d.getHours() - 10) / 1))),
      ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']
    );
    today.vs = 'today';

    const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const week = computePeriod(
      startOfWeek,
      7,
      (d) => (d.getDay() + 6) % 7,
      weekLabels
    );
    week.vs = 'last 7 days';

    const month = computePeriod(
      startOfMonth,
      4,
      (d) => Math.min(3, Math.floor((now.getTime() - d.getTime()) / (7 * 86400000))),
      ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']
    );
    month.vs = 'last 30 days';

    const totalValid = validOrders.length || 1;
    const deliveryN = validOrders.filter((o) => o.type === 'delivery').length;
    const pickupN = validOrders.filter((o) => o.type === 'pickup').length;
    const dineinN = validOrders.filter((o) => o.type === 'dine-in' || o.type === 'dinein').length;
    const split = {
      delivery: Math.round((deliveryN / totalValid) * 100),
      pickup: Math.round((pickupN / totalValid) * 100),
      dinein: Math.round((dineinN / totalValid) * 100),
    };

    // Product insights
    const productOrderCounts = new Map();
    for (const o of validOrders) {
      for (const it of o.items || []) {
        const name = getItemName(it);
        productOrderCounts.set(name, (productOrderCounts.get(name) || 0) + (Number(it.quantity || it.qty) || 1));
      }
    }

    const productInsights = products.slice(0, 6).map((p) => {
      const name = getItemName({ name: p.name });
      const ordered = productOrderCounts.get(name) || 0;
      const pViews = Math.max(ordered * 3, Number(p.views) || 0);
      const pct = pViews > 0 ? Math.min(100, Math.round((ordered / pViews) * 100)) : 0;
      return { id: p._id?.toString(), name, views: pViews, ordered, pct };
    });

    return NextResponse.json({
      stats: { today, week, month },
      top: { today: today.top, week: week.top, month: month.top },
      split,
      productInsights,
    });
  } catch (error) {
    console.error('Manager stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

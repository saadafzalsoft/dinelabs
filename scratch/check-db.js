import { getDb } from '../lib/db.js';

async function checkDb() {
  try {
    const db = await getDb();
    const tenants = await db.collection('tenants').find({}).toArray();
    console.log('Tenants in DB:');
    tenants.forEach(t => {
      console.log(JSON.stringify({
        _id: t._id,
        slug: t.slug,
        name: t.name,
        assignedNotifications: t.assignedNotifications,
        notifications: t.notifications,
        waitTimes: t.waitTimes,
        baseCurrency: t.baseCurrency
      }));
    });

    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(3).toArray();
    console.log('Last 3 Orders in DB:');
    orders.forEach(o => {
      console.log(JSON.stringify({
        _id: o._id,
        orderNo: o.orderNo,
        tenantId: o.tenantId,
        type: o.type,
        customer: o.customer,
        subtotal: o.subtotal,
        deliveryFee: o.deliveryFee,
        total: o.total,
        createdAt: o.createdAt
      }));
    });

  } catch (e) {
    console.error('DB query failed:', e);
  }
  process.exit(0);
}

checkDb();

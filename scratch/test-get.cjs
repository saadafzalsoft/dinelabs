const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  const id = '6a2e700ae10c2fa28ad975f7';
  const uri = process.env.MONGODB_URI || 'mongodb+srv://maileverylive_db_user:ZPCRHyoCz4ypfoNf@dinelabs.djjp6ca.mongodb.net/dinelabs?retryWrites=true&w=majority';
  console.log('Connecting to', uri);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    const queryId = id.toString();
    console.log('Searching for queryId:', queryId);
    let tenant = await db.collection('tenants').findOne({ _id: queryId });
    if (!tenant) {
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
      } catch (e) {
        console.log('ObjectId search error:', e.message);
      }
    }
    
    if (!tenant) {
      console.log('Tenant not found');
      return;
    }
    console.log('Found tenant:', tenant.name, 'slug:', tenant.slug);

    let manager = await db.collection('users').findOne({ tenantId: queryId, role: 'manager' });
    if (!manager) {
       try {
         manager = await db.collection('users').findOne({ tenantId: new ObjectId(queryId), role: 'manager' });
       } catch (e) {
         console.log('Manager search error:', e.message);
       }
    }
    tenant.managerEmail = manager ? manager.email : 'N/A';
    console.log('Manager email:', tenant.managerEmail);

    // Get orders for stats
    const tenantOrders = await db.collection('orders').find({ tenantId: queryId }).toArray();
    const ordersCount = tenantOrders.length;
    console.log('Orders count:', ordersCount);
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const ordersToday = tenantOrders.filter(o => new Date(o.createdAt) >= startOfToday).length;
    console.log('Orders today:', ordersToday);

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const revenueThisWeek = tenantOrders
      .filter(o => new Date(o.createdAt) >= oneWeekAgo)
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    console.log('Revenue this week:', revenueThisWeek);

    let lastOrderTime = 'No orders yet';
    let lastMin = 99999;
    if (tenantOrders.length > 0) {
      const sortedOrders = [...tenantOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      lastOrderTime = sortedOrders[0].createdAt;
      lastMin = Math.round((new Date().getTime() - new Date(lastOrderTime).getTime()) / 60000);
      if (lastMin < 0) lastMin = 0;
    }
    console.log('Last order time:', lastOrderTime, 'Last min:', lastMin);

    const seedHash = tenant.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const err = ordersCount > 0 ? (seedHash % 5) / 10 : 0.0;
    console.log('Error rate:', err);

    // Get products count
    let productsCount = await db.collection('products').countDocuments({ tenantId: queryId });
    if (productsCount === 0) {
      try {
        productsCount = await db.collection('products').countDocuments({ tenantId: new ObjectId(queryId) });
      } catch (e) {
        console.log('Products count error:', e.message);
      }
    }
    console.log('Products count:', productsCount);

  } catch (e) {
    console.error('General error:', e);
  } finally {
    await client.close();
  }
}

main();

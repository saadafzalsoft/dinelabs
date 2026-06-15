import { getDb } from '../lib/db.js';
import { verifyPassword, signToken } from '../lib/auth.js';
import { ObjectId } from 'mongodb';

async function testApi() {
  try {
    const db = await getDb();
    
    // Find manager user
    const user = await db.collection('users').findOne({ email: 'bartartine@manager.com' });
    if (!user) {
      console.log('Manager user bartartine@manager.com not found!');
      process.exit(1);
    }
    
    console.log('User found:', user);
    
    // Resolve tenantId
    let tenantId = user.tenantId;
    console.log('User tenantId:', tenantId);
    
    // Check if tenant exists
    const matchIds = [tenantId.toString()];
    try {
      matchIds.push(new ObjectId(tenantId.toString()));
    } catch (e) {}
    
    const tenant = await db.collection('tenants').findOne({ _id: { $in: matchIds } });
    console.log('Tenant found:', tenant);
    
    // Test converting to ObjectId for query
    try {
      const oid = new ObjectId(tenantId.toString());
      console.log('Successfully created ObjectId:', oid);
      const tenantByOid = await db.collection('tenants').findOne({ _id: oid });
      console.log('Tenant found by ObjectId:', tenantByOid);
    } catch (err) {
      console.error('Failed to query by ObjectId:', err);
    }
    
  } catch (err) {
    console.error('Error during test:', err);
  }
  process.exit(0);
}

testApi();

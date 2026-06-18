const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://maileverylive_db_user:ZPCRHyoCz4ypfoNf@dinelabs.djjp6ca.mongodb.net/dinelabs?retryWrites=true&w=majority';
  console.log('Connecting to', uri);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    const tenants = await db.collection('tenants').find({}).toArray();
    console.log('--- TENANTS ---');
    console.log(tenants.map(t => ({ _id: t._id, slug: t.slug, name: t.name, logoUrl: t.logoUrl ? t.logoUrl.substring(0, 50) + '...' : '' })));
    
    const users = await db.collection('users').find({}).toArray();
    console.log('--- USERS ---');
    console.log(users.map(u => ({ email: u.email, role: u.role, tenantId: u.tenantId })));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();

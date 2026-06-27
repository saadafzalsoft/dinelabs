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
    console.log(JSON.stringify(tenants, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();

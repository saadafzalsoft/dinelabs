import { MongoClient } from 'mongodb';

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dinelabs';
  console.log('Connecting to', uri);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const tenants = await db.collection('tenants').find({}).toArray();
    console.log('--- TENANTS ---');
    console.log(tenants.map(t => ({ _id: t._id, slug: t.slug, name: t.name })));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();

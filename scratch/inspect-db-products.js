import { getDb } from '../lib/db.js';

async function run() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find({}).toArray();
    console.log('--- PRODUCTS IN DB ---');
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();

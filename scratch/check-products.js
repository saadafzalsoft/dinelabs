import { getDb } from '../lib/db.js';

async function checkProducts() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find({}).toArray();
    console.log(`Total products: ${products.length}`);
    products.forEach(p => {
      const imgLen = p.imageUrl ? p.imageUrl.length : 0;
      console.log(`Product: ${p.name?.en || 'N/A'}, Price: ${p.price}, Image Length: ${imgLen} chars (${Math.round(imgLen / 1024)} KB)`);
    });
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit(0);
}

checkProducts();

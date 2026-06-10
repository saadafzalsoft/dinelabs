import { getDb } from '../lib/db.js';

async function optimizeImages() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find({}).toArray();
    console.log(`Analyzing ${products.length} products...`);

    let updatedCount = 0;
    for (const p of products) {
      if (p.imageUrl && p.imageUrl.startsWith('data:image') && p.imageUrl.length > 50000) {
        // Image is a large base64 string (>50KB)
        let newUrl = '/assets/cheese_pizza.png'; // fallback default
        const name = (p.name?.en || '').toLowerCase();

        if (name.includes('water')) {
          newUrl = '/assets/water.png';
        } else if (name.includes('coke') || name.includes('cola') || name.includes('coca')) {
          newUrl = '/assets/coke.png';
        } else if (name.includes('pep')) {
          newUrl = '/assets/pep_pizza.png';
        } else if (name.includes('pasta')) {
          newUrl = '/assets/flatzz.png';
        } else if (name.includes('veg')) {
          newUrl = '/assets/veg_pizza.png';
        } else if (name.includes('chicken')) {
          newUrl = '/assets/chicken_sticks.png';
        }

        console.log(`Optimizing: "${p.name?.en}" -> Replacing large base64 (${Math.round(p.imageUrl.length / 1024)} KB) with "${newUrl}"`);
        await db.collection('products').updateOne(
          { _id: p._id },
          { $set: { imageUrl: newUrl } }
        );
        updatedCount++;
      }
    }
    console.log(`Migration complete. Optimized ${updatedCount} products.`);
  } catch (e) {
    console.error('Error during migration:', e);
  }
  process.exit(0);
}

optimizeImages();

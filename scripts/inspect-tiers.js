import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Parse .env manually
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.log("No .env file found");
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dinelabs';

async function main() {
  console.log('Connecting to', MONGODB_URI.substring(0, 50) + '...');
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    
    const tiers = await db.collection('tiers').find({}).toArray();
    console.log('--- TIERS IN DB ---');
    console.log(JSON.stringify(tiers, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();

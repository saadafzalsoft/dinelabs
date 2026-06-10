import fs from 'fs';
import path from 'path';

// Parse .env first to ensure environment variables are set before db.js is imported
try {
  const envPath = '/Users/apple/Documents/dinelabs/.env';
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
  console.error('Failed reading .env file:', e);
}

// Now import db.js
const { getDb } = await import('../lib/db.js');

async function run() {
  try {
    const db = await getDb();
    
    // Update bartartine
    const res1 = await db.collection('tenants').updateOne(
      { slug: 'bartartine' },
      {
        $set: {
          address: 'Mar Mikhael, Beirut, Lebanon',
          googleMapsLink: 'https://maps.google.com/?q=Mar+Mikhael+Beirut+Lebanon',
          deliveryFee: 15000,
          assignedNotifications: { email: true, whatsapp: true, telegram: true }
        }
      }
    );
    console.log('Updated bar tartine tenant:', res1.modifiedCount);

    // Update kfc
    const res2 = await db.collection('tenants').updateOne(
      { slug: 'kfc' },
      {
        $set: {
          address: 'Hamra Street, Beirut, Lebanon',
          googleMapsLink: 'https://maps.google.com/?q=Hamra+Street+Beirut+Lebanon',
          deliveryFee: 3.50,
          assignedNotifications: { email: true, whatsapp: true, telegram: true }
        }
      }
    );
    console.log('Updated KFC tenant:', res2.modifiedCount);

    // Update kabajees
    const res3 = await db.collection('tenants').updateOne(
      { slug: 'kabajees' },
      {
        $set: {
          address: 'Main Boulevard, Gulberg, Lahore, Pakistan',
          googleMapsLink: 'https://maps.google.com/?q=Main+Boulevard+Gulberg+Lahore+Pakistan',
          deliveryFee: 2.00,
          assignedNotifications: { email: true, whatsapp: true, telegram: true }
        }
      }
    );
    console.log('Updated Kabab jees tenant:', res3.modifiedCount);

  } catch (e) {
    console.error('Update failed:', e);
  }
  process.exit(0);
}

run();

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

async function checkSuperAdmin(request) {
  const sessionCookie = request.cookies.get('dinelabs_session')?.value;
  const session = verifyToken(sessionCookie);
  return session && session.role === 'superadmin';
}

const TIERS_SEED = [
  { _id: 't1', name: 'Tier 1', tag: 'Starter', price: 29, priceAnnual: 290, lv: 1,
    caps: { maxProducts: 30, maxTables: 6, maxTranslations: 1, langs: ['en', 'ar', 'ka', 'ru'],
            modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, telegram: 0 } } },
  { _id: 't2', name: 'Tier 2', tag: 'Pro', price: 79, priceAnnual: 790, lv: 2,
    caps: { maxProducts: 150, maxTables: 20, maxTranslations: 3, langs: ['en', 'ar', 'ka', 'ru', 'es', 'fr', 'de', 'it'],
            modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, telegram: 0 } } },
  { _id: 't3', name: 'Tier 3', tag: 'Enterprise', price: 199, priceAnnual: 1990, lv: 3,
    caps: { maxProducts: 0, maxTables: 0, maxTranslations: 8, langs: ['en', 'ar', 'ka', 'ru', 'es', 'fr', 'de', 'it'],
            modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, telegram: 1 } } },
];

export async function GET(request) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDb();
    let tiers = await db.collection('tiers').find({}).toArray();
    
    // Seed tiers if empty
    if (tiers.length === 0) {
      await db.collection('tiers').insertMany(TIERS_SEED);
      tiers = await db.collection('tiers').find({}).toArray();
    }

    // Restore language pools and maxTables on existing seeded tiers
    for (const t of TIERS_SEED) {
      await db.collection('tiers').updateOne(
        { _id: t._id },
        { $set: { 'caps.langs': t.caps.langs, 'caps.maxTables': t.caps.maxTables } }
      );
    }

    // Refresh tiers array to reflect DB updates
    tiers = await db.collection('tiers').find({}).toArray();

    return NextResponse.json({ tiers });
  } catch (error) {
    console.error('Super tiers GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, tag, price, priceAnnual, caps, lv } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = await getDb();
    
    const newTier = {
      _id: 't_' + Date.now().toString(36),
      name,
      tag: tag || 'Custom',
      price: parseFloat(price) || 0,
      priceAnnual: parseFloat(priceAnnual) || 0,
      lv: parseInt(lv) || 1,
      caps: caps || {
        maxProducts: 30,
        maxTables: 10,
        maxTranslations: 1,
        langs: ['en'],
        modes: { delivery: 0, pickup: 1, dinein: 0 },
        channels: { email: 1, telegram: 0 }
      },
      createdAt: new Date()
    };

    await db.collection('tiers').insertOne(newTier);

    return NextResponse.json({ success: true, tier: newTier });
  } catch (error) {
    console.error('Super tiers POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

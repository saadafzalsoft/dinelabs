import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { slug, pushToken } = await request.json();
    if (!slug || !pushToken) {
      return NextResponse.json({ error: 'slug and pushToken required' }, { status: 400 });
    }

    const cleanSlug = String(slug).trim().toLowerCase();
    const cleanToken = String(pushToken).trim();

    const db = await getDb();
    const result = await db.collection('tenants').updateOne(
      { slug: cleanSlug },
      { $addToSet: { pushTokens: cleanToken } }
    );

    console.log('[Push Token API] Registered token for ' + cleanSlug + ', matched: ' + result.matchedCount + ', modified: ' + result.modifiedCount);

    return NextResponse.json({
      success: true,
      registered: cleanToken,
      matched: result.matchedCount
    });
  } catch (err) {
    console.error('[Push Token API] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

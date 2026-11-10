import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cleanSlug, validateSlug, generateSlugSuggestions } from '@/lib/slug';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSlug = searchParams.get('slug') || '';

    const cleaned = cleanSlug(rawSlug);

    // 1. Validate format & reserved words
    const validation = validateSlug(cleaned);

    const db = await getDb();

    // Helper to check if a candidate slug exists in DB or is reserved
    const checkIsTaken = async (candidate) => {
      const v = validateSlug(candidate);
      if (!v.valid) return true;
      const match = await db.collection('tenants').findOne({ slug: candidate });
      return !!match;
    };

    if (!validation.valid) {
      // If reserved, offer alternative suggestions
      let suggestions = [];
      if (validation.reason === 'reserved') {
        suggestions = await generateSlugSuggestions(cleaned || rawSlug, checkIsTaken, 3);
      }

      return NextResponse.json({
        available: false,
        slug: cleaned,
        reason: validation.reason,
        error: validation.error,
        suggestions
      });
    }

    // 2. Check database for existing tenant with this slug
    const existingTenant = await db.collection('tenants').findOne({ slug: cleaned });

    if (existingTenant) {
      const suggestions = await generateSlugSuggestions(cleaned, checkIsTaken, 3);
      return NextResponse.json({
        available: false,
        slug: cleaned,
        reason: 'taken',
        error: `The storefront link 'dinelabs.co/${cleaned}' is already taken.`,
        suggestions
      });
    }

    // 3. Slug is available and valid
    return NextResponse.json({
      available: true,
      slug: cleaned
    });
  } catch (error) {
    console.error('Check slug error:', error);
    return NextResponse.json(
      { error: 'Failed to verify storefront link availability.' },
      { status: 500 }
    );
  }
}


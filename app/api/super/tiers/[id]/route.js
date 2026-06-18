import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

async function checkSuperAdmin(request) {
  const sessionCookie = request.cookies.get('dinelabs_session')?.value;
  const session = verifyToken(sessionCookie);
  return session && session.role === 'superadmin';
}

export async function PUT(request, { params }) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const { name, tag, price, priceAnnual, caps, lv } = await request.json();

    const db = await getDb();
    
    const updateObj = {};
    if (name !== undefined) updateObj.name = name;
    if (tag !== undefined) updateObj.tag = tag;
    if (price !== undefined) updateObj.price = parseFloat(price);
    if (priceAnnual !== undefined) updateObj.priceAnnual = parseFloat(priceAnnual);
    if (caps !== undefined) updateObj.caps = caps;
    if (lv !== undefined) updateObj.lv = parseInt(lv);

    const result = await db.collection('tiers').updateOne(
      { _id: id },
      { $set: updateObj }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Super tier PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDb();

    // Check how many tiers we have. Keep at least one tier.
    const tierCount = await db.collection('tiers').countDocuments({});
    if (tierCount <= 1) {
      return NextResponse.json({ error: 'Cannot delete the only tier on the platform.' }, { status: 400 });
    }

    // Find a fallback tier (first tier that is not this one)
    const fallbackTier = await db.collection('tiers').findOne({ _id: { $ne: id } });
    if (!fallbackTier) {
      return NextResponse.json({ error: 'Fallback tier not found' }, { status: 500 });
    }

    // Move any tenants on the deleted tier to the fallback tier
    // Since some tenant tier IDs could be string (like 't1', 't2' or '1', '2'), we'll update both integer and string references
    let tierValToUpdate;
    if (id === 't1' || id === '1') {
      // Check if we need to map string/numeric representations
      await db.collection('tenants').updateMany(
        { tier: { $in: [1, '1', 't1'] } },
        { $set: { tier: fallbackTier._id } }
      );
    } else if (id === 't2' || id === '2') {
      await db.collection('tenants').updateMany(
        { tier: { $in: [2, '2', 't2'] } },
        { $set: { tier: fallbackTier._id } }
      );
    } else if (id === 't3' || id === '3') {
      await db.collection('tenants').updateMany(
        { tier: { $in: [3, '3', 't3'] } },
        { $set: { tier: fallbackTier._id } }
      );
    } else {
      await db.collection('tenants').updateMany(
        { tier: id },
        { $set: { tier: fallbackTier._id } }
      );
    }

    // Delete the tier
    await db.collection('tiers').deleteOne({ _id: id });

    return NextResponse.json({ success: true, fallbackTo: fallbackTier._id });
  } catch (error) {
    console.error('Super tier DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

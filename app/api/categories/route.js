import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { createTranslationMap } from '@/lib/translate';
import { ObjectId } from 'mongodb';

async function getAuthorizedTenantId(request) {
  const sessionCookie = request.cookies.get('dinelabs_session')?.value;
  const masqueradeCookie = request.cookies.get('dinelabs_masquerade')?.value;
  const session = verifyToken(sessionCookie);

  if (!session) return null;
  if (session.role === 'superadmin' && masqueradeCookie) {
    const masqueradeData = verifyToken(masqueradeCookie);
    return masqueradeData ? masqueradeData.tenantId : null;
  }

  if (session.tenantId) {
    return session.tenantId;
  }

  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: session.email });
    if (user && user.tenantId) {
      return user.tenantId;
    }
  } catch (e) {
    console.error('Dynamic tenant lookup failed, falling back:', e);
  }

  return session.tenantId;
}

export async function GET(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const categories = await db.collection('categories')
      .find({ tenantId: tenantId.toString() })
      .sort({ order: 1 })
      .toArray();

    const response = NextResponse.json(categories);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('Categories API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, lang = 'en' } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const db = await getDb();

    // Check count for Tier 1 limits (Tier 1 limit: e.g., max 5 categories)
    const queryId = tenantId.toString();
    let tenant = await db.collection('tenants').findOne({ _id: queryId });
    if (!tenant) {
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
      } catch (e) {}
    }
    if (tenant && tenant.tier === 1) {
      const count = await db.collection('categories').countDocuments({ tenantId: tenantId.toString() });
      if (count >= 5) {
        return NextResponse.json({ error: 'Category limit reached. Tier 1 is limited to 5 categories. Upgrade to Tier 2 for unlimited capacity.' }, { status: 403 });
      }
    }

    const tenantLangs = tenant?.languages || ['en', 'ar'];
    const nameMap = await createTranslationMap(name, tenantLangs, lang);
    
    // Get highest order
    const categories = await db.collection('categories')
      .find({ tenantId: tenantId.toString() })
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const nextOrder = categories.length > 0 ? (categories[0].order + 1) : 0;

    const newCategory = {
      _id: new ObjectId().toString(),
      tenantId: tenantId.toString(),
      name: nameMap,
      order: nextOrder,
      isPinned: false,
      createdAt: new Date(),
    };

    await db.collection('categories').insertOne(newCategory);
    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Categories API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, isPinned, order, reorderedIds, lang = 'en' } = body;

    const db = await getDb();

    // Support drag and drop drag reordering of multiple categories at once
    if (reorderedIds && Array.isArray(reorderedIds)) {
      const promises = reorderedIds.map((cId, idx) => {
        return db.collection('categories').updateOne(
          { _id: cId.toString(), tenantId: tenantId.toString() },
          { $set: { order: idx } }
        );
      });
      await Promise.all(promises);
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await db.collection('categories').findOne({ _id: id.toString(), tenantId: tenantId.toString() });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const queryId = tenantId.toString();
    let tenant = await db.collection('tenants').findOne({ _id: queryId });
    if (!tenant) {
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
      } catch (e) {}
    }
    const tenantLangs = tenant?.languages || ['en', 'ar'];

    const updateObj = {};
    if (name !== undefined) {
      updateObj.name = await createTranslationMap(name, tenantLangs, lang);
    }
    if (isPinned !== undefined) {
      // Pinned Category Feature: Staff can star a single category. The starred category is pinned to the top.
      if (isPinned === true) {
        // Unpin all other categories for this tenant first! Only one category can be pinned at a time.
        await db.collection('categories').updateMany(
          { tenantId: tenantId.toString() },
          { $set: { isPinned: false } }
        );
      }
      updateObj.isPinned = isPinned;
    }
    if (order !== undefined) {
      updateObj.order = parseInt(order);
    }

    await db.collection('categories').updateOne(
      { _id: id.toString(), tenantId: tenantId.toString() },
      { $set: updateObj }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Categories API PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const db = await getDb();

    // Delete category
    await db.collection('categories').deleteOne({ _id: id.toString(), tenantId: tenantId.toString() });

    // Also pull this category ID from all products categories arrays!
    await db.collection('products').updateMany(
      { tenantId: tenantId.toString(), categories: id.toString() },
      { $pull: { categories: id.toString() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Categories API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const products = await db.collection('products')
      .find({ tenantId: tenantId.toString() })
      .sort({ order: 1 })
      .toArray();

    const response = NextResponse.json(products);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('Products API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, discountedPrice, imageUrl, categories, modifierGroups, isFeatured, variations, addons, removals, lang = 'en' } = await request.json();

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const db = await getDb();

    // Check for duplicate product names (case-insensitive across all languages)
    const nameLower = name.trim().toLowerCase();
    const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const escapedName = escapeRegex(nameLower);

    const existingProduct = await db.collection('products').findOne({
      tenantId: tenantId.toString(),
      $or: [
        { "name.en": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        { "name.ar": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        { "name.ru": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        { "name.es": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        { "name.fr": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        { "name.de": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        { "name.it": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        { "name.ka": { $regex: new RegExp(`^${escapedName}$`, 'i') } }
      ]
    });

    if (existingProduct) {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }

    // Check count for Tier limits (Tier 1 limit: e.g., max 15 products)
    const queryId = tenantId.toString();
    let tenant = await db.collection('tenants').findOne({ _id: queryId });
    if (!tenant) {
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
      } catch (e) {}
    }

    const tenantLangs = tenant?.languages || ['en', 'ar'];

    // Auto translate text on creation
    const nameMap = await createTranslationMap(name, tenantLangs, lang);
    const descMap = await createTranslationMap(description || '', tenantLangs, lang);

    const processOptionsWithTranslations = async (optionsList) => {
      if (!optionsList || !Array.isArray(optionsList)) return [];
      const processed = [];
      for (const opt of optionsList) {
        const nameMap = typeof opt.name === 'string' ? await createTranslationMap(opt.name, tenantLangs, lang) : opt.name;
        processed.push({
          name: nameMap,
          price: opt.price !== undefined ? parseFloat(opt.price) : 0
        });
      }
      return processed;
    };

    const processRemovalsWithTranslations = async (removalsList) => {
      if (!removalsList || !Array.isArray(removalsList)) return [];
      const processed = [];
      for (const opt of removalsList) {
        const nameMap = typeof opt.name === 'string' ? await createTranslationMap(opt.name, tenantLangs, lang) : opt.name;
        processed.push({ name: nameMap });
      }
      return processed;
    };
    if (tenant) {
      const tierObj = await db.collection('tiers').findOne({
        $or: [
          { _id: 't' + tenant.tier },
          { _id: tenant.tier },
          { lv: parseInt(tenant.tier) },
          { lv: tenant.tier }
        ]
      });
      if (tierObj && tierObj.caps && tierObj.caps.maxProducts !== undefined && tierObj.caps.maxProducts > 0) {
        const count = await db.collection('products').countDocuments({ tenantId: tenantId.toString() });
        if (count >= tierObj.caps.maxProducts) {
          return NextResponse.json({ error: `Product limit reached. Your tier is limited to ${tierObj.caps.maxProducts} products. Please upgrade your tier for more capacity.` }, { status: 403 });
        }
      }
    }

    const newProduct = {
      _id: new ObjectId().toString(),
      tenantId: tenantId.toString(),
      name: nameMap,
      description: descMap,
      price: parseFloat(price),
      imageUrl: imageUrl || '',
      categories: categories || [],
      modifierGroups: modifierGroups || [],
      isAvailable: true,
      isFeatured: !!isFeatured,
      variations: await processOptionsWithTranslations(variations),
      addons: await processOptionsWithTranslations(addons),
      removals: await processRemovalsWithTranslations(removals),
      discountedPrice: parseFloat(discountedPrice) || 0,
      order: 99,
      createdAt: new Date(),
    };

    await db.collection('products').insertOne(newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Products API POST error:', error);
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
    const { id, isBulkAction, productIds, isAvailable, categories, reorderedIds, lang = 'en' } = body;

    const db = await getDb();

    // Support drag and drop reordering of multiple products at once
    if (reorderedIds && Array.isArray(reorderedIds)) {
      const promises = reorderedIds.map((pId, idx) => {
        const matchIds = [pId.toString()];
        try {
          matchIds.push(new ObjectId(pId.toString()));
        } catch (e) {}
        return db.collection('products').updateOne(
          { _id: { $in: matchIds }, tenantId: tenantId.toString() },
          { $set: { order: idx } }
        );
      });
      await Promise.all(promises);
      return NextResponse.json({ success: true });
    }

    // Handle Bulk mutations
    if (isBulkAction && Array.isArray(productIds)) {
      const updateQuery = {};
      if (isAvailable !== undefined) {
        updateQuery.isAvailable = isAvailable;
      }
      if (categories !== undefined) {
        updateQuery.categories = categories;
      }

      const bulkIds = [];
      for (const pId of productIds) {
        bulkIds.push(pId.toString());
        try {
          bulkIds.push(new ObjectId(pId.toString()));
        } catch (e) {}
      }

      await db.collection('products').updateMany(
        {
          _id: { $in: bulkIds },
          tenantId: tenantId.toString()
        },
        { $set: updateQuery }
      );

      return NextResponse.json({ success: true });
    }

    // Handle Single Product mutations
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const matchIds = [id.toString()];
    try {
      matchIds.push(new ObjectId(id.toString()));
    } catch (e) {}

    const product = await db.collection('products').findOne({ _id: { $in: matchIds }, tenantId: tenantId.toString() });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const tenantQueryId = tenantId.toString();
    let tenant = await db.collection('tenants').findOne({ _id: tenantQueryId });
    if (!tenant) {
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(tenantQueryId) });
      } catch (e) {}
    }
    const tenantLangs = tenant?.languages || ['en', 'ar'];

    const processOptionsWithTranslations = async (optionsList) => {
      if (!optionsList || !Array.isArray(optionsList)) return [];
      const processed = [];
      for (const opt of optionsList) {
        let nameMap;
        if (typeof opt.name === 'object' && opt.name !== null && (opt.name[lang] || opt.name.en || opt.name.ar)) {
          nameMap = opt.name;
        } else {
          nameMap = typeof opt.name === 'string' ? await createTranslationMap(opt.name, tenantLangs, lang) : opt.name;
        }
        processed.push({
          name: nameMap,
          price: opt.price !== undefined ? parseFloat(opt.price) : 0
        });
      }
      return processed;
    };

    const processRemovalsWithTranslations = async (removalsList) => {
      if (!removalsList || !Array.isArray(removalsList)) return [];
      const processed = [];
      for (const opt of removalsList) {
        let nameMap;
        if (typeof opt.name === 'object' && opt.name !== null && (opt.name[lang] || opt.name.en || opt.name.ar)) {
          nameMap = opt.name;
        } else {
          nameMap = typeof opt.name === 'string' ? await createTranslationMap(opt.name, tenantLangs, lang) : opt.name;
        }
        processed.push({ name: nameMap });
      }
      return processed;
    };

    const updateObj = {};
    if (body.name !== undefined) {
      // Check for duplicate product names (case-insensitive across all languages)
      const nameLower = body.name.trim().toLowerCase();
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const escapedName = escapeRegex(nameLower);

      const existingProduct = await db.collection('products').findOne({
        _id: { $nin: matchIds }, // Exclude the product being edited
        tenantId: tenantId.toString(),
        $or: [
          { "name.en": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { "name.ar": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { "name.ru": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { "name.es": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { "name.fr": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { "name.de": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { "name.it": { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { "name.ka": { $regex: new RegExp(`^${escapedName}$`, 'i') } }
        ]
      });

      if (existingProduct) {
        return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
      }

      updateObj.name = await createTranslationMap(body.name, tenantLangs, lang);
    }
    if (body.description !== undefined) {
      updateObj.description = await createTranslationMap(body.description || '', tenantLangs, lang);
    }
    if (body.price !== undefined) {
      updateObj.price = parseFloat(body.price);
    }
    if (body.imageUrl !== undefined) {
      updateObj.imageUrl = body.imageUrl;
    }
    if (body.isAvailable !== undefined) {
      updateObj.isAvailable = body.isAvailable;
    }
    if (body.isFeatured !== undefined) {
      updateObj.isFeatured = !!body.isFeatured;
    }
    if (body.variations !== undefined) {
      updateObj.variations = await processOptionsWithTranslations(body.variations);
    }
    if (body.addons !== undefined) {
      updateObj.addons = await processOptionsWithTranslations(body.addons);
    }
    if (body.removals !== undefined) {
      updateObj.removals = await processRemovalsWithTranslations(body.removals);
    }
    if (body.categories !== undefined) {
      updateObj.categories = body.categories;
    }
    if (body.modifierGroups !== undefined) {
      updateObj.modifierGroups = body.modifierGroups;
    }
    if (body.order !== undefined) {
      updateObj.order = parseInt(body.order);
    }
    if (body.discountedPrice !== undefined) {
      updateObj.discountedPrice = parseFloat(body.discountedPrice) || 0;
    }

    await db.collection('products').updateOne(
      { _id: { $in: matchIds }, tenantId: tenantId.toString() },
      { $set: updateObj }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Products API PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, productIds, isBulkAction } = await request.json();
    const db = await getDb();

    if (isBulkAction && Array.isArray(productIds)) {
      const bulkIds = [];
      for (const pId of productIds) {
        bulkIds.push(pId.toString());
        try {
          bulkIds.push(new ObjectId(pId.toString()));
        } catch (e) {}
      }
      await db.collection('products').deleteMany({
        _id: { $in: bulkIds },
        tenantId: tenantId.toString()
      });
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const matchIds = [id.toString()];
    try {
      matchIds.push(new ObjectId(id.toString()));
    } catch (e) {}

    await db.collection('products').deleteOne({ _id: { $in: matchIds }, tenantId: tenantId.toString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Products API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

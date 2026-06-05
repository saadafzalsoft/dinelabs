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

    return NextResponse.json(products);
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

    const { name, description, price, imageUrl, categories, modifierGroups } = await request.json();

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    // Auto translate text on creation
    const nameMap = await createTranslationMap(name);
    const descMap = await createTranslationMap(description || '');

    const db = await getDb();

    // Check count for Tier limits (Tier 1 limit: e.g., max 15 products)
    const tenant = await db.collection('tenants').findOne({ _id: new ObjectId(tenantId.toString()) });
    if (tenant && tenant.tier === 1) {
      const count = await db.collection('products').countDocuments({ tenantId: tenantId.toString() });
      if (count >= 15) {
        return NextResponse.json({ error: 'Product limit reached. Tier 1 is limited to 15 products. Upgrade to Tier 2 for unlimited capacity.' }, { status: 403 });
      }
    }

    const newProduct = {
      _id: new ObjectId().toString(),
      tenantId: tenantId.toString(),
      name: nameMap,
      description: descMap,
      price: parseFloat(price),
      imageUrl: imageUrl || '/assets/cheese_pizza.png',
      categories: categories || [],
      modifierGroups: modifierGroups || [],
      isAvailable: true,
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
    const { id, isBulkAction, productIds, isAvailable, categories } = body;

    const db = await getDb();

    // Handle Bulk mutations
    if (isBulkAction && Array.isArray(productIds)) {
      const updateQuery = {};
      if (isAvailable !== undefined) {
        updateQuery.isAvailable = isAvailable;
      }
      if (categories !== undefined) {
        updateQuery.categories = categories;
      }

      await db.collection('products').updateMany(
        {
          _id: { $in: productIds.map(pId => pId.toString()) },
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

    const product = await db.collection('products').findOne({ _id: id.toString(), tenantId: tenantId.toString() });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updateObj = {};
    if (body.name !== undefined) {
      updateObj.name = await createTranslationMap(body.name);
    }
    if (body.description !== undefined) {
      updateObj.description = await createTranslationMap(body.description || '');
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
    if (body.categories !== undefined) {
      updateObj.categories = body.categories;
    }
    if (body.modifierGroups !== undefined) {
      updateObj.modifierGroups = body.modifierGroups;
    }
    if (body.order !== undefined) {
      updateObj.order = parseInt(body.order);
    }

    await db.collection('products').updateOne(
      { _id: id.toString(), tenantId: tenantId.toString() },
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
      await db.collection('products').deleteMany({
        _id: { $in: productIds.map(pId => pId.toString()) },
        tenantId: tenantId.toString()
      });
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await db.collection('products').deleteOne({ _id: id.toString(), tenantId: tenantId.toString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Products API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

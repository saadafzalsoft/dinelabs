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
    const modifierGroups = await db.collection('modifierGroups')
      .find({ tenantId: tenantId.toString() })
      .toArray();

    return NextResponse.json(modifierGroups);
  } catch (error) {
    console.error('ModifierGroups API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, options } = await request.json();

    if (!name || !type || !options || !Array.isArray(options)) {
      return NextResponse.json({ error: 'Name, type, and options are required' }, { status: 400 });
    }

    // Auto-translate name and option names
    const nameMap = await createTranslationMap(name);
    const translatedOptions = [];
    for (const opt of options) {
      const optNameMap = await createTranslationMap(opt.name);
      translatedOptions.push({
        name: optNameMap,
        price: parseFloat(opt.price) || 0.00
      });
    }

    const db = await getDb();
    const newGroup = {
      _id: new ObjectId().toString(),
      tenantId: tenantId.toString(),
      name: nameMap,
      type,
      options: translatedOptions,
      createdAt: new Date()
    };

    await db.collection('modifierGroups').insertOne(newGroup);
    return NextResponse.json({ success: true, modifierGroup: newGroup });
  } catch (error) {
    console.error('ModifierGroups API POST error:', error);
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
    const { id, name, type, options } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const db = await getDb();
    const group = await db.collection('modifierGroups').findOne({
      _id: id.toString(),
      tenantId: tenantId.toString()
    });

    if (!group) {
      return NextResponse.json({ error: 'Modifier group not found' }, { status: 404 });
    }

    const updateObj = {};
    if (name !== undefined) {
      updateObj.name = await createTranslationMap(name);
    }
    if (type !== undefined) {
      updateObj.type = type;
    }
    if (options !== undefined && Array.isArray(options)) {
      const translatedOptions = [];
      for (const opt of options) {
        // Option name might be a map or a plain string
        let optNameMap;
        if (typeof opt.name === 'object' && opt.name !== null && (opt.name.en || opt.name.ar)) {
          // Keep existing translation map or just use it
          optNameMap = opt.name;
        } else {
          optNameMap = await createTranslationMap(opt.name);
        }
        translatedOptions.push({
          name: optNameMap,
          price: parseFloat(opt.price) || 0.00
        });
      }
      updateObj.options = translatedOptions;
    }

    await db.collection('modifierGroups').updateOne(
      { _id: id.toString(), tenantId: tenantId.toString() },
      { $set: updateObj }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ModifierGroups API PUT error:', error);
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
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const db = await getDb();

    // 1. Delete the modifier group
    await db.collection('modifierGroups').deleteOne({
      _id: id.toString(),
      tenantId: tenantId.toString()
    });

    // 2. Remove reference from products
    await db.collection('products').updateMany(
      { tenantId: tenantId.toString() },
      { $pull: { modifierGroups: id.toString() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ModifierGroups API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

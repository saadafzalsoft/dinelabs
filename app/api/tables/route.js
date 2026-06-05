import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// GET: fetches all tables. Can be requested by customer (public slug query) or manager (auth session)
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const tenantSlug = url.searchParams.get('tenantSlug');
    
    const db = await getDb();
    let tenantId = null;

    if (tenantSlug) {
      const tenant = await db.collection('tenants').findOne({ slug: tenantSlug.toLowerCase() });
      if (tenant) {
        tenantId = tenant._id.toString();
      }
    } else {
      tenantId = await getAuthorizedTenantId(request);
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant context is required' }, { status: 400 });
    }

    const tables = await db.collection('tables')
      .find({ tenantId: tenantId.toString() })
      .toArray();

    return NextResponse.json(tables);
  } catch (error) {
    console.error('Tables API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Manager adds a table with name, chairs, and location/placement
export async function POST(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, chairs, location, x, y, shape, view } = await request.json();

    if (!name || !chairs || !location) {
      return NextResponse.json({ error: 'Missing required table details' }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if table name already exists for this tenant
    const existingTable = await db.collection('tables').findOne({ 
      tenantId: tenantId.toString(), 
      name: name.trim() 
    });

    if (existingTable) {
      return NextResponse.json({ error: 'Table code already exists' }, { status: 400 });
    }

    const newTable = {
      _id: new ObjectId().toString(),
      tenantId: tenantId.toString(),
      name: name.trim(),
      chairs: parseInt(chairs),
      location: location.trim(),
      x: x !== undefined ? parseFloat(x) : 50,
      y: y !== undefined ? parseFloat(y) : 50,
      shape: shape || 'square',
      view: view || 'Regular',
      isBooked: false,
      createdAt: new Date()
    };

    await db.collection('tables').insertOne(newTable);
    return NextResponse.json({ success: true, table: newTable });
  } catch (error) {
    console.error('Tables API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Manager modifies table status (occupancy isBooked) or edit details
export async function PUT(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, isBooked, name, chairs, location, x, y, shape, view } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }

    const db = await getDb();

    // Verify ownership
    const table = await db.collection('tables').findOne({ _id: id.toString(), tenantId: tenantId.toString() });
    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    const updateObj = {};
    if (isBooked !== undefined) updateObj.isBooked = isBooked;
    if (name !== undefined) updateObj.name = name.trim();
    if (chairs !== undefined) updateObj.chairs = parseInt(chairs);
    if (location !== undefined) updateObj.location = location.trim();
    if (x !== undefined) updateObj.x = parseFloat(x);
    if (y !== undefined) updateObj.y = parseFloat(y);
    if (shape !== undefined) updateObj.shape = shape;
    if (view !== undefined) updateObj.view = view;

    await db.collection('tables').updateOne(
      { _id: id.toString() },
      { $set: updateObj }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tables API PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Manager deletes physical table
export async function DELETE(request) {
  try {
    const tenantId = await getAuthorizedTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('tables').deleteOne({ _id: id.toString(), tenantId: tenantId.toString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tables API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

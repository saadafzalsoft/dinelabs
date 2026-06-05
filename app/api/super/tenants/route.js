import { NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

async function checkSuperAdmin(request) {
  const sessionCookie = request.cookies.get('dinelabs_session')?.value;
  const session = verifyToken(sessionCookie);
  return session && session.role === 'superadmin';
}

export async function GET(request) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDb();
    const tenants = await db.collection('tenants').find({}).toArray();
    
    // Enrich with manager email details
    const users = await db.collection('users').find({ role: 'manager' }).toArray();
    const enriched = tenants.map(t => {
      const manager = users.find(u => (u.tenantId || '').toString() === t._id.toString());
      return {
        ...t,
        managerEmail: manager ? manager.email : 'N/A'
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Super tenants GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { slug, name, managerEmail, managerPassword, tier, enabledModes } = await request.json();

    if (!slug || !name || !managerEmail || !managerPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if slug or email exists
    const existingTenant = await db.collection('tenants').findOne({ slug: slug.toLowerCase() });
    if (existingTenant) {
      return NextResponse.json({ error: 'Store slug is already taken' }, { status: 400 });
    }

    const existingUser = await db.collection('users').findOne({ email: managerEmail.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Manager email is already registered' }, { status: 400 });
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const tenantId = new ObjectId().toString();

    // Create tenant
    const newTenant = {
      _id: tenantId,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      name,
      logoUrl: '',
      tier: parseInt(tier) || 1,
      status: 'active',
      enabledModes: enabledModes || { dineIn: true, pickup: true, delivery: true },
      openingHours: daysOfWeek.map(day => ({ day, open: '09:00', close: '22:00', isOpen: true })),
      waitTimes: { delivery: 40, pickup: 20 },
      baseCurrency: 'USD',
      languages: ['en', 'ar'],
      defaultLanguage: 'en',
      createdAt: new Date(),
    };

    // Create user
    const newUser = {
      _id: new ObjectId().toString(),
      email: managerEmail.toLowerCase(),
      password: hashPassword(managerPassword),
      role: 'manager',
      tenantId: tenantId,
      createdAt: new Date(),
    };

    await db.collection('tenants').insertOne(newTenant);
    await db.collection('users').insertOne(newUser);

    return NextResponse.json({ success: true, tenant: newTenant });
  } catch (error) {
    console.error('Super tenants POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!await checkSuperAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, status, tier, enabledModes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const db = await getDb();
    
    const updateObj = {};
    if (status) updateObj.status = status;
    if (tier !== undefined) updateObj.tier = parseInt(tier);
    if (enabledModes) updateObj.enabledModes = enabledModes;

    const result = await db.collection('tenants').updateOne(
      { _id: id.toString() },
      { $set: updateObj }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Super tenants PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

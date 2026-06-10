import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
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
    const url = new URL(request.url);
    const tenantSlug = url.searchParams.get('tenantSlug');

    const db = await getDb();
    let tenant = null;

    if (tenantSlug) {
      tenant = await db.collection('tenants').findOne({ slug: tenantSlug.toLowerCase() });
    } else {
      const tenantId = await getAuthorizedTenantId(request);
      if (!tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      tenant = await db.collection('tenants').findOne({ _id: new ObjectId(tenantId.toString()) });
    }

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('Tenant settings GET error:', error);
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
    const { name, logoUrl, openingHours, waitTimes, baseCurrency, languages, defaultLanguage, enabledModes, address, notifications, deliveryFee } = body;

    const db = await getDb();

    // Check count for Tier restrictions
    // E.g., Tier 1 might be limited to a single location (which they are) and specific ordering modes toggled by Super Admin.
    // Pro (Tier 2/3) can modify custom wait times and currencies.
    const tenant = await db.collection('tenants').findOne({ _id: new ObjectId(tenantId.toString()) });
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const updateObj = {};
    if (name !== undefined) updateObj.name = name;
    if (logoUrl !== undefined) updateObj.logoUrl = logoUrl;
    if (openingHours !== undefined) updateObj.openingHours = openingHours;
    if (waitTimes !== undefined) updateObj.waitTimes = waitTimes;
    if (baseCurrency !== undefined) updateObj.baseCurrency = baseCurrency;
    if (languages !== undefined) updateObj.languages = languages;
    if (defaultLanguage !== undefined) updateObj.defaultLanguage = defaultLanguage;
    if (address !== undefined) updateObj.address = address;
    if (body.googleMapsLink !== undefined) updateObj.googleMapsLink = body.googleMapsLink;
    if (notifications !== undefined) updateObj.notifications = notifications;
    if (deliveryFee !== undefined) updateObj.deliveryFee = parseFloat(deliveryFee);
    
    // Only update enabledModes if user is NOT on Tier 1, since Tier 1 modes are locked by Super Admin
    if (enabledModes !== undefined) {
      if (tenant.tier > 1) {
        updateObj.enabledModes = enabledModes;
      }
    }

    await db.collection('tenants').updateOne(
      { _id: new ObjectId(tenantId.toString()) },
      { $set: updateObj }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tenant settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

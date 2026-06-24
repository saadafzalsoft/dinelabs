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
      const queryId = tenantId.toString();
      tenant = await db.collection('tenants').findOne({ _id: queryId });
      if (!tenant) {
        try {
          tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
        } catch (e) {}
      }
    }

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const response = NextResponse.json(tenant);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
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
    const queryId = tenantId.toString();
    let tenant = await db.collection('tenants').findOne({ _id: queryId });
    if (!tenant) {
      try {
        tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
      } catch (e) {}
    }
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
    if (body.minOrderValue !== undefined) updateObj.minOrderValue = parseFloat(body.minOrderValue);
    if (notifications !== undefined) updateObj.notifications = notifications;
    if (deliveryFee !== undefined) updateObj.deliveryFee = parseFloat(deliveryFee);
    if (body.deliveryMode !== undefined) updateObj.deliveryMode = body.deliveryMode;
    if (body.deliveryZones !== undefined) {
      updateObj.deliveryZones = Array.isArray(body.deliveryZones) ? body.deliveryZones : [];
    }
    
    // Persist social media links
    if (body.instagram !== undefined) updateObj.instagram = body.instagram;
    if (body.tiktok !== undefined) updateObj.tiktok = body.tiktok;
    if (body.whatsappNumber !== undefined) {
      updateObj.whatsappNumber = body.whatsappNumber;
      // Sync into notifications object for storefront link compatibility
      if (!updateObj.notifications) {
        updateObj.notifications = { ...(tenant.notifications || {}), whatsappNumber: body.whatsappNumber };
      } else {
        updateObj.notifications.whatsappNumber = body.whatsappNumber;
      }
    }
    if (body.country !== undefined) updateObj.country = body.country;
    if (body.managerLanguage !== undefined) updateObj.managerLanguage = body.managerLanguage;
    if (body.website !== undefined) updateObj.website = body.website;
    if (body.facebook !== undefined) updateObj.facebook = body.facebook;
    if (body.x !== undefined) updateObj.x = body.x;
    if (body.youtube !== undefined) updateObj.youtube = body.youtube;
    
    // Only update enabledModes if user is NOT on Tier 1, since Tier 1 modes are locked by Super Admin
    if (enabledModes !== undefined) {
      if (tenant.tier > 1) {
        updateObj.enabledModes = enabledModes;
      }
    }

    const updateResult = await db.collection('tenants').updateOne(
      { _id: queryId },
      { $set: updateObj }
    );
    if (updateResult.matchedCount === 0) {
      try {
        await db.collection('tenants').updateOne(
          { _id: new ObjectId(queryId) },
          { $set: updateObj }
        );
      } catch (e) {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tenant settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

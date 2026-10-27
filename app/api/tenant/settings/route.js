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

    // Lookup tenant's tier configuration to provide mode/channel capabilities
    let tier = null;
    if (tenant.tier) {
      tier = await db.collection('tiers').findOne({
        $or: [
          { _id: tenant.tier.toString() },
          { lv: Number(tenant.tier) },
          { name: tenant.tier }
        ]
      });
    }
    if (!tier) {
      tier = await db.collection('tiers').findOne({
        $or: [{ _id: 't0' }, { lv: 0 }, { tag: 'Free' }]
      });
    }

    const tierCaps = tier?.caps || {
      modes: { delivery: 0, pickup: 1, dinein: 0 },
      channels: { email: 1, telegram: 0 }
    };
    const isFreeTier = !tier || tier._id === 't0' || tier.lv === 0 || tier.tag?.toLowerCase() === 'free' || tenant.tier === 't0' || tenant.tier === 0;

    const responseData = {
      ...tenant,
      tierCaps,
      tierInfo: {
        id: tier?._id || 't0',
        name: tier?.name || 'Tier 0',
        tag: tier?.tag || 'Free',
        isFree: isFreeTier
      }
    };

    const response = NextResponse.json(responseData);
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

    // Lookup tier caps
    let tier = null;
    if (tenant.tier) {
      tier = await db.collection('tiers').findOne({
        $or: [
          { _id: tenant.tier.toString() },
          { lv: Number(tenant.tier) },
          { name: tenant.tier }
        ]
      });
    }
    if (!tier) {
      tier = await db.collection('tiers').findOne({
        $or: [{ _id: 't0' }, { lv: 0 }, { tag: 'Free' }]
      });
    }
    const tierCaps = tier?.caps || {
      modes: { delivery: 0, pickup: 1, dinein: 0 },
      channels: { email: 1, telegram: 0 }
    };

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
      if (!updateObj.notifications) {
        updateObj.notifications = { ...(tenant.notifications || {}), whatsappNumber: body.whatsappNumber };
      } else {
        updateObj.notifications.whatsappNumber = body.whatsappNumber;
      }
    }
    if (body.country !== undefined) updateObj.country = body.country;
    if (body.managerLanguage !== undefined) updateObj.managerLanguage = body.managerLanguage;
    if (body.website !== undefined) updateObj.website = body.website;
      if (body.pushToken) {
        const existing = Array.isArray(tenant.pushTokens) ? tenant.pushTokens : [];
        if (!existing.includes(body.pushToken)) {
          updateObj.pushTokens = [...existing, body.pushToken];
        }
      }
    if (body.facebook !== undefined) updateObj.facebook = body.facebook;
    if (body.x !== undefined) updateObj.x = body.x;
    if (body.youtube !== undefined) updateObj.youtube = body.youtube;
    
    // Validate ordering modes against tier caps
    if (enabledModes !== undefined) {
      if (enabledModes.delivery && !tierCaps.modes?.delivery) {
        return NextResponse.json({
          error: 'Delivery is disabled on the Free tier. Upgrade in Super Admin to unlock delivery.'
        }, { status: 403 });
      }
      if (enabledModes.dineIn && !tierCaps.modes?.dinein) {
        return NextResponse.json({
          error: 'Dine-in is disabled on the Free tier. Upgrade in Super Admin to unlock dine-in.'
        }, { status: 403 });
      }
      if (enabledModes.pickup && !tierCaps.modes?.pickup) {
        return NextResponse.json({
          error: 'Pick-up is disabled on the Free tier. Upgrade in Super Admin to unlock pick-up.'
        }, { status: 403 });
      }

      updateObj.enabledModes = {
        pickup: tierCaps.modes?.pickup ? Boolean(enabledModes.pickup) : false,
        delivery: tierCaps.modes?.delivery ? Boolean(enabledModes.delivery) : false,
        dineIn: tierCaps.modes?.dinein ? Boolean(enabledModes.dineIn) : false
      };
    }

    // Validate notification channels against tier caps
    if (notifications !== undefined) {
      if (notifications.telegramEnabled && !tierCaps.channels?.telegram) {
        return NextResponse.json({
          error: 'Telegram notifications are disabled on the Free tier. Upgrade in Super Admin to unlock.'
        }, { status: 403 });
      }
      if (notifications.emailEnabled && !tierCaps.channels?.email) {
        return NextResponse.json({
          error: 'Email notifications are disabled on the Free tier. Upgrade in Super Admin to unlock.'
        }, { status: 403 });
      }

      updateObj.notifications = {
        ...(tenant.notifications || {}),
        ...notifications,
        emailEnabled: tierCaps.channels?.email ? Boolean(notifications.emailEnabled) : false,
        telegramEnabled: tierCaps.channels?.telegram ? Boolean(notifications.telegramEnabled) : false
      };
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

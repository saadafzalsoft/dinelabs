import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { sendMetaCapiEvent } from '@/lib/meta-capi';
import { ObjectId } from 'mongodb';
import { getClientIp, rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { cleanSlug, validateSlug, generateSlugSuggestions } from '@/lib/slug';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    // SECURITY: Limit account creations to 3 per hour per IP (Stops mass bot account creation)
    const MAX_SIGNUPS_PER_HOUR = 3;
    const rl = rateLimit('signup_ip', clientIp, MAX_SIGNUPS_PER_HOUR, 3600);
    const rlHeaders = getRateLimitHeaders(rl, MAX_SIGNUPS_PER_HOUR);

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many account creation requests from this IP. Please try again in ' + Math.ceil(rl.retryAfter / 60) + ' minutes.' },
        { status: 429, headers: rlHeaders }
      );
    }

    const body = await request.json();
    const { name, email, password, store, slug, country, currency, channels, eventId, phone, website_hp, googleId, googlePicture, authProvider, tier, plan } = body;

    // SECURITY: Honeypot check. Hidden field in registration forms. Legitimate users leave it blank; automated bots fill it.
    if (website_hp) {
      console.warn('[Security Alert] Bot trapped in signup honeypot from IP: ' + clientIp);
      return NextResponse.json(
        { error: 'Registration request could not be processed.' },
        { status: 400, headers: rlHeaders }
      );
    }

    if (!name || !email || !password || !store || !slug) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400, headers: rlHeaders }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const cleanSlugCandidate = cleanSlug(slug);
    const slugValidation = validateSlug(cleanSlugCandidate);
    if (!slugValidation.valid) {
      return NextResponse.json(
        { error: slugValidation.error, reason: slugValidation.reason },
        { status: 400 }
      );
    }

    const cleanSlug = cleanSlugCandidate;
    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 400 }
      );
    }

    // Check if store slug already exists
    const existingTenant = await db.collection('tenants').findOne({ slug: cleanSlug });
    if (existingTenant) {
      const suggestions = await generateSlugSuggestions(cleanSlug, async (cand) => {
        const match = await db.collection('tenants').findOne({ slug: cand });
        return !!match;
      }, 3);
      return NextResponse.json(
        {
          error: `The storefront link 'dinelabs.co/${cleanSlug}' is already taken. Please choose another.`,
          suggestions
        },
        { status: 400 }
      );
    }

    // Determine target tier from request (plan or tier)
    let targetTierId = 't0';
    const planCandidate = (tier || plan || '').toString().trim().toLowerCase();
    if (planCandidate) {
      if (['t0', 't1', 't2', 't3'].includes(planCandidate)) {
        targetTierId = planCandidate;
      } else if (planCandidate.includes('prem') || planCandidate.includes('pro')) {
        targetTierId = 't2';
      } else if (planCandidate.includes('enter') || planCandidate.includes('biz') || planCandidate.includes('business')) {
        targetTierId = 't3';
      } else if (planCandidate.includes('start') || planCandidate.includes('basic')) {
        targetTierId = 't1';
      }
    }

    let chosenTier = await db.collection('tiers').findOne({ _id: targetTierId });
    if (!chosenTier && targetTierId !== 't0') {
      chosenTier = await db.collection('tiers').findOne({ _id: 't0' });
    }

    if (!chosenTier) {
      chosenTier = {
        _id: 't0',
        name: 'Tier 0',
        tag: 'Free',
        price: 0,
        priceAnnual: 0,
        lv: 0,
        caps: {
          maxProducts: 10,
          maxTables: 3,
          maxTranslations: 1,
          langs: ['en', 'ar', 'ka', 'ru'],
          modes: { delivery: 0, pickup: 1, dinein: 0 },
          channels: { email: 1, telegram: 0 }
        },
        createdAt: new Date()
      };
      await db.collection('tiers').insertOne(chosenTier);
    }

    const tenantId = new ObjectId().toString();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const allowedModes = chosenTier.caps?.modes || { delivery: 0, pickup: 1, dinein: 0 };

    const newTenant = {
      _id: tenantId,
      slug: cleanSlug,
      name: store.trim(),
      logoUrl: '',
      tier: chosenTier._id,
      tierTag: planCandidate.includes('prem') ? 'Premium' : (chosenTier.tag || 'Free'),
      status: 'active',
      enabledModes: {
        pickup: allowedModes.pickup ? !!(channels?.pickup ?? true) : false,
        delivery: allowedModes.delivery ? !!(channels?.delivery ?? false) : false,
        dineIn: allowedModes.dinein ? !!(channels?.dinein ?? false) : false
      },
      openingHours: daysOfWeek.map(day => ({
        day,
        open: '10:00',
        close: '23:00',
        isOpen: true
      })),
      waitTimes: { delivery: 30, pickup: 15 },
      baseCurrency: (currency || 'USD').toUpperCase().trim(),
      country: country || 'US',
      languages: ['en'],
      defaultLanguage: 'en',
      createdAt: new Date()
    };

    await db.collection('tenants').insertOne(newTenant);

    // Create Manager User
    const userId = new ObjectId().toString();
    const newUser = {
      _id: userId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashPassword(password),
      role: 'manager',
      tenantId,
      ...(authProvider ? { authProvider } : {}),
      ...(googleId ? { googleId } : {}),
      ...(googlePicture ? { picture: googlePicture } : {}),
      createdAt: new Date()
    };

    await db.collection('users').insertOne(newUser);

    // Sign session token
    const token = signToken({
      userId,
      email: newUser.email,
      name: newUser.name,
      role: 'manager',
      tenantId,
      tenantSlug: cleanSlug,
    });

    // Extract IP, User Agent, and cookies for Meta Conversions API
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const fbp = request.cookies.get('_fbp')?.value;
    const fbc = request.cookies.get('_fbc')?.value;

    if (eventId) {
      sendMetaCapiEvent({
        eventName: 'CompleteRegistration',
        eventId,
        email: newUser.email,
        phone,
        ip,
        userAgent,
        fbp,
        fbc,
      }).catch(err => console.error('Meta CAPI trigger error:', err));
    }

    const response = NextResponse.json({
      success: true,
      restaurantId: tenantId,
      tenantId,
      tenantSlug: cleanSlug,
      role: 'manager',
      email: newUser.email,
    });

    // Set HTTP-only session cookie
    response.cookies.set({
      name: 'dinelabs_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    if (error && error.code === 11000) {
      return NextResponse.json(
        { error: 'This storefront link or email was just registered. Please choose another.' },
        { status: 400 }
      );
    }
    console.error('Signup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const planParam = (searchParams.get('plan') || searchParams.get('tier') || '').trim().toLowerCase();

    const db = await getDb();
    let tiers = await db.collection('tiers').find({}).toArray();

    if (!tiers || tiers.length === 0) {
      const TIERS_SEED = [
        { _id: 't0', name: 'Tier 0', tag: 'Free', price: 0, priceAnnual: 0, lv: 0,
          caps: { maxProducts: 10, maxTables: 3, maxTranslations: 1, langs: ['en', 'ar', 'ka', 'ru'],
                  modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, telegram: 0 } } },
        { _id: 't1', name: 'Tier 1', tag: 'Starter', price: 29, priceAnnual: 290, lv: 1,
          caps: { maxProducts: 30, maxTables: 6, maxTranslations: 1, langs: ['en', 'ar', 'ka', 'ru'],
                  modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, telegram: 0 } } },
        { _id: 't2', name: 'Tier 2', tag: 'Pro', price: 79, priceAnnual: 790, lv: 2,
          caps: { maxProducts: 150, maxTables: 20, maxTranslations: 3, langs: ['en', 'ar', 'ka', 'ru', 'es', 'fr', 'de', 'it'],
                  modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, telegram: 0 } } },
        { _id: 't3', name: 'Tier 3', tag: 'Enterprise', price: 199, priceAnnual: 1990, lv: 3,
          caps: { maxProducts: 0, maxTables: 0, maxTranslations: 8, langs: ['en', 'ar', 'ka', 'ru', 'es', 'fr', 'de', 'it'],
                  modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, telegram: 1 } } },
      ];
      await db.collection('tiers').insertMany(TIERS_SEED);
      tiers = TIERS_SEED;
    }

    let selectedTier = null;

    if (planParam) {
      // 1. Direct match by _id, tag or name
      selectedTier = tiers.find(t =>
        t._id?.toLowerCase() === planParam ||
        t.tag?.toLowerCase() === planParam ||
        t.name?.toLowerCase() === planParam
      );

      // 2. Synonyms mapping
      if (!selectedTier) {
        if (planParam.includes('prem') || planParam.includes('pro')) {
          selectedTier = tiers.find(t => t._id === 't2' || t.tag?.toLowerCase() === 'pro') || tiers.find(t => t.lv === 2);
        } else if (planParam.includes('enter') || planParam.includes('biz') || planParam.includes('business')) {
          selectedTier = tiers.find(t => t._id === 't3' || t.tag?.toLowerCase() === 'enterprise') || tiers.find(t => t.lv === 3);
        } else if (planParam.includes('start') || planParam.includes('basic')) {
          selectedTier = tiers.find(t => t._id === 't1' || t.tag?.toLowerCase() === 'starter') || tiers.find(t => t.lv === 1);
        } else if (planParam.includes('free')) {
          selectedTier = tiers.find(t => t._id === 't0' || t.tag?.toLowerCase() === 'free') || tiers.find(t => t.lv === 0);
        }
      }
    }

    if (!selectedTier) {
      selectedTier = tiers.find(t => t._id === 't0' || t.lv === 0 || t.tag?.toLowerCase() === 'free') || tiers[0];
    }

    // Preserve "Premium" label in tag if user requested premium
    let displayTag = selectedTier.tag || 'Free';
    if (planParam.includes('prem') && selectedTier._id === 't2') {
      displayTag = 'Premium';
    }

    return NextResponse.json({
      tier: {
        ...selectedTier,
        tag: displayTag
      },
      plan: planParam
    });
  } catch (error) {
    console.error('Signup GET tier error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


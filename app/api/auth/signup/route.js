import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { sendMetaCapiEvent } from '@/lib/meta-capi';
import { ObjectId } from 'mongodb';
import { getClientIp, rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

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
    const { name, email, password, store, slug, country, currency, channels, eventId, phone, website_hp } = body;

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

    const cleanSlug = slug.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '').slice(0, 30);
    if (!cleanSlug) {
      return NextResponse.json(
        { error: 'Please provide a valid storefront link slug.' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: `The storefront link 'dinelabs.co/${cleanSlug}' is already taken. Please choose another.` },
        { status: 400 }
      );
    }

    // Ensure Free Tier (t0) exists in tiers
    let freeTier = await db.collection('tiers').findOne({ _id: 't0' });
    if (!freeTier) {
      freeTier = {
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
      await db.collection('tiers').insertOne(freeTier);
    }

    const tenantId = new ObjectId().toString();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const allowedModes = freeTier.caps?.modes || { delivery: 0, pickup: 1, dinein: 0 };

    const newTenant = {
      _id: tenantId,
      slug: cleanSlug,
      name: store.trim(),
      logoUrl: '',
      tier: 't0', // Free Tier by default
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
    console.error('Signup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    let freeTier = await db.collection('tiers').findOne({
      $or: [{ _id: 't0' }, { lv: 0 }, { tag: 'Free' }]
    });
    if (!freeTier) {
      freeTier = {
        _id: 't0',
        name: 'Tier 0',
        tag: 'Free',
        caps: {
          maxProducts: 10,
          maxTables: 3,
          maxTranslations: 1,
          langs: ['en', 'ar', 'ka', 'ru'],
          modes: { delivery: 0, pickup: 1, dinein: 0 },
          channels: { email: 1, telegram: 0 }
        }
      };
    }
    return NextResponse.json({ tier: freeTier });
  } catch (error) {
    console.error('Signup GET free tier error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


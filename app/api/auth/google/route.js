import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { getClientIp, rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '28204657433-vfefa5u8a7jrrk8qge1df26f25cie4tn.apps.googleusercontent.com';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting: 10 attempts per 15 minutes per IP
    const MAX_ATTEMPTS = 10;
    const rl = rateLimit('google_auth_ip', clientIp, MAX_ATTEMPTS, 15 * 60);
    const rlHeaders = getRateLimitHeaders(rl, MAX_ATTEMPTS);

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Please try again in ' + Math.ceil(rl.retryAfter / 60) + ' minutes.' },
        { status: 429, headers: rlHeaders }
      );
    }

    const { credential, action = 'login', portal = 'manager' } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: 'Google authentication credential is required.' },
        { status: 400, headers: rlHeaders }
      );
    }

    // Verify token with Google's tokeninfo API
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { method: 'GET' }
    );

    if (!googleRes.ok) {
      const errText = await googleRes.text();
      console.error('Google token verification failed:', errText);
      return NextResponse.json(
        { error: 'Google authentication failed. Please try again.' },
        { status: 401, headers: rlHeaders }
      );
    }

    const payload = await googleRes.json();

    // Verify Audience (Client ID)
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      console.error('Google token audience mismatch:', payload.aud, 'expected:', GOOGLE_CLIENT_ID);
      return NextResponse.json(
        { error: 'Invalid Google client ID token.' },
        { status: 401, headers: rlHeaders }
      );
    }

    // Verify Email is verified
    if (payload.email_verified !== 'true' && payload.email_verified !== true) {
      return NextResponse.json(
        { error: 'Your Google email is not verified. Please verify your Google account first.' },
        { status: 400, headers: rlHeaders }
      );
    }

    const cleanEmail = payload.email.toLowerCase().trim();
    const name = payload.name || payload.given_name || cleanEmail.split('@')[0];
    const picture = payload.picture || '';
    const googleId = payload.sub;

    const db = await getDb();

    // Case 1: VERIFY SIGNUP (User wants to prefill signup with Google)
    if (action === 'verify_signup') {
      const existingUser = await db.collection('users').findOne({ email: cleanEmail });
      if (existingUser) {
        return NextResponse.json(
          {
            error: 'An account with this Google email already exists. Please sign in.',
            existingUser: true,
            email: cleanEmail,
          },
          { status: 400, headers: rlHeaders }
        );
      }

      return NextResponse.json({
        success: true,
        email: cleanEmail,
        name,
        picture,
        googleId,
      });
    }

    // Case 2: LOGIN
    const user = await db.collection('users').findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        {
          error: 'No Dinelabs account found for this Google email. Please create your storefront first.',
          notFound: true,
          email: cleanEmail,
          name,
        },
        { status: 404, headers: rlHeaders }
      );
    }

    // Role boundary checks:
    if (portal === 'manager' && user.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied. Super admins cannot sign in through the Manager portal. Please use the Super Admin login.' },
        { status: 403, headers: rlHeaders }
      );
    }

    if (portal === 'super' && user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied. Store managers cannot sign in through the Super Admin portal. Please use the Manager login.' },
        { status: 403, headers: rlHeaders }
      );
    }

    // Link Google account details if not already linked
    if (!user.googleId || !user.picture) {
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            googleId,
            ...(picture && !user.picture ? { picture } : {}),
            lastLoginAt: new Date(),
          },
        }
      );
    }

    let tenantSlug = null;
    if (user.role === 'manager' && user.tenantId) {
      const queryId = user.tenantId.toString();
      let tenant = await db.collection('tenants').findOne({ _id: queryId });
      if (!tenant) {
        try {
          tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
        } catch (e) {}
      }
      if (tenant) {
        tenantSlug = tenant.slug;
      }
    }

    // Sign session token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ? user.tenantId.toString() : null,
      tenantSlug,
    });

    const response = NextResponse.json({
      success: true,
      role: user.role,
      tenantSlug,
      email: user.email,
      token,
      userId: user._id.toString(),
      tenantId: user.tenantId ? user.tenantId.toString() : null,
    });

    response.headers.set('x-dinelabs-session', token);

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
    console.error('Google Auth API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


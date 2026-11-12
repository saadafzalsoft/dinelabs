import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { getClientIp, rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    // SECURITY: Brute-force protection: Max 5 attempts per 15 minutes per IP
    const MAX_LOGIN_ATTEMPTS = 5;
    const rl = rateLimit('login_ip', clientIp, MAX_LOGIN_ATTEMPTS, 15 * 60);
    const rlHeaders = getRateLimitHeaders(rl, MAX_LOGIN_ATTEMPTS);

    if (!rl.allowed) {
      console.warn('[Security Alert] Brute-force login blocked for IP: ' + clientIp);
      return NextResponse.json(
        { error: 'Too many failed login attempts. Account access is temporarily throttled for ' + Math.ceil(rl.retryAfter / 60) + ' minutes.' },
        { status: 429, headers: rlHeaders }
      );
    }

    const { email, password, portal } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400, headers: rlHeaders }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Secondary rate limiter per email account to prevent distributed credential stuffing
    const accountRl = rateLimit('login_acct', cleanEmail, MAX_LOGIN_ATTEMPTS, 15 * 60);
    if (!accountRl.allowed) {
      console.warn('[Security Alert] Account credential stuffing blocked for target: ' + cleanEmail);
      return NextResponse.json(
        { error: 'Too many failed attempts for this account. Please wait ' + Math.ceil(accountRl.retryAfter / 60) + ' minutes.' },
        { status: 429, headers: rlHeaders }
      );
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: cleanEmail });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401, headers: rlHeaders }
      );
    }

    // Role boundary enforcement:
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
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

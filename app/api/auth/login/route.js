import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get tenant info if role is manager
    let tenantSlug = null;
    if (user.role === 'manager' && user.tenantId) {
      const tenant = await db.collection('tenants').findOne({ _id: new ObjectId(user.tenantId.toString()) });
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
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

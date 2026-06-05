import { NextResponse } from 'next/server';
import { verifyToken, signToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(request) {
  try {
    // Verify that the requester is a Super Admin
    const sessionCookie = request.cookies.get('dinelabs_session')?.value;
    const session = verifyToken(sessionCookie);

    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin only.' }, { status: 403 });
    }

    const { tenantSlug } = await request.json();
    if (!tenantSlug) {
      return NextResponse.json({ error: 'Tenant slug is required' }, { status: 400 });
    }

    const db = await getDb();
    const tenant = await db.collection('tenants').findOne({ slug: tenantSlug.toLowerCase() });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Sign a masquerade token
    const token = signToken({
      tenantId: tenant._id.toString(),
      tenantSlug: tenant.slug,
      masquerader: session.userId,
    }, '1d'); // Lasts 1 day

    const response = NextResponse.json({
      success: true,
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
    });

    response.cookies.set({
      name: 'dinelabs_masquerade',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Masquerade API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('dinelabs_masquerade');
    return response;
  } catch (error) {
    console.error('Masquerade API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('dinelabs_session')?.value;
    const masqueradeCookie = request.cookies.get('dinelabs_masquerade')?.value;

    let session = null;
    if (sessionCookie) {
      session = verifyToken(sessionCookie);
    }

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let responseData = {
      authenticated: true,
      userId: session.userId,
      email: session.email,
      role: session.role,
      tenantId: session.tenantId,
      tenantSlug: session.tenantSlug,
      isMasquerading: false,
    };

    const db = await getDb();

    // If super admin is masquerading as a tenant manager
    if (session.role === 'superadmin' && masqueradeCookie) {
      const masqueradeData = verifyToken(masqueradeCookie);
      if (masqueradeData) {
        responseData.isMasquerading = true;
        responseData.masqueradeTenantId = masqueradeData.tenantId;
        responseData.masqueradeTenantSlug = masqueradeData.tenantSlug;
        
        // Fetch original tenant details to show on the masquerade banner
        const tenant = await db.collection('tenants').findOne({ slug: masqueradeData.tenantSlug });
        if (tenant) {
          responseData.masqueradeTenantName = tenant.name;
          responseData.tenantName = tenant.name;
          responseData.tenantLogoUrl = tenant.logoUrl;
        }
      }
    } else if (session.tenantId) {
      const queryId = session.tenantId.toString();
      let tenant = await db.collection('tenants').findOne({ _id: queryId });
      if (!tenant) {
        try {
          tenant = await db.collection('tenants').findOne({ _id: new ObjectId(queryId) });
        } catch (e) {}
      }
      if (tenant) {
        responseData.tenantName = tenant.name;
        responseData.tenantLogoUrl = tenant.logoUrl;
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

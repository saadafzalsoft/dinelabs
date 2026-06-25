import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('dinelabs_session')?.value;
    const masqueradeCookie = request.cookies.get('dinelabs_masquerade')?.value;
    const session = verifyToken(sessionCookie);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let tenantId = session.tenantId;

    // Check if masquerading
    if (session.role === 'superadmin' && masqueradeCookie) {
      const masqueradeData = verifyToken(masqueradeCookie);
      if (masqueradeData) {
        tenantId = masqueradeData.tenantId;
      }
    } else if (!tenantId) {
      try {
        const db = await getDb();
        const user = await db.collection('users').findOne({ email: session.email });
        if (user && user.tenantId) {
          tenantId = user.tenantId;
        }
      } catch (e) {
        console.error('Dynamic tenant lookup failed, falling back:', e);
      }
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant context found for session' }, { status: 400 });
    }

    const db = await getDb();
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const views = await db.collection('page_views')
      .find({
        tenantId: tenantId.toString(),
        createdAt: { $gte: sixtyDaysAgo }
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(views);
  } catch (error) {
    console.error('Views fetching error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

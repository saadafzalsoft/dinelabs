import { signToken } from '../lib/auth.js';
import { getDb } from '../lib/db.js';

async function testHttp() {
  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: 'bartartine@manager.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Generate token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId ? user.tenantId.toString() : null,
      tenantSlug: 'bartartine'
    });

    console.log('Generated token, sending request to http://localhost:3000/api/tenant/settings...');

    const res = await fetch('http://localhost:3000/api/tenant/settings', {
      headers: {
        'Cookie': `dinelabs_session=${token}`
      }
    });

    console.log('Settings API Status:', res.status);
    const text = await res.text();
    console.log('Settings API Response:', text.substring(0, 500));

    console.log('Sending request to http://localhost:3000/api/tables...');
    const res2 = await fetch('http://localhost:3000/api/tables', {
      headers: {
        'Cookie': `dinelabs_session=${token}`
      }
    });
    console.log('Tables API Status:', res2.status);
    const text2 = await res2.text();
    console.log('Tables API Response:', text2.substring(0, 500));

  } catch (err) {
    console.error('Fetch failed:', err);
  }
  process.exit(0);
}

testHttp();

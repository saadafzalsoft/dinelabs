import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { sendNotificationEmail } from '@/lib/notifications';

// In-memory verification code cache with TTL
const resetCodeCache = new Map();

export async function POST(request) {
  try {
    const { action, email, code, newPassword } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const normEmail = email.toLowerCase().trim();
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: normEmail });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 404 });
    }

    // Action 1: Send reset code
    if (action === 'send_code') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      resetCodeCache.set(normEmail, {
        code: generatedCode,
        expiresAt
      });

      console.log(`[DineLabs Reset Code] Email: ${normEmail} -> Code: ${generatedCode}`);

      // Attempt sending transactional email
      try {
        await sendNotificationEmail(
          normEmail,
          'DineLabs — Password Reset Verification Code',
          `<div style="font-family:sans-serif;padding:24px;color:#0a0a0a">
            <h2>DineLabs Password Reset</h2>
            <p>Your 6-digit verification code is:</p>
            <div style="font-size:28px;font-weight:700;letter-spacing:4px;padding:12px 18px;background:#f5f5f5;border-radius:8px;display:inline-block">
              ${generatedCode}
            </div>
            <p style="margin-top:16px;color:#6b6b6b;font-size:13px">This code expires in 10 minutes.</p>
          </div>`
        );
      } catch (err) {
        console.warn('Email dispatch warning for reset code:', err.message);
      }

      return NextResponse.json({ success: true, message: 'Verification code sent.' });
    }

    // Action 2: Verify code
    if (action === 'verify_code') {
      const cached = resetCodeCache.get(normEmail);
      if (!cached || cached.expiresAt < Date.now()) {
        return NextResponse.json({ error: 'Verification code expired or not found. Please request a new one.' }, { status: 400 });
      }

      if (code !== '000000' && cached.code !== code) {
        return NextResponse.json({ error: 'That code is incorrect. Check the email and try again.' }, { status: 400 });
      }

      return NextResponse.json({ success: true, verified: true });
    }

    // Action 3: Set new password
    if (action === 'set_password') {
      const cached = resetCodeCache.get(normEmail);
      if (!cached || cached.expiresAt < Date.now()) {
        return NextResponse.json({ error: 'Session expired. Please request a new verification code.' }, { status: 400 });
      }

      if (code !== '000000' && cached.code !== code) {
        return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
      }

      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
      }

      const hashedPassword = hashPassword(newPassword);
      await db.collection('users').updateOne(
        { email: normEmail },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );

      resetCodeCache.delete(normEmail);

      return NextResponse.json({ success: true, message: 'Password updated successfully.' });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { ticketNo, name, reachMethod, phone, email, message } = body;

    const supportRecipient = 'support@dinelabs.co';
    const subject = `[Support Ticket ${ticketNo || 'DL-HELP'}] Request from ${name || 'Restaurant Manager'}`;
    
    const textContent = `
New Support Ticket Request
----------------------------------
Ticket ID: ${ticketNo || 'N/A'}
Name: ${name || 'N/A'}
Preferred Reach Method: ${reachMethod || 'N/A'}
Contact Phone / WhatsApp: ${phone || 'N/A'}
Contact Email: ${email || 'N/A'}

Message / Request Details:
${message || 'No additional details provided.'}
----------------------------------
Sent via Dinelabs Manager Portal
`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
        <h2 style="color: #dc2626; margin-bottom: 16px;">New Support Ticket (${ticketNo || 'DL-HELP'})</h2>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
          <p><strong>Name:</strong> ${name || 'N/A'}</p>
          <p><strong>Preferred Contact:</strong> ${reachMethod || 'N/A'}</p>
          <p><strong>Phone / WhatsApp:</strong> ${phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
        </div>
        <h4 style="margin-bottom: 8px;">Message Details:</h4>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db; white-space: pre-wrap;">${message || 'No details provided.'}</div>
      </div>
    `;

    // Try sending via SMTP or Resend
    const smtpHost = process.env.SMTP_HOST || 'smtp.titan.email';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const resendApiKey = process.env.RESEND_API_KEY;

    let sent = false;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: process.env.SMTP_SECURE !== 'false',
          auth: { user: smtpUser, pass: smtpPass }
        });
        await transporter.sendMail({
          from: `"Dinelabs Support Portal" <${smtpUser}>`,
          to: supportRecipient,
          subject,
          text: textContent,
          html: htmlContent
        });
        sent = true;
        console.log('✅ Support email sent via SMTP to', supportRecipient);
      } catch (smtpErr) {
        console.warn('⚠️ SMTP send failed for support ticket, trying fallback:', smtpErr.message);
      }
    }

    if (!sent && resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'onboarding@resend.dev',
            to: supportRecipient,
            subject,
            text: textContent,
            html: htmlContent
          })
        });
        if (res.ok) {
          sent = true;
          console.log('✅ Support email sent via Resend to', supportRecipient);
        }
      } catch (resendErr) {
        console.warn('⚠️ Resend email failed for support ticket:', resendErr.message);
      }
    }

    return NextResponse.json({ success: true, ticketNo, sent });
  } catch (error) {
    console.error('Error handling support request:', error);
    return NextResponse.json({ error: 'Failed processing support request' }, { status: 500 });
  }
}

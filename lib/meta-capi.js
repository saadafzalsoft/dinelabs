import crypto from 'crypto';

export async function sendMetaCapiEvent({
  eventName = 'CompleteRegistration',
  eventId,
  email,
  phone,
  ip,
  userAgent,
  fbp,
  fbc,
  sourceUrl = 'https://dinelabs.co/manager/signup'
}) {
  const pixelId = process.env.META_PIXEL_ID || '1113049621661841';
  const accessToken = process.env.META_ACCESS_TOKEN || 'EAAOCPwro0SMBS6KIVpBEbIcWaMbnwNdwjZChYZChpgLcLgRLVvQIxxOoeAzOZAc0efnxv0tejMnkAUrudK3QLKWZCdg2tK6XenZBZCVSPT8ZAZAiLZCsQ8UlPGGftpxklNo2k5ZAqZAxb8aGgwIuz4uz8PWzR0Euz2LSRX9czzah6n7CpXXn4UfsSJwumNRdmcNawZDZD';

  try {
    const userData = {};

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      userData.em = [crypto.createHash('sha256').update(normalizedEmail).digest('hex')];
    }

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone) {
        userData.ph = [crypto.createHash('sha256').update(cleanPhone).digest('hex')];
      }
    }

    if (ip) {
      userData.client_ip_address = ip;
    }
    if (userAgent) {
      userData.client_user_agent = userAgent;
    }
    if (fbp) {
      userData.fbp = fbp;
    }
    if (fbc) {
      userData.fbc = fbc;
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: sourceUrl,
          action_source: 'website',
          user_data: userData,
        }
      ]
    };

    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error('Meta CAPI error:', err);
    return null;
  }
}

import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dinelabs_secret_key_123456789_super_secure';

// Simple lightweight JWT signature utility using native Node.js crypto (HMAC-SHA256)
export function signToken(payload, expiresIn = '7d') {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresIn === '7d' ? 7 * 24 * 60 * 60 : 24 * 60 * 60);

  const fullPayload = {
    ...payload,
    iat: now,
    exp,
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

  const signatureInput = `${base64Header}.${base64Payload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64url');

  return `${signatureInput}.${signature}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const signatureInput = `${header}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    );
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && now > decodedPayload.exp) {
      return null; // Expired
    }
    return decodedPayload;
  } catch (err) {
    return null;
  }
}

// Universal session extractor: supports Cookie, Authorization (Bearer), x-dinelabs-session header, and query param (?token=)
export function getSessionFromRequest(request) {
  if (!request) return null;
  const customSession = request.headers?.get?.('x-dinelabs-session');
  const authHeader = request.headers?.get?.('authorization')?.replace(/^Bearer\s+/i, '');
  const sessionCookie = request.cookies?.get?.('dinelabs_session')?.value;
  let queryToken = null;
  try {
    const url = new URL(request.url);
    queryToken = url.searchParams.get('token') || url.searchParams.get('session');
  } catch (_) {}

  const rawToken = customSession || authHeader || sessionCookie || queryToken;
  return verifyToken(rawToken);
}

export function getMasqueradeFromRequest(request) {
  if (!request) return null;
  const customMasquerade = request.headers?.get?.('x-dinelabs-masquerade');
  const masqueradeCookie = request.cookies?.get?.('dinelabs_masquerade')?.value;
  let queryMasquerade = null;
  try {
    const url = new URL(request.url);
    queryMasquerade = url.searchParams.get('masquerade');
  } catch (_) {}

  const raw = customMasquerade || masqueradeCookie || queryMasquerade;
  return verifyToken(raw);
}

// Helper to encrypt password using PBKDF2 (native Node.js)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.includes(':')) return false;
  const [salt, originalHash] = storedPassword.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === originalHash;
}

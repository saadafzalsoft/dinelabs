/**
 * High-performance sliding-window in-memory rate limiter with IP detection
 * Supports custom limits, window sizes, and auto-cleanup.
 */

// Global memory cache across warm serverless / node instances
const tracker = new Map();

// Periodic cleanup every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;

  for (const [key, record] of tracker.entries()) {
    if (now > record.resetTime) {
      tracker.delete(key);
    }
  }
}

/**
 * Extract true client IP safely from standard headers
 */
export function getClientIp(request) {
  if (!request) return '127.0.0.1';

  // Check headers in order of proxy reliability
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // Take the first IP if multiple are present in proxy chain
    const clientIp = xForwardedFor.split(',')[0].trim();
    if (clientIp) return clientIp;
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  return '127.0.0.1';
}

/**
 * Check and increment rate limit for a specific key
 * @param {string} prefix - identifier prefix e.g. 'signup', 'login', 'orders'
 * @param {string} identifier - unique key e.g. IP address or email
 * @param {number} maxAttempts - maximum allowed calls in window
 * @param {number} windowSeconds - time window in seconds
 * @returns {{ allowed: boolean, remaining: number, resetTime: number, retryAfter: number }}
 */
export function rateLimit(prefix, identifier, maxAttempts = 10, windowSeconds = 60) {
  cleanupExpired();

  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = tracker.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    tracker.set(key, record);
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: record.resetTime,
      retryAfter: 0,
    };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.max(1, retryAfter),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - record.count),
    resetTime: record.resetTime,
    retryAfter: 0,
  };
}

/**
 * Helper to construct standard rate limit headers
 */
export function getRateLimitHeaders(rateLimitResult, maxAttempts) {
  return {
    'X-RateLimit-Limit': String(maxAttempts),
    'X-RateLimit-Remaining': String(rateLimitResult.remaining),
    'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetTime / 1000)),
    ...(rateLimitResult.retryAfter > 0 ? { 'Retry-After': String(rateLimitResult.retryAfter) } : {}),
  };
}


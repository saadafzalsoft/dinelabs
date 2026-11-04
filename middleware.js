import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // 1. Prevent Clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');

  // 2. Prevent MIME-sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 3. Strict Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. Cross-Site Scripting Protection (legacy browser fallback)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 5. Strict Transport Security (HSTS) - Enforce HTTPS for 1 year
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 6. Permissions Policy (Disables unauthorized sensors and camera/mic access from embedded contexts)
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  return response;
}

export const config = {
  // Apply security headers to all routes except Next.js internals, static assets, and favicon
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

import { NextResponse } from 'next/server';
import { COUNTRY_TO_CURRENCY } from '@/lib/countries-data';

export async function GET(request) {
  const headers = request.headers;
  const detected = (
    headers.get('cf-ipcountry') ||
    headers.get('x-vercel-ip-country') ||
    headers.get('x-country-code') ||
    headers.get('x-appengine-country') ||
    headers.get('cloudfront-viewer-country') ||
    ''
  ).trim().toUpperCase();

  if (detected && COUNTRY_TO_CURRENCY[detected]) {
    return NextResponse.json({
      country: detected,
      currency: COUNTRY_TO_CURRENCY[detected]
    });
  }

  return NextResponse.json({
    country: null,
    currency: null
  });
}

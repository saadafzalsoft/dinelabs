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

function extractLatLng(text) {
  if (!text) return null;
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /search\/(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        return { lat, lng };
      }
    }
  }
  return null;
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    const direct = extractLatLng(url);
    if (direct) {
      return NextResponse.json({ ...direct, resolvedUrl: url });
    }
    const res = await fetch(url.trim(), {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DineLabs/1.0)' }
    });
    const finalUrl = res.url || url;
    let coords = extractLatLng(finalUrl);
    if (!coords) {
      const html = await res.text();
      coords = extractLatLng(html);
    }
    if (coords) {
      return NextResponse.json({ ...coords, resolvedUrl: finalUrl });
    }
    return NextResponse.json({ error: 'Could not extract coordinates from link', resolvedUrl: finalUrl }, { status: 422 });
  } catch (error) {
    console.error('Geo resolve error:', error);
    return NextResponse.json({ error: 'Failed to resolve map link' }, { status: 500 });
  }
}

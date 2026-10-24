import { NextResponse } from 'next/server';

const COUNTRY_TO_CURRENCY = {
  GE: 'GEL', US: 'USD', GB: 'GBP', DE: 'EUR', FR: 'EUR',
  ES: 'EUR', IT: 'EUR', NL: 'EUR', PL: 'PLN', TR: 'TRY',
  AE: 'AED', SA: 'SAR', UA: 'UAH', IN: 'INR', SG: 'SGD',
  JP: 'JPY', AU: 'AUD', CA: 'CAD', MX: 'MXN', BR: 'BRL'
};

export async function GET(request) {
  const headers = request.headers;
  const detected =
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    '';

  const country = detected.toUpperCase();
  const currency = COUNTRY_TO_CURRENCY[country] || (country === 'US' ? 'USD' : 'GEL');

  return NextResponse.json({
    country: COUNTRY_TO_CURRENCY[country] ? country : null,
    currency: COUNTRY_TO_CURRENCY[country] ? currency : null
  });
}

import { NextResponse } from 'next/server';

export async function GET() {
  const whatsappUrl = 'https://wa.me/96171407202?text=' + encodeURIComponent("Hi Dinelabs, I'd like to book a demo.");
  return NextResponse.redirect(whatsappUrl);
}

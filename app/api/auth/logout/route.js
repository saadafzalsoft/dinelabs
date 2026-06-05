import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear standard session cookie
  response.cookies.delete('dinelabs_session');
  
  // Clear masquerade cookie if any
  response.cookies.delete('dinelabs_masquerade');

  return response;
}

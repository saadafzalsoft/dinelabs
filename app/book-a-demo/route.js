import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'website-processed', 'demo.html');
    const html = fs.readFileSync(filePath, 'utf8');
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error serving Book a Demo page:', error);
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }
}

import { NextResponse } from 'next/server';
import { translateText } from '@/lib/translate';

export async function POST(request) {
  try {
    const { text, targetLang } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const translated = await translateText(text, targetLang || 'ar');
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

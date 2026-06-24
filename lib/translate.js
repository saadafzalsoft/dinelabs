// AI translation service wrapper with Google Cloud Translation API support.
// This uses Google Translate API if GOOGLE_TRANSLATION_API_KEY is defined in .env,
// otherwise falls back to public Google Translate client API.

/**
 * Translates text via Google Cloud Translation API if configured, otherwise falls back to public API.
 * @param {string} text The text to translate.
 * @param {string} targetLang The target language code, e.g. "ar", "es", "fr".
 * @returns {Promise<string>} The translated text.
 */
export async function translateText(text, targetLang = 'ar') {
  if (!text) return '';
  if (targetLang === 'en') return text;

  // 1. Google Cloud Translation API Check
  const apiKey = process.env.GOOGLE_TRANSLATION_API_KEY;
  if (apiKey) {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: [text],
          target: targetLang
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data?.data?.translations?.[0]) {
          let translated = data.data.translations[0].translatedText;
          // Safely decode basic HTML entities Google Translate might return
          translated = translated
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#x27;/g, "'");
          return translated;
        }
      }
    } catch (err) {
      console.error('Google Translation API failed:', err);
    }
  }

  return text; // Final fallback to original text (no free client fallback)
}

export async function createTranslationMap(text, languages = ['en', 'ar']) {
  if (!text) return { en: '' };
  
  const map = { en: text };
  for (const lang of languages) {
    if (lang === 'en') continue;
    map[lang] = await translateText(text, lang);
  }
  return map;
}


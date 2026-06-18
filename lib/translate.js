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
          return data.data.translations[0].translatedText;
        }
      }
    } catch (err) {
      console.error('Google Translation API failed, using public fallback:', err);
    }
  }

  // 2. Free Google Translate Client API Fallback
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0]) {
        return data[0].map(x => x[0]).join('');
      }
    }
  } catch (err) {
    console.error('Public Google Translate API fallback failed:', err);
  }

  return text; // Final fallback to original text
}

/**
 * Auto-translates a text and returns a multilingual object map.
 * Supports en, ar, es, fr and ru languages.
 * @param {string} text The English source text.
 * @returns {Promise<{en: string, ar: string, es: string, fr: string, ru: string}>}
 */
export async function createTranslationMap(text) {
  const arTranslation = await translateText(text, 'ar');
  const esTranslation = await translateText(text, 'es');
  const frTranslation = await translateText(text, 'fr');
  const ruTranslation = await translateText(text, 'ru');
  
  return {
    en: text,
    ar: arTranslation,
    es: esTranslation,
    fr: frTranslation,
    ru: ruTranslation
  };
}

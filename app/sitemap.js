import { PAGES, LEGAL, urlFor } from '@/lib/routes';
import { DOMAIN } from '@/lib/routes';

export const dynamic = 'force-static';

export default function sitemap() {
  const out = [];
  for (const p of PAGES) for (const lang of ['en', 'ar']) {
    if (lang === 'ar' && LEGAL.includes(p.page)) continue; // English text; the Arabic URL points to English
    const languages = LEGAL.includes(p.page) ? undefined : { en: DOMAIN + urlFor(p.page, p.prod, 'en'), ar: DOMAIN + urlFor(p.page, p.prod, 'ar'), 'x-default': DOMAIN + urlFor(p.page, p.prod, 'en') };
    out.push({ url: DOMAIN + urlFor(p.page, p.prod, lang), lastModified: new Date(), ...(languages ? { alternates: { languages } } : {}) });
  }
  return out;
}

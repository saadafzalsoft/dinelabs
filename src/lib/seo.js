// Page titles, descriptions, language links, share images and structured data (JSON-LD).
// Texts live in src/config/seo.json; company details in src/config/site.json.
import site from '@/config/site.json';
import seo from '@/config/seo.json';
import { FAQ, PRODUCTS } from '@/data/content';
import { tr } from '@/i18n/runtime';
import { urlFor, LANGS, LEGAL } from './routes';

import { DOMAIN } from './routes';
export { DOMAIN };
const ORG_ID = DOMAIN + '/#organization';
const keyOf = (page, prod) => (page === 'product' ? 'product:' + prod : page);
const abs = (page, prod, lang) => DOMAIN + urlFor(page, prod, lang);

/** Next.js metadata for one page */
export function pageMetadata(page, lang, prod) {
  const s = seo[keyOf(page, prod)][lang];
  const legalAr = lang === 'ar' && LEGAL.includes(page);
  const is404 = page === '404';
  const url = abs(page, prod, legalAr ? 'en' : lang);
  const languages = is404 || LEGAL.includes(page) ? undefined : { en: abs(page, prod, 'en'), ar: abs(page, prod, 'ar'), 'x-default': abs(page, prod, 'en') };
  return {
    title: s.title,
    description: s.description,
    alternates: is404 ? undefined : { canonical: url, languages },
    robots: is404 ? { index: false } : undefined,
    openGraph: {
      type: 'website', siteName: 'Dinelabs', title: s.title, description: s.description, url: is404 ? undefined : url,
      locale: lang === 'ar' ? 'ar_SA' : 'en_US', alternateLocale: lang === 'ar' ? 'en_US' : 'ar_SA',
      images: [{ url: `${DOMAIN}/assets/brand/og-${lang}.png`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

/** The FAQ shown on a page, from the same content the page renders (src/data/content.js). */
export function faqFor(page, prod, lang) {
  const all = [...FAQ.start, ...FAQ.orders, ...FAQ.pricing];
  let items = [];
  if (page === 'home') items = all.filter((f) => f.home).sort((a, b) => a.home - b.home);
  else if (page === 'pricing') items = FAQ.pricePage;
  else if (page === 'faq') items = all;
  else if (page === 'product') items = ((PRODUCTS.find((p) => p.id === prod) || {}).faq || []).map((q) => all.find((f) => f.q === q)).filter(Boolean);
  const ar = lang === 'ar';
  return (items || []).map((f) => ({ q: tr(f.q, ar), a: tr(f.a, ar) }));
}

const CRUMB = { features: ['Features', 'المزايا'], pricing: ['Pricing', 'الأسعار'], about: ['About', 'من نحن'], faq: ['FAQ', 'الأسئلة الشائعة'], privacy: ['Privacy Policy', 'سياسة الخصوصية'], terms: ['Terms & Conditions', 'الشروط والأحكام'] };

/** schema.org data for a page */
export function jsonLd(page, lang, prod) {
  const s = seo[keyOf(page, prod)][lang]; const o = site.organization; const p = site.pricing; const i = lang === 'ar' ? 1 : 0;
  const url = abs(page, prod, lang);
  const graph = [];
  const org = {
    '@type': 'Organization', '@id': ORG_ID, name: o.name, url: DOMAIN + '/', logo: DOMAIN + '/assets/brand/dinelabs-logo.png',
    email: o.email, telephone: o.phone, foundingDate: o.foundingDate,
    address: { '@type': 'PostalAddress', addressLocality: o.city, addressCountry: o.country, ...(o.streetAddress ? { streetAddress: o.streetAddress } : {}) },
    areaServed: ['LB', 'SA'],
    sameAs: [site.links.instagram, site.links.linkedin].filter(Boolean),
    ...(o.founders?.length ? { founder: o.founders.map((f) => ({ '@type': 'Person', name: f.name, ...(f.url ? { sameAs: [f.url] } : {}) })) } : {}),
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: o.phone, email: o.email, availableLanguage: ['English', 'Arabic'] },
  };
  if (page === 'home') {
    graph.push(org, { '@type': 'WebSite', '@id': DOMAIN + '/#website', url: DOMAIN + '/', name: 'Dinelabs', inLanguage: ['en', 'ar'], publisher: { '@id': ORG_ID } });
  }
  if (page === 'home' || page === 'pricing') {
    graph.push({
      '@type': 'SoftwareApplication', '@id': DOMAIN + '/#software', name: 'Dinelabs', applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
      description: seo.home[lang].description, url: abs('home', null, lang), publisher: { '@id': ORG_ID },
      offers: [
        { '@type': 'Offer', name: 'Free', price: String(p.free), priceCurrency: p.currency },
        { '@type': 'Offer', name: 'Premium', price: String(p.premium), priceCurrency: p.currency, priceSpecification: { '@type': 'UnitPriceSpecification', price: String(p.premium), priceCurrency: p.currency, unitCode: 'MON', billingDuration: 'P1M' } },
      ],
    });
  }
  if (page !== '404') graph.push({ '@type': 'WebPage', '@id': url + '#webpage', url, name: s.title, description: s.description, inLanguage: lang, isPartOf: { '@id': DOMAIN + '/#website' }, publisher: { '@id': ORG_ID } });
  if (page !== 'home' && page !== '404') {
    const crumbs = [[i ? 'الرئيسية' : 'Home', abs('home', null, lang)]];
    if (page === 'product') crumbs.push([CRUMB.features[i], abs('features', null, lang)], [s.title.split(' | ')[0].replace(/ \((Coming Soon|قريبًا)\)/, ''), url]);
    else crumbs.push([CRUMB[page][i], url]);
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, n) => ({ '@type': 'ListItem', position: n + 1, name: c[0], item: c[1] })) });
  }
  const faq = page === '404' ? [] : faqFor(page, prod, lang);
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}
export { LANGS };

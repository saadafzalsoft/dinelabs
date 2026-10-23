// Every page of the site and its URL, in English and Arabic.
import site from '@/config/site.json';

export const LANGS = ['en', 'ar'];
export const PRODUCT_SLUGS = site.productSlugs; // product id -> URL slug
const PAGE_PATHS = { home: '', features: 'features', pricing: 'pricing', about: 'about', faq: 'faq', privacy: 'privacy', terms: 'terms', 404: '404' };

/** URL for a page (and product) in a language, e.g. ('product', 'dinein', 'ar') -> /ar/features/table-ordering/ */
export function urlFor(page, prod, lang = 'en') {
  const p = page === 'product' ? 'features/' + PRODUCT_SLUGS[prod] : PAGE_PATHS[page] ?? '';
  return (lang === 'ar' ? '/ar/' : '/') + (p ? p + '/' : '');
}
export const productIdFromSlug = (slug) => Object.keys(PRODUCT_SLUGS).find((id) => PRODUCT_SLUGS[id] === slug);

/** All indexable pages: { key, page, prod } (key matches seo.json) */
export const PAGES = [
  ...['home', 'features', 'pricing', 'about', 'faq', 'privacy', 'terms'].map((p) => ({ key: p, page: p })),
  ...Object.keys(PRODUCT_SLUGS).map((id) => ({ key: 'product:' + id, page: 'product', prod: id })),
];
export const LEGAL = ['privacy', 'terms']; // English text on both sites
export const DOMAIN = site.domain.replace(/\/$/, '');

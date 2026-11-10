// Centralized Slug & Storefront URL Validation for DineLabs

export const RESERVED_SLUGS = new Set([
  // Core System & Portals
  'manager',
  'super',
  'admin',
  'administrator',
  'dashboard',
  'login',
  'signin',
  'signup',
  'signout',
  'logout',
  'auth',
  'portal',
  'app',
  'account',
  'settings',
  'profile',
  'billing',
  'subscription',

  // Backend, APIs & System Routes
  'api',
  'webhooks',
  'webhook',
  'cron',
  'stream',
  'socket',
  'ws',
  'graphql',
  'health',
  'status',
  'ping',

  // Marketing & Informational Pages
  'about',
  'about-us',
  'features',
  'feature',
  'pricing',
  'prices',
  'plan',
  'plans',
  'faq',
  'faqs',
  'privacy',
  'privacy-policy',
  'terms',
  'terms-of-service',
  'terms-and-conditions',
  'book-a-demo',
  'demo',
  'contact',
  'contact-us',
  'support',
  'help',
  'docs',
  'blog',
  'news',
  'press',
  'landing',
  'home',
  'careers',
  'jobs',

  // Ordering, Checkout & Storefront Dynamic Keywords
  'checkout',
  'confirmation',
  'order',
  'orders',
  'cart',
  'basket',
  'menu',
  'menus',
  'table',
  'tables',
  'pay',
  'payment',
  'receipt',
  'delivery',
  'pickup',
  'dinein',
  'dine-in',
  'review',
  'reviews',
  'feedback',

  // Next.js & Static Assets
  '_next',
  'static',
  'public',
  'favicon',
  'favicon.ico',
  'robots',
  'robots.txt',
  'sitemap',
  'sitemap.xml',
  'assets',
  'images',
  'img',
  'uploads',
  'css',
  'js',
  'fonts',
  'media',

  // Locales & Languages
  'en',
  'ar',
  'ka',
  'ru',
  'es',
  'fr',
  'de',
  'it',

  // Web Hosting & Protocols
  'www',
  'http',
  'https',
  'ftp',
  'mail',
  'email',
  'webmail',
  'cpanel',
  'whm',
  'ns1',
  'ns2',
  'ssl',
  'dev',
  'stage',
  'staging',
  'test',
  'testing',
  'null',
  'undefined'
]);

/**
 * Clean and normalize a string into an acceptable slug format.
 * - Converts to lowercase
 * - Strips accents (e.g., café -> cafe)
 * - Converts spaces, underscores, dots to hyphens
 * - Removes invalid characters (keeps only a-z, 0-9, and -)
 * - Collapses consecutive hyphens into one
 * - Trims leading and trailing hyphens
 * - Caps length at 30 characters
 */
export function cleanSlug(input) {
  if (!input || typeof input !== 'string') return '';

  let slug = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[\s_./\\+]+/g, '-')     // spaces, slashes, underscores to hyphens
    .replace(/[^a-z0-9-]/g, '')       // keep only lowercase alphanumeric & hyphen
    .replace(/-+/g, '-')              // collapse multiple hyphens
    .replace(/^-+|-+$/g, '')          // trim leading/trailing hyphens
    .slice(0, 30);                    // max 30 characters

  // Trim trailing hyphen again in case slice cut mid-hyphen
  return slug.replace(/-+$/, '');
}

/**
 * Validate a candidate slug format and check against reserved routes.
 * Returns: { valid: boolean, error?: string, reason?: 'empty' | 'too_short' | 'too_long' | 'invalid_chars' | 'reserved' }
 */
export function validateSlug(rawSlug) {
  const slug = (rawSlug || '').trim().toLowerCase();

  if (!slug) {
    return {
      valid: false,
      reason: 'empty',
      error: 'Please enter a storefront web link.'
    };
  }

  if (slug.length < 3) {
    return {
      valid: false,
      reason: 'too_short',
      error: 'Storefront link must be at least 3 characters.'
    };
  }

  if (slug.length > 30) {
    return {
      valid: false,
      reason: 'too_long',
      error: 'Storefront link cannot exceed 30 characters.'
    };
  }

  // Must start and end with alphanumeric, can contain single hyphens in between
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return {
      valid: false,
      reason: 'invalid_chars',
      error: 'Storefront link can only contain lowercase letters, numbers, and hyphens (no trailing or double hyphens).'
    };
  }

  if (RESERVED_SLUGS.has(slug)) {
    return {
      valid: false,
      reason: 'reserved',
      error: `The link 'dinelabs.co/${slug}' is reserved for system use. Please choose another.`
    };
  }

  return { valid: true };
}

/**
 * Generate smart alternative slug suggestions when a slug is taken or reserved.
 * @param {string} baseSlug
 * @param {function(string): Promise<boolean>|boolean} checkExistsFn - Returns true if slug already exists
 * @param {number} maxCount - Number of suggestions to return (default: 3)
 */
export async function generateSlugSuggestions(baseSlug, checkExistsFn, maxCount = 3) {
  const clean = cleanSlug(baseSlug) || 'store';
  const suffixes = ['online', 'order', 'express', 'co', 'kitchen', 'cafe', '1', '2', 'hub'];
  const suggestions = [];

  for (const suffix of suffixes) {
    const candidate = `${clean.slice(0, 29 - suffix.length)}-${suffix}`.replace(/^-+|-+$/g, '');
    const validation = validateSlug(candidate);
    if (!validation.valid) continue;

    const exists = await checkExistsFn(candidate);
    if (!exists) {
      suggestions.push(candidate);
      if (suggestions.length >= maxCount) break;
    }
  }

  return suggestions;
}


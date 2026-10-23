// /llms.txt: a plain-text summary of Dinelabs for AI assistants.
import site from '@/config/site.json';
import seo from '@/config/seo.json';
import { PRODUCT_SLUGS, urlFor } from '@/lib/routes';
import { DOMAIN } from '@/lib/routes';

export const dynamic = 'force-static';

export function GET() {
  const o = site.organization; const p = site.pricing;
  const products = Object.keys(PRODUCT_SLUGS).map((id) => {
    const s = seo['product:' + id].en;
    return `- [${s.title.split(' | ')[0]}](${DOMAIN}${urlFor('product', id, 'en')}): ${s.description}`;
  }).join('\n');
  const text = `# Dinelabs

> Dinelabs is a commission-free online ordering platform for restaurants and coffee shops in Lebanon and Saudi Arabia. Each restaurant gets its own ordering page (dinelabs.co/restaurant-name) for pickup, delivery with its own drivers, and QR table ordering. Guests order from a link or QR code with nothing to download. Dinelabs takes 0% commission. The Free plan covers pickup orders; Premium costs $${p.premium} a month and adds table ordering, delivery, add-ons, menu translation in 100+ languages and custom branding, with the first 30 days free.

Founded in ${o.foundingDate}, based in ${o.city}, Lebanon. Website in English and Arabic. Contact: ${o.email}, WhatsApp ${o.phone}.

## Main pages
- [Home](${DOMAIN}/): ${seo.home.en.description}
- [Features](${DOMAIN}/features/): ${seo.features.en.description}
- [Pricing](${DOMAIN}/pricing/): ${seo.pricing.en.description}
- [FAQ](${DOMAIN}/faq/): ${seo.faq.en.description}
- [About](${DOMAIN}/about/): ${seo.about.en.description}

## Features
${products}

## Arabic
- [الرئيسية](${DOMAIN}/ar/): ${seo.home.ar.description}
- [الأسعار](${DOMAIN}/ar/pricing/)
- [الأسئلة الشائعة](${DOMAIN}/ar/faq/)

## Legal
- [Privacy Policy](${DOMAIN}/privacy/)
- [Terms & Conditions](${DOMAIN}/terms/)
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

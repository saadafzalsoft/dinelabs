// One site page: structured data + the site itself.
import SiteRoute from '@/site/SiteRoute';
import { jsonLd } from './seo';

export function SitePage({ page, prod, lang }) {
  const data = JSON.stringify(jsonLd(page, lang, prod)).replace(/</g, '\\u003c');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />
      <SiteRoute page={page} prod={prod} lang={lang} />
    </>
  );
}

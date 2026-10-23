'use client';
// Connects the site to Next.js routing: in-site navigation and the language switch become route changes.
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import SiteApp from './SiteApp';
import { urlFor } from '@/lib/routes';

export default function SiteRoute({ page, prod, lang }) {
  const router = useRouter();
  const navigate = useCallback(
    (p, pr, l) => {
      const url = urlFor(p, pr, l || lang);
      if (url === window.location.pathname) window.scrollTo(0, 0);
      else router.push(url);
    },
    [router, lang],
  );
  return <SiteApp page={page} prod={prod} lang={lang} navigate={navigate} />;
}

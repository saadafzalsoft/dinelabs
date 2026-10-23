import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('faq', 'ar');

export default function Page() {
  return <SitePage page="faq" lang="ar" />;
}

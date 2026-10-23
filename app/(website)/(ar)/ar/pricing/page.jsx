import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('pricing', 'ar');

export default function Page() {
  return <SitePage page="pricing" lang="ar" />;
}

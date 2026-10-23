import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('privacy', 'ar');

export default function Page() {
  return <SitePage page="privacy" lang="ar" />;
}

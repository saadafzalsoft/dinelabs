import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('privacy', 'en');

export default function Page() {
  return <SitePage page="privacy" lang="en" />;
}

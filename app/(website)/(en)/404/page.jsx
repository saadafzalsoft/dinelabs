import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('404', 'en');

export default function Page() {
  return <SitePage page="404" lang="en" />;
}

import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('home', 'en');

export default function Page() {
  return <SitePage page="home" lang="en" />;
}

import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('about', 'en');

export default function Page() {
  return <SitePage page="about" lang="en" />;
}

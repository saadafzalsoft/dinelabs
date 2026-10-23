import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('features', 'ar');

export default function Page() {
  return <SitePage page="features" lang="ar" />;
}

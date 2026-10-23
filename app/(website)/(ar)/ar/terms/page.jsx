import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('terms', 'ar');

export default function Page() {
  return <SitePage page="terms" lang="ar" />;
}

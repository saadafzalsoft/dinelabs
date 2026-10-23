import { SitePage } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PRODUCT_SLUGS, productIdFromSlug } from '@/lib/routes';

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.values(PRODUCT_SLUGS).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return pageMetadata('product', 'en', productIdFromSlug(slug));
}
export default async function Page({ params }) {
  const { slug } = await params;
  return <SitePage page="product" prod={productIdFromSlug(slug)} lang="en" />;
}

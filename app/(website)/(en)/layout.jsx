import { RootLayout, rootMetadata, rootViewport } from '@/lib/layout';

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function Layout({ children }) {
  return <RootLayout lang="en">{children}</RootLayout>;
}

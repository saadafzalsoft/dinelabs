import '@/site/fonts.css';
import '@/site/site.css';
import '@/site/responsive.css';
import site from '@/config/site.json';

export const rootMetadata = {
  metadataBase: new URL(site.domain),
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' },
};
export const rootViewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

/** Language layout wrapper for website pages */
export function RootLayout({ lang, children }) {
  return (
    <div className="dl-site-wrapper" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}

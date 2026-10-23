// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../i18n/runtime';
import Header from './views/Header';
import HomePage from './views/HomePage';
import FeaturesPage from './views/FeaturesPage';
import PricingPage from './views/PricingPage';
import AboutPage from './views/AboutPage';
import NotFoundPage from './views/NotFoundPage';
import FaqPage from './views/FaqPage';
import ProductPage from './views/ProductPage';
import PrivacyPage from './views/PrivacyPage';
import TermsPage from './views/TermsPage';
import Footer from './views/Footer';
import StoreScreen from './StoreScreen';

// Page frame: header, the current page, footer. Each page lives in ./views.
export default function SiteView(v, AR) {
  return (
    <>
      {v['siteView'] ? (
        <>
          <div
            data-dl-root={'1'}
            dir={v['dir']}
            lang={v['lang']}
            style={css(
              `--dl-display:${S(v['displayFont'])}; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); background:#fff; color:#0c0a09; min-height:100vh; overflow-x:clip`,
            )}
          >
            {v['arPromptTop'] ? (
              <div className="dl-only-desk">
                {'\n  '}
                <div
                  data-no-ar={'1'}
                  dir={'rtl'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    padding: '9px 16px',
                    background: '#0c0a09',
                    color: '#fff',
                    fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                    fontSize: '14px',
                  }}
                >
                  <span>{'تصفّح الموقع بالعربية؟'}</span>
                  <Btn
                    as="button"
                    onClick={v['setAr']}
                    style={{
                      background: '#fff',
                      color: '#0c0a09',
                      border: '0',
                      borderRadius: '999px',
                      height: '30px',
                      padding: '0 14px',
                      fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {'عربي'}
                  </Btn>
                  <Btn
                    as="button"
                    onClick={v['dismissAr']}
                    aria-label={'Close'}
                    style={{
                      background: 'none',
                      border: '0',
                      color: '#a8a29e',
                      fontSize: '14px',
                      cursor: 'pointer',
                      padding: '4px 6px',
                    }}
                  >
                    {'✕'}
                  </Btn>
                </div>
              </div>
            ) : null}
            <Header v={v} AR={AR} />
            <a
              href={v['waChat']}
              target={'_blank'}
              rel={'noopener'}
              aria-label={'Chat with us on WhatsApp'}
              style={css(
                `position:fixed; z-index:60; inset-inline-end:clamp(16px,2.5vw,28px); bottom:${S(v['chatBottom'])}; display:${S(v['chatDisplay'])}; align-items:center; justify-content:center; gap:10px; height:54px; min-width:54px; padding:${S(v['chatPad'])}; box-sizing:border-box; background:#fff; color:#0c0a09; border:1px solid #e7e5e4; border-radius:999px; box-shadow:0 12px 30px -10px rgba(12,10,9,0.28); font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-size:16px; font-weight:600; text-decoration:none; transition:transform 0.2s ease, box-shadow 0.2s ease, bottom 0.3s ease`,
              )}
              className="dlh9"
            >
              <svg width={'26'} height={'26'} viewBox={'0 0 24 24'} aria-hidden={'true'}>
                <path
                  fill={'#25D366'}
                  d={
                    'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z'
                  }
                ></path>
              </svg>
              <span>{tr('Chat with us', AR)}</span>
            </a>
            <div
              onMouseEnter={v['closeMega']}
              onClick={v['closeMega']}
              style={css(
                `position:fixed; inset:0; z-index:40; background:rgba(231,229,228,0.35); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); opacity:${S(v['megaO'])}; pointer-events:${S(v['megaPE'])}; transition:opacity 0.35s ease`,
              )}
            ></div>
            {v['isHome'] ? <HomePage v={v} AR={AR} /> : null}
            {v['isFeatures'] ? <FeaturesPage v={v} AR={AR} /> : null}
            {v['isPricing'] ? <PricingPage v={v} AR={AR} /> : null}
            {v['isAbout'] ? <AboutPage v={v} AR={AR} /> : null}
            {v['is404'] ? <NotFoundPage v={v} AR={AR} /> : null}
            {v['isFaq'] ? <FaqPage v={v} AR={AR} /> : null}
            {v['isProduct'] ? <ProductPage v={v} AR={AR} /> : null}
            {v['isPrivacy'] ? <PrivacyPage v={v} AR={AR} /> : null}
            {v['isTerms'] ? <TermsPage v={v} AR={AR} /> : null}
            <Footer v={v} AR={AR} />
            {v['arPromptChip'] ? (
              <div className="dl-only-mob">
                {'\n  '}
                <div
                  data-no-ar={'1'}
                  dir={'rtl'}
                  style={{
                    position: 'fixed',
                    zIndex: '61',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '84px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff',
                    color: '#0c0a09',
                    border: '1px solid #e7e5e4',
                    borderRadius: '999px',
                    padding: '4px',
                    paddingInlineStart: '14px',
                    boxShadow: '0 12px 30px -12px rgba(12,10,9,0.35)',
                    fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{'تصفّح الموقع بالعربية؟'}</span>
                  <Btn
                    as="button"
                    onClick={v['setAr']}
                    style={{
                      background: '#0c0a09',
                      color: '#fff',
                      border: '0',
                      borderRadius: '999px',
                      height: '32px',
                      padding: '0 14px',
                      fontFamily: "'IBM Plex Sans Arabic',sans-serif",
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {'عربي'}
                  </Btn>
                  <Btn
                    as="button"
                    onClick={v['dismissAr']}
                    aria-label={'Close'}
                    style={{
                      background: 'none',
                      border: '0',
                      color: '#57534e',
                      fontSize: '13px',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                    }}
                  >
                    {'✕'}
                  </Btn>
                </div>
              </div>
            ) : null}
            {v['stickyBar'] ? (
              <>
                {'\n  '}
                <div style={{ height: '84px' }}></div>
                {'\n  '}
                <div
                  style={{
                    position: 'fixed',
                    left: '12px',
                    right: '12px',
                    bottom: '12px',
                    zIndex: '60',
                    background: '#0c0a09',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '8px',
                    paddingInlineStart: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 20px 40px -12px rgba(12,10,9,0.5)',
                  }}
                >
                  {'\n    '}
                  <span style={{ flex: '1', minWidth: '0', fontSize: '14px', color: '#d6d3d1' }}>
                    {tr('0% commission · Free plan', AR)}
                  </span>
                  {'\n    '}
                  <a
                    href={v['waChat']}
                    target={'_blank'}
                    rel={'noopener'}
                    aria-label={'WhatsApp'}
                    style={{
                      flex: 'none',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#292524',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width={'22'} height={'22'} viewBox={'0 0 24 24'} aria-hidden={'true'}>
                      <path
                        fill={'#25D366'}
                        d={
                          'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z'
                        }
                      ></path>
                    </svg>
                  </a>
                  {'\n    '}
                  <a
                    href={v['signupUrl']}
                    style={{
                      flex: 'none',
                      background: '#fff',
                      color: '#0c0a09',
                      border: '0',
                      borderRadius: '999px',
                      height: '44px',
                      padding: '0 20px',
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontSize: '15px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {tr('Start free', AR)}
                  </a>
                  {'\n  '}
                </div>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}

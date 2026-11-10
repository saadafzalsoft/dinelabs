// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function Footer({ v, AR }) {
  return (
    <>
      <footer style={{ borderTop: '1px solid #e7e5e4', background: '#f5f5f5' }}>
        {/* Desktop Footer */}
        <div className="dl-only-desk">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px clamp(20px,4vw,40px) 40px' }}>
          {'\n    '}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', justifyContent: 'space-between' }}>
            {'\n      '}
            <div
              style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}
            >
              {'\n        '}
              <img
                src={'/assets/dinelabs-logo.svg'}
                alt={'Dinelabs'}
                style={{ height: '22px', width: 'auto', alignSelf: 'flex-start' }}
              />
              {'\n        '}
              <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.5', color: '#4e4e4e' }}>
                {tr('Direct ordering for restaurants and coffee shops. Zero commission.', AR)}
              </p>
              {'\n        '}
              <a
                href={v['waDemo']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '4px',
                  background: '#0c0a09',
                  color: '#fff',
                  border: '0',
                  borderRadius: '999px',
                  height: '44px',
                  padding: '0 20px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                }}
                className="dlh3 dlh4"
              >
                {tr('Book a demo', AR)}
              </a>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                flex: '0 1 auto',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '36px clamp(28px,3.6vw,48px)',
              }}
            >
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0c0a09', marginBottom: '8px' }}>
                  {tr('Take orders', AR)}
                </div>
                <Btn
                  as="button"
                  onClick={v['goP']?.storefront}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Ordering page', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.pickup}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Pickup', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.dinein}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Table ordering', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.delivery}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Delivery', AR)}
                </Btn>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0c0a09', marginBottom: '8px' }}>
                  {tr('Sell more', AR)}
                </div>
                <Btn
                  as="button"
                  onClick={v['goP']?.addons}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Add-ons', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.translation}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Translation', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.branding}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Your branding', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.branches}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Multi-branch', AR)}
                </Btn>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0c0a09', marginBottom: '8px' }}>
                  {tr('Coming next', AR)}
                </div>
                <Btn
                  as="button"
                  onClick={v['goP']?.analysis}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Menu analysis', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.app}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Orders app', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.loyalty}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Loyalty stamps', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goP']?.payments}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Online payments', AR)}
                </Btn>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0c0a09', marginBottom: '8px' }}>
                  {tr('Company', AR)}
                </div>
                <Btn
                  as="button"
                  onClick={v['goFeatures']}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Features', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goPricing']}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Pricing', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goAbout']}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('About', AR)}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['goFaq']}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('FAQ', AR)}
                </Btn>
                <a
                  href={v['storeUrl']}
                  target={'_blank'}
                  rel={'noopener'}
                  style={{
                    background: 'none',
                    border: '0',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textDecoration: 'none',
                    boxSizing: 'border-box',
                  }}
                  className="dlha"
                >
                  {tr('Live demo', AR)}
                </a>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0c0a09', marginBottom: '8px' }}>
                  {tr('Legal', AR)}
                </div>
                <a
                  href="/terms"
                  style={{
                    display: 'block',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Terms & Conditions', AR)}
                </a>
                <a
                  href="/privacy"
                  style={{
                    display: 'block',
                    padding: '4px 0',
                    textAlign: 'start',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15px',
                    color: '#4e4e4e',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  className="dlha"
                >
                  {tr('Privacy Policy', AR)}
                </a>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0c0a09', marginBottom: '8px' }}>
                  {tr('Contact', AR)}
                </div>
                <a
                  href={v['waGeneral']}
                  target={'_blank'}
                  rel={'noopener'}
                  style={{ padding: '4px 0', fontSize: '15px', color: '#4e4e4e', textDecoration: 'none' }}
                  className="dlha"
                >
                  <bdi dir={'ltr'}>{'+961 71 407 202'}</bdi>
                </a>
                <a
                  href={'mailto:info@dinelabs.co'}
                  style={{ padding: '4px 0', fontSize: '15px', color: '#4e4e4e', textDecoration: 'none' }}
                  className="dlha"
                >
                  {tr('info@dinelabs.co', AR)}
                </a>
                <span style={{ padding: '4px 0', fontSize: '15px', color: '#4e4e4e' }}>
                  {tr('BDD, Bechara El Khoury, Beirut', AR)}
                </span>
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              marginTop: '56px',
              paddingTop: '24px',
              borderTop: '1px solid #e7e5e4',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '14px',
              color: '#777169',
            }}
          >
            {'\n      '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>{tr('© 2026 Dinelabs · Beirut', AR)}</span>
              <Btn
                as="button"
                data-demo-allow="1"
                data-no-ar="1"
                onClick={v['langSwitch']}
                aria-label={v['langSwitchAria']}
                title={v['langSwitchAria']}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'transparent',
                  border: '1px solid #e7e5e4',
                  borderRadius: '999px',
                  height: '34px',
                  padding: '0 14px',
                  cursor: 'pointer',
                  fontFamily: v['langSwitchFont'] || "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#57534e',
                  transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3a14 14 0 0 1 0 18" />
                  <path d="M12 3a14 14 0 0 0 0 18" />
                </svg>
                {val(v['langSwitchLabel'], AR)}
              </Btn>
              <span aria-hidden={'true'}>{'·'}</span>
              <a href="/privacy" style={{ color: '#777169', textDecoration: 'none' }} className="dlha">{tr('Privacy Policy', AR)}</a>
              <span aria-hidden={'true'}>{'·'}</span>
              <a href="/terms" style={{ color: '#777169', textDecoration: 'none' }} className="dlha">{tr('Terms & Conditions', AR)}</a>
            </div>
            {'\n      '}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={v['waGeneral']}
                  target={'_blank'}
                  rel={'noopener'}
                  style={{ color: '#777169', textDecoration: 'none' }}
                  className="dlha"
                >
                  {tr('WhatsApp', AR)}
                </a>
                <span aria-hidden={'true'}>{'·'}</span>
                <a
                  href={v['igUrl']}
                  target={'_blank'}
                  rel={'noopener'}
                  style={{ color: '#777169', textDecoration: 'none' }}
                  className="dlha"
                >
                  {tr('Instagram', AR)}
                </a>
                <span aria-hidden={'true'}>{'·'}</span>
                <a
                  href={v['liUrl']}
                  target={'_blank'}
                  rel={'noopener'}
                  style={{ color: '#777169', textDecoration: 'none' }}
                  className="dlha"
                >
                  {tr('LinkedIn', AR)}
                </a>
              </span>
              <div
                data-no-ar={'1'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f0efed',
                  borderRadius: '999px',
                  padding: '3px',
                }}
              >
                <Btn
                  as="button"
                  onClick={v['setEn']}
                  style={css(
                    `border:0; cursor:pointer; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-size:13px; font-weight:500; background:${S(v['enBg'])}; color:${S(v['enColor'])}; box-shadow:${S(v['enShadow'])}; border-radius:999px; padding:4px 10px`,
                  )}
                >
                  {'EN'}
                </Btn>
                <Btn
                  as="button"
                  onClick={v['setAr']}
                  style={css(
                    `border:0; cursor:pointer; font-family:'IBM Plex Sans Arabic',sans-serif; font-size:13px; font-weight:500; background:${S(v['arBg'])}; color:${S(v['arColor'])}; box-shadow:${S(v['arShadow'])}; border-radius:999px; padding:4px 10px`,
                  )}
                >
                  {'عربي'}
                </Btn>
              </div>
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
        </div>
        {/* Mobile Footer */}
        <div className="dl-only-mob">
          <div style={{ padding: '40px 20px calc(28px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <img
                src="/assets/dinelabs-logo.svg"
                alt="Dinelabs"
                style={{ height: '20px', width: 'auto', alignSelf: 'flex-start' }}
              />
              <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', color: '#4e4e4e', textWrap: 'pretty' }}>
                {tr('Direct ordering for restaurants and coffee shops. Zero commission.', AR)}
              </p>
              <a
                href={v['waDemo']}
                target="_blank"
                rel="noopener"
                style={{
                  marginTop: '6px',
                  height: '50px',
                  borderRadius: '999px',
                  background: '#0c0a09',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'transform 0.15s ease, background-color 0.12s ease',
                }}
              >
                {tr('Book a demo', AR)}
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '28px 20px', paddingTop: '28px', borderTop: '1px solid #e7e5e4' }}>
              {/* Take orders */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '6px' }}>
                  {tr('Take orders', AR)}
                </div>
                <Btn as="button" onClick={v['goP']?.storefront} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Ordering page', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.pickup} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Pickup', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.dinein} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Table ordering', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.delivery} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Delivery', AR)}
                </Btn>
              </div>

              {/* Sell more */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '6px' }}>
                  {tr('Sell more', AR)}
                </div>
                <Btn as="button" onClick={v['goP']?.addons} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Add-ons', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.translation} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Translation', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.branding} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Your branding', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.branches} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Multi-branch', AR)}
                </Btn>
              </div>

              {/* Coming next */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '6px' }}>
                  {tr('Coming next', AR)}
                </div>
                <Btn as="button" onClick={v['goP']?.analysis} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Menu analysis', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.app} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Orders app', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.loyalty} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Loyalty stamps', AR)}
                </Btn>
                <Btn as="button" onClick={v['goP']?.payments} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Online payments', AR)}
                </Btn>
              </div>

              {/* Company */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '6px' }}>
                  {tr('Company', AR)}
                </div>
                <Btn as="button" onClick={v['goFeatures']} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Features', AR)}
                </Btn>
                <Btn as="button" onClick={v['goPricing']} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Pricing', AR)}
                </Btn>
                <Btn as="button" onClick={v['goAbout']} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('About', AR)}
                </Btn>
                <Btn as="button" onClick={v['goFaq']} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('FAQ', AR)}
                </Btn>
              </div>

              {/* Legal */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '6px' }}>
                  {tr('Legal', AR)}
                </div>
                <Btn as="button" onClick={v['goTerms']} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Terms & Conditions', AR)}
                </Btn>
                <Btn as="button" onClick={v['goPrivacy']} style={{ background: 'none', border: 0, padding: 0, height: '36px', textAlign: 'start', fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)", fontSize: '15px', color: '#4e4e4e', cursor: 'pointer' }}>
                  {tr('Privacy Policy', AR)}
                </Btn>
              </div>
            </div>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '28px', borderTop: '1px solid #e7e5e4' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '6px' }}>
                {tr('Contact', AR)}
              </div>
              <a href={v['waGeneral']} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', height: '36px', fontSize: '15px', color: '#4e4e4e', textDecoration: 'none' }}>
                <bdi dir="ltr">+961 71 407 202</bdi>
              </a>
              <a href="mailto:info@dinelabs.co" style={{ display: 'flex', alignItems: 'center', height: '36px', fontSize: '15px', color: '#4e4e4e', textDecoration: 'none' }}>
                info@dinelabs.co
              </a>
              <span style={{ display: 'flex', alignItems: 'center', minHeight: '36px', fontSize: '15px', color: '#4e4e4e' }}>
                {tr('BDD, Bechara El Khoury, Beirut', AR)}
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <a href={v['waGeneral']} target="_blank" rel="noopener" style={{ height: '36px', padding: '0 14px', borderRadius: '999px', border: '1px solid #e7e5e4', background: '#fff', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: '500', color: '#292524', textDecoration: 'none' }}>
                  {tr('WhatsApp', AR)}
                </a>
                <a href={v['igUrl']} target="_blank" rel="noopener" style={{ height: '36px', padding: '0 14px', borderRadius: '999px', border: '1px solid #e7e5e4', background: '#fff', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: '500', color: '#292524', textDecoration: 'none' }}>
                  {tr('Instagram', AR)}
                </a>
                <a href={v['liUrl']} target="_blank" rel="noopener" style={{ height: '36px', padding: '0 14px', borderRadius: '999px', border: '1px solid #e7e5e4', background: '#fff', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: '500', color: '#292524', textDecoration: 'none' }}>
                  {tr('LinkedIn', AR)}
                </a>
              </div>
            </div>

            {/* Mobile Footer Bottom */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e7e5e4', fontSize: '13px', color: '#777169' }}>
              <span>{tr('© 2026 Dinelabs · Beirut', AR)}</span>
              <Btn
                as="button"
                data-demo-allow="1"
                data-no-ar="1"
                dir="ltr"
                onClick={v['langSwitch']}
                aria-label={v['langSwitchAria']}
                title={v['langSwitchAria']}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '34px',
                  padding: '0 4px',
                  border: '0',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  color: '#a8a29e',
                }}
              >
                <span style={{ color: v['langEnC'] || '#0c0a09', transition: 'color 0.2s ease' }}>{'EN'}</span>
                <span style={{ width: '1px', height: '12px', background: '#d6d3d1' }} />
                <span style={{ color: v['langArC'] || '#a8a29e', transition: 'color 0.2s ease' }}>{'AR'}</span>
              </Btn>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

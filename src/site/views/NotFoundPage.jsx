// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function NotFoundPage({ v, AR }) {
  return (
    <>
      <main>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, #a8c8e8 0%, rgba(168,200,232,0) 68%); top:-320px; left:-160px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, #f4c5a8 0%, rgba(244,197,168,0) 68%); bottom:-300px; right:-140px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '900px',
              margin: '0 auto',
              minHeight: 'calc(100vh - 68px)',
              boxSizing: 'border-box',
              padding: 'clamp(64px,9vw,112px) clamp(20px,4vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {'\n      '}
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '18px',
                padding: '22px 24px',
                boxShadow: '0 30px 60px -32px rgba(12,10,9,0.35)',
                transform: 'rotate(-2deg)',
                textAlign: 'start',
                fontSize: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {'\n        '}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    fontSize: '18px',
                  }}
                >
                  {tr('Order #404', AR)}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#fde2e2',
                    color: '#991b1b',
                    borderRadius: '999px',
                    padding: '4px 10px',
                  }}
                >
                  {tr('Sold out', AR)}
                </span>
              </div>
              {'\n        '}
              <div style={{ borderTop: '1px dashed #d6d3d1' }}></div>
              {'\n        '}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span>{tr('1 × The page you wanted', AR)}</span>
                <span style={{ color: '#777169' }}>{'$0'}</span>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#777169' }}>
                <span>{tr('Note', AR)}</span>
                <span>{tr('“Extra crispy”', AR)}</span>
              </div>
              {'\n        '}
              <div style={{ borderTop: '1px dashed #d6d3d1' }}></div>
              {'\n        '}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontWeight: '600' }}>
                <span>{tr('Commission', AR)}</span>
                <span>{'0%'}</span>
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <h1
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(40px,5.6vw,72px)',
                lineHeight: '1.02',
                letterSpacing: '-0.035em',
                margin: '48px 0 0',
                textWrap: 'balance',
              }}
            >
              {tr('The kitchen can’t find this page.', AR)}
            </h1>
            {'\n      '}
            <p
              style={{
                fontSize: 'clamp(16px,1.5vw,19px)',
                lineHeight: '1.55',
                color: '#4e4e4e',
                margin: '18px 0 0',
                maxWidth: '500px',
                textWrap: 'pretty',
              }}
            >
              {tr('We checked the fridge, the oven and under the counter. The link is probably old or has a typo.', AR)}
            </p>
            {'\n      '}
            <div
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '32px' }}
            >
              {'\n        '}
              <Btn
                as="button"
                onClick={v['goHome']}
                style={{
                  background: '#0c0a09',
                  color: '#fff',
                  border: '0',
                  borderRadius: '999px',
                  height: '50px',
                  padding: '0 26px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {tr('Back to home', AR)}
              </Btn>
              {'\n        '}
              <Btn
                as="button"
                onClick={v['goBack']}
                style={{
                  background: '#fff',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  borderRadius: '999px',
                  height: '50px',
                  padding: '0 24px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {tr('Go back', AR)}
              </Btn>
              {'\n      '}
            </div>
            {'\n      '}
            <a
              href={v['wa404']}
              target={'_blank'}
              rel={'noopener'}
              style={{
                marginTop: '24px',
                fontSize: '15px',
                color: '#4e4e4e',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              {tr('Looking for something specific? Ask us on WhatsApp', AR)}
            </a>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
      </main>
    </>
  );
}

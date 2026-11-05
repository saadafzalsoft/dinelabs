// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';
import StoreScreen from '../StoreScreen';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function HomePage({ v, AR }) {
  return (
    <>
      <main>
        {'\n\n  '}
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: 'clamp(24px,7vw,88px) clamp(20px,4vw,40px) clamp(40px,5vw,64px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {'\n      '}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#292524',
              }}
            >
              {'\n        '}
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0c0a09' }}></span>
              {tr('Free to start, free to keep', AR)}
            </div>
            {'\n      '}
            <h1
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '600',
                fontSize: 'clamp(44px,6.8vw,80px)',
                lineHeight: '1.04',
                letterSpacing: '-0.04em',
                margin: 'clamp(16px,2.5vw,24px) auto 0',
                maxWidth: '960px',
                textWrap: 'balance',
              }}
            >
              {tr('Commission-free online ordering menu.', AR)}
            </h1>
            {'\n      '}
            <p
              style={{
                fontSize: 'clamp(17px,1.8vw,21px)',
                lineHeight: '1.55',
                color: '#4e4e4e',
                margin: 'clamp(14px,2.5vw,24px) auto 0',
                maxWidth: '680px',
                textWrap: 'pretty',
              }}
            >
              {tr(
                'Turn your menu into your own ordering page for pickup, delivery and table orders. Built for restaurants and coffee shops, with nothing for guests to download.',
                AR,
              )}
            </p>
            {'\n      '}
            <div
              data-cta-pulse={'1'}
              style={css(
                `animation:dlCtaPulse 2.4s ease-in-out infinite; display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:clamp(20px,3.3vw,32px); width:100%; max-width:560px; background:#fff; border:1px solid #e7e5e4; border-radius:${S(v['searchR'])}; padding:6px; box-shadow:0 0 0 6px rgba(167,229,211,0.35), 0 18px 40px -20px rgba(12,10,9,0.25); box-sizing:border-box`,
              )}
            >
              {'\n        '}
              <input
                type={'text'}
                placeholder={tr('Your restaurant name', AR)}
                aria-label={'Your restaurant name'}
                value={dflt(v['heroName'], '')}
                onChange={v['setHeroName']}
                onKeyDown={v['heroKey']}
                style={{
                  flex: '1 1 160px',
                  minWidth: '0',
                  height: '48px',
                  border: '0',
                  background: 'transparent',
                  padding: '0 16px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  color: '#0c0a09',
                  outline: 'none',
                }}
              />
              {'\n        '}
              <a
                href={v['heroSignupUrl']}
                onClick={() => {
                  try {
                    const hName = v['heroName'] ? String(v['heroName']).trim() : '';
                    if (hName) localStorage.setItem('dl_prefill_store', hName);
                  } catch (e) {}
                }}
                style={{
                  flex: '0 0 auto',
                  background: '#0c0a09',
                  color: '#fff',
                  border: '0',
                  borderRadius: '999px',
                  height: '48px',
                  padding: '0 22px',
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
                onMouseEnter={v['heroHoverOn']}
                onMouseLeave={v['heroHoverOff']}
              >
                <span>{tr('Start free', AR)}</span>
                <span
                  aria-hidden={'true'}
                  style={css(
                    `display:inline-block; overflow:hidden; white-space:nowrap; transition:max-width 0.2s ease, opacity 0.2s ease, margin 0.2s ease; max-width:${S(v['heroArrowW'])}; opacity:${S(v['heroArrowO'])}; margin-inline-start:${S(v['heroArrowM'])}`,
                  )}
                >
                  {val(v['heroArrow'], AR)}
                </span>
              </a>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px 20px',
                marginTop: '18px',
                fontSize: '14px',
                color: '#777169',
              }}
            >
              {'\n        '}
              <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '9px' }}>
                <span
                  style={{
                    flex: 'none',
                    width: '17px',
                    height: '17px',
                    marginTop: '0.12em',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 0 0 1px #e7e5e4, 0 1px 2px rgba(12,10,9,0.06)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width={'10'}
                    height={'10'}
                    viewBox={'0 0 12 12'}
                    fill={'none'}
                    stroke={'#777169'}
                    strokeWidth={'2'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                  >
                    <path d={'M2.5 6.2l2.4 2.4 4.6-5'}></path>
                  </svg>
                </span>
                <span>{tr('No card needed', AR)}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '9px' }}>
                <span
                  style={{
                    flex: 'none',
                    width: '17px',
                    height: '17px',
                    marginTop: '0.12em',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 0 0 1px #e7e5e4, 0 1px 2px rgba(12,10,9,0.06)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width={'10'}
                    height={'10'}
                    viewBox={'0 0 12 12'}
                    fill={'none'}
                    stroke={'#777169'}
                    strokeWidth={'2'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                  >
                    <path d={'M2.5 6.2l2.4 2.4 4.6-5'}></path>
                  </svg>
                </span>
                <span>{tr('Cancel anytime', AR)}</span>
              </span>
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
      </main>
    </>
  );
}

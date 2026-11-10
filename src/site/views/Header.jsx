// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function Header({ v, AR }) {
  return (
    <>
      <header
        onMouseLeave={v['closeMega']}
        style={css(
          `position:sticky; top:0; z-index:50; padding:${S(v['hdr']?.pad)}; background:${S(v['hdr']?.bg)}; backdrop-filter:${S(v['hdr']?.blur)}; -webkit-backdrop-filter:${S(v['hdr']?.blur)}; border-bottom:1px solid ${S(v['hdr']?.border)}; transition:padding 0.45s cubic-bezier(.2,.8,.2,1), background-color 0.3s ease, border-color 0.3s ease`,
        )}
      >
        {'\n  '}
        <div
          style={css(
            `max-width:${S(v['hdr']?.max)}; margin:0 auto; padding:0 ${S(v['hdr']?.inPad)}; height:${S(v['hdr']?.h)}; display:flex; align-items:center; gap:28px; background:${S(v['hdr']?.barBg)}; backdrop-filter:${S(v['hdr']?.barBlur)}; -webkit-backdrop-filter:${S(v['hdr']?.barBlur)}; border:1px solid ${S(v['hdr']?.barBorder)}; border-radius:${S(v['hdr']?.radius)}; box-shadow:${S(v['hdr']?.shadow)}; box-sizing:border-box; transition:max-width 0.5s cubic-bezier(.2,.8,.2,1), height 0.4s ease, padding 0.4s ease, border-radius 0.5s ease, background-color 0.3s ease, box-shadow 0.4s ease, border-color 0.3s ease`,
          )}
        >
          {'\n    '}
          <Btn
            as="button"
            onClick={v['goHome']}
            onMouseEnter={v['closeMega']}
            style={{
              background: 'none',
              border: '0',
              padding: '0',
              height: '42px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'opacity 0.18s ease',
            }}
            className="dlh0"
          >
            {'\n      '}
            <span style={{ position: 'relative', display: 'block', height: '18px', width: '90px' }}>
              <img
                src={'/assets/dinelabs-logo.svg'}
                alt={'Dinelabs'}
                style={css(
                  `height:18px; width:90px; display:block; clip-path:${S(v['logoClip'])}; transition:${S(v['logoTr'])}`,
                )}
              />
            </span>
            {'\n    '}
          </Btn>
          {'\n    '}
          <div className="dl-only-desk">
            {'\n      '}
            <nav style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {'\n        '}
              <Btn
                as="button"
                onMouseEnter={v['openMega']}
                onClick={v['toggleMega']}
                style={css(
                  `display:flex; align-items:center; gap:6px; background:${S(v['productBg'])}; border:0; border-radius:999px; padding:9px 14px; cursor:pointer; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-size:15px; font-weight:500; color:#0c0a09; transition:filter 0.18s ease`,
                )}
                className="dlh1"
              >
                {tr('Product', AR)}
                <svg
                  width={'12'}
                  height={'12'}
                  viewBox={'0 0 24 24'}
                  fill={'none'}
                  stroke={'#777169'}
                  strokeWidth={'2.4'}
                  strokeLinecap={'round'}
                  strokeLinejoin={'round'}
                  style={css(`transform:${S(v['chevron'])}; transition:transform 0.3s ease`)}
                >
                  <path d={'M6 9l6 6 6-6'}></path>
                </svg>
              </Btn>
              {'\n        '}
              {arr(v['navItems']).map((L0_n, I1) => (
                <React.Fragment key={I1}>
                  {'\n          '}
                  <Btn
                    as="button"
                    onClick={L0_n?.onClick}
                    onMouseEnter={v['closeMega']}
                    style={css(
                      `background:${S(L0_n?.bg)}; border:0; border-radius:999px; padding:9px 14px; cursor:pointer; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-size:15px; font-weight:500; color:#0c0a09`,
                    )}
                    className="dlh2"
                  >
                    {val(L0_n?.label, AR)}
                  </Btn>
                  {'\n        '}
                </React.Fragment>
              ))}
              {'\n      '}
            </nav>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: v['hdrRGap'] || '10px' }}>
            {/* Language Switcher */}
            <Btn
              as="button"
              data-demo-allow="1"
              data-no-ar="1"
              dir="ltr"
              onClick={v['langSwitch']}
              aria-label={v['langSwitchAria']}
              title={v['langSwitchAria']}
              style={{
                flex: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 8px',
                border: '0',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontSize: '13px',
                fontWeight: '500',
                letterSpacing: '0.04em',
                color: '#a8a29e',
              }}
              className="dlh0"
            >
              <span style={{ color: v['langEnC'] || '#0c0a09', transition: 'color 0.2s ease' }}>{'EN'}</span>
              <span style={{ width: '1px', height: '12px', background: '#d6d3d1' }}></span>
              <span style={{ color: v['langArC'] || '#a8a29e', transition: 'color 0.2s ease' }}>{'AR'}</span>
            </Btn>

            {/* Book a Demo Button */}
            <div className="dl-only-desk">
              <a
                href={v['waDemo']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  background: 'transparent',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  borderRadius: '999px',
                  height: '42px',
                  padding: '0 18px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.18s ease, border-color 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                }}
                className="dlh2"
              >
                {tr('Book a demo', AR)}
              </a>
            </div>
            <a
              href={v['signupUrl']}
              style={{
                background: '#0c0a09',
                color: '#fff',
                border: '0',
                borderRadius: '999px',
                height: '42px',
                padding: '0 20px',
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
              className="dlh3 dlh4"
            >
              {val(v['headerCta'], AR)}
            </a>
            {'\n      '}
            <div className="dl-only-mob">
              {'\n        '}
              <Btn
                as="button"
                onClick={v['toggleMenu']}
                aria-label={v['menuLabel']}
                aria-expanded={v['menuOpen']}
                style={{
                  position: 'relative',
                  flex: 'none',
                  background: '#f0efed',
                  border: '0',
                  borderRadius: '999px',
                  width: '42px',
                  height: '42px',
                  cursor: 'pointer',
                  transition: 'background 0.18s ease, transform 0.15s ease',
                }}
                className="dlh5"
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    right: '13px',
                    top: '50%',
                    height: '1.6px',
                    marginTop: '-0.8px',
                    borderRadius: '2px',
                    background: '#0c0a09',
                    transform: v['bar1T'] || 'translateY(-4px)',
                    transition: 'transform 0.3s cubic-bezier(.2,.8,.2,1)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    right: '13px',
                    top: '50%',
                    height: '1.6px',
                    marginTop: '-0.8px',
                    borderRadius: '2px',
                    background: '#0c0a09',
                    transform: v['bar2T'] || 'translateY(4px)',
                    transition: 'transform 0.3s cubic-bezier(.2,.8,.2,1)',
                  }}
                />
              </Btn>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
        {'\n\n  '}
        <div
          style={css(
            `position:absolute; left:0; right:0; top:100%; padding-top:10px; pointer-events:${S(v['megaPE'])}`,
          )}
        >
          {'\n    '}
          <div
            style={css(
              `width:min(1160px, calc(100vw - 32px)); margin:0 auto; background:#fff; border:1px solid #e7e5e4; border-radius:24px; box-shadow:0 40px 80px -30px rgba(12,10,9,0.3); opacity:${S(v['megaO'])}; transform:${S(v['megaT'])}; transform-origin:top center; transition:opacity 0.28s ease, transform 0.38s cubic-bezier(.2,.8,.2,1)`,
            )}
          >
            {'\n      '}
            <div
              style={{
                padding: '28px',
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1.25fr)',
                gap: '12px',
              }}
            >
              {'\n          '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {'\n            '}
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#78716c', padding: '6px 12px 12px' }}>
                  {tr('Take orders', AR)}
                </div>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.storefront}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M3 9l1.5-5h15L21 9'}></path>
                    <path d={'M4 9v11h16V9'}></path>
                    <path d={'M3 9h18'}></path>
                    <path d={'M9 20v-6h6v6'}></path>
                  </svg>
                  <span>{tr('Ordering page', AR)}</span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.pickup}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M6 7h12l1 14H5L6 7z'}></path>
                    <path d={'M9 7a3 3 0 0 1 6 0'}></path>
                  </svg>
                  <span>{tr('Pickup', AR)}</span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.dinein}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <rect x={'3'} y={'3'} width={'7'} height={'7'} rx={'1'}></rect>
                    <rect x={'14'} y={'3'} width={'7'} height={'7'} rx={'1'}></rect>
                    <rect x={'3'} y={'14'} width={'7'} height={'7'} rx={'1'}></rect>
                    <path d={'M14 14h3v3h-3z'}></path>
                    <path d={'M17 20h4v-3'}></path>
                  </svg>
                  <span>{tr('Table ordering', AR)}</span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.delivery}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <circle cx={'5.5'} cy={'17'} r={'3.5'}></circle>
                    <circle cx={'18.5'} cy={'17'} r={'3.5'}></circle>
                    <path d={'M15 6h2l1.5 11'}></path>
                    <path d={'M5.5 17l4-7h7'}></path>
                  </svg>
                  <span>{tr('Delivery', AR)}</span>
                </Btn>
                {'\n          '}
              </div>
              {'\n          '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {'\n            '}
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#78716c', padding: '6px 12px 12px' }}>
                  {tr('Sell more', AR)}
                </div>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.addons}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M3 17l6-6 4 4 8-8'}></path>
                    <path d={'M15 7h6v6'}></path>
                  </svg>
                  <span>{tr('Add-ons', AR)}</span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.translation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M4 5h8'}></path>
                    <path d={'M8 3v2'}></path>
                    <path d={'M6 5c0 4 3 7 6 8'}></path>
                    <path d={'M11 5c-1 4-4 7-7 8'}></path>
                    <path d={'M13 21l4-9 4 9'}></path>
                    <path d={'M14.5 18h5'}></path>
                  </svg>
                  <span>{tr('Translation', AR)}</span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.branding}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z'}></path>
                  </svg>
                  <span>{tr('Your branding', AR)}</span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.branches}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z'}></path>
                    <circle cx={'12'} cy={'10'} r={'2.5'}></circle>
                  </svg>
                  <span>{tr('Multi-branch', AR)}</span>
                </Btn>
                {'\n          '}
              </div>
              {'\n          '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {'\n            '}
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#78716c', padding: '6px 12px 12px' }}>
                  {tr('Coming next', AR)}
                </div>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.analysis}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M4 20V11'}></path>
                    <path d={'M10 20V5'}></path>
                    <path d={'M16 20v-6'}></path>
                    <path d={'M2 20h20'}></path>
                  </svg>
                  <span>{tr('Menu analysis', AR)}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#0c0a09',
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '3px 9px',
                    }}
                  >
                    {tr('Waitlist', AR)}
                  </span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.app}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <rect x={'6'} y={'2.5'} width={'12'} height={'19'} rx={'2.5'}></rect>
                    <path d={'M11 18h2'}></path>
                  </svg>
                  <span>{tr('Orders app', AR)}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#f0efed',
                      color: '#777169',
                      borderRadius: '999px',
                      padding: '3px 9px',
                    }}
                  >
                    {tr('Soon', AR)}
                  </span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.loyalty}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <path d={'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z'}></path>
                  </svg>
                  <span>{tr('Loyalty stamps', AR)}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#f0efed',
                      color: '#777169',
                      borderRadius: '999px',
                      padding: '3px 9px',
                    }}
                  >
                    {tr('Soon', AR)}
                  </span>
                </Btn>
                {'\n            '}
                <Btn
                  as="button"
                  onClick={v['goP']?.payments}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    textAlign: 'start',
                    background: 'transparent',
                    border: '0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '15.5px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    transition: 'background 0.2s ease, transform 0.25s ease',
                  }}
                  className="dlh6"
                >
                  <svg
                    width={'22'}
                    height={'22'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'#57534e'}
                    strokeWidth={'1.5'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: '0 0 auto' }}
                  >
                    <rect x={'2.5'} y={'5'} width={'19'} height={'14'} rx={'2'}></rect>
                    <path d={'M2.5 10h19'}></path>
                  </svg>
                  <span>{tr('Online payments', AR)}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#f0efed',
                      color: '#777169',
                      borderRadius: '999px',
                      padding: '3px 9px',
                    }}
                  >
                    {tr('Soon', AR)}
                  </span>
                </Btn>
                {'\n          '}
              </div>
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  paddingInlineStart: '16px',
                  borderInlineStart: '1px solid #f0efed',
                }}
              >
                {'\n          '}
                <a
                  href={v['storeUrl']}
                  target={'_blank'}
                  rel={'noopener'}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    flex: '1',
                    textAlign: 'start',
                    background: '#0c0a09',
                    color: '#fff',
                    border: '0',
                    borderRadius: '18px',
                    padding: '22px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: '150px',
                    boxSizing: 'border-box',
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease',
                  }}
                  className="dlh7"
                >
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      width: '320px',
                      height: '320px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(244,197,168,0.55) 0%, rgba(244,197,168,0) 65%)',
                      top: '-150px',
                      right: '-110px',
                    }}
                  ></span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'relative',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#a8a29e',
                    }}
                  >
                    {tr('Try it as a guest', AR)}
                  </span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'relative',
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontSize: '24px',
                      fontWeight: '500',
                      letterSpacing: '-0.02em',
                      lineHeight: '1.15',
                      marginTop: '8px',
                    }}
                  >
                    {tr('See a live store →', AR)}
                  </span>
                  {'\n          '}
                </a>
                {'\n          '}
                <Btn
                  as="button"
                  onClick={v['goPricing']}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    flex: '1',
                    textAlign: 'start',
                    background: '#f5f5f5',
                    color: '#0c0a09',
                    border: '0',
                    borderRadius: '18px',
                    padding: '22px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: '150px',
                    transition: 'transform 0.3s ease',
                  }}
                  className="dlh8"
                >
                  {'\n            '}
                  <span
                    style={{
                      position: 'absolute',
                      width: '300px',
                      height: '300px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(167,229,211,0.9) 0%, rgba(167,229,211,0) 65%)',
                      top: '-150px',
                      right: '-100px',
                    }}
                  ></span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'relative',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#777169',
                    }}
                  >
                    {tr('Savings calculator', AR)}
                  </span>
                  {'\n            '}
                  <span
                    style={{
                      position: 'relative',
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontSize: '24px',
                      fontWeight: '500',
                      letterSpacing: '-0.02em',
                      lineHeight: '1.15',
                      marginTop: '8px',
                    }}
                  >
                    {tr('See what you’d keep →', AR)}
                  </span>
                  {'\n          '}
                </Btn>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                borderTop: '1px solid #f0efed',
                padding: '14px 28px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Btn
                as="button"
                onClick={v['goFeatures']}
                style={{
                  background: 'none',
                  border: '0',
                  padding: '4px 0',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#0c0a09',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  transition: 'opacity 0.18s ease',
                }}
                className="dlh0"
              >
                {tr('See all features →', AR)}
              </Btn>
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
        {'\n\n  '}
        {v['menuOpen'] ? (
          <div
            data-manim="1"
            style={{
              animation: 'dlSheetIn 0.32s cubic-bezier(.2,.8,.2,1) both',
              borderTop: '1px solid #e7e5e4',
              background: '#fff',
              height: `calc(100dvh - ${v['hdr']?.h || '68px'})`,
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ flex: '1', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '8px 20px 16px' }}>
              <Btn
                as="button"
                data-manim="1"
                data-demo-allow="1"
                onClick={v['toggleMProd']}
                aria-expanded={v['mProdOpen']}
                style={{
                  animation: 'dlRowIn 0.42s cubic-bezier(.2,.8,.2,1) 0.05s both',
                  transition: 'opacity 0.15s ease',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  background: 'none',
                  border: '0',
                  borderBottom: '1px solid #f0efed',
                  padding: '0',
                  height: '60px',
                  textAlign: 'start',
                  cursor: 'pointer',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '20px',
                  fontWeight: '500',
                  letterSpacing: '-0.01em',
                  color: '#0c0a09',
                }}
              >
                {tr('Product', AR)}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a8a29e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    flex: 'none',
                    transform: `rotate(${v['mProdRot'] || '0deg'})`,
                    transition: 'transform 0.3s cubic-bezier(.2,.8,.2,1)',
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Btn>

              {v['mProdOpen'] ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '16px 0 20px', borderBottom: '1px solid #f0efed' }}>
                  {arr(v['mobileGroups']).map((g, gIdx) => (
                    <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div
                        data-manim="1"
                        style={{
                          animation: `dlRowIn 0.36s cubic-bezier(.2,.8,.2,1) ${g.d || '0s'} both`,
                          fontSize: '12px',
                          fontWeight: '600',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#a8a29e',
                          padding: '0 0 6px',
                        }}
                      >
                        {tr(g.name, AR)}
                      </div>
                      {arr(g.items).map((it, itIdx) => (
                        <Btn
                          as="button"
                          key={itIdx}
                          data-manim="1"
                          onClick={it.onClick}
                          style={{
                            animation: `dlRowIn 0.36s cubic-bezier(.2,.8,.2,1) ${it.d || '0s'} both`,
                            transition: 'background 0.15s ease, transform 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: 'calc(100% + 20px)',
                            background: 'none',
                            border: '0',
                            borderRadius: '12px',
                            padding: '0 10px',
                            margin: '0 -10px',
                            height: '46px',
                            textAlign: 'start',
                            cursor: 'pointer',
                            fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#292524',
                          }}
                        >
                          <span style={{ flex: '1', minWidth: 0 }}>{val(it.title, AR)}</span>
                          {it.soon ? (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                letterSpacing: '0.04em',
                                color: '#777169',
                                background: '#f0efed',
                                borderRadius: '999px',
                                padding: '3px 8px',
                              }}
                            >
                              {tr('Soon', AR)}
                            </span>
                          ) : null}
                        </Btn>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}

              {arr(v['mobileNav']).map((n, nIdx) => (
                <Btn
                  as="button"
                  key={nIdx}
                  data-manim="1"
                  onClick={n.onClick}
                  style={{
                    animation: `dlRowIn 0.42s cubic-bezier(.2,.8,.2,1) ${n.d || '0.1s'} both`,
                    transition: 'opacity 0.15s ease',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: 'none',
                    border: '0',
                    borderBottom: '1px solid #f0efed',
                    padding: '0',
                    height: '60px',
                    textAlign: 'start',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontSize: '20px',
                    fontWeight: '500',
                    letterSpacing: '-0.01em',
                    color: '#0c0a09',
                  }}
                >
                  {val(n.label, AR)}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a8a29e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flex: 'none', transform: `rotate(${v['chevSide'] || '-90deg'})` }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Btn>
              ))}
            </div>

            <div
              data-manim="1"
              style={{
                animation: 'dlRowIn 0.46s cubic-bezier(.2,.8,.2,1) 0.26s both',
                flex: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '16px 20px calc(20px + env(safe-area-inset-bottom))',
                borderTop: '1px solid #f0efed',
                background: '#fff',
              }}
            >
              <a
                href={v['signupUrl']}
                style={{
                  transition: 'transform 0.15s ease, background-color 0.12s ease',
                  height: '52px',
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
                }}
              >
                {val(v['headerCta'], AR)}
              </a>
              <a
                href={v['waDemo']}
                target="_blank"
                rel="noopener"
                style={{
                  transition: 'transform 0.15s ease, background-color 0.12s ease',
                  height: '52px',
                  borderRadius: '999px',
                  background: '#fff',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                {tr('Book a demo', AR)}
              </a>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '6px' }}>
                <a
                  href={v['waChat']}
                  target="_blank"
                  rel="noopener"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#57534e', textDecoration: 'none' }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
                  {tr('WhatsApp us', AR)}
                </a>
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
        ) : null}
      </header>
    </>
  );
}

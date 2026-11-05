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
        <div
          style={css(
            `max-width:${S(v['hdr']?.max)}; margin:0 auto; padding:0 ${S(v['hdr']?.inPad)}; height:${S(v['hdr']?.h)}; display:flex; align-items:center; gap:28px; background:${S(v['hdr']?.barBg)}; backdrop-filter:${S(v['hdr']?.barBlur)}; -webkit-backdrop-filter:${S(v['hdr']?.barBlur)}; border:1px solid ${S(v['hdr']?.barBorder)}; border-radius:${S(v['hdr']?.radius)}; box-shadow:${S(v['hdr']?.shadow)}; box-sizing:border-box; transition:max-width 0.5s cubic-bezier(.2,.8,.2,1), height 0.4s ease, padding 0.4s ease, border-radius 0.5s ease, background-color 0.3s ease, box-shadow 0.4s ease, border-color 0.3s ease`,
          )}
        >
          {/* Logo */}
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
            <span style={{ position: 'relative', display: 'block', height: '18px', width: '90px' }}>
              <img
                src={'/assets/dinelabs-logo.svg'}
                alt={'Dinelabs'}
                style={css(
                  `height:18px; width:90px; display:block; clip-path:${S(v['logoClip'])}; transition:${S(v['logoTr'])}`,
                )}
              />
            </span>
          </Btn>

          {/* Desktop Navigation */}
          <div className="dl-only-desk">
            <nav style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
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

              {arr(v['navItems']).map((L0_n, I1) => (
                <React.Fragment key={I1}>
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
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language Switcher */}
            <div className="dl-only-desk">
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
            </div>

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

            {/* Start Free Button */}
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

            {/* Mobile Hamburger Button */}
            <div className="dl-only-mob">
              <Btn
                as="button"
                onClick={v['toggleMenu']}
                aria-label={v['menuLabel']}
                aria-expanded={v['menuOpen']}
                style={{
                  background: 'none',
                  border: '0',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0c0a09',
                }}
              >
                <svg width={'22'} height={'22'} viewBox={'0 0 24 24'} fill={'none'} stroke={'currentColor'} strokeWidth={'2'}>
                  <path d={v['menuOpen'] ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
                </svg>
              </Btn>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {v['megaOpen'] ? (
          <div
            onMouseEnter={v['openMega']}
            onMouseLeave={v['closeMega']}
            style={css(
              `position:absolute; top:100%; left:0; right:0; background:#fff; border-bottom:1px solid #e7e5e4; box-shadow:0 12px 32px rgba(0,0,0,0.06); padding:32px ${S(v['hdr']?.inPad)}; z-index:49`,
            )}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {arr(v['products'] || v['mobileProducts']).map((p, idx) => (
                <Btn
                  as="button"
                  key={idx}
                  onClick={p?.onClick}
                  style={{
                    background: 'none',
                    border: '0',
                    textAlign: 'start',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'background 0.15s ease',
                  }}
                  className="dlh2"
                >
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#0c0a09' }}>{val(p?.title, AR)}</span>
                  <span style={{ fontSize: '13px', color: '#777169', lineHeight: '1.4' }}>{val(p?.desc, AR)}</span>
                </Btn>
              ))}
            </div>
          </div>
        ) : null}

        {/* Mobile Nav Sheet */}
        {v['menuOpen'] ? (
          <div
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              background: '#fff',
              zIndex: 48,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Btn
              as="button"
              onClick={v['toggleMega']}
              style={{
                background: 'none',
                border: '0',
                textAlign: 'start',
                padding: '12px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#0c0a09',
                cursor: 'pointer',
                borderBottom: '1px solid #f0efed',
              }}
            >
              {tr('Product', AR)}
            </Btn>
            {arr(v['navItems']).map((item, idx) => (
              <Btn
                as="button"
                key={idx}
                onClick={item?.onClick}
                style={{
                  background: 'none',
                  border: '0',
                  textAlign: 'start',
                  padding: '12px 0',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#0c0a09',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0efed',
                }}
              >
                {val(item?.label, AR)}
              </Btn>
            ))}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '24px' }}>
              <a
                href={v['waDemo']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  background: 'transparent',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  borderRadius: '999px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                {tr('Book a demo', AR)}
              </a>
              <a
                href={v['signupUrl']}
                style={{
                  background: '#0c0a09',
                  color: '#fff',
                  borderRadius: '999px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                {val(v['headerCta'], AR)}
              </a>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}

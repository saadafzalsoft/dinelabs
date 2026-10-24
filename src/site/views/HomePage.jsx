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
                <span>{tr('Free plan, no time limit', AR)}</span>
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
                <span>{tr('Premium free for 30 days, no card needed', AR)}</span>
              </span>
              <a
                href={v['storeUrl']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  background: 'none',
                  border: '0',
                  padding: '0',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0c0a09',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  transition: 'opacity 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
                className="dlh0"
              >
                {tr('See a live store →', AR)}
              </a>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              data-anim={'hero'}
              style={css(
                `position:relative; width:100%; height:${S(v['heroStageH'])}; margin-top:clamp(40px,5vw,64px); overflow:hidden; display:flex; justify-content:center`,
              )}
            >
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  top: 'clamp(24px,3vw,40px)',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  background: '#161412',
                }}
              >
                {'\n          '}
                {val(v['heroBg'], AR)}
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    width: '900px',
                    height: '700px',
                    borderRadius: '50%',
                    background: 'radial-gradient(closest-side, rgba(255,244,230,0.16), rgba(255,244,230,0))',
                    top: '-260px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                ></div>
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(180deg, rgba(22,20,18,0) 55%, rgba(22,20,18,0.6) 100%)',
                  }}
                ></div>
                {'\n        '}
              </div>
              {'\n        '}
              <div
                aria-label={'Live interactive store preview'}
                style={{
                  display: 'block',
                  position: 'relative',
                  zIndex: '1',
                  flex: 'none',
                  alignSelf: 'flex-start',
                  width: 'min(360px,78vw)',
                  aspectRatio: '780/1598',
                  filter: 'drop-shadow(0 40px 40px rgba(12,10,9,0.28))',
                  cursor: 'default',
                }}
              >
                <div
                  dir={'ltr'}
                  style={{
                    position: 'absolute',
                    left: '4.87%',
                    right: '4.36%',
                    top: '1.94%',
                    bottom: '1.94%',
                    borderRadius: '13.4% / 6.2%',
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  <div className="phone-host" style={{ width: '100%', height: '100%' }}>
                    <StoreScreen lang={v['lang']} screen={'flow'} story={v['heroStory']} phase={v['heroPh']} />
                  </div>
                </div>
                <img
                  src={'/assets/iphone-frame.png'}
                  alt={''}
                  style={{
                    position: 'absolute',
                    inset: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    display: 'block',
                  }}
                />
              </div>
              {'\n        '}
              <div className="dl-only-desk">
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    zIndex: '3',
                    top: '50%',
                    insetInlineStart: 'max(24px, calc(50% - 450px))',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    pointerEvents: 'none',
                  }}
                >
                  {'\n            '}
                  {arr(v['heroCases']).map((L3_hc, I4) => (
                    <React.Fragment key={I4}>
                      {'\n              '}
                      <div
                        style={css(
                          `position:relative; overflow:hidden; display:flex; align-items:center; gap:12px; width:200px; height:50px; padding:0 16px; box-sizing:border-box; border-radius:14px; background:${S(L3_hc?.bg)}; color:${S(L3_hc?.color)}; font-size:16px; font-weight:500; letter-spacing:-0.01em; transition:background .5s ease, color .5s ease`,
                        )}
                      >
                        {'\n                '}
                        <span
                          style={css(
                            `width:8px; height:8px; border-radius:50%; flex:none; background:${S(L3_hc?.dot)}; transition:background .5s ease`,
                          )}
                        ></span>
                        {val(L3_hc?.label, AR)}
                        {'\n                '}
                        <span
                          style={css(
                            `position:absolute; left:16px; right:16px; bottom:7px; height:2px; border-radius:2px; background:${S(L3_hc?.track)}`,
                          )}
                        >
                          <span
                            style={css(
                              `display:block; height:100%; width:${S(L3_hc?.fill)}; border-radius:2px; background:${S(L3_hc?.dot)}; transition:${S(L3_hc?.tr)}`,
                            )}
                          ></span>
                        </span>
                        {'\n              '}
                      </div>
                      {'\n            '}
                    </React.Fragment>
                  ))}
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              <div className="dl-only-mob">
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    zIndex: '3',
                    left: '0',
                    right: '0',
                    bottom: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  {'\n            '}
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#fff',
                      color: '#0c0a09',
                      borderRadius: '999px',
                      height: '40px',
                      padding: '0 18px',
                      fontSize: '15px',
                      fontWeight: '500',
                    }}
                  >
                    <span
                      style={css(`width:8px; height:8px; border-radius:50%; background:${S(v['heroCase']?.dot)}`)}
                    ></span>
                    {val(v['heroCase']?.label, AR)}
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#777169' }}>
                      {val(v['heroCase']?.pos, AR)}
                    </span>
                  </span>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <a
              href={v['storeUrl']}
              target={'_blank'}
              rel={'noopener'}
              style={{
                marginTop: '16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4e4e4e',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
              className="dlha"
            >
              {tr('Tap to try a live store', AR)}
            </a>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section style={{ borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4', background: '#fff' }}>
          {'\n    '}
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '22px clamp(20px,4vw,40px)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '14px 32px',
              fontSize: '15px',
              fontWeight: '500',
              color: '#292524',
            }}
          >
            {'\n      '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg
                width={'18'}
                height={'18'}
                viewBox={'0 0 24 24'}
                fill={'none'}
                stroke={'#57534e'}
                strokeWidth={'1.6'}
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
                style={{ flex: '0 0 auto' }}
              >
                <circle cx={'7'} cy={'7'} r={'2.5'}></circle>
                <circle cx={'17'} cy={'17'} r={'2.5'}></circle>
                <path d={'M19 5L5 19'}></path>
              </svg>
              {tr('0% commission', AR)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg
                width={'18'}
                height={'18'}
                viewBox={'0 0 24 24'}
                fill={'none'}
                stroke={'#57534e'}
                strokeWidth={'1.6'}
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
                style={{ flex: '0 0 auto' }}
              >
                <circle cx={'12'} cy={'12'} r={'9'}></circle>
                <path d={'M12 7v5l3 2'}></path>
              </svg>
              {tr('Your store ready in 3 minutes', AR)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg
                width={'18'}
                height={'18'}
                viewBox={'0 0 24 24'}
                fill={'none'}
                stroke={'#57534e'}
                strokeWidth={'1.6'}
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
                style={{ flex: '0 0 auto' }}
              >
                <path d={'M3 12a9 9 0 1 0 3-6.7'}></path>
                <path d={'M3 4v5h5'}></path>
              </svg>
              {tr('No contract, cancel anytime', AR)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg
                width={'18'}
                height={'18'}
                viewBox={'0 0 24 24'}
                fill={'none'}
                stroke={'#57534e'}
                strokeWidth={'1.6'}
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
              {tr('Menus in 100+ languages', AR)}
            </span>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section
          style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}
        >
          {'\n    '}
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#777169',
            }}
          >
            {tr('The problem', AR)}
          </div>
          {'\n    '}
          <h2
            style={{
              fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
              fontWeight: '500',
              fontSize: 'clamp(34px,4.6vw,58px)',
              lineHeight: '1.04',
              letterSpacing: '-0.025em',
              margin: '16px 0 0',
              maxWidth: '900px',
              textWrap: 'balance',
            }}
          >
            {tr('You do the work. The delivery apps take the profit.', AR)}
          </h2>
          {'\n    '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: '16px',
              marginTop: '56px',
            }}
          >
            {'\n      '}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: '64px',
                  lineHeight: '1',
                  letterSpacing: '-0.03em',
                }}
              >
                {'25–30%'}
              </div>
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '23px',
                  marginTop: '12px',
                }}
              >
                {tr('Gone from every order.', AR)}
              </div>
              {'\n        '}
              <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr("Your food, your staff, your rent. Then a quarter of the bill goes to someone else's app.", AR)}
              </p>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: '64px',
                  lineHeight: '1',
                  letterSpacing: '-0.03em',
                  color: '#78716c',
                }}
              >
                {'0'}
              </div>
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '23px',
                  marginTop: '12px',
                }}
              >
                {tr('Customer numbers you get.', AR)}
              </div>
              {'\n        '}
              <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr(
                  "The app keeps your customer's number, not you. You can't thank them, call them, or bring them back.",
                  AR,
                )}
              </p>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: '64px',
                  lineHeight: '1',
                  letterSpacing: '-0.03em',
                  color: '#78716c',
                }}
              >
                {tr('1 of 100s', AR)}
              </div>
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '23px',
                  marginTop: '12px',
                }}
              >
                {tr('Just another tile.', AR)}
              </div>
              {'\n        '}
              <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr("On the app you're one small photo, right next to the place down the street.", AR)}
              </p>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: 'clamp(36px,5vw,60px) clamp(20px,4vw,40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, #a8c8e8 0%, rgba(168,200,232,0) 68%); top:-120px; left:-200px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, #a7e5d3 0%, rgba(167,229,211,0) 68%); bottom:-200px; right:-120px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '28px',
              padding: 'clamp(28px,5vw,64px)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'clamp(36px,5vw,72px)',
            }}
          >
            {'\n      '}
            <div style={{ flex: '1 1 380px', minWidth: '0' }}>
              {'\n        '}
              <h2
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: 'clamp(36px,4.6vw,58px)',
                  lineHeight: '1.02',
                  letterSpacing: '-0.025em',
                  margin: '0',
                }}
              >
                {tr('See what you’d keep.', AR)}
              </h2>
              {'\n        '}
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {'\n          '}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {'\n            '}
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}
                  >
                    <span style={{ fontSize: '15px', color: '#4e4e4e' }}>
                      {tr('Orders a day you move off the apps', AR)}
                    </span>
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>{val(v['orders'], AR)}</span>
                  </div>
                  {'\n            '}
                  <input
                    type={'range'}
                    min={'1'}
                    max={'150'}
                    value={dflt(v['orders'], '')}
                    onChange={v['setOrders']}
                    style={{ width: '100%' }}
                  />
                  {'\n          '}
                </label>
                {'\n          '}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {'\n            '}
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}
                  >
                    <span style={{ fontSize: '15px', color: '#4e4e4e' }}>{tr('Average order', AR)}</span>
                    <span style={{ fontSize: '22px', fontWeight: '500' }}>
                      <bdi dir={'ltr'}>
                        {'$'}
                        {val(v['avg'], AR)}
                      </bdi>
                    </span>
                  </div>
                  {'\n            '}
                  <input
                    type={'range'}
                    min={'5'}
                    max={'50'}
                    value={dflt(v['avg'], '')}
                    onChange={v['setAvg']}
                    style={{ width: '100%' }}
                  />
                  {'\n          '}
                </label>
                {'\n          '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {'\n            '}
                  <span style={{ fontSize: '15px', color: '#4e4e4e' }}>{tr('The app’s commission', AR)}</span>
                  {'\n            '}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      background: '#f0efed',
                      borderRadius: '999px',
                      padding: '4px',
                      width: 'fit-content',
                    }}
                  >
                    {'\n              '}
                    {arr(v['commOptions']).map((L4_c, I5) => (
                      <React.Fragment key={I5}>
                        {'\n                '}
                        <Btn
                          as="button"
                          onClick={L4_c?.onClick}
                          style={css(
                            `border:0; border-radius:999px; height:40px; padding:0 clamp(12px,2vw,22px); font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-size:15px; font-weight:500; cursor:pointer; background:${S(L4_c?.bg)}; color:${S(L4_c?.color)}; box-shadow:${S(L4_c?.shadow)}; transition:filter 0.18s ease`,
                          )}
                          className="dlh1"
                        >
                          {val(L4_c?.label, AR)}
                        </Btn>
                        {'\n              '}
                      </React.Fragment>
                    ))}
                    {'\n            '}
                  </div>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                flex: '1 1 340px',
                minWidth: '0',
                background: '#f5f5f5',
                borderRadius: '20px',
                padding: 'clamp(28px,4vw,44px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {'\n        '}
              {v['calcPos'] ? (
                <>
                  {'\n          '}
                  <div style={{ fontSize: '16px', color: '#4e4e4e' }}>{tr('You’d keep', AR)}</div>
                  {'\n          '}
                  <div
                    style={{
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontWeight: '500',
                      fontSize: 'clamp(64px,8vw,104px)',
                      lineHeight: '1',
                      letterSpacing: '-0.04em',
                      color: '#1F9D55',
                      marginTop: '8px',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    <bdi dir={'ltr'}>{val(v['keepShown'], AR)}</bdi>
                  </div>
                  {'\n          '}
                  <div style={{ fontSize: '18px', color: '#292524', marginTop: '6px' }}>{tr('a month', AR)}</div>
                  {'\n        '}
                </>
              ) : null}
              {'\n        '}
              {v['calcNeg'] ? (
                <>
                  {'\n          '}
                  <div
                    style={{
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontWeight: '500',
                      fontSize: 'clamp(26px,2.8vw,36px)',
                      lineHeight: '1.15',
                      letterSpacing: '-0.02em',
                      color: '#0c0a09',
                      textWrap: 'balance',
                    }}
                  >
                    {tr('At this volume, start on the Free plan. Pickup orders cost $0.', AR)}
                  </div>
                  {'\n        '}
                </>
              ) : null}
              {'\n        '}
              <div
                style={{
                  marginTop: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '15px',
                  color: '#4e4e4e',
                  borderTop: '1px solid #e7e5e4',
                  paddingTop: '20px',
                }}
              >
                {'\n          '}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{tr('The apps would take', AR)}</span>
                  <span style={{ color: '#0c0a09', fontWeight: '500' }}>
                    <bdi dir={'ltr'}>{val(v['appCut'], AR)}</bdi>
                  </span>
                </div>
                {'\n          '}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{tr('Dinelabs Premium', AR)}</span>
                  <span style={{ color: '#0c0a09', fontWeight: '500' }}>
                    <bdi dir={'ltr'}>{'−$37'}</bdi>
                  </span>
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              {v['calcPos'] ? (
                <>
                  <a
                    href={v['premiumUrl']}
                    style={{
                      marginTop: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '50px',
                      padding: '0 24px',
                      boxSizing: 'border-box',
                      background: '#0c0a09',
                      color: '#fff',
                      borderRadius: '999px',
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontSize: '15px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s ease',
                    }}
                    className="dlhb"
                  >
                    {tr('Start saving — set up free', AR)}
                  </a>
                </>
              ) : null}
              {'\n        '}
              {v['calcNeg'] ? (
                <>
                  <a
                    href={v['signupUrl']}
                    style={{
                      marginTop: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '50px',
                      padding: '0 24px',
                      boxSizing: 'border-box',
                      background: '#0c0a09',
                      color: '#fff',
                      borderRadius: '999px',
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontSize: '15px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s ease',
                    }}
                    className="dlhb"
                  >
                    {tr('Start free', AR)}
                  </a>
                </>
              ) : null}
              {'\n        '}
              <p style={{ margin: '20px 0 0', fontSize: '13px', lineHeight: '1.5', color: '#777169' }}>
                {tr(
                  'An estimate based on delivery orders you move from the apps to your own Dinelabs page, over a 30-day month.',
                  AR,
                )}
              </p>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        {'\n  '}
        <section
          data-anim={'how'}
          style={{ background: '#fff', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4' }}
        >
          {'\n    '}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}>
            {'\n      '}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '24px',
              }}
            >
              {'\n        '}
              <div style={{ maxWidth: '680px' }}>
                <h2
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    fontSize: 'clamp(34px,4.6vw,58px)',
                    lineHeight: '1.04',
                    letterSpacing: '-0.025em',
                    margin: '0',
                    textWrap: 'balance',
                  }}
                >
                  {tr('Your store is ready in 3 minutes.', AR)}
                </h2>
                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#4e4e4e', margin: '16px 0 0' }}>
                  {tr('No developer, no IT person. Add your menu at your own pace.', AR)}
                </p>
              </div>
              {'\n        '}
              <a
                href={v['storeUrl']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  background: '#fff',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  borderRadius: '999px',
                  height: '48px',
                  padding: '0 24px',
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
                className="dlhc"
              >
                {tr('See a live store →', AR)}
              </a>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                gap: '16px',
                marginTop: '56px',
              }}
            >
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {'\n          '}
                <div
                  style={{
                    aspectRatio: '4/3',
                    borderRadius: '20px',
                    border: '1px solid #e7e5e4',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    background: '#f0efed',
                    padding: 'clamp(14px,6%,24px)',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      flex: '1',
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      boxShadow: '0 10px 30px -18px rgba(12,10,9,0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{tr('Crêpes', AR)}</span>
                      <Btn
                        as="button"
                        onClick={v['addDish']}
                        style={{
                          background: '#0c0a09',
                          color: '#fff',
                          border: '0',
                          borderRadius: '999px',
                          fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '6px 11px',
                          cursor: 'pointer',
                        }}
                        className="dlhd dlhe"
                      >
                        {tr('+ Add product', AR)}
                      </Btn>
                    </div>
                    {arr(v['dishRows']).map((L5_d, I6) => (
                      <React.Fragment key={I6}>
                        <div
                          style={css(
                            `display:flex; align-items:center; gap:10px; padding:8px 0; border-top:1px solid #f0efed; background:${S(L5_d?.bg)}; transition:background 0.6s ease`,
                          )}
                        >
                          <img
                            src={L5_d?.c}
                            alt={''}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '9px',
                              objectFit: 'cover',
                              display: 'block',
                              flex: 'none',
                            }}
                          />
                          <span
                            style={css(
                              `flex:1; min-width:0; font-size:13px; font-weight:500; color:${S(L5_d?.color)}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:color 0.3s ease`,
                            )}
                          >
                            {val(L5_d?.n, AR)}
                          </span>
                          <span style={{ fontSize: '13px', color: '#4e4e4e' }}>{val(L5_d?.p, AR)}</span>
                          <Btn
                            as="button"
                            onClick={L5_d?.toggle}
                            aria-label={'Toggle dish'}
                            style={css(
                              `width:30px; height:18px; border-radius:999px; border:0; padding:0; background:${S(L5_d?.tbg)}; position:relative; flex:none; cursor:pointer; transition:background 0.25s ease`,
                            )}
                            className="dlh1"
                          >
                            <span
                              style={css(
                                `position:absolute; top:3px; left:${S(L5_d?.knob)}; width:12px; height:12px; border-radius:50%; background:#fff; transition:left 0.25s cubic-bezier(.3,.7,.2,1)`,
                              )}
                            ></span>
                          </Btn>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {'\n          '}
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#777169' }}>
                  {'01'}
                </div>
                {'\n          '}
                <div
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    letterSpacing: '-0.015em',
                    lineHeight: '1.2',
                    fontSize: '23px',
                    marginTop: '-8px',
                  }}
                >
                  {tr('Create your store', AR)}
                </div>
                {'\n          '}
                <p style={{ margin: '-8px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                  {tr('Pick your name and get your link. Then add your dishes, photos and prices.', AR)}
                </p>
                {'\n        '}
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {'\n          '}
                <div
                  style={{
                    aspectRatio: '4/3',
                    borderRadius: '20px',
                    border: '1px solid #e7e5e4',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    background: '#f0efed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '8px 12px 6px',
                      boxShadow: '0 10px 30px -18px rgba(12,10,9,0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img
                        src={v['slugLogo']}
                        alt={''}
                        style={css(
                          `width:26px; height:26px; object-fit:contain; display:block; opacity:${S(v['slugO'])}; transition:opacity 0.25s ease`,
                        )}
                      />
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#777169',
                        }}
                      >
                        {tr('Table 7', AR)}
                      </span>
                    </span>
                    <img
                      src={'/assets/qr-code.svg'}
                      alt={'QR code'}
                      style={{ width: '76px', height: '76px', display: 'block' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{tr('Scan to try ordering', AR)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '6px',
                      minWidth: '0',
                      maxWidth: '100%',
                    }}
                  >
                    <span
                      style={{
                        background: '#fff',
                        borderRadius: '999px',
                        padding: '5px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxSizing: 'border-box',
                        boxShadow: '0 6px 16px -10px rgba(12,10,9,0.3)',
                      }}
                    >
                      {tr('Link in bio', AR)}
                    </span>
                    <span
                      style={{
                        background: '#0c0a09',
                        color: '#fff',
                        borderRadius: '999px',
                        padding: '5px 10px',
                        fontFamily: "'IBM Plex Mono',monospace",
                        fontSize: '11px',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxSizing: 'border-box',
                      }}
                    >
                      <span
                        style={css(
                          `display:inline-block; opacity:${S(v['slugO'])}; transform:translateY(${S(v['slugY'])}); transition:opacity 0.25s ease, transform 0.3s ease`,
                        )}
                      >
                        {tr('dinelabs.co/', AR)}
                        {val(v['slug'], AR)}
                      </span>
                    </span>
                  </div>
                </div>
                {'\n          '}
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#777169' }}>
                  {'02'}
                </div>
                {'\n          '}
                <div
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    letterSpacing: '-0.015em',
                    lineHeight: '1.2',
                    fontSize: '23px',
                    marginTop: '-8px',
                  }}
                >
                  {tr('Share your link', AR)}
                </div>
                {'\n          '}
                <p style={{ margin: '-8px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                  {tr('On Instagram, WhatsApp and Google Maps, and a QR code on every table.', AR)}
                </p>
                {'\n        '}
              </div>
              {'\n        '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {'\n          '}
                <div
                  style={{
                    aspectRatio: '4/3',
                    borderRadius: '20px',
                    border: '1px solid #e7e5e4',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    background: '#f0efed',
                    padding: 'clamp(14px,6%,24px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  {arr(v['stepOrders']).map((L6_o, I7) => (
                    <React.Fragment key={I7}>
                      <div
                        style={css(
                          `background:#fff; border:1px solid ${S(L6_o?.border)}; border-radius:12px; padding:11px 13px; box-shadow:${S(L6_o?.shadow)}; opacity:${S(L6_o?.op)}; transform:translateY(${S(L6_o?.y)}); transition:${S(L6_o?.tr)}`,
                        )}
                      >
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}
                        >
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#777169' }}>
                            {'#'}
                            {val(L6_o?.no, AR)}
                            {' · '}
                            {val(L6_o?.where, AR)}
                          </span>
                          <span
                            style={css(
                              `background:${S(L6_o?.tagBg)}; border-radius:999px; font-size:11px; font-weight:600; padding:3px 8px; transition:background 0.4s ease`,
                            )}
                          >
                            {val(L6_o?.tag, AR)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            lineHeight: '1.5',
                            marginTop: '6px',
                            color: '#292524',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {val(L6_o?.items, AR)}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {'\n          '}
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#777169' }}>
                  {'03'}
                </div>
                {'\n          '}
                <div
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    letterSpacing: '-0.015em',
                    lineHeight: '1.2',
                    fontSize: '23px',
                    marginTop: '-8px',
                  }}
                >
                  {tr('Get orders', AR)}
                </div>
                {'\n          '}
                <p style={{ margin: '-8px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                  {tr('Orders arrive on your screen, clear and complete. No commission.', AR)}
                </p>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section
          style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}
        >
          {'\n    '}
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '28px' }}
          >
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.6vw,58px)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
                margin: '0',
              }}
            >
              {tr('Pickup, delivery and table orders. One link.', AR)}
            </h2>
            {'\n      '}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                width: '100%',
                maxWidth: '480px',
                boxSizing: 'border-box',
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '999px',
                padding: '5px',
              }}
            >
              {'\n        '}
              {arr(v['tabs']).map((L7_t, I8) => (
                <React.Fragment key={I8}>
                  {'\n          '}
                  <Btn
                    as="button"
                    onClick={L7_t?.onClick}
                    style={css(
                      `flex:1 1 0; min-width:0; display:flex; align-items:center; justify-content:center; gap:clamp(5px,1vw,8px); white-space:nowrap; border:0; border-radius:999px; height:44px; padding:0 clamp(8px,2.4vw,22px); font-size:clamp(14px,3.6vw,15px); font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-weight:500; cursor:pointer; background:${S(L7_t?.bg)}; color:${S(L7_t?.color)}; transition:background 0.2s, color 0.2s`,
                    )}
                    className="dlh1"
                  >
                    <span className="dl-only-desk">
                      {L7_t?.isDine ? (
                        <>
                          <svg
                            width={'16'}
                            height={'16'}
                            style={{ flex: 'none' }}
                            viewBox={'0 0 24 24'}
                            fill={'none'}
                            stroke={'currentColor'}
                            strokeWidth={'1.7'}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                          >
                            <rect x={'3'} y={'3'} width={'7'} height={'7'} rx={'1'}></rect>
                            <rect x={'14'} y={'3'} width={'7'} height={'7'} rx={'1'}></rect>
                            <rect x={'3'} y={'14'} width={'7'} height={'7'} rx={'1'}></rect>
                            <path d={'M14 14h3v3h-3z'}></path>
                            <path d={'M17 20h4v-3'}></path>
                          </svg>
                        </>
                      ) : null}
                      {L7_t?.isPickup ? (
                        <>
                          <svg
                            width={'16'}
                            height={'16'}
                            style={{ flex: 'none' }}
                            viewBox={'0 0 24 24'}
                            fill={'none'}
                            stroke={'currentColor'}
                            strokeWidth={'1.7'}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                          >
                            <path d={'M6 7h12l1 14H5L6 7z'}></path>
                            <path d={'M9 7a3 3 0 0 1 6 0'}></path>
                          </svg>
                        </>
                      ) : null}
                      {L7_t?.isDelivery ? (
                        <>
                          <svg
                            width={'16'}
                            height={'16'}
                            style={{ flex: 'none' }}
                            viewBox={'0 0 24 24'}
                            fill={'none'}
                            stroke={'currentColor'}
                            strokeWidth={'1.7'}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                          >
                            <circle cx={'5.5'} cy={'17'} r={'3.5'}></circle>
                            <circle cx={'18.5'} cy={'17'} r={'3.5'}></circle>
                            <path d={'M15 6h2l1.5 11'}></path>
                            <path d={'M5.5 17l4-7h7'}></path>
                          </svg>
                        </>
                      ) : null}
                      <span>{val(L7_t?.label, AR)}</span>
                    </span>
                    <span className="dl-only-mob">
                      <span>{val(L7_t?.labelM, AR)}</span>
                    </span>
                  </Btn>
                  {'\n        '}
                </React.Fragment>
              ))}
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              marginTop: '48px',
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '28px',
              overflow: 'hidden',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'stretch',
            }}
          >
            {'\n      '}
            <div
              style={{
                flex: '1 1 380px',
                minWidth: '0',
                padding: 'clamp(32px,5vw,64px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              {'\n        '}
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#777169',
                }}
              >
                {val(v['tab']?.label, AR)}
              </div>
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: 'clamp(30px,3.4vw,44px)',
                  lineHeight: '1.08',
                  letterSpacing: '-0.02em',
                  textWrap: 'balance',
                }}
              >
                {val(v['tab']?.h, AR)}
              </div>
              {'\n        '}
              <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.55', color: '#4e4e4e', maxWidth: '440px' }}>
                {val(v['tab']?.body, AR)}
              </p>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                flex: '1 1 380px',
                minWidth: '0',
                position: 'relative',
                overflow: 'hidden',
                background: '#f0efed',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingTop: '56px',
                minHeight: '460px',
              }}
            >
              {'\n        '}
              <div
                style={css(
                  `position:absolute; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle, ${S(v['tab']?.orb)} 0%, rgba(255,255,255,0) 68%); top:-80px; left:50%; transform:translateX(-50%); opacity:${S(v['orb'])}`,
                )}
              ></div>
              {'\n        '}
              <div style={{ position: 'relative', width: 'min(290px,72vw)', height: '420px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '780/1598',
                    filter: 'drop-shadow(0 40px 40px rgba(12,10,9,0.28))',
                  }}
                >
                  <div
                    dir={'ltr'}
                    style={{
                      position: 'absolute',
                      left: '4.87%',
                      right: '4.36%',
                      top: '1.94%',
                      bottom: '1.94%',
                      borderRadius: '13.4% / 6.2%',
                      overflow: 'hidden',
                      background: '#fff',
                    }}
                  >
                    <div className="phone-host" style={{ width: '100%', height: '100%' }}>
                      <StoreScreen lang={v['lang']} screen={v['tab']?.scr} store={v['tab']?.store} />
                    </div>
                  </div>
                  <img
                    src={'/assets/iphone-frame.png'}
                    alt={''}
                    style={{
                      position: 'absolute',
                      inset: '0',
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            <a
              href={v['signupUrl']}
              style={{
                background: '#0c0a09',
                color: '#fff',
                border: '0',
                borderRadius: '999px',
                height: '50px',
                padding: '0 26px',
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
              {tr('Start free', AR)}
            </a>
            <a
              href={v['storeUrl']}
              target={'_blank'}
              rel={'noopener'}
              style={{
                background: '#fff',
                color: '#0c0a09',
                border: '1px solid #d6d3d1',
                borderRadius: '999px',
                height: '50px',
                padding: '0 24px',
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
              className="dlhc"
            >
              {tr('See a live store →', AR)}
            </a>
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section
          data-anim={'addons'}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(20px,4vw,40px) clamp(72px,10vw,120px)',
            display: 'flex',
            flexWrap: 'wrap-reverse',
            alignItems: 'center',
            gap: 'clamp(40px,6vw,96px)',
          }}
        >
          {'\n    '}
          <div
            style={{
              flex: '1 1 380px',
              minWidth: '0',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              padding: '24px 0',
            }}
          >
            {'\n      '}
            <div
              style={css(
                `position:absolute; width:560px; height:560px; border-radius:50%; background:radial-gradient(circle, #f4c5a8 0%, rgba(244,197,168,0) 68%); top:50%; left:50%; transform:translate(-50%,-50%); opacity:${S(v['orb'])}; pointer-events:none`,
              )}
            ></div>
            {'\n      '}
            <div
              style={{
                position: 'relative',
                width: 'min(290px,72vw)',
                aspectRatio: '780/1598',
                filter: 'drop-shadow(0 40px 40px rgba(12,10,9,0.28))',
              }}
            >
              <div
                dir={'ltr'}
                style={{
                  position: 'absolute',
                  left: '4.87%',
                  right: '4.36%',
                  top: '1.94%',
                  bottom: '1.94%',
                  borderRadius: '13.4% / 6.2%',
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <div className="phone-host" style={{ width: '100%', height: '100%' }}>
                  <StoreScreen lang={v['lang']} screen={'item'} store={'casa-pasta'} phase={v['addPh']} />
                </div>
              </div>
              <img
                src={'/assets/iphone-frame.png'}
                alt={''}
                style={{
                  position: 'absolute',
                  inset: '0',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  display: 'block',
                }}
              />
            </div>
            {'\n      \n      '}
            <div
              style={{
                position: 'absolute',
                bottom: '16%',
                insetInlineEnd: 'max(0px, calc(50% - 250px))',
                background: '#0c0a09',
                color: '#fff',
                borderRadius: '16px',
                padding: '14px 18px',
                boxShadow: '0 24px 44px -18px rgba(12,10,9,0.45)',
                width: '168px',
              }}
            >
              {'\n        '}
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#a8a29e',
                }}
              >
                {tr('Order total', AR)}
              </div>
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: '36px',
                  lineHeight: '1.1',
                  marginTop: '4px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {val(v['addTotal'], AR)}
              </div>
              {'\n        '}
              <div
                style={css(`font-size:12px; color:#a7e5d3; opacity:${S(v['addNoteO'])}; transition:opacity 0.3s ease`)}
              >
                {tr('+ Garlic bread added', AR)}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ flex: '1 1 380px', minWidth: '0' }}>
            {'\n      '}
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#777169',
              }}
            >
              {tr('Add-ons · Premium', AR)}
            </div>
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.6vw,58px)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
                margin: '16px 0 0',
              }}
            >
              {tr('Sell more on every order.', AR)}
            </h2>
            {'\n      '}
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#4e4e4e',
                margin: '24px 0 0',
                maxWidth: '480px',
                textWrap: 'pretty',
              }}
            >
              {tr(
                'Coffee? Dinelabs suggests a croissant. Burger? It suggests fries. Like your best waiter, on every order, without your staff pushing.',
                AR,
              )}
            </p>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section
          data-anim={'xl'}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(20px,4vw,40px) clamp(72px,10vw,120px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(40px,6vw,96px)',
          }}
        >
          {'\n    '}
          <div style={{ flex: '1 1 380px', minWidth: '0' }}>
            {'\n      '}
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#777169',
              }}
            >
              {tr('Translation · Premium', AR)}
            </div>
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.6vw,58px)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
                margin: '16px 0 0',
              }}
            >
              {tr('Tourists order in their language. Your kitchen reads yours.', AR)}
            </h2>
            {'\n      '}
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#4e4e4e',
                margin: '24px 0 0',
                maxWidth: '480px',
                textWrap: 'pretty',
              }}
            >
              {tr(
                'Your menu shows in 100+ languages. Every order, notes included, reaches your kitchen in the language your team reads. Made for summer, when the tourists and expats are back.',
                AR,
              )}
            </p>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ flex: '1 1 380px', minWidth: '0', position: 'relative', padding: '24px 0' }}>
            {'\n      '}
            <div
              style={css(
                `position:absolute; width:560px; height:560px; border-radius:50%; background:radial-gradient(circle, #c8b8e0 0%, rgba(200,184,224,0) 68%); top:50%; left:50%; transform:translate(-50%,-50%); opacity:${S(v['orb'])}; pointer-events:none`,
              )}
            ></div>
            {'\n      '}
            <div className="dl-only-desk">
              {'\n        '}
              <div style={{ position: 'relative', height: '530px' }}>
                {'\n          '}
                {arr(v['xlSats']).map((L8_c, I9) => (
                  <React.Fragment key={I9}>
                    {'\n            '}
                    <div
                      style={css(
                        `position:absolute; left:${S(L8_c?.x)}; top:${S(L8_c?.y)}; width:48%; transform:${S(L8_c?.t)}; transition:transform 2.2s ease-in-out`,
                      )}
                    >
                      {'\n          '}
                      <div
                        data-no-ar={'1'}
                        dir={L8_c?.dir}
                        style={css(
                          `display:flex; align-items:center; gap:12px; background:#fff; border:1px solid ${S(L8_c?.border)}; border-radius:14px; padding:12px; box-shadow:${S(L8_c?.shadow)}; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans'), 'IBM Plex Sans Arabic','Noto Sans SC','Noto Sans Devanagari',sans-serif; text-align:start; transition:border-color 0.4s ease, box-shadow 0.4s ease`,
                        )}
                      >
                        {'\n            '}
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span
                            data-no-ar={'1'}
                            style={{
                              alignSelf: 'flex-start',
                              fontSize: '10.5px',
                              fontWeight: '600',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: '#8a8580',
                            }}
                          >
                            {val(L8_c?.lang, false)}
                          </span>
                          <span
                            style={css(
                              `font-size:15px; font-weight:600; letter-spacing:-0.01em; color:#0c0a09; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:${S(L8_c?.op)}; transition:opacity 0.2s ease`,
                            )}
                          >
                            {val(L8_c?.n, false)}
                          </span>
                          <span
                            style={css(
                              `font-size:12.5px; line-height:1.45; color:#57534e; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; opacity:${S(L8_c?.op)}; transition:opacity 0.2s ease`,
                            )}
                          >
                            {val(L8_c?.d, false)}
                          </span>
                          <span
                            dir={'ltr'}
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#0c0a09',
                              marginTop: '2px',
                              alignSelf: 'flex-start',
                            }}
                          >
                            {'$8.00'}
                          </span>
                        </div>
                        {'\n            '}
                        <img
                          src={'/assets/menu/cloud-nine/04.jpg'}
                          alt={''}
                          style={{
                            flex: 'none',
                            width: '64px',
                            height: '64px',
                            borderRadius: '11px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        {'\n          '}
                      </div>
                      {'\n            '}
                    </div>
                    {'\n          '}
                  </React.Fragment>
                ))}
                {'\n          '}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '82%',
                    transform: 'translate(-50%,-50%)',
                    zIndex: '2',
                  }}
                >
                  {'\n          '}
                  <div
                    data-no-ar={'1'}
                    dir={v['xlC']?.dir}
                    style={css(
                      `display:flex; align-items:center; gap:16px; background:#fff; border:1px solid ${S(v['xlC']?.border)}; border-radius:18px; padding:16px; box-shadow:${S(v['xlC']?.shadow)}; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans'), 'IBM Plex Sans Arabic','Noto Sans SC','Noto Sans Devanagari',sans-serif; text-align:start; transition:border-color 0.4s ease, box-shadow 0.4s ease`,
                    )}
                  >
                    {'\n            '}
                    <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        data-no-ar={'1'}
                        style={css(
                          `align-self:flex-start; background:#0c0a09; color:#fff; border-radius:999px; padding:3px 10px; font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; opacity:${S(v['xlC']?.op)}; transition:opacity 0.2s ease`,
                        )}
                      >
                        {val(v['xlC']?.lang, false)}
                      </span>
                      <span
                        style={css(
                          `font-size:20px; font-weight:600; letter-spacing:-0.01em; color:#0c0a09; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:${S(v['xlC']?.op)}; transition:opacity 0.2s ease`,
                        )}
                      >
                        {val(v['xlC']?.n, false)}
                      </span>
                      <span
                        style={css(
                          `font-size:15px; line-height:1.45; color:#57534e; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; opacity:${S(v['xlC']?.op)}; transition:opacity 0.2s ease`,
                        )}
                      >
                        {val(v['xlC']?.d, false)}
                      </span>
                      <span
                        dir={'ltr'}
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#0c0a09',
                          marginTop: '2px',
                          alignSelf: 'flex-start',
                        }}
                      >
                        {'$8.00'}
                      </span>
                    </div>
                    {'\n            '}
                    <img
                      src={'/assets/menu/cloud-nine/04.jpg'}
                      alt={''}
                      style={{
                        flex: 'none',
                        width: '104px',
                        height: '104px',
                        borderRadius: '14px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {'\n          '}
                  </div>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div className="dl-only-mob">
              {'\n        '}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {'\n          '}
                <div
                  data-no-ar={'1'}
                  dir={v['xlC']?.dir}
                  style={css(
                    `display:flex; align-items:center; gap:16px; background:#fff; border:1px solid ${S(v['xlC']?.border)}; border-radius:18px; padding:16px; box-shadow:${S(v['xlC']?.shadow)}; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans'), 'IBM Plex Sans Arabic','Noto Sans SC','Noto Sans Devanagari',sans-serif; text-align:start; transition:border-color 0.4s ease, box-shadow 0.4s ease`,
                  )}
                >
                  {'\n            '}
                  <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      data-no-ar={'1'}
                      style={css(
                        `align-self:flex-start; background:#0c0a09; color:#fff; border-radius:999px; padding:3px 10px; font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; opacity:${S(v['xlC']?.op)}; transition:opacity 0.2s ease`,
                      )}
                    >
                      {val(v['xlC']?.lang, false)}
                    </span>
                    <span
                      style={css(
                        `font-size:20px; font-weight:600; letter-spacing:-0.01em; color:#0c0a09; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:${S(v['xlC']?.op)}; transition:opacity 0.2s ease`,
                      )}
                    >
                      {val(v['xlC']?.n, false)}
                    </span>
                    <span
                      style={css(
                        `font-size:15px; line-height:1.45; color:#57534e; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; opacity:${S(v['xlC']?.op)}; transition:opacity 0.2s ease`,
                      )}
                    >
                      {val(v['xlC']?.d, false)}
                    </span>
                    <span
                      dir={'ltr'}
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#0c0a09',
                        marginTop: '2px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {'$8.00'}
                    </span>
                  </div>
                  {'\n            '}
                  <img
                    src={'/assets/menu/cloud-nine/04.jpg'}
                    alt={''}
                    style={{
                      flex: 'none',
                      width: '104px',
                      height: '104px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {'\n          '}
                </div>
                {'\n          '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '10px' }}
                >
                  {'\n            '}
                  {arr(v['xlSats']).map((L9_c, I10) => (
                    <React.Fragment key={I10}>
                      {'\n          '}
                      <div
                        data-no-ar={'1'}
                        dir={L9_c?.dir}
                        style={css(
                          `display:flex; align-items:center; gap:12px; background:#fff; border:1px solid ${S(L9_c?.border)}; border-radius:14px; padding:12px; box-shadow:${S(L9_c?.shadow)}; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans'), 'IBM Plex Sans Arabic','Noto Sans SC','Noto Sans Devanagari',sans-serif; text-align:start; transition:border-color 0.4s ease, box-shadow 0.4s ease`,
                        )}
                      >
                        {'\n            '}
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span
                            data-no-ar={'1'}
                            style={{
                              alignSelf: 'flex-start',
                              fontSize: '10.5px',
                              fontWeight: '600',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: '#8a8580',
                            }}
                          >
                            {val(L9_c?.lang, false)}
                          </span>
                          <span
                            style={css(
                              `font-size:15px; font-weight:600; letter-spacing:-0.01em; color:#0c0a09; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:${S(L9_c?.op)}; transition:opacity 0.2s ease`,
                            )}
                          >
                            {val(L9_c?.n, false)}
                          </span>
                          <span
                            style={css(
                              `font-size:12.5px; line-height:1.45; color:#57534e; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; opacity:${S(L9_c?.op)}; transition:opacity 0.2s ease`,
                            )}
                          >
                            {val(L9_c?.d, false)}
                          </span>
                          <span
                            dir={'ltr'}
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#0c0a09',
                              marginTop: '2px',
                              alignSelf: 'flex-start',
                            }}
                          >
                            {'$8.00'}
                          </span>
                        </div>
                        {'\n            '}
                        <img
                          src={'/assets/menu/cloud-nine/04.jpg'}
                          alt={''}
                          style={{
                            flex: 'none',
                            width: '64px',
                            height: '64px',
                            borderRadius: '11px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        {'\n          '}
                      </div>
                      {'\n            '}
                    </React.Fragment>
                  ))}
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section
          data-anim={'mgr'}
          style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}
        >
          {'\n    '}
          <h2
            style={{
              fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
              fontWeight: '500',
              fontSize: 'clamp(34px,4.6vw,58px)',
              lineHeight: '1.04',
              letterSpacing: '-0.025em',
              margin: '0',
              maxWidth: '760px',
              textWrap: 'balance',
            }}
          >
            {tr('Never lose an order at rush hour.', AR)}
          </h2>
          {'\n    '}
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#4e4e4e', margin: '20px 0 0', maxWidth: '560px' }}>
            {tr('Every order lands on one screen, with the table number or address, the second it’s placed.', AR)}
          </p>
          {'\n    '}
          <div
            style={{
              marginTop: '48px',
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 50px 90px -50px rgba(12,10,9,0.35)',
              display: 'flex',
              fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
              color: '#0c0a09',
              textAlign: 'start',
            }}
          >
            {'\n      '}
            <div className="dl-w1100-up">
              {'\n        '}
              <div
                style={{
                  flex: 'none',
                  width: '230px',
                  borderInlineEnd: '1px solid #eceae8',
                  padding: '22px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {'\n          '}
                <div style={{ fontSize: '20px', letterSpacing: '-0.03em', padding: '0 12px 6px' }}>
                  <span style={{ fontWeight: '700' }}>{tr('Dinelabs', AR)}</span>{' '}
                  <span style={{ fontWeight: '400' }}>{tr('Manager', AR)}</span>
                </div>
                {'\n          '}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.12em',
                    color: '#8a8580',
                    padding: '18px 12px 8px',
                  }}
                >
                  {tr('OVERVIEW', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <rect x={'3'} y={'3'} width={'7'} height={'7'} rx={'1.5'}></rect>
                    <rect x={'14'} y={'3'} width={'7'} height={'7'} rx={'1.5'}></rect>
                    <rect x={'3'} y={'14'} width={'7'} height={'7'} rx={'1.5'}></rect>
                    <rect x={'14'} y={'14'} width={'7'} height={'7'} rx={'1.5'}></rect>
                  </svg>
                  {tr('Dashboard', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: '#efefee',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <rect x={'5'} y={'3'} width={'14'} height={'18'} rx={'2'}></rect>
                    <path d={'M9 8h6M9 12h6M9 16h4'}></path>
                  </svg>
                  {tr('Live orders', AR)}
                </div>
                {'\n          '}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.12em',
                    color: '#8a8580',
                    padding: '18px 12px 8px',
                  }}
                >
                  {tr('MENU', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <path d={'M12 3l9 5-9 5-9-5 9-5z'}></path>
                    <path d={'M3 13l9 5 9-5'}></path>
                  </svg>
                  {tr('Categories', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <path d={'M6 3v7a2 2 0 0 0 4 0V3M8 12v9M17 3c-2 0-3 2-3 5s1 4 3 4v9'}></path>
                  </svg>
                  {tr('Products', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <circle cx={'12'} cy={'12'} r={'9'}></circle>
                    <path d={'M12 8v8M8 12h8'}></path>
                  </svg>
                  {tr('Add-ons', AR)}
                </div>
                {'\n          '}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.12em',
                    color: '#8a8580',
                    padding: '18px 12px 8px',
                  }}
                >
                  {tr('STORE SETTINGS', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <circle cx={'12'} cy={'12'} r={'9'}></circle>
                    <path d={'M12 7v5l3 2'}></path>
                  </svg>
                  {tr('Opening hours', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <circle cx={'6'} cy={'17'} r={'3'}></circle>
                    <circle cx={'18'} cy={'17'} r={'3'}></circle>
                    <path d={'M6 17l4-7h5l3 7M14 6h2'}></path>
                  </svg>
                  {tr('Delivery', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <path d={'M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M4 11h16v5H4zM6 16v3M18 16v3'}></path>
                  </svg>
                  {tr('Table ordering', AR)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0c0a09',
                    background: 'transparent',
                  }}
                >
                  <svg
                    width={'18'}
                    height={'18'}
                    viewBox={'0 0 24 24'}
                    fill={'none'}
                    stroke={'currentColor'}
                    strokeWidth={'1.8'}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    style={{ flex: 'none', display: 'block' }}
                  >
                    <path d={'M6 7h12l-1 13H7L6 7z'}></path>
                    <path d={'M9 7a3 3 0 0 1 6 0'}></path>
                  </svg>
                  {tr('Pickup', AR)}
                </div>
                {'\n          '}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 12px 0',
                    borderTop: '1px solid #eceae8',
                  }}
                >
                  <img
                    src={'/assets/menu/frankies/logo.png'}
                    alt={"Frankie's Dog House"}
                    style={{ width: '56px', height: '56px', objectFit: 'contain', display: 'block', flex: 'none' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: '#8a8580' }}>{tr('Sign out', AR)}</span>
                  </div>
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ flex: '1', minWidth: '0', background: '#fafaf9', display: 'flex', flexDirection: 'column' }}>
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  padding: '14px clamp(16px,2.5vw,28px)',
                  background: '#fff',
                  borderBottom: '1px solid #eceae8',
                  fontSize: '14px',
                }}
              >
                {'\n          '}
                <img
                  src={'/assets/menu/frankies/logo.png'}
                  alt={"Frankie's Dog House"}
                  style={{ width: '36px', height: '36px', objectFit: 'contain', display: 'block' }}
                />
                <span style={{ color: '#d6d3d1' }}>{'/'}</span>
                <span style={{ fontWeight: '600' }}>{tr('Live orders', AR)}</span>
                {'\n          '}
                <span style={{ marginInlineStart: 'auto', display: 'flex', gap: '8px' }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid #e7e5e4',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontWeight: '600',
                      fontSize: '13px',
                    }}
                  >
                    <svg
                      width={'15'}
                      height={'15'}
                      viewBox={'0 0 24 24'}
                      fill={'none'}
                      stroke={'currentColor'}
                      strokeWidth={'1.8'}
                      strokeLinecap={'round'}
                      strokeLinejoin={'round'}
                      style={{ flex: 'none', display: 'block' }}
                    >
                      <path d={'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'}></path>
                    </svg>
                    {tr('View store', AR)}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid #e7e5e4',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontWeight: '600',
                      fontSize: '13px',
                    }}
                  >
                    <svg
                      width={'15'}
                      height={'15'}
                      viewBox={'0 0 24 24'}
                      fill={'none'}
                      stroke={'currentColor'}
                      strokeWidth={'1.8'}
                      strokeLinecap={'round'}
                      strokeLinejoin={'round'}
                      style={{ flex: 'none', display: 'block' }}
                    >
                      <circle cx={'12'} cy={'12'} r={'9'}></circle>
                      <circle cx={'12'} cy={'12'} r={'3.5'}></circle>
                    </svg>
                    {tr('Contact support', AR)}
                  </span>
                </span>
                {'\n        '}
              </div>
              {'\n        '}
              <div style={{ padding: 'clamp(18px,2.5vw,28px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {'\n          '}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.03em' }}>
                      {tr('Live orders', AR)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b6661', marginTop: '4px' }}>
                      {tr('New orders show up here instantly. Move each one along as you prepare it.', AR)}
                    </div>
                  </div>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#fff',
                      border: '1px solid #e7e5e4',
                      borderRadius: '999px',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    <span
                      style={css(
                        `width:8px; height:8px; border-radius:50%; background:#16a34a; box-shadow:0 0 0 ${S(v['pulse'])} rgba(22,163,74,0.18); transition:box-shadow 0.8s ease`,
                      )}
                    ></span>
                    {tr('Updating live', AR)}
                  </span>
                </div>
                {'\n          '}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px' }}
                >
                  {'\n            '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: '#fff',
                      border: '1px solid #eceae8',
                      borderRadius: '16px',
                      padding: '16px',
                    }}
                  >
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#fde8e8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        width={'20'}
                        height={'20'}
                        viewBox={'0 0 24 24'}
                        fill={'none'}
                        stroke={'#dc2626'}
                        strokeWidth={'1.8'}
                        strokeLinecap={'round'}
                        strokeLinejoin={'round'}
                        style={{ flex: 'none', display: 'block' }}
                      >
                        <path d={'M3 13l3-8h12l3 8v6H3v-6z'}></path>
                        <path d={'M3 13h5l1 2h6l1-2h5'}></path>
                      </svg>
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          lineHeight: '1.1',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {val(v['mgr']?.nNew, AR)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b6661' }}>{tr('New orders', AR)}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: '#fff',
                      border: '1px solid #eceae8',
                      borderRadius: '16px',
                      padding: '16px',
                    }}
                  >
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#fdf0dc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        width={'20'}
                        height={'20'}
                        viewBox={'0 0 24 24'}
                        fill={'none'}
                        stroke={'#d97706'}
                        strokeWidth={'1.8'}
                        strokeLinecap={'round'}
                        strokeLinejoin={'round'}
                        style={{ flex: 'none', display: 'block' }}
                      >
                        <path d={'M7 14a4 4 0 1 1 1.5-7.7A4 4 0 0 1 16 6.3 4 4 0 1 1 17 14v5H7v-5z'}></path>
                      </svg>
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          lineHeight: '1.1',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {val(v['mgr']?.nPrep, AR)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b6661' }}>{tr('Preparing', AR)}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: '#fff',
                      border: '1px solid #eceae8',
                      borderRadius: '16px',
                      padding: '16px',
                    }}
                  >
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#dcf5ea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        width={'20'}
                        height={'20'}
                        viewBox={'0 0 24 24'}
                        fill={'none'}
                        stroke={'#16a34a'}
                        strokeWidth={'1.8'}
                        strokeLinecap={'round'}
                        strokeLinejoin={'round'}
                        style={{ flex: 'none', display: 'block' }}
                      >
                        <path d={'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z'}></path>
                        <path d={'M4 7.5l8 4.5 8-4.5M12 12v9'}></path>
                      </svg>
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          lineHeight: '1.1',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {val(v['mgr']?.nReady, AR)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b6661' }}>{tr('Ready to go', AR)}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: '#fff',
                      border: '1px solid #eceae8',
                      borderRadius: '16px',
                      padding: '16px',
                    }}
                  >
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#f1f0ef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        width={'20'}
                        height={'20'}
                        viewBox={'0 0 24 24'}
                        fill={'none'}
                        stroke={'#0c0a09'}
                        strokeWidth={'1.8'}
                        strokeLinecap={'round'}
                        strokeLinejoin={'round'}
                        style={{ flex: 'none', display: 'block' }}
                      >
                        <path d={'M3 13l4 4L15 8M11 16l1 1 8-9'}></path>
                      </svg>
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          lineHeight: '1.1',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {val(v['mgr']?.nDone, AR)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b6661' }}>{tr('Completed today', AR)}</span>
                    </div>
                  </div>
                  {'\n          '}
                </div>
                {'\n          '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {'\n            '}
                  {arr(v['mgrChips']).map((L10_ch, I11) => (
                    <React.Fragment key={I11}>
                      <Btn
                        as="button"
                        onClick={L10_ch?.onClick}
                        style={css(
                          `display:flex; align-items:center; gap:8px; height:38px; padding:0 16px; border-radius:999px; border:1px solid ${S(L10_ch?.border)}; background:${S(L10_ch?.bg)}; color:${S(L10_ch?.color)}; font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-size:13px; font-weight:600; cursor:pointer; transition:background 0.2s ease, color 0.2s ease`,
                        )}
                        className="dlh1"
                      >
                        {val(L10_ch?.label, AR)}
                      </Btn>
                    </React.Fragment>
                  ))}
                  {'\n            '}
                  <span style={{ marginInlineStart: 'auto', fontSize: '12px', color: '#78716c' }}>
                    {tr('Auto-refresh on', AR)}
                  </span>
                  {'\n          '}
                </div>
                {'\n          '}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                    gap: '14px',
                    minHeight: '300px',
                  }}
                >
                  {'\n            '}
                  {arr(v['mgrCols']).map((L11_col, I12) => (
                    <React.Fragment key={I12}>
                      {'\n              '}
                      <div
                        style={{
                          background: '#f3f3f2',
                          border: '1px solid #eceae8',
                          borderRadius: '16px',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {'\n                '}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '2px 2px 4px',
                          }}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              fontWeight: '700',
                            }}
                          >
                            <span
                              style={css(`width:8px; height:8px; border-radius:50%; background:${S(L11_col?.dot)}`)}
                            ></span>
                            {val(L11_col?.title, AR)}
                          </span>
                          <span
                            style={{
                              minWidth: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: '#fff',
                              border: '1px solid #e7e5e4',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {val(L11_col?.count, AR)}
                          </span>
                        </div>
                        {'\n                '}
                        {L11_col?.empty ? (
                          <>
                            <div
                              style={{
                                flex: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                color: '#78716c',
                                padding: '30px 0',
                              }}
                            >
                              {tr('No orders', AR)}
                            </div>
                          </>
                        ) : null}
                        {'\n                '}
                        {arr(L11_col?.cards).map((L12_o, I13) => (
                          <React.Fragment key={I13}>
                            {'\n                  '}
                            <div
                              style={css(
                                `background:#fff; border:1px solid ${S(L12_o?.border)}; border-radius:12px; padding:12px 14px; box-shadow:${S(L12_o?.shadow)}; transition:border-color 0.8s ease, box-shadow 0.8s ease`,
                              )}
                            >
                              {'\n                    '}
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "'IBM Plex Mono',monospace",
                                    fontSize: '12px',
                                    color: '#8a8580',
                                  }}
                                >
                                  {'#'}
                                  {val(L12_o?.no, AR)}
                                </span>
                                <span
                                  style={css(
                                    `font-size:11px; font-weight:600; background:${S(L12_o?.tagBg)}; border-radius:999px; padding:3px 9px`,
                                  )}
                                >
                                  {val(L12_o?.type, AR)}
                                </span>
                              </div>
                              {'\n                    '}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                <img
                                  src={L12_o?.img}
                                  alt={''}
                                  style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    objectFit: 'cover',
                                    display: 'block',
                                    flex: 'none',
                                  }}
                                />
                                <div style={{ minWidth: '0' }}>
                                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{val(L12_o?.where, AR)}</div>
                                  <div
                                    style={{ fontSize: '13px', color: '#6b6661', marginTop: '2px', lineHeight: '1.4' }}
                                  >
                                    {val(L12_o?.items, AR)}
                                  </div>
                                </div>
                              </div>
                              {'\n                  '}
                            </div>
                            {'\n                '}
                          </React.Fragment>
                        ))}
                        {'\n              '}
                      </div>
                      {'\n            '}
                    </React.Fragment>
                  ))}
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '32px',
              marginTop: '48px',
            }}
          >
            {'\n      '}
            <div style={{ borderTop: '1px solid #0c0a09', paddingTop: '20px' }}>
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '22px',
                }}
              >
                {tr('Every order, the second it lands', AR)}
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr('New orders appear instantly, with the table number or address.', AR)}
              </p>
            </div>
            {'\n      '}
            <div style={{ borderTop: '1px solid #0c0a09', paddingTop: '20px' }}>
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '22px',
                }}
              >
                {tr('Change prices in seconds', AR)}
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr('Prices went up? Change them from your phone. No reprinting menus.', AR)}
              </p>
            </div>
            {'\n      '}
            <div style={{ borderTop: '1px solid #0c0a09', paddingTop: '20px' }}>
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '22px',
                }}
              >
                {tr('Every branch in one place', AR)}
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr('See every branch and every order from one screen.', AR)}
              </p>
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section
          style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}
        >
          {'\n    '}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '20px',
            }}
          >
            {'\n      '}
            <div>
              {'\n        '}
              <h2
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: 'clamp(34px,4.6vw,58px)',
                  lineHeight: '1.04',
                  letterSpacing: '-0.025em',
                  margin: '0',
                }}
              >
                {tr('Start free. Pay only when it’s worth it.', AR)}
              </h2>
              {'\n        '}
              <p style={{ fontSize: '18px', color: '#4e4e4e', margin: '16px 0 0' }}>
                {tr('Premium is $37 a month. Two delivery orders a week cover it.', AR)}
              </p>
              {'\n      '}
            </div>
            {'\n      '}
            <Btn
              as="button"
              onClick={v['goPricing']}
              style={{
                background: 'none',
                border: '0',
                padding: '0',
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontSize: '16px',
                fontWeight: '500',
                color: '#0c0a09',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                transition: 'opacity 0.18s ease',
              }}
              className="dlh0"
            >
              {tr('See full pricing →', AR)}
            </Btn>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
              gap: '16px',
              marginTop: '48px',
            }}
          >
            {'\n      '}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '24px',
                padding: 'clamp(28px,4vw,40px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {'\n        '}
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '23px',
                }}
                data-ar={'المجانية'}
              >
                {tr('Free', AR, 'المجانية')}
              </div>
              {'\n        '}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '16px' }}>
                <span
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    fontSize: '64px',
                    lineHeight: '1',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {'$0'}
                </span>
                <span style={{ color: '#777169' }}>{tr('forever', AR)}</span>
              </div>
              {'\n        '}
              <p style={{ fontSize: '16px', color: '#4e4e4e', margin: '12px 0 0' }}>
                {tr('Start taking pickup orders today.', AR)}
              </p>
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  margin: '28px 0 32px',
                  fontSize: '15px',
                  color: '#292524',
                }}
              >
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
                  <span>{tr('0% commission', AR)}</span>
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
                  <span>{tr('Pickup orders', AR)}</span>
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
                  <span>{tr('Up to 50 products', AR)}</span>
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
                  <span>{tr('2 menu languages', AR)}</span>
                </span>
              </div>
              {'\n        '}
              <a
                href={v['signupUrl']}
                style={{
                  marginTop: 'auto',
                  background: '#fff',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  borderRadius: '999px',
                  height: '50px',
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
                className="dlhc"
              >
                {tr('Start free', AR)}
              </a>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#0c0a09',
                color: '#fff',
                borderRadius: '24px',
                padding: 'clamp(28px,4vw,40px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {'\n        '}
              <div
                style={css(
                  `position:absolute; width:420px; height:420px; border-radius:50%; background:radial-gradient(circle, rgba(244,197,168,0.35) 0%, rgba(244,197,168,0) 65%); top:-200px; right:-120px; opacity:${S(v['orb'])}; pointer-events:none`,
                )}
              ></div>
              {'\n        '}
              <div
                style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    letterSpacing: '-0.015em',
                    lineHeight: '1.2',
                    fontSize: '23px',
                  }}
                  data-ar={'المميزة'}
                >
                  {tr('Premium', AR, 'المميزة')}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: '#292524',
                    borderRadius: '999px',
                    padding: '5px 11px',
                  }}
                >
                  {tr('First month free', AR)}
                </span>
              </div>
              {'\n        '}
              <div
                style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '16px' }}
              >
                <span
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    fontSize: '64px',
                    lineHeight: '1',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {'$37'}
                </span>
                <span style={{ color: '#a8a29e' }}>{tr('/ month', AR)}</span>
              </div>
              {v['isAr'] ? (
                <>
                  <div
                    data-no-ar={'1'}
                    dir={'rtl'}
                    style={{
                      position: 'relative',
                      marginTop: '8px',
                      fontFamily: "'Almarai',sans-serif",
                      fontSize: '15px',
                      color: '#d6d3d1',
                    }}
                  >
                    {'≈ 139 ريال'}
                  </div>
                </>
              ) : null}
              {'\n        '}
              <p style={{ position: 'relative', fontSize: '16px', color: '#a8a29e', margin: '12px 0 0' }}>
                {tr('Sell every way: pickup, tables and delivery.', AR)}
              </p>
              {'\n        '}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  margin: '28px 0 32px',
                  fontSize: '15px',
                  color: '#e7e5e4',
                }}
              >
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
                  <span>{tr('Everything in Free', AR)}</span>
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
                  <span>{tr('Table ordering and delivery', AR)}</span>
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
                  <span>{tr('Add-ons, unlimited products and languages', AR)}</span>
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
                  <span>{tr('Order translation, your brand only, multi-branch', AR)}</span>
                </span>
              </div>
              {'\n        '}
              <a
                href={v['premiumUrl']}
                style={{
                  position: 'relative',
                  marginTop: 'auto',
                  background: '#fff',
                  color: '#0c0a09',
                  border: '0',
                  borderRadius: '999px',
                  height: '50px',
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
                className="dlh5"
              >
                {tr('Try for free', AR)}
              </a>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section style={{ background: '#fff', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4' }}>
          {'\n    '}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '36px',
            }}
          >
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.6vw,58px)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
                margin: '0',
                maxWidth: '860px',
                textWrap: 'balance',
              }}
            >
              {tr('Built by two founders who watched delivery apps close good restaurants.', AR)}
            </h2>
            {'\n      '}
            <p
              style={{
                margin: '0',
                fontSize: 'clamp(20px,2vw,24px)',
                lineHeight: '1.55',
                color: '#292524',
                maxWidth: '760px',
                textWrap: 'pretty',
              }}
            >
              {tr(
                '“We saw owners we knew work harder every year and keep less. Dinelabs is our answer: your own ordering page, one flat fee, and every order yours.”',
                AR,
              )}
            </p>
            {'\n      '}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '28px',
                paddingTop: '28px',
                borderTop: '1px solid #e7e5e4',
              }}
            >
              {'\n        '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={'/assets/founder-hasan.webp'}
                  alt={'Hasan El Chami'}
                  onError={v['hideImg']}
                  style={{
                    width: '56px',
                    height: '56px',
                    flex: 'none',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                    background: '#f0efed',
                  }}
                />
                <div>
                  <div style={{ fontWeight: '500' }}>{tr('Hasan El Chami', AR)}</div>
                  <div style={{ fontSize: '14px', color: '#777169' }}>{tr('Co-founder · Beirut', AR)}</div>
                </div>
              </div>
              {'\n        '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={'/assets/founder-abdallah.webp'}
                  alt={'Abdallah Assaad'}
                  onError={v['hideImg']}
                  style={{
                    width: '56px',
                    height: '56px',
                    flex: 'none',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                    background: '#f0efed',
                  }}
                />
                <div>
                  <div style={{ fontWeight: '500' }}>{tr('Abdallah Assaad', AR)}</div>
                  <div style={{ fontSize: '14px', color: '#777169' }}>{tr('Co-founder · Tbilisi', AR)}</div>
                </div>
              </div>
              {'\n        '}
              <Btn
                as="button"
                onClick={v['goAbout']}
                style={{
                  marginInlineStart: 'auto',
                  background: 'none',
                  border: '0',
                  padding: '0',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#0c0a09',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  transition: 'opacity 0.18s ease',
                }}
                className="dlh0"
              >
                {tr('Read our story →', AR)}
              </Btn>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n\n  '}
        {'\n  '}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(32px,6vw,96px)',
          }}
        >
          {'\n    '}
          <div style={{ flex: '1 1 280px', minWidth: '0' }}>
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.6vw,58px)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
                margin: '0',
              }}
            >
              {tr('Questions owners ask', AR)}
            </h2>
            {'\n      '}
            <Btn
              as="button"
              onClick={v['goFaq']}
              style={{
                marginTop: '24px',
                background: 'none',
                border: '0',
                padding: '0',
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontSize: '16px',
                fontWeight: '500',
                color: '#0c0a09',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                transition: 'opacity 0.18s ease',
              }}
              className="dlh0"
            >
              {tr('See all questions →', AR)}
            </Btn>
            {'\n    '}
          </div>
          {'\n    '}
          <div style={{ flex: '2 1 480px', minWidth: '0', borderTop: '1px solid #d6d3d1' }}>
            {'\n      '}
            {arr(v['homeFaq']).map((L13_f, I14) => (
              <React.Fragment key={I14}>
                {'\n        '}
                <div style={{ borderBottom: '1px solid #d6d3d1' }}>
                  {'\n          '}
                  <Btn
                    as="button"
                    onClick={L13_f?.toggle}
                    aria-expanded={L13_f?.open}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: '0',
                      padding: '24px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '24px',
                      textAlign: 'start',
                      cursor: 'pointer',
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#0c0a09',
                      transition: 'opacity 0.18s ease',
                    }}
                    className="dlh0"
                  >
                    {val(L13_f?.q, AR)}
                    <span
                      style={{
                        flex: '0 0 auto',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#f0efed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '400',
                      }}
                    >
                      {val(L13_f?.icon, AR)}
                    </span>
                  </Btn>
                  {'\n          '}
                  {L13_f?.open ? (
                    <>
                      <p
                        style={{
                          margin: '-6px 0 0',
                          padding: '0 0 26px',
                          paddingInlineEnd: '56px',
                          fontSize: '16px',
                          lineHeight: '1.6',
                          color: '#4e4e4e',
                        }}
                      >
                        {val(L13_f?.a, AR)}
                      </p>
                      {L13_f?.hasTodo ? (
                        <>
                          <p style={{ margin: '-14px 0 0', padding: '0 0 26px', fontSize: '15px' }}>
                            <span
                              data-no-ar={'1'}
                              style={{
                                background: '#fbe4d6',
                                color: '#292524',
                                borderRadius: '4px',
                                padding: '1px 6px',
                                fontSize: '0.92em',
                              }}
                            >
                              {val(L13_f?.todo, false)}
                            </span>
                          </p>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {'\n        '}
                </div>
                {'\n      '}
              </React.Fragment>
            ))}
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid #e7e5e4' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:680px; height:680px; border-radius:50%; background:radial-gradient(circle, #e8b8c4 0%, rgba(232,184,196,0) 68%); top:-200px; left:10%; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:620px; height:620px; border-radius:50%; background:radial-gradient(circle, #a8c8e8 0%, rgba(168,200,232,0) 68%); bottom:-280px; right:5%; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '900px',
              margin: '0 auto',
              padding: 'clamp(88px,12vw,160px) clamp(20px,4vw,40px)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(40px,6vw,80px)',
                lineHeight: '1',
                letterSpacing: '-0.03em',
                margin: '0',
                textWrap: 'balance',
              }}
            >
              {tr('Stop paying the apps. Start selling direct.', AR)}
            </h2>
            {'\n      '}
            <p style={{ fontSize: '19px', lineHeight: '1.55', color: '#4e4e4e', margin: '20px 0 0' }}>
              {tr('Your store is ready in 3 minutes. Your first direct order could come in today.', AR)}
            </p>
            {'\n      '}
            <div
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '40px' }}
            >
              {'\n        '}
              <a
                href={v['signupUrl']}
                style={{
                  background: '#0c0a09',
                  color: '#fff',
                  border: '0',
                  borderRadius: '999px',
                  height: '52px',
                  padding: '0 28px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
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
                {tr('Start free', AR)}
              </a>
              {'\n        '}
              <a
                href={v['waDemo']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  borderRadius: '999px',
                  height: '52px',
                  padding: '0 26px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                }}
                className="dlhf"
              >
                {tr('Book a demo', AR)}
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
                marginTop: '22px',
                fontSize: '14px',
                color: '#777169',
              }}
            >
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
                <span>{tr('Free plan, no time limit', AR)}</span>
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

// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';
import StoreScreen from '../StoreScreen';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function FeaturesPage({ v, AR }) {
  return (
    <>
      <main>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, #a8c8e8 0%, rgba(168,200,232,0) 68%); top:-300px; right:-160px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: 'clamp(64px,9vw,112px) clamp(20px,4vw,40px) clamp(40px,5vw,64px)',
            }}
          >
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
              {tr('Features', AR)}
            </div>
            {'\n      '}
            <h1
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(44px,6.4vw,84px)',
                lineHeight: '1',
                letterSpacing: '-0.035em',
                margin: '20px 0 0',
                maxWidth: '900px',
                textWrap: 'balance',
              }}
            >
              {tr('Everything you need to sell direct.', AR)}
            </h1>
            {'\n      '}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '36px' }}>
              {'\n        '}
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
              {'\n        '}
              <a
                href={v['storeUrl']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  background: 'rgba(255,255,255,0.6)',
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
                className="dlhf"
              >
                {tr('See a live store →', AR)}
              </a>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        {arr(v['pillars']).map((L14_p, I15) => (
          <React.Fragment key={I15}>
            {'\n    '}
            <section
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'clamp(40px,6vw,72px) clamp(20px,4vw,40px)',
                borderTop: '1px solid #e7e5e4',
              }}
            >
              {'\n      '}
              <div
                style={css(
                  `display:flex; flex-wrap:wrap; flex-direction:${S(L14_p?.dir)}; align-items:center; gap:clamp(32px,6vw,88px)`,
                )}
              >
                {'\n        '}
                <div style={{ flex: '1 1 380px', minWidth: '0' }}>
                  {'\n          '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#777169' }}>
                      {val(L14_p?.n, AR)}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#777169',
                      }}
                    >
                      {val(L14_p?.pillar, AR)}
                    </span>
                  </div>
                  {'\n          '}
                  <h2
                    style={{
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontWeight: '500',
                      fontSize: 'clamp(32px,4vw,52px)',
                      lineHeight: '1.05',
                      letterSpacing: '-0.025em',
                      margin: '16px 0 0',
                      textWrap: 'balance',
                    }}
                  >
                    {val(L14_p?.promise, AR)}
                  </h2>
                  {'\n          '}
                  <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column' }}>
                    {'\n            '}
                    {arr(L14_p?.points).map((L15_pt, I16) => (
                      <React.Fragment key={I16}>
                        {'\n              '}
                        <div
                          style={{
                            display: 'flex',
                            gap: '14px',
                            padding: '16px 0',
                            borderTop: '1px solid #e7e5e4',
                            fontSize: '17px',
                            lineHeight: '1.5',
                            color: '#292524',
                          }}
                        >
                          <span
                            style={{
                              flex: 'none',
                              width: '20px',
                              height: '20px',
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
                              width={'12'}
                              height={'12'}
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
                          <span>{val(L15_pt, AR)}</span>
                        </div>
                        {'\n            '}
                      </React.Fragment>
                    ))}
                    {'\n          '}
                  </div>
                  {'\n        '}
                </div>
                {'\n        '}
                <div
                  style={{
                    flex: '1 1 420px',
                    minWidth: '0',
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '5/4',
                    borderRadius: '28px',
                    background: '#fff',
                    border: '1px solid #e7e5e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {'\n          '}
                  <div
                    style={css(
                      `position:absolute; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle, ${S(L14_p?.orb)} 0%, rgba(255,255,255,0) 68%); top:50%; left:50%; transform:translate(-50%,-50%); opacity:${S(v['orb'])}`,
                    )}
                  ></div>
                  {'\n          '}
                  {L14_p?.phoneScr ? (
                    <>
                      <div
                        style={{
                          position: 'relative',
                          height: '90%',
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
                            <StoreScreen lang={v['lang']} screen={L14_p?.phoneScr} store={L14_p?.store} />
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
                    </>
                  ) : null}
                  {'\n          '}
                  {L14_p?.deskScr ? (
                    <>
                      <div
                        style={{
                          position: 'relative',
                          width: '84%',
                          background: '#1c1917',
                          borderRadius: '14px',
                          padding: '6px',
                          boxShadow: '0 30px 60px -30px rgba(12,10,9,0.45)',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '5px', padding: '3px 5px 7px' }}>
                          <span
                            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#44403c' }}
                          ></span>
                          <span
                            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#44403c' }}
                          ></span>
                          <span
                            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#44403c' }}
                          ></span>
                        </div>
                        <div
                          dir={'ltr'}
                          style={{ aspectRatio: '16/10', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}
                        >
                          <div className="phone-host" style={{ width: '100%', height: '100%' }}>
                            <StoreScreen lang={v['lang']} screen={L14_p?.deskScr} store={L14_p?.store} />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {'\n          '}
                  {L14_p?.isSoon ? (
                    <>
                      <div
                        style={{
                          position: 'relative',
                          width: '78%',
                          background: '#fff',
                          border: '1px solid #e7e5e4',
                          borderRadius: '16px',
                          padding: '18px 20px',
                          boxShadow: '0 30px 60px -30px rgba(12,10,9,0.35)',
                          fontSize: '14px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#777169',
                            paddingBottom: '10px',
                          }}
                        >
                          <span>{tr('Dish', AR)}</span>
                          <span>{tr('You · Nearby', AR)}</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '11px 0',
                            borderTop: '1px solid #f0efed',
                          }}
                        >
                          <span>{tr('Flat white', AR)}</span>
                          <span>
                            {'$3.50 · '}
                            <span style={{ color: '#777169' }}>{'$4.20'}</span>
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '11px 0',
                            borderTop: '1px solid #f0efed',
                          }}
                        >
                          <span>{tr('Pancakes', AR)}</span>
                          <span>
                            {'$9.00 · '}
                            <span style={{ color: '#777169' }}>{'$8.60'}</span>
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '11px 0',
                            borderTop: '1px solid #f0efed',
                          }}
                        >
                          <span>{tr('Avocado toast', AR)}</span>
                          <span>
                            {'$11.00 · '}
                            <span style={{ color: '#777169' }}>{'$12.50'}</span>
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: '8px',
                            background: '#a7e5d3',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            fontWeight: '500',
                          }}
                        >
                          {tr('Your flat white is 17% cheaper than coffee shops nearby.', AR)}
                        </div>
                      </div>
                    </>
                  ) : null}
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </section>
            {'\n  '}
          </React.Fragment>
        ))}
        {'\n  '}
        <section style={{ background: '#0c0a09', color: '#fff', textAlign: 'center' }}>
          {'\n    '}
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: 'clamp(80px,11vw,136px) clamp(20px,4vw,40px)',
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
                fontSize: 'clamp(38px,5.4vw,70px)',
                lineHeight: '1.02',
                letterSpacing: '-0.03em',
                margin: '0',
              }}
            >
              {tr('Stop paying the apps. Start selling direct.', AR)}
            </h2>
            {'\n      '}
            <a
              href={v['signupUrl']}
              style={{
                marginTop: '36px',
                background: '#fff',
                color: '#0c0a09',
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
              className="dlhg dlh4"
            >
              {tr('Start free', AR)}
            </a>
            {'\n      '}
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#a8a29e' }}>
              {tr('Free plan, no time limit · Premium free for 30 days', AR)}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
      </main>
    </>
  );
}

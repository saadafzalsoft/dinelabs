// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function FaqPage({ v, AR }) {
  return (
    <>
      <main>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, #c8b8e0 0%, rgba(200,184,224,0) 68%); top:-320px; left:-160px; opacity:${S(v['orb'])}; pointer-events:none`,
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
              {tr('FAQ', AR)}
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
              }}
            >
              {tr('Your questions, answered.', AR)}
            </h1>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        {arr(v['faqGroups']).map((L20_grp, I21) => (
          <React.Fragment key={I21}>
            {'\n    '}
            <section
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'clamp(32px,5vw,56px) clamp(20px,4vw,40px)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(24px,6vw,96px)',
              }}
            >
              {'\n      '}
              <div style={{ flex: '1 1 280px', minWidth: '0' }}>
                <h2
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    fontSize: 'clamp(28px,3.2vw,40px)',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em',
                    margin: '0',
                  }}
                >
                  {val(L20_grp?.title, AR)}
                </h2>
              </div>
              {'\n      '}
              <div style={{ flex: '2 1 480px', minWidth: '0', borderTop: '1px solid #d6d3d1' }}>
                {'\n        '}
                {arr(L20_grp?.items).map((L21_f, I22) => (
                  <React.Fragment key={I22}>
                    {'\n          '}
                    <div style={{ borderBottom: '1px solid #d6d3d1' }}>
                      {'\n            '}
                      <Btn
                        as="button"
                        onClick={L21_f?.toggle}
                        aria-expanded={L21_f?.open}
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
                        {val(L21_f?.q, AR)}
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
                          {val(L21_f?.icon, AR)}
                        </span>
                      </Btn>
                      {'\n            '}
                      {L21_f?.open ? (
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
                            {val(L21_f?.a, AR)}
                          </p>
                          {L21_f?.hasTodo ? (
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
                                  {val(L21_f?.todo, false)}
                                </span>
                              </p>
                            </>
                          ) : null}
                        </>
                      ) : null}
                      {'\n          '}
                    </div>
                    {'\n        '}
                  </React.Fragment>
                ))}
                {'\n      '}
              </div>
              {'\n    '}
            </section>
            {'\n  '}
          </React.Fragment>
        ))}
        {'\n  '}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px) clamp(72px,10vw,120px)',
          }}
        >
          {'\n    '}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#0c0a09',
              color: '#fff',
              borderRadius: '28px',
              padding: 'clamp(32px,5vw,64px)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '28px',
            }}
          >
            {'\n      '}
            <div
              style={css(
                `position:absolute; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle, rgba(168,200,232,0.35) 0%, rgba(168,200,232,0) 65%); top:-260px; right:-100px; opacity:${S(v['orb'])}; pointer-events:none`,
              )}
            ></div>
            {'\n      '}
            <div style={{ position: 'relative', flex: '1 1 380px', minWidth: '0' }}>
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: 'clamp(30px,3.6vw,46px)',
                  lineHeight: '1.08',
                  letterSpacing: '-0.02em',
                }}
              >
                {tr('Still have a question?', AR)}
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '17px', color: '#a8a29e' }}>
                {tr('Send the founders a WhatsApp. Real people, real answers.', AR)}
              </p>
            </div>
            {'\n      '}
            <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {'\n        '}
              <a
                href={v['signupUrl']}
                style={{
                  background: '#fff',
                  color: '#0c0a09',
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
                className="dlhg dlh4"
              >
                {tr('Start free', AR)}
              </a>
              {'\n        '}
              <a
                href={v['waGeneral']}
                target={'_blank'}
                rel={'noopener'}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #44403c',
                  borderRadius: '999px',
                  height: '50px',
                  padding: '0 24px',
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                }}
                className="dlhi"
              >
                {tr('WhatsApp us', AR)}
              </a>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
      </main>
    </>
  );
}

// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function AboutPage({ v, AR }) {
  return (
    <>
      <main>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:760px; height:760px; border-radius:50%; background:radial-gradient(circle, #e8b8c4 0%, rgba(232,184,196,0) 68%); top:-340px; right:-220px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              padding: 'clamp(64px,9vw,120px) clamp(20px,4vw,40px) clamp(48px,6vw,80px)',
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
              {tr('Our story', AR)}
            </div>
            {'\n      '}
            <h1
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(40px,5.6vw,76px)',
                lineHeight: '1.02',
                letterSpacing: '-0.03em',
                margin: '20px 0 0',
                textWrap: 'balance',
              }}
            >
              {tr('We started Dinelabs because good restaurants were closing for the wrong reasons.', AR)}
            </h1>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        <section
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 clamp(20px,4vw,40px) clamp(64px,9vw,112px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
          }}
        >
          {'\n    '}
          <div style={{ flex: '1 1 200px' }}></div>
          {'\n    '}
          <div
            style={{
              flex: '3 1 520px',
              minWidth: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              fontSize: 'clamp(18px,1.6vw,20px)',
              lineHeight: '1.65',
              color: '#292524',
              textWrap: 'pretty',
            }}
          >
            {'\n      '}
            <p style={{ margin: '0' }}>
              {tr(
                "We watched owners we knew work harder every year and keep less. The food was good. The guests were loyal. But delivery apps took 25–30% of every order, and some of those places didn't make it.",
                AR,
              )}
            </p>
            {'\n      '}
            <p style={{ margin: '0' }}>
              {tr(
                "Delivery apps are great at one thing: finding you new customers. They're not interested in helping you keep them. Every repeat order still runs through their app, and every time, they take their cut.",
                AR,
              )}
            </p>
            {'\n      '}
            <p style={{ margin: '0' }}>
              {tr(
                'So we built the alternative. Dinelabs gives every restaurant and coffee shop its own ordering page for pickup, delivery and table orders, for a flat monthly fee instead of a commission.',
                AR,
              )}
            </p>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        <section style={{ background: '#0c0a09', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:760px; height:760px; border-radius:50%; background:radial-gradient(circle, rgba(167,229,211,0.28) 0%, rgba(167,229,211,0) 65%); bottom:-360px; left:-200px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              padding: 'clamp(80px,11vw,136px) clamp(20px,4vw,40px)',
            }}
          >
            {'\n      '}
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#a8a29e',
              }}
            >
              {tr('Mission', AR)}
            </div>
            {'\n      '}
            <div
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.8vw,62px)',
                lineHeight: '1.08',
                letterSpacing: '-0.025em',
                marginTop: '20px',
                textWrap: 'balance',
              }}
            >
              {tr(
                'Help every restaurant and coffee shop keep what it earns, and make every decision with real numbers.',
                AR,
              )}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
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
          <div style={{ flex: '1 1 300px', minWidth: '0' }}>
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.4vw,52px)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
                margin: '0',
              }}
            >
              {tr("Where we're going", AR)}
            </h2>
          </div>
          {'\n    '}
          <p
            style={{
              flex: '2 1 480px',
              minWidth: '0',
              margin: '0',
              fontSize: '19px',
              lineHeight: '1.65',
              color: '#292524',
            }}
          >
            {tr(
              "We want Dinelabs to be the one tool every restaurant and coffee shop runs on. Too many owners still set prices by feel. That's why we're building menu analysis: see how your prices compare to places near you, so every price is a confident one.",
              AR,
            )}
          </p>
          {'\n  '}
        </section>
        {'\n  '}
        <section
          style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(20px,4vw,40px) clamp(72px,10vw,120px)' }}
        >
          {'\n    '}
          <h2
            style={{
              fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
              fontWeight: '500',
              fontSize: 'clamp(34px,4.4vw,52px)',
              lineHeight: '1.04',
              letterSpacing: '-0.025em',
              margin: '0',
            }}
          >
            {tr('What we believe', AR)}
          </h2>
          {'\n    '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: '16px',
              marginTop: '40px',
            }}
          >
            {'\n      '}
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '20px', padding: '32px' }}>
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '23px',
                }}
              >
                {tr('You keep what you earn.', AR)}
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr(
                  "Delivery apps earn more when you sell more. We don't think that's fair. We charge one flat monthly price and never take a cut of your orders.",
                  AR,
                )}
              </p>
            </div>
            {'\n      '}
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '20px', padding: '32px' }}>
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '23px',
                }}
              >
                {tr('Prices should be clear.', AR)}
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr('One monthly price. No percentage, no hidden fees, no contract. Not happy? Cancel anytime.', AR)}
              </p>
            </div>
            {'\n      '}
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '20px', padding: '32px' }}>
              <div
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2',
                  fontSize: '23px',
                }}
              >
                {tr('Decisions need real numbers.', AR)}
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                {tr(
                  "Most owners price by feel. We're building tools that show what others charge, so you know you got it right.",
                  AR,
                )}
              </p>
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        <section style={{ background: '#fff', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4' }}>
          {'\n    '}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}>
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(34px,4.4vw,52px)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
                margin: '0',
              }}
            >
              {tr('The founders', AR)}
            </h2>
            {'\n      '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))',
                gap: '16px',
                marginTop: '40px',
              }}
            >
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'clamp(20px,2.4vw,28px)',
                  alignItems: 'stretch',
                  background: '#fafaf9',
                  border: '1px solid #e7e5e4',
                  borderRadius: '20px',
                  padding: 'clamp(20px,2.4vw,28px)',
                }}
              >
                {'\n          '}
                <div
                  style={{
                    flex: 'none',
                    width: 'clamp(112px,12vw,156px)',
                    aspectRatio: '4/5',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#f0efed',
                  }}
                >
                  <img
                    src={'/assets/founder-hasan.webp'}
                    alt={'Hasan El Chami'}
                    onError={v['hideImg']}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                {'\n          '}
                <div style={{ flex: '1 1 220px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontWeight: '500',
                      letterSpacing: '-0.015em',
                      lineHeight: '1.2',
                      fontSize: '23px',
                    }}
                  >
                    {tr('Hasan El Chami', AR)}
                  </div>
                  <div style={{ fontSize: '15px', color: '#777169', marginTop: '4px' }}>
                    {tr('Co-founder · Beirut, Lebanon', AR)}
                  </div>
                  <p
                    style={{
                      margin: '12px 0 0',
                      fontSize: '16px',
                      lineHeight: '1.55',
                      color: '#292524',
                      textWrap: 'pretty',
                    }}
                  >
                    {tr('Leads product and design, and builds food-market data tools for the Gulf.', AR)}
                  </p>
                  <a
                    href={'https://www.linkedin.com/in/hasanelchami/'}
                    target={'_blank'}
                    rel={'noopener'}
                    style={{
                      marginTop: 'auto',
                      paddingTop: '16px',
                      alignSelf: 'flex-start',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#0c0a09',
                      textDecoration: 'none',
                    }}
                    className="dlhh"
                  >
                    {tr('LinkedIn ', AR)}
                    <span aria-hidden={'true'}>{'↗'}</span>
                  </a>
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'clamp(20px,2.4vw,28px)',
                  alignItems: 'stretch',
                  background: '#fafaf9',
                  border: '1px solid #e7e5e4',
                  borderRadius: '20px',
                  padding: 'clamp(20px,2.4vw,28px)',
                }}
              >
                {'\n          '}
                <div
                  style={{
                    flex: 'none',
                    width: 'clamp(112px,12vw,156px)',
                    aspectRatio: '4/5',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#f0efed',
                  }}
                >
                  <img
                    src={'/assets/founder-abdallah.webp'}
                    alt={'Abdallah Assaad'}
                    onError={v['hideImg']}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                {'\n          '}
                <div style={{ flex: '1 1 220px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontWeight: '500',
                      letterSpacing: '-0.015em',
                      lineHeight: '1.2',
                      fontSize: '23px',
                    }}
                  >
                    {tr('Abdallah Assaad', AR)}
                  </div>
                  <div style={{ fontSize: '15px', color: '#777169', marginTop: '4px' }}>
                    {tr('Co-founder · Tbilisi, Georgia', AR)}
                  </div>
                  <p
                    style={{
                      margin: '12px 0 0',
                      fontSize: '16px',
                      lineHeight: '1.55',
                      color: '#292524',
                      textWrap: 'pretty',
                    }}
                  >
                    {tr('Leads growth and sales, and builds relationships with food brands and retailers.', AR)}
                  </p>
                  <a
                    href={'https://www.linkedin.com/in/abdallah-assaad-300a75233/'}
                    target={'_blank'}
                    rel={'noopener'}
                    style={{
                      marginTop: 'auto',
                      paddingTop: '16px',
                      alignSelf: 'flex-start',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#0c0a09',
                      textDecoration: 'none',
                    }}
                    className="dlhh"
                  >
                    {tr('LinkedIn ', AR)}
                    <span aria-hidden={'true'}>{'↗'}</span>
                  </a>
                </div>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        <section style={{ borderBottom: '1px solid #e7e5e4', background: '#fff' }}>
          {'\n    '}
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '24px clamp(20px,4vw,40px)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '12px 32px',
              fontSize: '15px',
              fontWeight: '500',
              color: '#292524',
            }}
          >
            <span>{tr('Founded 2026', AR)}</span>
            <span>{tr('Headquartered in Beirut', AR)}</span>
            <span>{tr('Team in Beirut and Tbilisi', AR)}</span>
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:680px; height:680px; border-radius:50%; background:radial-gradient(circle, #f4c5a8 0%, rgba(244,197,168,0) 68%); top:-200px; left:30%; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '900px',
              margin: '0 auto',
              padding: 'clamp(88px,12vw,150px) clamp(20px,4vw,40px)',
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
                fontSize: 'clamp(40px,5.6vw,72px)',
                lineHeight: '1.02',
                letterSpacing: '-0.03em',
                margin: '0',
                textWrap: 'balance',
              }}
            >
              {tr('Keep what you earn. Starting today.', AR)}
            </h2>
            {'\n      '}
            <a
              href={v['signupUrl']}
              style={{
                marginTop: '36px',
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
            {'\n    '}
          </div>
          {'\n  '}
        </section>
      </main>
    </>
  );
}

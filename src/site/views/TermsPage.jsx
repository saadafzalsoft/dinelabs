// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function TermsPage({ v, AR }) {
  return (
    <>
      <main data-no-ar={'1'} dir={'ltr'}>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid #e7e5e4' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:640px; height:640px; border-radius:50%; background:radial-gradient(circle, #a8c8e8 0%, rgba(168,200,232,0) 68%); top:-340px; right:-160px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: 'clamp(56px,8vw,96px) clamp(20px,4vw,40px) clamp(40px,5vw,56px)',
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
              {'Legal'}
            </div>
            {'\n      '}
            <h1
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(40px,5.6vw,72px)',
                lineHeight: '1.02',
                letterSpacing: '-0.035em',
                margin: '18px 0 0',
              }}
            >
              {'Terms & Conditions'}
            </h1>
            {'\n      '}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px 24px',
                marginTop: '20px',
                fontSize: '15px',
                color: '#777169',
              }}
            >
              <span>
                {'Last updated: '}
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
                  {'TODO: publish date'}
                </span>
              </span>
              <span>{'Plain language. No legalese where we can avoid it.'}</span>
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
            padding: 'clamp(40px,6vw,72px) clamp(20px,4vw,40px) clamp(72px,10vw,120px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: 'clamp(32px,6vw,80px)',
          }}
        >
          {'\n    '}
          <aside
            style={css(
              `flex:0 1 260px; min-width:0; position:${S(v['tocPos'])}; top:92px; max-height:calc(100vh - 110px); overflow-y:auto; align-self:flex-start`,
            )}
          >
            {'\n      '}
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#777169',
                padding: '0 12px 10px',
              }}
            >
              {'On this page'}
            </div>
            {'\n      '}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {'\n          '}
              <a
                href={'#tc-1'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'1'}
                </span>
                <span>{'About these terms'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-2'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'2'}
                </span>
                <span>{'Your account'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-3'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'3'}
                </span>
                <span>{'Plans and payment'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-4'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'4'}
                </span>
                <span>{'Your orders and your guests'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-5'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'5'}
                </span>
                <span>{'Your content'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-6'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'6'}
                </span>
                <span>{'Acceptable use'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-7'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'7'}
                </span>
                <span>{'Translation'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-8'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'8'}
                </span>
                <span>{'Availability and changes'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-9'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'9'}
                </span>
                <span>{'Ending the agreement'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-10'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'10'}
                </span>
                <span>{'Liability'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-11'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'11'}
                </span>
                <span>{'Privacy'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-12'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'12'}
                </span>
                <span>{'Governing law'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-13'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'13'}
                </span>
                <span>{'Changes to these terms'}</span>
              </a>
              {'\n          '}
              <a
                href={'#tc-14'}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#4e4e4e',
                  textDecoration: 'none',
                }}
                className="dlhk"
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: '12px',
                    color: '#78716c',
                    minWidth: '18px',
                    paddingTop: '1px',
                  }}
                >
                  {'14'}
                </span>
                <span>{'Contact us'}</span>
              </a>
              {'\n      '}
            </nav>
            {'\n    '}
          </aside>
          {'\n    '}
          <article
            style={{
              flex: '1 1 420px',
              minWidth: '0',
              maxWidth: '760px',
              fontSize: '17px',
              lineHeight: '1.7',
              color: '#292524',
            }}
          >
            {'\n      '}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '20px',
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {'\n        '}
              <div style={{ fontSize: '15px', fontWeight: '600' }}>{'The short version'}</div>
              {'\n        '}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '15px',
                  lineHeight: '1.55',
                  color: '#4e4e4e',
                }}
              >
                {'\n          '}
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
                  <span>{'No commission on your orders, ever.'}</span>
                </span>
                {'\n          '}
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
                  <span>{'Your menu, content and customers stay yours.'}</span>
                </span>
                {'\n          '}
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
                  <span>{'You sell to your guests directly and handle your orders.'}</span>
                </span>
                {'\n          '}
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
                  <span>{'Cancel anytime and take your data with you.'}</span>
                </span>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <h2
              id={'tc-1'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '48px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'1. About these terms'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'These terms are an agreement between you and Dinelabs (“Dinelabs”, “we”, “us”), based in Beirut, Lebanon. They cover our website, the storefronts we host, QR ordering, the owner portal, our apps, and any product we add later (together, the “Services”).'
              }
            </p>
            <p style={{ margin: '14px 0 0' }}>
              {
                'By creating an account or using the Services, you agree to these terms. If you sign up for a business, you confirm you’re allowed to agree on its behalf.'
              }
            </p>
            {'\n      '}
            <h2
              id={'tc-2'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'2. Your account'}
            </h2>
            <ul
              style={{
                margin: '14px 0 0',
                paddingInlineStart: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>{'Give us accurate details and keep them up to date.'}</li>
              <li>{'Keep your login private. You’re responsible for what happens in your account.'}</li>
              <li>
                {'Tell us right away at '}
                <a href={'mailto:team@dinelabs.co'}>{'team@dinelabs.co'}</a>
                {' if you think someone else has access.'}
              </li>
            </ul>
            {'\n      '}
            <h2
              id={'tc-3'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'3. Plans and payment'}
            </h2>
            <ul
              style={{
                margin: '14px 0 0',
                paddingInlineStart: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>
                {'The Free plan has no time limit. Premium is billed monthly '}
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
                  {'TODO: add “or yearly” only if a yearly plan exists'}
                </span>
                {' at the price shown on our Pricing page.'}
              </li>
              <li>{'We don’t take a commission on your orders.'}</li>
              <li>
                {
                  'Today, we arrange payment with you directly. Online payment, including MyFatoorah in Saudi Arabia and Whish Money in Lebanon, is coming soon and will be handled by those payment providers.'
                }
              </li>
              <li>{'Prices may change. We’ll tell you at least 30 days before a change applies to you.'}</li>
              <li>{'Fees already paid aren’t refundable, unless the law says otherwise.'}</li>
            </ul>
            {'\n      '}
            <h2
              id={'tc-4'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'4. Your orders and your guests'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'You sell to your guests directly. Dinelabs provides the tools, but isn’t a party to the sale. You are responsible for:'
              }
            </p>
            <ul
              style={{
                margin: '14px 0 0',
                paddingInlineStart: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>{'your menu, prices, taxes and the accuracy of what you list, including allergens'}</li>
              <li>{'preparing, delivering and handing over orders'}</li>
              <li>{'refunds, complaints and any payment you collect from guests'}</li>
              <li>{'following the food, health and consumer laws that apply to your business'}</li>
            </ul>
            {'\n      '}
            <h2
              id={'tc-5'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'5. Your content'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'You own the menus, photos, logos and other content you add. You give us permission to host, display, translate and resize it so we can run your storefront. You confirm you have the right to use everything you upload.'
              }
            </p>
            {'\n      '}
            <h2
              id={'tc-6'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'6. Acceptable use'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>{'Don’t use the Services to:'}</p>
            <ul
              style={{
                margin: '14px 0 0',
                paddingInlineStart: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>{'sell anything illegal or break the law'}</li>
              <li>{'upload content that’s misleading, offensive or someone else’s without permission'}</li>
              <li>{'send spam to guests'}</li>
              <li>{'try to break, overload or copy the Services, or access other accounts'}</li>
            </ul>
            {'\n      '}
            <h2
              id={'tc-7'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'7. Translation'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'Menus are translated automatically. Translations can contain mistakes. Check the important details, like allergens and ingredients, in the languages you serve.'
              }
            </p>
            {'\n      '}
            <h2
              id={'tc-8'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'8. Availability and changes'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'We work to keep the Services running, but we can’t promise they’ll never go down. We may add, change or remove features. If we remove something important to a paid plan, we’ll tell you first.'
              }
            </p>
            {'\n      '}
            <h2
              id={'tc-9'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'9. Ending the agreement'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'You can close your account at any time from the portal or by emailing us. We may suspend or close an account that breaks these terms, after warning you when we reasonably can. After closing, you can ask for an export of your menu and order data within 30 days.'
              }
            </p>
            {'\n      '}
            <h2
              id={'tc-10'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'10. Liability'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'The Services are provided “as is”. To the extent the law allows, Dinelabs isn’t liable for lost profits or indirect losses. Our total liability to you is limited to the fees you paid us in the 12 months before the claim.'
              }
            </p>
            {'\n      '}
            <h2
              id={'tc-11'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'11. Privacy'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {'How we handle personal information is explained in our '}
              <Btn as="a" href={'#'} onClick={v['goPrivacyLink']}>
                {'Privacy Policy'}
              </Btn>
              {'.'}
            </p>
            {'\n      '}
            <h2
              id={'tc-12'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'12. Governing law'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {'These terms are governed by the laws of Lebanon. Disputes go to the courts of '}
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
                {'TODO: city for legal disputes'}
              </span>
              {'.'}
            </p>
            {'\n      '}
            <h2
              id={'tc-13'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'13. Changes to these terms'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'We’ll post updates here and change the “Last updated” date. If a change is significant, we’ll email you or show a notice in the portal at least 15 days before it applies.'
              }
            </p>
            {'\n      '}
            <h2
              id={'tc-14'}
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(24px,2.4vw,30px)',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                margin: '56px 0 0',
                scrollMarginTop: '100px',
              }}
            >
              {'14. Contact us'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {'Dinelabs · Beirut, Lebanon · '}
              <a href={'mailto:team@dinelabs.co'}>{'team@dinelabs.co'}</a>
            </p>
            {'\n    '}
          </article>
          {'\n  '}
        </section>
      </main>
    </>
  );
}

// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function PrivacyPage({ v, AR }) {
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
              {'Privacy Policy'}
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
                href={'#pp-1'}
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
                <span>{'Who we are and what this covers'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-2'}
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
                <span>{'Who this policy is for'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-3'}
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
                <span>{'Our role'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-4'}
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
                <span>{'What we collect'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-5'}
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
                <span>{'How we use it'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-6'}
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
                <span>{'Aggregated and anonymized data'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-7'}
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
                <span>{'Who we share information with'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-8'}
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
                <span>{'International transfers'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-9'}
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
                <span>{'How long we keep it'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-10'}
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
                <span>{'Cookies'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-11'}
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
                <span>{'How we protect it'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-12'}
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
                <span>{'Your rights'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-13'}
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
                <span>{'Children'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-14'}
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
                <span>{'Changes to this policy'}</span>
              </a>
              {'\n          '}
              <a
                href={'#pp-15'}
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
                  {'15'}
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
                  <span>{'We only collect what an order or account needs.'}</span>
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
                  <span>{'Guest orders belong to the restaurant, not to us.'}</span>
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
                  <span>{'We never sell personal information.'}</span>
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
                  <span>{'You can ask for a copy, a fix, or deletion anytime.'}</span>
                </span>
                {'\n        '}
              </div>
              {'\n      '}
            </div>
            {'\n      '}
            <h2
              id={'pp-1'}
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
              {'1. Who we are and what this covers'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'Dinelabs (“Dinelabs”, “we”, “us”) provides online storefronts that let restaurants and coffee shops take orders directly from their guests. We are based in Beirut, Lebanon, and you can reach us at '
              }
              <a href={'mailto:team@dinelabs.co'}>{'team@dinelabs.co'}</a>
              {'.'}
            </p>
            <p style={{ margin: '14px 0 0' }}>
              {
                'This policy explains what personal information we collect, how we use it, and the choices you have. It applies to everything we offer, now and in the future (together, the “Services”):'
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
              <li>{'our website, dinelabs.co'}</li>
              <li>{'storefronts we host for restaurants, including QR code ordering at tables'}</li>
              <li>{'the owner portal restaurants use to manage menus and orders'}</li>
              <li>
                {
                  'our mobile apps, and any new product or feature we launch, such as loyalty, online payments or menu analysis'
                }
              </li>
            </ul>
            <p style={{ margin: '14px 0 0' }}>
              {
                'If a new product collects information in a way this policy doesn’t describe, we’ll update this policy before that product launches.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-2'}
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
              {'2. Who this policy is for'}
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
                <strong>{'Restaurants:'}</strong>
                {' businesses that sign up for Dinelabs, and the people who run their accounts (“Merchants”)'}
              </li>
              <li>
                <strong>{'Guests:'}</strong>
                {' people who view a menu or place an order through a Merchant’s storefront'}
              </li>
              <li>
                <strong>{'Visitors:'}</strong>
                {' people who browse our website'}
              </li>
            </ul>
            {'\n      '}
            <h2
              id={'pp-3'}
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
              {'3. Our role'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              <strong>{'Merchant account data.'}</strong>
              {
                ' When you sign up as a Merchant, we decide how your account information is used. For this data we are the data controller.'
              }
            </p>
            <p style={{ margin: '14px 0 0' }}>
              <strong>{'Guest order data.'}</strong>
              {
                ' When a guest orders from a restaurant, the order belongs to the restaurant. The restaurant decides how to use it to prepare, deliver and follow up on that order, and is responsible for it as the data controller. We process that data on the restaurant’s behalf to run the storefront and deliver the order to them. If you’re a guest and have a question about how a restaurant uses your information, contact that restaurant first. We’ll help if they can’t.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-4'}
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
              {'4. What we collect'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>{'We only collect what we need to run the Services.'}</p>
            <h3 style={{ fontSize: '17px', fontWeight: '600', margin: '28px 0 0' }}>{'From Merchants'}</h3>
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
                <strong>{'Account details:'}</strong>
                {' your name, business name, email address, phone number, and the branches you manage'}
              </li>
              <li>
                <strong>{'Menu and store content:'}</strong>
                {' products, prices, descriptions, photos, logos, colors and translations you add'}
              </li>
              <li>
                <strong>{'Billing details:'}</strong>
                {
                  ' your plan, payment history, and how you paid. Once online payment is available, payments are handled by payment providers, and we never store full card numbers.'
                }
              </li>
              <li>
                <strong>{'Usage data:'}</strong>
                {' how you use the portal, such as logins, settings and menu changes'}
              </li>
              <li>
                <strong>{'Messages:'}</strong>
                {' anything you send us by email, WhatsApp or other channels'}
              </li>
            </ul>
            <h3 style={{ fontSize: '17px', fontWeight: '600', margin: '28px 0 0' }}>{'From Guests'}</h3>
            <p style={{ margin: '14px 0 0' }}>
              {'Guests don’t need an account to order. We only ask for what the order needs:'}
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
              <li>
                <strong>{'Dine-in orders:'}</strong>
                {' the table number, the items ordered, add-ons and order notes'}
              </li>
              <li>
                <strong>{'Pickup orders:'}</strong>
                {' the items ordered and the contact details needed to reach you about the order'}
              </li>
              <li>
                <strong>{'Delivery orders:'}</strong>
                {' your name, phone number, email address and delivery location, plus the items ordered and any notes'}
              </li>
              <li>
                <strong>{'Language preference:'}</strong>
                {' the language you choose to view the menu in'}
              </li>
            </ul>
            <h3 style={{ fontSize: '17px', fontWeight: '600', margin: '28px 0 0' }}>
              {'From everyone who uses the Services'}
            </h3>
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
                <strong>{'Technical data:'}</strong>
                {' IP address, device and browser type, pages viewed and the time of your visit'}
              </li>
              <li>
                <strong>{'Cookies and similar technologies:'}</strong>
                {' see section 10'}
              </li>
            </ul>
            {'\n      '}
            <h2
              id={'pp-5'}
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
              {'5. How we use it'}
            </h2>
            <div
              style={{
                marginTop: '18px',
                border: '1px solid #e7e5e4',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              {'\n  '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '12px 18px',
                  background: '#fafafa',
                  borderBottom: '1px solid #e7e5e4',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#777169',
                }}
              >
                <span>{'Purpose'}</span>
                <span>{'Whose data'}</span>
                <span>{'Why we’re allowed to'}</span>
              </div>
              {'\n  '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>
                  {'Take orders and send them to the right restaurant'}
                </span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Guests'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>
                  {'To provide the service the restaurant and guest asked for'}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Translate menus and orders'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Merchants, Guests'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'To provide the service'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Create and run Merchant accounts'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Merchants'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Our contract with you'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>
                  {'Bill for subscriptions and keep financial records'}
                </span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Merchants'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Our contract, and legal obligations'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>
                  {'Support, service messages and account notices'}
                </span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Merchants'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Our contract with you'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>
                  {'Keep the Services secure and prevent fraud or abuse'}
                </span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Everyone'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>
                  {'Our legitimate interest in a safe service'}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Fix problems and improve the Services'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Everyone'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>
                  {'Our legitimate interest in a better product'}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Send Merchants product news and offers'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Merchants'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>
                  {'Your consent or our legitimate interest. You can unsubscribe anytime.'}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>
                  {'Meet legal requirements and respond to lawful requests'}
                </span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Everyone'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Legal obligation'}</span>
              </div>
            </div>
            <p style={{ margin: '14px 0 0' }}>
              {
                'We don’t sell personal information, and we don’t use guests’ details to market to them on our own behalf.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-6'}
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
              {'6. Aggregated and anonymized data'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'We combine information across many restaurants, such as menu items, prices, categories and order volumes, and remove anything that identifies a person or a single restaurant. We use this aggregated data to build insights like menu analysis and price benchmarks, and to improve the Services.'
              }
            </p>
            <p style={{ margin: '14px 0 0' }}>
              {
                'Aggregated data never identifies a guest. It never identifies a Merchant to other Merchants unless that Merchant agrees. Because it no longer identifies anyone, it isn’t personal information.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-7'}
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
              {'7. Who we share information with'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>{'We share information only as described here:'}</p>
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
                <strong>{'The restaurant you order from:'}</strong>
                {' your order and the details needed to prepare, deliver and contact you about it'}
              </li>
              <li>
                <strong>{'Service providers'}</strong>
                {' that help us run Dinelabs, under contracts that limit how they can use your data:'}
                <ul
                  style={{
                    margin: '14px 0 0',
                    paddingInlineStart: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <li>{'Contabo, which hosts our servers and databases'}</li>
                  <li>{'Cloudflare, which stores and delivers images and helps protect our website'}</li>
                  <li>
                    {'Google, which provides services we use, such as '}
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
                      {'TODO: Google services actually used'}
                    </span>
                  </li>
                  <li>
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
                      {'TODO: translation provider name'}
                    </span>
                  </li>
                  <li>
                    {
                      'payment providers, such as MyFatoorah and Whish Money, which will process subscription payments once online payment is available'
                    }
                  </li>
                  <li>{'Meta, which provides the Meta Pixel we use to measure our ads'}</li>
                  <li>{'Google Ads, which we use to measure our ads'}</li>
                  <li>{'Microsoft Clarity, which shows us how visitors use our website so we can improve it'}</li>
                  <li>{'WhatsApp, which we use for support chats'}</li>
                  <li>
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
                      {'TODO: email provider (for example Google Workspace)'}
                    </span>
                    {', which handles our email'}
                  </li>
                </ul>
              </li>
              <li>
                <strong>{'Legal and safety reasons:'}</strong>
                {
                  ' when the law requires it, or to protect the rights, safety or property of our users, the public or Dinelabs'
                }
              </li>
              <li>
                <strong>{'Business changes:'}</strong>
                {
                  ' if Dinelabs is merged, acquired or sells its assets, information may transfer to the new owner, who must respect this policy'
                }
              </li>
            </ul>
            <p style={{ margin: '14px 0 0' }}>
              {
                'When we add a new provider, for example for online payments or our mobile apps, we’ll add them to this list.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-8'}
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
              {'8. International transfers'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'Our providers may store or process information outside your country, including in Europe and the United States. When information leaves your country, we take reasonable steps to make sure it stays protected as this policy describes.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-9'}
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
              {'9. How long we keep it'}
            </h2>
            <div
              style={{
                marginTop: '18px',
                border: '1px solid #e7e5e4',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              {'\n  '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                  gap: '16px',
                  padding: '12px 18px',
                  background: '#fafafa',
                  borderBottom: '1px solid #e7e5e4',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#777169',
                }}
              >
                <span>{'Information'}</span>
                <span>{'How long'}</span>
              </div>
              {'\n  '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Merchant account details and content'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>
                  {'While the account is open. We delete or anonymize them within 90 days after it closes.'}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Billing and payment records'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'As long as the law requires'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Guest order details'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>
                  {
                    'While the restaurant’s account is open, up to 3 years from the order. Then we delete or anonymize them. A restaurant can ask us to delete them sooner.'
                  }
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Technical logs'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>{'Up to 12 months'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                  gap: '16px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f0efed',
                  fontSize: '15px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#0c0a09', fontWeight: '500' }}>{'Aggregated, anonymized data'}</span>
                <span style={{ color: '#4e4e4e', fontWeight: '400' }}>
                  {'Kept, because it no longer identifies anyone'}
                </span>
              </div>
            </div>
            {'\n      '}
            <h2
              id={'pp-10'}
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
              {'10. Cookies'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>{'We use a small number of cookies and similar technologies:'}</p>
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
                <strong>{'Essential cookies'}</strong>
                {
                  ' keep you logged in, remember your language, and hold your order while you browse a menu. The Services don’t work without them.'
                }
              </li>
              <li>
                <strong>{'Analytics cookies'}</strong>
                {
                  ' help us understand how people use our website so we can improve it. Where the law requires, we ask for your consent first.'
                }
              </li>
              <li>
                <strong>{'Advertising cookies'}</strong>
                {
                  ', such as the Meta Pixel and Google Ads, help us measure how our ads perform. Where the law requires, we ask for your consent first.'
                }
              </li>
            </ul>
            <p style={{ margin: '14px 0 0' }}>
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
                {
                  'TODO: how visitors give or withdraw consent (for example a cookie banner and a “Cookie settings” link)'
                }
              </span>
            </p>
            <p style={{ margin: '14px 0 0' }}>
              {
                'You can block or delete cookies in your browser settings. If you block essential cookies, ordering may not work.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-11'}
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
              {'11. How we protect it'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'We use encrypted connections (HTTPS), access controls, and limits on who in our team can see personal information. No system is perfectly secure. If a breach affects your information, we’ll tell you and the relevant authorities as the law requires.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-12'}
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
              {'12. Your rights'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>{'You can ask us to:'}</p>
            <ul
              style={{
                margin: '14px 0 0',
                paddingInlineStart: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>{'give you a copy of the personal information we hold about you'}</li>
              <li>{'correct information that’s wrong'}</li>
              <li>{'delete your information'}</li>
              <li>{'stop or limit how we use it'}</li>
              <li>{'withdraw consent you gave earlier'}</li>
            </ul>
            <p style={{ margin: '14px 0 0' }}>
              {'Email us at '}
              <a href={'mailto:team@dinelabs.co'}>{'team@dinelabs.co'}</a>
              {
                '. We’ll reply within 30 days and may ask you to confirm your identity first. If you’re a guest asking about an order, we’ll work with the restaurant, which controls that data, to handle your request.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-13'}
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
              {'13. Children'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'The Services aren’t aimed at children under 13, and we don’t knowingly collect their information. If you believe a child has given us personal information, contact us and we’ll delete it.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-14'}
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
              {'14. Changes to this policy'}
            </h2>
            <p style={{ margin: '14px 0 0' }}>
              {
                'We’ll update this policy as Dinelabs grows, for example when we launch mobile apps, loyalty or online payments. We’ll post the new version here and change the “Last updated” date. If a change is significant, we’ll email Merchants or show a notice in the portal at least 15 days before it takes effect.'
              }
            </p>
            {'\n      '}
            <h2
              id={'pp-15'}
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
              {'15. Contact us'}
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

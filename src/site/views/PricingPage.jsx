// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function PricingPage({ v, AR }) {
  return (
    <>
      <main>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:720px; height:720px; border-radius:50%; background:radial-gradient(circle, #a7e5d3 0%, rgba(167,229,211,0) 68%); top:-320px; left:-200px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:620px; height:620px; border-radius:50%; background:radial-gradient(circle, #f4c5a8 0%, rgba(244,197,168,0) 68%); top:-200px; right:-200px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '1000px',
              margin: '0 auto',
              padding: 'clamp(64px,9vw,112px) clamp(20px,4vw,40px) 40px',
              textAlign: 'center',
            }}
          >
            {'\n      '}
            <h1
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(42px,6vw,80px)',
                lineHeight: '1',
                letterSpacing: '-0.035em',
                margin: '0',
                textWrap: 'balance',
              }}
            >
              {tr('Simple prices. No commission, ever.', AR)}
            </h1>
            {'\n      '}
            <p
              style={{
                fontSize: 'clamp(17px,1.5vw,19px)',
                lineHeight: '1.55',
                color: '#4e4e4e',
                margin: '24px auto 0',
                maxWidth: '560px',
              }}
            >
              {tr(
                'Start free with pickup orders. Upgrade when you’re ready to move delivery and table orders off the apps.',
                AR,
              )}
            </p>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n  '}
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }}>
          {'\n    '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '16px' }}>
            {'\n      '}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '24px',
                padding: 'clamp(28px,4vw,44px)',
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
                    fontSize: '72px',
                    lineHeight: '1',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {'$0'}
                </span>
                <span style={{ color: '#777169' }}>{tr('forever', AR)}</span>
              </div>
              {'\n        '}
              <p style={{ fontSize: '16px', color: '#4e4e4e', margin: '14px 0 0' }}>
                {tr('Start taking pickup orders today.', AR)}
              </p>
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
                  background: '#fff',
                  color: '#0c0a09',
                  border: '1px solid #d6d3d1',
                  borderRadius: '999px',
                  height: '52px',
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
                padding: 'clamp(28px,4vw,44px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {'\n        '}
              <div
                style={css(
                  `position:absolute; width:440px; height:440px; border-radius:50%; background:radial-gradient(circle, rgba(200,184,224,0.4) 0%, rgba(200,184,224,0) 65%); top:-220px; right:-120px; opacity:${S(v['orb'])}; pointer-events:none`,
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
                    fontSize: '72px',
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
              <p style={{ position: 'relative', fontSize: '16px', color: '#a8a29e', margin: '14px 0 0' }}>
                {tr('Sell every way: pickup, tables and delivery.', AR)}
              </p>
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
                  background: '#fff',
                  color: '#0c0a09',
                  border: '0',
                  borderRadius: '999px',
                  height: '52px',
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
                className="dlh5"
              >
                {tr('Try Premium free for 30 days', AR)}
              </a>
              <div
                style={{
                  position: 'relative',
                  textAlign: 'center',
                  marginTop: '12px',
                  fontSize: '13px',
                  color: '#a8a29e',
                }}
              >
                {tr('No card needed', AR)}
              </div>
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              marginTop: '40px',
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '24px',
              overflow: 'hidden',
            }}
          >
            {'\n      '}
            <div className="dl-w600-up">
              {'\n      '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr)',
                  gap: '12px',
                  padding: '18px clamp(18px,3vw,32px)',
                  background: '#fafafa',
                  borderBottom: '1px solid #e7e5e4',
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#777169',
                }}
              >
                <span>{tr('Feature', AR)}</span>
                <span data-ar={'المجانية'}>{tr('Free', AR, 'المجانية')}</span>
                <span data-ar={'المميزة'}>{tr('Premium', AR, 'المميزة')}</span>
              </div>
              {'\n      '}
              {arr(v['priceRows']).map((L16_r, I17) => (
                <React.Fragment key={I17}>
                  {'\n        '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr)',
                      gap: '12px',
                      padding: '16px clamp(18px,3vw,32px)',
                      borderBottom: '1px solid #f0efed',
                      fontSize: '15px',
                      lineHeight: '1.45',
                    }}
                  >
                    {'\n          '}
                    <span style={{ fontWeight: '500', color: '#0c0a09' }}>{val(L16_r?.f, AR)}</span>
                    <span style={{ color: '#4e4e4e' }}>{val(L16_r?.free, AR)}</span>
                    <span style={{ color: '#0c0a09' }}>{val(L16_r?.prem, AR)}</span>
                    {'\n        '}
                  </div>
                  {'\n      '}
                </React.Fragment>
              ))}
              {'\n      '}
            </div>
            {'\n      '}
            <div className="dl-w600-down">
              {'\n        '}
              {arr(v['priceRows']).map((L17_r, I18) => (
                <React.Fragment key={I18}>
                  {'\n          '}
                  <div
                    style={{
                      padding: '16px 18px',
                      borderBottom: '1px solid #f0efed',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '15px',
                      lineHeight: '1.45',
                    }}
                  >
                    {'\n            '}
                    <span style={{ fontWeight: '600', color: '#0c0a09' }}>{val(L17_r?.f, AR)}</span>
                    {'\n            '}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#777169',
                        }}
                        data-ar={'المجانية'}
                      >
                        {tr('Free', AR, 'المجانية')}
                      </span>
                      <span style={{ color: '#4e4e4e', textAlign: 'end' }}>{val(L17_r?.free, AR)}</span>
                    </div>
                    {'\n            '}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#777169',
                        }}
                        data-ar={'المميزة'}
                      >
                        {tr('Premium', AR, 'المميزة')}
                      </span>
                      <span style={{ color: '#0c0a09', textAlign: 'end' }}>{val(L17_r?.prem, AR)}</span>
                    </div>
                    {'\n          '}
                  </div>
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
              marginTop: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              background: '#f0efed',
              borderRadius: '20px',
              padding: '22px clamp(20px,3vw,32px)',
            }}
          >
            {'\n      '}
            <span style={{ fontSize: '17px' }}>
              {tr('Running several branches? Book a demo and we’ll set it up with you.', AR)}
            </span>
            {'\n      '}
            <a
              href={v['waDemo']}
              target={'_blank'}
              rel={'noopener'}
              style={{
                background: '#0c0a09',
                color: '#fff',
                border: '0',
                borderRadius: '999px',
                height: '46px',
                padding: '0 22px',
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
              className="dlhd"
            >
              {tr('Book a demo', AR)}
            </a>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        <section
          style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}
        >
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, #a8c8e8 0%, rgba(168,200,232,0) 68%); top:-60px; left:-200px; opacity:${S(v['orb'])}; pointer-events:none`,
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
                    {arr(v['commOptions']).map((L18_c, I19) => (
                      <React.Fragment key={I19}>
                        {'\n                '}
                        <Btn
                          as="button"
                          onClick={L18_c?.onClick}
                          style={css(
                            `border:0; border-radius:999px; height:40px; padding:0 clamp(12px,2vw,22px); font-family:var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif); font-size:15px; font-weight:500; cursor:pointer; background:${S(L18_c?.bg)}; color:${S(L18_c?.color)}; box-shadow:${S(L18_c?.shadow)}; transition:filter 0.18s ease`,
                          )}
                          className="dlh1"
                        >
                          {val(L18_c?.label, AR)}
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
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(20px,4vw,40px) clamp(72px,10vw,120px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(32px,6vw,96px)',
          }}
        >
          {'\n    '}
          <div style={{ flex: '1 1 280px', minWidth: '0' }}>
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
              {tr('Pricing questions', AR)}
            </h2>
          </div>
          {'\n    '}
          <div style={{ flex: '2 1 480px', minWidth: '0', borderTop: '1px solid #d6d3d1' }}>
            {'\n      '}
            {arr(v['pricingFaq']).map((L19_f, I20) => (
              <React.Fragment key={I20}>
                {'\n        '}
                <div style={{ borderBottom: '1px solid #d6d3d1' }}>
                  {'\n          '}
                  <Btn
                    as="button"
                    onClick={L19_f?.toggle}
                    aria-expanded={L19_f?.open}
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
                    {val(L19_f?.q, AR)}
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
                      {val(L19_f?.icon, AR)}
                    </span>
                  </Btn>
                  {'\n          '}
                  {L19_f?.open ? (
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
                        {val(L19_f?.a, AR)}
                      </p>
                      {L19_f?.hasTodo ? (
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
                              {val(L19_f?.todo, false)}
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
      </main>
    </>
  );
}

// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../../i18n/runtime';
import StoreScreen from '../StoreScreen';

// v: the page's values from SiteApp.renderVals(); AR: render in Arabic
export default function ProductPage({ v, AR }) {
  return (
    <>
      <main>
        {'\n  '}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:760px; height:760px; border-radius:50%; background:radial-gradient(circle, ${S(v['pr']?.c)} 0%, rgba(255,255,255,0) 68%); top:-320px; right:-200px; opacity:${S(v['orb'])}; pointer-events:none`,
            )}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'relative',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px) clamp(40px,5vw,64px)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'clamp(40px,5vw,72px)',
            }}
          >
            {'\n      '}
            <div style={{ flex: '1 1 460px', minWidth: '0' }}>
              {'\n        '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {'\n          '}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#fff',
                    border: '1px solid #e7e5e4',
                  }}
                >
                  {val(v['prIcon'], AR)}
                </span>
                {'\n          '}
                <span style={{ fontSize: '14px', color: '#777169' }}>{val(v['pr']?.group, AR)}</span>
                <span style={{ color: '#d6d3d1' }}>{'/'}</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{val(v['pr']?.title, AR)}</span>
                {'\n          '}
                {v['pr']?.isFree ? (
                  <>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        background: '#d9f0e8',
                        color: '#0c0a09',
                        borderRadius: '999px',
                        padding: '4px 10px',
                      }}
                    >
                      {tr('Free', AR)}
                    </span>
                  </>
                ) : null}
                {'\n          '}
                {v['pr']?.isPremium ? (
                  <>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        background: '#f0efed',
                        color: '#4e4e4e',
                        borderRadius: '999px',
                        padding: '4px 10px',
                      }}
                    >
                      {tr('Premium', AR)}
                    </span>
                  </>
                ) : null}
                {'\n          '}
                {v['pr']?.soon ? (
                  <>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: '#0c0a09',
                        color: '#fff',
                        borderRadius: '999px',
                        padding: '4px 10px',
                      }}
                    >
                      {tr('Coming soon', AR)}
                    </span>
                  </>
                ) : null}
                {'\n        '}
              </div>
              {'\n        '}
              <h1
                style={{
                  fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                  fontWeight: '500',
                  fontSize: 'clamp(40px,5.4vw,72px)',
                  lineHeight: '1.02',
                  letterSpacing: '-0.035em',
                  margin: '24px 0 0',
                  textWrap: 'balance',
                }}
              >
                {val(v['pr']?.h, AR)}
              </h1>
              {'\n        '}
              <p
                style={{
                  fontSize: 'clamp(17px,1.5vw,19px)',
                  lineHeight: '1.55',
                  color: '#4e4e4e',
                  margin: '24px 0 0',
                  maxWidth: '520px',
                  textWrap: 'pretty',
                }}
              >
                {val(v['pr']?.sub, AR)}
              </p>
              {'\n        '}
              {v['pr']?.live ? (
                <>
                  {'\n          '}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '32px' }}>
                    {'\n            '}
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
                    {'\n            '}
                    <a
                      href={v['storeUrl']}
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
                      {tr('See a live store →', AR)}
                    </a>
                    {'\n          '}
                  </div>
                  {'\n          '}
                  {v['pr']?.isFree ? (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px 20px',
                          marginTop: '20px',
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
                          <span>{tr('0% commission', AR)}</span>
                        </span>
                      </div>
                    </>
                  ) : null}
                  {'\n          '}
                  {v['pr']?.isPremium ? (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px 20px',
                          marginTop: '20px',
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
                          <span>{tr('Try Premium free for 30 days', AR)}</span>
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
                      </div>
                    </>
                  ) : null}
                  {'\n        '}
                </>
              ) : null}
              {'\n        '}
              {v['pr']?.soon ? (
                <>
                  {'\n          '}
                  {v['notJoined'] ? (
                    <>
                      {'\n            '}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          background: '#fff',
                          border: '1px solid #e7e5e4',
                          borderRadius: '999px',
                          padding: '5px',
                          marginTop: '32px',
                          maxWidth: '460px',
                        }}
                      >
                        {'\n              '}
                        <input
                          type={'email'}
                          placeholder={tr('Your email', AR)}
                          aria-label={'Your email'}
                          aria-invalid={v['wlErr']}
                          value={dflt(v['email'], '')}
                          onChange={v['setEmail']}
                          onKeyDown={v['wlKey']}
                          style={{
                            flex: '1',
                            minWidth: '0',
                            border: '0',
                            background: 'transparent',
                            padding: '0 16px',
                            fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                            fontSize: '15px',
                            outline: 'none',
                            color: '#0c0a09',
                          }}
                        />
                        {'\n              '}
                        <Btn
                          as="button"
                          onClick={v['join']}
                          disabled={v['wlBusy']}
                          style={{
                            background: '#0c0a09',
                            color: '#fff',
                            border: '0',
                            borderRadius: '999px',
                            height: '46px',
                            padding: '0 20px',
                            fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                            fontSize: '15px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'background 0.18s ease',
                          }}
                          className="dlhd"
                        >
                          {tr('Join the waitlist', AR)}
                        </Btn>
                        {'\n            '}
                      </div>
                      {'\n          '}
                    </>
                  ) : null}
                  {'\n          '}
                  {v['wlErr'] ? (
                    <>
                      <div role={'alert'} style={{ marginTop: '10px', fontSize: '14px', color: '#b42318' }}>
                        {val(v['wlErrMsg'], AR)}
                      </div>
                    </>
                  ) : null}
                  {'\n          '}
                  {v['joined'] ? (
                    <>
                      <div
                        style={{
                          marginTop: '32px',
                          fontSize: '16px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
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
                        {tr("You're on the list. We'll tell you first when it's ready.", AR)}
                      </div>
                    </>
                  ) : null}
                  {'\n        '}
                </>
              ) : null}
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                flex: '1 1 400px',
                minWidth: '0',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '28px',
                background: '#fff',
                border: '1px solid #e7e5e4',
                minHeight: '520px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingTop: '48px',
              }}
            >
              {'\n        '}
              <div
                style={css(
                  `position:absolute; width:560px; height:560px; border-radius:50%; background:radial-gradient(circle, ${S(v['pr']?.c)} 0%, rgba(255,255,255,0) 68%); top:-120px; left:50%; transform:translateX(-50%); opacity:${S(v['orb'])}`,
                )}
              ></div>
              {'\n        '}
              {v['pr']?.phone ? (
                <>
                  {'\n          '}
                  <div style={{ position: 'relative', width: 'min(290px,72vw)', height: '470px', overflow: 'hidden' }}>
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
                          <StoreScreen lang={v['lang']} screen={v['pr']?.scr} store={v['pr']?.store} />
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
                  {'\n        '}
                </>
              ) : null}
              {'\n        '}
              {v['pr']?.laptop ? (
                <>
                  {'\n          '}
                  <div
                    style={{
                      position: 'relative',
                      alignSelf: 'center',
                      width: '88%',
                      background: '#1c1917',
                      borderRadius: '16px',
                      padding: '8px',
                      marginBottom: '48px',
                      boxShadow: '0 40px 80px -40px rgba(12,10,9,0.5)',
                    }}
                  >
                    {'\n            '}
                    <div style={{ display: 'flex', gap: '5px', padding: '4px 6px 8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#44403c' }}></span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#44403c' }}></span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#44403c' }}></span>
                    </div>
                    {'\n            '}
                    <div
                      dir={'ltr'}
                      style={{ aspectRatio: '16/10', borderRadius: '9px', overflow: 'hidden', background: '#fff' }}
                    >
                      <div className="phone-host" style={{ width: '100%', height: '100%' }}>
                        <StoreScreen lang={v['lang']} screen={v['pr']?.scr} store={v['pr']?.store} />
                      </div>
                    </div>
                    {'\n          '}
                  </div>
                  {'\n        '}
                </>
              ) : null}
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(20px,4vw,40px)' }}>
          {'\n    '}
          <h2
            style={{
              fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
              fontWeight: '500',
              fontSize: 'clamp(32px,4.2vw,52px)',
              lineHeight: '1.05',
              letterSpacing: '-0.025em',
              margin: '0',
              maxWidth: '760px',
              textWrap: 'balance',
            }}
          >
            {val(v['pr']?.benefitsTitle, AR)}
          </h2>
          {'\n    '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: '16px',
              marginTop: '44px',
            }}
          >
            {'\n      '}
            {arr(v['pr']?.benefits).map((L22_b, I23) => (
              <React.Fragment key={I23}>
                {'\n        '}
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '20px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {'\n          '}
                  <span
                    style={css(
                      `width:36px; height:36px; border-radius:50%; background:radial-gradient(circle at 30% 30%, #ffffff 0%, ${S(L22_b?.c)} 80%); border:1px solid #e7e5e4`,
                    )}
                  ></span>
                  {'\n          '}
                  <div
                    style={{
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontWeight: '500',
                      fontSize: '23px',
                      lineHeight: '1.2',
                      letterSpacing: '-0.015em',
                      marginTop: '8px',
                    }}
                  >
                    {val(L22_b?.t, AR)}
                  </div>
                  {'\n          '}
                  <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.55', color: '#4e4e4e' }}>
                    {val(L22_b?.d, AR)}
                  </p>
                  {'\n        '}
                </div>
                {'\n      '}
              </React.Fragment>
            ))}
            {'\n    '}
          </div>
          {'\n    '}
          {v['pr']?.hasNote ? (
            <>
              <p style={{ margin: '28px 0 0', fontSize: '15px', lineHeight: '1.55', color: '#777169' }}>
                {val(v['pr']?.note, AR)}
              </p>
            </>
          ) : null}
          {'\n  '}
        </section>
        {'\n\n  '}
        {v['pr']?.hasSteps ? (
          <>
            {'\n    '}
            <section style={{ background: '#0c0a09', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              {'\n      '}
              <div
                style={css(
                  `position:absolute; width:720px; height:720px; border-radius:50%; background:radial-gradient(circle, ${S(v['pr']?.cDark)} 0%, rgba(0,0,0,0) 65%); bottom:-360px; left:-200px; opacity:${S(v['orb'])}; pointer-events:none`,
                )}
              ></div>
              {'\n      '}
              <div
                style={{
                  position: 'relative',
                  maxWidth: '1200px',
                  margin: '0 auto',
                  padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)',
                }}
              >
                {'\n        '}
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#a8a29e',
                  }}
                >
                  {tr('How it works', AR)}
                </div>
                {'\n        '}
                <h2
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    fontSize: 'clamp(32px,4.2vw,52px)',
                    lineHeight: '1.05',
                    letterSpacing: '-0.025em',
                    margin: '16px 0 0',
                  }}
                >
                  {tr('Up and running in three steps.', AR)}
                </h2>
                {'\n        '}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
                    gap: '16px',
                    marginTop: '44px',
                  }}
                >
                  {'\n          '}
                  {arr(v['pr']?.steps).map((L23_st, I24) => (
                    <React.Fragment key={I24}>
                      {'\n            '}
                      <div
                        style={{
                          background: '#1c1917',
                          border: '1px solid #292524',
                          borderRadius: '20px',
                          padding: '28px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        {'\n              '}
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#a8a29e' }}>
                          {val(L23_st?.n, AR)}
                        </span>
                        {'\n              '}
                        <div
                          style={{
                            fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                            fontWeight: '500',
                            fontSize: '22px',
                            lineHeight: '1.2',
                          }}
                        >
                          {val(L23_st?.t, AR)}
                        </div>
                        {'\n              '}
                        <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#a8a29e' }}>
                          {val(L23_st?.d, AR)}
                        </p>
                        {'\n            '}
                      </div>
                      {'\n          '}
                    </React.Fragment>
                  ))}
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </section>
            {'\n  '}
          </>
        ) : null}
        {'\n\n  '}
        {v['pr']?.hasFaq ? (
          <>
            {'\n    '}
            <section
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px) 0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(32px,6vw,96px)',
              }}
            >
              {'\n      '}
              <div style={{ flex: '1 1 280px', minWidth: '0' }}>
                <h2
                  style={{
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    fontWeight: '500',
                    fontSize: 'clamp(30px,3.8vw,46px)',
                    lineHeight: '1.05',
                    letterSpacing: '-0.025em',
                    margin: '0',
                  }}
                >
                  {tr('Questions owners ask', AR)}
                </h2>
              </div>
              {'\n      '}
              <div style={{ flex: '2 1 480px', minWidth: '0', borderTop: '1px solid #d6d3d1' }}>
                {'\n        '}
                {arr(v['prFaq']).map((L24_f, I25) => (
                  <React.Fragment key={I25}>
                    {'\n          '}
                    <div style={{ borderBottom: '1px solid #d6d3d1' }}>
                      {'\n            '}
                      <Btn
                        as="button"
                        onClick={L24_f?.toggle}
                        aria-expanded={L24_f?.open}
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
                        {val(L24_f?.q, AR)}
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
                          {val(L24_f?.icon, AR)}
                        </span>
                      </Btn>
                      {'\n            '}
                      {L24_f?.open ? (
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
                            {val(L24_f?.a, AR)}
                          </p>
                          {L24_f?.hasTodo ? (
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
                                  {val(L24_f?.todo, false)}
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
          </>
        ) : null}
        {'\n\n  '}
        <section
          style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(72px,10vw,120px) clamp(20px,4vw,40px)' }}
        >
          {'\n    '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {'\n      '}
            <h2
              style={{
                fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                fontWeight: '500',
                fontSize: 'clamp(28px,3.4vw,40px)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
                margin: '0',
              }}
            >
              {tr('More in ', AR)}
              {val(v['pr']?.group, AR)}
            </h2>
            {'\n      '}
            <Btn
              as="button"
              onClick={v['goFeatures']}
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
              {tr('See all features →', AR)}
            </Btn>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '16px',
              marginTop: '32px',
            }}
          >
            {'\n      '}
            {arr(v['prRelated']).map((L25_r, I26) => (
              <React.Fragment key={I26}>
                {'\n        '}
                <Btn
                  as="button"
                  onClick={L25_r?.onClick}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    textAlign: 'start',
                    background: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                    color: '#0c0a09',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minHeight: '170px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  className="dlhj"
                >
                  {'\n          '}
                  <span
                    style={css(
                      `position:absolute; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle, ${S(L25_r?.c)} 0%, rgba(255,255,255,0) 68%); top:-140px; right:-100px`,
                    )}
                  ></span>
                  {'\n          '}
                  <span
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                      fontSize: '21px',
                      fontWeight: '500',
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {val(L25_r?.title, AR)}
                    {L25_r?.soon ? (
                      <>
                        <span
                          style={{
                            fontFamily: "var(--dl-display, 'STK Bureau Sans', 'Instrument Sans', sans-serif)",
                            fontSize: '10px',
                            fontWeight: '600',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            background: '#f0efed',
                            color: '#4e4e4e',
                            borderRadius: '999px',
                            padding: '2px 7px',
                          }}
                        >
                          {tr('Soon', AR)}
                        </span>
                      </>
                    ) : null}
                  </span>
                  {'\n          '}
                  <span style={{ position: 'relative', fontSize: '15px', lineHeight: '1.5', color: '#4e4e4e' }}>
                    {val(L25_r?.sub, AR)}
                  </span>
                  {'\n          '}
                  <span style={{ position: 'relative', marginTop: 'auto', fontSize: '14px', fontWeight: '500' }}>
                    {tr('Learn more →', AR)}
                  </span>
                  {'\n        '}
                </Btn>
                {'\n      '}
              </React.Fragment>
            ))}
            {'\n    '}
          </div>
          {'\n  '}
        </section>
        {'\n\n  '}
        <section style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid #e7e5e4' }}>
          {'\n    '}
          <div
            style={css(
              `position:absolute; width:680px; height:680px; border-radius:50%; background:radial-gradient(circle, ${S(v['pr']?.c)} 0%, rgba(255,255,255,0) 68%); top:-240px; left:20%; opacity:${S(v['orb'])}; pointer-events:none`,
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
                fontSize: 'clamp(38px,5.4vw,70px)',
                lineHeight: '1.02',
                letterSpacing: '-0.03em',
                margin: '0',
                textWrap: 'balance',
              }}
            >
              {tr('Stop paying the apps. Start selling direct.', AR)}
            </h2>
            {'\n      '}
            <div
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '36px' }}
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
            {'\n    '}
          </div>
          {'\n  '}
        </section>
      </main>
    </>
  );
}

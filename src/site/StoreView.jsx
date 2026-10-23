// Generated from the Claude Design template. Edit freely; it is plain React now.
import React from 'react';
import { tr, val, S, css, arr, dflt, Btn } from '../i18n/runtime';

export default function StoreView(v, AR) {
  return (
    <>
      <div
        ref={v['rootRef']}
        dir={v['rootDir']}
        data-ar-skip={v['arSkip']}
        style={css(
          `position:relative; width:100%; height:100%; overflow:hidden; background:#fff; font-family:'Geist',sans-serif; color:#0c0a09; text-align:start; opacity:${S(v['ready'])}; transition:opacity .45s ease; animation:${S(v['inAnim'])}`,
        )}
      >
        <div
          style={css(
            `position:absolute; top:0; left:0; width:${S(v['baseW'])}px; height:${S(v['baseH'])}px; transform:scale(${S(v['s'])}); transform-origin:0 0; overflow:hidden`,
          )}
        >
          {v['isMenu'] ? (
            <>
              <div
                dir={v['dir']}
                style={css(
                  `position:absolute; inset:0; background:#fff; display:flex; flex-direction:column; font-family:${S(v['font'])}; transform:${S(v['layer']?.menu)}; transition:${S(v['layerTr'])}`,
                )}
              >
                {'\n  '}
                <div
                  style={{
                    height: '54px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px 0 34px',
                    fontSize: '14px',
                    fontWeight: '600',
                    direction: 'ltr',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      letterSpacing: '-0.01em',
                      fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                    }}
                  >
                    {'9:41'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
                      <span style={{ width: '3px', height: '5px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '7.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                      <span style={{ width: '3px', height: '10px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '12.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                    </span>
                    <svg width={'16'} height={'12'} viewBox={'0 0 16 12'} style={{ display: 'block' }}>
                      <path
                        d={'M0.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path
                        d={'M3.05 6.55A7 7 0 0 1 12.95 6.55L11.11 8.39A4.4 4.4 0 0 0 4.89 8.39Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path d={'M8 11.5L5.88 9.38A3 3 0 0 1 10.12 9.38Z'} fill={'#0c0a09'}></path>
                    </svg>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '25px',
                          height: '12.5px',
                          borderRadius: '4px',
                          background: '#b8b8bb',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '76%',
                            background: '#0c0a09',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'relative',
                            color: '#fff',
                            fontSize: '9.5px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                          }}
                        >
                          {'76'}
                        </span>
                      </span>
                      <span
                        style={{ width: '1.5px', height: '4px', borderRadius: '0 1px 1px 0', background: '#b8b8bb' }}
                      ></span>
                    </span>
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    position: 'relative',
                    height: '56px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 18px',
                    borderBottom: '1px solid #eeeeee',
                  }}
                >
                  {'\n    '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '20px' }}>
                    <span style={{ height: '2px', background: '#0c0a09', borderRadius: '2px' }}></span>
                    <span style={{ height: '2px', background: '#0c0a09', borderRadius: '2px' }}></span>
                    <span style={{ height: '2px', background: '#0c0a09', borderRadius: '2px' }}></span>
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%,-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <img
                      src={v['st']?.logo}
                      alt={v['st']?.name}
                      style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block', flex: 'none' }}
                    />
                  </div>
                  {'\n    '}
                  <span style={{ position: 'relative' }}>
                    <span
                      data-tap={'lang'}
                      style={css(
                        `display:block; background:${S(v['langPillBg'])}; border-radius:999px; padding:6px 10px; font-size:12px; font-weight:600; direction:ltr; transition:background .2s ease`,
                      )}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '13px', lineHeight: '1' }}>
                          {val(v['langFlag'], AR && v['arSkip'] !== '1')}
                        </span>
                        <span>
                          {val(v['langLabel'], AR && v['arSkip'] !== '1')}
                          {' ▾'}
                        </span>
                      </span>
                    </span>
                    <span
                      style={css(
                        `position:absolute; top:34px; inset-inline-end:0; z-index:5; background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:4px; box-shadow:0 12px 28px -12px rgba(0,0,0,.3); display:flex; flex-direction:column; min-width:124px; opacity:${S(v['ddO'])}; transform:translateY(${S(v['ddY'])}); transition:opacity .2s ease, transform .25s ease; pointer-events:none`,
                      )}
                    >
                      {arr(v['langOpts']).map((L0_lo, I1) => (
                        <React.Fragment key={I1}>
                          <span
                            data-tap={`lang${S(I1)}`}
                            style={css(
                              `padding:8px 10px; border-radius:8px; font-size:13px; font-weight:500; background:${S(L0_lo?.bg)}; direction:ltr; transition:background .2s ease; display:flex; align-items:center; gap:8px`,
                            )}
                          >
                            <span style={{ fontSize: '14px', lineHeight: '1' }}>
                              {val(L0_lo?.flag, AR && v['arSkip'] !== '1')}
                            </span>
                            <span>{val(L0_lo?.label, AR && v['arSkip'] !== '1')}</span>
                          </span>
                        </React.Fragment>
                      ))}
                    </span>
                  </span>
                  {'\n  '}
                </div>
                {'\n  '}
                <div style={{ position: 'relative', flex: '1', overflow: 'hidden' }}>
                  {'\n    '}
                  <div
                    style={css(
                      `padding:18px 18px 120px; transform:translateY(${S(v['scroll'])}px); transition:transform 1.3s cubic-bezier(.45,0,.2,1)`,
                    )}
                  >
                    {'\n      '}
                    {v['isTable'] ? (
                      <>
                        {'\n        '}
                        <div
                          style={css(
                            `display:flex; align-items:center; justify-content:space-between; background:${S(v['accentTint'])}; border-radius:14px; padding:12px 14px; margin-bottom:18px`,
                          )}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span
                              style={css(
                                `font-size:12px; font-weight:600; color:${S(v['accent'])}; letter-spacing:0.04em; text-transform:uppercase`,
                              )}
                            >
                              {tr('Dine-in', AR && v['arSkip'] !== '1')}
                            </span>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>
                              {tr('Table 7', AR && v['arSkip'] !== '1')}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#4b5563' }}>
                            {tr('Order from your seat', AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                        {'\n      '}
                      </>
                    ) : null}
                    {'\n      '}
                    <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                      {val(v['tr']?.popular, AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', overflow: 'hidden' }}>
                      {'\n        '}
                      {arr(v['popCards']).map((L1_c, I2) => (
                        <React.Fragment key={I2}>
                          {'\n          '}
                          <div
                            style={{
                              flex: 'none',
                              width: '168px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                            }}
                          >
                            {'\n            '}
                            <div
                              style={{
                                position: 'relative',
                                height: '118px',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                background: '#f3f4f6',
                                marginBottom: '6px',
                              }}
                            >
                              <img
                                src={L1_c?.img}
                                alt={''}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                              <span
                                data-tap={`pop${S(I2)}`}
                                style={css(
                                  `position:absolute; bottom:8px; inset-inline-end:8px; width:30px; height:30px; border-radius:50%; background:${S(L1_c?.plusBg)}; color:${S(L1_c?.plusColor)}; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 2px 6px rgba(0,0,0,.15); transform:${S(L1_c?.plusScale)}; transition:all .35s ease`,
                                )}
                              >
                                {'+'}
                              </span>
                            </div>
                            {'\n            '}
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {val(L1_c?.name, AR && v['arSkip'] !== '1')}
                            </span>
                            {'\n            '}
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>
                              {val(L1_c?.price, AR && v['arSkip'] !== '1')}
                            </span>
                            {'\n          '}
                          </div>
                          {'\n        '}
                        </React.Fragment>
                      ))}
                      {'\n      '}
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        marginTop: '18px',
                        height: '44px',
                        borderRadius: '999px',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0 16px',
                        color: '#9ca3af',
                        fontSize: '14px',
                      }}
                    >
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid #9ca3af',
                          borderRadius: '50%',
                          flex: 'none',
                        }}
                      ></span>
                      {val(v['tr']?.search, AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', overflow: 'hidden' }}>
                      {'\n        '}
                      {arr(v['chips']).map((L2_ch, I3) => (
                        <React.Fragment key={I3}>
                          {'\n          '}
                          <span
                            style={css(
                              `flex:none; background:${S(L2_ch?.bg)}; color:${S(L2_ch?.color)}; border-radius:999px; padding:9px 15px; font-size:14px; font-weight:500; transition:background .6s ease`,
                            )}
                          >
                            {val(L2_ch?.label, AR && v['arSkip'] !== '1')}
                          </span>
                          {'\n        '}
                        </React.Fragment>
                      ))}
                      {'\n      '}
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginTop: '22px',
                        paddingTop: '18px',
                        borderTop: '1px solid #eeeeee',
                      }}
                    >
                      <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                        {val(v['tr']?.section, AR && v['arSkip'] !== '1')}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {val(v['tr']?.count, AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '6px' }}>
                      {'\n        '}
                      {arr(v['listRows']).map((L3_r, I4) => (
                        <React.Fragment key={I4}>
                          {'\n          '}
                          <div
                            style={{
                              display: 'flex',
                              gap: '14px',
                              padding: '12px 0',
                              borderBottom: '1px solid #f1f1f1',
                            }}
                          >
                            {'\n            '}
                            <div
                              style={{
                                position: 'relative',
                                flex: 'none',
                                width: '84px',
                                height: '84px',
                                borderRadius: '12px',
                                background: '#f3f4f6',
                              }}
                            >
                              <img
                                src={L3_r?.img}
                                alt={''}
                                style={{
                                  width: '84px',
                                  height: '84px',
                                  borderRadius: '12px',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                              <span
                                style={css(
                                  `position:absolute; bottom:-6px; inset-inline-end:-6px; width:28px; height:28px; border-radius:50%; background:${S(L3_r?.plusBg)}; color:${S(L3_r?.plusColor)}; display:flex; align-items:center; justify-content:center; font-size:17px; box-shadow:0 2px 6px rgba(0,0,0,.18); transform:${S(L3_r?.plusScale)}; transition:all .35s ease`,
                                )}
                              >
                                {'+'}
                              </span>
                            </div>
                            {'\n            '}
                            <div
                              style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}
                            >
                              <span style={{ fontSize: '15px', fontWeight: '700' }}>
                                {val(L3_r?.name, AR && v['arSkip'] !== '1')}
                              </span>
                              <span
                                style={{
                                  fontSize: '13px',
                                  lineHeight: '1.4',
                                  color: '#6b7280',
                                  display: '-webkit-box',
                                  WebkitLineClamp: '2',
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {val(L3_r?.desc, AR && v['arSkip'] !== '1')}
                              </span>
                              <span style={{ fontSize: '15px', fontWeight: '600', marginTop: '2px' }}>
                                {val(L3_r?.price, AR && v['arSkip'] !== '1')}
                              </span>
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
                    data-tap={'bar'}
                    style={css(
                      `position:absolute; left:16px; right:16px; bottom:18px; height:56px; border-radius:999px; background:${S(v['barBg'])}; color:#fff; display:flex; align-items:center; justify-content:space-between; padding:0 22px; box-shadow:0 14px 30px -12px rgba(0,0,0,.5); transform:translateY(${S(v['barY'])}); transition:transform .5s cubic-bezier(.34,1.4,.64,1), background .6s ease`,
                    )}
                  >
                    {'\n      '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{ position: 'relative', width: '24px', height: '24px', flex: 'none', display: 'block' }}
                      >
                        <svg
                          width={'24'}
                          height={'24'}
                          viewBox={'0 0 24 24'}
                          fill={'none'}
                          stroke={'#fff'}
                          strokeWidth={'1.9'}
                          strokeLinecap={'round'}
                          strokeLinejoin={'round'}
                          style={{ display: 'block' }}
                        >
                          <path d={'M5.5 8h13l-1 11.5a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5L5.5 8z'}></path>
                          <path d={'M9 10V7a3 3 0 0 1 6 0v3'}></path>
                        </svg>
                        <span
                          style={css(
                            `position:absolute; top:-7px; inset-inline-end:-9px; min-width:18px; height:18px; padding:0 4px; box-sizing:border-box; border-radius:9px; background:${S(v['badgeBg'])}; color:${S(v['badgeColor'])}; box-shadow:0 0 0 2px ${S(v['barBg'])}; font-size:11px; font-weight:700; line-height:1; display:flex; align-items:center; justify-content:center; transform:${S(v['badgeScale'])}; transition:transform .3s cubic-bezier(.34,1.8,.64,1)`,
                          )}
                        >
                          {val(v['count'], AR && v['arSkip'] !== '1')}
                        </span>
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: '600' }}>
                        {val(v['tr']?.view, AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                    {'\n      '}
                    <span style={{ fontSize: '15px', fontWeight: '700', direction: 'ltr' }}>
                      {val(v['total'], AR && v['arSkip'] !== '1')}
                    </span>
                    {'\n    '}
                  </div>
                  {'\n  '}
                </div>
              </div>
            </>
          ) : null}
          {v['isItem'] ? (
            <>
              <div
                style={css(
                  `position:absolute; inset:0; background:#fff; display:flex; flex-direction:column; transform:${S(v['layer']?.item)}; transition:${S(v['layerTr'])}`,
                )}
              >
                {'\n  '}
                <div
                  style={{
                    position: 'relative',
                    flex: 'none',
                    height: '250px',
                    background: '#f3f4f6',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={v['it']?.img}
                    alt={''}
                    style={{
                      position: 'absolute',
                      inset: '0',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      height: '80px',
                      background: 'linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,0))',
                    }}
                  ></div>
                  {'\n    '}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      height: '54px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 30px 0 34px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        letterSpacing: '-0.01em',
                        fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                      }}
                    >
                      {'9:41'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
                        <span
                          style={{ width: '3px', height: '5px', background: '#0c0a09', borderRadius: '1px' }}
                        ></span>
                        <span
                          style={{ width: '3px', height: '7.5px', background: '#0c0a09', borderRadius: '1px' }}
                        ></span>
                        <span
                          style={{ width: '3px', height: '10px', background: '#0c0a09', borderRadius: '1px' }}
                        ></span>
                        <span
                          style={{ width: '3px', height: '12.5px', background: '#0c0a09', borderRadius: '1px' }}
                        ></span>
                      </span>
                      <svg width={'16'} height={'12'} viewBox={'0 0 16 12'} style={{ display: 'block' }}>
                        <path
                          d={'M0.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z'}
                          fill={'#0c0a09'}
                        ></path>
                        <path
                          d={'M3.05 6.55A7 7 0 0 1 12.95 6.55L11.11 8.39A4.4 4.4 0 0 0 4.89 8.39Z'}
                          fill={'#0c0a09'}
                        ></path>
                        <path d={'M8 11.5L5.88 9.38A3 3 0 0 1 10.12 9.38Z'} fill={'#0c0a09'}></path>
                      </svg>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                        <span
                          style={{
                            position: 'relative',
                            width: '25px',
                            height: '12.5px',
                            borderRadius: '4px',
                            background: '#b8b8bb',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '0',
                              top: '0',
                              bottom: '0',
                              width: '76%',
                              background: '#0c0a09',
                            }}
                          ></span>
                          <span
                            style={{
                              position: 'relative',
                              color: '#fff',
                              fontSize: '9.5px',
                              fontWeight: '700',
                              letterSpacing: '-0.02em',
                              fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                            }}
                          >
                            {'76'}
                          </span>
                        </span>
                        <span
                          style={{ width: '1.5px', height: '4px', borderRadius: '0 1px 1px 0', background: '#b8b8bb' }}
                        ></span>
                      </span>
                    </span>
                  </div>
                  {'\n    \n    '}
                  <span
                    style={{
                      position: 'absolute',
                      top: '62px',
                      insetInlineEnd: '18px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                  >
                    {'×'}
                  </span>
                  {'\n  '}
                </div>
                {'\n  '}
                <div style={{ flex: '1', overflow: 'hidden', padding: '20px 20px 0' }}>
                  {'\n    '}
                  <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                    {val(v['it']?.name, AR && v['arSkip'] !== '1')}
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: '#6b7280',
                      marginTop: '6px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #eeeeee',
                    }}
                  >
                    {val(v['it']?.desc, AR && v['arSkip'] !== '1')}
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '16px',
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>
                      {val(v['L']?.size, AR && v['arSkip'] !== '1')}
                    </span>
                    <span
                      style={{
                        background: '#f3f4f6',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 8px',
                        color: '#4b5563',
                      }}
                    >
                      {val(v['L']?.req, AR && v['arSkip'] !== '1')}
                    </span>
                  </div>
                  {'\n    '}
                  {arr(v['sizes']).map((L4_z, I5) => (
                    <React.Fragment key={I5}>
                      {'\n      '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0' }}>
                        <span
                          data-tap={`size${S(I5)}`}
                          style={css(
                            `width:20px; height:20px; border-radius:50%; border:2px solid ${S(L4_z?.ring)}; box-sizing:border-box; display:flex; align-items:center; justify-content:center; transition:border-color .3s ease`,
                          )}
                        >
                          <span
                            style={css(
                              `width:10px; height:10px; border-radius:50%; background:${S(v['accent'])}; transform:${S(L4_z?.dot)}; transition:transform .3s cubic-bezier(.34,1.8,.64,1)`,
                            )}
                          ></span>
                        </span>
                        <span style={{ flex: '1', fontSize: '15px' }}>
                          {val(L4_z?.label, AR && v['arSkip'] !== '1')}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                          {val(L4_z?.price, AR && v['arSkip'] !== '1')}
                        </span>
                      </div>
                      {'\n    '}
                    </React.Fragment>
                  ))}
                  {'\n    '}
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      marginTop: '12px',
                      paddingTop: '16px',
                      borderTop: '1px solid #eeeeee',
                    }}
                  >
                    {val(v['L']?.extras, AR && v['arSkip'] !== '1')}
                  </div>
                  {'\n    '}
                  {arr(v['extras']).map((L5_x, I6) => (
                    <React.Fragment key={I6}>
                      {'\n      '}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0' }}>
                        <span
                          data-tap={`ex${S(I6)}`}
                          style={css(
                            `width:20px; height:20px; border-radius:6px; border:2px solid ${S(L5_x?.border)}; background:${S(L5_x?.bg)}; box-sizing:border-box; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; transition:all .3s ease`,
                          )}
                        >
                          <span style={css(`opacity:${S(L5_x?.check)}; transition:opacity .2s ease`)}>{'✓'}</span>
                        </span>
                        <span style={{ flex: '1', fontSize: '15px' }}>
                          {val(L5_x?.label, AR && v['arSkip'] !== '1')}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                          {val(L5_x?.price, AR && v['arSkip'] !== '1')}
                        </span>
                      </div>
                      {'\n    '}
                    </React.Fragment>
                  ))}
                  {'\n  '}
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    display: 'flex',
                    gap: '10px',
                    padding: '14px 18px 22px',
                    borderTop: '1px solid #eeeeee',
                    background: '#fff',
                  }}
                >
                  {'\n    '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      background: '#f3f4f6',
                      borderRadius: '999px',
                      padding: '0 18px',
                      height: '52px',
                      fontSize: '17px',
                      fontWeight: '600',
                    }}
                  >
                    <span>{'−'}</span>
                    <span>{'1'}</span>
                    <span>{'+'}</span>
                  </div>
                  {'\n    '}
                  <div
                    data-tap={'add'}
                    style={css(
                      `flex:1; display:flex; justify-content:space-between; align-items:center; background:${S(v['addBg'])}; color:#fff; border-radius:999px; padding:0 20px; height:52px; font-size:15px; font-weight:600; transform:${S(v['addScale'])}; transition:transform .2s ease, background .3s ease`,
                    )}
                  >
                    <span>{val(v['addLabel'], AR && v['arSkip'] !== '1')}</span>
                    <span>{val(v['itemTotal'], AR && v['arSkip'] !== '1')}</span>
                  </div>
                  {'\n  '}
                </div>
              </div>
            </>
          ) : null}
          {v['isBasket'] ? (
            <>
              <div
                style={css(
                  `position:absolute; inset:0; background:#fff; display:flex; flex-direction:column; transform:${S(v['layer']?.basket)}; transition:${S(v['layerTr'])}`,
                )}
              >
                {'\n  '}
                <div
                  style={{
                    height: '54px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px 0 34px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      letterSpacing: '-0.01em',
                      fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                    }}
                  >
                    {'9:41'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
                      <span style={{ width: '3px', height: '5px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '7.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                      <span style={{ width: '3px', height: '10px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '12.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                    </span>
                    <svg width={'16'} height={'12'} viewBox={'0 0 16 12'} style={{ display: 'block' }}>
                      <path
                        d={'M0.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path
                        d={'M3.05 6.55A7 7 0 0 1 12.95 6.55L11.11 8.39A4.4 4.4 0 0 0 4.89 8.39Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path d={'M8 11.5L5.88 9.38A3 3 0 0 1 10.12 9.38Z'} fill={'#0c0a09'}></path>
                    </svg>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '25px',
                          height: '12.5px',
                          borderRadius: '4px',
                          background: '#b8b8bb',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '76%',
                            background: '#0c0a09',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'relative',
                            color: '#fff',
                            fontSize: '9.5px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                          }}
                        >
                          {'76'}
                        </span>
                      </span>
                      <span
                        style={{ width: '1.5px', height: '4px', borderRadius: '0 1px 1px 0', background: '#b8b8bb' }}
                      ></span>
                    </span>
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    height: '52px',
                  }}
                >
                  <span style={{ fontSize: '20px', fontWeight: '700' }}>
                    {val(v['L']?.basket, AR && v['arSkip'] !== '1')}
                  </span>
                  <span style={{ position: 'absolute', insetInlineEnd: '22px', fontSize: '22px', color: '#6b7280' }}>
                    {'×'}
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: '1',
                    overflow: 'hidden',
                    padding: '6px 18px 0',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {'\n    '}
                  {v['showToggle'] ? (
                    <>
                      {'\n    '}
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          background: '#f3f4f6',
                          borderRadius: '999px',
                          padding: '4px',
                          height: '58px',
                          boxSizing: 'border-box',
                        }}
                      >
                        {'\n      '}
                        <span
                          style={css(
                            `position:absolute; top:4px; bottom:4px; inset-inline-start:${S(v['thumbLeft'])}; width:calc(50% - 4px); background:#fff; border-radius:999px; box-shadow:0 2px 8px rgba(0,0,0,.08); transition:inset-inline-start .45s cubic-bezier(.65,0,.35,1)`,
                          )}
                        ></span>
                        {'\n      '}
                        <div
                          style={{
                            position: 'relative',
                            flex: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1px',
                          }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>
                            {val(v['L']?.pickup, AR && v['arSkip'] !== '1')}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            {tr('15 min', AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                        {'\n      '}
                        <div
                          style={{
                            position: 'relative',
                            flex: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1px',
                          }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>
                            {val(v['L']?.delivery, AR && v['arSkip'] !== '1')}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            {tr('45 min', AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                        {'\n    '}
                      </div>
                      {'\n    '}
                    </>
                  ) : null}
                  {'\n    '}
                  {v['isTableB'] ? (
                    <>
                      <div
                        style={css(
                          `display:flex; align-items:center; justify-content:space-between; background:${S(v['accentTint'])}; border-radius:16px; padding:12px 16px; height:58px; box-sizing:border-box`,
                        )}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={css(
                              `font-size:12px; font-weight:600; color:${S(v['accent'])}; letter-spacing:0.04em; text-transform:uppercase`,
                            )}
                          >
                            {tr('Dine-in', AR && v['arSkip'] !== '1')}
                          </span>
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>
                            {tr('Table 7', AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#4b5563' }}>
                          {tr('Served at your table', AR && v['arSkip'] !== '1')}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {'\n    '}
                  {v['showStatus'] ? (
                    <>
                      {'\n      '}
                      <div
                        style={css(
                          `margin-top:14px; background:${S(v['accentTint'])}; border-radius:16px; padding:14px 16px`,
                        )}
                      >
                        {'\n        '}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>
                            {val(v['statusHead'], AR && v['arSkip'] !== '1')}
                          </span>
                          <span style={css(`font-size:12px; font-weight:600; color:${S(v['accent'])}`)}>
                            {val(v['statusNow'], AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                        {'\n        '}
                        {v['isDelivery'] ? (
                          <>
                            <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '3px' }}>
                              {val(v['st']?.address, AR && v['arSkip'] !== '1')}
                            </div>
                          </>
                        ) : null}
                        {'\n        '}
                        {v['isPickup'] ? (
                          <>
                            <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '3px' }}>
                              {val(v['st']?.name, AR && v['arSkip'] !== '1')}
                              {' · '}
                              {val(v['st']?.branch, AR && v['arSkip'] !== '1')}
                            </div>
                          </>
                        ) : null}
                        {'\n        '}
                        <div
                          style={{
                            height: '6px',
                            background: 'rgba(255,255,255,.8)',
                            borderRadius: '3px',
                            marginTop: '12px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={css(
                              `height:100%; width:${S(v['progress'])}; background:${S(v['accent'])}; border-radius:3px; transition:width 1s ease`,
                            )}
                          ></div>
                        </div>
                        {'\n        '}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {'\n          '}
                          {arr(v['steps']).map((L6_sp, I7) => (
                            <React.Fragment key={I7}>
                              <span style={css(`color:${S(L6_sp?.color)}; transition:color .4s ease`)}>
                                {val(L6_sp?.label, AR && v['arSkip'] !== '1')}
                              </span>
                            </React.Fragment>
                          ))}
                          {'\n        '}
                        </div>
                        {'\n      '}
                      </div>
                      {'\n    '}
                    </>
                  ) : null}
                  {'\n    '}
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '6px' }}>
                    {'\n      '}
                    {arr(v['bRows']).map((L7_b, I8) => (
                      <React.Fragment key={I8}>
                        {'\n        '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 0',
                            borderBottom: '1px solid #eeeeee',
                          }}
                        >
                          {'\n          '}
                          <img
                            src={L7_b?.img}
                            alt={''}
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '10px',
                              flex: 'none',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <div
                            style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}
                          >
                            <span
                              style={{
                                fontSize: '15px',
                                fontWeight: '700',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {val(L7_b?.name, AR && v['arSkip'] !== '1')}
                            </span>
                            <span
                              style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {val(L7_b?.note, AR && v['arSkip'] !== '1')}
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: '600', marginTop: '2px' }}>
                              {val(L7_b?.price, AR && v['arSkip'] !== '1')}
                            </span>
                          </div>
                          {'\n          '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              background: '#f3f4f6',
                              borderRadius: '999px',
                              padding: '7px 12px',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            <span style={{ color: '#6b7280' }}>{'−'}</span>
                            <span>{val(L7_b?.q, AR && v['arSkip'] !== '1')}</span>
                            <span>{'+'}</span>
                          </div>
                          {'\n        '}
                        </div>
                        {'\n      '}
                      </React.Fragment>
                    ))}
                    {'\n    '}
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      marginTop: 'auto',
                      padding: '14px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#6b7280',
                    }}
                  >
                    {'\n      '}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{val(v['L']?.sub, AR && v['arSkip'] !== '1')}</span>
                      <span>{val(v['subtotal'], AR && v['arSkip'] !== '1')}</span>
                    </div>
                    {'\n      '}
                    {v['isDelivery'] ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{val(v['L']?.fee, AR && v['arSkip'] !== '1')}</span>
                          <span>{val(v['fee'], AR && v['arSkip'] !== '1')}</span>
                        </div>
                      </>
                    ) : null}
                    {'\n      '}
                    {v['isMargin'] ? (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#dcfce7',
                            color: '#166534',
                            borderRadius: '10px',
                            padding: '8px 10px',
                            margin: '0 -10px',
                            fontWeight: '600',
                          }}
                        >
                          <span>{tr('Commission', AR && v['arSkip'] !== '1')}</span>
                          <span>
                            {val(v['zero'], AR && v['arSkip'] !== '1')}
                            {' · 0%'}
                          </span>
                        </div>
                      </>
                    ) : null}
                    {'\n      '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        borderTop: '1px dashed #d1d5db',
                        paddingTop: '12px',
                        marginTop: '4px',
                        color: '#0c0a09',
                      }}
                    >
                      <span style={{ fontSize: '20px', fontWeight: '700' }}>
                        {val(v['L']?.total, AR && v['arSkip'] !== '1')}
                      </span>
                      <span style={{ fontSize: '20px', fontWeight: '700' }}>
                        {val(v['bTotal'], AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                    {'\n    '}
                  </div>
                  {'\n  '}
                </div>
                {'\n  '}
                <div style={{ flex: 'none', padding: '14px 18px 22px' }}>
                  <div
                    data-tap={'go'}
                    style={{
                      height: '54px',
                      borderRadius: '999px',
                      background: '#0c0a09',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {val(v['L']?.checkout, AR && v['arSkip'] !== '1')}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {v['isCheckout'] ? (
            <>
              <div
                style={css(
                  `position:absolute; inset:0; background:#fff; display:flex; flex-direction:column; transform:${S(v['layer']?.checkout)}; transition:${S(v['layerTr'])}`,
                )}
              >
                {'\n  '}
                <div
                  style={{
                    height: '54px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px 0 34px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      letterSpacing: '-0.01em',
                      fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                    }}
                  >
                    {'9:41'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
                      <span style={{ width: '3px', height: '5px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '7.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                      <span style={{ width: '3px', height: '10px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '12.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                    </span>
                    <svg width={'16'} height={'12'} viewBox={'0 0 16 12'} style={{ display: 'block' }}>
                      <path
                        d={'M0.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path
                        d={'M3.05 6.55A7 7 0 0 1 12.95 6.55L11.11 8.39A4.4 4.4 0 0 0 4.89 8.39Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path d={'M8 11.5L5.88 9.38A3 3 0 0 1 10.12 9.38Z'} fill={'#0c0a09'}></path>
                    </svg>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '25px',
                          height: '12.5px',
                          borderRadius: '4px',
                          background: '#b8b8bb',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '76%',
                            background: '#0c0a09',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'relative',
                            color: '#fff',
                            fontSize: '9.5px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                          }}
                        >
                          {'76'}
                        </span>
                      </span>
                      <span
                        style={{ width: '1.5px', height: '4px', borderRadius: '0 1px 1px 0', background: '#b8b8bb' }}
                      ></span>
                    </span>
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    height: '52px',
                  }}
                >
                  <span style={{ position: 'absolute', insetInlineStart: '22px', fontSize: '20px' }}>{'‹'}</span>
                  <span style={{ fontSize: '20px', fontWeight: '700' }}>
                    {val(v['L']?.coTitle, AR && v['arSkip'] !== '1')}
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: '1',
                    overflow: 'hidden',
                    padding: '8px 18px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {'\n    '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#f7f7f7',
                      borderRadius: '16px',
                      padding: '14px',
                    }}
                  >
                    <img
                      src={v['st']?.logo}
                      alt={''}
                      style={{
                        width: '44px',
                        height: '44px',
                        objectFit: 'contain',
                        display: 'block',
                        flex: 'none',
                        background: '#fff',
                        borderRadius: '12px',
                      }}
                    />
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {val(v['coLine'], AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                  </div>
                  {'\n    '}
                  <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '4px' }}>
                    {val(v['L']?.payWith, AR && v['arSkip'] !== '1')}
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      border: '2px solid #0c0a09',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {'\n      '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '6px solid #0c0a09',
                          boxSizing: 'border-box',
                        }}
                      ></span>
                      <span style={{ fontSize: '15px', fontWeight: '600', flex: '1' }}>
                        {val(v['L']?.card, AR && v['arSkip'] !== '1')}
                      </span>
                      <span style={{ display: 'flex', gap: '4px' }}>
                        <span
                          style={{ width: '26px', height: '17px', borderRadius: '3px', background: '#1f2937' }}
                        ></span>
                        <span
                          style={{ width: '26px', height: '17px', borderRadius: '3px', background: '#d1d5db' }}
                        ></span>
                      </span>
                    </div>
                    {'\n      '}
                    <div
                      style={css(
                        `height:46px; border-radius:10px; background:#f3f4f6; display:flex; align-items:center; padding:0 14px; font-family:'IBM Plex Mono',monospace; font-size:15px; letter-spacing:0.04em; color:${S(v['cardColor'])}`,
                      )}
                    >
                      {val(v['cardText'], AR && v['arSkip'] !== '1')}
                      <span
                        style={css(
                          `width:1.5px; height:18px; background:#0c0a09; margin-left:2px; opacity:${S(v['caret'])}`,
                        )}
                      ></span>
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div
                        style={css(
                          `flex:1; height:46px; border-radius:10px; background:#f3f4f6; display:flex; align-items:center; padding:0 14px; font-family:'IBM Plex Mono',monospace; font-size:15px; color:${S(v['cardColor'])}`,
                        )}
                      >
                        {val(v['expText'], AR && v['arSkip'] !== '1')}
                      </div>
                      <div
                        style={css(
                          `flex:1; height:46px; border-radius:10px; background:#f3f4f6; display:flex; align-items:center; padding:0 14px; font-family:'IBM Plex Mono',monospace; font-size:15px; color:${S(v['cardColor'])}`,
                        )}
                      >
                        {val(v['cvcText'], AR && v['arSkip'] !== '1')}
                      </div>
                    </div>
                    {'\n    '}
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid #d1d5db',
                        boxSizing: 'border-box',
                      }}
                    ></span>
                    <span style={{ fontSize: '15px', fontWeight: '600' }}>
                      {val(v['L']?.cash, AR && v['arSkip'] !== '1')}
                    </span>
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#6b7280',
                      paddingBottom: '4px',
                    }}
                  >
                    {'\n      '}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{val(v['L']?.sub, AR && v['arSkip'] !== '1')}</span>
                      <span>{val(v['subtotal'], AR && v['arSkip'] !== '1')}</span>
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{val(v['L']?.fee, AR && v['arSkip'] !== '1')}</span>
                      <span>{val(v['fee'], AR && v['arSkip'] !== '1')}</span>
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderTop: '1px dashed #d1d5db',
                        paddingTop: '12px',
                        marginTop: '4px',
                        color: '#0c0a09',
                        fontSize: '20px',
                        fontWeight: '700',
                      }}
                    >
                      <span>{val(v['L']?.total, AR && v['arSkip'] !== '1')}</span>
                      <span>{val(v['bTotal'], AR && v['arSkip'] !== '1')}</span>
                    </div>
                    {'\n    '}
                  </div>
                  {'\n  '}
                </div>
                {'\n  '}
                <div style={{ flex: 'none', padding: '14px 18px 22px' }}>
                  <div
                    style={css(
                      `height:54px; border-radius:999px; background:${S(v['payBg'])}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:600; transition:background .35s ease`,
                    )}
                  >
                    {val(v['payLabel'], AR && v['arSkip'] !== '1')}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {v['isLoyalty'] ? (
            <>
              <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {'\n  '}
                <div
                  style={{
                    height: '54px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px 0 34px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      letterSpacing: '-0.01em',
                      fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                    }}
                  >
                    {'9:41'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
                      <span style={{ width: '3px', height: '5px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '7.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                      <span style={{ width: '3px', height: '10px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '12.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                    </span>
                    <svg width={'16'} height={'12'} viewBox={'0 0 16 12'} style={{ display: 'block' }}>
                      <path
                        d={'M0.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path
                        d={'M3.05 6.55A7 7 0 0 1 12.95 6.55L11.11 8.39A4.4 4.4 0 0 0 4.89 8.39Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path d={'M8 11.5L5.88 9.38A3 3 0 0 1 10.12 9.38Z'} fill={'#0c0a09'}></path>
                    </svg>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '25px',
                          height: '12.5px',
                          borderRadius: '4px',
                          background: '#b8b8bb',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '76%',
                            background: '#0c0a09',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'relative',
                            color: '#fff',
                            fontSize: '9.5px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                          }}
                        >
                          {'76'}
                        </span>
                      </span>
                      <span
                        style={{ width: '1.5px', height: '4px', borderRadius: '0 1px 1px 0', background: '#b8b8bb' }}
                      ></span>
                    </span>
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    height: '56px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderBottom: '1px solid #eeeeee',
                  }}
                >
                  <img
                    src={v['st']?.logo}
                    alt={v['st']?.name}
                    style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: '1',
                    overflow: 'hidden',
                    padding: '20px 18px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {'\n    '}
                  <div
                    style={css(
                      `background:${S(v['accent'])}; color:#fff; border-radius:22px; padding:20px; box-shadow:0 20px 40px -24px rgba(0,0,0,.6)`,
                    )}
                  >
                    {'\n      '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          opacity: '.85',
                        }}
                      >
                        {tr('Loyalty card', AR && v['arSkip'] !== '1')}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>
                        {val(v['stampCount'], AR && v['arSkip'] !== '1')}
                        {' / 9'}
                      </span>
                    </div>
                    {'\n      '}
                    <div style={{ fontSize: '21px', fontWeight: '700', letterSpacing: '-0.02em', marginTop: '6px' }}>
                      {val(v['rewardText'], AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginTop: '18px' }}
                    >
                      {'\n        '}
                      {arr(v['stamps']).map((L8_sm, I9) => (
                        <React.Fragment key={I9}>
                          {'\n          '}
                          <span
                            style={css(
                              `aspect-ratio:1; border-radius:50%; background:${S(L8_sm?.bg)}; border:2px solid rgba(255,255,255,.55); box-sizing:border-box; color:${S(v['accent'])}; display:flex; align-items:center; justify-content:center; font-size:${S(L8_sm?.fs)}; font-weight:700; transform:${S(L8_sm?.scale)}; transition:all .35s cubic-bezier(.34,1.8,.64,1)`,
                            )}
                          >
                            {val(L8_sm?.label, AR && v['arSkip'] !== '1')}
                          </span>
                          {'\n        '}
                        </React.Fragment>
                      ))}
                      {'\n      '}
                    </div>
                    {'\n    '}
                  </div>
                  {'\n    '}
                  <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '6px' }}>
                    {tr('Recent orders', AR && v['arSkip'] !== '1')}
                  </div>
                  {'\n    '}
                  {arr(v['recent']).map((L9_rc, I10) => (
                    <React.Fragment key={I10}>
                      {'\n      '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          paddingBottom: '14px',
                          borderBottom: '1px solid #eeeeee',
                        }}
                      >
                        <img
                          src={L9_rc?.img}
                          alt={''}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            flex: 'none',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>
                            {val(L9_rc?.name, AR && v['arSkip'] !== '1')}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            {val(L9_rc?.when, AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                        <span
                          style={css(
                            `background:${S(v['accentTint'])}; color:${S(v['accent'])}; border-radius:999px; font-size:12px; font-weight:600; padding:4px 9px`,
                          )}
                        >
                          {tr('+1 stamp', AR && v['arSkip'] !== '1')}
                        </span>
                      </div>
                      {'\n    '}
                    </React.Fragment>
                  ))}
                  {'\n  '}
                </div>
              </div>
            </>
          ) : null}
          {v['isApp'] ? (
            <>
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#f5f5f5',
                }}
              >
                {'\n  '}
                <div
                  style={{
                    height: '54px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px 0 34px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      letterSpacing: '-0.01em',
                      fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                    }}
                  >
                    {'9:41'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
                      <span style={{ width: '3px', height: '5px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '7.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                      <span style={{ width: '3px', height: '10px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '12.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                    </span>
                    <svg width={'16'} height={'12'} viewBox={'0 0 16 12'} style={{ display: 'block' }}>
                      <path
                        d={'M0.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path
                        d={'M3.05 6.55A7 7 0 0 1 12.95 6.55L11.11 8.39A4.4 4.4 0 0 0 4.89 8.39Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path d={'M8 11.5L5.88 9.38A3 3 0 0 1 10.12 9.38Z'} fill={'#0c0a09'}></path>
                    </svg>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '25px',
                          height: '12.5px',
                          borderRadius: '4px',
                          background: '#b8b8bb',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '76%',
                            background: '#0c0a09',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'relative',
                            color: '#fff',
                            fontSize: '9.5px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                          }}
                        >
                          {'76'}
                        </span>
                      </span>
                      <span
                        style={{ width: '1.5px', height: '4px', borderRadius: '0 1px 1px 0', background: '#b8b8bb' }}
                      ></span>
                    </span>
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 18px 12px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                      {tr('Orders', AR && v['arSkip'] !== '1')}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {val(v['st']?.name, AR && v['arSkip'] !== '1')}
                      {' · '}
                      {val(v['st']?.branch, AR && v['arSkip'] !== '1')}
                    </span>
                  </div>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#dcfce7',
                      color: '#166534',
                      borderRadius: '999px',
                      padding: '6px 11px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }}></span>
                    {tr('Open', AR && v['arSkip'] !== '1')}
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    display: 'flex',
                    gap: '4px',
                    margin: '0 18px',
                    background: '#fff',
                    borderRadius: '999px',
                    padding: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  <span
                    style={{
                      flex: '1',
                      textAlign: 'center',
                      padding: '8px 0',
                      borderRadius: '999px',
                      background: '#0c0a09',
                      color: '#fff',
                    }}
                  >
                    {tr('New · ', AR && v['arSkip'] !== '1')}
                    {val(v['newCount'], AR && v['arSkip'] !== '1')}
                  </span>
                  <span style={{ flex: '1', textAlign: 'center', padding: '8px 0', color: '#6b7280' }}>
                    {tr('Preparing · 2', AR && v['arSkip'] !== '1')}
                  </span>
                  <span style={{ flex: '1', textAlign: 'center', padding: '8px 0', color: '#6b7280' }}>
                    {tr('Ready', AR && v['arSkip'] !== '1')}
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: '1',
                    overflow: 'hidden',
                    padding: '14px 18px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {'\n    '}
                  <div
                    style={css(
                      `background:#fff; border:2px solid ${S(v['newBorder'])}; border-radius:18px; padding:14px 16px; opacity:${S(v['newOp'])}; transform:translateY(${S(v['newY'])}); transition:opacity .45s ease, transform .5s cubic-bezier(.34,1.3,.64,1), border-color .3s ease`,
                    )}
                  >
                    {'\n      '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#6b7280' }}>
                        {'#'}
                        {val(v['ord']?.no, AR && v['arSkip'] !== '1')}
                        {' · '}
                        {val(v['ord']?.where, AR && v['arSkip'] !== '1')}
                      </span>
                      <span
                        style={css(
                          `background:${S(v['newTagBg'])}; color:${S(v['newTagColor'])}; border-radius:999px; font-size:11px; font-weight:700; padding:4px 9px; transition:all .3s ease`,
                        )}
                      >
                        {val(v['newTag'], AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                    {'\n      '}
                    <div style={{ fontSize: '15px', lineHeight: '1.55', marginTop: '8px' }}>
                      {val(v['ord']?.items, AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                      {val(v['ord']?.note, AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <span
                        style={{
                          flex: '1',
                          height: '42px',
                          borderRadius: '999px',
                          background: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {tr('Decline', AR && v['arSkip'] !== '1')}
                      </span>
                      <span
                        style={css(
                          `flex:2; height:42px; border-radius:999px; background:${S(v['acceptBg'])}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:600; transform:${S(v['acceptScale'])}; transition:all .25s ease`,
                        )}
                      >
                        {val(v['acceptLabel'], AR && v['arSkip'] !== '1')}
                        {' · '}
                        {val(v['ord']?.total, AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                    {'\n    '}
                  </div>
                  {'\n    '}
                  {arr(v['prep']).map((L10_pp, I11) => (
                    <React.Fragment key={I11}>
                      {'\n      '}
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: '18px',
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        {'\n        '}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#6b7280' }}>
                            {'#'}
                            {val(L10_pp?.no, AR && v['arSkip'] !== '1')}
                            {' · '}
                            {val(L10_pp?.where, AR && v['arSkip'] !== '1')}
                          </span>
                          <span
                            style={css(
                              `font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:500; color:${S(v['accent'])}`,
                            )}
                          >
                            {val(L10_pp?.timer, AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                        {'\n        '}
                        <span style={{ fontSize: '14px', lineHeight: '1.5' }}>
                          {val(L10_pp?.items, AR && v['arSkip'] !== '1')}
                        </span>
                        {'\n      '}
                      </div>
                      {'\n    '}
                    </React.Fragment>
                  ))}
                  {'\n  '}
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '12px 0 22px',
                    background: '#fff',
                    borderTop: '1px solid #eeeeee',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#9ca3af',
                  }}
                >
                  <span style={{ color: '#0c0a09' }}>{tr('Orders', AR && v['arSkip'] !== '1')}</span>
                  <span>{tr('Menu', AR && v['arSkip'] !== '1')}</span>
                  <span>{tr('Branches', AR && v['arSkip'] !== '1')}</span>
                  <span>{tr('Settings', AR && v['arSkip'] !== '1')}</span>
                </div>
              </div>
            </>
          ) : null}
          {v['isDesktop'] ? (
            <>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 36px',
                    borderBottom: '1px solid #eeeeee',
                  }}
                >
                  {'\n    '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '24px' }}>
                      <span style={{ height: '2.5px', background: '#0c0a09', borderRadius: '2px' }}></span>
                      <span style={{ height: '2.5px', background: '#0c0a09', borderRadius: '2px' }}></span>
                      <span style={{ height: '2.5px', background: '#0c0a09', borderRadius: '2px' }}></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={v['st']?.logo}
                        alt={v['st']?.name}
                        style={{ width: '62px', height: '62px', objectFit: 'contain', display: 'block' }}
                      />
                      <span style={{ fontWeight: '700', fontSize: '19px', letterSpacing: '-0.01em' }}>
                        {val(v['st']?.name, AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                  </div>
                  {'\n    '}
                  <span
                    style={{
                      background: '#f3f4f6',
                      borderRadius: '999px',
                      padding: '9px 16px',
                      fontSize: '15px',
                      fontWeight: '600',
                    }}
                  >
                    {tr('EN ▾', AR && v['arSkip'] !== '1')}
                  </span>
                  {'\n  '}
                </div>
                {'\n  '}
                <div style={{ flex: '1', display: 'flex', minHeight: '0' }}>
                  {'\n    '}
                  <div style={{ flex: '1', minWidth: '0', padding: '28px 36px', overflow: 'hidden' }}>
                    {'\n      '}
                    <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                      {tr('Popular', AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginTop: '16px' }}
                    >
                      {'\n        '}
                      {arr(v['dPop']).map((L11_c, I12) => (
                        <React.Fragment key={I12}>
                          {'\n          '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div
                              style={{
                                position: 'relative',
                                height: '128px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: '#f3f4f6',
                                marginBottom: '8px',
                              }}
                            >
                              <img
                                src={L11_c?.img}
                                alt={''}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                              <span
                                style={css(
                                  `position:absolute; inset-inline-end:10px; bottom:10px; width:34px; height:34px; border-radius:50%; background:${S(L11_c?.plusBg)}; color:${S(L11_c?.plusColor)}; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 2px 6px rgba(0,0,0,.15); transform:${S(L11_c?.plusScale)}; transition:all .35s ease`,
                                )}
                              >
                                {'+'}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {val(L11_c?.name, AR && v['arSkip'] !== '1')}
                            </span>
                            <span style={{ fontSize: '16px', fontWeight: '600' }}>
                              {val(L11_c?.price, AR && v['arSkip'] !== '1')}
                            </span>
                          </div>
                          {'\n        '}
                        </React.Fragment>
                      ))}
                      {'\n      '}
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        marginTop: '24px',
                        height: '50px',
                        borderRadius: '999px',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0 20px',
                        color: '#9ca3af',
                        fontSize: '16px',
                      }}
                    >
                      <span
                        style={{ width: '14px', height: '14px', border: '2px solid #9ca3af', borderRadius: '50%' }}
                      ></span>
                      {tr('Search the menu…', AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                      {'\n        '}
                      {arr(v['chips']).map((L12_ch, I13) => (
                        <React.Fragment key={I13}>
                          <span
                            style={css(
                              `background:${S(L12_ch?.bg)}; color:${S(L12_ch?.color)}; border-radius:999px; padding:11px 20px; font-size:16px; font-weight:500`,
                            )}
                          >
                            {val(L12_ch?.label, AR && v['arSkip'] !== '1')}
                          </span>
                        </React.Fragment>
                      ))}
                      {'\n      '}
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginTop: '26px',
                        paddingTop: '22px',
                        borderTop: '1px solid #eeeeee',
                      }}
                    >
                      <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                        {val(v['st']?.cats?.[0], AR && v['arSkip'] !== '1')}
                      </span>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {tr('10 items', AR && v['arSkip'] !== '1')}
                      </span>
                    </div>
                    {'\n      '}
                    <div
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 32px', marginTop: '18px' }}
                    >
                      {'\n        '}
                      {arr(v['dList']).map((L13_r, I14) => (
                        <React.Fragment key={I14}>
                          {'\n          '}
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <img
                              src={L13_r?.img}
                              alt={''}
                              style={{
                                flex: 'none',
                                width: '96px',
                                height: '96px',
                                borderRadius: '14px',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                              <span style={{ fontSize: '17px', fontWeight: '700' }}>
                                {val(L13_r?.name, AR && v['arSkip'] !== '1')}
                              </span>
                              <span style={{ fontSize: '14px', lineHeight: '1.45', color: '#6b7280' }}>
                                {val(L13_r?.desc, AR && v['arSkip'] !== '1')}
                              </span>
                              <span style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                {val(L13_r?.price, AR && v['arSkip'] !== '1')}
                              </span>
                            </div>
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
                      flex: 'none',
                      width: '350px',
                      borderInlineStart: '1px solid #eeeeee',
                      padding: '28px 28px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {'\n      '}
                    <div style={{ fontSize: '26px', fontWeight: '700', textAlign: 'center' }}>
                      {tr('Basket', AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        background: '#f3f4f6',
                        borderRadius: '999px',
                        padding: '4px',
                        height: '60px',
                        boxSizing: 'border-box',
                        marginTop: '18px',
                      }}
                    >
                      <span
                        style={css(
                          `position:absolute; top:4px; bottom:4px; inset-inline-start:${S(v['thumbLeft'])}; width:calc(50% - 4px); background:#fff; border-radius:999px; box-shadow:0 2px 8px rgba(0,0,0,.08); transition:inset-inline-start .45s cubic-bezier(.65,0,.35,1)`,
                        )}
                      ></span>
                      <div
                        style={{
                          position: 'relative',
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: '600' }}>
                          {val(v['L']?.pickup, AR && v['arSkip'] !== '1')}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {tr('15 min', AR && v['arSkip'] !== '1')}
                        </span>
                      </div>
                      <div
                        style={{
                          position: 'relative',
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: '600' }}>
                          {val(v['L']?.delivery, AR && v['arSkip'] !== '1')}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {tr('45 min', AR && v['arSkip'] !== '1')}
                        </span>
                      </div>
                    </div>
                    {'\n      '}
                    <div style={{ position: 'relative', flex: '1', marginTop: '8px' }}>
                      {'\n        '}
                      <div
                        style={css(
                          `position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:15px; color:#9ca3af; opacity:${S(v['emptyOp'])}; transition:opacity .3s ease`,
                        )}
                      >
                        {tr('Your basket is empty', AR && v['arSkip'] !== '1')}
                      </div>
                      {'\n        '}
                      {arr(v['dBasket']).map((L14_b, I15) => (
                        <React.Fragment key={I15}>
                          {'\n          '}
                          <div
                            style={css(
                              `display:flex; align-items:center; gap:10px; padding:14px 0; border-bottom:1px solid #eeeeee; opacity:${S(L14_b?.op)}; transform:translateX(${S(L14_b?.x)}); transition:opacity .4s ease, transform .45s cubic-bezier(.34,1.3,.64,1)`,
                            )}
                          >
                            <div
                              style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}
                            >
                              <span
                                style={{
                                  fontSize: '15px',
                                  fontWeight: '700',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {val(L14_b?.name, AR && v['arSkip'] !== '1')}
                              </span>
                              <span style={{ fontSize: '15px', fontWeight: '600' }}>
                                {val(L14_b?.price, AR && v['arSkip'] !== '1')}
                              </span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: '#f3f4f6',
                                borderRadius: '999px',
                                padding: '7px 12px',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              <span style={{ color: '#6b7280' }}>{'−'}</span>
                              <span>{'1'}</span>
                              <span>{'+'}</span>
                            </div>
                          </div>
                          {'\n        '}
                        </React.Fragment>
                      ))}
                      {'\n      '}
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        fontSize: '15px',
                        color: '#6b7280',
                        borderTop: '1px solid #eeeeee',
                        paddingTop: '16px',
                      }}
                    >
                      {'\n        '}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{val(v['L']?.sub, AR && v['arSkip'] !== '1')}</span>
                        <span>{val(v['dSub'], AR && v['arSkip'] !== '1')}</span>
                      </div>
                      {'\n        '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          color: '#0c0a09',
                          fontSize: '22px',
                          fontWeight: '700',
                          marginTop: '6px',
                        }}
                      >
                        <span>{val(v['L']?.total, AR && v['arSkip'] !== '1')}</span>
                        <span>{val(v['dSub'], AR && v['arSkip'] !== '1')}</span>
                      </div>
                      {'\n      '}
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        height: '56px',
                        borderRadius: '999px',
                        background: '#0c0a09',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                        fontWeight: '600',
                        marginTop: '18px',
                      }}
                    >
                      {val(v['L']?.checkout, AR && v['arSkip'] !== '1')}
                    </div>
                    {'\n    '}
                  </div>
                  {'\n  '}
                </div>
              </div>
            </>
          ) : null}
          {v['isPortal'] ? (
            <>
              <div style={{ height: '100%', display: 'flex', background: '#f7f7f6' }}>
                {'\n  '}
                <div
                  style={{
                    flex: 'none',
                    width: '220px',
                    background: '#fff',
                    borderInlineEnd: '1px solid #eeeeee',
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {'\n    '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 22px' }}>
                    <img
                      src={v['st']?.logo}
                      alt={v['st']?.name}
                      style={{ width: '72px', height: '72px', objectFit: 'contain', display: 'block', flex: 'none' }}
                    />
                  </div>
                  {'\n    '}
                  {arr(v['nav']).map((L15_n, I16) => (
                    <React.Fragment key={I16}>
                      <span
                        style={css(
                          `padding:11px 12px; border-radius:10px; font-size:15px; font-weight:500; background:${S(L15_n?.bg)}; color:${S(L15_n?.color)}`,
                        )}
                      >
                        {val(L15_n?.label, AR && v['arSkip'] !== '1')}
                      </span>
                    </React.Fragment>
                  ))}
                  {'\n  '}
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: '1',
                    minWidth: '0',
                    padding: '26px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '22px',
                  }}
                >
                  {'\n    '}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {'\n      '}
                    <div style={{ position: 'relative' }}>
                      {'\n        '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: '#fff',
                          border: '1px solid #e5e5e5',
                          borderRadius: '12px',
                          padding: '10px 16px',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        <span
                          style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}
                        ></span>
                        {val(v['branchName'], AR && v['arSkip'] !== '1')}
                        <span style={{ color: '#9ca3af' }}>{'▾'}</span>
                      </div>
                      {'\n        '}
                      <div
                        style={css(
                          `position:absolute; top:52px; left:0; width:240px; background:#fff; border:1px solid #e5e5e5; border-radius:14px; padding:6px; box-shadow:0 20px 40px -20px rgba(0,0,0,.3); z-index:2; opacity:${S(v['ddOp'])}; transform:translateY(${S(v['ddY'])}); transition:opacity .25s ease, transform .3s ease`,
                        )}
                      >
                        {'\n          '}
                        {arr(v['branchList']).map((L16_bl, I17) => (
                          <React.Fragment key={I17}>
                            <div
                              style={css(
                                `display:flex; justify-content:space-between; padding:10px 12px; border-radius:10px; font-size:15px; background:${S(L16_bl?.bg)}; transition:background .2s ease`,
                              )}
                            >
                              <span style={{ fontWeight: '500' }}>{val(L16_bl?.name, AR && v['arSkip'] !== '1')}</span>
                              <span style={{ color: '#6b7280', fontSize: '13px' }}>
                                {val(L16_bl?.orders, AR && v['arSkip'] !== '1')}
                                {tr(' orders', AR && v['arSkip'] !== '1')}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                        {'\n        '}
                      </div>
                      {'\n      '}
                    </div>
                    {'\n      '}
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {tr('Today · live', AR && v['arSkip'] !== '1')}
                    </span>
                    {'\n    '}
                  </div>
                  {'\n    '}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                    {'\n      '}
                    {arr(v['stats']).map((L17_k, I18) => (
                      <React.Fragment key={I18}>
                        <div
                          style={{
                            background: '#fff',
                            border: '1px solid #eeeeee',
                            borderRadius: '16px',
                            padding: '18px 20px',
                          }}
                        >
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {val(L17_k?.label, AR && v['arSkip'] !== '1')}
                          </div>
                          <div
                            style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', marginTop: '6px' }}
                          >
                            {val(L17_k?.value, AR && v['arSkip'] !== '1')}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    {'\n    '}
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      flex: '1',
                      background: '#fff',
                      border: '1px solid #eeeeee',
                      borderRadius: '16px',
                      padding: '8px 20px',
                      overflow: 'hidden',
                    }}
                  >
                    {'\n      '}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '90px 130px 1fr 100px 110px',
                        gap: '12px',
                        padding: '12px 0',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        borderBottom: '1px solid #eeeeee',
                      }}
                    >
                      <span>{tr('Order', AR && v['arSkip'] !== '1')}</span>
                      <span>{tr('Type', AR && v['arSkip'] !== '1')}</span>
                      <span>{tr('Items', AR && v['arSkip'] !== '1')}</span>
                      <span>{val(v['L']?.total, AR && v['arSkip'] !== '1')}</span>
                      <span>{tr('Status', AR && v['arSkip'] !== '1')}</span>
                    </div>
                    {'\n      '}
                    {arr(v['pRows']).map((L18_o, I19) => (
                      <React.Fragment key={I19}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '90px 130px 1fr 100px 110px',
                            gap: '12px',
                            padding: '14px 0',
                            fontSize: '15px',
                            borderBottom: '1px solid #f3f3f3',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#6b7280' }}>
                            {'#'}
                            {val(L18_o?.no, AR && v['arSkip'] !== '1')}
                          </span>
                          <span>{val(L18_o?.where, AR && v['arSkip'] !== '1')}</span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {val(L18_o?.items, AR && v['arSkip'] !== '1')}
                          </span>
                          <span style={{ fontWeight: '600' }}>{val(L18_o?.total, AR && v['arSkip'] !== '1')}</span>
                          <span
                            style={css(
                              `width:fit-content; background:${S(L18_o?.bg)}; border-radius:999px; font-size:12px; font-weight:600; padding:4px 10px`,
                            )}
                          >
                            {val(L18_o?.status, AR && v['arSkip'] !== '1')}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                    {'\n    '}
                  </div>
                  {'\n  '}
                </div>
              </div>
            </>
          ) : null}
          {v['isAnalysis'] ? (
            <>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#f7f7f6',
                  padding: '32px 40px',
                  boxSizing: 'border-box',
                  gap: '22px',
                }}
              >
                {'\n  '}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '30px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                      {tr('Menu analysis', AR && v['arSkip'] !== '1')}
                    </span>
                    <span style={{ fontSize: '15px', color: '#6b7280' }}>
                      {val(v['st']?.name, AR && v['arSkip'] !== '1')}
                      {tr(' compared with 14 places within 1 km', AR && v['arSkip'] !== '1')}
                    </span>
                  </div>
                  <span
                    style={{
                      background: '#0c0a09',
                      color: '#fff',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: '600',
                      padding: '7px 14px',
                    }}
                  >
                    {tr('Coming soon', AR && v['arSkip'] !== '1')}
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: '1',
                    background: '#fff',
                    border: '1px solid #eeeeee',
                    borderRadius: '18px',
                    padding: '8px 24px',
                    overflow: 'hidden',
                  }}
                >
                  {'\n    '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 100px 2fr 110px',
                      gap: '20px',
                      padding: '14px 0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#9ca3af',
                      borderBottom: '1px solid #eeeeee',
                    }}
                  >
                    <span>{tr('Dish', AR && v['arSkip'] !== '1')}</span>
                    <span>{tr('Your price', AR && v['arSkip'] !== '1')}</span>
                    <span>{tr('Nearby range', AR && v['arSkip'] !== '1')}</span>
                    <span>{tr('Verdict', AR && v['arSkip'] !== '1')}</span>
                  </div>
                  {'\n    '}
                  {arr(v['aRows']).map((L19_a, I20) => (
                    <React.Fragment key={I20}>
                      {'\n      '}
                      <div
                        style={css(
                          `display:grid; grid-template-columns:1.2fr 100px 2fr 110px; gap:20px; padding:16px 12px; margin:0 -12px; border-radius:12px; align-items:center; font-size:16px; background:${S(L19_a?.bg)}; transition:background .4s ease`,
                        )}
                      >
                        {'\n        '}
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: '600',
                            minWidth: '0',
                          }}
                        >
                          <img
                            src={L19_a?.img}
                            alt={''}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              flex: 'none',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {val(L19_a?.name, AR && v['arSkip'] !== '1')}
                          </span>
                        </span>
                        <span>{val(L19_a?.price, AR && v['arSkip'] !== '1')}</span>
                        {'\n        '}
                        <div
                          style={{ position: 'relative', height: '10px', background: '#f1f1f1', borderRadius: '5px' }}
                        >
                          <span
                            style={css(
                              `position:absolute; top:0; bottom:0; left:${S(L19_a?.l)}; width:${S(L19_a?.w)}; background:#d6d3d1; border-radius:5px`,
                            )}
                          ></span>
                          <span
                            style={css(
                              `position:absolute; top:50%; left:${S(L19_a?.dot)}; width:18px; height:18px; margin:-9px 0 0 -9px; border-radius:50%; background:${S(v['accent'])}; border:3px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.25); transition:left .8s cubic-bezier(.34,1.3,.64,1)`,
                            )}
                          ></span>
                        </div>
                        {'\n        '}
                        <span
                          style={css(
                            `width:fit-content; background:${S(L19_a?.vBg)}; color:${S(L19_a?.vColor)}; border-radius:999px; font-size:13px; font-weight:600; padding:5px 11px`,
                          )}
                        >
                          {val(L19_a?.verdict, AR && v['arSkip'] !== '1')}
                        </span>
                        {'\n      '}
                      </div>
                      {'\n    '}
                    </React.Fragment>
                  ))}
                  {'\n  '}
                </div>
              </div>
            </>
          ) : null}
          {v['isDone'] ? (
            <>
              <div
                style={css(
                  `position:absolute; inset:0; background:#fff; display:flex; flex-direction:column; opacity:${S(v['doneO'])}; transition:${S(v['doneTr'])}`,
                )}
              >
                {'\n  '}
                <div
                  style={{
                    height: '54px',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 30px 0 34px',
                    fontSize: '14px',
                    fontWeight: '600',
                    direction: 'ltr',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      letterSpacing: '-0.01em',
                      fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                    }}
                  >
                    {'9:41'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '12px' }}>
                      <span style={{ width: '3px', height: '5px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '7.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                      <span style={{ width: '3px', height: '10px', background: '#0c0a09', borderRadius: '1px' }}></span>
                      <span
                        style={{ width: '3px', height: '12.5px', background: '#0c0a09', borderRadius: '1px' }}
                      ></span>
                    </span>
                    <svg width={'16'} height={'12'} viewBox={'0 0 16 12'} style={{ display: 'block' }}>
                      <path
                        d={'M0.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path
                        d={'M3.05 6.55A7 7 0 0 1 12.95 6.55L11.11 8.39A4.4 4.4 0 0 0 4.89 8.39Z'}
                        fill={'#0c0a09'}
                      ></path>
                      <path d={'M8 11.5L5.88 9.38A3 3 0 0 1 10.12 9.38Z'} fill={'#0c0a09'}></path>
                    </svg>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                      <span
                        style={{
                          position: 'relative',
                          width: '25px',
                          height: '12.5px',
                          borderRadius: '4px',
                          background: '#b8b8bb',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '76%',
                            background: '#0c0a09',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'relative',
                            color: '#fff',
                            fontSize: '9.5px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            fontFamily: "-apple-system,'SF Pro Text','Geist',sans-serif",
                          }}
                        >
                          {'76'}
                        </span>
                      </span>
                      <span
                        style={{ width: '1.5px', height: '4px', borderRadius: '0 1px 1px 0', background: '#b8b8bb' }}
                      ></span>
                    </span>
                  </span>
                </div>
                {'\n  '}
                <div
                  style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '48px 22px 0',
                    textAlign: 'center',
                  }}
                >
                  {'\n    '}
                  <span
                    style={css(
                      `width:88px; height:88px; border-radius:50%; background:#15803d; display:flex; align-items:center; justify-content:center; transform:${S(v['doneS'])}; transition:transform .55s cubic-bezier(.34,1.8,.64,1)`,
                    )}
                  >
                    <svg
                      width={'40'}
                      height={'40'}
                      viewBox={'0 0 12 12'}
                      fill={'none'}
                      stroke={'#fff'}
                      strokeWidth={'1.8'}
                      strokeLinecap={'round'}
                      strokeLinejoin={'round'}
                    >
                      <path d={'M2.5 6.2l2.4 2.4 4.6-5'}></path>
                    </svg>
                  </span>
                  {'\n    '}
                  <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', marginTop: '22px' }}>
                    {val(v['L']?.doneTitle, AR && v['arSkip'] !== '1')}
                  </div>
                  {'\n    '}
                  <div style={{ fontSize: '15px', color: '#6b7280', marginTop: '6px' }}>
                    {val(v['L']?.doneSub, AR && v['arSkip'] !== '1')}
                  </div>
                  {'\n    '}
                  <div
                    style={{
                      width: '100%',
                      marginTop: '28px',
                      background: '#f7f7f7',
                      borderRadius: '18px',
                      padding: '16px',
                      boxSizing: 'border-box',
                      textAlign: 'start',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {'\n      '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#6b7280' }}>{val(v['L']?.order, AR && v['arSkip'] !== '1')}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: '500' }}>{'#1043'}</span>
                    </div>
                    {'\n      '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#6b7280' }}>{val(v['L']?.etaLabel, AR && v['arSkip'] !== '1')}</span>
                      <span style={{ fontWeight: '600' }}>{val(v['L']?.eta, AR && v['arSkip'] !== '1')}</span>
                    </div>
                    {'\n      '}
                    <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={css(
                          `height:100%; width:${S(v['doneBar'])}; background:#15803d; border-radius:3px; transition:width 1.2s ease`,
                        )}
                      ></div>
                    </div>
                    {'\n      '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #e5e7eb',
                        fontSize: '14px',
                      }}
                    >
                      <span>{val(v['doneItem'], AR && v['arSkip'] !== '1')}</span>
                      <span style={{ fontWeight: '600' }}>{val(v['bTotal'], AR && v['arSkip'] !== '1')}</span>
                    </div>
                    {'\n    '}
                  </div>
                  {'\n  '}
                </div>
                {'\n  '}
                <div style={{ flex: 'none', padding: '14px 18px 22px' }}>
                  <div
                    style={{
                      height: '54px',
                      borderRadius: '999px',
                      background: '#0c0a09',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {val(v['L']?.track, AR && v['arSkip'] !== '1')}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {'\n'}
          {val(v['fly'], AR && v['arSkip'] !== '1')}
          <div
            style={css(
              `position:absolute; z-index:20; left:${S(v['tapX'])}px; top:${S(v['tapY'])}px; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%; background:rgba(12,10,9,.16); border:2px solid rgba(12,10,9,.4); box-sizing:border-box; opacity:${S(v['tapO'])}; transform:${S(v['tapS'])}; transition:opacity .3s ease, transform .4s ease, left .45s ease, top .45s ease; pointer-events:none`,
            )}
          ></div>
        </div>
      </div>
    </>
  );
}

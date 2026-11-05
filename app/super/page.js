'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = ['Verifying credentials', 'Checking admin permissions', 'Opening console'];

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&*+=/<>'.split('');
const WORDS = [['Dinelabs', 700], ['Super', 400]];

function Cipher() {
  const refs = useRef([]);
  const active = useRef(new Set());

  const setChar = (el, enc) => {
    if (!el || el._enc === enc) return;
    el._enc = enc;
    const [mask, real] = el.children;
    if (enc) mask.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    mask.style.opacity = enc ? 1 : 0;
    mask.style.transform = enc ? 'none' : 'translateY(-3px)';
    real.style.opacity = enc ? 0 : 1;
    real.style.filter = enc ? 'blur(6px)' : 'none';
    real.style.transform = enc ? 'translateY(3px)' : 'none';
  };

  const apply = (idx) => {
    active.current = new Set(idx);
    refs.current.forEach((el, i) => setChar(el, active.current.has(i)));
  };

  const onMove = (e) => {
    let best = -1, bd = Infinity;
    refs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      if (d < bd) { bd = d; best = i; }
    });
    const total = WORDS.reduce((n, w) => n + w[0].length, 0);
    const c = Math.min(Math.max(best, 1), total - 2);
    apply([c - 1, c, c + 1]);
  };

  const onLeave = () => apply([]);

  useEffect(() => {
    const iv = setInterval(() => {
      active.current.forEach(i => {
        const el = refs.current[i];
        if (el && Math.random() < 0.5) {
          el.children[0].textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      });
    }, 110);
    return () => clearInterval(iv);
  }, []);

  let k = 0;
  return (
    <div
      aria-label="Dinelabs Super"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        fontSize: 34,
        letterSpacing: '-.035em',
        lineHeight: 1,
        padding: '24px 32px',
        margin: '-24px -32px',
        cursor: 'default',
        userSelect: 'none',
        color: '#f4f4f5'
      }}
    >
      {WORDS.map(([w, wt]) => (
        <span key={w} aria-hidden="true" style={{ fontWeight: wt, display: 'inline-flex' }}>
          {w.split('').map((c) => {
            const i = k++;
            return (
              <span
                key={i}
                ref={(el) => (refs.current[i] = el)}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontWeight: 400,
                    fontSize: '.72em',
                    letterSpacing: 0,
                    color: '#8a8a92',
                    opacity: 0,
                    transition: 'opacity .45s ease, transform .45s ease'
                  }}
                >
                  {GLYPHS[i % GLYPHS.length]}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    transition: 'opacity .5s ease, filter .5s ease, transform .5s ease'
                  }}
                >
                  {c}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

export default function SuperLoginPage() {
  const router = useRouter();
  const [view, setView] = useState('signin'); // 'signin' | 'loading'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wrong, setWrong] = useState(false);
  const [step, setStep] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startAnimationAndRedirect = () => {
    setView('loading');
    setStep(0);

    const runSteps = (currentStep) => {
      if (currentStep >= STEPS.length) {
        setTimeout(() => {
          window.location.href = '/super/dashboard';
        }, 600);
        return;
      }
      timerRef.current = setTimeout(() => {
        setStep(currentStep + 1);
        runSteps(currentStep + 1);
      }, 650);
    };

    runSteps(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return setError('Enter a valid work email.');
    }
    if (!password) {
      return setError('Enter your password.');
    }

    setError('');
    setWrong(false);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, portal: 'super' })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      if (data.role !== 'superadmin') {
        throw new Error('Access denied. Super Admin only.');
      }

      setLoading(false);
      startAnimationAndRedirect();
    } catch (err) {
      setLoading(false);
      setWrong(true);
      setError(err.message || 'Incorrect email or password.');
    }
  };

  const done = view === 'loading' && step >= STEPS.length;

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', display: 'flex', background: '#0b0b0c', color: '#f4f4f5', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style jsx global>{`
        @keyframes dl-spin { to { transform: rotate(360deg); } }
        @keyframes dl-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes ds-drift { from { background-position: 0 0, 0 0; } to { background-position: 48px 48px, 48px 48px; } }
        @media (max-width: 860px) {
          .ds-aside { display: none !important; }
          .ds-main { flex-direction: column; padding: 40px 24px 56px !important; }
          .ds-mobile-logo { display: flex !important; }
        }
        @media (max-width: 480px) {
          .ds-main { justify-content: flex-start !important; padding: 28px 20px 48px !important; }
          .ds-input { font-size: 16px !important; }
          h1 { font-size: 26px !important; }
        }
      `}</style>

      {/* Main Login / Loading Section */}
      <main className="ds-main" style={{ flex: '1 1 460px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 32px' }}>
        <div className="ds-mobile-logo" style={{ display: 'none', width: '100%', maxWidth: '420px', marginBottom: '48px', alignItems: 'baseline', gap: '6px', fontSize: '22px', letterSpacing: '-.03em' }}>
          <span style={{ fontWeight: 700 }}>Dinelabs</span>
          <span style={{ fontWeight: 400 }}>Super</span>
        </div>

        {view === 'signin' && (
          <form onSubmit={handleSubmit} noValidate style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ animation: 'dl-rise .5s ease-out 40ms both', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '12px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#8a8a92', marginBottom: '18px' }}>
              Admin console
            </div>
            <h1 style={{ animation: 'dl-rise .5s ease-out 80ms both', margin: 0, fontSize: '30px', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>
              Sign in to Dinelabs Super
            </h1>
            <p style={{ animation: 'dl-rise .5s ease-out 120ms both', margin: '10px 0 36px', fontSize: '15.5px', lineHeight: 1.5, color: '#9a9aa2' }}>
              Manage restaurants, plans and platform settings across Dinelabs.
            </p>

            <label htmlFor="ds-email" style={{ animation: 'dl-rise .5s ease-out 160ms both', fontSize: '13.5px', fontWeight: 500, marginBottom: '8px' }}>
              Work email
            </label>
            <input
              id="ds-email"
              type="email"
              autoComplete="email"
              placeholder="operator@dinelabs.co"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); setWrong(false); }}
              className="ds-input"
              style={{
                animation: 'dl-rise .5s ease-out 180ms both',
                height: '50px',
                padding: '0 16px',
                borderRadius: '12px',
                border: `1px solid ${error && wrong ? '#5a2a2d' : '#26262a'}`,
                background: '#141416',
                font: 'inherit',
                fontSize: '15px',
                color: '#f4f4f5',
                outline: 'none',
                transition: 'border-color .12s, box-shadow .12s'
              }}
            />

            <label htmlFor="ds-pass" style={{ animation: 'dl-rise .5s ease-out 200ms both', fontSize: '13.5px', fontWeight: 500, margin: '22px 0 8px' }}>
              Password
            </label>
            <div style={{ animation: 'dl-rise .5s ease-out 220ms both', position: 'relative', display: 'flex' }}>
              <input
                id="ds-pass"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your operator token"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="ds-input"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: '50px',
                  padding: '0 76px 0 16px',
                  borderRadius: '12px',
                  border: `1px solid ${error && wrong ? '#5a2a2d' : '#26262a'}`,
                  background: '#141416',
                  font: 'inherit',
                  fontSize: '15px',
                  color: '#f4f4f5',
                  outline: 'none',
                  transition: 'border-color .12s, box-shadow .12s'
                }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  height: '34px',
                  padding: '0 12px',
                  border: 0,
                  borderRadius: '8px',
                  background: '#1f1f22',
                  font: 'inherit',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  color: '#f4f4f5',
                  cursor: 'pointer'
                }}
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#231213', border: '1px solid #3a1c1e', color: '#f3a6a9', fontSize: '13px', fontWeight: 500 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e5484d', flex: 'none' }}></span>
                <span style={{ flex: 1 }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                animation: 'dl-rise .5s ease-out 260ms both',
                marginTop: '28px',
                height: '52px',
                border: 0,
                borderRadius: '999px',
                background: '#f4f4f5',
                color: '#0b0b0c',
                font: 'inherit',
                fontSize: '15.5px',
                fontWeight: 500,
                letterSpacing: '-.01em',
                cursor: loading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: loading ? 0.8 : 1,
                transition: 'background .12s, transform .06s'
              }}
            >
              {loading && (
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(11,11,12,.2)', borderTopColor: '#0b0b0c', animation: 'dl-spin .7s linear infinite', display: 'inline-block' }} />
              )}
              {loading ? 'Authenticating…' : 'Sign in'}
            </button>

            <div style={{ animation: 'dl-rise .5s ease-out 300ms both', height: '1px', background: '#1f1f22', margin: '32px 0 22px' }}></div>
            <div style={{ animation: 'dl-rise .5s ease-out 320ms both', fontSize: '14px', lineHeight: 1.5, color: '#9a9aa2' }}>
              Are you a restaurant manager?{' '}
              <a href="/manager" style={{ color: '#f4f4f5', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Store manager login
              </a>
            </div>
          </form>
        )}

        {view === 'loading' && (
          <div role="status" aria-live="polite" style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ animation: 'dl-rise .5s ease-out both', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '12px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#8a8a92', marginBottom: '18px' }}>
              {email}
            </div>
            <h1 style={{ animation: 'dl-rise .5s ease-out 40ms both', margin: 0, fontSize: '30px', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>
              {done ? "You're in" : 'Signing you in'}
            </h1>
            <p style={{ animation: 'dl-rise .5s ease-out 80ms both', margin: '10px 0 32px', fontSize: '15.5px', lineHeight: 1.5, color: '#9a9aa2' }}>
              {done ? 'Redirecting to the Super console…' : 'Hang tight, this only takes a moment.'}
            </p>
            <div style={{ animation: 'dl-rise .5s ease-out 120ms both', display: 'flex', flexDirection: 'column', border: '1px solid #1f1f22', borderRadius: '14px', background: '#111113' }}>
              {STEPS.map((label, i) => {
                const isDone = i < step;
                const isActive = i === step;
                return (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderTop: i === 0 ? 'transparent' : '1px solid #1f1f22',
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: '13px',
                      color: i <= step ? '#f4f4f5' : '#6b6b72',
                      transition: 'color .2s'
                    }}
                  >
                    <span style={{ width: '16px', height: '16px', flex: 'none', display: 'grid', placeItems: 'center' }}>
                      {isDone && <span style={{ fontSize: '12px', color: '#f4f4f5' }}>✓</span>}
                      {isActive && (
                        <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,.15)', borderTopColor: '#f4f4f5', animation: 'dl-spin .7s linear infinite', display: 'inline-block' }} />
                      )}
                      {!isDone && !isActive && (
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#3a3a40' }}></span>
                      )}
                    </span>
                    <span style={{ flex: 1 }}>{label}</span>
                    <span style={{ fontSize: '12px', color: '#6b6b72' }}>{isDone ? 'ok' : ''}</span>
                  </div>
                );
              })}
            </div>
            {done && (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); if (timerRef.current) clearTimeout(timerRef.current); setView('signin'); setStep(0); }}
                style={{ animation: 'dl-rise .5s ease-out both', alignSelf: 'flex-start', marginTop: '24px', fontSize: '13.5px', fontWeight: 500, color: '#9a9aa2', textDecoration: 'none' }}
              >
                ← Sign out
              </a>
            )}
          </div>
        )}
      </main>

      {/* Aside Visual Section */}
      <aside className="ds-aside" style={{ flex: '1 1 460px', background: '#0f0f11', borderLeft: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 32px', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-48px',
            backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            animation: 'ds-drift 24s linear infinite',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 100%)'
          }}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <div style={{ animation: 'dl-rise .6s ease-out 100ms both' }}>
            <Cipher />
          </div>
        </div>
      </aside>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManagerSignInPage() {
  const router = useRouter();

  // View state: 'signin' | 'forgot' | 'code' | 'newpass'
  const [view, setView] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password & reset state
  const [code, setCode] = useState('');
  const [codeFocus, setCodeFocus] = useState(false);
  const [np1, setNp1] = useState('');
  const [np2, setNp2] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const cooldownRef = useRef(null);
  const codeInputRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(30);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Password strength calculation
  const getStrength = (p) => {
    if (!p) return 0;
    let n = 0;
    if (p.length >= 8) n++;
    if (/[a-z]/i.test(p) && /\d/.test(p)) n++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) n++;
    if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) n++;
    return p.length < 8 ? Math.min(n, 1) : n;
  };

  // Sign In submit
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError('Enter a valid email address.');
    }
    if (!password) {
      return setError('Enter your password.');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      try {
        localStorage.setItem('dl_mode', 'demo');
      } catch (err) {}

      if (data.role === 'superadmin') {
        window.location.href = '/super/dashboard';
      } else {
        window.location.href = '/manager/dashboard';
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Send Reset Code
  const handleSendReset = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError('Enter a valid email address.');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_code', email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset code.');

      setLoading(false);
      setView('code');
      setCode('');
      startCooldown();
      setTimeout(() => codeInputRef.current?.focus(), 100);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (code.length < 6) {
      return setError('Enter the 6-digit code from the email.');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_code', email, code })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code.');

      setLoading(false);
      setView('newpass');
      setShowPassword(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Save New Password
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (getStrength(np1) < 2) {
      return setError('Choose a stronger password.');
    }
    if (np1 !== np2) {
      return setError("The passwords don't match.");
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_password', email, code, newPassword: np1 })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password.');

      setLoading(false);
      setView('signin');
      setResetDone(true);
      setPassword('');
      setNp1('');
      setNp2('');
      setCode('');
      setShowPassword(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Helper variables for password strength
  const st = getStrength(np1);
  const strengthColors = ['#ececec', '#cf2e36', '#cf2e36', '#b06a00', '#138a52', '#138a52'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const passwordsMatch = np2 && np1 === np2;

  const orders = [
    { id: '1052', short: 'DL', status: 'New', dot: '#cf2e36', sub: 'Nino K. · 3 items · Delivery', total: '$38.40', time: 'Just now' },
    { id: '1051', short: 'PU', status: 'Preparing', dot: '#b06a00', sub: 'Giorgi M. · 2 items · Pick-up', total: '$21.50', time: '4m ago' },
    { id: '1049', short: 'T3', status: 'Ready', dot: '#138a52', sub: 'Table 3 · 5 items · Dine-in', total: '$64.20', time: '11m ago' },
  ];

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', display: 'flex', background: '#fff', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: '#0a0a0a' }}>
      
      {/* Left Column: Form */}
      <main className="dl-auth-main" style={{ flex: '1 1 460px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 32px' }}>
        
        {/* Mobile Header Logo */}
        <div style={{ display: 'none' }} className="mobile-only-logo">
          <img src="/assets/dinelabs-logo.png" alt="Dinelabs Manager" style={{ display: 'block', width: '150px', height: 'auto', margin: '0 auto 28px' }} />
        </div>

        {/* 1. SIGN IN FORM */}
        {view === 'signin' && (
          <form onSubmit={handleSignIn} noValidate style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>Welcome back</h1>
            <p style={{ margin: '10px 0 36px', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b' }}>
              Sign in to manage your menu, orders and storefront.
            </p>

            {resetDone && (
              <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '-16px 0 24px', padding: '12px 14px', borderRadius: '12px', background: '#e9f5ef', color: '#138a52', fontSize: '13.5px', fontWeight: 500 }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#138a52', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', flex: 'none' }}>✓</span>
                Password updated. Sign in with your new password.
              </div>
            )}

            <label htmlFor="dl-email" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: '8px' }}>Email</label>
            <input
              id="dl-email"
              type="email"
              autoComplete="email"
              placeholder="you@restaurant.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              style={{ height: '50px', padding: '0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)', transition: 'border-color .12s, box-shadow .12s' }}
            />

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '22px 0 8px' }}>
              <label htmlFor="dl-pass" style={{ fontSize: '13.5px', fontWeight: 500 }}>Password</label>
              <button
                type="button"
                onClick={() => { setView('forgot'); setError(''); setResetDone(false); }}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', fontWeight: 500, color: '#6b6b6b', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                Forgot password?
              </button>
            </div>

            <div style={{ position: 'relative', display: 'flex' }}>
              <input
                id="dl-pass"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                style={{ flex: 1, minWidth: 0, height: '50px', padding: '0 76px 0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '8px', top: '8px', height: '34px', padding: '0 12px', border: 0, borderRadius: '8px', background: '#f5f5f5', font: 'inherit', fontSize: '12.5px', fontWeight: 500, color: '#0a0a0a', cursor: 'pointer' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#fbe9ea', color: '#cf2e36', fontSize: '13px', fontWeight: 500 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cf2e36', flex: 'none' }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: '28px', height: '52px', border: 0, borderRadius: '999px', background: '#0a0a0a', color: '#fff', font: 'inherit', fontSize: '15.5px', fontWeight: 500, letterSpacing: '-.01em', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background .12s, transform .06s' }}
            >
              {loading && (
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <p style={{ margin: '16px 0 0', fontSize: '13px', lineHeight: 1.5, color: '#6b6b6b' }}>
              By signing in you accept the Dinelabs <span style={{ textDecoration: 'underline' }}>Terms & Privacy Policy</span>.
            </p>

            <div style={{ height: '1px', background: '#ececec', margin: '32px 0 24px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#6b6b6b' }}>
              <div>
                New to Dinelabs?{' '}
                <Link href="/manager/signup" style={{ fontWeight: 500, color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Create your storefront
                </Link>
              </div>
              <div>
                Trouble signing in?{' '}
                <a href="mailto:support@dinelabs.co" style={{ fontWeight: 500, color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Contact support
                </a>
              </div>
            </div>
          </form>
        )}

        {/* 2. FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleSendReset} noValidate style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
            <button
              type="button"
              onClick={() => { setView('signin'); setError(''); }}
              style={{ background: 'none', border: 'none', padding: 0, alignSelf: 'flex-start', fontSize: '13.5px', fontWeight: 500, color: '#6b6b6b', cursor: 'pointer', marginBottom: '28px' }}
            >
              ← Back to sign in
            </button>
            <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>Forgot password</h1>
            <p style={{ margin: '10px 0 36px', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b' }}>
              Reset your password for your Dinelabs account.
            </p>

            <label htmlFor="dl-reset-email" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: '8px' }}>Email</label>
            <input
              id="dl-reset-email"
              type="email"
              autoComplete="email"
              placeholder="you@restaurant.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              style={{ height: '50px', padding: '0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
            />

            {error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#fbe9ea', color: '#cf2e36', fontSize: '13px', fontWeight: 500 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cf2e36', flex: 'none' }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: '28px', height: '52px', border: 0, borderRadius: '999px', background: '#0a0a0a', color: '#fff', font: 'inherit', fontSize: '15.5px', fontWeight: 500, letterSpacing: '-.01em', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading && (
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
              )}
              {loading ? 'Sending…' : 'Send Password Reset Email'}
            </button>
          </form>
        )}

        {/* 3. VERIFICATION CODE */}
        {view === 'code' && (
          <form onSubmit={handleVerifyCode} noValidate style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
            <button
              type="button"
              onClick={() => { setView('forgot'); setError(''); }}
              style={{ background: 'none', border: 'none', padding: 0, alignSelf: 'flex-start', fontSize: '13.5px', fontWeight: 500, color: '#6b6b6b', cursor: 'pointer', marginBottom: '28px' }}
            >
              ← Change email
            </button>
            <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>Enter verification code</h1>
            <p style={{ margin: '10px 0 32px', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b' }}>
              We sent a 6-digit code to <span style={{ color: '#0a0a0a', fontWeight: 500 }}>{email}</span>. It expires in 10 minutes.
            </p>

            <label htmlFor="dl-code" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: '8px' }}>Code</label>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px' }}>
              {Array.from({ length: 6 }, (_, i) => {
                const active = codeFocus && (i === Math.min(code.length, 5));
                const bad = !!error;
                return (
                  <div
                    key={i}
                    style={{
                      height: '58px',
                      borderRadius: '12px',
                      border: `1px solid ${bad ? '#cf2e36' : active ? '#0a0a0a' : '#e0e0e0'}`,
                      boxShadow: active ? '0 0 0 3px rgba(10,10,10,.08)' : '0 1px 2px rgba(10,10,10,.04)',
                      background: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '22px',
                      fontWeight: 500,
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'border-color .12s, box-shadow .12s'
                    }}
                  >
                    {code[i] || ''}
                  </div>
                );
              })}
              <input
                ref={codeInputRef}
                id="dl-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                onFocus={() => setCodeFocus(true)}
                onBlur={() => setCodeFocus(false)}
                autoFocus
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, fontSize: '16px', cursor: 'text', border: 0, padding: 0 }}
              />
            </div>

            {error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#fbe9ea', color: '#cf2e36', fontSize: '13px', fontWeight: 500 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cf2e36', flex: 'none' }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={code.length < 6 || loading}
              style={{
                marginTop: '28px',
                height: '52px',
                border: 0,
                borderRadius: '999px',
                background: code.length < 6 ? '#e6e6e6' : '#0a0a0a',
                color: code.length < 6 ? '#9a9a9a' : '#fff',
                font: 'inherit',
                fontSize: '15.5px',
                fontWeight: 500,
                letterSpacing: '-.01em',
                cursor: code.length < 6 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading && (
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
              )}
              {loading ? 'Verifying…' : 'Verify code'}
            </button>

            <p style={{ margin: '16px 0 0', fontSize: '13px', lineHeight: 1.5, color: '#6b6b6b' }}>
              {cooldown > 0 ? (
                `Didn't get it? You can resend in ${cooldown}s.`
              ) : (
                <>
                  Didn't get it? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={(e) => { handleSendReset(e); setCode(''); }}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#0a0a0a', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Resend code
                  </button>
                </>
              )}
            </p>
          </form>
        )}

        {/* 4. SET NEW PASSWORD */}
        {view === 'newpass' && (
          <form onSubmit={handleSavePassword} noValidate style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>Set a new password</h1>
            <p style={{ margin: '10px 0 32px', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b' }}>
              Use at least 8 characters with a mix of letters and numbers.
            </p>

            <label htmlFor="dl-np1" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: '8px' }}>New password</label>
            <div style={{ position: 'relative', display: 'flex' }}>
              <input
                id="dl-np1"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter a new password"
                value={np1}
                onChange={(e) => { setNp1(e.target.value); setError(''); }}
                style={{ flex: 1, minWidth: 0, height: '50px', padding: '0 76px 0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '8px', top: '8px', height: '34px', padding: '0 12px', border: 0, borderRadius: '8px', background: '#f5f5f5', font: 'inherit', fontSize: '12.5px', fontWeight: 500, color: '#0a0a0a', cursor: 'pointer' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Strength Meter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                {[0, 1, 2, 3].map(i => (
                  <span
                    key={i}
                    style={{
                      height: '4px',
                      borderRadius: '999px',
                      background: i < st ? strengthColors[st] : '#ececec',
                      transition: 'background .2s'
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: strengthColors[st], minWidth: '48px', textAlign: 'right' }}>
                {strengthLabels[st]}
              </span>
            </div>

            <label htmlFor="dl-np2" style={{ fontSize: '13.5px', fontWeight: 500, margin: '22px 0 8px' }}>Confirm new password</label>
            <input
              id="dl-np2"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter the new password"
              value={np2}
              onChange={(e) => { setNp2(e.target.value); setError(''); }}
              style={{ height: '50px', padding: '0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
            />

            {np2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12.5px', fontWeight: 500, color: passwordsMatch ? '#138a52' : '#9a9a9a' }}>
                {passwordsMatch ? '✓ Passwords match' : "Passwords don't match yet"}
              </div>
            )}

            {error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#fbe9ea', color: '#cf2e36', fontSize: '13px', fontWeight: 500 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cf2e36', flex: 'none' }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={st < 2 || !passwordsMatch || loading}
              style={{
                marginTop: '28px',
                height: '52px',
                border: 0,
                borderRadius: '999px',
                background: (st < 2 || !passwordsMatch) ? '#e6e6e6' : '#0a0a0a',
                color: (st < 2 || !passwordsMatch) ? '#9a9a9a' : '#fff',
                font: 'inherit',
                fontSize: '15.5px',
                fontWeight: 500,
                letterSpacing: '-.01em',
                cursor: (st < 2 || !passwordsMatch) ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading && (
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
              )}
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}

      </main>

      {/* Right Column: Aside Banner */}
      <aside className="dl-auth-aside" style={{ flex: '1 1 460px', background: '#f4f1ec', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {view === 'signin' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/dinelabs-logo.png" alt="Dinelabs Manager" style={{ display: 'block', width: '180px', height: 'auto' }} />
              </div>

              <h2 style={{ margin: '40px 0 0', fontSize: '30px', lineHeight: 1.15, fontWeight: 500, letterSpacing: '-.03em', textWrap: 'balance' }}>
                Every order, every channel, one calm dashboard.
              </h2>

              <div style={{ width: '100%', marginTop: '44px', background: '#fff', borderRadius: '18px', boxShadow: '0 12px 40px rgba(40,30,20,.10), 0 1px 2px rgba(40,30,20,.06)', textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #ececec' }}>
                  <div style={{ fontWeight: 500, fontSize: '14.5px', letterSpacing: '-.01em' }}>Live orders</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '999px', background: '#e9f5ef', color: '#138a52', fontSize: '11.5px', fontWeight: 500 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#138a52' }} />
                    Live
                  </div>
                </div>

                {orders.map((o) => (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderTop: '1px solid #f2f2f2' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f5f5', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 500, color: '#0a0a0a', flex: 'none' }}>
                      {o.short}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '13.5px' }}>
                        #{o.id}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: '20px', padding: '0 8px', borderRadius: '999px', background: '#f5f5f5', fontSize: '11px', fontWeight: 500, color: '#0a0a0a' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: o.dot }} />
                          {o.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#9a9a9a', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {o.sub}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flex: 'none' }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums' }}>
                        {o.total}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#9a9a9a', marginTop: '2px' }}>
                        {o.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{ flex: 'none', width: '48px', height: '48px', borderRadius: '14px', background: '#fff', boxShadow: '0 12px 40px rgba(40,30,20,.10), 0 1px 2px rgba(40,30,20,.06)', display: 'grid', placeItems: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2.5" />
                  <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
                  <circle cx="12" cy="16" r="1.2" fill="#0a0a0a" />
                </svg>
              </div>
              <img src="/assets/dinelabs-logo.png" alt="Dinelabs Manager" style={{ display: 'block', width: '220px', height: 'auto' }} />
            </div>
          )}

        </div>
      </aside>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 960px) {
          aside, .dl-auth-aside { display: none !important; }
          .mobile-only-logo { display: block !important; width: 100% !important; max-width: 420px !important; margin: 0 auto 28px !important; }
          .dl-auth-main {
            flex: 1 1 100% !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 36px 20px 48px !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
}

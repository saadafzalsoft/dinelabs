'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);

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

      // Successful login
      if (data.role === 'superadmin') {
        router.push('/super/dashboard');
      } else {
        router.push('/manager/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="split-layout">
      {/* Left side: Premium branding cover */}
      <div className="split-left-promo">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1.5px' }}>
          DineLabs
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.5, maxWidth: '460px', fontWeight: '500' }}>
          Accelerate table turnovers, eliminate printing costs, and drive upselling using frictionless dynamic catalogs.
        </p>
      </div>

      {/* Right side: Modern clean login card */}
      <div className="split-right-form">
        <div className="login-card">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>
            Dinelabs Manager
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', fontWeight: '500' }}>
            Sign in to manage your tables, orders, and menu
          </p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Manager Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="manager@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={submitting}
              style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: submitting ? 'var(--text-muted)' : 'var(--text-main)' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './super.css';

export default function SuperLoginPage() {
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

      if (data.role !== 'superadmin') {
        throw new Error('Access denied. Super Admin only.');
      }

      router.push('/super/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="split-layout" style={{ gridTemplateColumns: '1fr' }}>
      <div className="split-right-form" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="login-card" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid var(--border-light)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <img src="/assets/dinelabs-super-logo.svg" alt="Dinelabs Super" style={{ width: '180px', height: 'auto', marginBottom: '12px' }} />
            <span className="brand-tag">
              <span className="dot" style={{ backgroundColor: '#1a1a1a' }}></span>
              Super Console
            </span>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Super Operator Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="operator@dinelabs.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Secure Operator Token</label>
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
              style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: submitting ? 'var(--text-muted)' : '#1a1a1a', color: '#ffffff', borderRadius: '12px', fontWeight: 'bold' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In as Operator'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Are you a Store Manager? <a href="/manager" style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
}

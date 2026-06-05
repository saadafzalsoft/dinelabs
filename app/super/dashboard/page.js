'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperDashboardPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Client Form states
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [tier, setTier] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTenants() {
      try {
        const res = await fetch('/api/super/tenants');
        if (res.ok) {
          const data = await res.json();
          setTenants(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  // Onboard new tenant client
  const handleOnboardTenant = async (e) => {
    e.preventDefault();
    if (!slug || !name || !managerEmail || !managerPassword || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/super/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          managerEmail,
          managerPassword,
          tier: parseInt(tier)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTenants([...tenants, { ...data.tenant, managerEmail }]);
        setSlug('');
        setName('');
        setManagerEmail('');
        setManagerPassword('');
        setTier(1);
        alert('Restaurant onboarded successfully!');
      } else {
        alert(data.error || 'Failed onboarding restaurant');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle tenant subscription status slider (Active vs Suspended)
  const handleToggleStatus = async (tenant) => {
    const nextStatus = tenant.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tenant._id, status: nextStatus })
      });
      if (res.ok) {
        setTenants(tenants.map(t => t._id === tenant._id ? { ...t, status: nextStatus } : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update tenant tier level
  const handleTierChange = async (tenantId, newTier) => {
    try {
      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tenantId, tier: parseInt(newTier) })
      });
      if (res.ok) {
        setTenants(tenants.map(t => t._id === tenantId ? { ...t, tier: parseInt(newTier) } : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Enter Masquerading mode impersonating a client
  const handleMasquerade = async (tenant) => {
    try {
      const res = await fetch('/api/super/masquerade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug: tenant.slug })
      });

      if (res.ok) {
        // Successful masquerade cookie setter, redirect straight to manager cockpit
        router.push('/manager/dashboard');
      } else {
        alert('Failed entering masquerade session');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/super');
    } catch (e) {
      console.error(e);
    }
  };

  // Platform wide analytics aggregations
  const activeCount = tenants.filter(t => t.status === 'active').length;
  const suspendedCount = tenants.filter(t => t.status === 'suspended').length;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Super Admin header */}
      <header className="header" style={{ position: 'static', borderBottom: '1px solid var(--border-light)' }}>
        <div className="header-container">
          <span className="logo" style={{ color: 'var(--brand-red)' }}>DineLabs <span>Super Dashboard</span></span>
          <div className="header-right">
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>👤 Operator Mode</span>
            <button 
              onClick={handleLogout}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', textDecoration: 'underline' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Grid container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Aggregated Macro Insights Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase' }}>Platform tenants</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800' }}>{tenants.length}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase' }}>Active subscriptions</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{activeCount}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase' }}>Suspended accounts</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: '#ef4444' }}>{suspendedCount}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase' }}>Platform Health</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>100% ONLINE</div>
          </div>
        </div>

        {/* 2-Column Split: Tenants Management vs Onboarding form */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px' }}>
          
          {/* Card: Tenant list */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '24px' }}>Restaurants Ecosystem Manager</h3>

            {loading ? (
              <h3>Fetching platform tenants...</h3>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Store & Slug</th>
                    <th style={{ padding: '12px' }}>Tier level</th>
                    <th style={{ padding: '12px' }}>Billing status</th>
                    <th style={{ padding: '12px' }}>Operator actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(tenant => (
                    <tr key={tenant._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '700' }}>{tenant.name}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          slug: dinelabs.co/<strong>{tenant.slug}</strong><br />
                          manager: {tenant.managerEmail}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <select 
                          value={tenant.tier} 
                          onChange={(e) => handleTierChange(tenant._id, e.target.value)}
                          className="form-control"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', width: '110px' }}
                        >
                          <option value="1">Tier 1 Standard</option>
                          <option value="2">Tier 2 Pro</option>
                          <option value="3">Tier 3 Hospitality</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {/* Active vs Suspended billing toggler slider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleToggleStatus(tenant)}
                            style={{
                              border: 'none',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              backgroundColor: tenant.status === 'active' ? '#d1fae5' : '#fee2e2',
                              color: tenant.status === 'active' ? '#10b981' : '#ef4444'
                            }}
                          >
                            {tenant.status === 'active' ? 'Active' : 'Suspended'}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleMasquerade(tenant)}
                          style={{
                            backgroundColor: 'var(--text-main)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                          title={`Click to impersonate manager dashboard of ${tenant.name}`}
                        >
                          🕵️ Impersonate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Card: Add Tenant Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px' }}>Onboard New Client</h3>
            <form onSubmit={handleOnboardTenant}>
              <div className="form-group">
                <label className="form-label">Restaurant Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Burger Palace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subdirectory Slug</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. burger-palace"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Manager Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="manager@burgerpalace.com"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="manager123"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Assigned Tier</label>
                <select 
                  className="form-control"
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                >
                  <option value="1">Tier 1 (Standard)</option>
                  <option value="2">Tier 2 (Pro)</option>
                  <option value="3">Tier 3 (Hospitality)</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="checkout-btn"
                disabled={submitting}
                style={{ fontSize: '0.85rem', padding: '10px' }}
              >
                {submitting ? 'Onboarding...' : 'Onboard Restaurant'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

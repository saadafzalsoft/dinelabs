'use client';

import React, { useEffect, useState } from 'react';
import { useManager } from '../layout';

export default function PromotionsPage() {
  const { tenantSettings } = useManager();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [sub, setSub] = useState('Always on');
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch('/api/manager/promotions')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPromos(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    const res = await fetch('/api/manager/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), code: code.trim().toUpperCase(), sub, on: true }),
    });
    setSaving(false);
    if (res.ok) {
      setTitle('');
      setCode('');
      load();
    }
  };

  const toggle = async (p) => {
    const id = p._id || p.id;
    const nextOn = !p.on;
    setPromos((prev) => prev.map((x) => ((x._id || x.id) === id ? { ...x, on: nextOn } : x)));
    await fetch('/api/manager/promotions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, on: nextOn }),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>Promotions</h1>
        <p style={{ margin: '4px 0 0', color: '#5A5A57', fontSize: 14 }}>
          Create discounts and promo codes for {tenantSettings?.restaurantName || 'your store'}.
        </p>
      </div>

      <form onSubmit={create} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, background: '#fff', padding: 16, borderRadius: 16, border: '1px solid #EAEAE8' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Promotion title (e.g. 15% off everything)"
          required
          style={{ flex: 2, minWidth: 220, height: 42, padding: '0 12px', borderRadius: 10, border: '1px solid #EAEAE8' }}
        />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Promo code (optional)"
          style={{ flex: 1, minWidth: 150, height: 42, padding: '0 12px', borderRadius: 10, border: '1px solid #EAEAE8' }}
        />
        <select
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          style={{ height: 42, padding: '0 12px', borderRadius: 10, border: '1px solid #EAEAE8', background: '#fff' }}
        >
          <option value="Always on">Always on</option>
          <option value="Today">Today</option>
          <option value="This weekend">This weekend</option>
          <option value="Next 7 days">Next 7 days</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          style={{ height: 42, padding: '0 20px', borderRadius: 10, border: 0, background: '#14110F', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? 'Saving...' : 'Create promotion'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ padding: 20, background: '#fff', borderRadius: 16, border: '1px solid #EAEAE8', color: '#5A5A57' }}>Loading promotions...</div>
        ) : promos.length === 0 ? (
          <div style={{ padding: 20, background: '#fff', borderRadius: 16, border: '1px solid #EAEAE8', color: '#5A5A57' }}>No promotions created yet.</div>
        ) : (
          promos.map((p) => (
            <div key={p._id || p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: '#fff', borderRadius: 16, border: '1px solid #EAEAE8', opacity: p.on ? 1 : 0.6 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{p.title} {p.code ? <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 6, background: '#F4F4F3', fontSize: 12 }}>{p.code}</span> : null}</div>
                <div style={{ fontSize: 13, color: '#5A5A57', marginTop: 2 }}>{p.sub} · used {p.used || 0} times</div>
              </div>
              <button
                onClick={() => toggle(p)}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 99,
                  border: '1px solid #EAEAE8',
                  background: p.on ? '#D5EEDD' : '#F4F4F3',
                  color: p.on ? '#1F7A4D' : '#5A5A57',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p.on ? 'Active' : 'Paused'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useManager } from '../layout';

export default function BranchesPage() {
  const { tenantSettings } = useManager();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const currency = tenantSettings?.currency === 'USD' ? '$' : tenantSettings?.currency === 'GBP' ? '£' : '€';

  const load = () => {
    fetch('/api/manager/branches')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setBranches(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    const res = await fetch('/api/manager/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        address: address.trim(),
        copyFromId: branches[0]?.id || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setName('');
      setAddress('');
      load();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>Branches</h1>
        <p style={{ margin: '4px 0 0', color: '#5A5A57', fontSize: 14 }}>
          Manage your restaurant locations and add new branches.
        </p>
      </div>

      <form onSubmit={create} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, background: '#fff', padding: 16, borderRadius: 16, border: '1px solid #EAEAE8' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New branch name"
          required
          style={{ flex: 1, minWidth: 200, height: 42, padding: '0 12px', borderRadius: 10, border: '1px solid #EAEAE8' }}
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          style={{ flex: 2, minWidth: 240, height: 42, padding: '0 12px', borderRadius: 10, border: '1px solid #EAEAE8' }}
        />
        <button
          type="submit"
          disabled={saving}
          style={{ height: 42, padding: '0 20px', borderRadius: 10, border: 0, background: '#14110F', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? 'Adding...' : 'Add branch'}
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {loading ? (
          <div style={{ padding: 20, background: '#fff', borderRadius: 16, border: '1px solid #EAEAE8', color: '#5A5A57' }}>Loading branches...</div>
        ) : branches.map((b) => (
          <div key={b.id} style={{ padding: 18, background: '#fff', borderRadius: 16, border: b.isCurrent ? '2px solid #14110F' : '1px solid #EAEAE8', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 17 }}>{b.name}</strong>
              <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: b.open ? '#D5EEDD' : '#FFF0C2', color: b.open ? '#1F7A4D' : '#7A5300' }}>{b.status}</span>
            </div>
            <div style={{ fontSize: 13, color: '#5A5A57' }}>{b.where || `dinelabs.co/store/${b.slug}`}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: 14 }}>
              <span>{b.orders} orders today</span>
              <strong style={{ color: '#1F7A4D' }}>{currency}{Number(b.sales || 0).toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

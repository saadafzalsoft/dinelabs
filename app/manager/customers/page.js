'use client';

import React, { useEffect, useState } from 'react';
import { useManager } from '../layout';

export default function CustomersPage() {
  const { tenantSettings } = useManager();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const currency = tenantSettings?.currency === 'USD' ? '$' : tenantSettings?.currency === 'GBP' ? '£' : '€';

  useEffect(() => {
    fetch('/api/manager/customers')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    (c.name + ' ' + c.phone).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>Customers</h1>
        <p style={{ margin: '4px 0 0', color: '#5A5A57', fontSize: 14 }}>
          {customers.length} customers ordered from {tenantSettings?.restaurantName || 'your store'}.
        </p>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by customer name or phone..."
        style={{
          height: 44,
          padding: '0 14px',
          borderRadius: 12,
          border: '1px solid #EAEAE8',
          background: '#fff',
          fontSize: 14,
          maxWidth: 420,
        }}
      />

      <div style={{ background: '#fff', border: '1px solid #EAEAE8', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 24, color: '#5A5A57' }}>Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 24, color: '#5A5A57' }}>No customers found yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F4F4F3', color: '#5A5A57', fontSize: 12 }}>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Phone</th>
                <th style={{ padding: '12px 16px' }}>Orders</th>
                <th style={{ padding: '12px 16px' }}>Total Spent</th>
                <th style={{ padding: '12px 16px' }}>Favorite Item</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr key={idx} style={{ borderTop: '1px solid #EAEAE8' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '14px 16px', color: '#5A5A57' }}>{c.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>{c.orders}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1F7A4D' }}>
                    {currency}{Number(c.spent || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#5A5A57' }}>{c.fav}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

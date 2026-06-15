'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Save,
  Check,
  Globe
} from 'lucide-react';

function OpeningHoursPageContent() {
  const router = useRouter();

  const [openingHours, setOpeningHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchHours = async () => {
    try {
      const res = await fetch('/api/tenant/settings');
      if (res.status === 401) {
        router.push('/manager');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setOpeningHours(data.openingHours || []);
      }
    } catch (err) {
      console.error('Error fetching opening hours', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHours();
  }, []);

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleHourToggle = (dayIndex) => {
    const updated = openingHours.map((h, idx) => {
      if (idx === dayIndex) {
        return { ...h, isOpen: !h.isOpen };
      }
      return h;
    });
    setOpeningHours(updated);
  };

  const handleHourChange = (dayIndex, field, value) => {
    const updated = openingHours.map((h, idx) => {
      if (idx === dayIndex) {
        return { ...h, [field]: value };
      }
      return h;
    });
    setOpeningHours(updated);
  };

  const handleSaveHours = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Fetch latest tenant settings so we don't overwrite other configurations
      const currentRes = await fetch('/api/tenant/settings');
      if (!currentRes.ok) throw new Error('Could not fetch settings');
      const currentData = await currentRes.json();

      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          openingHours
        })
      });

      if (res.ok) {
        triggerToast('Opening hours saved successfully!');
      } else {
        alert('Failed saving opening hours');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving opening hours');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h3 className="mut3">Loading opening hours...</h3>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Opening hours</h1>
          <p className="page-sub">Set when your storefront accepts orders. Customers see these hours and ordering pauses automatically when you're closed.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSaveHours}
          disabled={saving}
        >
          <Check className="ic" />
          <span>{saving ? 'Saving...' : 'Save changes'}</span>
        </button>
      </div>

      <section>
        <div className="card">
          <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock className="ic" style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontWeight: 'bold' }}>Weekly schedule</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {openingHours.map((h, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '200px 1fr auto', 
                  alignItems: 'center', 
                  padding: '18px 22px', 
                  borderBottom: '1px solid var(--line)',
                  backgroundColor: h.isOpen ? 'transparent' : '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px' }}>{h.day}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
                    {h.isOpen ? 'Ordering is active' : 'Storefront closed'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {h.isOpen ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="time" 
                        value={h.open} 
                        onChange={(e) => handleHourChange(idx, 'open', e.target.value)}
                        className="input"
                        style={{ height: '40px', padding: '0 12px', width: '120px', borderRadius: '10px', border: '1px solid var(--line-2)' }}
                      />
                      <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>—</span>
                      <input 
                        type="time" 
                        value={h.close} 
                        onChange={(e) => handleHourChange(idx, 'close', e.target.value)}
                        className="input"
                        style={{ height: '40px', padding: '0 12px', width: '120px', borderRadius: '10px', border: '1px solid var(--line-2)' }}
                      />
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13.5px' }}>Closed all day</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="switch">
                    <input 
                      type="checkbox"
                      checked={h.isOpen}
                      onChange={() => handleHourToggle(idx)}
                    />
                    <span className="track"></span>
                  </label>
                </div>

              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 22px', backgroundColor: '#f9fafb', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', borderTop: '1px solid var(--line)', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
            <Globe className="ic" style={{ width: '15px', height: '15px', color: 'var(--text-muted)' }} />
            <span>All times are configured in your local store timezone</span>
          </div>

        </div>
      </section>

    </div>
  );
}

export default function ManagerOpeningHoursPage() {
  return (
    <Suspense fallback={<h3>Loading opening hours schedule...</h3>}>
      <OpeningHoursPageContent />
    </Suspense>
  );
}

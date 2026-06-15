'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bike,
  Check,
  Save
} from 'lucide-react';

function DeliveryPageContent() {
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delivery settings states
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [deliveryWait, setDeliveryWait] = useState(40);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [baseCurrency, setBaseCurrency] = useState('USD');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/tenant/settings');
      if (res.status === 401) {
        router.push('/manager');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setDeliveryEnabled(data.enabledModes?.delivery ?? true);
        setDeliveryWait(data.waitTimes?.delivery ?? 45);
        setDeliveryFee(data.deliveryFee ?? 0);
        setMinOrderValue(data.minOrderValue ?? 0);
        setBaseCurrency(data.baseCurrency || 'USD');
      }
    } catch (err) {
      console.error('Error fetching settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleSaveSettings = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Fetch latest tenant settings so we don't overwrite other fields
      const currentRes = await fetch('/api/tenant/settings');
      if (!currentRes.ok) throw new Error('Could not fetch settings');
      const currentData = await currentRes.json();

      const nextEnabledModes = {
        ...(currentData.enabledModes || { dineIn: true, pickup: true }),
        delivery: deliveryEnabled
      };

      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          enabledModes: nextEnabledModes,
          waitTimes: {
            ...(currentData.waitTimes || { pickup: 15 }),
            delivery: parseInt(deliveryWait)
          },
          deliveryFee: parseFloat(deliveryFee),
          minOrderValue: parseFloat(minOrderValue)
        })
      });

      if (res.ok) {
        triggerToast('Delivery settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h3 className="mut3">Loading delivery settings...</h3>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Delivery</h1>
          <p className="page-sub">Turn delivery on, set the wait time customers see, and the rules that gate every delivery order.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          <Check className="ic" />
          <span>{saving ? 'Saving...' : 'Save changes'}</span>
        </button>
      </div>

      <section>
        <div className="card">
          
          {/* Status Header */}
          <div className={`svc-status ${deliveryEnabled ? 'on' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="svc-ic" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: deliveryEnabled ? 'var(--brand-red-light)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: deliveryEnabled ? 'var(--brand-red)' : '#9ca3af' }}>
                <Bike className="ic" style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Accepting delivery orders</span>
                  <span className={`pill ${deliveryEnabled ? 'pill-pos' : 'pill-soft'}`} style={{ height: '22px', fontSize: '10px', fontWeight: 'bold' }}>
                    {deliveryEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  When off, the delivery option is hidden from the storefront and existing baskets switch to pick-up.
                </div>
              </div>
            </div>
            
            <label className="switch">
              <input 
                type="checkbox"
                checked={deliveryEnabled}
                onChange={() => setDeliveryEnabled(!deliveryEnabled)}
              />
              <span className="track"></span>
            </label>
          </div>

          {/* Timing Section */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>Estimated delivery time</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                A range shown on the storefront and in the order confirmation. Keep it honest — customers compare it to actual delivery time in reviews.
              </p>
            </div>
            
            <div style={{ maxWidth: '300px' }}>
              <label className="label" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Door-to-door window (minutes)
              </label>
              <div className="range-input" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--line-2)', borderRadius: '10px', padding: '6px 12px', backgroundColor: '#ffffff' }}>
                <input 
                  type="number" 
                  min="5" 
                  max="180" 
                  step="5" 
                  value={deliveryWait} 
                  onChange={(e) => setDeliveryWait(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit', fontWeight: 'bold' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>minutes</span>
              </div>
            </div>
          </div>

          {/* Pricing Rules Section */}
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>Pricing rules</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Set the smallest order you'll deliver and the fee added at checkout.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '500px' }}>
              <div className="field">
                <label className="label" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Minimum order value
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: '10px', padding: '0 12px', height: '40px', backgroundColor: '#ffffff' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginRight: '6px', fontWeight: 'bold' }}>{baseCurrency === 'LBP' ? 'L.L' : '$'}</span>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.5" 
                    value={minOrderValue} 
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit', fontWeight: 'bold' }}
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>
                  Orders below this value cannot check out for delivery.
                </p>
              </div>

              <div className="field">
                <label className="label" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Delivery fee
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: '10px', padding: '0 12px', height: '40px', backgroundColor: '#ffffff' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginRight: '6px', fontWeight: 'bold' }}>{baseCurrency === 'LBP' ? 'L.L' : '$'}</span>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.5" 
                    value={deliveryFee} 
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit', fontWeight: 'bold' }}
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>
                  A flat fee added to every delivery basket at checkout.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default function ManagerDeliveryPage() {
  return (
    <Suspense fallback={<h3>Loading delivery settings...</h3>}>
      <DeliveryPageContent />
    </Suspense>
  );
}

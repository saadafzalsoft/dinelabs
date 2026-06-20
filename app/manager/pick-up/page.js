'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useManager } from '../layout';
import {
  ShoppingBag,
  Check,
  Save,
  MapPin,
  Link as LinkIcon
} from 'lucide-react';

function PickupPageContent() {
  const router = useRouter();
  const { tenantSettings, loading: contextLoading, refreshTenantSettings } = useManager();

  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  // Pick-up settings states
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [pickupWait, setPickupWait] = useState(20);
  const [address, setAddress] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');

  const loading = contextLoading;

  useEffect(() => {
    if (tenantSettings) {
      setSettings(tenantSettings);
      setPickupEnabled(tenantSettings.enabledModes?.pickup ?? true);
      setPickupWait(tenantSettings.waitTimes?.pickup ?? 20);
      setAddress(tenantSettings.address ?? '');
      setGoogleMapsLink(tenantSettings.googleMapsLink ?? '');
    }
  }, [tenantSettings]);

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
        ...(currentData.enabledModes || { dineIn: true, delivery: true }),
        pickup: pickupEnabled
      };

      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          enabledModes: nextEnabledModes,
          waitTimes: {
            ...(currentData.waitTimes || { delivery: 40 }),
            pickup: parseInt(pickupWait)
          },
          address,
          googleMapsLink
        })
      });

      if (res.ok) {
        await refreshTenantSettings();
        triggerToast('Pick-up settings saved successfully!');
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
      <div className="fade-in" style={{ padding: '8px 0', maxWidth: '800px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Pick-up</h1>
          <p className="page-sub">Turn pick-up on, set preparation delay, and update physical location address information.</p>
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
          <div className={`svc-status ${pickupEnabled ? 'on' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="svc-ic" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: pickupEnabled ? 'var(--brand-red-light)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: pickupEnabled ? 'var(--brand-red)' : '#9ca3af' }}>
                <ShoppingBag className="ic" style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Accepting pick-up orders</span>
                  <span className={`pill ${pickupEnabled ? 'pill-pos' : 'pill-soft'}`} style={{ height: '22px', fontSize: '10px', fontWeight: 'bold' }}>
                    {pickupEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  When off, the pick-up option is hidden from the storefront.
                </div>
              </div>
            </div>
            
            <label className="switch">
              <input 
                type="checkbox"
                checked={pickupEnabled}
                onChange={() => setPickupEnabled(!pickupEnabled)}
              />
              <span className="track"></span>
            </label>
          </div>

          {/* Timing Section */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>Estimated preparation time</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                The "ready in" window shown to customers placing a pick-up order.
              </p>
            </div>
            
            <div style={{ maxWidth: '300px' }}>
              <label className="label" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Ready-in delay (minutes)
              </label>
              <div className="range-input" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--line-2)', borderRadius: '10px', padding: '6px 12px', backgroundColor: '#ffffff' }}>
                <input 
                  type="number" 
                  min="5" 
                  max="180" 
                  step="5" 
                  value={pickupWait} 
                  onChange={(e) => setPickupWait(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit', fontWeight: 'bold' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>minutes</span>
              </div>
            </div>
          </div>

          {/* Location & Directions Section */}
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>Location &amp; Directions</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Tell customers where to pick up their food and provide coordinates for directions.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
              <div className="field">
                <label className="label" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Restaurant Physical Address
                </label>
                <div style={{ display: 'flex', alignItems: 'flex-start', border: '1px solid var(--line-2)', borderRadius: '10px', padding: '10px 12px', backgroundColor: '#ffffff' }}>
                  <MapPin className="ic" style={{ width: '18px', height: '18px', color: 'var(--text-muted)', marginRight: '8px', marginTop: '2px' }} />
                  <textarea 
                    rows="3"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 12 Leselidze St, Tbilisi, Georgia"
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit', resize: 'none' }}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Google Maps Directions Link
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: '10px', padding: '0 12px', height: '40px', backgroundColor: '#ffffff' }}>
                  <LinkIcon className="ic" style={{ width: '16px', height: '16px', color: 'var(--text-muted)', marginRight: '8px' }} />
                  <input 
                    type="url" 
                    value={googleMapsLink} 
                    onChange={(e) => setGoogleMapsLink(e.target.value)}
                    placeholder="e.g. https://maps.google.com/?q=PizzaHut"
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  This URL will be linked on confirmation pages so customers can map their way to you.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default function ManagerPickupPage() {
  return (
    <Suspense fallback={
      <div className="fade-in" style={{ padding: '8px 0', maxWidth: '800px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    }>
      <PickupPageContent />
    </Suspense>
  );
}

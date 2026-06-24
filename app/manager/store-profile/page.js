'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Check,
  Share2
} from 'lucide-react';
import { useManager } from '../layout';

function StoreProfilePageContent() {
  const router = useRouter();
  const { tenantSettings, loading, refreshTenantSettings } = useManager();

  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  // Profile states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    if (tenantSettings) {
      setSettings(tenantSettings);
      setName(tenantSettings.name || '');
      setSlug(tenantSettings.slug || '');
      setLogoUrl(tenantSettings.logoUrl || '');
      setAddress(tenantSettings.address || '');
      setInstagram(tenantSettings.instagram || '');
      setTiktok(tenantSettings.tiktok || '');
      setWhatsappNumber(tenantSettings.whatsappNumber || tenantSettings.notifications?.whatsappNumber || '');
    }
  }, [tenantSettings]);

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 3 * 1024 * 1024) {
        alert('Image file size is too large. Please select an image under 3MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          setLogoUrl(uploadData.url);
          triggerToast('Logo updated! Click Save changes to apply.');
        } else {
          alert('Upload failed: ' + (uploadData.error || 'Unknown error'));
        }
      } catch (err) {
        console.error(err);
        alert('Failed to upload image');
      }
    };
    input.click();
  };

  const handleSaveSettings = async () => {
    if (saving) return;
    if (!name.trim()) {
      alert('Restaurant name cannot be empty');
      return;
    }
    setSaving(true);

    try {
      // Fetch latest tenant settings so we don't overwrite unrelated fields like opening hours
      const currentRes = await fetch('/api/tenant/settings');
      if (!currentRes.ok) throw new Error('Could not fetch settings');
      const currentData = await currentRes.json();

      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          name: name.trim(),
          logoUrl: logoUrl.trim(),
          address: address.trim(),
          instagram: instagram.trim(),
          tiktok: tiktok.trim(),
          whatsappNumber: whatsappNumber.trim()
        })
      });

      if (res.ok) {
        refreshTenantSettings();
        triggerToast('Store profile saved successfully!');
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
          <div className="sp-layout-grid" style={{ padding: 0 }}>
            <div className="skeleton" style={{ width: '160px', height: '160px', borderRadius: '18px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '100%', height: '60px', borderRadius: '8px' }} />
            </div>
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
          <h1 className="page-title">Store profile</h1>
          <p className="page-sub">Configure your storefront branding identity and physical location address.</p>
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

      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Identity Section */}
          <section>
            <div className="card">
              <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store className="ic" style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontWeight: 'bold' }}>Store identity</span>
              </div>

              <div className="sp-layout-grid">
                {/* Logo Col */}
                <div className="sp-logo-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                  <span className="label" style={{ marginBottom: 0, fontWeight: '700', fontSize: '0.8rem' }}>Logo</span>
                  {logoUrl.trim() ? (
                    <img 
                      src={logoUrl.trim()} 
                      alt="Store logo" 
                      onClick={handleLogoUpload}
                      style={{ width: '160px', height: '160px', borderRadius: '18px', objectFit: 'cover', border: '1px solid var(--line-2)', cursor: 'pointer' }} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallbackEl = document.getElementById('logo-fallback');
                        if (fallbackEl) fallbackEl.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    id="logo-fallback" 
                    className="logo-placeholder" 
                    onClick={handleLogoUpload}
                    style={{ 
                      width: '160px', 
                      height: '160px', 
                      borderRadius: '18px', 
                      border: '1.5px dashed var(--line-strong)', 
                      display: logoUrl.trim() ? 'none' : 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--surface-2)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Click to Upload
                  </div>
                  <p className="sp-logo-hint" style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4', maxWidth: '160px' }}>
                    PNG, JPG or SVG format. Click card to upload branding logo.
                  </p>
                </div>

                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Restaurant Name</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Pizza Hut"
                      style={{ height: '40px', borderRadius: '10px' }}
                    />
                  </div>

                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Store Slug (URL Identifier)</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={slug} 
                      disabled 
                      style={{ height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-2)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                    />
                  </div>

                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location / Physical Address</label>
                    <textarea 
                      rows="3"
                      className="input"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 12 Leselidze St, Tbilisi"
                      style={{ height: 'auto', borderRadius: '10px', padding: '10px', resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Links Section */}
          <section>
            <div className="card">
              <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 className="ic" style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontWeight: 'bold' }}>Social media links</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp Number (for storefront chat)</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={whatsappNumber} 
                    onChange={(e) => setWhatsappNumber(e.target.value)} 
                    placeholder="e.g. 96170123456"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Include country code without + or spaces (e.g. 96170123456).
                  </p>
                </div>

                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instagram Username</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={instagram} 
                    onChange={(e) => setInstagram(e.target.value)} 
                    placeholder="e.g. dine.labs"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                </div>

                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>TikTok Username</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={tiktok} 
                    onChange={(e) => setTiktok(e.target.value)} 
                    placeholder="e.g. dinelabs_official"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default function StoreProfilePage() {
  return (
    <Suspense fallback={
      <div className="fade-in" style={{ padding: '8px 0', maxWidth: '800px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div className="sp-layout-grid" style={{ padding: 0 }}>
            <div className="skeleton" style={{ width: '160px', height: '160px', borderRadius: '18px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '100%', height: '60px', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </div>
    }>
      <StoreProfilePageContent />
    </Suspense>
  );
}

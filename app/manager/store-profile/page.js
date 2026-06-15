'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Check,
  Save,
  Languages,
  Info,
  MapPin,
  DollarSign
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية · Arabic', flag: '🇱🇧' },
  { code: 'ru', label: 'Русский · Russian', flag: '🇷🇺' },
  { code: 'es', label: 'Español · Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'Français · French', flag: '🇫🇷' },
];

function StoreProfilePageContent() {
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [address, setAddress] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [activeLanguages, setActiveLanguages] = useState(['en']);

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
        setName(data.name || '');
        setSlug(data.slug || '');
        setLogoUrl(data.logoUrl || '');
        setBaseCurrency(data.baseCurrency || 'USD');
        setAddress(data.address || '');
        setDefaultLanguage(data.defaultLanguage || 'en');
        setActiveLanguages(data.languages || ['en']);
      }
    } catch (err) {
      console.error('Error fetching profile settings', err);
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

  const handleLanguageToggle = (code) => {
    // Cannot disable the default language
    if (code === defaultLanguage) return;

    if (activeLanguages.includes(code)) {
      setActiveLanguages(prev => prev.filter(lang => lang !== code));
    } else {
      setActiveLanguages(prev => [...prev, code]);
    }
  };

  const handleDefaultLanguageChange = (code) => {
    setDefaultLanguage(code);
    // Ensure the default language is always active
    if (!activeLanguages.includes(code)) {
      setActiveLanguages(prev => [...prev, code]);
    }
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
          baseCurrency,
          address: address.trim(),
          defaultLanguage,
          languages: activeLanguages
        })
      });

      if (res.ok) {
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h3 className="mut3">Loading store profile settings...</h3>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Store profile</h1>
          <p className="page-sub">Configure your storefront branding, language translations, currency, and physical address.</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        
        {/* Main profile form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Identity Section */}
          <section>
            <div className="card">
              <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store className="ic" style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontWeight: 'bold' }}>Store identity</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '28px', padding: '22px' }}>
                {/* Logo Col */}
                <div className="sp-logo-col" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
                  <span className="label" style={{ marginBottom: 0, fontWeight: '700', fontSize: '0.8rem' }}>Logo</span>
                  {logoUrl.trim() ? (
                    <img 
                      src={logoUrl.trim()} 
                      alt="Store logo" 
                      style={{ width: '160px', height: '160px', borderRadius: '18px', objectFit: 'cover', border: '1px solid var(--line-2)' }} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        document.getElementById('logo-fallback').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    id="logo-fallback" 
                    className="logo-placeholder" 
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
                      fontWeight: '600'
                    }}
                  >
                    No Logo Selected
                  </div>
                  <p className="sp-logo-hint" style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4', maxWidth: '160px' }}>
                    PNG, JPG or SVG format. Appears on your storefront header, checkout receipts and invoice pdfs.
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
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Slug is your unique subdomain prefix and cannot be changed.
                    </p>
                  </div>

                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logo Image URL</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={logoUrl} 
                      onChange={(e) => setLogoUrl(e.target.value)} 
                      placeholder="e.g. https://domain.com/assets/logo.png"
                      style={{ height: '40px', borderRadius: '10px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Languages Section */}
          <section>
            <div className="card">
              <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Languages className="ic" style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontWeight: 'bold' }}>Storefront languages</span>
              </div>

              {/* Main default language */}
              <div style={{ padding: '22px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>Main language</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    The default storefront language. Used when a visitor's browser has no preferred match.
                  </p>
                </div>

                <div className="lang-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {SUPPORTED_LANGUAGES.map(lang => {
                    const isDefault = defaultLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleDefaultLanguageChange(lang.code)}
                        className={`lang-chip ${isDefault ? 'main' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '11px',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: isDefault ? '1px solid var(--ink)' : '1px solid var(--line-2)',
                          backgroundColor: isDefault ? 'var(--ink)' : '#ffffff',
                          color: isDefault ? '#ffffff' : 'var(--ink)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '600' }}>{lang.label.split(' · ')[0]}</span>
                          <span style={{ fontSize: '11.5px', color: isDefault ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>{lang.label.split(' · ')[1] || ''}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Translation Languages */}
              <div style={{ padding: '22px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>Translated into</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Customers can switch to any of these from the storefront language picker.
                  </p>
                </div>

                <div className="lang-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {SUPPORTED_LANGUAGES.map(lang => {
                    const isActive = activeLanguages.includes(lang.code);
                    const isDefault = defaultLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageToggle(lang.code)}
                        disabled={isDefault}
                        className={`lang-chip ${isActive ? 'on' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '11px',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: isActive ? '1px solid var(--ink)' : '1px solid var(--line-2)',
                          backgroundColor: isActive ? 'var(--surface-2)' : '#ffffff',
                          color: 'var(--ink)',
                          cursor: isDefault ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          textAlign: 'left',
                          opacity: isDefault ? 0.6 : 1
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '600' }}>{lang.label.split(' · ')[0]}</span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {isDefault ? 'Default Language' : isActive ? 'Active Translation' : 'Not Translated'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right column helper details card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign className="ic" style={{ width: '16px', height: '16px' }} />
              <span>General settings</span>
            </h4>
            
            <div className="field" style={{ marginBottom: '16px' }}>
              <label className="label" style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Base Currency
              </label>
              <select 
                className="select"
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                style={{ height: '38px', borderRadius: '8px' }}
              >
                <option value="USD">USD ($)</option>
                <option value="LBP">LBP (ل.ل)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div className="field">
              <label className="label" style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Store Location / Address
              </label>
              <div style={{ display: 'flex', alignItems: 'flex-start', border: '1px solid var(--line-2)', borderRadius: '10px', padding: '8px 10px', backgroundColor: '#ffffff' }}>
                <MapPin className="ic" style={{ width: '16px', height: '16px', color: 'var(--text-muted)', marginRight: '6px', marginTop: '2px' }} />
                <textarea 
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 12 Leselidze St, Tbilisi"
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', fontFamily: 'inherit', resize: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', backgroundColor: 'var(--surface-2)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Info className="ic" style={{ width: '16px', height: '16px', color: 'var(--text-muted)', marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>Arabic Translation Note:</strong> Menu item titles and modifiers are translated automatically via translation API integrations when products and categories are saved.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function RefactoredStoreProfilePage() {
  return (
    <Suspense fallback={<h3>Loading store profile settings...</h3>}>
      <StoreProfilePageContent />
    </Suspense>
  );
}

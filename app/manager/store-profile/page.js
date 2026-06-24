'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Check,
  Share2,
  Globe,
  Phone
} from 'lucide-react';
import { useManager } from '../layout';
import { WORLD_LANGUAGES, WORLD_COUNTRIES, WORLD_CURRENCIES } from '../../../lib/constants';

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
  
  // Custom states added for prototype alignment
  const [country, setCountry] = useState('Lebanon');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [selectedLanguages, setSelectedLanguages] = useState(['en']);
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [managerLanguage, setManagerLanguage] = useState('en');
  
  // Expanded Social links states
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [xLink, setXLink] = useState('');
  const [youtube, setYoutube] = useState('');

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
      
      setCountry(tenantSettings.country || 'Lebanon');
      setBaseCurrency(tenantSettings.baseCurrency || 'USD');
      setSelectedLanguages(tenantSettings.languages || ['en']);
      setDefaultLanguage(tenantSettings.defaultLanguage || 'en');
      setManagerLanguage(tenantSettings.managerLanguage || 'en');
      
      setWebsite(tenantSettings.website || '');
      setFacebook(tenantSettings.facebook || '');
      setXLink(tenantSettings.x || '');
      setYoutube(tenantSettings.youtube || '');
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
          country: country,
          baseCurrency: baseCurrency,
          languages: selectedLanguages,
          defaultLanguage: defaultLanguage,
          managerLanguage: managerLanguage,
          website: website.trim(),
          facebook: facebook.trim(),
          x: xLink.trim(),
          youtube: youtube.trim(),
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

  const CORE_LANGUAGES = ['en', 'ar', 'ka', 'ru', 'es', 'fr', 'de', 'it'];
  const maxLangs = settings.tier === 1 ? 1 : settings.tier === 2 ? 3 : 8;

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Store profile</h1>
          <p className="page-sub">Configure your storefront branding identity, language localization, location address, and socials.</p>
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

                  {/* Country Selection */}
                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Country</label>
                    <select
                      className="input"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{ height: '40px', borderRadius: '10px' }}
                    >
                      {WORLD_COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Base Currency Selection */}
                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Base Currency</label>
                    <select
                      className="input"
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                      style={{ height: '40px', borderRadius: '10px' }}
                    >
                      {Object.keys(WORLD_CURRENCIES).map(code => (
                        <option key={code} value={code}>
                          {code} ({WORLD_CURRENCIES[code].sym}) — {WORLD_CURRENCIES[code].name}
                        </option>
                      ))}
                    </select>
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

          {/* Localization Section */}
          <section>
            <div className="card">
              <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe className="ic" style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontWeight: 'bold' }}>Localisation &amp; Languages</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Storefront Enabled Languages Checklist */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Storefront Enabled Languages</label>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Your subscription tier (Tier {settings.tier}) allows choosing up to {maxLangs} storefront language(s).
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                    {CORE_LANGUAGES.map(langCode => {
                      const isChecked = selectedLanguages.includes(langCode);
                      const isDefault = langCode === defaultLanguage;
                      return (
                        <div 
                          key={langCode} 
                          onClick={() => {
                            if (isDefault) {
                              alert('You cannot disable the default language.');
                              return;
                            }
                            if (isChecked) {
                              setSelectedLanguages(selectedLanguages.filter(l => l !== langCode));
                            } else {
                              if (selectedLanguages.length >= maxLangs) {
                                alert(`Your current subscription tier limits you to a maximum of ${maxLangs} storefront language(s).`);
                                return;
                              }
                              setSelectedLanguages([...selectedLanguages, langCode]);
                            }
                          }}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: isChecked ? '2px solid var(--pos)' : '1px solid var(--line)',
                            backgroundColor: isChecked ? 'var(--pos-bg)' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{WORLD_LANGUAGES[langCode]?.flag}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isChecked ? 'var(--pos)' : 'var(--text-main)' }}>
                            {WORLD_LANGUAGES[langCode]?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Default Storefront Language Selection */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Default Language (Storefront Home)</label>
                  <select
                    className="input"
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    style={{ height: '40px', borderRadius: '10px' }}
                  >
                    {selectedLanguages.map(langCode => (
                      <option key={langCode} value={langCode}>
                        {WORLD_LANGUAGES[langCode]?.flag} {WORLD_LANGUAGES[langCode]?.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Manager Dashboard Language Grid Selection */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Manager Portal Language</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                    {CORE_LANGUAGES.map(langCode => {
                      const isSelected = managerLanguage === langCode;
                      return (
                        <div 
                          key={langCode} 
                          onClick={() => setManagerLanguage(langCode)}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid var(--brand-red)' : '1px solid var(--line)',
                            backgroundColor: isSelected ? 'var(--bg-secondary)' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{WORLD_LANGUAGES[langCode]?.flag}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isSelected ? 'var(--brand-red)' : 'var(--text-main)' }}>
                            {WORLD_LANGUAGES[langCode]?.label}
                          </span>
                        </div>
                      );
                    })}
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
                <span style={{ fontWeight: 'bold' }}>Social media &amp; links</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Website Link */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe style={{ width: '15px', height: '15px' }} /> Website URL
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    placeholder="e.g. www.myrestaurant.com"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                </div>

                {/* Facebook Link */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-brands fa-facebook" style={{ width: '15px', fontSize: '14px' }}></i> Facebook URL
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={facebook} 
                    onChange={(e) => setFacebook(e.target.value)} 
                    placeholder="e.g. facebook.com/myrestaurant"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                </div>

                {/* X / Twitter Link */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-brands fa-x-twitter" style={{ width: '15px', fontSize: '14px' }}></i> X (Twitter) Username
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={xLink} 
                    onChange={(e) => setXLink(e.target.value)} 
                    placeholder="e.g. myrestaurant_x"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                </div>

                {/* YouTube Link */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-brands fa-youtube" style={{ width: '15px', fontSize: '14px' }}></i> YouTube Channel URL
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={youtube} 
                    onChange={(e) => setYoutube(e.target.value)} 
                    placeholder="e.g. youtube.com/c/myrestaurant"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone style={{ width: '15px', height: '15px' }} /> WhatsApp Number (for storefront chat)
                  </label>
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

                {/* Instagram Username */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-brands fa-instagram" style={{ width: '15px', fontSize: '14px' }}></i> Instagram Username
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={instagram} 
                    onChange={(e) => setInstagram(e.target.value)} 
                    placeholder="e.g. dine.labs"
                    style={{ height: '40px', borderRadius: '10px' }}
                  />
                </div>

                {/* TikTok Username */}
                <div className="field">
                  <label className="label" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-brands fa-tiktok" style={{ width: '15px', fontSize: '14px' }}></i> TikTok Username
                  </label>
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

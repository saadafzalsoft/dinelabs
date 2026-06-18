'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../../manager/manager.css';
import '../../super.css';
import SuperSidebar from '../../SuperSidebar';
import {
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Menu,
  LifeBuoy,
  Store,
  ArrowLeft,
  Save,
  Check,
  Trash2,
  Plus,
  Globe,
  DollarSign,
  AlertCircle,
  Clock
} from 'lucide-react';

const LANGUAGES = {
  en: { label: 'English', flag: '🇬🇧' },
  ar: { label: 'العربية · Arabic', flag: '🇱🇧' },
  ru: { label: 'Русский · Russian', flag: '🇷🇺' },
  es: { label: 'Español · Spanish', flag: '🇪🇸' },
  fr: { label: 'Français · French', flag: '🇫🇷' },
};

export default function RestaurantConfigPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Restaurant details states
  const [tenant, setTenant] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [tier, setTier] = useState(1);
  const [status, setStatus] = useState('active');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [languages, setLanguages] = useState(['en', 'ar']);
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [dineIn, setDineIn] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [delivery, setDelivery] = useState(true);
  const [dineInWait, setDineInWait] = useState(15);
  const [pickupWait, setPickupWait] = useState(20);
  const [deliveryWait, setDeliveryWait] = useState(40);
  const [assignedEmail, setAssignedEmail] = useState(true);
  const [assignedWhatsapp, setAssignedWhatsapp] = useState(false);
  const [assignedTelegram, setAssignedTelegram] = useState(false);
  const [ledger, setLedger] = useState([]);

  // Add Ledger Entry Form states
  const [ledgerDesc, setLedgerDesc] = useState('');
  const [ledgerAmount, setLedgerAmount] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('Paid');

  const fetchTenantDetails = async () => {
    try {
      const res = await fetch(`/api/super/tenants/${id}`);
      if (res.ok) {
        const data = await res.json();
        const t = data.tenant;
        setTenant(t);
        setName(t.name);
        setSlug(t.slug);
        setLogoUrl(t.logoUrl || '');
        setTier(t.tier || 1);
        setStatus(t.status || 'active');
        setBaseCurrency(t.baseCurrency || 'USD');
        setLanguages(t.languages || ['en', 'ar']);
        setDefaultLanguage(t.defaultLanguage || 'en');
        setDineIn(t.enabledModes?.dineIn ?? true);
        setPickup(t.enabledModes?.pickup ?? true);
        setDelivery(t.enabledModes?.delivery ?? true);
        setDineInWait(t.waitTimes?.dineIn ?? 15);
        setPickupWait(t.waitTimes?.pickup ?? 20);
        setDeliveryWait(t.waitTimes?.delivery ?? 40);
        setAssignedEmail(t.assignedNotifications?.email ?? true);
        setAssignedWhatsapp(t.assignedNotifications?.whatsapp ?? false);
        setAssignedTelegram(t.assignedNotifications?.telegram ?? false);
        setLedger(t.ledger || []);
      } else {
        alert('Restaurant details not found');
        router.push('/super/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching restaurant details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTenantDetails();
    }
  }, [id]);

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleLogoUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 3 * 1024 * 1024) {
        alert('Image file size is too large. Please select an image under 3MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result); // Base64 DataURL
        triggerToast('Logo updated! Click Save configurations to apply.');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    if (savingSettings) return;

    setSavingSettings(true);
    try {
      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          tier: parseInt(tier),
          baseCurrency,
          languages,
          defaultLanguage,
          enabledModes: { dineIn, pickup, delivery },
          waitTimes: { dineIn: parseInt(dineInWait), pickup: parseInt(pickupWait), delivery: parseInt(deliveryWait) },
          assignedNotifications: { email: assignedEmail, whatsapp: assignedWhatsapp, telegram: assignedTelegram },
          status,
          ledger,
          logoUrl: logoUrl.trim()
        })
      });

      if (res.ok) {
        triggerToast('Configurations saved successfully!');
        fetchTenantDetails();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed saving configurations');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving configurations');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleLang = (code) => {
    if (languages.includes(code)) {
      if (languages.length === 1) return; // Must have at least one language
      setLanguages(languages.filter(l => l !== code));
    } else {
      setLanguages([...languages, code]);
    }
  };

  const handleAddLedgerEntry = (e) => {
    e.preventDefault();
    if (!ledgerDesc.trim() || !ledgerAmount) return;

    const newEntry = {
      date: new Date().toISOString(),
      description: ledgerDesc.trim(),
      amount: parseFloat(ledgerAmount),
      status: ledgerStatus
    };

    setLedger([...ledger, newEntry]);
    setLedgerDesc('');
    setLedgerAmount('');
    setLedgerStatus('Paid');
  };

  const handleDeleteLedgerEntry = (idx) => {
    setLedger(ledger.filter((_, i) => i !== idx));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/super');
    } catch (e) {
      console.error(e);
    }
  };

  const formatPrice = (amount) => {
    return '$' + parseFloat(amount).toFixed(2);
  };

  if (loading) {
    return (
      <div className="layout" style={{ fontFamily: 'var(--font)' }}>
        {/* Sidebar Skeleton */}
        <aside className="sidebar" style={{ top: '0', borderRight: '1px solid var(--line)' }}>
          <div className="brand" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '34px', height: '34px', borderRadius: '9px' }} />
            <div>
              <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: '50px', height: '10px', borderRadius: '3px' }} />
            </div>
          </div>
        </aside>
        
        {/* Main Column Skeleton */}
        <div className="main-col">
          <header className="topbar" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '180px', height: '24px', borderRadius: '6px' }} />
          </header>
          <main className="content" style={{ opacity: 0.5 }}>
            <div style={{ marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '240px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '400px', height: '16px', borderRadius: '4px' }} />
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '12px' }} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* Mobile sidebar scrim */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,10,0.3)',
            backdropFilter: 'blur(1.5px)',
            zIndex: 90,
            display: 'block'
          }}
        />
      )}

      {/* Sidebar navigation */}
      <SuperSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content container */}
      <div className="main-col">
        <header className="topbar">
          <button 
            className="menu-toggle icon-btn" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            <Menu className="ic" />
          </button>
          
          <div className="crumb">
            <ShieldCheck style={{ width: '15px', height: '15px' }} />
            <span>Super Operator</span>
            <span style={{ color: 'var(--line-strong)' }}>/</span>
            <span onClick={() => router.push('/super/dashboard')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Directory</span>
            <span style={{ color: 'var(--line-strong)' }}>/</span>
            <b>Configure Restaurant</b>
          </div>

          <div className="topbar-spacer"></div>

          <button
            onClick={() => router.push('/super/dashboard')}
            className="btn btn-outline btn-sm"
            style={{ height: '40px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft className="ic" />
            <span>Back to directory</span>
          </button>
        </header>

        <main className="content">
          <div className="page-head">
            <div>
              <h1 className="page-title">{name} Configuration</h1>
              <p className="page-sub">Restaurant parameters, billing ledgers, storefront languages, and fulfillment overrides.</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleSaveSettings}
              disabled={savingSettings}
            >
              <Save className="ic" />
              <span>{savingSettings ? 'Saving...' : 'Save configurations'}</span>
            </button>
          </div>

          <div className="dash-grid" style={{ alignItems: 'start', gap: '24px' }}>
            {/* Left Column: configs forms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Card 1: Identities & Subscription Status */}
              <section className="card" style={{ padding: '24px' }}>
                <div className="card-title" style={{ marginBottom: '16px', fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store className="ic" style={{ color: 'var(--ink-2)' }} />
                  <span>Identities & Subscription</span>
                </div>

                <div className="super-identity-grid">
                  {/* Base64 Logo card */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span className="label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Restaurant Logo</span>
                    {logoUrl.trim() ? (
                      <img 
                        src={logoUrl.trim()} 
                        alt="Restaurant logo" 
                        onClick={handleLogoUploadClick}
                        style={{ width: '130px', height: '130px', borderRadius: '14px', objectFit: 'cover', border: '1px solid var(--line-2)', cursor: 'pointer' }}
                      />
                    ) : (
                      <div 
                        onClick={handleLogoUploadClick}
                        style={{ width: '130px', height: '130px', borderRadius: '14px', border: '1.5px dashed var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', padding: '8px' }}
                      >
                        Click to Upload
                      </div>
                    )}
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Click card to upload base64 image logo.</span>
                  </div>

                  {/* Form parameters */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="field">
                      <label className="label">Restaurant name</label>
                      <input 
                        type="text"
                        className="input"
                        value={name}
                        disabled
                        style={{ backgroundColor: 'var(--surface-2)', cursor: 'not-allowed', color: 'var(--text-muted)', height: '38px', borderRadius: '8px' }}
                      />
                    </div>

                    <div className="field">
                      <label className="label">Ecosystem Slug URL</label>
                      <input 
                        type="text"
                        className="input"
                        value={slug}
                        disabled
                        style={{ backgroundColor: 'var(--surface-2)', cursor: 'not-allowed', color: 'var(--text-muted)', height: '38px', borderRadius: '8px' }}
                      />
                    </div>

                    <div className="field">
                      <label className="label">Subscription Tier</label>
                      <select 
                        className="select"
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                        style={{ height: '38px', borderRadius: '8px', fontSize: '0.82rem' }}
                      >
                        <option value="1">Tier 1 (Standard)</option>
                        <option value="2">Tier 2 (Pro)</option>
                        <option value="3">Tier 3 (Hospitality)</option>
                      </select>
                    </div>

                    <div className="field">
                      <label className="label">Ecosystem status</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => setStatus('active')}
                          className={`btn ${status === 'active' ? 'btn-primary' : 'btn-outline'}`}
                          style={{ flex: 1, height: '36px', justifyContent: 'center', fontSize: '0.8rem' }}
                        >
                          🟢 Active
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus('suspended')}
                          className={`btn ${status === 'suspended' ? 'btn-danger' : 'btn-outline'}`}
                          style={{ flex: 1, height: '36px', justifyContent: 'center', fontSize: '0.8rem' }}
                        >
                          🔴 Suspended
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Card 2: Localization Settings */}
              <section className="card" style={{ padding: '24px' }}>
                <div className="card-title" style={{ marginBottom: '16px', fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe className="ic" style={{ color: 'var(--ink-2)' }} />
                  <span>Currency & Localization</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="field">
                    <label className="label">Base Currency</label>
                    <select 
                      className="select"
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                      style={{ height: '38px', borderRadius: '8px', fontSize: '0.82rem' }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="LBP">LBP (ل.ل)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Storefront Languages</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      {[
                        { code: 'en', name: 'English 🇬🇧' },
                        { code: 'ar', name: 'Arabic 🇱🇧' },
                        { code: 'ru', name: 'Russian 🇷🇺' },
                        { code: 'es', name: 'Spanish 🇪🇸' },
                        { code: 'fr', name: 'French 🇫🇷' }
                      ].map(lang => (
                        <label key={lang.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                          <input 
                            type="checkbox"
                            checked={languages.includes(lang.code)}
                            onChange={() => handleToggleLang(lang.code)}
                          />
                          <span>{lang.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Default Language</label>
                    <select 
                      className="select"
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                      style={{ height: '38px', borderRadius: '8px', fontSize: '0.82rem' }}
                    >
                      {languages.map(code => (
                        <option key={code} value={code}>
                          {LANGUAGES[code]?.label || code.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Card 3: Fulfillment & Wait times */}
              <section className="card" style={{ padding: '24px' }}>
                <div className="card-title" style={{ marginBottom: '16px', fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock className="ic" style={{ color: 'var(--ink-2)' }} />
                  <span>Fulfillment & Preparation Times</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Dine-in Table Setup */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input 
                        type="checkbox" 
                        id="dineinCheck"
                        checked={dineIn} 
                        onChange={(e) => setDineIn(e.target.checked)} 
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor="dineinCheck" style={{ fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>🍽️ Dine-in Table Ordering</label>
                    </div>
                    {dineIn && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Wait:</span>
                        <input 
                          type="number"
                          className="input"
                          value={dineInWait}
                          onChange={(e) => setDineInWait(e.target.value)}
                          style={{ width: '60px', height: '30px', padding: '0 6px', textAlign: 'center', fontSize: '12px', borderRadius: '6px' }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>min</span>
                      </div>
                    )}
                  </div>

                  {/* Pickup Setup */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input 
                        type="checkbox" 
                        id="pickupCheck"
                        checked={pickup} 
                        onChange={(e) => setPickup(e.target.checked)} 
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor="pickupCheck" style={{ fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>🛍️ Customer Pick-up Setup</label>
                    </div>
                    {pickup && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Wait:</span>
                        <input 
                          type="number"
                          className="input"
                          value={pickupWait}
                          onChange={(e) => setPickupWait(e.target.value)}
                          style={{ width: '60px', height: '30px', padding: '0 6px', textAlign: 'center', fontSize: '12px', borderRadius: '6px' }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>min</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Setup */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input 
                        type="checkbox" 
                        id="deliveryCheck"
                        checked={delivery} 
                        onChange={(e) => setDelivery(e.target.checked)} 
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor="deliveryCheck" style={{ fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>🛵 Home Delivery Setup</label>
                    </div>
                    {delivery && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Transit:</span>
                        <input 
                          type="number"
                          className="input"
                          value={deliveryWait}
                          onChange={(e) => setDeliveryWait(e.target.value)}
                          style={{ width: '60px', height: '30px', padding: '0 6px', textAlign: 'center', fontSize: '12px', borderRadius: '6px' }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>min</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Card 4: Notification Channels */}
              <section className="card" style={{ padding: '24px' }}>
                <div className="card-title" style={{ marginBottom: '16px', fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LifeBuoy className="ic" style={{ color: 'var(--ink-2)' }} />
                  <span>Notification Channels</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer' }}>
                    <input type="checkbox" checked={assignedEmail} onChange={(e) => setAssignedEmail(e.target.checked)} style={{ width: '15px', height: '15px' }} />
                    <span>📧 Email Notifications</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer' }}>
                    <input type="checkbox" checked={assignedWhatsapp} onChange={(e) => setAssignedWhatsapp(e.target.checked)} style={{ width: '15px', height: '15px' }} />
                    <span>💬 WhatsApp Notifications</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer' }}>
                    <input type="checkbox" checked={assignedTelegram} onChange={(e) => setAssignedTelegram(e.target.checked)} style={{ width: '15px', height: '15px' }} />
                    <span>🤖 Telegram Bot Notifications</span>
                  </label>
                </div>
              </section>
            </div>

            {/* Right Column: Invoices & Billing Ledger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <section className="card" style={{ padding: '24px' }}>
                <div className="card-title" style={{ marginBottom: '16px', fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign className="ic" style={{ color: 'var(--ink-2)' }} />
                  <span>Billing Ledger & Invoices</span>
                </div>

                <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', border: '1px solid var(--line-2)', borderRadius: '12px' }}>
                  {ledger.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                      No entries in this ledger yet.
                    </div>
                  ) : (
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>Details</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th style={{ width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledger.map((entry, idx) => (
                          <tr key={idx}>
                            <td>
                              <div style={{ fontWeight: '700', fontSize: '0.82rem' }}>{entry.description}</div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--ink-3)' }}>
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                            </td>
                            <td style={{ fontWeight: 'bold', fontSize: '0.82rem' }}>
                              {formatPrice(entry.amount)}
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '8px',
                                fontSize: '0.68rem',
                                fontWeight: 'bold',
                                backgroundColor: entry.status === 'Paid' ? '#d1fae5' : entry.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                                color: entry.status === 'Paid' ? '#10b981' : entry.status === 'Pending' ? '#d97706' : '#ef4444'
                              }}>
                                {entry.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                type="button"
                                onClick={() => handleDeleteLedgerEntry(idx)}
                                style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', padding: '4px' }}
                              >
                                <Trash2 style={{ width: '14px', height: '14px' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '12px' }}>Add Ledger Entry</h3>
                <form onSubmit={handleAddLedgerEntry} style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--surface-2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                  <div className="field">
                    <label className="label">Entry Description</label>
                    <input 
                      type="text"
                      className="input"
                      placeholder="e.g. Platform Monthly Subscription"
                      value={ledgerDesc}
                      onChange={(e) => setLedgerDesc(e.target.value)}
                      required
                      style={{ height: '36px', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div className="super-ledger-form-grid">
                    <div className="field">
                      <label className="label">Amount (USD)</label>
                      <input 
                        type="number"
                        className="input"
                        placeholder="199"
                        value={ledgerAmount}
                        onChange={(e) => setLedgerAmount(e.target.value)}
                        required
                        style={{ height: '36px', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div className="field">
                      <label className="label">Payment Status</label>
                      <select
                        className="select"
                        value={ledgerStatus}
                        onChange={(e) => setLedgerStatus(e.target.value)}
                        style={{ height: '36px', fontSize: '0.8rem' }}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-outline btn-block"
                    style={{ height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}
                  >
                    <Plus className="ic" style={{ width: '14px', height: '14px' }} />
                    <span>Add Entry</span>
                  </button>
                </form>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', fontSize: '0.72rem', color: '#b45309' }}>
                  <AlertCircle className="ic" style={{ flexShrink: 0 }} />
                  <span>You must click "Save configurations" at the top right to commit ledger changes permanently.</span>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

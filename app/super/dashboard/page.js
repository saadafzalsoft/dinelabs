'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../manager/manager.css';
import {
  LayoutDashboard,
  ReceiptText,
  Layers,
  UtensilsCrossed,
  PlusCircle,
  Clock,
  Bike,
  Armchair,
  ShoppingBag,
  Settings,
  Bell,
  ExternalLink,
  LifeBuoy,
  LogOut,
  Menu,
  ChevronDown,
  Check,
  ChevronsUpDown,
  Store,
  Plus,
  Eye,
  Trash2,
  Save,
  ShieldCheck,
  X,
  DollarSign
} from 'lucide-react';

const LANGUAGES = {
  en: { label: 'English', flag: '🇬🇧' },
  ar: { label: 'العربية · Arabic', flag: '🇱🇧' },
  ru: { label: 'Русский · Russian', flag: '🇷🇺' },
  es: { label: 'Español · Spanish', flag: '🇪🇸' },
  fr: { label: 'Français · French', flag: '🇫🇷' },
};

export default function SuperDashboardPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, platformRevenue: 0, activeCount: 0, suspendedCount: 0 });
  const [loading, setLoading] = useState(true);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // New Client Form states
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [tier, setTier] = useState(1);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [languages, setLanguages] = useState(['en', 'ar']);
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [dineIn, setDineIn] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [delivery, setDelivery] = useState(true);
  const [assignedEmail, setAssignedEmail] = useState(true);
  const [assignedWhatsapp, setAssignedWhatsapp] = useState(false);
  const [assignedTelegram, setAssignedTelegram] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal states
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editTier, setEditTier] = useState(1);
  const [editBaseCurrency, setEditBaseCurrency] = useState('USD');
  const [editLanguages, setEditLanguages] = useState([]);
  const [editDefaultLanguage, setEditDefaultLanguage] = useState('en');
  const [editDineIn, setEditDineIn] = useState(true);
  const [editPickup, setEditPickup] = useState(true);
  const [editDelivery, setEditDelivery] = useState(true);
  const [editAssignedEmail, setEditAssignedEmail] = useState(true);
  const [editAssignedWhatsapp, setEditAssignedWhatsapp] = useState(false);
  const [editAssignedTelegram, setEditAssignedTelegram] = useState(false);
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [editLedger, setEditLedger] = useState([]);
  const [savingSettings, setSavingSettings] = useState(false);

  // Add Ledger Entry Form states
  const [ledgerDesc, setLedgerDesc] = useState('');
  const [ledgerAmount, setLedgerAmount] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('Paid');

  const fetchTenantsAndStats = async () => {
    try {
      const res = await fetch('/api/super/tenants');
      if (res.ok) {
        const data = await res.json();
        setTenants(data.tenants || []);
        setStats(data.stats || { totalOrders: 0, platformRevenue: 0, activeCount: 0, suspendedCount: 0 });
      }
    } catch (err) {
      console.error('Failed fetching super admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantsAndStats();
  }, []);

  // Onboard new tenant client
  const handleOnboardTenant = async (e) => {
    e.preventDefault();
    if (!slug || !name || !managerEmail || !managerPassword || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/super/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug.trim(),
          name: name.trim(),
          managerEmail: managerEmail.trim(),
          managerPassword,
          tier: parseInt(tier),
          baseCurrency,
          languages,
          defaultLanguage,
          enabledModes: { dineIn, pickup, delivery },
          assignedNotifications: { email: assignedEmail, whatsapp: assignedWhatsapp, telegram: assignedTelegram },
          logoUrl: logoUrl.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Restaurant onboarded successfully!');
        setSlug('');
        setName('');
        setManagerEmail('');
        setManagerPassword('');
        setTier(1);
        setBaseCurrency('USD');
        setLanguages(['en', 'ar']);
        setDefaultLanguage('en');
        setDineIn(true);
        setPickup(true);
        setDelivery(true);
        setAssignedEmail(true);
        setAssignedWhatsapp(false);
        setAssignedTelegram(false);
        setLogoUrl('');
        fetchTenantsAndStats();
      } else {
        alert(data.error || 'Failed onboarding restaurant');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Configurations Modal
  const openEditModal = (tenant) => {
    setSelectedTenant(tenant);
    setEditName(tenant.name);
    setEditSlug(tenant.slug);
    setEditTier(tenant.tier);
    setEditBaseCurrency(tenant.baseCurrency || 'USD');
    setEditLanguages(tenant.languages || ['en', 'ar']);
    setEditDefaultLanguage(tenant.defaultLanguage || 'en');
    setEditDineIn(tenant.enabledModes?.dineIn ?? true);
    setEditPickup(tenant.enabledModes?.pickup ?? true);
    setEditDelivery(tenant.enabledModes?.delivery ?? true);
    setEditAssignedEmail(tenant.assignedNotifications?.email ?? true);
    setEditAssignedWhatsapp(tenant.assignedNotifications?.whatsapp ?? false);
    setEditAssignedTelegram(tenant.assignedNotifications?.telegram ?? false);
    setEditLogoUrl(tenant.logoUrl || '');
    setEditStatus(tenant.status || 'active');
    setEditLedger(tenant.ledger || []);
    setLedgerDesc('');
    setLedgerAmount('');
    setLedgerStatus('Paid');
  };

  // Save updated tenant settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!selectedTenant || savingSettings) return;

    setSavingSettings(true);
    try {
      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTenant._id,
          tier: parseInt(editTier),
          baseCurrency: editBaseCurrency,
          languages: editLanguages,
          defaultLanguage: editDefaultLanguage,
          enabledModes: { dineIn: editDineIn, pickup: editPickup, delivery: editDelivery },
          assignedNotifications: { email: editAssignedEmail, whatsapp: editAssignedWhatsapp, telegram: editAssignedTelegram },
          status: editStatus,
          ledger: editLedger,
          logoUrl: editLogoUrl.trim()
        })
      });

      if (res.ok) {
        alert('Restaurant configurations saved successfully!');
        setSelectedTenant(null);
        fetchTenantsAndStats();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed saving restaurant configurations');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Toggle Language checked state
  const handleToggleLang = (code, isEdit = false) => {
    const list = isEdit ? editLanguages : languages;
    const setter = isEdit ? setEditLanguages : setLanguages;
    
    if (list.includes(code)) {
      if (list.length === 1) return; // Must have at least one language
      setter(list.filter(l => l !== code));
    } else {
      setter([...list, code]);
    }
  };

  // Add ledger entry locally to the active edit state
  const handleAddLedgerEntry = (e) => {
    e.preventDefault();
    if (!ledgerDesc.trim() || !ledgerAmount) return;

    const newEntry = {
      date: new Date().toISOString(),
      description: ledgerDesc.trim(),
      amount: parseFloat(ledgerAmount),
      status: ledgerStatus
    };

    const updatedLedger = [...editLedger, newEntry];
    setEditLedger(updatedLedger);
    setLedgerDesc('');
    setLedgerAmount('');
    setLedgerStatus('Paid');
  };

  // Delete ledger entry locally
  const handleDeleteLedgerEntry = (idx) => {
    const updated = editLedger.filter((_, i) => i !== idx);
    setEditLedger(updated);
  };

  // Enter Masquerading mode
  const handleMasquerade = async (tenant) => {
    try {
      const res = await fetch('/api/super/masquerade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug: tenant.slug })
      });

      if (res.ok) {
        router.push('/manager/dashboard');
      } else {
        alert('Failed entering masquerade session');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/super');
    } catch (e) {
      console.error(e);
    }
  };

  // Price formatter helper
  const formatPrice = (amount) => {
    return '$' + parseFloat(amount).toFixed(2);
  };

  return (
    <div className="layout">
      {/* Sidebar navigation */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">DineLabs</div>
            <div className="brand-sub">SUPER COMMAND</div>
          </div>
        </div>
        
        <div className="nav">
          <div className="nav-group">
            <div className="nav-label">COMMAND CENTER</div>
            <button className="nav-item active" style={{ border: 'none', width: '100%', textAlign: 'left', background: 'transparent' }}>
              <LayoutDashboard className="ic" />
              <span>Ecosystem Insights</span>
            </button>
          </div>
        </div>

        <div className="nav-foot" style={{ marginTop: 'auto' }}>
          <div className="user-chip" onClick={handleLogout} title="Click to Sign out" style={{ cursor: 'pointer' }}>
            <div className="avatar">
              <ShieldCheck style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="user-meta">
              <div className="user-name">Super Operator</div>
              <div className="user-sub" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Sign out</div>
            </div>
            <LogOut className="ic" style={{ width: '16px', height: '16px', color: 'var(--ink-3)', marginLeft: 'auto' }} />
          </div>
        </div>
      </aside>

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
            <b>Dashboard Overview</b>
          </div>

          <div className="topbar-spacer"></div>

          {/* Help Action */}
          <button
            onClick={() => alert("Super Admin operates this command cockpit directly.")}
            className="btn btn-outline btn-sm"
            style={{ height: '40px' }}
          >
            <LifeBuoy className="ic" />
            <span>Ecosystem Help</span>
          </button>
        </header>

        <main className="content">
          <div style={{ padding: '8px 0' }}>
            
            {/* Title / Description */}
            <div style={{ marginBottom: '24px' }}>
              <h2 className="page-title">
                Ecosystem Command Center
              </h2>
              <p className="page-sub">
                Onboard new restaurants, inspect client health indicators, and adjust subscriber tier settings.
              </p>
            </div>

            {/* Metrics KPI Cards Grid */}
            <div className="kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Restaurants</span>
                  <Store style={{ width: '16px', height: '16px', color: 'var(--ink-2)' }} />
                </div>
                <div className="kpi-val" style={{ marginTop: '4px' }}>{tenants.length}</div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Clients</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                </div>
                <div className="kpi-val" style={{ marginTop: '4px', color: '#10b981' }}>{stats.activeCount}</div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suspended Accounts</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                </div>
                <div className="kpi-val" style={{ marginTop: '4px', color: '#ef4444' }}>{stats.suspendedCount}</div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</span>
                  <ReceiptText style={{ width: '16px', height: '16px', color: 'var(--ink-2)' }} />
                </div>
                <div className="kpi-val" style={{ marginTop: '4px' }}>{stats.totalOrders}</div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ecosystem Volume</span>
                  <DollarSign style={{ width: '16px', height: '16px', color: 'var(--ink-2)' }} />
                </div>
                <div className="kpi-val" style={{ marginTop: '4px', color: 'var(--ink)' }}>{formatPrice(stats.platformRevenue)}</div>
              </div>
            </div>

            {/* Split layout: Restaurant list table on left, onboard new restaurant card on right */}
            <div className="dash-grid" style={{ alignItems: 'start' }}>
              
              {/* Restaurant List table container */}
              <div className="card" style={{ padding: '24px', minWidth: 0 }}>
                <div className="card-title" style={{ marginBottom: '20px' }}>
                  <Store className="ic" />
                  <span>Restaurants Ecosystem Directory</span>
                </div>

                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '12px' }} />
                    ))}
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>Restaurant &amp; Slug</th>
                          <th>Tier &amp; Modes</th>
                          <th>Sales Analytics</th>
                          <th>Health Indicators</th>
                          <th>Billing Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenants.map(tenant => (
                          <tr key={tenant._id}>
                            <td>
                              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{tenant.name}</div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: '500' }}>
                                dinelabs.co/<b>{tenant.slug}</b>
                                <div style={{ opacity: 0.8 }}>{tenant.managerEmail}</div>
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: '600' }}>Tier {tenant.tier}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)', marginTop: '2px' }}>
                                {tenant.enabledModes?.dineIn ? '🍽️ Dine ' : ''}
                                {tenant.enabledModes?.pickup ? '🛍️ Pick ' : ''}
                                {tenant.enabledModes?.delivery ? '🛵 Del' : ''}
                                {!tenant.enabledModes?.dineIn && !tenant.enabledModes?.pickup && !tenant.enabledModes?.delivery ? 'Browse-Only' : ''}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: '700' }}>Orders: {tenant.totalOrders || 0}</div>
                              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>
                                {formatPrice(tenant.totalRevenue || 0)}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.72rem', color: 'var(--ink-2)' }}>
                                Last order: <strong style={{ color: 'var(--ink)' }}>
                                  {tenant.lastOrderTime !== 'No orders yet' ? new Date(tenant.lastOrderTime).toLocaleDateString() : 'No orders'}
                                </strong>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: tenant.errorRate !== '0.0%' ? '#ef4444' : 'var(--ink-3)' }}>
                                Errors: <strong>{tenant.errorRate || '0.0%'}</strong>
                              </span>
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                backgroundColor: tenant.status === 'active' ? '#pos-bg' : '#fee2e2',
                                color: tenant.status === 'active' ? 'var(--pos)' : '#ef4444'
                              }}>
                                {tenant.status === 'active' ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => openEditModal(tenant)}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '0.72rem', height: '32px' }}
                                >
                                  <Settings className="ic" style={{ width: '12px', height: '12px' }} />
                                  <span>Configure</span>
                                </button>
                                <button
                                  onClick={() => handleMasquerade(tenant)}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.72rem', height: '32px' }}
                                  title={`Impersonate manager dashboard of ${tenant.name}`}
                                >
                                  <Eye className="ic" style={{ width: '12px', height: '12px' }} />
                                  <span>Impersonate</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Onboard new restaurant form card */}
              <div className="card" style={{ padding: '24px' }}>
                <div className="card-title" style={{ marginBottom: '16px' }}>
                  <PlusCircle className="ic" />
                  <span>Onboard New Client</span>
                </div>
                
                <form onSubmit={handleOnboardTenant}>
                  <div className="field">
                    <label className="label">Restaurant Name</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. Pizza Palace"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">Subdirectory Slug</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. pizza-palace"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">Logo URL</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. /assets/logos/pizzapalace.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Initial Manager Email</label>
                    <input 
                      type="email" 
                      className="input" 
                      placeholder="manager@pizzapalace.com"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">Temporary Password</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="manager123"
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">Assigned Tier</label>
                    <select 
                      className="select"
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      style={{ height: '36px', fontSize: '0.8rem' }}
                    >
                      <option value="1">Tier 1 (Standard)</option>
                      <option value="2">Tier 2 (Pro)</option>
                      <option value="3">Tier 3 (Hospitality)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Base Currency</label>
                    <select 
                      className="select"
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                      style={{ height: '36px', fontSize: '0.8rem' }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="LBP">LBP (ل.ل)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  {/* Languages Checklist */}
                  <div className="field">
                    <label className="label">Allowed Storefront Languages</label>
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
                            onChange={() => handleToggleLang(lang.code, false)}
                          />
                          <span>{lang.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Default Language selector */}
                  <div className="field">
                    <label className="label">Default Language</label>
                    <select 
                      className="select"
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                      style={{ height: '36px', fontSize: '0.8rem' }}
                    >
                      {languages.map(code => (
                        <option key={code} value={code}>
                          {LANGUAGES[code]?.label || code.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ordering modes selectors */}
                  <div className="field" style={{ marginBottom: '24px' }}>
                    <label className="label">Enabled Ordering Modes</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                        <input type="checkbox" checked={dineIn} onChange={(e) => setDineIn(e.target.checked)} />
                        <span>🍽️ Dine-in Table Ordering</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                        <input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} />
                        <span>🛍️ Customer Pick-up Setup</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                        <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} />
                        <span>🛵 Home Delivery Setup</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Assigned Notification Channels */}
                  <div className="field" style={{ marginBottom: '24px' }}>
                    <label className="label">Assigned Notification Channels</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                        <input type="checkbox" checked={assignedEmail} onChange={(e) => setAssignedEmail(e.target.checked)} />
                        <span>📧 Email Notifications</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                        <input type="checkbox" checked={assignedWhatsapp} onChange={(e) => setAssignedWhatsapp(e.target.checked)} />
                        <span>💬 WhatsApp Notifications</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                        <input type="checkbox" checked={assignedTelegram} onChange={(e) => setAssignedTelegram(e.target.checked)} />
                        <span>🤖 Telegram Bot Notifications</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block btn-lg"
                    disabled={submitting}
                  >
                    <Plus className="ic" />
                    <span>{submitting ? 'Onboarding...' : 'Onboard Restaurant'}</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Slide-in Configuration Side Drawer */}
      <div className={`drawer-scrim ${selectedTenant ? 'open' : ''}`} onClick={() => setSelectedTenant(null)} />
      <aside className={`drawer ${selectedTenant ? 'open' : ''}`} style={{ width: '800px', maxWidth: '90%', right: selectedTenant ? '0' : '-850px' }}>
        {selectedTenant && (
          <>
            <div className="rail-head">
              <div>
                <h3 className="drawer-title" style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>Configure {selectedTenant.name}</h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px' }}>
                  Ecosystem Slug: dinelabs.co/<strong>{selectedTenant.slug}</strong>
                </div>
              </div>
              <button className="x" onClick={() => setSelectedTenant(null)}>
                <X className="ic" />
              </button>
            </div>

            <div className="rail-body" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '24px' }}>
              
              {/* Left Column: settings configs */}
              <form onSubmit={handleSaveSettings}>
                <div className="field">
                  <label className="label">Subscription Tier</label>
                  <select 
                    className="select"
                    value={editTier}
                    onChange={(e) => setEditTier(e.target.value)}
                    style={{ height: '36px', fontSize: '0.8rem' }}
                  >
                    <option value="1">Tier 1 (Standard)</option>
                    <option value="2">Tier 2 (Pro)</option>
                    <option value="3">Tier 3 (Hospitality)</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Base Currency</label>
                  <select 
                    className="select"
                    value={editBaseCurrency}
                    onChange={(e) => setEditBaseCurrency(e.target.value)}
                    style={{ height: '36px', fontSize: '0.8rem' }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LBP">LBP (ل.ل)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Subscription Status</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setEditStatus('active')}
                      className={`btn ${editStatus === 'active' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1, height: '38px', justifyContent: 'center' }}
                    >
                      🟢 Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus('suspended')}
                      className={`btn ${editStatus === 'suspended' ? 'btn-danger' : 'btn-outline'}`}
                      style={{ flex: 1, height: '38px', justifyContent: 'center' }}
                    >
                      🔴 Suspended
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Logo URL</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. /assets/logos/pizzapalace.png"
                    value={editLogoUrl}
                    onChange={(e) => setEditLogoUrl(e.target.value)}
                    style={{ height: '36px', fontSize: '0.8rem' }}
                  />
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
                          checked={editLanguages.includes(lang.code)}
                          onChange={() => handleToggleLang(lang.code, true)}
                        />
                        <span>{lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label className="label">Default Storefront Language</label>
                  <select 
                    className="select"
                    value={editDefaultLanguage}
                    onChange={(e) => setEditDefaultLanguage(e.target.value)}
                    style={{ height: '36px', fontSize: '0.8rem' }}
                  >
                    {editLanguages.map(code => (
                      <option key={code} value={code}>
                        {LANGUAGES[code]?.label || code.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field" style={{ marginBottom: '24px' }}>
                  <label className="label">Enabled Ordering Modes</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editDineIn} onChange={(e) => setEditDineIn(e.target.checked)} />
                      <span>🍽️ Dine-in Table Ordering</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editPickup} onChange={(e) => setEditPickup(e.target.checked)} />
                      <span>🛍️ Customer Pick-up Setup</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editDelivery} onChange={(e) => setEditDelivery(e.target.checked)} />
                      <span>🛵 Home Delivery Setup</span>
                    </label>
                  </div>
                </div>

                {/* Assigned Notification Channels */}
                <div className="field" style={{ marginBottom: '24px' }}>
                  <label className="label">Assigned Notification Channels</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editAssignedEmail} onChange={(e) => setEditAssignedEmail(e.target.checked)} />
                      <span>📧 Email Notifications</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editAssignedWhatsapp} onChange={(e) => setEditAssignedWhatsapp(e.target.checked)} />
                      <span>💬 WhatsApp Notifications</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editAssignedTelegram} onChange={(e) => setEditAssignedTelegram(e.target.checked)} />
                      <span>🤖 Telegram Bot Notifications</span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block btn-lg"
                  disabled={savingSettings}
                >
                  <Save className="ic" />
                  <span>{savingSettings ? 'Saving Configurations...' : 'Save configs'}</span>
                </button>
              </form>

              {/* Right Column: Billing Ledger */}
              <div style={{ borderLeft: '1px solid var(--line-2)', paddingLeft: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: '800', borderBottom: '1px solid var(--line-2)', paddingBottom: '6px', marginBottom: '16px' }}>
                  Billing Ledger
                </h4>

                <div className="table-container" style={{ maxHeight: '220px', overflowY: 'auto', margin: '0 0 20px 0', border: '1px solid var(--line-2)' }}>
                  {editLedger.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', fontSize: '0.75rem', color: 'var(--ink-3)' }}>
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
                        {editLedger.map((entry, idx) => (
                          <tr key={idx}>
                            <td>
                              <div style={{ fontWeight: '700' }}>{entry.description}</div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--ink-3)' }}>
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                              {formatPrice(entry.amount)}
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                fontSize: '0.62rem',
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
                                style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                <Trash2 style={{ width: '12px', height: '12px' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', fontWeight: '800', marginBottom: '10px' }}>
                  Add Ledger Entry
                </h5>
                <form onSubmit={handleAddLedgerEntry} style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '16px', border: '1px solid var(--line-2)' }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label className="label" style={{ fontSize: '0.68rem' }}>Description</label>
                    <input 
                      type="text"
                      className="input"
                      placeholder="e.g. Monthly Fee (June 2026)"
                      value={ledgerDesc}
                      onChange={(e) => setLedgerDesc(e.target.value)}
                      required
                      style={{ height: '34px', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="field" style={{ margin: 0 }}>
                      <label className="label" style={{ fontSize: '0.68rem' }}>Amount (USD)</label>
                      <input 
                        type="number"
                        className="input"
                        placeholder="199"
                        value={ledgerAmount}
                        onChange={(e) => setLedgerAmount(e.target.value)}
                        required
                        style={{ height: '34px', fontSize: '0.75rem' }}
                      />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label className="label" style={{ fontSize: '0.68rem' }}>Status</label>
                      <select
                        className="select"
                        value={ledgerStatus}
                        onChange={(e) => setLedgerStatus(e.target.value)}
                        style={{ height: '34px', fontSize: '0.75rem' }}
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
                    style={{ fontSize: '0.72rem', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus className="ic" style={{ width: '12px', height: '12px' }} />
                    <span>Add Entry</span>
                  </button>
                </form>

                <div style={{ marginTop: '12px', padding: '8px 10px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', fontSize: '0.68rem', color: '#b91c1c' }}>
                  <strong>Note:</strong> You must save the restaurant configuration at the bottom-left to write modifications permanently.
                </div>
              </div>

            </div>
          </>
        )}
      </aside>
    </div>
  );
}

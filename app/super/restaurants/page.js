'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ShieldCheck, LifeBuoy, Store, Search, Plus, UserCheck, Play, Pause, Trash2, ChevronRight, X, Sparkles, RefreshCw, Layers, CreditCard, Gift, Calendar, Globe, Check } from 'lucide-react';
import '../../manager/manager.css';
import '../super.css';
import SuperSidebar from '../SuperSidebar';
import { useSuperAdmin } from '../layout';

import { WORLD_LANGUAGES, WORLD_COUNTRIES, WORLD_CURRENCIES } from '../../../lib/constants';
import SearchSelect from '../../components/SearchSelect';

export default function SuperRestaurantsPage() {
  const router = useRouter();
  const { tenants, tiers, loading, refreshData } = useSuperAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTenantForDelete, setSelectedTenantForDelete] = useState(null);

  // Create Form State
  const [cName, setCName] = useState('');
  const [cSlug, setCSlug] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPass, setCPass] = useState('');
  const [cTier, setCTier] = useState('');
  const [cCycle, setCCycle] = useState('monthly');
  const [cTrial, setCTrial] = useState(false);
  const [cAmount, setCAmount] = useState('');
  const [cStart, setCStart] = useState(new Date().toISOString().slice(0, 10));
  const [cCountry, setCCountry] = useState('Georgia');
  const [cCur, setCCur] = useState('GEL');
  const [cLanguages, setCLanguages] = useState(['en']);
  const [cDefaultLanguage, setCDefaultLanguage] = useState('en');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tiers && tiers.length > 0) {
      if (!cTier) setCTier(tiers[0]._id);
      if (!cAmount) setCAmount(tiers[0].price);
    }
  }, [tiers, cTier, cAmount]);

  // Password Generator
  const genPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$';
    let p = '';
    for (let i = 0; i < 10; i++) {
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return p;
  };

  const triggerPasswordGen = () => {
    setCPass(genPassword());
  };

  // Auto-fill slug and initial values on name change
  const handleNameChange = (val) => {
    setCName(val);
    const slugVal = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setCSlug(slugVal);
  };

  const handleTierSelect = (selectedTierId) => {
    setCTier(selectedTierId);
    const selected = tiers.find(t => t._id === selectedTierId);
    if (selected) {
      setCAmount(cCycle === 'annual' ? (selected.priceAnnual || selected.price * 10) : selected.price);
      // Auto adjust languages to match limits if needed
      const maxLangs = selected.caps?.maxTranslations || 1;
      const pool = selected.caps?.langs || ['en'];
      const currentValid = cLanguages.filter(l => pool.includes(l));
      
      let newLangs = currentValid;
      if (newLangs.length === 0) {
        newLangs = [pool[0]];
      } else if (newLangs.length > maxLangs) {
        newLangs = newLangs.slice(0, maxLangs);
      }
      setCLanguages(newLangs);
      if (!newLangs.includes(cDefaultLanguage)) {
        setCDefaultLanguage(newLangs[0]);
      }
    }
  };

  const handleCycleSelect = (cycle) => {
    setCCycle(cycle);
    const selected = tiers.find(t => t._id === cTier);
    if (selected) {
      setCAmount(cycle === 'annual' ? (selected.priceAnnual || selected.price * 10) : selected.price);
    }
  };

  const handleLanguageToggle = (code, pool, maxLangs) => {
    if (cLanguages.includes(code)) {
      if (cLanguages.length === 1) return;
      const updated = cLanguages.filter(l => l !== code);
      setCLanguages(updated);
      if (cDefaultLanguage === code) {
        setCDefaultLanguage(updated[0]);
      }
    } else {
      if (cLanguages.length >= maxLangs) {
        alert(`This tier allows a maximum of ${maxLangs} translation languages.`);
        return;
      }
      if (!pool.includes(code)) return;
      setCLanguages([...cLanguages, code]);
    }
  };

  // Onboard Store Submit
  const handleOnboardStore = async (e) => {
    e.preventDefault();
    if (!cName.trim() || !cSlug.trim() || !cEmail.trim() || !cPass.trim()) {
      alert('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Calculate renewal date
      const start = new Date(cStart);
      const daysToAdd = cTrial ? 14 : (cCycle === 'annual' ? 365 : 30);
      const renewalDate = new Date(start.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      const payload = {
        name: cName.trim(),
        slug: cSlug.trim(),
        managerEmail: cEmail.trim(),
        managerPassword: cPass,
        tier: cTier.replace('t', ''), // store numeric tier (e.g. 1, 2, 3)
        baseCurrency: cCur,
        country: cCountry,
        languages: cLanguages,
        defaultLanguage: cDefaultLanguage,
        enabledModes: {
          dineIn: true,
          pickup: true,
          delivery: true
        },
        assignedNotifications: {
          email: true,
          telegram: false
        },
        logoUrl: '',
        billing: {
          cycle: cCycle,
          amount: parseFloat(cAmount) || 0,
          start: cStart,
          renewal: renewalDate,
          trial: cTrial
        }
      };

      const res = await fetch('/api/super/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Restaurant environment onboarded successfully!');
        setCreateModalOpen(false);
        // Reset form fields
        setCName('');
        setCSlug('');
        setCEmail('');
        setCPass('');
        if (tiers.length > 0) {
          setCTier(tiers[0]._id);
          setCAmount(tiers[0].price);
        }
        setCCycle('monthly');
        setCTrial(false);
        refreshData();
      } else {
        alert(data.error || 'Failed onboarding restaurant client.');
      }
    } catch (err) {
      console.error(err);
      alert('Error onboarding client.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Suspend Status
  const handleToggleSuspend = async (tenant) => {
    const nextStatus = tenant.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tenant._id,
          status: nextStatus
        })
      });

      if (res.ok) {
        alert(`Restaurant is now ${nextStatus}!`);
        refreshData();
      } else {
        alert('Failed updating restaurant status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating restaurant status');
    }
  };

  // Delete Tenant Store
  const handleDeleteTenant = async () => {
    if (!selectedTenantForDelete) return;
    try {
      const res = await fetch(`/api/super/tenants/${selectedTenantForDelete._id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Restaurant environment successfully deleted.');
        setDeleteModalOpen(false);
        setSelectedTenantForDelete(null);
        refreshData();
      } else {
        alert('Failed deleting restaurant storefront');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting client');
    }
  };

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

  const getMinutesSinceLastOrder = (lastOrderTime) => {
    if (!lastOrderTime || lastOrderTime === 'No orders yet') return 99999;
    return Math.round((new Date() - new Date(lastOrderTime)) / 60000);
  };

  // Filter tenants array
  const getFilteredTenants = () => {
    return tenants.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesTier = tierFilter === 'all' || t.tier.toString() === tierFilter.replace('t', '');
      return matchesSearch && matchesStatus && matchesTier;
    });
  };

  // Helper formatting values
  const moneyStr = (n, cur = 'USD') => (WORLD_CURRENCIES[cur]?.sym || '$') + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyK = (n, cur = 'USD') => (WORLD_CURRENCIES[cur]?.sym || '$') + (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : Math.round(n).toLocaleString('en-US'));
  
  const getSelectedTierObject = () => {
    return tiers.find(t => t._id === cTier) || { caps: { maxTranslations: 1, langs: ['en'] } };
  };

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

      {/* Shared Sidebar */}
      <SuperSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Col */}
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
            <b>Stores Directory</b>
          </div>

          <div className="topbar-spacer"></div>

          <button 
            className="btn btn-accent btn-sm" 
            style={{ height: '40px' }}
            onClick={() => {
              setCreateModalOpen(true);
              setCPass(genPassword());
            }}
          >
            <Plus className="ic" />
            <span>New store</span>
          </button>
        </header>

        <main className="content">
          <div className="page-head">
            <div>
              <h1 className="page-title">Stores</h1>
              <p className="page-sub">Every tenant on the platform — status, tier and live health.</p>
            </div>
          </div>

          {/* Directory Toolbar */}
          <div className="toolbar">
            <div className="filter-search">
              <Search className="ic" style={{ width: '16px', height: '16px' }} />
              <input 
                id="search" 
                placeholder="Search stores…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off" 
              />
            </div>
            
            <div className="seg sm">
              <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
              <button className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>Active</button>
              <button className={statusFilter === 'suspended' ? 'active' : ''} onClick={() => setStatusFilter('suspended')}>Suspended</button>
            </div>

            <SearchSelect
              value={tierFilter}
              onChange={setTierFilter}
              options={[
                { value: 'all', label: 'All tiers' },
                ...tiers.map(t => ({ value: t._id, label: `${t.name} · ${t.tag}` }))
              ]}
              style={{ width: '180px' }}
            />

            <div style={{ flex: 1 }}></div>
            <span className="cl-count">
              {getFilteredTenants().length} of {tenants.length} stores
            </span>
          </div>

          {/* Directory Table Card */}
          <section className="card">
            {loading ? (
              <div style={{ padding: '40px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '54px', borderRadius: '10px', marginBottom: '12px' }} />
                ))}
              </div>
            ) : getFilteredTenants().length === 0 ? (
              <div className="empty">
                <Store className="ic" />
                <h4>No stores match</h4>
                <p>Try a different search or filter option.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl cl-table">
                  <thead>
                    <tr>
                      <th>Store</th>
                      <th>Tier</th>
                      <th>Status</th>
                      <th>Modes</th>
                      <th style={{ textAlign: 'right' }}>Orders</th>
                      <th style={{ textAlign: 'right' }}>Revenue</th>
                      <th>Last Order</th>
                      <th>Errors</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredTenants().map(c => {
                      const initials = c.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'S';
                      const isSuspended = c.status === 'suspended';
                      const lastOrderMin = getMinutesSinceLastOrder(c.lastOrderTime);
                      
                      let freshnessLabel = '—';
                      let freshnessClass = 'cold';
                      if (c.lastOrderTime && c.lastOrderTime !== 'No orders yet') {
                        freshnessClass = lastOrderMin > 120 ? 'cold' : '';
                        freshnessLabel = lastOrderMin < 60 
                          ? `${lastOrderMin}m ago` 
                          : lastOrderMin < 1440 
                            ? `${Math.round(lastOrderMin / 60)}h ago` 
                            : `${Math.round(lastOrderMin / 1440)}d ago`;
                      }

                      const errRateNum = parseFloat(c.errorRate || 0);
                      const errClass = isSuspended ? '' : (errRateNum >= 2.5 ? 'bad' : errRateNum >= 1.5 ? 'warn' : 'ok');

                      return (
                        <tr 
                          key={c._id}
                          className={isSuspended ? 'is-suspended' : ''}
                          onClick={() => router.push(`/super/restaurants/${c._id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div className="nm-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span className="cmono">{initials}</span>
                              <div style={{ minWidth: 0 }}>
                                <div className="cname">{c.name}</div>
                                <div className="cslug">dinelabs.co/<b>{c.slug}</b></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`tier t${c.tier || 1}`}>
                              Tier {c.tier || 1}
                            </span>
                          </td>
                          <td>
                            <span className={`stat ${c.status === 'active' ? 'active' : 'suspended'}`}>
                              <span className="dot"></span>
                              {c.status === 'active' ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td>
                            <span className="modes">
                              <span className={`mode-ic ${c.enabledModes?.delivery ? 'on' : ''}`} title="Delivery"><Store className="ic" style={{ width: '13px', height: '13px' }} /></span>
                              <span className={`mode-ic ${c.enabledModes?.pickup ? 'on' : ''}`} title="Pickup"><Store className="ic" style={{ width: '13px', height: '13px' }} /></span>
                              <span className={`mode-ic ${c.enabledModes?.dineIn ? 'on' : ''}`} title="Dine-in"><Store className="ic" style={{ width: '13px', height: '13px' }} /></span>
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="tnum" style={{ fontWeight: 800 }}>{isSuspended ? '—' : (c.totalOrders || 0)}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="tnum" style={{ fontWeight: 700 }}>{isSuspended ? '—' : moneyK(c.totalRevenue || 0, c.baseCurrency)}</span>
                          </td>
                          <td>
                            <span className={`fresh ${freshnessClass}`}>{freshnessLabel}</span>
                          </td>
                          <td>
                            <span className={`err ${errClass}`}>
                              {!isSuspended && <span className="dot"></span>}
                              {isSuspended ? '—' : `${errRateNum.toFixed(1)}%`}
                            </span>
                          </td>
                          <td>
                            <div 
                              className="row gap6" 
                              style={{ justifyContent: 'flex-end', display: 'flex', gap: '6px' }}
                              onClick={(e) => e.stopPropagation()} // block row redirection
                            >
                              {c.status === 'active' ? (
                                <>
                                  <button 
                                    className="act-btn accent" 
                                    title="Masquerade" 
                                    onClick={() => handleMasquerade(c)}
                                  >
                                    <UserCheck className="ic" style={{ width: '15px', height: '15px' }} />
                                  </button>
                                  <button 
                                    className="act-btn" 
                                    title="Suspend" 
                                    onClick={() => handleToggleSuspend(c)}
                                  >
                                    <Pause className="ic" style={{ width: '15px', height: '15px' }} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className="act-btn" 
                                    title="Reactivate" 
                                    onClick={() => handleToggleSuspend(c)}
                                  >
                                    <Play className="ic" style={{ width: '15px', height: '15px' }} />
                                  </button>
                                  <button 
                                    className="act-btn" 
                                    title="Delete store" 
                                    onClick={() => {
                                      setSelectedTenantForDelete(c);
                                      setDeleteModalOpen(true);
                                    }}
                                    style={{ color: 'var(--neg)', borderColor: '#f0c5c7' }}
                                  >
                                    <Trash2 className="ic" style={{ width: '15px', height: '15px' }} />
                                  </button>
                                </>
                              )}
                              <button 
                                className="act-btn" 
                                title="Open configs"
                                onClick={() => router.push(`/super/restaurants/${c._id}`)}
                              >
                                <ChevronRight className="ic" style={{ width: '15px', height: '15px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Onboarding Dialog Modal */}
      {createModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card is-form is-wide" style={{ flexDirection: 'column', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>
            <button className="modal-x" onClick={() => setCreateModalOpen(false)}>
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--accent)', display: 'grid', placeItems: 'center', color: '#fff', borderRadius: '12px' }}>
                <Store className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Create a new store</h3>
                <p>Provision a tenant environment, storefront, and Manager login.</p>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              <form onSubmit={handleOnboardStore}>
                
                {/* Section 1: Store */}
                <div className="form-sec">
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><Store style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Store Identity</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Public name & storefront URL</div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Store Name</label>
                    <input 
                      className="input" 
                      placeholder="e.g. Burger Palace"
                      value={cName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="field">
                    <label className="label">Storefront URL slug</label>
                    <div className="slug-field" style={{ display: 'flex', border: '1px solid var(--line-2)', borderRadius: '10px', overflow: 'hidden' }}>
                      <span className="pfx" style={{ padding: '8px 12px', background: 'var(--surface-2)', borderRight: '1px solid var(--line-2)', fontSize: '13px' }}>dinelabs.co/</span>
                      <input 
                        style={{ border: 'none', padding: '8px 12px', outline: 'none', flex: 1 }}
                        placeholder="burger-palace" 
                        value={cSlug}
                        onChange={(e) => setCSlug(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Manager credentials */}
                <div className="form-sec" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line-2)' }}>
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><ShieldCheck style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Manager Credentials</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Initial login for Dinelabs Manager console</div>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="label">Manager Email</label>
                      <input 
                        className="input" 
                        type="email" 
                        placeholder="owner@store.com"
                        value={cEmail}
                        onChange={(e) => setCEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="field">
                      <label className="label">Temporary Password</label>
                      <div className="pw-field" style={{ position: 'relative' }}>
                        <input 
                          className="input" 
                          value={cPass}
                          onChange={(e) => setCPass(e.target.value)}
                          required 
                        />
                        <button 
                          type="button" 
                          className="pw-gen"
                          onClick={triggerPasswordGen}
                          style={{ position: 'absolute', right: '6px', top: '6px', height: '30px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <RefreshCw style={{ width: '12px', height: '12px' }} />
                          <span>New</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Plan */}
                <div className="form-sec" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line-2)' }}>
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><Layers style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Subscription Plan</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Tier limits and mode switches</div>
                    </div>
                  </div>
                  <div className="tier-pick">
                    {tiers.map(t => (
                      <div 
                        key={t._id}
                        className={`tp ${cTier === t._id ? 'on' : ''}`}
                        onClick={() => handleTierSelect(t._id)}
                      >
                        <div className="tp-name">{t.name}</div>
                        <div className="tp-price">{moneyStr(t.price)}/mo · {t.tag}</div>
                        <div className="tp-feats">
                          {t.caps?.maxProducts === 0 ? 'Unlimited' : t.caps?.maxProducts} products · {t.caps?.maxTranslations} lang{t.caps?.maxTranslations > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Billing setup */}
                <div className="form-sec" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line-2)' }}>
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><CreditCard style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Billing Setup</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Subscription billing properties</div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Billing Cycle</label>
                    <div className="chip-grid">
                      <div className={`sel-chip radio ${cCycle === 'monthly' ? 'on' : ''}`} onClick={() => handleCycleSelect('monthly')}>Monthly</div>
                      <div className={`sel-chip radio ${cCycle === 'annual' ? 'on' : ''}`} onClick={() => handleCycleSelect('annual')}>Annual</div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Trial Mode</label>
                    <div className="chip-grid">
                      <div className={`sel-chip ${cTrial ? 'on' : ''}`} onClick={() => setCTrial(!cTrial)}>
                        <span className="chk"><Check className="ic" style={{ opacity: cTrial ? 1 : 0 }} /></span>
                        <span>14-day free trial</span>
                      </div>
                    </div>
                    <div className="card-note" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginTop: '6px' }}>
                      <Gift style={{ width: '13px', height: '13px' }} />
                      <span>Delays the first actual invoice charge by 14 calendar days.</span>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="label">Amount</label>
                      <div style={{ display: 'flex', border: '1px solid var(--line-2)', borderRadius: '10px', overflow: 'hidden', alignItems: 'center' }}>
                        <span style={{ padding: '8px 12px', background: 'var(--surface-2)', borderRight: '1px solid var(--line-2)', fontSize: '13px', color: 'var(--ink-2)', fontWeight: 'bold' }}>$</span>
                        <input 
                          type="number"
                          style={{ border: 'none', padding: '8px 12px', outline: 'none', flex: 1, background: 'transparent' }}
                          value={cAmount}
                          onChange={(e) => setCAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Start Date</label>
                      <input 
                        className="input" 
                        type="date"
                        value={cStart}
                        onChange={(e) => setCStart(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Locale parameters */}
                <div className="form-sec" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line-2)' }}>
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><Globe style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Locales & Languages</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Storefront country, base currency & default language</div>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="label">Country</label>
                      <SearchSelect
                        value={cCountry}
                        onChange={(val) => setCCountry(val)}
                        options={WORLD_COUNTRIES}
                        placeholder="Search & select country..."
                      />
                    </div>
                    <div className="field">
                      <label className="label">Base Currency</label>
                      <SearchSelect
                        value={cCur}
                        onChange={(val) => setCCur(val)}
                        options={Object.keys(WORLD_CURRENCIES).map(code => ({
                          value: code,
                          label: `${code} · ${WORLD_CURRENCIES[code].sym} ${WORLD_CURRENCIES[code].name}`,
                          subtitle: `${WORLD_CURRENCIES[code].name} (${WORLD_CURRENCIES[code].sym})`
                        }))}
                        placeholder="Search & select currency..."
                      />
                    </div>
                  </div>

                  {(() => {
                    const tierObj = getSelectedTierObject();
                    const maxLangs = tierObj.caps?.maxTranslations || 1;
                    const pool = tierObj.caps?.langs || ['en'];
                    return (
                      <>
                        <div className="field" style={{ marginTop: '12px' }}>
                          <label className="label">
                            Storefront Languages <span className="opt">— Choose up to {maxLangs} language(s) allowed by this tier</span>
                          </label>
                          <div className="chip-grid" style={{ marginBottom: '10px' }}>
                            {cLanguages.map(code => (
                              <div 
                                key={code}
                                className="sel-chip on"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '32px', padding: '0 10px', fontSize: '12.5px' }}
                              >
                                <span>{WORLD_LANGUAGES[code]?.flag || '🌐'} {WORLD_LANGUAGES[code]?.label || code.toUpperCase()}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (cLanguages.length === 1) return;
                                    const nextLangs = cLanguages.filter(l => l !== code);
                                    setCLanguages(nextLangs);
                                    if (cDefaultLanguage === code) {
                                      setCDefaultLanguage(nextLangs[0]);
                                    }
                                  }}
                                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--accent-2)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                  title="Remove"
                                  disabled={cLanguages.length === 1}
                                >
                                  <X className="ic" style={{ width: '13px', height: '13px' }} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {cLanguages.length < maxLangs && pool.filter(code => !cLanguages.includes(code)).length > 0 && (
                            <SearchSelect
                              options={pool
                                .filter(code => !cLanguages.includes(code))
                                .map(code => ({
                                  value: code,
                                  label: `${WORLD_LANGUAGES[code]?.flag || '🌐'} ${WORLD_LANGUAGES[code]?.label || code.toUpperCase()}`,
                                  subtitle: WORLD_LANGUAGES[code]?.code || code.toUpperCase()
                                }))}
                              onChange={(code) => {
                                if (cLanguages.length >= maxLangs) {
                                  alert(`This tier allows a maximum of ${maxLangs} translation languages.`);
                                  return;
                                }
                                setCLanguages([...cLanguages, code]);
                              }}
                              placeholder="Add a language..."
                            />
                          )}
                        </div>

                        <div className="field">
                          <label className="label">Default Language</label>
                          <div className="chip-grid">
                            {cLanguages.map(code => (
                              <div 
                                key={code}
                                className={`sel-chip radio ${cDefaultLanguage === code ? 'on' : ''}`}
                                onClick={() => setCDefaultLanguage(code)}
                              >
                                <span>{WORLD_LANGUAGES[code]?.flag || '🌐'} {WORLD_LANGUAGES[code]?.label || code.toUpperCase()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="modal-foot" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setCreateModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-accent" disabled={submitting}>
                    <span>{submitting ? 'Creating environment...' : 'Create store'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ maxWidth: '450px', padding: '24px' }}>
            <button className="modal-x" onClick={() => setDeleteModalOpen(false)}>
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--neg)', color: '#fff', display: 'grid', placeItems: 'center', borderRadius: '12px' }}>
                <Trash2 className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Delete {selectedTenantForDelete?.name}?</h3>
                <p>This permanently deletes the tenant storefront, catalog items, orders, and manager logins from the database.</p>
              </div>
            </div>
            
            <div className="modal-body" style={{ padding: '16px 0 8px', color: 'var(--neg)' }}>
              <div className="masq-warn" style={{ background: '#fef2f2', color: '#9b3b40', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <strong>⚠️ Warning:</strong> This operation is irreversible. All related store catalogs, modifier configurations, live configurations, and dashboard parameters will be destroyed.
              </div>
            </div>

            <div className="modal-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteTenant}>
                <Trash2 className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Delete environment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

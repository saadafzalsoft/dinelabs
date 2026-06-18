'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ShieldCheck, LifeBuoy, CreditCard, Banknote, Hourglass, AlertCircle, PlayCircle, Search, Calendar, ChevronRight, X, Check, ArrowRight } from 'lucide-react';
import '../../manager/manager.css';
import '../super.css';
import SuperSidebar from '../SuperSidebar';

const CURRENCIES = {
  USD: { sym: '$', name: 'US Dollar' },
  EUR: { sym: '€', name: 'Euro' },
  GBP: { sym: '£', name: 'British Pound' },
  GEL: { sym: '₾', name: 'Georgian Lari' },
  AED: { sym: 'د.إ', name: 'UAE Dirham' },
};

export default function SuperBillingPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');

  // Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [savingBilling, setSavingBilling] = useState(false);

  // Edit Subscription Form States
  const [bCycle, setBCycle] = useState('monthly');
  const [bAmount, setBAmount] = useState('');
  const [bStart, setBStart] = useState('');
  const [bRenewal, setBRenewal] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/super/tenants');
      const data = await res.json();
      setTenants(data.tenants || []);

      const tiersRes = await fetch('/api/super/tiers');
      const tiersData = await tiersRes.json();
      setTiers(tiersData.tiers || []);
    } catch (err) {
      console.error('Failed fetching billing dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return 0;
    const now = new Date();
    // Normalize dates to midnight
    const renewal = new Date(dateStr);
    now.setHours(0, 0, 0, 0);
    renewal.setHours(0, 0, 0, 0);
    return Math.round((renewal - now) / (24 * 60 * 60 * 1000));
  };

  const getBillingState = (c) => {
    if (c.status === 'suspended') {
      return { label: 'Paused', cls: 'paused', days: null, pending: 0, soon: false, overdue: false };
    }
    const days = getDaysUntil(c.billing?.renewal);
    const overdue = days < 0;
    const soon = days >= 0 && days <= 7;
    return {
      label: overdue ? 'Overdue' : soon ? 'Due soon' : 'Active',
      cls: overdue ? 'overdue' : soon ? 'soon' : 'ok',
      days,
      pending: c.billing?.amount || 0,
      soon,
      overdue
    };
  };

  const mrr = (c) => {
    const b = c.billing;
    if (!b) return 0;
    return b.cycle === 'annual' ? b.amount / 12 : b.amount;
  };

  // KPIs
  const activeTenants = tenants.filter(t => t.status === 'active');
  const totalMrr = activeTenants.reduce((sum, c) => sum + mrr(c), 0);
  
  const dueSoonTenants = activeTenants.filter(c => {
    const days = getDaysUntil(c.billing?.renewal);
    return days >= 0 && days <= 7;
  });
  const overdueTenants = activeTenants.filter(c => getDaysUntil(c.billing?.renewal) < 0);
  
  const pendingAmt = dueSoonTenants.reduce((sum, c) => sum + (c.billing?.amount || 0), 0) + 
                     overdueTenants.reduce((sum, c) => sum + (c.billing?.amount || 0), 0);

  const pausedCount = tenants.filter(t => t.status === 'suspended').length;

  const kpis = [
    { label: 'Monthly recurring revenue', icon: Banknote, val: totalMrr.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), foot: `across ${activeTenants.length} active stores`, cls: 'mut', accent: true },
    { label: 'Pending this week', icon: Hourglass, val: pendingAmt.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), foot: `${dueSoonTenants.length + overdueTenants.length} invoice(s) due`, cls: 'mut' },
    { label: 'Overdue', icon: AlertCircle, val: overdueTenants.length, foot: overdueTenants.length ? 'needs follow-up' : 'all current', cls: overdueTenants.length ? 'down' : 'mut' },
    { label: 'Paused subscriptions', icon: PlayCircle, val: pausedCount, foot: 'not billing', cls: 'mut' },
  ];

  // Sorting logic: overdue first, then due soon, then ok, then paused
  const getSortKey = (c) => {
    const b = getBillingState(c);
    if (b.cls === 'overdue') return [0, b.days];
    if (b.cls === 'soon') return [1, b.days];
    if (b.cls === 'ok') return [2, b.days];
    return [3, 9999]; // paused
  };

  const getFilteredTenants = () => {
    const list = tenants.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCycle = cycleFilter === 'all' || c.billing?.cycle === cycleFilter;
      
      const b = getBillingState(c);
      let matchesStatus = true;
      if (statusFilter === 'soon') {
        matchesStatus = b.cls === 'soon' || b.cls === 'overdue';
      } else if (statusFilter === 'overdue') {
        matchesStatus = b.cls === 'overdue';
      } else if (statusFilter === 'paused') {
        matchesStatus = b.cls === 'paused';
      }

      return matchesSearch && matchesCycle && matchesStatus;
    });

    // Sort list
    return list.sort((a, b) => {
      const ka = getSortKey(a);
      const kb = getSortKey(b);
      return ka[0] - kb[0] || ka[1] - kb[1];
    });
  };

  // Format date helper
  const fmtDate = (s) => {
    if (!s) return '—';
    const d = new Date(s + 'T00:00:00');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const tierPill = (tierId) => {
    const t = tiers.find(x => x._id === tierId || x.lv.toString() === tierId.toString() || x._id.replace('t','') === tierId.toString());
    if (!t) return `Tier ${tierId}`;
    return `${t.name} · ${t.tag}`;
  };

  // Edit Subscription Modal Trigger
  const triggerEditBilling = (tenant) => {
    setSelectedTenant(tenant);
    setBCycle(tenant.billing?.cycle || 'monthly');
    setBAmount(tenant.billing?.amount || 0);
    setBStart(tenant.billing?.start || new Date().toISOString().slice(0, 10));
    setBRenewal(tenant.billing?.renewal || new Date().toISOString().slice(0, 10));
    setEditModalOpen(true);
  };

  // Save Subscription details
  const handleSaveBilling = async (e) => {
    e.preventDefault();
    if (savingBilling || !selectedTenant) return;

    setSavingBilling(true);
    try {
      const updatedBilling = {
        cycle: bCycle,
        amount: parseFloat(bAmount) || 0,
        start: bStart,
        renewal: bRenewal,
        trial: selectedTenant.billing?.trial || false
      };

      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTenant._id,
          billing: updatedBilling
        })
      });

      if (res.ok) {
        alert('Subscription billing details successfully saved!');
        setEditModalOpen(false);
        fetchData();
      } else {
        alert('Failed saving subscription details');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating subscription');
    } finally {
      setSavingBilling(false);
    }
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

      {/* Main Column */}
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
            <b>Billing Overview</b>
          </div>

          <div className="topbar-spacer"></div>

          <button 
            className="btn btn-outline btn-sm" 
            style={{ height: '40px' }}
            onClick={() => router.push('/super/restaurants')}
          >
            <span>Stores Configuration</span>
            <ArrowRight className="ic" />
          </button>
        </header>

        <main className="content">
          <div className="page-head">
            <div>
              <h1 className="page-title">Billing</h1>
              <p className="page-sub">Every store's subscription, renewal date and what's due. Stores due soon rise to the top.</p>
            </div>
          </div>

          {/* KPIs */}
          <div className="kpis">
            {kpis.map((k, idx) => {
              const Icon = k.icon;
              return (
                <div key={idx} className={`card kpi ${k.accent ? 'accent' : ''}`}>
                  <div className="kpi-top">
                    <span className="kpi-label">{k.label}</span>
                    <span className="kpi-ic"><Icon className="ic" /></span>
                  </div>
                  <div className="kpi-val tnum">{k.val}</div>
                  <div className="kpi-foot mut">{k.foot}</div>
                </div>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="filter-search">
              <Search className="ic" style={{ width: '16px', height: '16px' }} />
              <input 
                placeholder="Search stores…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off" 
              />
            </div>
            
            <div className="seg sm">
              <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
              <button className={statusFilter === 'soon' ? 'active' : ''} onClick={() => setStatusFilter('soon')}>Due soon</button>
              <button className={statusFilter === 'overdue' ? 'active' : ''} onClick={() => setStatusFilter('overdue')}>Overdue</button>
              <button className={statusFilter === 'paused' ? 'active' : ''} onClick={() => setStatusFilter('paused')}>Paused</button>
            </div>

            <div className="seg sm">
              <button className={cycleFilter === 'all' ? 'active' : ''} onClick={() => setCycleFilter('all')}>All cycles</button>
              <button className={cycleFilter === 'monthly' ? 'active' : ''} onClick={() => setCycleFilter('monthly')}>Monthly</button>
              <button className={cycleFilter === 'annual' ? 'active' : ''} onClick={() => setCycleFilter('annual')}>Annual</button>
            </div>

            <div style={{ flex: 1 }}></div>
            <span className="cl-count">
              {getFilteredTenants().length} of {tenants.length} stores
            </span>
          </div>

          {/* Billing Table */}
          <section className="card">
            {loading ? (
              <div style={{ padding: '35px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '54px', borderRadius: '10px', marginBottom: '12px' }} />
                ))}
              </div>
            ) : getFilteredTenants().length === 0 ? (
              <div className="empty">
                <CreditCard className="ic" />
                <h4>Nothing here</h4>
                <p>No stores match this view or search.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl bill-table">
                  <thead>
                    <tr>
                      <th>Store</th>
                      <th>Plan</th>
                      <th>Cycle</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th>Start Date</th>
                      <th>Renewal Date</th>
                      <th style={{ textAlign: 'right' }}>Pending</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredTenants().map(c => {
                      const initials = c.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'S';
                      const b = getBillingState(c);
                      const isSuspended = c.status === 'suspended';

                      let dotColor = null;
                      if (b.cls === 'overdue') dotColor = 'var(--neg)';
                      else if (b.cls === 'soon') dotColor = 'var(--warn)';

                      return (
                        <tr 
                          key={c._id} 
                          className={b.cls === 'overdue' ? 'overdue-row' : b.cls === 'soon' ? 'flagged' : ''}
                          onClick={() => router.push(`/super/restaurants/${c._id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div className="nm-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {dotColor ? (
                                <span className="flag-dot" style={{ backgroundColor: dotColor, boxShadow: `0 0 0 3px ${dotColor === 'var(--neg)' ? 'var(--neg-bg)' : 'var(--warn-bg)'}` }} />
                              ) : (
                                <span style={{ width: '8px', flexShrink: 0 }} />
                              )}
                              <span className="cmono">{initials}</span>
                              <div style={{ minWidth: 0 }}>
                                <div className="cname">{c.name}</div>
                                <div className="cslug">dinelabs.co/<b>{c.slug}</b></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`tier t${c.tier || 1}`} style={{ display: 'inline-block' }}>
                              {tierPill(c.tier)}
                            </span>
                          </td>
                          <td>
                            <span className="cycle-tag" style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', border: '1px solid var(--line-2)' }}>
                              {c.billing?.cycle || 'monthly'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="tnum" style={{ fontWeight: 800 }}>
                              {moneyStr(c.billing?.amount || 0, c.baseCurrency)}
                            </span>
                            <div className="cslug" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                              /{c.billing?.cycle === 'annual' ? 'yr' : 'mo'}
                            </div>
                          </td>
                          <td>
                            <span className="fresh">{fmtDate(c.billing?.start)}</span>
                          </td>
                          <td>
                            <span className="fresh" style={{ color: isSuspended ? 'var(--ink-3)' : '' }}>
                              {isSuspended ? '—' : fmtDate(c.billing?.renewal)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="tnum" style={{ fontWeight: 700 }}>
                              {isSuspended ? '—' : moneyStr(b.pending, c.baseCurrency)}
                            </span>
                          </td>
                          <td>
                            {b.cls === 'paused' && <span className="due-pill paused">Paused</span>}
                            {b.cls === 'overdue' && <span className="due-pill overdue">Overdue {Math.abs(b.days)}d</span>}
                            {b.cls === 'soon' && <span className="due-pill soon">{b.days === 0 ? 'Due today' : `Due in ${b.days}d`}</span>}
                            {b.cls === 'ok' && <span className="due-pill ok">In {b.days}d</span>}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div 
                              className="row gap6" 
                              style={{ justifyContent: 'flex-end', display: 'flex' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                className="act-btn accent" 
                                title="Edit subscription"
                                onClick={() => triggerEditBilling(c)}
                              >
                                <Calendar className="ic" style={{ width: '15px', height: '15px' }} />
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

      {/* Edit Subscription Modal Overlay */}
      {editModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card is-form" style={{ maxWidth: '450px', padding: '24px' }}>
            <button className="modal-x" onClick={() => setEditModalOpen(false)}>
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', borderRadius: '12px' }}>
                <CreditCard className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Edit subscription</h3>
                <p>Modify billing cycle, renewal amount, and renewal deadlines for {selectedTenant?.name}.</p>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '16px 0' }}>
              <form onSubmit={handleSaveBilling}>
                <div className="field">
                  <label className="label">Billing Cycle</label>
                  <div className="chip-grid">
                    <div className={`sel-chip radio ${bCycle === 'monthly' ? 'on' : ''}`} onClick={() => setBCycle('monthly')}>Monthly</div>
                    <div className={`sel-chip radio ${bCycle === 'annual' ? 'on' : ''}`} onClick={() => setBCycle('annual')}>Annual</div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Renewal Amount (USD)</label>
                  <div className="input-affix" style={{ display: 'flex', border: '1px solid var(--line-2)', borderRadius: '10px', overflow: 'hidden' }}>
                    <span className="pfx" style={{ padding: '8px 12px', background: 'var(--surface-2)', borderRight: '1px solid var(--line-2)', fontSize: '13px' }}>$</span>
                    <input 
                      type="number"
                      style={{ border: 'none', padding: '8px 12px', outline: 'none', flex: 1 }}
                      value={bAmount}
                      onChange={(e) => setBAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Subscription Start Date</label>
                  <input 
                    className="input" 
                    type="date"
                    value={bStart}
                    onChange={(e) => setBStart(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label className="label">Next Renewal Date</label>
                  <input 
                    className="input" 
                    type="date"
                    value={bRenewal}
                    onChange={(e) => setBRenewal(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-accent" disabled={savingBilling}>
                    <span>{savingBilling ? 'Saving...' : 'Save subscription'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

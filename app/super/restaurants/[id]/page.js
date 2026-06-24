'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../../manager/manager.css';
import '../../super.css';
import SuperSidebar from '../../SuperSidebar';
import { useSuperAdmin } from '../../layout';
import {
  ArrowLeft,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  UserRoundCog,
  ReceiptText,
  Banknote,
  Clock,
  Activity,
  Layers,
  SlidersHorizontal,
  Bell,
  Mail,
  KeyRound,
  Copy,
  Globe,
  Coins,
  Calendar,
  CalendarCog,
  Info,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldAlert,
  Wand2,
  Plus,
  Star,
  Menu,
  MessageCircle,
  Send,
  Bike,
  ShoppingBag,
  Utensils,
  UtensilsCrossed
} from 'lucide-react';

import { WORLD_LANGUAGES, WORLD_COUNTRIES, WORLD_CURRENCIES } from '../../../../lib/constants';
import SearchSelect from '../../../components/SearchSelect';

const CORE_FEATURES = [
  { name: 'Live orders board', icon: ReceiptText },
  { name: 'Menu management', icon: UtensilsCrossed },
];

const genPassword = () => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ', b = 'abcdefghijkmnpqrstuvwxyz', n = '23456789', s = '!@#$';
  const pick = (p) => p[Math.floor(Math.random() * p.length)];
  let p = pick(a) + pick(b) + pick(b) + pick(b) + pick(n) + pick(n) + pick(s) + pick(b) + pick(n);
  return p.split('').sort(() => Math.random() - .5).join('');
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const iso = (d) => d.toISOString().slice(0, 10);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmtDate = (s) => {
  if (!s) return '—';
  const datePart = s.split('T')[0];
  const d = new Date(datePart + 'T00:00:00');
  if (isNaN(d.getTime())) return '—';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const freshLabel = (m) => {
  if (m == null || m >= 99999) return '—';
  return m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
};

export default function RestaurantDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { tiers, refreshData } = useSuperAdmin();

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState(null);

  // Tenant Data
  const [tenant, setTenant] = useState(null);

  // Managed States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [tier, setTier] = useState(1);
  const [status, setStatus] = useState('active');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [country, setCountry] = useState('Georgia');
  const [languages, setLanguages] = useState(['en', 'ka']);
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [enabledModes, setEnabledModes] = useState({ dineIn: true, pickup: true, delivery: true });
  const [assignedNotifications, setAssignedNotifications] = useState({ email: true, whatsapp: false, telegram: false });
  const [billing, setBilling] = useState({ cycle: 'monthly', amount: 29, start: '', renewal: '' });
  const [ledger, setLedger] = useState([]);
  const [managerPasswordPlain, setManagerPasswordPlain] = useState('');

  // Password toggle reveal
  const [pwShown, setPwShown] = useState(false);

  // Modals Visibility
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [masqModalOpen, setMasqModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);

  // Modal temporary values
  const [modalPassword, setModalPassword] = useState('');
  const [modalBillingCycle, setModalBillingCycle] = useState('monthly');
  const [modalBillingAmount, setModalBillingAmount] = useState(29);
  const [modalBillingStart, setModalBillingStart] = useState('');
  const [modalBillingRenewal, setModalBillingRenewal] = useState('');
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState('');

  const showToast = (message, icon = 'check') => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const renderOrderingModes = () => {
    const activeTierObj = tiers.find(t => t._id === 't' + tier) || tiers.find(t => t.id === 't' + tier) || tiers[0] || { caps: { modes: { delivery: 1, pickup: 1, dinein: 1 } } };
    const caps = activeTierObj.caps || { modes: { delivery: 1, pickup: 1, dinein: 1 } };
    
    const modesList = [
      { key: 'delivery', label: 'Delivery', icon: Bike, dbField: 'delivery', value: enabledModes.delivery, setter: (val) => setEnabledModes(prev => ({ ...prev, delivery: val })) },
      { key: 'pickup', label: 'Pick-up', icon: ShoppingBag, dbField: 'pickup', value: enabledModes.pickup, setter: (val) => setEnabledModes(prev => ({ ...prev, pickup: val })) },
      { key: 'dinein', label: 'Dine-in', icon: Utensils, dbField: 'dineIn', value: enabledModes.dineIn, setter: (val) => setEnabledModes(prev => ({ ...prev, dineIn: val })) },
    ];
    
    return (
      <div className="card-pad" style={{ paddingTop: '6px', paddingBottom: '8px' }}>
        {modesList.map(m => {
          const allowed = !!caps.modes?.[m.key];
          return (
            <div key={m.key} className="mode-row" style={{ opacity: allowed ? 1 : 0.55 }}>
              <span className="m-ic">
                <m.icon style={{ width: '18px', height: '18px' }} />
              </span>
              <div style={{ flex: 1 }}>
                <div className="m-name">{m.label}</div>
                <div className="m-sub">
                  {allowed ? (m.value ? 'Accepting orders' : 'Turned off') : `Not available on ${activeTierObj.name}`}
                </div>
              </div>
              {allowed ? (
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={m.value}
                    onChange={(e) => m.setter(e.target.checked)}
                  />
                  <span className="track"></span>
                </label>
              ) : (
                <Lock style={{ width: '16px', height: '16px', color: 'var(--ink-3)' }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderOrderChannels = () => {
    const activeTierObj = tiers.find(t => t._id === 't' + tier) || tiers.find(t => t.id === 't' + tier) || tiers[0] || { caps: { channels: { email: 1, whatsapp: 1, telegram: 1 } } };
    const caps = activeTierObj.caps || { channels: { email: 1, whatsapp: 1, telegram: 1 } };
    
    const channelsList = [
      { key: 'email', label: 'Email', icon: Mail, value: assignedNotifications.email, setter: (val) => setAssignedNotifications(prev => ({ ...prev, email: val })) },
      { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, value: assignedNotifications.whatsapp, setter: (val) => setAssignedNotifications(prev => ({ ...prev, whatsapp: val })) },
      { key: 'telegram', label: 'Telegram', icon: Send, value: assignedNotifications.telegram, setter: (val) => setAssignedNotifications(prev => ({ ...prev, telegram: val })) },
    ];
    
    return (
      <div className="card-pad" style={{ paddingTop: '6px', paddingBottom: '8px' }}>
        {channelsList.map(ch => {
          const allowed = !!caps.channels?.[ch.key];
          return (
            <div key={ch.key} className="mode-row" style={{ opacity: allowed ? 1 : 0.55 }}>
              <span className="m-ic">
                <ch.icon style={{ width: '18px', height: '18px' }} />
              </span>
              <div style={{ flex: 1 }}>
                <div className="m-name">{ch.label}</div>
                <div className="m-sub">
                  {allowed ? (ch.value ? 'Alerts on' : 'Turned off') : `Not available on ${activeTierObj.name}`}
                </div>
              </div>
              {allowed ? (
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={ch.value}
                    onChange={(e) => ch.setter(e.target.checked)}
                  />
                  <span className="track"></span>
                </label>
              ) : (
                <Lock style={{ width: '16px', height: '16px', color: 'var(--ink-3)' }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const fetchDetails = async () => {
    try {
      // Fetch Tenant details
      console.log('Fetching details for restaurant ID:', id);
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
        setCountry(t.country || 'Georgia');
        setLanguages(t.languages || ['en', 'ka']);
        setDefaultLanguage(t.defaultLanguage || 'en');
        setEnabledModes({
          dineIn: t.enabledModes?.dineIn ?? true,
          pickup: t.enabledModes?.pickup ?? true,
          delivery: t.enabledModes?.delivery ?? true
        });
        setAssignedNotifications({
          email: t.assignedNotifications?.email ?? true,
          whatsapp: t.assignedNotifications?.whatsapp ?? false,
          telegram: t.assignedNotifications?.telegram ?? false
        });
        setBilling(t.billing || {
          cycle: 'monthly',
          amount: t.tier === 3 ? 199 : t.tier === 2 ? 79 : 29,
          start: new Date().toISOString().slice(0, 10),
          renewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        });
        setLedger(t.ledger || []);
        setManagerPasswordPlain(t.managerPasswordPlain || '');
        
        // Asynchronously refresh layout context cache to sync dashboard stats
        refreshData();
      } else {
        console.error('Fetch failed for ID:', id, 'status:', res.status);
        alert(`Restaurant details not found for ID: "${id}" (status: ${res.status})`);
        router.push('/super/restaurants');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleTierChange = (newTierVal) => {
    const newTierNum = parseInt(newTierVal);
    setTier(newTierNum);

    const selectedTierObj = tiers.find(t => t._id === 't' + newTierNum) || tiers.find(t => t.id === 't' + newTierNum);
    if (selectedTierObj && selectedTierObj.caps) {
      const caps = selectedTierObj.caps;

      // Clamp modes
      const updatedModes = { ...enabledModes };
      if (!caps.modes.dinein) updatedModes.dineIn = false;
      if (!caps.modes.pickup) updatedModes.pickup = false;
      if (!caps.modes.delivery) updatedModes.delivery = false;
      setEnabledModes(updatedModes);

      // Clamp channels
      const updatedChannels = { ...assignedNotifications };
      if (!caps.channels.email) updatedChannels.email = false;
      if (!caps.channels.whatsapp) updatedChannels.whatsapp = false;
      if (!caps.channels.telegram) updatedChannels.telegram = false;
      setAssignedNotifications(updatedChannels);

      // Clamp languages
      let updatedLangs = [...languages];
      updatedLangs = updatedLangs.filter(l => caps.langs.includes(l));
      if (updatedLangs.length === 0) {
        updatedLangs = [caps.langs[0] || 'en'];
      }
      if (updatedLangs.length > caps.maxTranslations) {
        updatedLangs = updatedLangs.slice(0, caps.maxTranslations);
      }
      setLanguages(updatedLangs);

      // Clamp default language
      if (!updatedLangs.includes(defaultLanguage)) {
        setDefaultLanguage(updatedLangs[0] || 'en');
      }

      // Recompute amount for billing
      const cycle = billing.cycle || 'monthly';
      const amount = cycle === 'annual' ? (selectedTierObj.priceAnnual || selectedTierObj.price * 10) : selectedTierObj.price;
      setBilling(prev => ({ ...prev, amount }));

      showToast(`Tier limits applied: ${selectedTierObj.name}`);
    }
  };

  const handleSaveSettings = async () => {
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
          country,
          languages,
          defaultLanguage,
          enabledModes,
          assignedNotifications,
          status,
          ledger,
          logoUrl: logoUrl.trim(),
          billing
        })
      });

      if (res.ok) {
        showToast('Configurations saved successfully!');
        fetchDetails();
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

  const handleToggleSuspend = async () => {
    try {
      const nextStatus = status === 'active' ? 'suspended' : 'active';
      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: nextStatus
        })
      });

      if (res.ok) {
        showToast(nextStatus === 'suspended' ? 'Store suspended' : 'Store reactivated');
        setSuspendModalOpen(false);
        fetchDetails();
      } else {
        alert('Failed updating suspension status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleDeleteTenant = async () => {
    try {
      const res = await fetch(`/api/super/tenants/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Tenant permanently deleted');
        setDeleteModalOpen(false);
        router.push('/super/restaurants');
      } else {
        alert('Failed deleting tenant');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting tenant');
    }
  };

  const handleSavePassword = async () => {
    if (modalPassword.trim().length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          managerPassword: modalPassword.trim()
        })
      });

      if (res.ok) {
        showToast('Password updated successfully');
        setPwModalOpen(false);
        fetchDetails();
      } else {
        alert('Failed changing password');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving password');
    }
  };

  const handleSaveBilling = async () => {
    try {
      const updatedBilling = {
        ...billing,
        cycle: modalBillingCycle,
        amount: parseFloat(modalBillingAmount) || 0,
        start: modalBillingStart,
        renewal: modalBillingRenewal
      };

      const res = await fetch('/api/super/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          billing: updatedBilling
        })
      });

      if (res.ok) {
        showToast('Subscription updated');
        setBillModalOpen(false);
        fetchDetails();
      } else {
        alert('Failed updating billing details');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving billing details');
    }
  };

  const handleEnterMasquerade = async () => {
    try {
      const res = await fetch('/api/super/masquerade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug: slug })
      });

      if (res.ok) {
        showToast('Masquerade session started');
        setMasqModalOpen(false);
        router.push('/manager/dashboard');
      } else {
        alert('Failed entering masquerade session');
      }
    } catch (err) {
      console.error(err);
    }
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
        showToast('Logo updated! Click Save configurations to apply.');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const renderMonogram = (lg = false) => {
    const monogramClass = `cmono ${lg ? 'lg' : ''}`;
    if (logoUrl && logoUrl.trim()) {
      return (
        <span className={monogramClass} onClick={handleLogoUploadClick} style={{ cursor: 'pointer' }}>
          <img src={logoUrl.trim()} alt={name} />
        </span>
      );
    }

    const nameInitials = name || 'S';
    const initials = nameInitials.split(/\s+/).filter(w => /[a-z]/i.test(w[0])).slice(0, 2).map(w => w[0]).join('').toUpperCase() || nameInitials.slice(0, 2).toUpperCase();
    return <span className={monogramClass} onClick={handleLogoUploadClick} style={{ cursor: 'pointer' }}>{initials}</span>;
  };

  if (loading) {
    return (
      <div className="layout" style={{ fontFamily: 'var(--font)' }}>
        <aside className="sidebar" style={{ top: '0', borderRight: '1px solid var(--line)' }}>
          <div className="brand" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '34px', height: '34px', borderRadius: '9px' }} />
            <div>
              <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: '50px', height: '10px', borderRadius: '3px' }} />
            </div>
          </div>
        </aside>
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

  const activeTierObj = tiers.find(t => t._id === 't' + tier) || tiers.find(t => t.id === 't' + tier) || tiers[0] || { caps: { maxProducts: 30, maxTranslations: 1 } };
  const caps = activeTierObj.caps || { maxProducts: 30, maxTranslations: 1 };
  const isSuspended = status === 'suspended';
  const prodLimit = caps.maxProducts === 0 ? null : caps.maxProducts;
  const prodPct = prodLimit ? Math.min(100, Math.round((tenant?.productsCount || 0) / prodLimit * 100)) : Math.min(100, (tenant?.productsCount || 0) / 300 * 100);

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
            style={{ border: 'none', background: 'transparent' }}
          >
            <Menu className="ic" />
          </button>

          <div className="crumb">
            <Layers style={{ width: '15px', height: '15px' }} />
            <span>Super Admin</span>
            <span style={{ color: 'var(--line-strong)' }}>/</span>
            <span onClick={() => router.push('/super/restaurants')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Stores</span>
            <span style={{ color: 'var(--line-strong)' }}>/</span>
            <b>{name}</b>
          </div>

          <div className="topbar-spacer"></div>

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="btn btn-accent btn-sm"
            style={{ height: '40px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{savingSettings ? 'Saving...' : 'Save configurations'}</span>
          </button>
        </header>

        <main className="content">
          <button className="back-link" onClick={() => router.push('/super/restaurants')}>
            <ArrowLeft className="ic" />
            <span>Stores</span>
          </button>

          {isSuspended && (
            <div className="susp-banner">
              <Pause className="ic" />
              <div className="sb-main">
                <div className="sb-t">This store is suspended</div>
                <div className="sb-s">Customers see a "temporarily unavailable" notice. Menu &amp; data are preserved. You can reactivate or permanently delete it.</div>
              </div>
              <button
                className="btn btn-sm"
                style={{ background: '#fff', border: '1px solid #f0c5c7', color: 'var(--neg)', gap: '6px' }}
                onClick={handleToggleSuspend}
              >
                <Play className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Reactivate</span>
              </button>
            </div>
          )}

          <div className="detail-head">
            {renderMonogram(true)}
            <div className="detail-id">
              <div className="detail-name">
                <span>{name}</span>
                <span className={`tier t${activeTierObj.lv || 1}`}>
                  <span className="lv">{activeTierObj.name}</span> · {activeTierObj.tag}
                </span>
              </div>
              <div className="detail-meta">
                <span className={`stat ${isSuspended ? 'suspended' : 'active'}`}>
                  <span className="dot"></span>
                  {isSuspended ? 'Suspended' : 'Active'}
                </span>
                <span className="dotsep"></span>
                <span className="cslug">dinelabs.co/<b>{slug}</b></span>
                <span className="dotsep"></span>
                <span className="cslug" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Globe style={{ width: '13px', height: '13px' }} />
                  {tenant?.country || 'Georgia'}
                </span>
              </div>
            </div>
            <div className="detail-actions">
              <a className="btn btn-outline btn-sm" href={`https://dinelabs.co/${slug}`} target="_blank" rel="noopener" style={{ height: '40px', gap: '6px' }}>
                <ExternalLink className="ic" />
                <span>Storefront</span>
              </a>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  if (isSuspended) {
                    handleToggleSuspend();
                  } else {
                    setSuspendModalOpen(true);
                  }
                }}
                style={{ height: '40px', gap: '6px' }}
              >
                {isSuspended ? (
                  <>
                    <Play className="ic" />
                    <span>Reactivate</span>
                  </>
                ) : (
                  <>
                    <Pause className="ic" />
                    <span>Suspend</span>
                  </>
                )}
              </button>
              {isSuspended ? (
                <button className="btn btn-danger btn-sm" onClick={() => { setDeleteConfirmSlug(''); setDeleteModalOpen(true); }} style={{ height: '40px', gap: '6px' }}>
                  <Trash2 className="ic" />
                  <span>Delete</span>
                </button>
              ) : (
                <button className="btn btn-accent btn-sm" onClick={() => setMasqModalOpen(true)} style={{ height: '40px', gap: '6px' }}>
                  <UserRoundCog className="ic" />
                  <span>Masquerade</span>
                </button>
              )}
            </div>
          </div>

          <div className="kpis">
            <div className="card kpi">
              <div className="kpi-top">
                <span className="kpi-label">Orders today</span>
                <span className="kpi-ic"><ReceiptText className="ic" /></span>
              </div>
              <div className="kpi-val tnum">{isSuspended ? '—' : tenant?.ordersToday ?? 0}</div>
              <div className="kpi-foot mut">live storefront</div>
            </div>
            <div className="card kpi">
              <div className="kpi-top">
                <span className="kpi-label">Revenue · this week</span>
                <span className="kpi-ic"><Banknote className="ic" /></span>
              </div>
               <div className="kpi-val tnum">{isSuspended ? '—' : (WORLD_CURRENCIES[baseCurrency]?.sym || '$') + (tenant?.revenueThisWeek ?? 0).toLocaleString('en-US')}</div>
              <div className="kpi-foot mut">{WORLD_CURRENCIES[baseCurrency]?.name || 'US Dollar'}</div>
            </div>
            <div className="card kpi">
              <div className="kpi-top">
                <span className="kpi-label">Last order</span>
                <span className="kpi-ic"><Clock className="ic" /></span>
              </div>
              <div className="kpi-val" style={{ fontSize: '24px' }}>{isSuspended ? '—' : freshLabel(tenant?.lastMin)}</div>
              <div className="kpi-foot mut">{isSuspended ? 'paused' : 'most recent activity'}</div>
            </div>
            <div className="card kpi">
              <div className="kpi-top">
                <span className="kpi-label">Error rate</span>
                <span className="kpi-ic"><Activity className="ic" /></span>
              </div>
              <div className="kpi-val tnum" style={{ fontSize: '26px' }}>{isSuspended ? '—' : (tenant?.err ?? 0.0).toFixed(1) + '%'}</div>
              <div className="kpi-foot mut">{isSuspended ? 'paused' : (tenant?.err ?? 0.0) >= 2.5 ? 'elevated — investigate' : 'within range'}</div>
            </div>
          </div>

          <div className="detail-grid">
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <section className="card">
                <div className="card-head">
                  <div className="card-title">
                    <Layers className="ic" />
                    <span>Plan &amp; limits</span>
                  </div>
                  <SearchSelect
                    value={tier}
                    onChange={handleTierChange}
                    options={tiers.map(tt => {
                      const val = tt._id ? tt._id.replace('t', '') : tt.id.replace('t', '');
                      return {
                        value: val,
                        label: `${tt.name} · ${tt.tag} · $${(tt.price || 0).toLocaleString('en-US')}/mo`
                      };
                    })}
                    style={{ width: '280px' }}
                  />
                </div>
                <div className="card-pad" style={{ paddingTop: '10px' }}>
                  <div className="mini-label">Always included</div>
                  <div className="chip-grid" style={{ marginBottom: '18px' }}>
                    {CORE_FEATURES.map((f, idx) => (
                      <span key={idx} className="core-chip">
                        <f.icon className="ic" style={{ width: '14px', height: '14px' }} />
                        {f.name}
                      </span>
                    ))}
                  </div>

                  <div className="mini-label">Limits on {activeTierObj.name}</div>
                  <div className="info-row">
                    <span className="info-k">
                      <Utensils className="ic" style={{ width: '15px', height: '15px' }} />
                      Products
                    </span>
                    <span className="info-v">
                      {tenant?.productsCount || 0} <span className="mut3" style={{ fontWeight: '600' }}>/ {prodLimit ? prodLimit : 'Unlimited'}</span>
                    </span>
                  </div>
                  {prodLimit && (
                    <div className="limit-meter">
                      <div className="lm-bar">
                        <span style={{ width: `${prodPct}%`, background: prodPct >= 90 ? 'var(--neg)' : 'var(--accent)' }}></span>
                      </div>
                    </div>
                  )}

                  <div className="info-row" style={{ marginTop: '6px' }}>
                    <span className="info-k">
                      <Globe className="ic" style={{ width: '15px', height: '15px' }} />
                      Storefront translations
                    </span>
                    <span className="info-v">
                      {languages.length} <span className="mut3" style={{ fontWeight: '600' }}>/ {caps.maxTranslations}</span>
                    </span>
                  </div>
                  <div className="card-note" style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Info className="ic" style={{ width: '14px', height: '14px' }} />
                    <span>Changing tier re-applies its limits. </span>
                    <span onClick={() => router.push('/super/tiers')} style={{ color: 'var(--accent-2)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
                      Manage tiers →
                    </span>
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="card-head">
                  <div className="card-title">
                    <SlidersHorizontal className="ic" />
                    <span>Ordering modes</span>
                  </div>
                  <span className="card-note">Limited by {activeTierObj.name}</span>
                </div>
                {renderOrderingModes()}
              </section>

              <section className="card">
                <div className="card-head">
                  <div className="card-title">
                    <Bell className="ic" />
                    <span>Order channels</span>
                  </div>
                  <span className="card-note">Where alerts are sent</span>
                </div>
                {renderOrderChannels()}
              </section>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <section className="card card-pad">
                <div className="mini-label">Manager login</div>
                <div className="info-row" style={{ borderBottom: 0, paddingBottom: '8px' }}>
                  <span className="info-k">
                    <Mail className="ic" style={{ width: '15px', height: '15px' }} />
                    Email
                  </span>
                  <span className="info-v" style={{ fontWeight: '600' }}>{tenant?.managerEmail || 'N/A'}</span>
                </div>
                <div className="pw-reveal" style={{ marginBottom: '12px' }}>
                  <code style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {pwShown ? (managerPasswordPlain || '(No password saved)') : '•'.repeat(Math.max(8, managerPasswordPlain.length))}
                  </code>
                  <button
                    className="act-btn"
                    onClick={() => setPwShown(!pwShown)}
                    title={pwShown ? 'Hide' : 'Reveal'}
                    style={{ background: 'transparent' }}
                  >
                    {pwShown ? <EyeOff className="ic" /> : <Eye className="ic" />}
                  </button>
                  <button
                    className="act-btn"
                    onClick={() => {
                      if (!managerPasswordPlain) {
                        showToast('No password set to copy', 'info');
                        return;
                      }
                      navigator.clipboard?.writeText(managerPasswordPlain);
                      showToast('Password copied');
                    }}
                    title="Copy"
                    style={{ background: 'transparent' }}
                  >
                    <Copy className="ic" />
                  </button>
                </div>
                <button
                  className="btn btn-outline btn-block btn-sm"
                  onClick={() => {
                    setModalPassword(managerPasswordPlain);
                    setPwModalOpen(true);
                  }}
                  style={{ gap: '6px' }}
                >
                  <KeyRound className="ic" style={{ width: '14px', height: '14px' }} />
                  <span>Change password</span>
                </button>
              </section>

              <section className="card card-pad">
                <div className="mini-label">Configuration</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '12px', color: 'var(--ink-2)' }}>Country</label>
                    <SearchSelect
                      value={country}
                      onChange={(val) => setCountry(val)}
                      options={WORLD_COUNTRIES}
                      placeholder="Search & select country..."
                    />
                  </div>
                  
                  <div className="field">
                    <label className="label" style={{ fontWeight: '700', fontSize: '12px', color: 'var(--ink-2)' }}>Base currency</label>
                    <SearchSelect
                      value={baseCurrency}
                      onChange={(val) => setBaseCurrency(val)}
                      options={Object.keys(WORLD_CURRENCIES).map(code => ({
                        value: code,
                        label: `${code} · ${WORLD_CURRENCIES[code].sym} ${WORLD_CURRENCIES[code].name}`,
                        subtitle: `${WORLD_CURRENCIES[code].name} (${WORLD_CURRENCIES[code].sym})`
                      }))}
                      placeholder="Search & select currency..."
                    />
                  </div>

                  {(() => {
                    const activeTierObj = tiers.find(t => t._id === 't' + tier) || tiers.find(t => t.id === 't' + tier) || { caps: { maxTranslations: 1, langs: ['en'] } };
                    const caps = activeTierObj.caps || { maxTranslations: 1, langs: ['en'] };
                    const pool = caps.langs || ['en'];
                    const maxLangs = caps.maxTranslations || 1;

                    return (
                      <>
                        <div className="field">
                          <label className="label" style={{ fontWeight: '700', fontSize: '12px', color: 'var(--ink-2)' }}>
                            Storefront Languages <span className="opt">— Choose up to {maxLangs}</span>
                          </label>
                          <div className="chip-grid" style={{ marginBottom: '8px' }}>
                            {languages.map(code => (
                              <div 
                                key={code}
                                className="sel-chip on"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '32px', padding: '0 8px', fontSize: '12px' }}
                              >
                                <span>{WORLD_LANGUAGES[code]?.flag || '🌐'} {WORLD_LANGUAGES[code]?.label || code.toUpperCase()}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (languages.length === 1) return;
                                    const nextLangs = languages.filter(l => l !== code);
                                    setLanguages(nextLangs);
                                    if (defaultLanguage === code) {
                                      setDefaultLanguage(nextLangs[0]);
                                    }
                                  }}
                                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--accent-2)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                  title="Remove"
                                  disabled={languages.length === 1}
                                >
                                  <X className="ic" style={{ width: '12px', height: '12px' }} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {languages.length < maxLangs && pool.filter(code => !languages.includes(code)).length > 0 && (
                            <SearchSelect
                              options={pool
                                .filter(code => !languages.includes(code))
                                .map(code => ({
                                  value: code,
                                  label: `${WORLD_LANGUAGES[code]?.flag || '🌐'} ${WORLD_LANGUAGES[code]?.label || code.toUpperCase()}`,
                                  subtitle: WORLD_LANGUAGES[code]?.code || code.toUpperCase()
                                }))}
                              onChange={(code) => {
                                if (languages.length >= maxLangs) {
                                  alert(`This tier allows a maximum of ${maxLangs} translation languages.`);
                                  return;
                                }
                                setLanguages([...languages, code]);
                              }}
                              placeholder="Add language..."
                            />
                          )}
                        </div>

                        <div className="field">
                          <label className="label" style={{ fontWeight: '700', fontSize: '12px', color: 'var(--ink-2)' }}>Default language</label>
                          <div className="chip-grid">
                            {languages.map(code => (
                              <div 
                                key={code}
                                className={`sel-chip radio ${defaultLanguage === code ? 'on' : ''}`}
                                onClick={() => setDefaultLanguage(code)}
                                style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                              >
                                <span>{WORLD_LANGUAGES[code]?.flag || '🌐'} {WORLD_LANGUAGES[code]?.label || code.toUpperCase()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="info-row" style={{ borderTop: '1px solid var(--line)', paddingTop: '10px', marginTop: '4px' }}>
                    <span className="info-k" style={{ fontSize: '11.5px' }}>
                      <Calendar className="ic" style={{ width: '13px', height: '13px' }} />
                      Created
                    </span>
                    <span className="info-v" style={{ fontSize: '11.5px' }}>
                      {tenant?.createdAt ? `${Math.round((new Date().getTime() - new Date(tenant.createdAt).getTime()) / 86400000)} days ago` : 'Just now'}
                    </span>
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="card-head">
                  <div className="card-title">
                    <Banknote className="ic" />
                    <span>Billing</span>
                  </div>
                  <span
                    onClick={() => router.push('/super/billing')}
                    className="btn btn-ghost btn-sm"
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Open billing</span>
                    <ArrowLeft className="ic" style={{ transform: 'rotate(180deg)', width: '14px', height: '14px' }} />
                  </span>
                </div>
                <div className="card-pad" style={{ paddingTop: '6px' }}>
                  <div className="billing-line">
                    <span className="bk">Plan</span>
                    <span className="bv">{activeTierObj.name} · {activeTierObj.tag}</span>
                  </div>
                  <div className="billing-line">
                    <span className="bk">Amount</span>
                    <span className="bv">${(billing.amount || 0).toFixed(2)} / {billing.cycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  {billing.trial && (
                    <div className="billing-line">
                      <span className="bk">Free trial</span>
                      <span className="bv" style={{ color: 'var(--accent-2)' }}>14 days</span>
                    </div>
                  )}
                  <div className="billing-line">
                    <span className="bk">Start date</span>
                    <span className="bv">{fmtDate(billing.start)}</span>
                  </div>
                  <div className="billing-line">
                    <span className="bk">Renewal</span>
                    <span className="bv">{isSuspended ? '—' : fmtDate(billing.renewal)}</span>
                  </div>
                  <div className="billing-line">
                    <span className="bk">Status</span>
                    <span className="bv" style={{ color: isSuspended ? 'var(--neg)' : 'var(--pos)' }}>
                      {isSuspended ? 'Paused' : 'Active'}
                    </span>
                  </div>
                  <button
                    className="btn btn-outline btn-block btn-sm"
                    onClick={() => {
                      setModalBillingCycle(billing.cycle || 'monthly');
                      setModalBillingAmount(billing.amount || 29);
                      setModalBillingStart(billing.start || '');
                      setModalBillingRenewal(billing.renewal || '');
                      setBillModalOpen(true);
                    }}
                    style={{ marginTop: '14px', gap: '6px' }}
                  >
                    <CalendarCog className="ic" style={{ width: '14px', height: '14px' }} />
                    <span>Edit subscription</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* 1. Change Password Modal */}
      {pwModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <button className="modal-x" onClick={() => setPwModalOpen(false)} aria-label="Close">
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <KeyRound className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Manager password</h3>
                <p>For {name}'s Dinelabs Manager login.</p>
              </div>
            </div>
            <div className="modal-body" style={{ paddingBottom: '8px' }}>
              <div className="field">
                <label className="label">Manager email</label>
                <input className="input" value={tenant?.managerEmail || 'N/A'} readOnly style={{ background: 'var(--surface-2)' }} />
              </div>
              <div className="field" style={{ marginBottom: '6px' }}>
                <label className="label" htmlFor="pwVal">Password</label>
                <div className="pw-field">
                  <input
                    className="input"
                    id="pwVal"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                    style={{ paddingRight: '80px' }}
                  />
                  <button type="button" className="pw-gen" onClick={() => setModalPassword(genPassword())} style={{ border: 'none', background: 'transparent' }}>
                    <Wand2 className="ic" style={{ width: '13px', height: '13px' }} />
                    <span>New</span>
                  </button>
                </div>
              </div>
              <div className="masq-warn" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Info className="ic" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Editing here sets a new password immediately. Share it with the store securely — they can change it later in Manager.</span>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setPwModalOpen(false)} type="button">Cancel</button>
              <button className="btn btn-accent" onClick={handleSavePassword} type="button" style={{ gap: '6px' }}>
                <Check className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Save password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Subscription Modal */}
      {billModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <button className="modal-x" onClick={() => setBillModalOpen(false)} aria-label="Close">
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <CalendarCog className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Edit subscription</h3>
                <p>{name} · dinelabs.co/{slug}</p>
              </div>
            </div>
            <div className="modal-body" style={{ paddingBottom: '8px' }}>
              <div className="field">
                <label className="label">Billing cycle</label>
                <div className="chip-grid">
                  <div
                    className={`sel-chip radio ${modalBillingCycle === 'monthly' ? 'on' : ''}`}
                    onClick={() => {
                      setModalBillingCycle('monthly');
                      // Auto-update amount based on cycle & tier
                      setModalBillingAmount(activeTierObj.price || 29);
                    }}
                  >
                    Monthly
                  </div>
                  <div
                    className={`sel-chip radio ${modalBillingCycle === 'annual' ? 'on' : ''}`}
                    onClick={() => {
                      setModalBillingCycle('annual');
                      setModalBillingAmount(activeTierObj.priceAnnual || (activeTierObj.price * 10) || 290);
                    }}
                  >
                    Annual
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="bAmount">Amount per period</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-muted)' }}>$</span>
                  <input
                    className="input"
                    id="bAmount"
                    type="number"
                    min="0"
                    step="1"
                    value={modalBillingAmount}
                    onChange={(e) => setModalBillingAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="label" htmlFor="bStart">Start date</label>
                  <input
                    className="input"
                    id="bStart"
                    type="date"
                    value={modalBillingStart}
                    onChange={(e) => setModalBillingStart(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="bRenew">Renewal date</label>
                  <input
                    className="input"
                    id="bRenew"
                    type="date"
                    value={modalBillingRenewal}
                    onChange={(e) => setModalBillingRenewal(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-note" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Info className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Set renewal manually, or use the cycle to recompute it from the start date.</span>
              </div>
            </div>
            <div className="modal-foot">
              <button
                className="btn btn-outline"
                onClick={() => {
                  const startVal = modalBillingStart || iso(new Date());
                  const days = modalBillingCycle === 'annual' ? 365 : 30;
                  const calculatedRenewal = addDays(new Date(startVal + 'T00:00:00'), days);
                  setModalBillingRenewal(iso(calculatedRenewal));
                  showToast('Renewal recomputed');
                }}
                type="button"
                style={{ gap: '6px' }}
              >
                <Wand2 className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Recompute renewal</span>
              </button>
              <div style={{ flex: 1 }}></div>
              <button className="btn btn-ghost" onClick={() => setBillModalOpen(false)} type="button">Cancel</button>
              <button className="btn btn-accent" onClick={handleSaveBilling} type="button" style={{ gap: '6px' }}>
                <Check className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Masquerade Modal */}
      {masqModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <button className="modal-x" onClick={() => setMasqModalOpen(false)} aria-label="Close">
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon masq-icon" style={{ background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <UserRoundCog className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Masquerade as {name}</h3>
                <p>Open their Dinelabs Manager exactly as the store sees it.</p>
              </div>
            </div>
            <div className="modal-body" style={{ paddingBottom: '8px' }}>
              <div className="masq-row">
                {renderMonogram()}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="cname">{name}</div>
                  <div className="cslug">dinelabs.co/<b>{slug}</b></div>
                </div>
                <span className={`tier t${activeTierObj.lv || 1}`}>
                  <span className="lv">{activeTierObj.name}</span> · {activeTierObj.tag}
                </span>
              </div>
              <div className="masq-warn" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <ShieldAlert className="ic" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>You'll be acting <b>on behalf of this store</b>. Actions are logged to the audit trail. You can exit masquerade at any time.</span>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setMasqModalOpen(false)} type="button">Cancel</button>
              <button className="btn btn-accent" onClick={handleEnterMasquerade} type="button" style={{ gap: '6px' }}>
                <Send className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Enter Manager</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ maxWidth: '470px' }}>
            <button className="modal-x" onClick={() => setDeleteModalOpen(false)} aria-label="Close">
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--neg)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <Trash2 className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Delete {name}?</h3>
                <p>This permanently removes the tenant and all its data.</p>
              </div>
            </div>
            <div className="modal-body" style={{ paddingBottom: '8px' }}>
              <div className="masq-warn" style={{ background: 'var(--neg-bg)', color: '#9b3b40', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <ShieldAlert className="ic" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>This <b>cannot be undone</b>. The storefront, menu, orders and billing history for <b>dinelabs.co/{slug}</b> will be erased.</span>
              </div>
              <div className="field" style={{ marginTop: '14px', marginBottom: '2px' }}>
                <label className="label" htmlFor="delConfirm">Type <b>{slug}</b> to confirm</label>
                <input
                  className="input"
                  id="delConfirm"
                  placeholder={slug}
                  value={deleteConfirmSlug}
                  onChange={(e) => setDeleteConfirmSlug(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setDeleteModalOpen(false)} type="button">Cancel</button>
              <button
                className="btn btn-danger"
                disabled={deleteConfirmSlug.trim() !== slug}
                onClick={handleDeleteTenant}
                type="button"
                style={{ opacity: deleteConfirmSlug.trim() === slug ? 1 : 0.5, gap: '6px' }}
              >
                <Trash2 className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Delete permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Suspend Confirmation Modal */}
      {suspendModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ maxWidth: '460px' }}>
            <button className="modal-x" onClick={() => setSuspendModalOpen(false)} aria-label="Close">
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--neg)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <Pause className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Suspend {name}?</h3>
                <p>Ordering stops immediately on their storefront.</p>
              </div>
            </div>
            <div className="modal-body" style={{ paddingBottom: '8px' }}>
              <div className="masq-warn" style={{ background: 'var(--neg-bg)', color: '#9b3b40', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Info className="ic" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Customers will see a <b>"temporarily unavailable"</b> notice. No new orders are accepted. Menu, settings and data are kept safe and restored on reactivation. A suspended store can then be permanently deleted.</span>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setSuspendModalOpen(false)} type="button">Keep active</button>
              <button className="btn btn-danger" onClick={handleToggleSuspend} type="button" style={{ gap: '6px' }}>
                <Pause className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Suspend store</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Overlay */}
      {toast && (
        <div className="toast-wrap">
          <div className="toast" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="ic">✓</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ShieldCheck, LifeBuoy, Layers, Plus, Trash2, ChevronRight, X, Check, Star, RefreshCw, Minus, SlidersHorizontal, Bell, UtensilsCrossed, Languages } from 'lucide-react';
import '../../manager/manager.css';
import '../super.css';
import SuperSidebar from '../SuperSidebar';
import { useSuperAdmin } from '../layout';

import { WORLD_LANGUAGES } from '../../../lib/constants';
import SearchSelect from '../../components/SearchSelect';

const MODES = {
  delivery: { label: 'Delivery', icon: 'bike' },
  pickup: { label: 'Pick-up', icon: 'shopping-bag' },
  dinein: { label: 'Dine-in', icon: 'utensils' },
};

const CHANNELS = {
  email: { label: 'Email', icon: 'mail' },
  whatsapp: { label: 'WhatsApp', icon: 'message-circle' },
  telegram: { label: 'Telegram', icon: 'send' },
};

const CORE_FEATURES = [
  { name: 'Live orders board', icon: 'receipt-text' },
  { name: 'Menu management', icon: 'utensils-crossed' },
];

export default function SuperTiersPage() {
  const router = useRouter();
  const { tenants, tiers, loading, refreshData } = useSuperAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modal States
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState(null);

  // Editor Form States
  const [eName, setEName] = useState('');
  const [eTag, setETag] = useState('');
  const [ePrice, setEPrice] = useState(29);
  const [ePriceAnnual, setEPriceAnnual] = useState(290);
  const [eProducts, setEProducts] = useState(30);
  const [eUnlimited, setEUnlimited] = useState(false);
  const [eTrans, setETrans] = useState(1);
  const [eLangs, setELangs] = useState(['en']);
  const [eModes, setEModes] = useState({ delivery: false, pickup: true, dinein: false });
  const [eChannels, setEChannels] = useState({ email: true, whatsapp: false, telegram: false });

  const getClientCount = (tierId) => {
    return tenants.filter(c => {
      // support matching string 't1', 't2' or numeric 1, 2 etc.
      return c.tier === tierId || c.tier.toString() === tierId.replace('t', '');
    }).length;
  };

  const getModeCount = (t) => {
    if (!t.caps?.modes) return 0;
    return Object.values(t.caps.modes).filter(Boolean).length;
  };

  const getChCount = (t) => {
    if (!t.caps?.channels) return 0;
    return Object.values(t.caps.channels).filter(Boolean).length;
  };

  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

  // Open Editor Modal (Create or Edit)
  const openEditor = (tier = null) => {
    if (tier) {
      setSelectedTier(tier);
      setIsNew(false);
      setEName(tier.name);
      setETag(tier.tag);
      setEPrice(tier.price);
      setEPriceAnnual(tier.priceAnnual);
      setEProducts(tier.caps?.maxProducts || 0);
      setEUnlimited(tier.caps?.maxProducts === 0);
      setETrans(tier.caps?.maxTranslations || 1);
      setELangs(tier.caps?.langs || ['en']);
      setEModes({
        delivery: !!tier.caps?.modes?.delivery,
        pickup: !!tier.caps?.modes?.pickup,
        dinein: !!tier.caps?.modes?.dinein,
      });
      setEChannels({
        email: !!tier.caps?.channels?.email,
        whatsapp: !!tier.caps?.channels?.whatsapp,
        telegram: !!tier.caps?.channels?.telegram,
      });
    } else {
      setSelectedTier(null);
      setIsNew(true);
      setEName(`Tier ${tiers.length + 1}`);
      setETag('Custom');
      setEPrice(99);
      setEPriceAnnual(990);
      setEProducts(50);
      setEUnlimited(false);
      setETrans(1);
      setELangs(['en']);
      setEModes({ delivery: false, pickup: true, dinein: false });
      setEChannels({ email: true, whatsapp: false, telegram: false });
    }
    setEditorOpen(true);
  };

  // Toggle Language Selected state in Editor
  const toggleLanguage = (code) => {
    if (eLangs.includes(code)) {
      if (eLangs.length === 1) return;
      setELangs(eLangs.filter(l => l !== code));
    } else {
      setELangs([...eLangs, code]);
    }
  };

  // Save Tier Form
  const handleSaveTier = async (e) => {
    e.preventDefault();
    if (!eName.trim()) {
      alert('Tier name is required');
      return;
    }

    if (eLangs.length === 0) {
      alert('Select at least one available language');
      return;
    }

    const payload = {
      name: eName.trim(),
      tag: eTag.trim() || 'Custom',
      price: parseFloat(ePrice) || 0,
      priceAnnual: parseFloat(ePriceAnnual) || 0,
      lv: selectedTier ? selectedTier.lv : Math.min(3, tiers.length + 1),
      caps: {
        maxProducts: eUnlimited ? 0 : (parseInt(eProducts) || 0),
        maxTranslations: Math.min(parseInt(eTrans) || 1, eLangs.length),
        langs: eLangs,
        modes: {
          delivery: eModes.delivery ? 1 : 0,
          pickup: eModes.pickup ? 1 : 0,
          dinein: eModes.dinein ? 1 : 0,
        },
        channels: {
          email: eChannels.email ? 1 : 0,
          whatsapp: eChannels.whatsapp ? 1 : 0,
          telegram: eChannels.telegram ? 1 : 0,
        }
      }
    };

    try {
      const url = isNew ? '/api/super/tiers' : `/api/super/tiers/${selectedTier._id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(isNew ? 'New tier created successfully!' : 'Tier updated successfully!');
        setEditorOpen(false);
        refreshData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed saving tier settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving tier.');
    }
  };

  // Delete Tier Submit
  const handleDeleteTier = async () => {
    if (!tierToDelete) return;
    try {
      const res = await fetch(`/api/super/tiers/${tierToDelete._id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Tier successfully deleted. All stores mapped to this tier have been migrated.');
        setDeleteOpen(false);
        setTierToDelete(null);
        refreshData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed deleting tier.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting tier.');
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
            <b>Platform Tiers</b>
          </div>

          <div className="topbar-spacer"></div>

          <button 
            className="btn btn-accent btn-sm" 
            style={{ height: '40px' }}
            onClick={() => openEditor(null)}
          >
            <Plus className="ic" />
            <span>New tier</span>
          </button>
        </header>

        <main className="content">
          <div className="page-head">
            <div>
              <h1 className="page-title">Tiers</h1>
              <p className="page-sub">Build subscription tiers and the limits each one unlocks. Click a tier to manage it.</p>
            </div>
          </div>

          {/* Tier Cards Container */}
          <section className="card">
            <div className="card-head">
              <div className="card-title">
                <Layers className="ic" />
                <span>Subscription tiers</span>
              </div>
              <span className="card-note">
                {tiers.length} tier{tiers.length === 1 ? '' : 's'} total
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '30px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '70px', borderRadius: '12px', marginBottom: '12px' }} />
                ))}
              </div>
            ) : (
              <div id="tierList">
                {tiers.map(t => {
                  const numStores = getClientCount(t._id);
                  const isFallbackOnly = tiers.length <= 1;

                  return (
                    <div key={t._id} className="tier-row" onClick={() => openEditor(t)}>
                      <span className={`tier-mark t${t.lv}`}>
                        {t.name.replace(/[^0-9]/g, '') || t.name.slice(0, 1)}
                      </span>
                      <div className="tr-id">
                        <div className="tr-name">{t.name}</div>
                        <div className="tr-tag">{t.tag}</div>
                      </div>
                      <div className="tr-price">
                        {money(t.price)}<span> /mo</span>
                        <div className="tr-tag" style={{ marginTop: '3px' }}>{money(t.priceAnnual)} /yr</div>
                      </div>
                      
                      <div className="tlimits">
                        <span className="tlimit">
                          <UtensilsCrossed className="ic" style={{ width: '13px', height: '13px' }} />
                          <span>{t.caps?.maxProducts === 0 ? 'Unlimited' : `${t.caps?.maxProducts} products`}</span>
                        </span>
                        <span className="tlimit">
                          <Languages className="ic" style={{ width: '13px', height: '13px' }} />
                          <span>{t.caps?.maxTranslations} language{t.caps?.maxTranslations > 1 ? 's' : ''}</span>
                        </span>
                        <span className="tlimit">
                          <SlidersHorizontal className="ic" style={{ width: '13px', height: '13px' }} />
                          <span>{getModeCount(t)}/3 modes</span>
                        </span>
                        <span className="tlimit">
                          <Bell className="ic" style={{ width: '13px', height: '13px' }} />
                          <span>{getChCount(t)}/3 channels</span>
                        </span>
                      </div>
                      
                      <div className="tr-count">
                        {numStores} store{numStores === 1 ? '' : 's'}
                      </div>
                      
                      <button 
                        className="tier-del" 
                        title="Delete tier" 
                        disabled={isFallbackOnly}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTierToDelete(t);
                          setDeleteOpen(true);
                        }}
                        style={{ opacity: isFallbackOnly ? 0.3 : 1, cursor: isFallbackOnly ? 'not-allowed' : 'pointer' }}
                      >
                        <Trash2 className="ic" style={{ width: '14px', height: '14px' }} />
                      </button>
                      
                      <span className="tr-go">
                        <ChevronRight className="ic" style={{ width: '16px', height: '16px' }} />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Editor Modal Overlay */}
      {editorOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card is-form is-wide" style={{ flexDirection: 'column', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>
            <button className="modal-x" onClick={() => setEditorOpen(false)}>
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', borderRadius: '12px' }}>
                <Layers className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>{isNew ? 'New tier' : `Manage ${eName}`}</h3>
                <p>Set pricing parameters and the service capabilities this tier unlocks.</p>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              <form onSubmit={handleSaveTier}>
                
                {/* Identity & Pricing */}
                <div className="form-sec">
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><Star style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Identity & Pricing</div>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="label">Tier Name</label>
                      <input className="input" value={eName} onChange={(e) => setEName(e.target.value)} required />
                    </div>
                    <div className="field">
                      <label className="label">Badge Label</label>
                      <input className="input" value={eTag} onChange={(e) => setETag(e.target.value)} placeholder="Pro" required />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="label">Monthly price</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-muted)' }}>$</span>
                        <input className="input" type="number" value={ePrice} onChange={(e) => setEPrice(e.target.value)} required />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Annual price</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-muted)' }}>$</span>
                        <input className="input" type="number" value={ePriceAnnual} onChange={(e) => setEPriceAnnual(e.target.value)} required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limits */}
                <div className="form-sec" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line-2)' }}>
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><Minus style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Limits & Caps</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Maximum caps applied to client catalogs</div>
                    </div>
                  </div>
                  
                  {/* Products Limit */}
                  <div className="limit-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
                    <div className="lr-main" style={{ flex: 1 }}>
                      <div className="lr-name" style={{ fontWeight: 'bold', fontSize: '13.5px' }}>Products catalog limit</div>
                      <div className="lr-sub" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Max items allowed in menu</div>
                    </div>
                    <div className="lr-ctrl" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="num-stepper" style={{ display: 'flex', border: '1px solid var(--line-2)', borderRadius: '8px', overflow: 'hidden' }}>
                        <button type="button" onClick={() => !eUnlimited && setEProducts(Math.max(0, eProducts - 10))} style={{ padding: '8px 12px', background: '#fff', border: 'none' }} disabled={eUnlimited}><Minus style={{ width: '14px', height: '14px' }} /></button>
                        <input type="number" value={eProducts} onChange={(e) => setEProducts(parseInt(e.target.value) || 0)} disabled={eUnlimited} style={{ width: '50px', textAlign: 'center', border: 'none', outline: 'none' }} />
                        <button type="button" onClick={() => !eUnlimited && setEProducts(eProducts + 10)} style={{ padding: '8px 12px', background: '#fff', border: 'none' }} disabled={eUnlimited}><Plus style={{ width: '14px', height: '14px' }} /></button>
                      </div>
                      <div 
                        className={`sel-chip ${eUnlimited ? 'on' : ''}`}
                        onClick={() => {
                          setEUnlimited(!eUnlimited);
                          if (!eUnlimited) setEProducts(0);
                        }}
                        style={{ height: '36px' }}
                      >
                        <span className="chk"><Check className="ic" style={{ opacity: eUnlimited ? 1 : 0 }} /></span>
                        <span>Unlimited</span>
                      </div>
                    </div>
                  </div>

                  {/* Translations Limit */}
                  <div className="limit-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
                    <div className="lr-main">
                      <div className="lr-name" style={{ fontWeight: 'bold', fontSize: '13.5px' }}>Storefront translations</div>
                      <div className="lr-sub" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Maximum active languages client can choose</div>
                    </div>
                    <div className="lr-ctrl">
                      <div className="num-stepper" style={{ display: 'flex', border: '1px solid var(--line-2)', borderRadius: '8px', overflow: 'hidden' }}>
                        <button type="button" onClick={() => setETrans(Math.max(1, eTrans - 1))} style={{ padding: '8px 12px', background: '#fff', border: 'none' }}><Minus style={{ width: '14px', height: '14px' }} /></button>
                        <input type="number" value={eTrans} readOnly style={{ width: '40px', textAlign: 'center', border: 'none' }} />
                        <button type="button" onClick={() => setETrans(Math.min(8, eTrans + 1))} style={{ padding: '8px 12px', background: '#fff', border: 'none' }}><Plus style={{ width: '14px', height: '14px' }} /></button>
                      </div>
                    </div>
                  </div>

                  {/* Available Languages */}
                  <div className="field" style={{ marginTop: '14px' }}>
                    <label className="label" style={{ fontWeight: '700', fontSize: '13px', color: 'var(--ink-2)' }}>Available Languages <span className="opt">— pool this tier is allowed to select</span></label>
                    <div className="chip-grid" style={{ marginBottom: '10px' }}>
                      {eLangs.map(code => (
                        <div 
                          key={code}
                          className="sel-chip on"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '32px', padding: '0 10px', fontSize: '12.5px' }}
                        >
                          <span>{WORLD_LANGUAGES[code]?.flag || '🌐'} {WORLD_LANGUAGES[code]?.label || code.toUpperCase()}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (eLangs.length === 1) return;
                              setELangs(eLangs.filter(l => l !== code));
                            }}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--accent-2)', padding: '2px', display: 'flex', alignItems: 'center' }}
                            title="Remove"
                            disabled={eLangs.length === 1}
                          >
                            <X className="ic" style={{ width: '13px', height: '13px' }} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {eLangs.length < Object.keys(WORLD_LANGUAGES).length && (
                      <SearchSelect
                        options={Object.keys(WORLD_LANGUAGES)
                          .filter(code => !eLangs.includes(code))
                          .map(code => ({
                            value: code,
                            label: `${WORLD_LANGUAGES[code].flag} ${WORLD_LANGUAGES[code].label}`,
                            subtitle: WORLD_LANGUAGES[code].code
                          }))}
                        onChange={(code) => setELangs([...eLangs, code])}
                        placeholder="Add a language to this tier's pool..."
                      />
                    )}
                  </div>
                </div>

                {/* Ordering Modes */}
                <div className="form-sec" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line-2)' }}>
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><SlidersHorizontal style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Ordering Modes</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Switch on/off allowed storefront modes</div>
                    </div>
                  </div>
                  {Object.keys(MODES).map(m => (
                    <div key={m} className="limit-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
                      <div className="lr-main">
                        <div className="lr-name" style={{ fontWeight: 'bold' }}>{MODES[m].label}</div>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={eModes[m]} 
                          onChange={(e) => setEModes({ ...eModes, [m]: e.target.checked })} 
                        />
                        <span className="track"></span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Order Channels */}
                <div className="form-sec" style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--line-2)' }}>
                  <div className="form-sec-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="fs-ic"><Bell style={{ width: '14px', height: '14px' }} /></span>
                    <div>
                      <div className="fs-t" style={{ fontWeight: 'bold' }}>Alert Notification Channels</div>
                      <div className="fs-s" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Store alert configurations allowed</div>
                    </div>
                  </div>
                  {Object.keys(CHANNELS).map(ch => (
                    <div key={ch} className="limit-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
                      <div className="lr-main">
                        <div className="lr-name" style={{ fontWeight: 'bold' }}>{CHANNELS[ch].label}</div>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={eChannels[ch]} 
                          onChange={(e) => setEChannels({ ...eChannels, [ch]: e.target.checked })} 
                        />
                        <span className="track"></span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="modal-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditorOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-accent">
                    <span>{isNew ? 'Create subscription tier' : 'Save changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-card" style={{ maxWidth: '450px', padding: '24px' }}>
            <button className="modal-x" onClick={() => setDeleteOpen(false)}>
              <X className="ic" />
            </button>
            <div className="modal-head">
              <div className="modal-icon" style={{ background: 'var(--neg)', color: '#fff', display: 'grid', placeItems: 'center', borderRadius: '12px' }}>
                <Trash2 className="ic" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3>Delete {tierToDelete?.name}?</h3>
                <p>This completely removes this subscription tier from the Dinelabs platform.</p>
              </div>
            </div>
            
            <div className="modal-body" style={{ padding: '14px 0 8px' }}>
              {(() => {
                const count = getClientCount(tierToDelete?._id || '');
                const fallback = tiers.find(x => x._id !== tierToDelete?._id);
                if (count > 0) {
                  return (
                    <div className="masq-warn" style={{ background: '#fef2f2', color: '#9b3b40', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                      <strong>⚠️ Warning:</strong> There are <b>{count} store(s)</b> currently mapped to this tier. They will automatically be downgraded to the fallback tier <b>{fallback?.name || 'Starter'}</b>.
                    </div>
                  );
                }
                return (
                  <p className="mut" style={{ margin: 0, fontSize: '13.5px' }}>
                    No stores are currently configured on this tier. It is safe to delete.
                  </p>
                );
              })()}
            </div>

            <div className="modal-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteTier}>
                <Trash2 className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Delete tier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

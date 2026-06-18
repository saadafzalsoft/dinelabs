'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bike,
  Check,
  Globe,
  MapPin,
  GripVertical,
  Trash2,
  Plus,
  PauseCircle,
  Map
} from 'lucide-react';
import '../manager.css';

const CURRENCY_SYM = {
  USD: '$', EUR: '€', GBP: '£', GEL: '₾', TRY: '₺', RUB: '₽', UAH: '₴', INR: '₹', JPY: '¥', PLN: 'zł',
  AUD: 'A$', CAD: 'C$', BRL: 'R$', MXN: 'MX$', SGD: 'S$', AED: 'AED', SAR: 'SAR', LBP: 'L.L'
};

function DeliveryPageContent() {
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delivery settings states
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [deliveryWait, setDeliveryWait] = useState(30);
  const [deliveryFee, setDeliveryFee] = useState(2.50);
  const [minOrderValue, setMinOrderValue] = useState(12.00);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [deliveryMode, setDeliveryMode] = useState('general'); // 'general' | 'custom'
  const [deliveryZones, setDeliveryZones] = useState([]);

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggableRowId, setDraggableRowId] = useState(null);

  // Inline delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('check');

  const triggerToast = (msg, icon = 'check') => {
    setToastMessage(msg);
    setToastIcon(icon);
    // Auto clear after 2.5s
    const timer = setTimeout(() => setToastMessage(''), 2500);
    return () => clearTimeout(timer);
  };

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
        setDeliveryEnabled(data.enabledModes?.delivery ?? true);
        setDeliveryWait(data.waitTimes?.delivery ?? 30);
        setDeliveryFee(data.deliveryFee ?? 2.50);
        setMinOrderValue(data.minOrderValue ?? 12.00);
        setBaseCurrency(data.baseCurrency || 'USD');
        setDeliveryMode(data.deliveryMode || 'general');
        setDeliveryZones(data.deliveryZones || [
          { id: 'z1', name: 'City centre', fee: 3.00, time: 20 },
          { id: 'z2', name: 'North side',  fee: 5.00, time: 35 },
          { id: 'z3', name: 'Riverside',   fee: 6.00, time: 45 }
        ]);
      }
    } catch (err) {
      console.error('Error fetching settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Fetch latest tenant settings so we don't overwrite other fields
      const currentRes = await fetch('/api/tenant/settings');
      if (!currentRes.ok) throw new Error('Could not fetch settings');
      const currentData = await currentRes.json();

      const nextEnabledModes = {
        ...(currentData.enabledModes || { dineIn: true, pickup: true }),
        delivery: deliveryEnabled
      };

      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          enabledModes: nextEnabledModes,
          waitTimes: {
            ...(currentData.waitTimes || { pickup: 15 }),
            delivery: parseInt(deliveryMode === 'general' ? deliveryWait : (deliveryZones.length > 0 ? deliveryZones[0].time : 30))
          },
          deliveryFee: parseFloat(deliveryFee),
          minOrderValue: parseFloat(minOrderValue),
          deliveryMode: deliveryMode,
          deliveryZones: deliveryZones
        })
      });

      if (res.ok) {
        triggerToast('Delivery settings saved successfully!', 'check');
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

  // Helper values
  const sym = CURRENCY_SYM[baseCurrency] || '$';

  // Zone action: Add new area
  const handleAddArea = () => {
    const uid = 'z' + Math.random().toString(36).slice(2, 8);
    const newZone = { id: uid, name: '', fee: parseFloat(deliveryFee) || 0, time: parseInt(deliveryWait) || 30 };
    setDeliveryZones([...deliveryZones, newZone]);
  };

  // Zone action: Update values
  const handleUpdateZone = (id, field, value) => {
    setDeliveryZones(deliveryZones.map(z => {
      if (z.id === id) {
        return { ...z, [field]: value };
      }
      return z;
    }));
  };

  // Zone action: Remove area
  const handleRemoveZone = (id) => {
    setDeliveryZones(deliveryZones.filter(z => z.id !== id));
    setConfirmDeleteId(null);
    triggerToast('Area removed', 'trash-2');
  };

  // Drag and drop sorting handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newZones = [...deliveryZones];
    const draggedItem = newZones[draggedIndex];
    newZones.splice(draggedIndex, 1);
    newZones.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setDeliveryZones(newZones);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggableRowId(null);
  };

  // Preview strip content rendering
  const renderPreviewContent = () => {
    if (!deliveryEnabled) {
      return (
        <>
          <PauseCircle className="ic" style={{ width: '15px', height: '15px' }} />
          <span>Delivery is paused — these rules apply the moment you turn it back on.</span>
        </>
      );
    }

    const minFormatted = minOrderValue ? parseFloat(minOrderValue).toFixed(2) : '0.00';

    if (deliveryMode === 'general') {
      const feeFormatted = deliveryFee ? parseFloat(deliveryFee).toFixed(2) : '0.00';
      return (
        <>
          <Bike className="ic" style={{ width: '15px', height: '15px' }} />
          <span>
            Every area: <b>{sym}{feeFormatted}</b> fee <span className="sep">·</span> <b>{deliveryWait} min</b> <span className="sep">·</span> Min order <b>{sym}{minFormatted}</b>
          </span>
        </>
      );
    } else {
      const n = deliveryZones.length;
      if (!n) {
        return (
          <>
            <MapPin className="ic" style={{ width: '15px', height: '15px' }} />
            <span>Add at least one area so customers can check out for delivery.</span>
          </>
        );
      } else {
        const fees = deliveryZones.map(z => z.fee).filter(f => typeof f === 'number' && !isNaN(f));
        const times = deliveryZones.map(z => z.time).filter(t => typeof t === 'number' && !isNaN(t));
        
        const loFee = fees.length ? Math.min(...fees) : 0;
        const hiFee = fees.length ? Math.max(...fees) : 0;
        const feeStr = loFee === hiFee ? `${sym}${loFee.toFixed(2)}` : `${sym}${loFee.toFixed(2)}–${sym}${hiFee.toFixed(2)}`;

        const loTime = times.length ? Math.min(...times) : 0;
        const hiTime = times.length ? Math.max(...times) : 0;
        const tStr = loTime === hiTime ? `${loTime} min` : `${loTime}–${hiTime} min`;

        return (
          <>
            <MapPin className="ic" style={{ width: '15px', height: '15px' }} />
            <span>
              <b>{n}</b> area{n > 1 ? 's' : ''} <span className="sep">·</span> Fee <b>{feeStr}</b> <span className="sep">·</span> <b>{tStr}</b> <span className="sep">·</span> Min order <b>{sym}{minFormatted}</b>
            </span>
          </>
        );
      }
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-wrap">
          <div className="toast">
            {toastIcon === 'check' && <Check className="ic text-success" style={{ width: '18px', height: '18px' }} />}
            {toastIcon === 'bike' && <Bike className="ic" style={{ width: '18px', height: '18px' }} />}
            {toastIcon === 'pause-circle' && <PauseCircle className="ic" style={{ width: '18px', height: '18px' }} />}
            {toastIcon === 'trash-2' && <Trash2 className="ic text-danger" style={{ width: '18px', height: '18px' }} />}
            {toastIcon === 'map-pin' && <MapPin className="ic" style={{ width: '18px', height: '18px' }} />}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Delivery</h1>
          <p className="page-sub">Turn delivery on, set the wait time customers see, and the rules that gate every delivery order.</p>
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

      <section data-screen-label="Delivery settings">
        <div className="card">
          
          {/* Status Header */}
          <div className={`svc-status ${deliveryEnabled ? 'on' : ''}`} style={{ borderBottom: '1px solid var(--line)' }}>
            <div className="svc-ic">
              <Bike className="ic" />
            </div>
            <div>
              <div className="svc-h">
                <span>Accepting delivery orders</span>
                <span className={`svc-pill ${deliveryEnabled ? 'live' : 'paused'}`}>
                  <span className="dot"></span>
                  <span>{deliveryEnabled ? 'Live on storefront' : 'Paused'}</span>
                </span>
              </div>
              <div className="svc-sub">
                {deliveryEnabled 
                  ? 'Customers can order delivery now. Fee and ETA are pulled from the rules below.'
                  : 'When off, the delivery option is hidden from the storefront and existing baskets switch to pick-up.'}
              </div>
            </div>
            <div className="svc-act">
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={deliveryEnabled}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setDeliveryEnabled(nextVal);
                    triggerToast(`Delivery ${nextVal ? 'enabled' : 'paused'}`, nextVal ? 'bike' : 'pause-circle');
                  }}
                />
                <span className="track"></span>
              </label>
            </div>
          </div>

          {/* Minimum order Rule Section */}
          <div className="svc-section" aria-disabled={!deliveryEnabled}>
            <div className="svc-section-head">
              <div className="svc-section-title">Minimum order</div>
              <div className="svc-section-sub">The smallest basket you'll send out for delivery. Applies to every area.</div>
            </div>
            <div className="svc-fields">
              <div className="field">
                <label className="label" htmlFor="dlMin">Minimum order value</label>
                <div className="money-input">
                  <span className="pfx">{sym}</span>
                  <input 
                    className="input" 
                    type="number" 
                    min="0" 
                    step="0.5" 
                    id="dlMin" 
                    placeholder="0.00"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                  />
                </div>
                <p className="hint" style={{ fontSize: '11.5px', color: 'var(--ink-3)', marginTop: '6px', lineHeight: '1.4' }}>
                  Orders below this can't check out for delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery areas: General vs Custom */}
          <div className="svc-section" aria-disabled={!deliveryEnabled}>
            <div className="svc-section-head">
              <div className="svc-section-title">Delivery fee &amp; time</div>
              <div className="svc-section-sub">Charge one flat rate everywhere, or tune the fee and ETA for each area you deliver to.</div>
            </div>

            <div className="mode-switch" role="radiogroup" aria-label="Delivery pricing mode" style={{ marginBottom: '18px' }}>
              <button 
                type="button" 
                className={`mode-card ${deliveryMode === 'general' ? 'active' : ''}`}
                onClick={() => {
                  setDeliveryMode('general');
                  triggerToast('One rate for all areas', 'globe');
                }}
                role="radio"
                aria-checked={deliveryMode === 'general'}
              >
                <span className="mode-radio"></span>
                <span className="mode-ic"><Globe className="ic" style={{ width: '18px', height: '18px' }} /></span>
                <span className="mode-txt">
                  <span className="mode-name">Same everywhere</span>
                  <span className="mode-sub">One delivery fee and time for every order.</span>
                </span>
              </button>
              
              <button 
                type="button" 
                className={`mode-card ${deliveryMode === 'custom' ? 'active' : ''}`}
                onClick={() => {
                  setDeliveryMode('custom');
                  triggerToast('Custom areas enabled', 'map-pin');
                }}
                role="radio"
                aria-checked={deliveryMode === 'custom'}
              >
                <span className="mode-radio"></span>
                <span className="mode-ic"><MapPin className="ic" style={{ width: '18px', height: '18px' }} /></span>
                <span className="mode-txt">
                  <span className="mode-name">Custom by area</span>
                  <span className="mode-sub">A different fee and time per area.</span>
                </span>
              </button>
            </div>

            {/* GENERAL Flat rate pricing panel */}
            {deliveryMode === 'general' && (
              <div className="mode-panel show" id="dlGeneralPanel">
                <div className="svc-fields">
                  <div className="field">
                    <label className="label" htmlFor="dlFee">Delivery fee</label>
                    <div className="money-input">
                      <span className="pfx">{sym}</span>
                      <input 
                        className="input" 
                        type="number" 
                        min="0" 
                        step="0.5" 
                        id="dlFee" 
                        placeholder="0.00"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="dlTime">Delivery time</label>
                    <div className="time-input">
                      <input 
                        type="number" 
                        min="5" 
                        max="240" 
                        step="5" 
                        id="dlTime" 
                        aria-label="Delivery time in minutes"
                        value={deliveryWait}
                        onChange={(e) => setDeliveryWait(e.target.value)}
                      />
                      <span className="suffix">min</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOM zone mapping panel */}
            {deliveryMode === 'custom' && (
              <div className="mode-panel show" id="dlCustomPanel">
                {deliveryZones.length > 0 && (
                  <div className="zone-head">
                    <span>Area</span>
                    <span>Delivery fee</span>
                    <span>Time</span>
                  </div>
                )}

                <div className="zone-list">
                  {deliveryZones.map((zone, idx) => (
                    <div 
                      key={zone.id}
                      className={`zone-row ${draggedIndex === idx ? 'dragging' : ''}`}
                      draggable={draggableRowId === zone.id}
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      style={{ transition: 'opacity 0.15s, transform 0.15s' }}
                    >
                      {confirmDeleteId === zone.id ? (
                        /* Inline Deletion Confirmation layout */
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr auto auto', width: '100%', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--ink)' }}>
                            Remove <b>{zone.name || 'this area'}</b>?
                          </span>
                          <button 
                            type="button" 
                            className="btn btn-ghost btn-sm"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveZone(zone.id)}
                          >
                            <Trash2 className="ic" style={{ width: '14px', height: '14px' }} />
                            <span>Remove</span>
                          </button>
                        </div>
                      ) : (
                        /* Regular Zone inputs */
                        <>
                          <button 
                            type="button" 
                            className="zone-grip" 
                            aria-label="Drag to reorder"
                            onPointerDown={() => setDraggableRowId(zone.id)}
                            onPointerUp={() => setDraggableRowId(null)}
                            style={{ cursor: 'grab' }}
                          >
                            <GripVertical className="ic" style={{ width: '16px', height: '16px' }} />
                          </button>
                          
                          <input 
                            className="zname" 
                            type="text" 
                            value={zone.name}
                            onChange={(e) => handleUpdateZone(zone.id, 'name', e.target.value)}
                            placeholder="Area name" 
                            aria-label="Area name" 
                          />
                          
                          <label className="zone-affix money">
                            <span className="pfx">{sym}</span>
                            <input 
                              className="zfee" 
                              type="number" 
                              min="0" 
                              step="0.5" 
                              value={zone.fee === '' ? '' : (parseFloat(zone.fee) || 0)}
                              onChange={(e) => handleUpdateZone(zone.id, 'fee', e.target.value === '' ? '' : parseFloat(e.target.value))}
                              placeholder="0.00" 
                              aria-label="Delivery fee" 
                            />
                          </label>
                          
                          <label className="zone-affix time ztime-cell">
                            <input 
                              className="ztime" 
                              type="number" 
                              min="5" 
                              max="240" 
                              step="5" 
                              value={zone.time === '' ? '' : (parseInt(zone.time) || 0)}
                              onChange={(e) => handleUpdateZone(zone.id, 'time', e.target.value === '' ? '' : parseInt(e.target.value))}
                              placeholder="—" 
                              aria-label="Delivery time" 
                            />
                            <span className="sfx">min</span>
                          </label>
                          
                          <button 
                            type="button" 
                            className="zone-del" 
                            aria-label="Remove area"
                            onClick={() => setConfirmDeleteId(zone.id)}
                          >
                            <Trash2 className="ic" style={{ width: '16px', height: '16px' }} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {deliveryZones.length === 0 && (
                  <div className="zone-empty show" id="dlZoneEmpty">
                    <div className="ze-ic"><Map className="ic" style={{ width: '22px', height: '22px' }} /></div>
                    <div className="ze-title">No areas yet</div>
                    <div className="ze-sub">Add the neighbourhoods or zones you deliver to and set a fee and time for each.</div>
                  </div>
                )}
                
                <button 
                  type="button" 
                  className="zone-add" 
                  onClick={handleAddArea}
                >
                  <Plus className="ic" style={{ width: '16px', height: '16px' }} />
                  <span>Add area</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom dynamic Preview Strip */}
          <div className="svc-preview">
            {renderPreviewContent()}
          </div>

        </div>
      </section>
    </div>
  );
}

export default function ManagerDeliveryPage() {
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
      <DeliveryPageContent />
    </Suspense>
  );
}

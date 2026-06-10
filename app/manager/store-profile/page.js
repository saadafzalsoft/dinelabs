'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Clock,
  Bike,
  Plus,
  ShoppingBag,
  Armchair,
  Bell,
  Settings,
  Check,
  Info,
  Printer,
  Save,
  User,
  X,
  Sliders,
  ChevronRight
} from 'lucide-react';

function StoreProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hours'); // 'hours' | 'delivery' | 'pickup' | 'tables' | 'notifications'

  // Settings states
  const [openingHours, setOpeningHours] = useState([]);
  const [deliveryWait, setDeliveryWait] = useState(40);
  const [pickupWait, setPickupWait] = useState(20);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [address, setAddress] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Notifications channels states
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappRecipient, setWhatsappRecipient] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState('');

  // Physical tables list
  const [tables, setTables] = useState([]);
  
  // Table Creation form states
  const [newTableName, setNewTableName] = useState('');
  const [newTableChairs, setNewTableChairs] = useState('4');
  const [newTableLocation, setNewTableLocation] = useState('Indoor');
  const [newTableShape, setNewTableShape] = useState('square');
  const [newTableX, setNewTableX] = useState(50);
  const [newTableY, setNewTableY] = useState(50);
  const [newTableView, setNewTableView] = useState('Regular');
  
  // Selected table template QR preview
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingTable, setBookingTable] = useState(null);

  // Sync state from query parameters tab on change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['hours', 'delivery', 'pickup', 'tables', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Fetch initial profile configurations and tables list
  const fetchProfileAndTables = async () => {
    try {
      const res = await fetch('/api/tenant/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setOpeningHours(data.openingHours || []);
        setDeliveryWait(data.waitTimes?.delivery || 40);
        setPickupWait(data.waitTimes?.pickup || 20);
        setBaseCurrency(data.baseCurrency || 'USD');
        setAddress(data.address || '');
        setGoogleMapsLink(data.googleMapsLink || '');
        setDeliveryFee(data.deliveryFee ?? 0);

        // Populate notification settings
        setEmailEnabled(data.notifications?.emailEnabled || false);
        setEmailRecipient(data.notifications?.emailRecipient || '');
        setWhatsappEnabled(data.notifications?.whatsappEnabled || false);
        setWhatsappRecipient(data.notifications?.whatsappRecipient || '');
        setTelegramEnabled(data.notifications?.telegramEnabled || false);
        setTelegramChatId(data.notifications?.telegramChatId || '');
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await fetch('/api/tables');
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndTables();
  }, []);

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleHourToggle = (dayIndex) => {
    const updated = openingHours.map((h, idx) => {
      if (idx === dayIndex) {
        return { ...h, isOpen: !h.isOpen };
      }
      return h;
    });
    setOpeningHours(updated);
  };

  const handleHourChange = (dayIndex, field, value) => {
    const updated = openingHours.map((h, idx) => {
      if (idx === dayIndex) {
        return { ...h, [field]: value };
      }
      return h;
    });
    setOpeningHours(updated);
  };

  // Save settings (Opening hours, Wait details, Alerts channels)
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          openingHours,
          waitTimes: { delivery: parseInt(deliveryWait), pickup: parseInt(pickupWait) },
          baseCurrency,
          deliveryFee: parseFloat(deliveryFee),
          address,
          googleMapsLink,
          notifications: {
            emailEnabled,
            emailRecipient,
            whatsappEnabled,
            whatsappRecipient,
            telegramEnabled,
            telegramChatId
          }
        })
      });

      if (res.ok) {
        triggerToast('Configurations saved successfully!');
      } else {
        alert('Failed saving configurations');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Add a physical table placement
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableName.trim() || !newTableChairs) return;

    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTableName.trim(),
          chairs: parseInt(newTableChairs),
          location: newTableLocation,
          shape: newTableShape,
          x: parseFloat(newTableX),
          y: parseFloat(newTableY),
          view: newTableView
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTables([...tables, data.table]);
        setNewTableName('');
        setNewTableChairs(4);
        triggerToast(`Table "${data.table.name}" added`);
      } else {
        alert(data.error || 'Failed adding table');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a physical table
  const handleDeleteTable = async (id, name) => {
    if (!confirm(`Are you sure you want to delete Table "${name}"?`)) return;

    try {
      const res = await fetch('/api/tables', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setTables(tables.filter(t => t._id !== id));
        if (selectedTable?._id === id) {
          setSelectedTable(null);
        }
        triggerToast(`Table "${name}" deleted`);
      } else {
        alert('Failed deleting table');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle table occupancy status (Mark Booked / Occupied) in real-time
  const handleToggleOccupancy = async (table) => {
    const nextBookedState = !table.isBooked;
    try {
      const res = await fetch('/api/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: table._id, isBooked: nextBookedState, bookedExpiresAt: null })
      });

      if (res.ok) {
        setTables(tables.map(t => t._id === table._id ? { ...t, isBooked: nextBookedState, bookedExpiresAt: null } : t));
        if (selectedTable?._id === table._id) {
          setSelectedTable({ ...selectedTable, isBooked: nextBookedState, bookedExpiresAt: null });
        }
        triggerToast(`Table "${table.name}" is now available`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmBooking = async (table, durationMinutes) => {
    let expiresAt = null;
    if (durationMinutes > 0) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + durationMinutes);
      expiresAt = date.toISOString();
    }
    
    try {
      const res = await fetch('/api/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: table._id, 
          isBooked: true, 
          bookedExpiresAt: expiresAt 
        })
      });

      if (res.ok) {
        setTables(tables.map(t => t._id === table._id ? { ...t, isBooked: true, bookedExpiresAt: expiresAt } : t));
        if (selectedTable?._id === table._id) {
          setSelectedTable({ ...selectedTable, isBooked: true, bookedExpiresAt: expiresAt });
        }
        triggerToast(`Table "${table.name}" is now booked ${durationMinutes > 0 ? `for ${durationMinutes} mins` : 'indefinitely'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatExpiry = (expiresAt) => {
    if (!expiresAt) return 'Booked Indefinitely';
    const diffMs = new Date(expiresAt) - new Date();
    if (diffMs <= 0) return 'Expiry imminent';
    const diffMins = Math.ceil(diffMs / 60000);
    if (diffMins < 60) {
      return `Booked (expires in ${diffMins}m)`;
    }
    const diffHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return `Booked (expires in ${diffHours}h ${remMins}m)`;
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    router.push(`/manager/store-profile?tab=${newTab}`);
  };

  // Generate Table QR Code Redirect URL
  const getTableUrl = (tableName) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${settings.slug}?table=${tableName}`;
    }
    return `https://dinelabs.co/${settings.slug}?table=${tableName}`;
  };

  if (loading || !settings) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h3 className="mut3">Loading store settings...</h3>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      {/* Dynamic Title Headers */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Store settings</h1>
          <p className="page-sub">Configure wait times, operating hours, seating tables, and notification alerts.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          onClick={() => handleTabChange('hours')} 
          className={`tab ${activeTab === 'hours' ? 'active' : ''}`}
        >
          ⏰ Opening Hours
        </button>
        <button 
          onClick={() => handleTabChange('delivery')} 
          className={`tab ${activeTab === 'delivery' ? 'active' : ''}`}
        >
          🛵 Delivery
        </button>
        <button 
          onClick={() => handleTabChange('pickup')} 
          className={`tab ${activeTab === 'pickup' ? 'active' : ''}`}
        >
          🛍️ Pick-up
        </button>
        <button 
          onClick={() => handleTabChange('tables')} 
          className={`tab ${activeTab === 'tables' ? 'active' : ''}`}
        >
          🍽️ Dine-in Tables
        </button>
        <button 
          onClick={() => handleTabChange('notifications')} 
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
        >
          🔔 Order Alerts
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'tables' ? '1fr 340px' : '1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left configurations card panel */}
        <div className="card">
          
          {/* ============================================================
              TAB 1: OPENING HOURS & CURRENCY
              ============================================================ */}
          {activeTab === 'hours' && (
            <div className="svc-grid">
              
              {/* Status Header */}
              <div className="svc-status on">
                <span className="svc-ic"><Clock className="ic" /></span>
                <div>
                  <div className="svc-h">Operating Hours &amp; Currency</div>
                  <div className="svc-sub">Set your weekly business scheduler and base currency.</div>
                </div>
              </div>

              <div className="svc-section">
                <div className="svc-fields" style={{ maxWidth: '320px', marginBottom: '24px' }}>
                  <div className="field">
                    <label className="label">Base Currency</label>
                    <select 
                      className="select"
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="LBP">LBP (ل.ل)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="svc-section-head">
                  <div className="svc-section-title">Weekly Schedule</div>
                  <div className="svc-section-sub">Toggle operating days and adjust open/close hours.</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  {openingHours.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem' }}>
                      <span style={{ width: '100px', fontWeight: '700' }}>{h.day}</span>
                      
                      <label className="switch">
                        <input 
                          type="checkbox"
                          checked={h.isOpen}
                          onChange={() => handleHourToggle(idx)}
                        />
                        <span className="track"></span>
                      </label>
                      
                      <span className={`pill ${h.isOpen ? 'pill-pos' : 'pill-soft'}`} style={{ height: '22px', width: '80px', justifyContent: 'center' }}>
                        {h.isOpen ? 'Open' : 'Closed'}
                      </span>

                      {h.isOpen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="time" 
                            value={h.open} 
                            onChange={(e) => handleHourChange(idx, 'open', e.target.value)}
                            className="input"
                            style={{ height: '34px', padding: '6px 12px', width: '110px' }}
                          />
                          <span className="mut3">to</span>
                          <input 
                            type="time" 
                            value={h.close} 
                            onChange={(e) => handleHourChange(idx, 'close', e.target.value)}
                            className="input"
                            style={{ height: '34px', padding: '6px 12px', width: '110px' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="btn btn-primary btn-lg"
                  style={{ minWidth: '200px' }}
                >
                  <Save className="ic" />
                  <span>{saving ? 'Saving...' : 'Save schedule'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ============================================================
              TAB 2: DELIVERY CONFIGS
              ============================================================ */}
          {activeTab === 'delivery' && (
            <div className="svc-grid">
              
              <div className="svc-status on">
                <span className="svc-ic"><Bike className="ic" /></span>
                <div>
                  <div className="svc-h">Delivery Settings</div>
                  <div className="svc-sub">Set dispatch delays and customer waiting times.</div>
                </div>
              </div>

              <div className="svc-section">
                <div className="svc-fields" style={{ maxWidth: '400px', marginBottom: '24px' }}>
                  <div className="field">
                    <label className="label">Default Cooking / Kitchen Prep Time</label>
                    <div className="range-input">
                      <input 
                        type="number" 
                        value={deliveryWait}
                        onChange={(e) => setDeliveryWait(e.target.value)}
                        placeholder="40"
                      />
                      <span className="suffix">minutes</span>
                    </div>
                  </div>

                  <div className="field" style={{ marginTop: '16px' }}>
                    <label className="label">Delivery Fee ({baseCurrency})</label>
                    <div className="range-input">
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        placeholder="0"
                      />
                      <span className="suffix">{baseCurrency}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', marginTop: '4px', display: 'block' }}>Set to 0 for free delivery</span>
                  </div>
                </div>

                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="btn btn-primary btn-lg"
                >
                  <Save className="ic" />
                  <span>{saving ? 'Saving...' : 'Save settings'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ============================================================
              TAB 3: PICKUP & ADDRESS CONFIGS
              ============================================================ */}
          {activeTab === 'pickup' && (
            <div className="svc-grid">
              
              <div className="svc-status on">
                <span className="svc-ic"><ShoppingBag className="ic" /></span>
                <div>
                  <div className="svc-h">Pick-up &amp; Address Location</div>
                  <div className="svc-sub">Manage client collections and geo-address.</div>
                </div>
              </div>

              <div className="svc-section">
                <div className="svc-fields" style={{ maxWidth: '540px', marginBottom: '24px' }}>
                  <div className="field">
                    <label className="label">Preparation wait time</label>
                    <div className="range-input" style={{ maxWidth: '240px' }}>
                      <input 
                        type="number" 
                        value={pickupWait}
                        onChange={(e) => setPickupWait(e.target.value)}
                        placeholder="20"
                      />
                      <span className="suffix">minutes</span>
                    </div>
                  </div>

                  <div className="field field-wide" style={{ marginTop: '16px' }}>
                    <label className="label">Restaurant Physical Address</label>
                    <input 
                      type="text" 
                      className="input"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 12 Leselidze St, Main Building"
                    />
                  </div>

                  <div className="field field-wide" style={{ marginTop: '16px' }}>
                    <label className="label">Google Maps Directions Link</label>
                    <input 
                      type="url" 
                      className="input"
                      value={googleMapsLink}
                      onChange={(e) => setGoogleMapsLink(e.target.value)}
                      placeholder="e.g. https://maps.google.com/?q=..."
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="btn btn-primary btn-lg"
                >
                  <Save className="ic" />
                  <span>{saving ? 'Saving...' : 'Save settings'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ============================================================
              TAB 4: DINE-IN TABLES LIST
              ============================================================ */}
          {activeTab === 'tables' && (
            <div className="svc-grid" style={{ padding: '22px' }}>
              
              <div className="svc-section-head" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
                <div className="svc-section-title">Physical Dining Tables</div>
                <div className="svc-section-sub">Configure physical layouts, seats counts, shapes, and positions.</div>
              </div>

              {/* Table Creation inline Form */}
              <form onSubmit={handleAddTable} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', backgroundColor: 'var(--surface-2)', padding: '20px', borderRadius: '16px' }}>
                <div className="field">
                  <label className="label">Table Code / Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="e.g. Table 1"
                    required
                  />
                </div>

                <div className="field" style={{ display: 'none' }}>
                  <label className="label">Number of Chairs</label>
                  <select 
                    className="select" 
                    value={newTableChairs}
                    onChange={(e) => setNewTableChairs(e.target.value)}
                  >
                    <option value="2">2 Chairs</option>
                    <option value="4">4 Chairs</option>
                    <option value="6">6 Chairs</option>
                    <option value="8">8 Chairs</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Table Shape</label>
                  <select 
                    className="select" 
                    value={newTableShape}
                    onChange={(e) => setNewTableShape(e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="round">Round / Circle</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Table Location Section</label>
                  <select 
                    className="select" 
                    value={newTableLocation}
                    onChange={(e) => setNewTableLocation(e.target.value)}
                  >
                    <option value="Indoor">Indoor (Main Hall)</option>
                    <option value="Terrace">Terrace (Outdoor)</option>
                    <option value="Bar Area">Bar Area</option>
                    <option value="VIP Section">VIP Section</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary">
                    <Plus className="ic" />
                    <span>Create Table</span>
                  </button>
                </div>
              </form>

              {/* Tables grid list */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {tables.map(table => (
                  <div 
                    key={table._id}
                    className={`card`}
                    onClick={() => setSelectedTable(table)}
                    style={{ 
                      padding: '16px', 
                      cursor: 'pointer',
                      border: selectedTable?._id === table._id ? '2px solid var(--ink)' : '1px solid var(--line)',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTable(table._id, table.name);
                      }}
                      className="iconbtn del"
                      style={{ position: 'absolute', top: '10px', right: '10px', width: '24px', height: '24px' }}
                    >
                      <X style={{ width: '12px', height: '12px' }} />
                    </button>

                    <div style={{ fontSize: '1.25rem', marginBottom: '6px' }}>🍽️</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{table.name}</div>
                    
                    <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: '700', margin: '4px 0 10px' }}>
                      📍 {table.location}
                    </div>

                    {table.isBooked && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--neg)', fontWeight: '800', marginBottom: '8px', backgroundColor: 'var(--neg-bg)', padding: '4px 8px', borderRadius: '6px', width: '100%', textAlign: 'center' }}>
                        ⏰ {formatExpiry(table.bookedExpiresAt)}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (table.isBooked) {
                          handleToggleOccupancy(table);
                        } else {
                          setBookingTable(table);
                        }
                      }}
                      className="btn btn-block btn-sm"
                      style={{ 
                        backgroundColor: table.isBooked ? 'var(--neg-bg)' : 'var(--pos-bg)',
                        color: table.isBooked ? 'var(--neg)' : 'var(--pos)',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.72rem'
                      }}
                    >
                      {table.isBooked ? 'Force Release (Open)' : 'Available (Book Now)'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Booking Duration Modal Dialog */}
              {bookingTable && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1010,
                  backdropFilter: 'blur(4px)'
                }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '28px',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid var(--line)'
                  }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', color: 'var(--ink)' }}>
                      Book {bookingTable.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', marginBottom: '20px' }}>
                      Select duration to lock this table. Once the time is up, the table will automatically open for booking.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                      {[
                        { label: '15 Minutes', value: 15 },
                        { label: '30 Minutes', value: 30 },
                        { label: '1 Hour', value: 60 },
                        { label: '2 Hours', value: 120 },
                        { label: '3 Hours', value: 180 },
                        { label: 'Indefinite (Manual Release)', value: 0 }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            handleConfirmBooking(bookingTable, opt.value);
                            setBookingTable(null);
                          }}
                          className="btn btn-block"
                          style={{
                            backgroundColor: 'var(--surface-2)',
                            color: 'var(--ink)',
                            border: '1px solid var(--line)',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            padding: '12px',
                            borderRadius: '12px',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{opt.label}</span>
                          <span style={{ fontSize: '12px', opacity: 0.6 }}>⚡ Select</span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingTable(null)}
                      className="btn btn-block"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--ink-3)',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Floor Plan Sketch Canvas */}
              <div style={{ marginTop: '28px', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
                <div className="svc-section-head">
                  <div className="svc-section-title">🗺️ Interactive Floor Plan Layout Sketch Board</div>
                  <div className="svc-section-sub">Select any table to edit its location coordinates using the right side sliders.</div>
                </div>

                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  backgroundColor: '#f9fafb',
                  border: '2px dashed var(--line-strong)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginTop: '16px'
                }}>
                  {/* Plant decorations */}
                  <div style={{ position: 'absolute', top: '15%', left: '8%', fontSize: '1.1rem' }}>🌿</div>
                  <div style={{ position: 'absolute', top: '15%', right: '8%', fontSize: '1.1rem' }}>🌿</div>
                  <div style={{ position: 'absolute', top: '55%', left: '20%', fontSize: '1.1rem' }}>🌿</div>
                  <div style={{ position: 'absolute', top: '85%', right: '8%', fontSize: '1.1rem' }}>🌿</div>

                  {/* Window seating label */}
                  <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '32px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: 'var(--ink-3)', letterSpacing: '1px' }}>
                    WINDOW SEATING AREA
                  </div>

                  {/* Entrance Door */}
                  <div style={{ position: 'absolute', bottom: 0, left: '35%', right: '35%', height: '32px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: 'var(--ink-3)', letterSpacing: '1px', backgroundColor: '#f1f1f1' }}>
                    MAIN ENTRANCE
                  </div>

                  {/* Canvas mapped tables */}
                  {tables.map(table => {
                    const isSelected = selectedTable?._id === table._id;
                    const isRound = table.shape === 'round';
                    const chairsCount = parseInt(table.chairs) || 4;

                    let tableBg = '#ffffff';
                    let border = '2px solid var(--line-strong)';
                    let color = 'var(--ink-2)';

                    if (table.isBooked) {
                      tableBg = 'var(--surface-3)';
                      color = 'var(--ink-3)';
                    } else if (isSelected) {
                      tableBg = 'var(--warn-bg)';
                      border = '2px solid var(--warn)';
                      color = 'var(--warn)';
                    } else {
                      tableBg = 'var(--pos-bg)';
                      border = '2px solid var(--pos)';
                      color = 'var(--pos)';
                    }

                    // Render circular chairs orbits surrounding table
                    const chairs = [];

                    return (
                      <div
                        key={table._id}
                        onClick={() => setSelectedTable(table)}
                        style={{
                          position: 'absolute',
                          top: `${table.y || 50}%`,
                          left: `${table.x || 50}%`,
                          transform: 'translate(-50%, -50%)',
                          width: '42px', height: '42px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', zIndex: isSelected ? 10 : 3
                        }}
                      >
                        {chairs}
                        
                        <div style={{
                          width: '26px', height: '26px',
                          borderRadius: isRound ? '50%' : '6px',
                          backgroundColor: tableBg,
                          border: border,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: '900', color
                        }}>
                          {table.name.replace('Table ', '').replace('Booth ', '')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================
              TAB 5: ORDER ALERTS NOTIFICATIONS
              ============================================================ */}
          {activeTab === 'notifications' && (() => {
            const isEmailAssigned = settings?.assignedNotifications?.email !== false;
            const isWhatsappAssigned = !!settings?.assignedNotifications?.whatsapp;
            const isTelegramAssigned = !!settings?.assignedNotifications?.telegram;

            return (
              <div className="svc-grid">
                
                <div className="svc-status on">
                  <span className="svc-ic"><Bell className="ic" /></span>
                  <div>
                    <div className="svc-h">Notification Channels</div>
                    <div className="svc-sub">Enable or disable instant order alerts. Notifications will be delivered automatically using company configurations.</div>
                  </div>
                </div>

                <div className="svc-section">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', marginBottom: '24px' }}>
                    
                    {/* Email Channel */}
                    <div style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--surface)', opacity: isEmailAssigned ? 1 : 0.5, position: 'relative' }}>
                      {!isEmailAssigned && (
                        <span className="tag" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.65rem', fontWeight: 'bold', backgroundColor: 'var(--surface-3)', color: 'var(--ink-3)' }}>
                          🔒 Locked: Request Admin to Activate
                        </span>
                      )}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', cursor: isEmailAssigned ? 'pointer' : 'not-allowed', fontSize: '0.9rem', marginBottom: 0 }}>
                        <input 
                          type="checkbox"
                          checked={emailEnabled}
                          disabled={!isEmailAssigned}
                          onChange={(e) => setEmailEnabled(e.target.checked)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span>📧 Email Order Alerts</span>
                      </label>
                    </div>

                    {/* WhatsApp Channel */}
                    <div style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--surface)', opacity: isWhatsappAssigned ? 1 : 0.5, position: 'relative' }}>
                      {!isWhatsappAssigned && (
                        <span className="tag" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.65rem', fontWeight: 'bold', backgroundColor: 'var(--surface-3)', color: 'var(--ink-3)' }}>
                          🔒 Locked: Request Admin to Activate
                        </span>
                      )}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', cursor: isWhatsappAssigned ? 'pointer' : 'not-allowed', fontSize: '0.9rem', marginBottom: 0 }}>
                        <input 
                          type="checkbox"
                          checked={whatsappEnabled}
                          disabled={!isWhatsappAssigned}
                          onChange={(e) => setWhatsappEnabled(e.target.checked)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span>💬 WhatsApp Alerts</span>
                      </label>
                    </div>

                    {/* Telegram Channel */}
                    <div style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--surface)', opacity: isTelegramAssigned ? 1 : 0.5, position: 'relative' }}>
                      {!isTelegramAssigned && (
                        <span className="tag" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.65rem', fontWeight: 'bold', backgroundColor: 'var(--surface-3)', color: 'var(--ink-3)' }}>
                          🔒 Locked: Request Admin to Activate
                        </span>
                      )}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', cursor: isTelegramAssigned ? 'pointer' : 'not-allowed', fontSize: '0.9rem', marginBottom: 0 }}>
                        <input 
                          type="checkbox"
                          checked={telegramEnabled}
                          disabled={!isTelegramAssigned}
                          onChange={(e) => setTelegramEnabled(e.target.checked)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span>🤖 Telegram Bot Alerts</span>
                      </label>
                    </div>

                  </div>

                  <button 
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="btn btn-primary btn-lg"
                  >
                    <Save className="ic" />
                    <span>{saving ? 'Saving...' : 'Save settings'}</span>
                  </button>
                </div>

              </div>
            );
          })()}

        </div>

        {/* Right side helper canvas area for sketcher configuration */}
        {activeTab === 'tables' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Coordinate editor panel */}
            {selectedTable ? (
              <div className="card" style={{ padding: '20px', textAlign: 'left' }}>
                <h4 style={{ fontFamily: 'var(--font)', fontSize: '0.95rem', fontWeight: '800', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📐 Layout Coordinates</span>
                  <button 
                    onClick={() => setSelectedTable(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', fontSize: '0.78rem' }}
                  >
                    Clear select
                  </button>
                </h4>

                <div className="field">
                  <label className="label">Table Code Name</label>
                  <input 
                    type="text" 
                    className="input"
                    value={selectedTable.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedTable(prev => ({ ...prev, name: val }));
                      setTables(prev => prev.map(t => t._id === selectedTable._id ? { ...t, name: val } : t));
                    }}
                    style={{ height: '36px', fontSize: '0.8rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="field" style={{ display: 'none' }}>
                    <label className="label">Chairs</label>
                    <select 
                      className="select"
                      value={selectedTable.chairs}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSelectedTable(prev => ({ ...prev, chairs: val }));
                        setTables(prev => prev.map(t => t._id === selectedTable._id ? { ...t, chairs: val } : t));
                      }}
                      style={{ height: '36px', fontSize: '0.8rem' }}
                    >
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="6">6</option>
                      <option value="8">8</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Shape</label>
                    <select 
                      className="select"
                      value={selectedTable.shape || 'square'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedTable(prev => ({ ...prev, shape: val }));
                        setTables(prev => prev.map(t => t._id === selectedTable._id ? { ...t, shape: val } : t));
                      }}
                      style={{ height: '36px', fontSize: '0.8rem' }}
                    >
                      <option value="square">Square</option>
                      <option value="round">Round</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Area Section</label>
                  <select 
                    className="select"
                    value={selectedTable.location}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedTable(prev => ({ ...prev, location: val }));
                      setTables(prev => prev.map(t => t._id === selectedTable._id ? { ...t, location: val } : t));
                    }}
                    style={{ height: '36px', fontSize: '0.8rem' }}
                  >
                    <option value="Indoor">Indoor (Main Hall)</option>
                    <option value="Terrace">Terrace (Outdoor)</option>
                    <option value="Bar Area">Bar Area</option>
                    <option value="VIP Section">VIP Section</option>
                  </select>
                </div>

                <div className="field" style={{ margin: '8px 0 16px' }}>
                  <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Horizontal Position (X)</span>
                    <strong>{Math.round(selectedTable.x)}%</strong>
                  </label>
                  <input 
                    type="range"
                    min="5" max="95"
                    value={selectedTable.x}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSelectedTable(prev => ({ ...prev, x: val }));
                      setTables(prev => prev.map(t => t._id === selectedTable._id ? { ...t, x: val } : t));
                    }}
                    style={{ width: '100%', height: '6px', cursor: 'pointer' }}
                  />
                </div>

                <div className="field" style={{ margin: '8px 0 16px' }}>
                  <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Vertical Position (Y)</span>
                    <strong>{Math.round(selectedTable.y)}%</strong>
                  </label>
                  <input 
                    type="range"
                    min="5" max="95"
                    value={selectedTable.y}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSelectedTable(prev => ({ ...prev, y: val }));
                      setTables(prev => prev.map(t => t._id === selectedTable._id ? { ...t, y: val } : t));
                    }}
                    style={{ width: '100%', height: '6px', cursor: 'pointer' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/tables', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id: selectedTable._id,
                          name: selectedTable.name,
                          chairs: selectedTable.chairs,
                          location: selectedTable.location,
                          x: selectedTable.x,
                          y: selectedTable.y,
                          shape: selectedTable.shape,
                          view: selectedTable.view
                        })
                      });
                      if (res.ok) {
                        triggerToast('Coordinates saved!');
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="btn btn-primary btn-block"
                >
                  <Save className="ic" />
                  <span>Save Coordinates</span>
                </button>
              </div>
            ) : null}

            {/* Print QR code card preview block */}
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div className="card-title" style={{ fontSize: '0.9rem', marginBottom: '14px', justifyContent: 'center' }}>
                QR Ordering Card
              </div>
              
              {selectedTable ? (
                <div id="print-qr-card" style={{ border: '2px solid var(--ink)', borderRadius: '12px', padding: '16px', backgroundColor: '#ffffff', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.5px' }}>DineLabs</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--ink-3)', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px' }}>
                    {settings.name}
                  </div>

                  <div style={{ width: '120px', height: '120px', margin: '14px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '8px', border: '1px solid var(--line-2)', borderRadius: '8px' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getTableUrl(selectedTable.name))}`}
                      alt="QR Code"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.65rem', color: 'var(--ink-3)', fontWeight: 'bold' }}>SCAN TO BROWSE &amp; ORDER</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--neg)', marginTop: '4px', textTransform: 'uppercase' }}>
                    {selectedTable.name}
                  </div>

                  <div style={{ fontSize: '0.62rem', color: 'var(--ink-3)', marginTop: '4px' }}>
                    📍 {selectedTable.location}
                  </div>

                  <button
                    onClick={() => {
                      const printContent = document.getElementById('print-qr-card').outerHTML;
                      const win = window.open('', '_blank');
                      win.document.write(`
                        <html>
                          <head>
                            <title>Print QR - ${selectedTable.name}</title>
                            <style>
                              body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }
                              #print-qr-card { width: 300px; text-align: center; border: 3px solid #000; border-radius: 20px; padding: 30px; }
                            </style>
                          </head>
                          <body onload="window.print(); window.close();">
                            ${printContent}
                          </body>
                        </html>
                      `);
                      win.document.close();
                    }}
                    className="btn btn-outline btn-block"
                    style={{ marginTop: '16px', height: '34px', fontSize: '0.75rem' }}
                  >
                    <Printer className="ic" style={{ width: '13px', height: '13px' }} />
                    <span>Print QR Card</span>
                  </button>
                </div>
              ) : (
                <div style={{ color: 'var(--ink-3)', padding: '36px 0', fontSize: '0.8rem', fontWeight: '500' }}>
                  Select a dining table from the grid on the left to inspect, download, or print its concierge storefront QR code card.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default function ManagerStoreProfilePage() {
  return (
    <Suspense fallback={<h3>Loading store settings...</h3>}>
      <StoreProfilePageContent />
    </Suspense>
  );
}

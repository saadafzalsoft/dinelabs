'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function StoreProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hours'); // 'hours' | 'delivery' | 'pickup' | 'tables' | 'notifications'

  // Hours / Wait times states
  const [openingHours, setOpeningHours] = useState([]);
  const [deliveryWait, setDeliveryWait] = useState(40);
  const [pickupWait, setPickupWait] = useState(20);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [address, setAddress] = useState('');

  // Notifications channels states
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappRecipient, setWhatsappRecipient] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState('');

  // Real-Time physical tables list
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

        // Populate notification settings
        setEmailEnabled(data.notifications?.emailEnabled || false);
        setEmailRecipient(data.notifications?.emailRecipient || '');
        setWhatsappEnabled(data.notifications?.whatsappEnabled || false);
        setWhatsappRecipient(data.notifications?.whatsappRecipient || '');
        setTelegramEnabled(data.notifications?.telegramEnabled || false);
        setTelegramChatId(data.notifications?.telegramChatId || '');

        // Fetch physical tables from dynamic REST API
        const tablesRes = await fetch(`/api/tables`);
        if (tablesRes.ok) {
          const tablesData = await tablesRes.json();
          setTables(tablesData);
        }
      }
    } catch (err) {
      console.error('Failed fetching profiles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndTables();
  }, []);

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

  // Save operating hours, wait details, and notification channels
  const handleSaveSettings = async (e) => {
    e.preventDefault();
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
          address,
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
        alert('Configurations saved successfully!');
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
        setNewTableChairs('4');
        setNewTableLocation('Indoor');
        setNewTableShape('square');
        setNewTableX(50);
        setNewTableY(50);
        setNewTableView('Regular');
      } else {
        alert(data.error || 'Failed creating table');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a physical table
  const handleDeleteTable = async (id, name) => {
    if (!confirm(`Delete ${name} permanently?`)) return;

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
        body: JSON.stringify({ id: table._id, isBooked: nextBookedState })
      });

      if (res.ok) {
        setTables(tables.map(t => t._id === table._id ? { ...t, isBooked: nextBookedState } : t));
        if (selectedTable?._id === table._id) {
          setSelectedTable({ ...selectedTable, isBooked: nextBookedState });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    router.push(`/manager/store-profile?tab=${newTab}`);
  };

  if (loading || !settings) {
    return <h3>Loading store settings...</h3>;
  }

  // Generate Table QR Code Redirect URL
  const getTableUrl = (tableName) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${settings.slug}?table=${encodeURIComponent(tableName)}`;
    }
    return `https://dinelabs.co/${settings.slug}?table=${encodeURIComponent(tableName)}`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'tables' ? '1fr 320px' : '1fr', gap: '32px' }}>
      
      {/* Left Area settings forms */}
      <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
        
        {/* Settings Sub Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
          {[
            { id: 'hours', name: '⏰ Opening Hours' },
            { id: 'delivery', name: '🛵 Delivery' },
            { id: 'pickup', name: '🛍️ Pick-up & Location' },
            { id: 'tables', name: '🍽️ Dine-in Tables' },
            { id: 'notifications', name: '🔔 Order Alerts' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                fontWeight: '700',
                padding: '12px 24px',
                cursor: 'pointer',
                color: activeTab === t.id ? 'var(--text-main)' : 'var(--text-muted)',
                borderBottom: activeTab === t.id ? '3px solid var(--brand-red)' : '3px solid transparent',
                transition: 'var(--transition-smooth)',
                marginRight: '8px'
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Tab 1: Hours / Currency */}
        {activeTab === 'hours' && (
          <form onSubmit={handleSaveSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px', maxWidth: '300px' }}>
              <div className="form-group">
                <label className="form-label">Base Currency</label>
                <select 
                  className="form-control"
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="LBP">LBP (ل.ل)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: '800', marginBottom: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              Weekly Operating Hours
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {openingHours.map((h, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem' }}>
                  <span style={{ width: '100px', fontWeight: '700' }}>{h.day}</span>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox"
                      checked={h.isOpen}
                      onChange={() => handleHourToggle(idx)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{h.isOpen ? '🟢 Open' : '🔴 Closed'}</span>
                  </label>

                  {h.isOpen && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="time" 
                        value={h.open} 
                        onChange={(e) => handleHourChange(idx, 'open', e.target.value)}
                        className="form-control"
                        style={{ padding: '6px 12px', width: '110px' }}
                      />
                      <span>to</span>
                      <input 
                        type="time" 
                        value={h.close} 
                        onChange={(e) => handleHourChange(idx, 'close', e.target.value)}
                        className="form-control"
                        style={{ padding: '6px 12px', width: '110px' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={saving}
              style={{ width: '200px', fontSize: '0.85rem', padding: '10px' }}
            >
              {saving ? 'Saving changes...' : 'Save Operating Hours'}
            </button>
          </form>
        )}

        {/* Tab 2: Delivery settings */}
        {activeTab === 'delivery' && (
          <form onSubmit={handleSaveSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px', maxWidth: '300px' }}>
              <div className="form-group">
                <label className="form-label">Delivery Wait Time (minutes)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={deliveryWait}
                  onChange={(e) => setDeliveryWait(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={saving}
              style={{ width: '200px', fontSize: '0.85rem', padding: '10px' }}
            >
              {saving ? 'Saving changes...' : 'Save Delivery Settings'}
            </button>
          </form>
        )}

        {/* Tab 3: Pickup settings & Location Address */}
        {activeTab === 'pickup' && (
          <form onSubmit={handleSaveSettings}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxWidth: '500px' }}>
              <div className="form-group">
                <label className="form-label">Pick-up Wait Time (minutes)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={pickupWait}
                  onChange={(e) => setPickupWait(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Restaurant Location Address (shown at customer Pick-up checkout)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 2 Aleksandre Kazbegi avenue"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={saving}
              style={{ width: '200px', fontSize: '0.85rem', padding: '10px' }}
            >
              {saving ? 'Saving changes...' : 'Save Pick-up Settings'}
            </button>
          </form>
        )}

        {/* Tab 4: Dine-in Table Management */}
        {activeTab === 'tables' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Configure physical dining halls layout, assign maximum seating counts, set placement sectors (Terrace, Bar, etc.), and monitor real-time occupancies.
            </p>

            <form onSubmit={handleAddTable} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Table Code/Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Table 6"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  required
                  style={{ padding: '8px 12px' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Number of Chairs</label>
                <select 
                  className="form-control"
                  value={newTableChairs}
                  onChange={(e) => setNewTableChairs(e.target.value)}
                  style={{ padding: '8px 12px' }}
                >
                  <option value="2">2 Chairs</option>
                  <option value="4">4 Chairs</option>
                  <option value="6">6 Chairs</option>
                  <option value="8">8 Chairs</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Table Shape</label>
                <select 
                  className="form-control"
                  value={newTableShape}
                  onChange={(e) => setNewTableShape(e.target.value)}
                  style={{ padding: '8px 12px' }}
                >
                  <option value="square">Square</option>
                  <option value="round">Round / Circle</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Table Location</label>
                <select 
                  className="form-control"
                  value={newTableLocation}
                  onChange={(e) => setNewTableLocation(e.target.value)}
                  style={{ padding: '8px 12px' }}
                >
                  <option value="Indoor">Indoor (Main Hall)</option>
                  <option value="Terrace">Terrace (Outdoor)</option>
                  <option value="Bar Area">Bar Area</option>
                  <option value="VIP Section">VIP Section</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>View Description (e.g. Garden View)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Window Seating"
                  value={newTableView}
                  onChange={(e) => setNewTableView(e.target.value)}
                  style={{ padding: '8px 12px' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Horizontal (X)</span>
                  <strong>{newTableX}%</strong>
                </label>
                <input 
                  type="range"
                  min="5"
                  max="95"
                  className="form-control"
                  value={newTableX}
                  onChange={(e) => setNewTableX(parseInt(e.target.value))}
                  style={{ padding: 0, height: '8px', cursor: 'pointer', marginTop: '10px' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vertical (Y)</span>
                  <strong>{newTableY}%</strong>
                </label>
                <input 
                  type="range"
                  min="5"
                  max="95"
                  className="form-control"
                  value={newTableY}
                  onChange={(e) => setNewTableY(parseInt(e.target.value))}
                  style={{ padding: 0, height: '8px', cursor: 'pointer', marginTop: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  type="submit" 
                  className="checkout-btn" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px', height: '40px' }}
                >
                  + Create Table
                </button>
              </div>
            </form>

            {/* Tables Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {tables.map(table => (
                <div 
                  key={table._id}
                  onClick={() => setSelectedTable(table)}
                  style={{
                    backgroundColor: selectedTable?._id === table._id ? 'var(--brand-red-light)' : '#ffffff',
                    border: selectedTable?._id === table._id ? '2px solid var(--brand-red)' : '1px solid var(--border-light)',
                    borderRadius: '20px',
                    padding: '20px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'var(--transition-smooth)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                  }}
                >
                  {/* Delete Button */}
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTable(table._id, table.name);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '16px',
                      fontSize: '13px',
                      color: '#ef4444',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    title="Delete Table"
                  >
                    ✕
                  </span>

                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🍽️</span>
                  <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '4px' }}>{table.name}</strong>
                  
                  {/* Seating and location details */}
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '12px' }}>
                    🪑 {table.chairs} Seating · 📍 {table.location}
                  </div>

                  {/* Occupancy Indicator Toggle Slider */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleOccupancy(table);
                    }}
                    style={{
                      width: '100%',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      backgroundColor: table.isBooked ? '#fee2e2' : '#d1fae5',
                      color: table.isBooked ? '#ef4444' : '#10b981',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {table.isBooked ? '🔒 Occupied / Booked' : '🟢 Available'}
                  </button>
                </div>
              ))}
            </div>

            {/* Interactive Floor Plan Preview Canvas */}
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '800', marginTop: '36px', marginBottom: '8px' }}>
              🗺️ Interactive Floor Plan Sketch Board
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Click any table in the floor plan to edit its position, shape, and seats dynamically using the panel on the right.
            </p>

            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '4/3', 
              backgroundColor: '#f9fafb', 
              border: '2px solid var(--border-light)', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)',
              marginBottom: '40px'
            }}>
              {/* Floor Plan Visual Borders & Sections */}
              
              {/* Top: Window Seating header */}
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '40px', borderBottom: '2px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>
                WINDOW SEATING SECTION
              </div>

              {/* Bottom: Entrance doors */}
              <div style={{ position: 'absolute', bottom: 0, left: '35%', right: '35%', height: '40px', borderTop: '2px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>
                MAIN ENTRANCE
              </div>

              {/* Bottom-left: Service area */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '25%', height: '80px', borderTop: '2px solid var(--border-light)', borderRight: '2px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', backgroundColor: '#f3f4f6' }}>
                SERVICE AREA
              </div>

              {/* Scattered Plant Icons */}
              {[
                { top: '15%', left: '8%' },
                { top: '15%', right: '8%' },
                { top: '55%', left: '20%' },
                { top: '55%', right: '20%' },
                { top: '85%', right: '8%' }
              ].map((pos, idx) => (
                <div key={idx} style={{ position: 'absolute', top: pos.top, left: pos.left, right: pos.right, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#d1fae5', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(16,185,129,0.05)', userSelect: 'none' }} title="Plant decoration">
                  🌿
                </div>
              ))}

              {/* Active Interactive Seeding Tables */}
              {tables.map(table => {
                const isSelected = selectedTable?._id === table._id;
                const isRound = table.shape === 'round';
                const chairsCount = parseInt(table.chairs) || 4;

                // Status colors
                let tableBg = '#ffffff';
                let border = '2px solid var(--border-light)';
                let chairBg = '#9ca3af';

                if (table.isBooked) {
                  tableBg = '#f3f4f6';
                  border = '2px solid #d1d5db';
                  chairBg = '#d1d5db';
                } else if (isSelected) {
                  tableBg = '#fef3c7';
                  border = '2px solid #d97706';
                  chairBg = '#d97706';
                } else {
                  tableBg = '#d1fae5';
                  border = '2px solid #10b981';
                  chairBg = '#10b981';
                }

                // Orbit Chairs
                const chairs = [];
                for (let i = 0; i < chairsCount; i++) {
                  const angle = (i * 2 * Math.PI) / chairsCount;
                  const radius = 22;
                  const xOffset = Math.sin(angle) * radius;
                  const yOffset = -Math.cos(angle) * radius;

                  chairs.push(
                    <div 
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: chairBg,
                        top: `calc(50% + ${yOffset}px - 4px)`,
                        left: `calc(50% + ${xOffset}px - 4px)`,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  );
                }

                return (
                  <div 
                    key={table._id}
                    onClick={() => setSelectedTable(table)}
                    style={{
                      position: 'absolute',
                      top: `${table.y || 50}%`,
                      left: `${table.x || 50}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 10 : 3,
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {chairs}

                    <div 
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: isRound ? '50%' : '6px',
                        backgroundColor: tableBg,
                        border: border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: '900',
                        color: table.isBooked ? '#9ca3af' : isSelected ? '#b45309' : '#047857',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                      }}
                    >
                      {table.name.replace('Table ', '').replace('Booth ', '')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Order Notification channels configuration */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSaveSettings}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Configure alert pathways where DineLabs should dispatch instant notifications whenever a customer submits a new order.
              </p>

              {/* Channel 1: Email alerts */}
              <div style={{ border: '1px solid var(--border-light)', borderRadius: '16px', padding: '20px', backgroundColor: 'var(--bg-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', marginBottom: emailEnabled ? '12px' : 0 }}>
                  <input 
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>📧 Email Order Alerts</span>
                </label>
                {emailEnabled && (
                  <div className="form-group" style={{ margin: 0, paddingTop: '4px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Recipient Manager Email</label>
                    <input 
                      type="email"
                      className="form-control"
                      placeholder="e.g. manager@restaurant.com"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      required={emailEnabled}
                    />
                  </div>
                )}
              </div>

              {/* Channel 2: WhatsApp alerts */}
              <div style={{ border: '1px solid var(--border-light)', borderRadius: '16px', padding: '20px', backgroundColor: 'var(--bg-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', marginBottom: whatsappEnabled ? '12px' : 0 }}>
                  <input 
                    type="checkbox"
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>💬 WhatsApp Order Alerts</span>
                </label>
                {whatsappEnabled && (
                  <div className="form-group" style={{ margin: 0, paddingTop: '4px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Recipient Phone Number (with country code)</label>
                    <input 
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +96170123456"
                      value={whatsappRecipient}
                      onChange={(e) => setWhatsappRecipient(e.target.value)}
                      required={whatsappEnabled}
                    />
                  </div>
                )}
              </div>

              {/* Channel 3: Telegram alerts */}
              <div style={{ border: '1px solid var(--border-light)', borderRadius: '16px', padding: '20px', backgroundColor: 'var(--bg-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', marginBottom: telegramEnabled ? '12px' : 0 }}>
                  <input 
                    type="checkbox"
                    checked={telegramEnabled}
                    onChange={(e) => setTelegramEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>🤖 Telegram Bot Order Alerts</span>
                </label>
                {telegramEnabled && (
                  <div className="form-group" style={{ margin: 0, paddingTop: '4px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Your Telegram Chat ID</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. 543210987"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      required={telegramEnabled}
                    />
                  </div>
                )}
              </div>

              {/* Credentials documentation details guide inline */}
              <div style={{ border: '1px solid #fee2e2', borderRadius: '16px', padding: '20px', backgroundColor: '#fffdfd', fontSize: '0.8rem', lineHeight: '1.4' }}>
                <strong style={{ display: 'block', color: 'var(--brand-red)', marginBottom: '8px' }}>🔑 Integration Credentials Setup Guide</strong>
                <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>
                    <strong>Resend Email Key</strong>: Create a free account at <a href="https://resend.com" target="_blank" style={{ color: 'var(--brand-red)', fontWeight: 'bold' }}>resend.com</a>, verify your domain under Settings, generate an API Key, and save it as <code>RESEND_API_KEY</code> in your <code>.env</code> file.
                  </li>
                  <li>
                    <strong>Twilio WhatsApp Keys</strong>: Go to <a href="https://twilio.com" target="_blank" style={{ color: 'var(--brand-red)', fontWeight: 'bold' }}>twilio.com</a>, setup the WhatsApp Sandbox under Messaging, note down your <code>Account SID</code>, <code>Auth Token</code>, and Twilio WhatsApp Sandbox number, and write them to <code>TWILIO_ACCOUNT_SID</code>, <code>TWILIO_AUTH_TOKEN</code>, and <code>TWILIO_WHATSAPP_NUMBER</code> in your <code>.env</code>.
                  </li>
                  <li>
                    <strong>Telegram Bot Token</strong>: Start a chat with <a href="https://t.me/BotFather" target="_blank" style={{ color: 'var(--brand-red)', fontWeight: 'bold' }}>@BotFather</a> on Telegram, send <code>/newbot</code> to create a bot, note the token, and add it to <code>TELEGRAM_BOT_TOKEN</code> in your <code>.env</code>. To find your Chat ID, message <a href="https://t.me/userinfobot" target="_blank" style={{ color: 'var(--brand-red)', fontWeight: 'bold' }}>@userinfobot</a> and paste the ID into the Telegram Chat ID field above.
                  </li>
                </ol>
              </div>

            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={saving}
              style={{ width: '200px', fontSize: '0.85rem', padding: '10px', marginTop: '24px' }}
            >
              {saving ? 'Saving changes...' : 'Save Alert Pathways'}
            </button>
          </form>
        )}

      </div>

      {/* Right Area preview panels (table card print template / coordinate sliders) */}
      {activeTab === 'tables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Table Layout Coordinate Sketcher Editor */}
          {selectedTable && (
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', textAlign: 'left' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: '800', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📐 Table Layout Sketcher</span>
                <button 
                  onClick={() => setSelectedTable(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Clear Select
                </button>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Table Name / Code</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={selectedTable.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedTable({ ...selectedTable, name: val });
                      setTables(tables.map(t => t._id === selectedTable._id ? { ...t, name: val } : t));
                    }}
                    style={{ padding: '8px 12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Seating Chairs</label>
                    <select 
                      className="form-control"
                      value={selectedTable.chairs}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSelectedTable({ ...selectedTable, chairs: val });
                        setTables(tables.map(t => t._id === selectedTable._id ? { ...t, chairs: val } : t));
                      }}
                      style={{ padding: '8px 12px' }}
                    >
                      <option value="2">2 Chairs</option>
                      <option value="4">4 Chairs</option>
                      <option value="6">6 Chairs</option>
                      <option value="8">8 Chairs</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Table Shape</label>
                    <select 
                      className="form-control"
                      value={selectedTable.shape || 'square'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedTable({ ...selectedTable, shape: val });
                        setTables(tables.map(t => t._id === selectedTable._id ? { ...t, shape: val } : t));
                      }}
                      style={{ padding: '8px 12px' }}
                    >
                      <option value="square">Square</option>
                      <option value="round">Round / Circle</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Location Area</label>
                  <select 
                    className="form-control"
                    value={selectedTable.location}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedTable({ ...selectedTable, location: val });
                      setTables(tables.map(t => t._id === selectedTable._id ? { ...t, location: val } : t));
                    }}
                    style={{ padding: '8px 12px' }}
                  >
                    <option value="Indoor">Indoor (Main Hall)</option>
                    <option value="Terrace">Terrace (Outdoor)</option>
                    <option value="Bar Area">Bar Area</option>
                    <option value="VIP Section">VIP Section</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>View Description (e.g. Garden View)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={selectedTable.view || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedTable({ ...selectedTable, view: val });
                      setTables(tables.map(t => t._id === selectedTable._id ? { ...t, view: val } : t));
                    }}
                    placeholder="e.g. Window Seating"
                    style={{ padding: '8px 12px' }}
                  />
                </div>

                {/* Coordinates Sliders */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Horizontal Position (X)</span>
                    <strong>{Math.round(selectedTable.x || 50)}%</strong>
                  </label>
                  <input 
                    type="range"
                    min="5"
                    max="95"
                    className="form-control"
                    value={selectedTable.x || 50}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSelectedTable({ ...selectedTable, x: val });
                      setTables(tables.map(t => t._id === selectedTable._id ? { ...t, x: val } : t));
                    }}
                    style={{ padding: 0, height: '8px', cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Vertical Position (Y)</span>
                    <strong>{Math.round(selectedTable.y || 50)}%</strong>
                  </label>
                  <input 
                    type="range"
                    min="5"
                    max="95"
                    className="form-control"
                    value={selectedTable.y || 50}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSelectedTable({ ...selectedTable, y: val });
                      setTables(tables.map(t => t._id === selectedTable._id ? { ...t, y: val } : t));
                    }}
                    style={{ padding: 0, height: '8px', cursor: 'pointer' }}
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
                        alert('Table sketch configurations saved successfully!');
                      } else {
                        alert('Failed saving configurations');
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="checkout-btn"
                  style={{ fontSize: '0.8rem', padding: '10px', height: '42px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  💾 Save Sketch Coordinates
                </button>
              </div>
            </div>
          )}

          {/* Table QR Card Print Template */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', textAlign: 'center' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: '800', marginBottom: '16px' }}>
              QR Code Card Template
            </h4>

            {selectedTable ? (
              <div id="print-qr-card" style={{ border: '3px solid #000000', borderRadius: '20px', padding: '24px', backgroundColor: '#ffffff', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>DineLabs</span>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '2px', textTransform: 'uppercase' }}>
                  {settings.name}
                </div>
                
                {/* Dynamically generated Vector QR card code server image */}
                <div style={{ width: '140px', height: '140px', margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getTableUrl(selectedTable.name))}`}
                    alt="QR Code"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '6px' }}>
                  SCAN TO BROWSE & ORDER
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '900', color: 'var(--brand-red)', textTransform: 'uppercase' }}>
                  {selectedTable.name}
                </div>

                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '6px' }}>
                  🪑 {selectedTable.chairs} Seating · 📍 {selectedTable.location}
                </div>
                
                {/* Print button trigger */}
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
                  className="checkout-btn"
                  style={{ fontSize: '0.75rem', padding: '8px 16px', marginTop: '20px' }}
                >
                  🖨️ Print QR Card
                </button>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', padding: '50px 0', fontSize: '0.8rem', fontWeight: '600' }}>
                Select a physical table from the left grid layout to view, test, and download/print its custom concierged QR ordering card.
              </div>
            )}
          </div>
        </div>
      )}

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

'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ManagerLiveOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'accepted' | 'completed' | 'declined'
  
  // Audio Notification references
  const audioContextRef = useRef(null);
  const soundIntervalRef = useRef(null);

  // Poll orders list every 5 seconds for real-time order queuing
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed fetching live orders queue', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check if there is an orderNo query scanning parameter to highlight & auto-tab
  useEffect(() => {
    if (typeof window !== 'undefined' && orders.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const scannedOrderNo = params.get('orderNo');
      if (scannedOrderNo) {
        const targetOrder = orders.find(o => o.orderNo.toString() === scannedOrderNo.toString());
        if (targetOrder) {
          // Switch to the correct tab for this order's status
          setActiveTab(targetOrder.status);
          
          // Scroll and apply highly polished focus highlights
          setTimeout(() => {
            const el = document.getElementById(`order-row-${targetOrder._id}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Apply glowing highlight style to the table row
              el.style.outline = '3px solid #10b981';
              el.style.outlineOffset = '-3px';
              el.style.backgroundColor = '#f0fdf4';
              el.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
              
              // Clean search query from URL to avoid locked redirects on manual reloads
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          }, 350);
        }
      }
    }
  }, [orders]);

  // Filter orders by active tab
  const filteredOrders = orders.filter(o => o.status === activeTab);

  // Core persistent audio alert loop for Pending orders
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  useEffect(() => {
    if (pendingOrdersCount > 0) {
      startNotificationSound();
    } else {
      stopNotificationSound();
    }

    return () => stopNotificationSound();
  }, [pendingOrdersCount]);

  const startNotificationSound = () => {
    if (soundIntervalRef.current) return;
    
    soundIntervalRef.current = setInterval(() => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Programmatic bell tone generation (synthesizing a dual bell ring)
        const playChime = (timeOffset, freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
          
          gain.gain.setValueAtTime(0.3, ctx.currentTime + timeOffset);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.4);
          
          osc.start(ctx.currentTime + timeOffset);
          osc.stop(ctx.currentTime + timeOffset + 0.5);
        };

        // Pleasant high-pitch double ping chime alert (bell A5 + C#6)
        playChime(0, 880); 
        playChime(0.15, 1109);
      } catch (e) {
        console.warn('Audio Context blocked by browser permission rules. Playback requires click interaction.');
      }
    }, 2000); // Persistent loop chime every 2 seconds
  };

  const stopNotificationSound = () => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
  };

  // Mutates order status
  const handleModifyStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Optimistic UI state update
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert('Failed modifying order status');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatPrice = (amount) => {
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  return (
    <div>
      {/* Autoplay prompt header */}
      {pendingOrdersCount > 0 && (
        <div 
          onClick={() => {
            // Force initialize audio context on click to satisfy browser security policies
            if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            audioContextRef.current.resume();
          }}
          style={{ 
            backgroundColor: '#fee2e2', 
            color: '#ef4444', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            marginBottom: '24px', 
            fontWeight: '700', 
            fontSize: '0.85rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.05)',
            cursor: 'pointer'
          }}
        >
          <span>🚨 YOU HAVE {pendingOrdersCount} NEW PENDING ORDER(S). TAP HERE TO ENSURE PERSISTENT AUDIBLE SOUND RINGING IS ENGAGED.</span>
          <span style={{ textDecoration: 'underline' }}>Enable Chime</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
        {[
          { id: 'pending', name: '🔔 Pending', count: orders.filter(o => o.status === 'pending').length },
          { id: 'accepted', name: '🍳 In Preparation', count: orders.filter(o => o.status === 'accepted').length },
          { id: 'completed', name: '✓ Completed', count: orders.filter(o => o.status === 'completed').length },
          { id: 'declined', name: '✕ Declined', count: orders.filter(o => o.status === 'declined').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: '700',
              padding: '12px 24px',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '3px solid var(--brand-red)' : '3px solid transparent',
              transition: 'var(--transition-smooth)'
            }}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Queue Table Area */}
      {loading ? (
        <h3>Loading incoming orders queue...</h3>
      ) : filteredOrders.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '48px' }}>😴</span>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginTop: '12px', fontWeight: '800' }}>Queue is empty</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders currently in this status.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Order ID</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Time</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Customer Info</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Order Details / Items</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr 
                  key={order._id}
                  id={`order-row-${order._id}`}
                  style={{ 
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {/* Order ID */}
                  <td style={{ padding: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
                    #{order.orderNo}
                  </td>
                  
                  {/* Time */}
                  <td style={{ padding: '20px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Type Badge */}
                  <td style={{ padding: '20px' }}>
                    {order.type === 'dine-in' ? (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '700', fontSize: '0.75rem' }}>
                        🍽️ Dine-in
                      </span>
                    ) : order.type === 'pickup' ? (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '700', fontSize: '0.75rem' }}>
                        🛍️ Pickup
                      </span>
                    ) : (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '700', fontSize: '0.75rem' }}>
                        🛵 Delivery
                      </span>
                    )}
                  </td>

                  {/* Customer Info */}
                  <td style={{ padding: '20px', maxWidth: '220px' }}>
                    {order.type === 'dine-in' ? (
                      <div>
                        <div style={{ fontWeight: '700' }}>{order.customer?.name || 'Guest Diner'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          📍 Table: {order.customer?.tableNo || 'N/A'}
                        </div>
                        {order.customer?.phone && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {order.customer.phone}</div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: '700' }}>{order.customer?.name || 'Guest'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>📞 {order.customer?.phone}</div>
                        {order.type === 'delivery' && order.customer?.address && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.2' }} title={order.customer.address}>
                            🏠 {order.customer.address}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Order Details / Items */}
                  <td style={{ padding: '20px', maxWidth: '300px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.82rem', lineHeight: '1.3' }}>
                          <span style={{ fontWeight: '700' }}>{item.quantity}x</span> {item.name}
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', paddingLeft: '18px' }}>
                            {item.size && <span>📐 {item.size}</span>}
                            {item.addons && item.addons.length > 0 && (
                              <span style={{ display: 'block' }}>➕ {item.addons.join(', ')}</span>
                            )}
                            {item.removedIngredients && item.removedIngredients.length > 0 && (
                              <span style={{ display: 'block', color: '#ef4444' }}>🚫 No {item.removedIngredients.join(', ')}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Total */}
                  <td style={{ padding: '20px', fontWeight: '800', textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
                    {formatPrice(order.total)}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleModifyStatus(order._id, 'declined')}
                            style={{ 
                              padding: '8px 14px', 
                              borderRadius: '8px', 
                              border: '1px solid #d1d5db', 
                              backgroundColor: '#ffffff', 
                              color: '#ef4444', 
                              fontWeight: '700', 
                              cursor: 'pointer', 
                              fontSize: '0.75rem',
                              transition: 'var(--transition-smooth)'
                            }}
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleModifyStatus(order._id, 'accepted')}
                            style={{ 
                              padding: '8px 14px', 
                              borderRadius: '8px', 
                              border: 'none', 
                              backgroundColor: '#10b981', 
                              color: '#ffffff', 
                              fontWeight: '700', 
                              cursor: 'pointer', 
                              fontSize: '0.75rem',
                              transition: 'var(--transition-smooth)'
                            }}
                          >
                            Accept
                          </button>
                        </>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleModifyStatus(order._id, 'completed')}
                          style={{ 
                            width: '120px', 
                            padding: '8px 14px', 
                            borderRadius: '8px', 
                            border: 'none', 
                            backgroundColor: 'var(--text-main)', 
                            color: '#ffffff', 
                            fontWeight: '700', 
                            cursor: 'pointer', 
                            fontSize: '0.75rem',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          Complete ✓
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <div style={{ width: '120px', textAlign: 'center', color: '#10b981', fontWeight: '700', fontSize: '0.75rem', backgroundColor: '#d1fae5', padding: '6px', borderRadius: '8px' }}>
                          Fulfilled
                        </div>
                      )}

                      {order.status === 'declined' && (
                        <div style={{ width: '120px', textAlign: 'center', color: '#ef4444', fontWeight: '700', fontSize: '0.75rem', backgroundColor: '#fee2e2', padding: '6px', borderRadius: '8px' }}>
                          Rejected
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

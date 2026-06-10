'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const { storename, id } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [table, setTable] = useState(null);
  const [error, setError] = useState(false);

  const prevStatusRef = useRef(null);
  const audioContextRef = useRef(null);

  // Sound play helper using Web Audio API
  const playStatusChangeSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const playChime = (timeOffset, freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.4);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.5);
      };

      // Sound signature: double pleasant chime
      playChime(0, 523.25); // C5
      playChime(0.15, 659.25); // E5
    } catch (e) {
      console.warn('Audio feedback blocked by browser.', e);
    }
  };

  // Set document title
  useEffect(() => {
    document.title = 'Order Status Tracker - DineLabs';
  }, []);

  // Poll order state every 5 seconds
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);

          // If status changed and it's not the initial load, play sound
          if (prevStatusRef.current && prevStatusRef.current !== data.status) {
            playStatusChangeSound();
          }
          prevStatusRef.current = data.status;
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error polling order details:', err);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [id]);

  // Fetch tenant and tables settings once on mount
  useEffect(() => {
    if (!storename) return;

    const fetchTenantData = async () => {
      try {
        const res = await fetch(`/api/tenant/settings?tenantSlug=${storename}`);
        if (res.ok) {
          const tenantData = await res.json();
          setTenant(tenantData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching tenant details:', err);
      }
    };

    fetchTenantData();
  }, [storename]);

  // Fetch tables and find the table match once order is loaded
  useEffect(() => {
    if (!tenant || !order || order.type !== 'dine-in') return;

    const fetchTableInfo = async () => {
      try {
        const res = await fetch(`/api/tables?tenantSlug=${storename}`);
        if (res.ok) {
          const tables = await res.json();
          const matchedTable = tables.find(t => t.name === order.customer.tableNo);
          if (matchedTable) {
            setTable(matchedTable);
          }
        }
      } catch (err) {
        console.error('Error matching table information:', err);
      }
    };

    fetchTableInfo();
  }, [tenant, order, storename]);

  // Loading state finishes once both tenant and order are retrieved
  useEffect(() => {
    if (order && tenant) {
      setLoading(false);
    }
  }, [order, tenant]);

  // Audio activation helper
  const handleInteraction = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '60px 20px', textAlign: 'center', color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>
        <h2>Order or Store Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>We could not locate this order details page. Please verify your link or return to the menu.</p>
        <a href={`/${storename}`} className="checkout-btn" style={{ display: 'inline-flex', marginTop: '20px', padding: '12px 24px', textDecoration: 'none', borderRadius: '12px' }}>
          Back to Menu
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div className="pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--brand-red)' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connecting to kitchen tracker...</p>
      </div>
    );
  }

  // Helper formats
  const formatPrice = (amount) => {
    if (tenant.baseCurrency === 'LBP') {
      return parseFloat(amount).toLocaleString('en-US').replace(/,/g, '.') + ' LBP';
    }
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  // Status mapping logic
  // pending -> Placed
  // accepted -> Preparing
  // ready / shipped -> On the Way / Ready
  // completed -> Completed
  const getActiveStep = () => {
    const status = order.status;
    if (status === 'pending') return 0;
    if (status === 'accepted') return 1;
    if (status === 'ready' || status === 'shipped') return 2;
    if (status === 'completed') return 3;
    return 0; // Default
  };

  const activeStep = getActiveStep();

  // Progress Bar Steps Definitions
  const steps = [
    { label: 'Placed', desc: 'Order received by kitchen' },
    { label: 'Preparing', desc: 'Chef is cooking your order' },
    { 
      label: order.type === 'delivery' ? 'On the Way' : 'Ready', 
      desc: order.type === 'delivery' ? 'Out for delivery transit' : 'Ready for collection' 
    },
    { label: 'Completed', desc: 'Thank you for your visit!' }
  ];

  // Estimated Minutes Left Calculation
  const getEstimatedMinutesLeft = () => {
    if (order.status === 'pending') {
      return (order.type === 'delivery' ? (tenant.waitTimes?.delivery || 40) : (tenant.waitTimes?.pickup || 20));
    }
    if (order.status === 'accepted') {
      // Return prep time minus elapsed time
      const elapsed = Math.floor((new Date() - new Date(order.createdAt)) / 60000);
      const limit = order.type === 'delivery' ? (tenant.waitTimes?.delivery || 40) : (tenant.waitTimes?.pickup || 20);
      return Math.max(1, limit - elapsed);
    }
    if (order.status === 'shipped') {
      // Return deliveryMinutes or default 20
      const elapsed = Math.floor((new Date() - new Date(order.updatedAt)) / 60000);
      const limit = order.deliveryMinutes || 20;
      return Math.max(1, limit - elapsed);
    }
    return 0;
  };

  const estimatedMinutes = getEstimatedMinutesLeft();

  const getOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  return (
    <div 
      onClick={handleInteraction}
      style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 20px', fontFamily: 'var(--font-body)', color: 'var(--text-main)' }}
    >
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Tracker Live Status Panel */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '24px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          {/* Status Indicator check circle */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            backgroundColor: 
              order.status === 'declined' ? 'var(--neg-bg)' : 
              order.status === 'completed' ? 'var(--pos-bg)' : 
              'var(--info-bg)', 
            color: 
              order.status === 'declined' ? 'var(--neg)' : 
              order.status === 'completed' ? 'var(--pos)' : 
              'var(--info)', 
            fontSize: '32px', 
            marginBottom: '16px' 
          }}>
            {order.status === 'declined' ? '✕' : order.status === 'completed' ? '✓' : '⏳'}
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>
            {order.status === 'declined' ? 'Order Declined' :
             order.status === 'completed' ? 'Enjoy Your Meal!' :
             order.status === 'ready' ? 'Ready for Pickup!' :
             order.status === 'shipped' ? 'Order Out for Delivery!' :
             'Tracking Your Order'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Order <strong>#{order.orderNo}</strong> is active in {tenant.name}'s system.
          </p>

          {/* Time display indicator */}
          {estimatedMinutes > 0 && order.status !== 'declined' && order.status !== 'ready' && (
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '16px', 
              padding: '16px', 
              marginBottom: '28px',
              border: '1px solid var(--border-light)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Estimated Time Remaining
              </span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--brand-red)', margin: '4px 0' }}>
                {estimatedMinutes} <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>mins</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {order.status === 'shipped' ? 'Courier is in transit' : 'Includes kitchen cooking prep time'}
              </span>
            </div>
          )}

          {/* Declined banner */}
          {order.status === 'declined' && (
            <div style={{ backgroundColor: 'var(--neg-bg)', color: 'var(--neg)', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: '700' }}>
              We apologize, but your order has been declined. Please contact the kitchen directly for details.
            </div>
          )}

          {/* Premium Progress Bar Timeline */}
          {order.status !== 'declined' && (
            <div style={{ textAlign: 'left', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '32px' }}>
                {/* Horizontal progress bar line background */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  right: '12px', 
                  height: '4px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  zIndex: 1 
                }}></div>
                {/* Active progress bar line foreground */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  width: `${(activeStep / 3) * 100}%`, 
                  height: '4px', 
                  backgroundColor: 'var(--pos)', 
                  transition: 'width 0.4s ease', 
                  zIndex: 2 
                }}></div>

                {/* Steps dots */}
                {steps.map((step, idx) => {
                  const isCompleted = idx < activeStep;
                  const isActive = idx === activeStep;
                  return (
                    <div key={idx} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: idx === 0 ? 'flex-start' : idx === 3 ? 'flex-end' : 'center', 
                      zIndex: 3 
                    }}>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        backgroundColor: isCompleted ? 'var(--pos)' : isActive ? 'var(--info)' : '#ffffff', 
                        border: `3px solid ${isCompleted ? 'var(--pos)' : isActive ? 'var(--info)' : 'var(--border-light)'}`,
                        color: isCompleted || isActive ? '#ffffff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        transition: 'all 0.4s ease'
                      }}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: isActive ? '800' : '600', 
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        marginTop: '8px',
                        whiteSpace: 'nowrap'
                      }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Detail Card */}
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '12px', 
                padding: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                borderLeft: '4px solid var(--pos)'
              }}>
                <span style={{ fontSize: '20px' }}>🔔</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{steps[activeStep]?.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>{steps[activeStep]?.desc}</div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Premium Scannable Table Ticket for Dine-In sessions */}
        {order.type === 'dine-in' && (
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '24px', 
            border: '2px solid var(--pos)', 
            padding: '24px', 
            textAlign: 'center', 
            marginBottom: '24px', 
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ribbons / Badges */}
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '-30px',
              backgroundColor: 'var(--pos)',
              color: '#ffffff',
              transform: 'rotate(45deg)',
              fontSize: '0.65rem',
              fontWeight: '900',
              padding: '4px 30px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Dine-In
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#d1fae5', color: 'var(--pos)', fontSize: '24px', marginBottom: '16px' }}>
              🍽️
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text-main)' }}>
              Table Ticket Pass
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '16px' }}>
              Present this pass or keep it open for your waiter.
            </p>

            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '16px', 
              padding: '16px', 
              marginBottom: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px dashed var(--border-light)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Your Assigned Table
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '900', color: 'var(--brand-red)', margin: '4px 0' }}>
                {order.customer.tableNo}
              </span>
              {table && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  📍 {table.location} Section · 🪑 {table.chairs} Chairs
                </span>
              )}
            </div>

            {/* Waiter QR Code */}
            <div style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid var(--border-light)', 
              borderRadius: '16px', 
              padding: '12px', 
              display: 'inline-block', 
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${getOrigin()}/manager/live-orders?orderNo=${order.orderNo}`
                )}`}
                alt="Waiter QR Ticket"
                style={{ width: '180px', height: '180px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', lineHeight: 1.4, padding: '0 12px' }}>
              📲 Waitstaff Scanning Guide:<br />
              <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                Scan this card to instantly find order #<strong>{order.orderNo}</strong> on your device, approve the kitchen ticket, and match the table placement.
              </span>
            </div>
          </div>
        )}

        {/* Call support warning callout box */}
        <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'left', marginBottom: '24px', fontSize: '0.85rem', color: '#b45309', fontWeight: '600' }}>
          ⚠️ Order cannot be cancelled or modified after submission. For any changes, please contact the restaurant directly.
        </div>

        {/* Card: Summary of customer fulfillment */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            Fulfillment details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Fulfillment Mode</span>
              <span style={{ fontWeight: '700', textTransform: 'capitalize' }}>{order.type}</span>
            </div>

            {order.type === 'dine-in' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Table Code</span>
                <span style={{ fontWeight: '700' }}>{order.customer.tableNo}</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name</span>
                  <span style={{ fontWeight: '700' }}>{order.customer.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone Number</span>
                  <span style={{ fontWeight: '700' }}>{order.customer.phone}</span>
                </div>
              </>
            )}

            {order.type === 'delivery' && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Delivery Address</span>
                <span style={{ fontWeight: '600', lineHeight: 1.4 }}>{order.customer.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card: Order Details Summary */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{item.quantity}x {item.name}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {item.size && `${item.size}`}
                    {item.addons && item.addons.length > 0 && `, +${item.addons.join(', ')}`}
                    {item.removedIngredients && item.removedIngredients.length > 0 && `, (No ${item.removedIngredients.join(', ')})`}
                  </span>
                  {item.notes && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-red)', fontStyle: 'italic', marginTop: '2px' }}>
                      ✎ Note: {item.notes}
                    </div>
                  )}
                </div>
                <span style={{ fontWeight: '600' }}>{formatPrice(item.priceCalculated * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.type === 'delivery' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Delivery Fee</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', borderTop: '1px dashed var(--border-light)', marginTop: '12px', paddingTop: '12px' }}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Back to menu button */}
        <a 
          href={`/${storename}${order.type === 'dine-in' && order.customer?.tableNo ? `?table=${encodeURIComponent(order.customer.tableNo)}` : ''}`} 
          className="checkout-btn"
          style={{ textDecoration: 'none', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          Return to Menu
        </a>
      </div>
    </div>
  );
}

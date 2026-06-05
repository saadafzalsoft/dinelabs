'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { storename } = useParams();

  // Loading and State
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState('dine-in'); // 'dine-in' | 'pickup' | 'delivery'
  const [tableNo, setTableNo] = useState('');
  const [tablesList, setTablesList] = useState([]); // Dine-in physical tables
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Phone inputs
  const [countryCode, setCountryCode] = useState('+961');
  const [phoneNum, setPhoneNum] = useState('');

  // Delivery fields split
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [instructions, setInstructions] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('cash-on-arrival'); // 'cash-on-arrival' | 'pay-at-counter' | 'billed-to-room'
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch tenant info and load cart from localStorage on mount
  useEffect(() => {
    async function init() {
      try {
        const settingsRes = await fetch(`/api/tenant/settings?tenantSlug=${storename}`);
        if (settingsRes.ok) {
          const t = await settingsRes.json();
          setTenant(t);
        }
      } catch (err) {
        console.error('Error fetching tenant settings', err);
      }

      // Fetch physical tables for Dine-in interactive layouts
      try {
        const tablesRes = await fetch(`/api/tables?tenantSlug=${storename}`);
        if (tablesRes.ok) {
          const tablesData = await tablesRes.json();
          setTablesList(tablesData);
        }
      } catch (err) {
        console.error('Failed fetching tables', err);
      }

      // Load cart
      const savedCart = localStorage.getItem(`dinelabs_cart_${storename}`);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCart(parsed);
          if (parsed.length === 0) {
            router.push(`/${storename}`);
          }
        } catch (e) {
          router.push(`/${storename}`);
        }
      } else {
        router.push(`/${storename}`);
      }

      // Load modes
      const savedMode = localStorage.getItem(`dinelabs_mode_${storename}`) || 'dine-in';
      setMode(savedMode);

      const savedTable = localStorage.getItem(`dinelabs_table_${storename}`) || '';
      setTableNo(savedTable);

      setLoading(false);
    }
    init();
  }, [storename, router]);

  // Auto-assign table if missing in Dine-in mode
  useEffect(() => {
    if (mode === 'dine-in' && !tableNo && tablesList.length > 0) {
      const availableTable = tablesList.find(t => !t.isBooked);
      if (availableTable) {
        setTableNo(availableTable.name);
      } else {
        setTableNo(tablesList[0].name);
      }
    }
  }, [mode, tableNo, tablesList]);

  // Dynamic price formatter using comma decimal separator: LBP XX,XX or $XX,XX
  const formatPrice = (amount) => {
    if (tenant?.baseCurrency === 'LBP') {
      // Formatter for LBP currency
      return 'LBP ' + parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  const getCurrencyLabel = () => {
    return tenant?.baseCurrency || 'USD';
  };

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  // Delivery fee is LBP 200,000 if LBP currency, or $3.50 if USD
  const deliveryFee = mode === 'delivery' ? (tenant?.baseCurrency === 'LBP' ? 200000 : 3.50) : 0.00;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Field validation
    if (!name.trim()) {
      setErrorMessage('Full Name is required');
      return;
    }
    if (!phoneNum.trim()) {
      setErrorMessage('Phone Number is required');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email Address is required');
      return;
    }

    if (mode === 'delivery') {
      if (!city.trim() || !street.trim() || !building.trim() || !floor.trim()) {
        setErrorMessage('All delivery address details (City, Street, Building, Floor) are required');
        return;
      }
    }

    setSubmitting(true);
    setErrorMessage('');

    // Compile combined address for delivery
    const combinedAddress = mode === 'delivery'
      ? `${city.trim()}, ${street.trim()}, ${building.trim()}, Floor ${floor.trim()}${instructions.trim() ? ` (Instructions: ${instructions.trim()})` : ''}`
      : '';

    // Compile phone with country code
    const fullPhone = `${countryCode} ${phoneNum.trim()}`;

    try {
      const orderPayload = {
        tenantSlug: storename,
        type: mode,
        customer: {
          name: name.trim(),
          phone: fullPhone,
          email: email.trim(),
          address: combinedAddress,
          tableNo: mode === 'dine-in' ? tableNo : null
        },
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name.en,
          price: item.basePrice,
          quantity: item.quantity,
          size: item.size,
          addons: item.addons,
          removedIngredients: item.removedIngredients,
          priceCalculated: item.unitPrice
        })),
        subtotal,
        deliveryFee,
        total,
        language: 'en'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Clear cart
      localStorage.removeItem(`dinelabs_cart_${storename}`);
      
      // Redirect to confirmation screen
      router.push(`/${storename}/confirmation/${data.order._id}`);
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while placing order. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading || !tenant) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-heading)' }}>
        <h2>Loading Checkout details...</h2>
      </div>
    );
  }

  return (
    <div className="main-viewport" style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header navigation back button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link href={`/${storename}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ← Back to Menu
          </Link>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800' }}>Checkout</h1>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', fontSize: '0.9rem' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Fulfillment toggle badges showing currently selected mode */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', backgroundColor: '#ffffff', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', backgroundColor: mode === 'delivery' ? 'var(--bg-secondary)' : 'transparent', color: mode === 'delivery' ? 'var(--text-main)' : 'var(--text-muted)' }}>
            🛵 Delivery
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', backgroundColor: mode === 'pickup' ? 'var(--bg-secondary)' : 'transparent', color: mode === 'pickup' ? 'var(--text-main)' : 'var(--text-muted)' }}>
            🛍️ Pick up
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', backgroundColor: mode === 'dine-in' ? 'var(--bg-secondary)' : 'transparent', color: mode === 'dine-in' ? 'var(--text-main)' : 'var(--text-muted)' }}>
            🍽️ Dine in
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* ==========================================
              SCENARIO 1: DELIVERY CHECKOUT VIEW
              ========================================== */}
          {mode === 'delivery' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px' }}>
                Your Information
              </h3>
              
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    className="form-control" 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{ width: '110px', flexShrink: 0 }}
                  >
                    <option value="+961">LB +961</option>
                    <option value="+1">US +1</option>
                    <option value="+971">AE +971</option>
                  </select>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="Phone Number"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Street name"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Building name / no.</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Building name or number"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Floor</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Floor level"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Instructions for driver (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Ring the second bell"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ==========================================
              SCENARIO 2: PICK-UP CHECKOUT VIEW
              ========================================== */}
          {mode === 'pickup' && (
            <>
              {/* Local location card with map screenshot placeholder */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '20px', border: '1px solid var(--border-light)', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#e5e7eb', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px' }}>
                  {/* Styled SVG grid backdrop map representing map selector in pickup screenshot */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    🗺️ Restaurant Location Map
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.4rem', backgroundColor: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '50%' }}>📍</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{tenant.address || '2 Aleksandre Kazbegi avenue'}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Our Location</span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px' }}>
                  Your Information
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      className="form-control" 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{ width: '110px', flexShrink: 0 }}
                    >
                      <option value="+961">LB +961</option>
                      <option value="+1">US +1</option>
                      <option value="+971">AE +971</option>
                    </select>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="Phone Number"
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              SCENARIO 3: DINE-IN CHECKOUT VIEW
              ========================================== */}
          {mode === 'dine-in' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px' }}>
                Your Information
              </h3>

              {/* Auto Assigned read only table input */}
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  value={`Table: ${tableNo || 'Auto Assigning...'}`}
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', fontWeight: '700', color: 'var(--text-main)' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Phone Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    className="form-control" 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{ width: '110px', flexShrink: 0 }}
                  >
                    <option value="+961">LB +961</option>
                    <option value="+1">US +1</option>
                    <option value="+971">AE +971</option>
                  </select>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="Phone Number"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fulfillment Standard Delivery/Pickup message */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.2rem', backgroundColor: 'var(--bg-secondary)', padding: '8px', borderRadius: '50%' }}>🎯</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Standard</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {mode === 'delivery' ? `In ${tenant.waitTimes?.delivery || 30} mins` : `In ${tenant.waitTimes?.pickup || 15} mins`}
              </span>
            </div>
          </div>

          {/* Payment Selection Cards */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              Payment Mode
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', cursor: 'pointer', backgroundColor: paymentMethod === 'cash-on-arrival' ? 'var(--bg-secondary)' : 'transparent' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cash-on-arrival"
                  checked={paymentMethod === 'cash-on-arrival'}
                  onChange={() => setPaymentMethod('cash-on-arrival')}
                  style={{ accentColor: 'var(--text-main)', width: '18px', height: '18px' }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>💵 Pay on arrival</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pay with cash upon order arrival</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', cursor: 'pointer', backgroundColor: paymentMethod === 'pay-at-counter' ? 'var(--bg-secondary)' : 'transparent' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="pay-at-counter"
                  checked={paymentMethod === 'pay-at-counter'}
                  onChange={() => setPaymentMethod('pay-at-counter')}
                  style={{ accentColor: 'var(--text-main)', width: '18px', height: '18px' }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>🏪 Pay at counter</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Settle billing at the restaurant cash counter</span>
                </div>
              </label>

              {tenant.tier === 3 && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', cursor: 'pointer', backgroundColor: paymentMethod === 'billed-to-room' ? 'var(--bg-secondary)' : 'transparent' }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="billed-to-room"
                    checked={paymentMethod === 'billed-to-room'}
                    onChange={() => setPaymentMethod('billed-to-room')}
                    style={{ accentColor: 'var(--text-main)', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>🏨 Charge to room (Hospitality)</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Post transaction directly to hotel room folio</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Checkout Item List Summary */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{item.quantity}x {item.name.en}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {item.size && `${item.size}`}
                      {item.addons?.length > 0 && `, +${item.addons.join(', ')}`}
                      {item.removedIngredients?.length > 0 && `, (No ${item.removedIngredients.join(', ')})`}
                    </span>
                  </div>
                  <span style={{ fontWeight: '600' }}>{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Item subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {mode === 'delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', borderTop: '1px dashed var(--border-light)', marginTop: '12px', paddingTop: '12px' }}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={submitting}
            className="checkout-btn"
            style={{
              backgroundColor: submitting ? 'var(--text-muted)' : 'var(--text-main)',
              height: '52px',
              fontSize: '0.9rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              borderRadius: '16px',
              transition: 'all 0.2s ease',
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
              marginBottom: '20px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {mode === 'delivery' ? '🛵' : mode === 'pickup' ? '🛍️' : '🍽️'} Place Order
            </span>
            <span>{formatPrice(total)}</span>
          </button>

        </form>
      </div>
    </div>
  );
}

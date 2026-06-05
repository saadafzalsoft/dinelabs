'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManagerDashboardPage() {
  const [filter, setFilter] = useState('week'); // 'today' | 'week' | 'month'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders for dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (filter === 'today') {
        return orderDate.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= oneWeekAgo;
      } else if (filter === 'month') {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= oneMonthAgo;
      }
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();
  const totalOrders = filteredOrders.length;
  // Revenue is calculated from accepted and completed orders
  const totalRevenue = filteredOrders.reduce((acc, o) => acc + (o.status === 'completed' || o.status === 'accepted' ? o.total : 0), 0);
  
  const dineInCount = filteredOrders.filter(o => o.type === 'dine-in').length;
  const pickupCount = filteredOrders.filter(o => o.type === 'pickup').length;
  const deliveryCount = filteredOrders.filter(o => o.type === 'delivery').length;

  const formatPrice = (amount) => {
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  // Compute best sellers
  const productPerformance = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productPerformance[item.name]) {
        productPerformance[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      productPerformance[item.name].quantity += item.quantity;
      productPerformance[item.name].revenue += item.priceCalculated * item.quantity;
    });
  });

  const performanceList = Object.values(productPerformance);
  const bestSellers = [...performanceList].sort((a, b) => b.quantity - a.quantity).slice(0, 3);
  const lowPerforming = [...performanceList].sort((a, b) => a.quantity - b.quantity).slice(0, 3);

  // Generate dynamic chart data based on filter selection
  const getChartData = () => {
    const now = new Date();
    const activeOrders = filteredOrders.filter(o => o.status === 'completed' || o.status === 'accepted');

    if (filter === 'today') {
      // 8 time slots of 3 hours: 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00, 24:00
      const slots = [
        { label: '03:00', startHour: 0, endHour: 3 },
        { label: '06:00', startHour: 3, endHour: 6 },
        { label: '09:00', startHour: 6, endHour: 9 },
        { label: '12:00', startHour: 9, endHour: 12 },
        { label: '15:00', startHour: 12, endHour: 15 },
        { label: '18:00', startHour: 15, endHour: 18 },
        { label: '21:00', startHour: 18, endHour: 21 },
        { label: '24:00', startHour: 21, endHour: 24 }
      ];

      return slots.map(slot => {
        const value = activeOrders
          .filter(o => {
            const h = new Date(o.createdAt).getHours();
            return h >= slot.startHour && h < slot.endHour;
          })
          .reduce((sum, o) => sum + o.total, 0);

        return { label: slot.label, value };
      });
    }

    if (filter === 'week') {
      // Last 7 days ending today
      const days = [];
      const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        days.push({
          label: weekdayNames[d.getDay()],
          dateStr: d.toDateString()
        });
      }

      return days.map(day => {
        const value = activeOrders
          .filter(o => new Date(o.createdAt).toDateString() === day.dateStr)
          .reduce((sum, o) => sum + o.total, 0);

        return { label: day.label, value };
      });
    }

    // Month: 6 buckets of 5 days over the last 30 days
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getTime() - (i + 1) * 5 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 5 * 24 * 60 * 60 * 1000);
      const label = `${start.getDate()}/${start.getMonth() + 1}`;
      buckets.push({ label, start, end });
    }

    return buckets.map(bucket => {
      const value = activeOrders
        .filter(o => {
          const date = new Date(o.createdAt);
          return date >= bucket.start && date < bucket.end;
        })
        .reduce((sum, o) => sum + o.total, 0);

      return { label: bucket.label, value };
    });
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map(c => c.value), 200); // minimum scale at $200
  
  // Calculate SVG line points
  const graphWidth = 565;
  const graphHeight = 175;
  const chartPoints = chartData.map((pt, i) => {
    const x = 95 + i * (graphWidth / (chartData.length - 1));
    const y = 190 - (pt.value / maxChartValue) * graphHeight;
    return { x, y, label: pt.label, value: pt.value };
  });

  const linePath = chartPoints.length > 0
    ? `M ${chartPoints[0].x},${chartPoints[0].y} ` + chartPoints.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')
    : '';

  const areaPath = chartPoints.length > 0
    ? `${linePath} L ${chartPoints[chartPoints.length - 1].x},190 L ${chartPoints[0].x},190 Z`
    : '';

  // Calculate left side scale axis markers
  const scaleLines = [];
  for (let i = 5; i >= 0; i--) {
    const value = (maxChartValue / 5) * i;
    const y = 190 - (value / maxChartValue) * graphHeight;
    scaleLines.push({ value, y });
  }

  if (loading) {
    return <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-muted)' }}>Loading dashboard...</h3>;
  }

  return (
    <div>
      {/* Page Title */}
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '32px' }}>
        Dashboard
      </h1>

      {/* Useful links section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>
          Useful links
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <Link href="/manager/store-profile?tab=hours" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              border: '1px solid var(--border-light)', 
              borderRadius: '16px', 
              padding: '20px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              transition: 'var(--transition-smooth)',
              cursor: 'pointer',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.3rem' }}>🕐</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '2px' }}>Opening hours</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500' }}>Manage your delivery and pickup times.</div>
                </div>
              </div>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>›</span>
            </div>
          </Link>

          <Link href="/manager/products" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              border: '1px solid var(--border-light)', 
              borderRadius: '16px', 
              padding: '20px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              transition: 'var(--transition-smooth)',
              cursor: 'pointer',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.3rem' }}>🍕</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '2px' }}>Menu/products</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500' }}>Manage your products and menu items.</div>
                </div>
              </div>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>›</span>
            </div>
          </Link>

          <Link href="/manager/products?tab=categories" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              border: '1px solid var(--border-light)', 
              borderRadius: '16px', 
              padding: '20px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              transition: 'var(--transition-smooth)',
              cursor: 'pointer',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.3rem' }}>📋</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '2px' }}>Categories</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500' }}>Manage your menu categories.</div>
                </div>
              </div>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>›</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Total sales chart */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700' }}>
            Total sales
          </h3>
          <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
            {['today', 'week', 'month'].map(r => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                style={{
                  border: 'none',
                  fontFamily: 'inherit',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  padding: '5px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: filter === r ? '#ffffff' : 'transparent',
                  boxShadow: filter === r ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  textTransform: 'capitalize',
                  color: filter === r ? 'var(--text-main)' : 'var(--text-muted)'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Line Graph displaying dynamic sales values */}
        <div style={{ width: '100%', height: '280px', position: 'relative', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '24px', backgroundColor: '#ffffff' }}>
          <svg viewBox="0 0 700 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            
            {/* Grid lines and dynamic axis labels */}
            {scaleLines.map((line, idx) => (
              <g key={idx}>
                <text x="0" y={line.y + 4} fill="#9ca3af" fontSize="10" fontWeight="600">
                  {Math.round(line.value)}
                </text>
                <line x1="45" y1={line.y} x2="700" y2={line.y} stroke="#f3f4f6" strokeWidth="1" />
              </g>
            ))}

            {/* Gradient fill definition */}
            <defs>
              <linearGradient id="salesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Area fill under the line path */}
            {areaPath && <path d={areaPath} fill="url(#salesGrad)" />}
            
            {/* Main line path connecting coordinates */}
            {linePath && <path d={linePath} fill="none" stroke="var(--brand-red)" strokeWidth="2.5" />}
            
            {/* Data points and numeric revenue value labels above each dot */}
            {chartPoints.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="var(--brand-red)" strokeWidth="2.5" />
                {p.value > 0 && (
                  <text 
                    x={p.x} 
                    y={p.y - 12} 
                    fill="var(--text-main)" 
                    fontSize="9" 
                    fontWeight="800" 
                    textAnchor="middle"
                  >
                    ${Math.round(p.value)}
                  </text>
                )}
                {/* X axis bottom label */}
                <text x={p.x} y="212" fill="#9ca3af" fontSize="10" fontWeight="700" textAnchor="middle">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ border: '1px solid var(--border-light)', padding: '20px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Total Revenue</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: '800' }}>{formatPrice(totalRevenue)}</div>
        </div>

        <div style={{ border: '1px solid var(--border-light)', padding: '20px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Orders Volume</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: '800' }}>{totalOrders}</div>
        </div>

        <div style={{ border: '1px solid var(--border-light)', padding: '20px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Channels Split</div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', fontWeight: '700', paddingTop: '4px' }}>
            <span>🍽️ {dineInCount}</span>
            <span>🛍️ {pickupCount}</span>
            <span>🛵 {deliveryCount}</span>
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-light)', padding: '20px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>Avg Order Ticket</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: '800' }}>
            {formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0)}
          </div>
        </div>
      </div>

      {/* Best sellers vs low performing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid var(--border-light)', padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>🔥 Best-Selling Products</h4>
          {bestSellers.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No orders data found in this range.</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bestSellers.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: '700' }}>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.quantity} sold ({formatPrice(item.revenue)})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ border: '1px solid var(--border-light)', padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>📉 Low-Performing Products</h4>
          {lowPerforming.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No orders data found in this range.</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lowPerforming.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: '700' }}>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.quantity} sold ({formatPrice(item.revenue)})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

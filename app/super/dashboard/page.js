'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ShieldCheck, LifeBuoy, TrendingUp, Layers, AlertTriangle, Flame, Clock, ChevronRight, Activity, Banknote, Store } from 'lucide-react';
import '../../manager/manager.css';
import '../super.css';
import SuperSidebar from '../SuperSidebar';
import { useSuperAdmin } from '../layout';

const PERIODS = {
  today: { mult: 1, labels: ['9a','11a','1p','3p','5p','7p','9p','11p'], shape: [0.4, 0.7, 1, 0.85, 0.6, 1.1, 1.3, 0.5], headline: 'Today · so far', trend: '+6.1% vs yesterday' },
  week:  { mult: 6.4, labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], shape: [0.82, 0.9, 1, 0.95, 1.15, 1.4, 1.25], headline: 'This week · Mon–Sun', trend: '+11.8% vs last week' },
  month: { mult: 27, labels: ['W1','W2','W3','W4'], shape: [0.92, 1.05, 1, 1.12], headline: 'This month · last 30 days', trend: '+8.4% vs last month' },
};

export default function SuperDashboardPage() {
  const router = useRouter();
  const { tenants, tiers, platformStats, loading } = useSuperAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState('week');

  // Interactive chart states
  const chartRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Format money helper
  const usd = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyK = (n) => '$' + (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : Math.round(n).toLocaleString('en-US'));

  const activeTenants = tenants.filter(t => t.status === 'active');
  const suspendedTenants = tenants.filter(t => t.status === 'suspended');

  // Compute live statistics based on period
  const P = PERIODS[period];
  
  // Real platform metrics from context
  const hasRealStats = platformStats && platformStats[period];
  const totalOrders = hasRealStats ? platformStats[period].orders : Math.round(activeTenants.reduce((s, c) => s + (c.totalOrders || 0), 0) * P.mult);
  const totalRev = hasRealStats ? platformStats[period].revenue : ((activeTenants.reduce((s, c) => s + (c.totalRevenue || 0), 0) * P.mult) / 6.4);
  const trendLabel = hasRealStats ? platformStats[period].trend : P.trend;

  // Avg error rate
  const totalErr = activeTenants.reduce((s, c) => s + parseFloat(c.errorRate || 0), 0);
  const avgErr = activeTenants.length ? totalErr / activeTenants.length : 0;

  // KPIs
  const kpis = [
    { label: 'Active stores', icon: Store, val: activeTenants.length, foot: `${suspendedTenants.length} suspended`, cls: 'mut', accent: true },
    { label: 'Orders ' + ({ today: 'today', week: 'this week', month: 'this month' }[period]), icon: AlertTriangle, val: totalOrders.toLocaleString(), foot: `${trendLabel.match(/[\d.-]+/)?.[0] || '6.1'}% vs prev`, cls: 'up' },
    { label: 'Revenue volume', icon: Banknote, val: usd(totalRev), foot: `across all stores`, cls: 'up' },
    { label: 'Avg error rate', icon: Activity, val: avgErr.toFixed(1) + '%', foot: `${activeTenants.filter(c => parseFloat(c.errorRate) >= 2.5).length} elevated`, cls: avgErr >= 2 ? 'down' : 'mut' }
  ];

  // Needs Attention list
  const getMinutesSinceLastOrder = (lastOrderTime) => {
    if (!lastOrderTime || lastOrderTime === 'No orders yet') return 99999;
    return Math.round((new Date() - new Date(lastOrderTime)) / 60000);
  };

  const getAttentionItems = () => {
    const items = [];
    suspendedTenants.forEach(c => {
      items.push({ c, reason: 'Suspended — ordering paused', icon: 'pause', sev: 2 });
    });
    activeTenants.filter(c => parseFloat(c.errorRate) >= 2.5).forEach(c => {
      items.push({ c, reason: `Elevated error rate · ${c.errorRate}`, icon: 'activity', sev: 2 });
    });
    activeTenants.filter(c => getMinutesSinceLastOrder(c.lastOrderTime) > 20).forEach(c => {
      const min = getMinutesSinceLastOrder(c.lastOrderTime);
      const hours = Math.round(min / 60) || 1;
      items.push({ c, reason: `No orders in ${hours}h`, icon: 'clock', sev: 1 });
    });
    
    // Sort by severity and limit to 6 items
    const seen = new Set();
    return items
      .filter(i => !seen.has(i.c._id) && seen.add(i.c._id))
      .sort((a, b) => b.sev - a.sev)
      .slice(0, 6);
  };

  // Top clients by volume
  const getTopClients = () => {
    return [...activeTenants]
      .sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0))
      .slice(0, 5);
  };

  // Render SVG Chart paths
  const chartHeight = 260;
  const padL = 42;
  const padR = 8;
  const padT = 18;
  const padB = 26;

  // Mock smooth curve generator
  const smoothCurve = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return d;
  };

  const getChartElements = (W) => {
    const dataPoints = (platformStats && platformStats[period])
      ? platformStats[period].chart
      : P.shape.map(s => Math.round((activeTenants.reduce((s, c) => s + (c.totalOrders || 0), 0) * P.mult / P.shape.length) * s));
    const maxVal = Math.max(...dataPoints) * 1.2 || 10;
    const xstep = (W - padL - padR) / (dataPoints.length - 1);
    
    const xAt = i => padL + i * xstep;
    const yAt = v => padT + (1 - v / maxVal) * (chartHeight - padT - padB);

    const pts = dataPoints.map((v, i) => [xAt(i), yAt(v)]);
    const linePath = smoothCurve(pts);
    const areaPath = linePath ? `${linePath} L ${xAt(dataPoints.length - 1)} ${chartHeight - padB} L ${padL} ${chartHeight - padB} Z` : '';

    return { dataPoints, maxVal, xstep, xAt, yAt, pts, linePath, areaPath };
  };

  const handleMouseMove = (e) => {
    if (!chartRef.current || tenants.length === 0) return;
    const svg = chartRef.current;
    const W = svg.clientWidth || 600;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;

    const { dataPoints, xstep } = getChartElements(W);
    let i = Math.max(0, Math.min(dataPoints.length - 1, Math.round((mx - padL) / xstep)));

    setHoveredIdx(i);
  };

  // Render donut SVG paths
  const donutR = 64;
  const donutC = 2 * Math.PI * donutR;
  const donutSw = 24;

  const getTierCounts = () => {
    const counts = tiers.map(t => {
      // Allow mapping integer and string representation of tier field
      const matchCount = tenants.filter(c => {
        return c.tier === t.lv || c.tier === t._id || c.tier === t._id.replace('t', '');
      }).length;
      return { t, n: matchCount };
    });
    return counts;
  };

  const shades = ['#cfd0d4', '#1a1a1a', '#0a0a0a'];
  const getDonutSegments = () => {
    const counts = getTierCounts();
    const total = tenants.length || 1;
    let offset = 0;
    
    return counts.map((item, idx) => {
      const frac = item.n / total;
      const strokeDash = `${frac * donutC} ${donutC}`;
      const strokeOffset = -offset * donutC;
      offset += frac;
      
      return {
        ...item,
        strokeDash,
        strokeOffset,
        color: shades[idx] || '#1a1a1a'
      };
    });
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

      {/* Shared Sidebar Component */}
      <SuperSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content container */}
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
            <b>Dashboard Overview</b>
          </div>

          <div className="topbar-spacer"></div>

          <button
            onClick={() => alert("Super Admin operates this command cockpit directly.")}
            className="btn btn-outline btn-sm"
            style={{ height: '40px' }}
          >
            <LifeBuoy className="ic" />
            <span>Ecosystem Help</span>
          </button>
        </header>

        <main className="content">
          <div className="page-head">
            <div>
              <h1 className="page-title">Platform overview</h1>
              <p className="page-sub">Aggregated health across every store on Dinelabs.</p>
            </div>
            <div className="seg">
              <button className={period === 'today' ? 'active' : ''} onClick={() => setPeriod('today')}>Today</button>
              <button className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>Week</button>
              <button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>Month</button>
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
                  <div className="kpi-foot mut" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {k.accent && suspendedTenants.length > 0 ? (
                      <span style={{ color: 'var(--neg)', fontWeight: 'bold' }}>{k.foot}</span>
                    ) : (
                      <span>{k.foot}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* First grid row: Chart & Tier splits */}
          <div className="dash-grid" style={{ marginBottom: '16px' }}>
            <section className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">Platform order volume</div>
                  <div className="card-note">
                    {P.headline} · {totalOrders.toLocaleString()} orders
                  </div>
                </div>
                <span className="pill pill-soft" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp className="ic" style={{ width: '13px', height: '13px' }} />
                  <span>{trendLabel}</span>
                </span>
              </div>
              
              <div className="card-pad" style={{ paddingTop: '8px', position: 'relative' }}>
                <div className="chart-wrap" style={{ position: 'relative', overflow: 'visible' }}>
                  {/* Tooltip */}
                  {hoveredIdx !== null && (
                    (() => {
                      const W = chartRef.current ? chartRef.current.clientWidth : 600;
                      const { dataPoints, xAt, yAt } = getChartElements(W);
                      const x = xAt(hoveredIdx);
                      const y = yAt(dataPoints[hoveredIdx]);
                      const pctX = (x / W) * 100;

                      return (
                        <div 
                          className="chart-tip" 
                          style={{ 
                            opacity: 1, 
                            left: `${pctX}%`, 
                            top: `${y}px`, 
                            position: 'absolute',
                            transform: 'translate(-50%, -118%)',
                            pointerEvents: 'none',
                            background: 'var(--ink)',
                            color: '#fff',
                            borderRadius: '9px',
                            padding: '8px 11px',
                            fontSize: '12px',
                            fontWeight: '600',
                            zIndex: 5,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', display: 'block' }}>
                            {P.labels[hoveredIdx]}
                          </span>
                          <b>{dataPoints[hoveredIdx].toLocaleString()} orders</b>
                        </div>
                      );
                    })()
                  )}

                  <svg 
                    ref={chartRef}
                    className="chart-svg" 
                    height={chartHeight}
                    style={{ width: '100%', display: 'block', overflow: 'visible' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {(() => {
                      const W = chartRef.current ? chartRef.current.clientWidth : 600;
                      const { dataPoints, maxVal, xAt, yAt, pts, linePath, areaPath } = getChartElements(W);

                      return (
                        <>
                          <defs>
                            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines & Y Labels */}
                          {[0, 1, 2, 3, 4].map(idx => {
                            const val = (maxVal / 4) * idx;
                            const y = yAt(val);
                            return (
                              <g key={idx}>
                                <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                                <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9a9a9a" fontWeight="600">
                                  {Math.round(val).toLocaleString()}
                                </text>
                              </g>
                            );
                          })}

                          {/* X Labels */}
                          {P.labels.map((lb, idx) => (
                            <text key={idx} x={xAt(idx)} y={chartHeight - 6} textAnchor="middle" fontSize="11.5" fill="#9a9a9a" fontWeight="600">
                              {lb}
                            </text>
                          ))}

                          {/* Area & Line */}
                          {areaPath && <path d={areaPath} fill="url(#ag)" />}
                          {linePath && <path d={linePath} fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}

                          {/* Hover Guide & Dot */}
                          {hoveredIdx !== null && (
                            <>
                              <line 
                                x1={xAt(hoveredIdx)} 
                                x2={xAt(hoveredIdx)} 
                                y1={padT} 
                                y2={chartHeight - padB} 
                                stroke="#1a1a1a" 
                                strokeWidth="1" 
                                strokeDasharray="4 4" 
                                opacity="0.5" 
                              />
                              <circle 
                                cx={xAt(hoveredIdx)} 
                                cy={yAt(dataPoints[hoveredIdx])} 
                                r="5" 
                                fill="#1a1a1a" 
                                stroke="#fff" 
                                strokeWidth="2.5" 
                              />
                            </>
                          )}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </section>

            {/* Donut section */}
            <section className="card">
              <div className="card-head">
                <div className="card-title">
                  <Layers className="ic" />
                  <span>Stores by tier</span>
                </div>
                <span className="card-note">{tenants.length} total</span>
              </div>
              
              <div className="card-pad" style={{ paddingTop: '12px', paddingBottom: '18px' }}>
                <div className="donut-wrap" style={{ position: 'relative', width: '170px', height: '170px', margin: '2px auto 16px' }}>
                  <svg id="donut" viewBox="0 0 180 180" width="170" height="170" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="90" cy="90" r={donutR} fill="none" stroke="#f0f0f0" strokeWidth={donutSw} />
                    {getDonutSegments().map((seg, idx) => (
                      <circle 
                        key={idx}
                        cx="90" 
                        cy="90" 
                        r={donutR} 
                        fill="none" 
                        stroke={seg.color} 
                        strokeWidth={donutSw} 
                        strokeDasharray={seg.strokeDash} 
                        strokeDashoffset={seg.strokeOffset}
                        style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.2,0.8,0.2,1)' }}
                      />
                    ))}
                  </svg>
                  <div className="donut-center" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="donut-val">{tenants.length}</div>
                    <div className="donut-lbl">stores</div>
                  </div>
                </div>

                <div id="tierSplit">
                  {getDonutSegments().map((item, idx) => (
                    <div key={idx} className="tsplit-row">
                      <span className={`tier t${item.t.lv}`} style={{ minWidth: '108px' }}>
                        {item.t.name} · {item.t.tag}
                      </span>
                      <div className="tsplit-bar" style={{ height: '8px', borderRadius: '99px', background: 'var(--surface-3)', overflow: 'hidden' }}>
                        <span 
                          style={{ 
                            display: 'block', 
                            height: '100%', 
                            borderRadius: '99px', 
                            background: item.color,
                            width: tenants.length ? `${(item.n / tenants.length) * 100}%` : '0%'
                          }}
                        />
                      </div>
                      <span className="tnum" style={{ fontWeight: 800, fontSize: '14px' }}>{item.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Second grid row: Needs attention & Top volume clients */}
          <div className="dash-grid">
            <section className="card">
              <div className="card-head">
                <div className="card-title">
                  <AlertTriangle className="ic" style={{ color: 'var(--neg)' }} />
                  <span>Needs attention</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => router.push('/super/restaurants')}>
                  <span>Stores</span>
                  <ChevronRight className="ic" />
                </button>
              </div>

              <div id="attention">
                {getAttentionItems().length === 0 ? (
                  <div className="empty">
                    <ShieldCheck className="ic" style={{ color: 'var(--pos)' }} />
                    <h4>All clear</h4>
                    <p>Every store is healthy.</p>
                  </div>
                ) : (
                  getAttentionItems().map(({ c, reason, icon }) => (
                    <div 
                      key={c._id}
                      className="att-row" 
                      onClick={() => router.push(`/super/restaurants/${c._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="cmono">{c.name.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'S'}</span>
                      <div className="att-main">
                        <div className="cname">{c.name}</div>
                        <div className="att-reason" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-3)' }}>
                          <Clock className="ic" style={{ width: '12.5px', height: '12.5px' }} />
                          <span>{reason}</span>
                        </div>
                      </div>
                      <span className={`stat ${c.status === 'active' ? 'active' : 'suspended'}`}>
                        <span className="dot"></span>
                        {c.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                      <ChevronRight className="ic" style={{ width: '16px', height: '16px', color: 'var(--ink-3)', marginLeft: '6px' }} />
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <div className="card-title">
                  <Flame className="ic" style={{ color: '#ef4444' }} />
                  <span>Top by volume</span>
                </div>
                <span className="card-note">Lifetime orders count</span>
              </div>

              <div className="card-pad" id="topClients" style={{ paddingTop: '6px', paddingBottom: '10px' }}>
                {getTopClients().length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                    No restaurant volume data.
                  </div>
                ) : (
                  getTopClients().map((c, idx) => (
                    <div 
                      key={c._id}
                      className="top-row" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => router.push(`/super/restaurants/${c._id}`)}
                    >
                      <span className="top-rank">{idx + 1}</span>
                      <span className="cmono">{c.name.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'S'}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="cname">{c.name}</div>
                        <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                          dinelabs.co/<b>{c.slug}</b>
                        </span>
                      </div>
                      <div className="top-right" style={{ textAlign: 'right' }}>
                        <div className="tnum" style={{ fontWeight: 800, fontSize: '14px' }}>
                          {(c.totalOrders || 0).toLocaleString()}
                        </div>
                        <div className="cslug" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>orders</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

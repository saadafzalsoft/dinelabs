'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Layers,
  BellRing,
  Clock,
  TrendingUp,
  GitFork,
  Flame,
  ArrowRight,
  Banknote,
  ReceiptText,
  Tag,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Bike,
  ShoppingBag,
  Utensils
} from 'lucide-react';
import { useManager } from '../layout';

export default function ManagerDashboardPage() {
  const [period, setPeriod] = useState('week'); // 'today' | 'week' | 'month'
  const { session, orders, categories, loading, tenantSettings, t, lang } = useManager();

  const currency = tenantSettings?.baseCurrency || 'USD';
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    LBP: 'LBP ',
    AED: 'AED ',
    SAR: 'SR ',
    QAR: 'QR ',
    KWD: 'KD ',
    BHD: 'BD ',
    OMR: 'RO '
  };
  const currencySymbol = currencySymbols[currency] || (currency + ' ');

  // Mouse hover state for chart tooltip
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const chartSvgRef = useRef(null);

  const restaurantName = session?.tenantName || 'My Restaurant';
  const categoriesCount = categories.length;

  const formatPrice = (amount) => {
    const formattedAmount = currency === 'LBP' 
      ? parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : parseFloat(amount).toFixed(2).replace('.', ',');
    return `${currencySymbol}${formattedAmount}`;
  };

  // 1. Filter orders according to period selection
  const getPeriodFilteredOrders = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return orders.filter(o => {
      const oDate = new Date(o.createdAt);
      if (period === 'today') {
        return oDate >= startOfDay;
      }
      if (period === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return oDate >= oneWeekAgo;
      }
      if (period === 'month') {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return oDate >= oneMonthAgo;
      }
      return true;
    });
  };

  const currentPeriodOrders = getPeriodFilteredOrders();

  // 2. Compute KPI Metrics
  const activeOrders = currentPeriodOrders.filter(o => o.status !== 'declined');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = currentPeriodOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Render delta calculations (e.g. comparing past period data)
  const getDeltas = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
 
    let curOrders = [];
    let prevOrders = [];
    let label = '';
 
    if (period === 'today') {
      curOrders = orders.filter(o => new Date(o.createdAt) >= startOfToday);
      prevOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= startOfYesterday && d < startOfToday;
      });
      label = 'vs yesterday';
    } else if (period === 'week') {
      curOrders = orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
      prevOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= fourteenDaysAgo && d < sevenDaysAgo;
      });
      label = 'vs last week';
    } else {
      curOrders = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
      prevOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= sixtyDaysAgo && d < thirtyDaysAgo;
      });
      label = 'vs last month';
    }
 
    const curActive = curOrders.filter(o => o.status !== 'declined');
    const prevActive = prevOrders.filter(o => o.status !== 'declined');
 
    const curRev = curActive.reduce((sum, o) => sum + o.total, 0);
    const prevRev = prevActive.reduce((sum, o) => sum + o.total, 0);
 
    const curCount = curOrders.length;
    const prevCount = prevOrders.length;
 
    const curAvg = curCount > 0 ? curRev / curCount : 0;
    const prevAvg = prevCount > 0 ? prevRev / prevCount : 0;
 
    const pct = (cur, prev) => {
      if (prev === 0) return cur > 0 ? 100 : 0;
      return parseFloat((((cur - prev) / prev) * 100).toFixed(1));
    };
 
    return {
      revenue: pct(curRev, prevRev),
      orders: pct(curCount, prevCount),
      avg: pct(curAvg, prevAvg),
      label
    };
  };
 
  const deltas = getDeltas();
 
  // 3. Compile Area Line Chart Data coordinates
  const getChartDataPoints = () => {
    const activePeriodOrders = activeOrders;
    
    if (period === 'today') {
      const labels = ['9a', '11a', '1p', '3p', '5p', '7p', '9p', '11p'];
      const series = [0, 0, 0, 0, 0, 0, 0, 0];
      
      activePeriodOrders.forEach(o => {
        const h = new Date(o.createdAt).getHours();
        if (h >= 8 && h < 10) series[0] += o.total;
        else if (h >= 10 && h < 12) series[1] += o.total;
        else if (h >= 12 && h < 14) series[2] += o.total;
        else if (h >= 14 && h < 16) series[3] += o.total;
        else if (h >= 16 && h < 18) series[4] += o.total;
        else if (h >= 18 && h < 20) series[5] += o.total;
        else if (h >= 20 && h < 22) series[6] += o.total;
        else if (h >= 22) series[7] += o.total;
      });
 
      return { labels, series };
    }
 
    if (period === 'week') {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const series = [0, 0, 0, 0, 0, 0, 0];
      
      activePeriodOrders.forEach(o => {
        const day = new Date(o.createdAt).getDay();
        // Convert getDay() [0:Sun, 1:Mon...] to Mon-Sun index [0:Mon...6:Sun]
        const idx = day === 0 ? 6 : day - 1;
        series[idx] += o.total;
      });
 
      return { labels, series };
    }
 
    // Month: group by 5-day intervals
    const labels = ['W1', 'W2', 'W3', 'W4', 'W5'];
    const series = [0, 0, 0, 0, 0];
    const now = new Date();
    
    activePeriodOrders.forEach(o => {
      const diffTime = Math.abs(now - new Date(o.createdAt));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const idx = Math.min(4, Math.floor((30 - diffDays) / 6));
      if (idx >= 0) series[idx] += o.total;
    });
 
    return { labels, series };
  };
 
  const chart = getChartDataPoints();
  const maxVal = Math.max(...chart.series, 100) * 1.18;
 
  // Chart Layout Sizing
  const chartW = 580;
  const chartH = 260;
  const padL = 38;
  const padR = 8;
  const padT = 18;
  const padB = 26;
 
  const xstep = (chartW - padL - padR) / (chart.series.length - 1);
  const xAt = (i) => padL + i * xstep;
  const yAt = (v) => padT + (1 - v / maxVal) * (chartH - padT - padB);
 
  // Generate SVG points coordinates
  const pts = chart.series.map((v, i) => [xAt(i), yAt(v)]);
  
  // Bezier line builder
  const getBezierPath = () => {
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
 
  const linePath = getBezierPath();
  const areaPath = pts.length > 0
    ? `${linePath} L ${xAt(chart.series.length - 1)} ${chartH - padB} L ${padL} ${chartH - padB} Z`
    : '';
 
  // SVG grid lines ticks
  const ticks = 4;
  const scaleLines = [];
  for (let i = 0; i <= ticks; i++) {
    const v = (maxVal / ticks) * i;
    scaleLines.push({ value: v, y: yAt(v) });
  }
 
  // Handle chart mouse moves
  const handleMouseMove = (e) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width * chartW;
    
    let i = Math.round((mx - padL) / xstep);
    i = Math.max(0, Math.min(chart.series.length - 1, i));
    
    const x = xAt(i);
    const y = yAt(chart.series[i]);
    
    setHoveredPoint({
      index: i,
      label: chart.labels[i],
      value: chart.series[i],
      x,
      y
    });
 
    // Translate percentages coordinates to CSS layout values
    setTooltipX((x / chartW) * 100);
    setTooltipY(y);
  };
 
  // 4. Channel Split Donut calculations
  const getChannelMetrics = () => {
    const delivery = { count: 0, sales: 0 };
    const pickup = { count: 0, sales: 0 };
    const dinein = { count: 0, sales: 0 };
 
    currentPeriodOrders.forEach(o => {
      if (o.status === 'declined') return;
      if (o.type === 'delivery') {
        delivery.count++;
        delivery.sales += o.total;
      } else if (o.type === 'pickup') {
        pickup.count++;
        pickup.sales += o.total;
      } else if (o.type === 'dine-in') {
        dinein.count++;
        dinein.sales += o.total;
      }
    });
 
    return { delivery, pickup, dinein };
  };
 
  const channels = getChannelMetrics();
  const channelTotalSales = channels.delivery.sales + channels.pickup.sales + channels.dinein.sales;
 
  // Donut SVG parameters
  const r = 64;
  const C = 2 * Math.PI * r;
  const sw = 24;
 
  const getDonutSectors = () => {
    if (channelTotalSales === 0) return [];
    
    let off = 0;
    const order = ['delivery', 'pickup', 'dinein'];
    const shades = { delivery: '#C5DBF2', pickup: '#F5E1A0', dinein: '#C5E2D2' };
 
    return order.map(k => {
      const val = channels[k].sales;
      const frac = val / channelTotalSales;
      const dashArray = `${frac * C} ${C}`;
      const dashOffset = -off * C;
      off += frac;
      
      return {
        key: k,
        stroke: shades[k],
        dashArray,
        dashOffset
      };
    });
  };
 
  const donutSectors = getDonutSectors();
 
  // 5. Top Sellers progression lists
  const getTopSellers = () => {
    const productsMap = {};
    currentPeriodOrders.forEach(o => {
      if (o.status === 'declined') return;
      o.items.forEach(it => {
        if (!productsMap[it.name]) {
          productsMap[it.name] = { name: it.name, sold: 0 };
        }
        productsMap[it.name].sold += it.quantity;
      });
    });
 
    const list = Object.values(productsMap).sort((a, b) => b.sold - a.sold).slice(0, 4);
    const maxSold = list.length > 0 ? Math.max(...list.map(l => l.sold)) : 1;
    return list.map(item => ({
      ...item,
      percentage: (item.sold / maxSold) * 100
    }));
  };
 
  const topSellers = getTopSellers();
 
  // 6. Live Orders snapshot list
  const getSnapshotOrders = () => {
    return orders
      .filter(o => o.status === 'pending' || o.status === 'accepted')
      .slice(0, 4);
  };
 
  const snapOrders = getSnapshotOrders();
 
  const STATUS_CONFIG = {
    pending: { label: 'New', dot: 'var(--neg)' },
    accepted: { label: 'Preparing', dot: 'var(--warn)' },
    completed: { label: 'Fulfilled', dot: 'var(--pos)' },
    declined: { label: 'Declined', dot: 'var(--line-strong)' }
  };
 
  if (loading) {
    return (
      <div className="fade-in">
        {/* Page Head Skeleton */}
        <div className="page-head" style={{ marginBottom: '24px' }}>
          <div>
            <div className="skeleton" style={{ width: '280px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
          </div>
          <div className="skeleton" style={{ width: '160px', height: '40px', borderRadius: '10px' }} />
        </div>
 
        {/* Quick Actions Skeleton */}
        <div className="quick" style={{ marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card" style={{ height: '70px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px', marginBottom: '6px' }} />
                <div className="skeleton" style={{ width: '140px', height: '10px', borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
 
        {/* KPIs Cards Skeleton */}
        <div className="kpis" style={{ marginBottom: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card kpi" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div className="skeleton" style={{ width: '100px', height: '12px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
              </div>
              <div className="skeleton" style={{ width: '120px', height: '32px', borderRadius: '8px', marginBottom: '12px' }} />
              <div className="skeleton" style={{ width: '80px', height: '12px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
 
        {/* Charts & Grids Skeletons */}
        <div className="dash-grid">
          <div className="card" style={{ height: '380px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div className="skeleton" style={{ width: '100px', height: '18px', borderRadius: '4px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '200px', height: '12px', borderRadius: '4px' }} />
              </div>
              <div className="skeleton" style={{ width: '120px', height: '28px', borderRadius: '6px' }} />
            </div>
            <div className="skeleton" style={{ width: '100%', height: '240px', borderRadius: '12px' }} />
          </div>
 
          <div className="card" style={{ height: '380px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '100px', height: '18px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '60px', height: '12px', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', height: '240px' }}>
              <div className="skeleton" style={{ width: '130px', height: '130px', borderRadius: '50%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div className="skeleton" style={{ width: '100%', height: '12px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '90%', height: '12px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '80%', height: '12px', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="fade-in">
      
      {/* Welcome Greeting Row */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('Welcome back,')} {restaurantName}</h1>
          <p className="page-sub">{t("Here's what's happening across your storefront today.")}</p>
        </div>
        
        {/* Period Selector segmented control */}
        <div className="seg">
          <button 
            className={period === 'today' ? 'active' : ''} 
            onClick={() => setPeriod('today')}
          >
            {t('Today')}
          </button>
          <button 
            className={period === 'week' ? 'active' : ''} 
            onClick={() => setPeriod('week')}
          >
            {t('Week')}
          </button>
          <button 
            className={period === 'month' ? 'active' : ''} 
            onClick={() => setPeriod('month')}
          >
            {t('Month')}
          </button>
        </div>
      </div>
 
      {/* Quick Actions Links Grid */}
      <div className="quick">
        <Link href="/manager/products" className="qa">
          <span className="qa-ic"><UtensilsCrossed className="ic" /></span>
          <span>
            <span className="qa-t">{t('Add a product')}</span>
            <span className="qa-s">{t('New menu item')}</span>
          </span>
          <ArrowRight className="ic qa-arrow" />
        </Link>
        
        <Link href="/manager/products?tab=categories" className="qa">
          <span className="qa-ic"><Layers className="ic" /></span>
          <span>
            <span className="qa-t">{t('Manage categories')}</span>
            <span className="qa-s">{categoriesCount} {t('active categories')}</span>
          </span>
          <ArrowRight className="ic qa-arrow" />
        </Link>
 
        <Link href="/manager/live-orders" className="qa">
          <span className="qa-ic"><BellRing className="ic" /></span>
          <span>
            <span className="qa-t">{t('Live orders')}</span>
            <span className="qa-s">{orders.filter(o => o.status === 'pending').length} {t('active right now')}</span>
          </span>
          <ArrowRight className="ic qa-arrow" />
        </Link>
 
        <Link href="/manager/store-profile?tab=hours" className="qa">
          <span className="qa-ic"><Clock className="ic" /></span>
          <span>
            <span className="qa-t">{t('Opening hours')}</span>
            <span className="qa-s">{t('Open')} &bull; {t('Manage schedules')}</span>
          </span>
          <ArrowRight className="ic qa-arrow" />
        </Link>
      </div>
 
      {/* KPI Cards Grid */}
      <div className="kpis">
        {/* Card 1: Revenue */}
        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">{t('Total revenue')}</span>
            <span className="kpi-ic"><Banknote className="ic" /></span>
          </div>
          <div className="kpi-val tnum">{formatPrice(totalRevenue)}</div>
          <div className={`kpi-delta ${deltas.revenue >= 0 ? 'up' : 'down'}`}>
            {deltas.revenue >= 0 ? <ArrowUpRight className="ic" /> : <ArrowDownRight className="ic" />}
            {Math.abs(deltas.revenue)}%
            <span>{t(deltas.label)}</span>
          </div>
        </div>
 
        {/* Card 2: Orders Count */}
        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">{t('Orders')}</span>
            <span className="kpi-ic"><ReceiptText className="ic" /></span>
          </div>
          <div className="kpi-val tnum">{totalOrdersCount}</div>
          <div className={`kpi-delta ${deltas.orders >= 0 ? 'up' : 'down'}`}>
            {deltas.orders >= 0 ? <ArrowUpRight className="ic" /> : <ArrowDownRight className="ic" />}
            {Math.abs(deltas.orders)}%
            <span>{t(deltas.label)}</span>
          </div>
        </div>
 
        {/* Card 3: AOV */}
        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">{t('Avg order value')}</span>
            <span className="kpi-ic"><Tag className="ic" /></span>
          </div>
          <div className="kpi-val tnum">{formatPrice(avgOrderValue)}</div>
          <div className={`kpi-delta ${deltas.avg >= 0 ? 'up' : 'down'}`}>
            {deltas.avg >= 0 ? <ArrowUpRight className="ic" /> : <ArrowDownRight className="ic" />}
            {Math.abs(deltas.avg)}%
            <span>{t('per order')}</span>
          </div>
        </div>
      </div>
 
      {/* Trajectory area chart & channel donut grid */}
      <div className="dash-grid">
        
        {/* Line Chart Card */}
        <section className="card" style={{ position: 'relative' }}>
          <div className="card-head">
            <div>
              <div className="card-title">{t('Total sales')}</div>
              <div className="card-note">
                {period === 'today' ? t('Today · so far') : period === 'week' ? t('This week · Mon–Sun') : t('This month · last 30 days')} · {formatPrice(totalRevenue)}
              </div>
            </div>
            <span className="pill pill-soft">
              <TrendingUp className="ic" style={{ width: '13px', height: '13px' }} />
              <span>+{deltas.revenue}% {t(deltas.label)}</span>
            </span>
          </div>
          <div className="card-pad" style={{ paddingTop: '8px' }}>
            <div className="chart-wrap" id="chartWrap">
              <svg 
                ref={chartSvgRef}
                className="chart-svg" 
                height={chartH} 
                viewBox={`0 0 ${chartW} ${chartH}`}
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Horizontal gridlines */}
                {scaleLines.map((line, idx) => (
                  <g key={idx}>
                    <line x1={padL} x2={chartW - padR} y1={line.y} y2={line.y} stroke="#f0f0f0" strokeWidth="1" />
                    <text x={padL - 8} y={line.y + 4} textAnchor="end" fontSize="11" fill="#9a9a9a" fontWeight="600" fontFamily="var(--font)">
                      {currencySymbol}{Math.round(line.value)}
                    </text>
                  </g>
                ))}
 
                {/* X-axis labels */}
                {chart.labels.map((lbl, idx) => (
                  <text key={idx} x={xAt(idx)} y={chartH - 6} textAnchor="middle" fontSize="11.5" fill="#9a9a9a" fontWeight="600" fontFamily="var(--font)">
                    {t(lbl)}
                  </text>
                ))}
 
                {/* SVG Linear Gradient for Area Chart */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
                  </linearGradient>
                </defs>
 
                {/* Area under curve */}
                {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
 
                {/* Main line path */}
                {linePath && <path d={linePath} fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
 
                {/* Interactive Tooltip / Guidelines layers */}
                {hoveredPoint && (
                  <>
                    <line 
                      x1={hoveredPoint.x} 
                      x2={hoveredPoint.x} 
                      y1={padT} 
                      y2={chartH - padB} 
                      stroke="#0a0a0a" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                    />
                    <circle 
                      cx={hoveredPoint.x} 
                      cy={hoveredPoint.y} 
                      r="5" 
                      fill="#0a0a0a" 
                      stroke="#ffffff" 
                      strokeWidth="2.5" 
                    />
                  </>
                )}
              </svg>
 
              {/* Vector Hover Floating Tooltip */}
              {hoveredPoint && (
                <div 
                  className="chart-tip" 
                  style={{ 
                    opacity: 1, 
                    left: `${tooltipX}%`, 
                    top: `${tooltipY}px`
                  }}
                >
                  <span className="tip-k">{t(hoveredPoint.label)}</span>
                  <b>{formatPrice(hoveredPoint.value)}</b>
                </div>
              )}
            </div>
          </div>
        </section>
 
        {/* Channel Split Donut Chart Card */}
        <section className="card">
          <div className="card-head">
            <div className="card-title"><GitFork className="ic" style={{ marginRight: '7px' }} />{t('Channel split')}</div>
            <span className="card-note">{totalOrdersCount} {t('orders')}</span>
          </div>
          <div className="card-pad" style={{ paddingTop: '12px', paddingBottom: '18px' }}>
            <div className="donut-wrap">
              <svg id="donut" viewBox="0 0 180 180" width="170" height="170">
                {/* Background circle */}
                <circle cx="90" cy="90" r={r} fill="none" stroke="#f0f0f0" strokeWidth={sw} />
                
                {/* Segments */}
                {donutSectors.map((sector, idx) => (
                  <circle
                    key={idx}
                    cx="90"
                    cy="90"
                    r={r}
                    fill="none"
                    stroke={sector.stroke}
                    strokeWidth={sw}
                    strokeDasharray={sector.dashArray}
                    strokeDashoffset={sector.dashOffset}
                  />
                ))}
              </svg>
              
              <div className="donut-center">
                <div className="donut-val">{currencySymbol}{Math.round(channelTotalSales).toLocaleString()}</div>
                <div className="donut-lbl">{t('total sales')}</div>
              </div>
            </div>
 
            {/* Channels Legends list */}
            <div>
              {['delivery', 'pickup', 'dinein'].map(k => {
                const label = k === 'delivery' ? 'Delivery' : k === 'pickup' ? 'Pick-up' : 'Dine-in';
                const icon = k === 'delivery' ? Bike : k === 'pickup' ? ShoppingBag : Utensils;
                const Icon = icon;
                
                const chipBg = { delivery: '#C5DBF2', pickup: '#F5E1A0', dinein: '#C5E2D2' }[k];
                const iconCol = { delivery: '#3A6FB8', pickup: '#A87A1F', dinein: '#3E9466' }[k];
                
                const count = channels[k].count;
                const sales = channels[k].sales;
                const percentage = channelTotalSales > 0 ? Math.round((sales / channelTotalSales) * 100) : 0;
 
                return (
                  <div key={k} className="lg-row">
                    <span className="lg-ic" style={{ backgroundColor: chipBg, color: iconCol }}>
                      <Icon style={{ width: '16px', height: '16px' }} />
                    </span>
                    <div>
                      <div className="lg-name">{t(label)}</div>
                      <div className="lg-cnt">{count} {t('orders')} · {percentage}%</div>
                    </div>
                    <div className="lg-amt tnum">{formatPrice(sales)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
 
      {/* Live orders snapshot + top items grid */}
      <div className="dash-grid" style={{ marginTop: '16px' }}>
        
        {/* Snapshot Panel */}
        <section className="card">
          <div className="card-head">
            <div className="card-title"><BellRing className="ic" style={{ marginRight: '7px' }} />{t('Live orders snapshot')}</div>
            <Link className="btn btn-ghost btn-sm" href="/manager/live-orders">
              {t('View board')} <ArrowRight className="ic" />
            </Link>
          </div>
          <div>
            {snapOrders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }} className="mut3">
                {t('No active preparing orders.')}
              </div>
            ) : (
              snapOrders.map(o => {
                const itemsCount = o.items.reduce((s, it) => s + it.quantity, 0);
                const config = STATUS_CONFIG[o.status] || { label: o.status, dot: '#ccc' };
                const ChannelIcon = o.type === 'delivery' ? Bike : o.type === 'pickup' ? ShoppingBag : Utensils;
 
                return (
                  <Link key={o._id} className="snap-row" href={`/manager/live-orders?orderNo=${o.orderNo}`}>
                    <span className="snap-ic"><ChannelIcon className="ic" /></span>
                    <div className="snap-main">
                      <div className="snap-id">
                        #{o.orderNo}
                        <span className="pill" style={{ height: '21px' }}>
                          <span className="dot" style={{ backgroundColor: config.dot }}></span>
                          {t(config.label)}
                        </span>
                      </div>
                      <div className="snap-sub">
                        {o.customer?.name || t('Walk-in Guest')} &bull; {itemsCount} {itemsCount === 1 ? t('item') : t('items')} &bull; {o.type === 'dine-in' ? t('Dine-in') : o.type === 'pickup' ? t('Pick-up') : t('Delivery')}
                      </div>
                    </div>
                    <div className="snap-right">
                      <div className="snap-total tnum">{formatPrice(o.total)}</div>
                      <div className="snap-time">
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
 
        {/* Top Sellers Cards */}
        <section className="card">
          <div className="card-head">
            <div className="card-title"><Flame className="ic" style={{ marginRight: '7px' }} />{t('Top sellers')}</div>
            <span className="card-note">{t('Active Period')}</span>
          </div>
          <div className="card-pad" style={{ paddingTop: '8px', paddingBottom: '10px' }}>
            {topSellers.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }} className="mut3">
                {t('No items sold yet.')}
              </div>
            ) : (
              topSellers.map((seller, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '11px 0',
                    borderTop: idx > 0 ? '1px solid var(--line)' : 'none'
                  }}
                >
                  <span style={{ width: '22px', fontWeight: '800', color: 'var(--ink-3)', fontSize: '13px', textAlign: 'center' }}>
                    {idx + 1}
                  </span>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '13.5px' }}>{t(seller.name)}</div>
                    
                    {/* Animated progression progress line bar */}
                    <div className="ch-bar" style={{ marginTop: '6px' }}>
                      <span style={{ width: `${seller.percentage}%` }}></span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '13.5px' }} className="tnum">
                      {seller.sold}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{t('sold')}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

    </div>
  );
}

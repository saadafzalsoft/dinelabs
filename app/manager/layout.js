'use client';

import React, { useState, useEffect, Suspense, createContext, useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import './manager.css';
import { WORLD_LANGUAGES } from '../../lib/constants';

export const ManagerContext = createContext(null);

export function useManager() {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error('useManager must be used within a ManagerProvider');
  }
  return context;
}
import {
  LayoutDashboard,
  ReceiptText,
  Layers,
  UtensilsCrossed,
  PlusCircle,
  Clock,
  Bike,
  Armchair,
  ShoppingBag,
  Settings,
  Bell,
  ExternalLink,
  LifeBuoy,
  LogOut,
  Menu,
  ChevronDown,
  Check,
  ChevronsUpDown,
  Store
} from 'lucide-react';

function ManagerLayoutContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || '';
  
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  
  useEffect(() => {
    setNavigating(false);
  }, [pathname, searchParams]);

  const [session, setSession] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const prevPendingCountRef = React.useRef(0);

  // Cache state variables for manager dashboard and subpages
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [tenantSettings, setTenantSettings] = useState(null);
  const [tables, setTables] = useState([]);
  const [cacheLoading, setCacheLoading] = useState(true);

  const fetchCacheData = async () => {
    try {
      const [ordersRes, catsRes, prodsRes, modsRes, settingsRes, tablesRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/modifier-groups'),
        fetch('/api/tenant/settings'),
        fetch('/api/tables')
      ]);

      const [ordersData, catsData, prodsData, modsData, settingsData, tablesData] = await Promise.all([
        ordersRes.ok ? ordersRes.json() : [],
        catsRes.ok ? catsRes.json() : [],
        prodsRes.ok ? prodsRes.json() : [],
        modsRes.ok ? modsRes.json() : [],
        settingsRes.ok ? settingsRes.json() : null,
        tablesRes.ok ? tablesRes.json() : []
      ]);

      setOrders(ordersData);
      setCategories(catsData);
      setProducts(prodsData);
      setModifierGroups(modsData);
      setTenantSettings(settingsData);
      setTables(tablesData);

      const pendingCount = ordersData.filter(o => o.status === 'pending').length;
      setPendingOrdersCount(pendingCount);
    } catch (err) {
      console.error('Failed to load manager data cache:', err);
    } finally {
      setCacheLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setPendingOrdersCount(data.filter(o => o.status === 'pending').length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const refreshModifierGroups = async () => {
    try {
      const res = await fetch('/api/modifier-groups');
      if (res.ok) setModifierGroups(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const refreshTenantSettings = async () => {
    try {
      const res = await fetch('/api/tenant/settings');
      if (res.ok) setTenantSettings(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const refreshTables = async () => {
    try {
      const res = await fetch('/api/tables');
      if (res.ok) setTables(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCacheData();
    }
  }, [session]);

  // Map icon names to components
  const iconsMap = {
    'layout-dashboard': LayoutDashboard,
    'receipt-text': ReceiptText,
    'layers': Layers,
    'utensils-crossed': UtensilsCrossed,
    'plus-circle': PlusCircle,
    'clock': Clock,
    'bike': Bike,
    'armchair': Armchair,
    'shopping-bag': ShoppingBag,
    'settings': Settings,
    'bell': Bell,
  };

  const LANGUAGES = WORLD_LANGUAGES;

  // Verify session once on mount
  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setSession(data);
        } else {
          setSession(null);
          if (window.location.pathname !== '/manager') {
            router.push('/manager');
          }
        }
      } catch (err) {
        console.error('Session verify failed', err);
        if (window.location.pathname !== '/manager') router.push('/manager');
      } finally {
        setLoading(false);
      }
    }
    initSession();
  }, []); // Run ONLY once on mount!

  // Guard routing on pathname changes
  useEffect(() => {
    if (loading) return;
    const isLoginRoute = pathname === '/manager';
    if (session) {
      if (isLoginRoute) {
        router.push(session.role === 'superadmin' ? '/super/dashboard' : '/manager/dashboard');
      }
    } else {
      if (!isLoginRoute) {
        router.push('/manager');
      }
    }
  }, [pathname, session, loading, router]);

  // Load language settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('dl_lang');
      if (savedLang) {
        setLang(savedLang);
      }
    }
  }, []);

  // Poll active pending orders count for sidebar badge and context
  useEffect(() => {
    if (!session) return;
    refreshOrders();
    const interval = setInterval(refreshOrders, 10000);
    return () => clearInterval(interval);
  }, [session]);

  // Handle tracking of pending orders count to show/hide the notification banner
  useEffect(() => {
    if (pendingOrdersCount > 0) {
      if (pendingOrdersCount > prevPendingCountRef.current) {
        setShowNotificationBanner(true);
      }
    } else {
      setShowNotificationBanner(false);
    }
    prevPendingCountRef.current = pendingOrdersCount;
  }, [pendingOrdersCount]);

  // Handle repeated audio ringing alert when there are active pending orders
  useEffect(() => {
    if (pendingOrdersCount <= 0) return;
    if (pathname === '/manager/live-orders') return; // live-orders page plays its own sound

    const playNotificationChime = () => {
      if (typeof window === 'undefined') return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      try {
        const ctx = new AudioContext();
        
        // Match live-orders triangle dual ping chime exactly
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

        playChime(0, 880); 
        playChime(0.15, 1109);
      } catch (e) {
        console.warn('Audio play blocked or failed:', e);
      }
    };

    playNotificationChime();
    const ringInterval = setInterval(playNotificationChime, 2000); // Repeat every 2 seconds matching the live-orders page!
    return () => clearInterval(ringInterval);
  }, [pendingOrdersCount, pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/manager');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const exitMasquerade = async () => {
    try {
      await fetch('/api/super/masquerade', { method: 'DELETE' });
      window.location.href = '/super/dashboard';
    } catch (e) {
      console.error('Exit masquerade failed', e);
    }
  };

  const handleLangChange = (code) => {
    setLang(code);
    localStorage.setItem('dl_lang', code);
    setLangMenuOpen(false);
    // Simple custom notification matching toast
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">🌐</span><span>${LANGUAGES[code].label.split(' · ')[0]} selected</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleSupport = () => {
    // Notify manager of support contact matching prototype behavior
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">🤝</span><span>Support team notified — we’ll be in touch shortly</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  if (loading || (session && cacheLoading)) {
    return (
      <div className="layout" style={{ fontFamily: 'var(--font)' }}>
        {/* Sidebar Skeleton */}
        <aside className="sidebar" style={{ top: '0', borderRight: '1px solid var(--line)' }}>
          <div className="brand" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '34px', height: '34px', borderRadius: '9px' }} />
            <div>
              <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: '50px', height: '10px', borderRadius: '3px' }} />
            </div>
          </div>
          <div className="nav" style={{ opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ width: '60px', height: '12px', borderRadius: '3px' }} />
                <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '8px' }} />
                <div className="skeleton" style={{ width: '90%', height: '32px', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        </aside>
        
        {/* Main Column Skeleton */}
        <div className="main-col">
          <header className="topbar" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '180px', height: '24px', borderRadius: '6px' }} />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
          </header>
          <main className="content" style={{ opacity: 0.5 }}>
            <div style={{ marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '240px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '400px', height: '16px', borderRadius: '4px' }} />
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '12px' }} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If not logged in, render login page only if on the login path
  if (!session) {
    if (pathname === '/manager') {
      return <>{children}</>;
    }
    return null;
  }

  const activeSlug = session.isMasquerading ? session.masqueradeTenantSlug : session.tenantSlug;
  const activeName = session.isMasquerading ? session.masqueradeTenantName : (session.tenantName || 'My Restaurant');

  const navSections = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: 'layout-dashboard', path: '/manager/dashboard' },
        { id: 'orders', name: 'Live Orders', icon: 'receipt-text', path: '/manager/live-orders', badgeKey: 'newOrders' },
      ]
    },
    {
      group: 'Menu',
      items: [
        { id: 'categories', name: 'Categories', icon: 'layers', path: '/manager/categories' },
        { id: 'products', name: 'Products', icon: 'utensils-crossed', path: '/manager/products' },
        { id: 'addons', name: 'Add-ons', icon: 'plus-circle', path: '/manager/addons' },
      ]
    },
    {
      group: 'Store settings',
      items: [
        { id: 'hours', name: 'Opening hours', icon: 'clock', path: '/manager/opening-hours' },
        { id: 'delivery', name: 'Delivery', icon: 'bike', path: '/manager/delivery' },
        { id: 'dinein', name: 'Dine-in', icon: 'armchair', path: '/manager/dine-in' },
        { id: 'pickup', name: 'Pick-up', icon: 'shopping-bag', path: '/manager/pick-up' },
      ]
    },
    {
      group: 'Account',
      items: [
        { id: 'profile', name: 'Store profile', icon: 'settings', path: '/manager/store-profile' },
        { id: 'notifications', name: 'Notifications', icon: 'bell', path: '/manager/notifications' },
      ]
    }
  ];

  // Helper to check if a navigation item is active
  const isLinkActive = (item) => {
    return pathname === item.path;
  };

  // Get dynamic breadcrumb label
  const getCrumbLabel = () => {
    if (pathname === '/manager/dashboard') return 'Dashboard';
    if (pathname === '/manager/live-orders') return 'Live Orders';
    if (pathname === '/manager/products') return 'Products';
    if (pathname === '/manager/categories') return 'Categories';
    if (pathname === '/manager/addons') return 'Add-ons';
    if (pathname === '/manager/opening-hours') return 'Opening hours';
    if (pathname === '/manager/delivery') return 'Delivery';
    if (pathname === '/manager/dine-in') return 'Dine-in';
    if (pathname === '/manager/pick-up') return 'Pick-up';
    if (pathname === '/manager/store-profile') return 'Store profile';
    if (pathname === '/manager/notifications') return 'Notifications';
    return 'Manager';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ManagerContext.Provider value={{
      session,
      orders,
      categories,
      products,
      modifierGroups,
      tenantSettings,
      tables,
      loading: cacheLoading || loading,
      refreshOrders,
      refreshCategories,
      refreshProducts,
      refreshModifierGroups,
      refreshTenantSettings,
      refreshTables
    }}>
      <div className="layout">
        {navigating && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            animation: 'dl-fadeIn 0.2s ease'
          }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--line-2, #e5e7eb)',
              borderTopColor: 'var(--ink, #000)',
              borderRadius: '50%',
              animation: 'dl-spin 0.8s linear infinite',
              marginBottom: '16px'
            }} />
            <span style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--ink, #000)' }}>Loading portal...</span>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes dl-spin {
                to { transform: rotate(360deg); }
              }
              @keyframes dl-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}} />
          </div>
        )}
      {/* Live Order Received Toast Notification Banner */}
      {showNotificationBanner && pendingOrdersCount > 0 && (
        <div style={{
          position: 'fixed',
          top: session.isMasquerading ? '64px' : '24px',
          right: '24px',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          animation: 'slideIn 0.3s ease',
          fontFamily: 'var(--font)'
        }}>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideIn {
              from { transform: translateY(-20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>🔔 New Order Received</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>
              You have {pendingOrdersCount} pending order{pendingOrdersCount > 1 ? 's' : ''} requiring review.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link 
              href="/manager/live-orders" 
              onClick={() => setShowNotificationBanner(false)}
              style={{
                backgroundColor: '#ffffff',
                color: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              View Orders
            </Link>
            <button 
              onClick={() => setShowNotificationBanner(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0 4px',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Super Admin Masquerading Warning Banner */}
      {session.isMasquerading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, height: '40px',
          backgroundColor: '#ef4444', color: '#ffffff',
          zIndex: 100, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 20px',
          fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 'bold'
        }}>
          <span>⚠️ Warning: You are viewing as <strong>[{activeName}]</strong>. All actions are logged.</span>
          <button onClick={exitMasquerade} style={{
            backgroundColor: '#ffffff', color: '#ef4444',
            border: 'none', borderRadius: '4px', padding: '4px 10px',
            fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Exit Masquerade
          </button>
        </div>
      )}

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

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{ top: session.isMasquerading ? '40px' : '0', zIndex: mobileOpen ? 100 : 40 }}>
        <div className="brand">
          <img 
            src="/assets/dinelabs-logo.png" 
            alt="Dinelabs Manager" 
            style={{ height: '24px', width: 'auto', display: 'block' }} 
          />
        </div>

        <nav className="nav">
          {navSections.map((group, gIdx) => (
            <div key={gIdx} className="nav-group">
              <div className="nav-label">{group.group}</div>
              {group.items.map(item => {
                const isActive = isLinkActive(item);
                const IconComponent = iconsMap[item.icon];
                const href = item.query ? `${item.path}?${item.query}` : item.path;
                
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={() => {
                      setMobileOpen(false);
                      if (pathname !== item.path) {
                        setNavigating(true);
                      }
                    }}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    {IconComponent && <IconComponent className="ic" />}
                    <span>{item.name}</span>
                    {item.badgeKey === 'newOrders' && pendingOrdersCount > 0 && (
                      <span className="badge">{pendingOrdersCount}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Account bottom chip with logout menu */}
        <div className="nav-foot">
          <div className="user-chip" onClick={handleLogout} title="Click to Sign out">
            <div className="avatar" style={{ overflow: 'hidden' }}>
              {session?.tenantLogoUrl ? (
                <img 
                  src={session.tenantLogoUrl} 
                  alt="Restaurant Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                getInitials(activeName)
              )}
            </div>
            <div className="user-meta">
              <div className="user-name">{activeName}</div>
              <div className="user-sub">Sign out</div>
            </div>
            <LogOut className="ic" style={{ width: '16px', height: '16px', color: 'var(--ink-3)', marginLeft: 'auto' }} />
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="main-col" style={{ marginTop: session.isMasquerading ? '40px' : '0' }}>
        
        {/* Top bar header */}
        <header className="topbar">
          <button 
            className="icon-btn menu-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <Menu className="ic" />
          </button>
          
          <div className="crumb" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {session?.tenantLogoUrl ? (
              <img 
                src={session.tenantLogoUrl} 
                alt="Logo" 
                style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'contain', backgroundColor: '#fff', border: '1px solid var(--line)' }} 
              />
            ) : (
              <Store style={{ width: '15px', height: '15px' }} />
            )}
            <span>{activeName}</span>
            <span style={{ color: 'var(--line-strong)' }}>/</span>
            <b>{getCrumbLabel()}</b>
          </div>

          <div className="topbar-spacer"></div>

          {/* Open Storefront */}
          <a
            href={`/${activeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ height: '40px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
          >
            <ExternalLink className="ic" />
            <span>View store</span>
          </a>

          {/* Contact Support */}
          <a
            href="mailto:support@dinelabs.co?subject=DineLabs%20Support%20Request"
            className="btn btn-outline btn-sm"
            style={{ height: '40px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
          >
            <LifeBuoy className="ic" />
            <span>Contact support</span>
          </a>

          {/* Language Flag Dropdown */}
          <div className="lang-wrap">
            <button
              className="lang-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label="Language"
              title="Language"
            >
              <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--ink-2)' }} />
              <span id="langFlag" style={{ fontSize: '1.2rem', marginLeft: '2px' }}>
                {LANGUAGES[lang].flag}
              </span>
            </button>

            <div className={`lang-menu ${langMenuOpen ? 'open' : ''}`}>
              <div className="lang-menu-head">Store Language</div>
              {Object.keys(LANGUAGES).map(code => (
                <button
                  key={code}
                  className={`lang-opt ${code === lang ? 'active' : ''}`}
                  onClick={() => handleLangChange(code)}
                >
                  <span style={{ fontSize: '1.2rem' }}>{LANGUAGES[code].flag}</span>
                  <span>{LANGUAGES[code].label}</span>
                  {code === lang && <Check className="ic check-ic" />}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
    </ManagerContext.Provider>
  );
}

export default function ManagerLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="layout" style={{ fontFamily: 'var(--font)' }}>
        {/* Sidebar Skeleton */}
        <aside className="sidebar" style={{ top: '0', borderRight: '1px solid var(--line)' }}>
          <div className="brand" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '34px', height: '34px', borderRadius: '9px' }} />
            <div>
              <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: '50px', height: '10px', borderRadius: '3px' }} />
            </div>
          </div>
          <div className="nav" style={{ opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ width: '60px', height: '12px', borderRadius: '3px' }} />
                <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '8px' }} />
                <div className="skeleton" style={{ width: '90%', height: '32px', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        </aside>
        
        {/* Main Column Skeleton */}
        <div className="main-col">
          <header className="topbar" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '180px', height: '24px', borderRadius: '6px' }} />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
          </header>
          <main className="content" style={{ opacity: 0.5 }}>
            <div style={{ marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '240px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '400px', height: '16px', borderRadius: '4px' }} />
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '12px' }} />
            </div>
          </main>
        </div>
      </div>
    }>
      <ManagerLayoutContent>{children}</ManagerLayoutContent>
    </Suspense>
  );
}

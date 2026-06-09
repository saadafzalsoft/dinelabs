'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import './manager.css';
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
  const [session, setSession] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

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

  const LANGUAGES = {
    en: { label: 'English', flag: '🇬🇧' },
    ar: { label: 'العربية · Arabic', flag: '🇱🇧' },
    ru: { label: 'Русский · Russian', flag: '🇷🇺' },
    es: { label: 'Español · Spanish', flag: '🇪🇸' },
    fr: { label: 'Français · French', flag: '🇫🇷' },
  };

  // Fetch session status on load and path change
  useEffect(() => {
    async function checkSession() {
      const isLoginRoute = pathname === '/manager';
      
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (res.ok && data.authenticated) {
          setSession(data);
          if (isLoginRoute) {
            router.push(data.role === 'superadmin' ? '/super/dashboard' : '/manager/dashboard');
          }
        } else {
          setSession(null);
          if (!isLoginRoute) {
            router.push('/manager');
          }
        }
      } catch (err) {
        console.error('Session verify failed', err);
        if (!isLoginRoute) router.push('/manager');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [pathname, router]);

  // Load language settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('dl_lang');
      if (savedLang) {
        setLang(savedLang);
      }
    }
  }, []);

  // Poll active pending orders count for sidebar badge
  useEffect(() => {
    if (!session) return;
    
    async function fetchPendingCount() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          const pendingCount = data.filter(o => o.status === 'pending').length;
          setPendingOrdersCount(pendingCount);
        }
      } catch (err) {
        console.error('Failed to fetch pending orders count', err);
      }
    }

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, [session]);

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font)' }}>
        <h2>Loading portal session...</h2>
      </div>
    );
  }

  // If not logged in, render login page without layout
  if (!session) {
    return <>{children}</>;
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
        { id: 'categories', name: 'Categories', icon: 'layers', path: '/manager/products', query: 'tab=categories' },
        { id: 'products', name: 'Products', icon: 'utensils-crossed', path: '/manager/products' },
        { id: 'addons', name: 'Add-ons', icon: 'plus-circle', path: '/manager/products', query: 'tab=addons' },
      ]
    },
    {
      group: 'Store settings',
      items: [
        { id: 'hours', name: 'Opening hours', icon: 'clock', path: '/manager/store-profile', query: 'tab=hours' },
        { id: 'delivery', name: 'Delivery', icon: 'bike', path: '/manager/store-profile', query: 'tab=delivery' },
        { id: 'dinein', name: 'Dine-in', icon: 'armchair', path: '/manager/store-profile', query: 'tab=tables' },
        { id: 'pickup', name: 'Pick-up', icon: 'shopping-bag', path: '/manager/store-profile', query: 'tab=pickup' },
      ]
    },
    {
      group: 'Account',
      items: [
        { id: 'profile', name: 'Store profile', icon: 'settings', path: '/manager/store-profile' },
        { id: 'notifications', name: 'Notifications', icon: 'bell', path: '/manager/store-profile', query: 'tab=notifications' },
      ]
    }
  ];

  // Helper to check if a navigation item is active
  const isLinkActive = (item) => {
    if (pathname !== item.path) return false;
    if (item.query) {
      const q = item.query.split('=');
      return currentTab === q[1];
    }
    return !currentTab;
  };

  // Get dynamic breadcrumb label
  const getCrumbLabel = () => {
    if (pathname === '/manager/dashboard') return 'Dashboard';
    if (pathname === '/manager/live-orders') return 'Live Orders';
    if (pathname === '/manager/products') {
      if (currentTab === 'categories') return 'Categories';
      if (currentTab === 'addons') return 'Add-ons';
      return 'Products';
    }
    if (pathname === '/manager/store-profile') {
      if (currentTab === 'hours') return 'Opening hours';
      if (currentTab === 'delivery') return 'Delivery';
      if (currentTab === 'tables') return 'Dine-in';
      if (currentTab === 'pickup') return 'Pick-up';
      if (currentTab === 'notifications') return 'Notifications';
      return 'Store profile';
    }
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
    <div className="layout">
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

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{ top: session.isMasquerading ? '40px' : '0' }}>
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <div className="brand-name">Dinelabs</div>
            <div className="brand-sub">MANAGER</div>
          </div>
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
                    onClick={() => setMobileOpen(false)}
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
            <div className="avatar">
              {getInitials(activeName)}
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
          
          <div className="crumb">
            <Store style={{ width: '15px', height: '15px' }} />
            <span>{activeName}</span>
            <span style={{ color: 'var(--line-strong)' }}>/</span>
            <b>{getCrumbLabel()}</b>
          </div>

          <div className="topbar-spacer"></div>

          {/* Open Storefront */}
          <Link
            href={`/${activeSlug}`}
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{ height: '40px' }}
          >
            <ExternalLink className="ic" />
            <span>View store</span>
          </Link>

          {/* Contact Support */}
          <button
            onClick={handleSupport}
            className="btn btn-outline btn-sm"
            style={{ height: '40px' }}
          >
            <LifeBuoy className="ic" />
            <span>Contact support</span>
          </button>

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
  );
}

export default function ManagerLayout({ children }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: 'var(--font-sans)', color: 'var(--ink-2)' }}>
        <h3 style={{ fontWeight: '500' }}>Loading manager portal...</h3>
      </div>
    }>
      <ManagerLayoutContent>{children}</ManagerLayoutContent>
    </Suspense>
  );
}

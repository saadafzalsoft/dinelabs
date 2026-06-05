'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function ManagerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-heading)' }}>
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

  // Sidebar navigation matching reference screenshots
  const navSections = [
    {
      label: 'Dashboard',
      links: [
        { name: 'Home', icon: '🏠', path: '/manager/dashboard' },
      ]
    },
    {
      label: 'Menu Management',
      links: [
        { name: 'Categories', icon: '📋', path: '/manager/products', query: 'tab=categories' },
        { name: 'Products', icon: '🍕', path: '/manager/products' },
        { name: 'Add-ons', icon: '➕', path: '/manager/products', query: 'tab=addons' },
      ]
    },
    {
      label: 'Store settings',
      links: [
        { name: 'Opening hours', icon: '🕐', path: '/manager/store-profile', query: 'tab=hours' },
        { name: 'Delivery', icon: '🛵', path: '/manager/store-profile', query: 'tab=delivery' },
        { name: 'Dine-in', icon: '🍽️', path: '/manager/store-profile', query: 'tab=tables' },
        { name: 'Pick-up', icon: '🛍️', path: '/manager/store-profile', query: 'tab=pickup' },
      ]
    },
    {
      label: 'Account',
      links: [
        { name: 'Store profile', icon: '⚙️', path: '/manager/store-profile' },
        { name: 'Notifications', icon: '🔔', path: '/manager/store-profile', query: 'tab=notifications' },
      ]
    }
  ];

  // Get page title based on route
  const getPageTitle = () => {
    if (pathname === '/manager/dashboard') return 'Dashboard';
    if (pathname === '/manager/live-orders') return 'Live orders';
    if (pathname === '/manager/products') return 'Products';
    if (pathname === '/manager/store-profile') return 'Store Profile';
    return 'Manager';
  };

  return (
    <div className="portal-container" style={{ flexDirection: 'column' }}>
      
      {/* Super Admin Masquerading Warning Banner */}
      {session.isMasquerading && (
        <div className="masquerade-banner">
          <span>⚠️ Warning: You are viewing as <strong>[{activeName}]</strong> Manager portal. All actions are logged.</span>
          <button onClick={exitMasquerade} className="masquerade-exit-btn">
            Exit Masquerade
          </button>
        </div>
      )}

      {/* Main layout container */}
      <div style={{ display: 'flex', flexGrow: 1, minHeight: session.isMasquerading ? 'calc(100vh - 40px)' : '100vh' }}>
        
        {/* Sidebar Navigation — Light theme with section groups */}
        <aside className="portal-sidebar">
          <div className="portal-brand">
            Dinelabs <span>Manager</span>
          </div>

          <nav className="portal-nav">
            {navSections.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="portal-nav-section-label">{section.label}</div>
                {section.links.map(link => {
                  const isActive = pathname === link.path && !link.query;
                  return (
                    <Link
                      key={link.name}
                      href={link.query ? `${link.path}?${link.query}` : link.path}
                      className={`portal-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="portal-nav-icon">{link.icon}</span>
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          
          {/* Sign Out Button at bottom */}
          <button onClick={handleLogout} className="portal-signout-btn">
            ↩ Sign out
          </button>
        </aside>

        {/* Dynamic page content */}
        <div className="portal-content-area">
          <header className="portal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <h2 className="portal-title" style={{ display: 'none' }}>
                {getPageTitle()}
              </h2>
            </div>
            <div className="portal-user">
              <div className="portal-store-badge">
                🏪 {activeName}
              </div>
              <Link href={`/${activeSlug}`} target="_blank" style={{ fontSize: '0.8rem', color: 'var(--brand-red)', fontWeight: 'bold', textDecoration: 'none', border: '1px solid var(--brand-red)', padding: '6px 14px', borderRadius: '20px' }}>
                Open Storefront ↗
              </Link>
            </div>
          </header>
          
          <main className="portal-body">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Layers, CreditCard, ShieldCheck, LogOut } from 'lucide-react';

export default function SuperSidebar({ mobileOpen, setMobileOpen }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/super');
    } catch (e) {
      console.error(e);
    }
  };

  const menuGroups = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/super/dashboard' }
      ]
    },
    {
      group: 'Stores',
      items: [
        { id: 'clients', label: 'Stores', icon: Store, path: '/super/restaurants' }
      ]
    },
    {
      group: 'Platform',
      items: [
        { id: 'tiers', label: 'Tiers', icon: Layers, path: '/super/tiers' },
        { id: 'billing', label: 'Billing', icon: CreditCard, path: '/super/billing' }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{ zIndex: mobileOpen ? 100 : 40 }}>
      <div className="brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/super/dashboard')}>
        <img className="brand-logo" src="/assets/dinelabs-super-logo.svg" alt="DineLabs Super" />
        <span className="brand-tag">
          <span className="dot"></span>
          Super Console
        </span>
      </div>

      <nav className="nav">
        {menuGroups.map((g, gi) => (
          <div key={gi} className="nav-group">
            <div className="nav-label">{g.group}</div>
            {g.items.map((item, ii) => {
              // Mark active if current path starts with or is equal to item path
              const isActive = pathname === item.path || (item.id === 'clients' && pathname.startsWith('/super/restaurants'));
              const Icon = item.icon;
              return (
                <button
                  key={ii}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setMobileOpen(false);
                    router.push(item.path);
                  }}
                  style={{
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Icon className="ic" style={{ width: '18px', height: '18px' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="nav-foot" style={{ marginTop: 'auto' }}>
        <div className="user-chip" onClick={handleLogout} title="Click to Sign out" style={{ cursor: 'pointer' }}>
          <div className="avatar op" style={{ display: 'grid', placeItems: 'center', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '50%' }}>
            <ShieldCheck style={{ width: '16px', height: '16px' }} />
          </div>
          <div className="user-meta">
            <div className="user-name">Super Operator</div>
            <div className="user-sub" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Sign out</div>
          </div>
          <LogOut className="ic" style={{ width: '16px', height: '16px', color: 'var(--ink-3)', marginLeft: 'auto' }} />
        </div>
      </div>
    </aside>
  );
}

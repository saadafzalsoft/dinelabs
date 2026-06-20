'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './super.css';
import '../manager/manager.css';

const SuperAdminContext = createContext(null);

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
}

export default function SuperLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Cache data states
  const [tenants, setTenants] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchCacheData = async () => {
    try {
      const tenantsRes = await fetch('/api/super/tenants');
      if (!tenantsRes.ok) throw new Error('Failed to fetch tenants');
      const tenantsData = await tenantsRes.json();
      
      const tiersRes = await fetch('/api/super/tiers');
      if (!tiersRes.ok) throw new Error('Failed to fetch tiers');
      const tiersData = await tiersRes.json();

      setTenants(tenantsData.tenants || []);
      setTiers(tiersData.tiers || []);
    } catch (err) {
      console.error('Failed to fetch super cache data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const refreshData = async () => {
    setDataLoading(true);
    await fetchCacheData();
  };

  // Session verification on mount
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (res.ok && data.authenticated && data.role === 'superadmin') {
          setSession(data);
          fetchCacheData();
        } else {
          setSession(null);
          if (window.location.pathname !== '/super') {
            router.push('/super');
          }
        }
      } catch (err) {
        console.error('Session verify failed:', err);
        if (window.location.pathname !== '/super') router.push('/super');
      } finally {
        setSessionLoading(false);
      }
    }
    verifySession();
  }, []); // Run ONLY on mount!

  // Route Guard on path changes
  useEffect(() => {
    if (sessionLoading) return;
    const isLoginRoute = pathname === '/super';
    if (session) {
      if (isLoginRoute) {
        router.push('/super/dashboard');
      }
    } else {
      if (!isLoginRoute) {
        router.push('/super');
      }
    }
  }, [pathname, session, sessionLoading, router]);

  const isLoginRoute = pathname === '/super';

  if (sessionLoading) {
    // Show a premium layout skeleton matching super theme
    return (
      <div className="layout" style={{ fontFamily: 'var(--font)' }}>
        <aside className="sidebar" style={{ top: '0', borderRight: '1px solid var(--line)' }}>
          <div className="brand" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '34px', height: '34px', borderRadius: '9px' }} />
            <div>
              <div className="skeleton" style={{ width: '100px', height: '16px', borderRadius: '4px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: '60px', height: '10px', borderRadius: '3px' }} />
            </div>
          </div>
          <div className="nav" style={{ opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ width: '70px', height: '12px', borderRadius: '3px' }} />
                <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        </aside>
        <div className="main-col">
          <header className="topbar" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '200px', height: '24px', borderRadius: '6px' }} />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
          </header>
          <main className="content" style={{ opacity: 0.5 }}>
            <div style={{ marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '280px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '450px', height: '16px', borderRadius: '4px' }} />
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div className="skeleton" style={{ width: '100%', height: '300px', borderRadius: '12px' }} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If not logged in, only render children if we are on the login page.
  // Otherwise redirect is in progress, so return null.
  if (!session) {
    if (isLoginRoute) {
      return <>{children}</>;
    }
    return null;
  }

  // If we are on the login page but authenticated, return null as we redirect to dashboard
  if (isLoginRoute) {
    return null;
  }

  // Logged in as super admin -> expose context
  return (
    <SuperAdminContext.Provider value={{ tenants, tiers, loading: dataLoading, refreshData }}>
      {children}
    </SuperAdminContext.Provider>
  );
}

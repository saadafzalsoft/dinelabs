'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GTMHead, GTMBody } from '@/components/GTM';

const TIMEZONE_TO_COUNTRY = {
  'Asia/Tbilisi': 'GE',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Tokyo': 'JP',
  'Asia/Singapore': 'SG',
  'Europe/London': 'GB',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT',
  'Europe/Amsterdam': 'NL',
  'Europe/Warsaw': 'PL',
  'Europe/Istanbul': 'TR',
  'Europe/Kiev': 'UA',
  'Europe/Kyiv': 'UA',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Mexico_City': 'MX',
  'America/Sao_Paulo': 'BR',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
};

const COUNTRIES = [
  ['GE', 'Georgia', 'GEL'], ['US', 'United States', 'USD'], ['GB', 'United Kingdom', 'GBP'], ['DE', 'Germany', 'EUR'], ['FR', 'France', 'EUR'],
  ['ES', 'Spain', 'EUR'], ['IT', 'Italy', 'EUR'], ['NL', 'Netherlands', 'EUR'], ['PL', 'Poland', 'PLN'], ['TR', 'Türkiye', 'TRY'],
  ['AE', 'United Arab Emirates', 'AED'], ['SA', 'Saudi Arabia', 'SAR'], ['UA', 'Ukraine', 'UAH'], ['IN', 'India', 'INR'], ['SG', 'Singapore', 'SGD'],
  ['JP', 'Japan', 'JPY'], ['AU', 'Australia', 'AUD'], ['CA', 'Canada', 'CAD'], ['MX', 'Mexico', 'MXN'], ['BR', 'Brazil', 'BRL'],
];

const CURRENCIES = {
  USD: ['US Dollar', '$'], EUR: ['Euro', '€'], GBP: ['British Pound', '£'], GEL: ['Georgian Lari', '₾'], TRY: ['Turkish Lira', '₺'],
  AED: ['UAE Dirham', 'AED '], SAR: ['Saudi Riyal', 'SAR '], UAH: ['Ukrainian Hryvnia', '₴'], INR: ['Indian Rupee', '₹'], JPY: ['Japanese Yen', '¥'],
  PLN: ['Polish Złoty', 'zł '], AUD: ['Australian Dollar', 'A$'], CAD: ['Canadian Dollar', 'C$'], BRL: ['Brazilian Real', 'R$'], MXN: ['Mexican Peso', 'MX$'], SGD: ['Singapore Dollar', 'S$']
};

const CHANNELS = [
  { key: 'pickup', label: 'Pick-up', desc: 'Customers order ahead and collect from your counter.' },
  { key: 'delivery', label: 'Delivery', desc: 'Customers order to their door. Set ETA, fees and minimums.' },
  { key: 'dinein', label: 'Dine-in', desc: 'Guests scan a table QR code and order from their seat.' },
];

const BUILD_MS = 5200;
const slugify = s => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '').slice(0, 30);

export default function ManagerSignUpPage() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [store, setStore] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [country, setCountry] = useState('GE');
  const [currency, setCurrency] = useState('GEL');
  const [channels, setChannels] = useState({ delivery: false, pickup: true, dinein: false });
  const [tierCaps, setTierCaps] = useState({ modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, telegram: 0 } });
  const [tierInfo, setTierInfo] = useState({ name: 'Tier 0', tag: 'Free' });

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null); // 'country' | 'currency' | null
  const [dropdownQuery, setDropdownQuery] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tracking state & refs
  const hasTrackedStart = useRef(false);
  const eventIdRef = useRef('');
  if (!eventIdRef.current) {
    eventIdRef.current = 'dl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
  const createdDataRef = useRef(null);

  const triggerSignUpStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'sign_up_start' });
    }
  };

  // Build Sequence states
  const [building, setBuilding] = useState(false);
  const [buildElapsed, setBuildElapsed] = useState(0);
  const [buildDone, setBuildDone] = useState(false);

  // Layout sizing
  const [windowHeight, setWindowHeight] = useState(900);
  const buildRafRef = useRef(null);

  // Pre-fill store name from homepage hero and auto-detect country/currency
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const prefill = sp.get('store') || sp.get('name') || '';
      if (prefill) {
        setStore(prefill);
        setSlug(slugify(prefill));
      }
    }

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detected = TIMEZONE_TO_COUNTRY[tz];
      if (!detected && typeof navigator !== 'undefined') {
        const lang = navigator.language || '';
        const m = lang.match(/-([A-Z]{2})$/i);
        if (m) detected = m[1].toUpperCase();
      }

      if (detected) {
        const entry = COUNTRIES.find(c => c[0] === detected);
        if (entry) {
          setCountry(entry[0]);
          setCurrency(entry[2]);
        }
      }

      fetch('/api/geo')
        .then(res => res.json())
        .then(data => {
          if (data?.country) {
            const entry = COUNTRIES.find(c => c[0] === data.country);
            if (entry) {
              setCountry(entry[0]);
              setCurrency(entry[2]);
            }
          }
        })
        .catch(() => {});
    } catch (e) {}
  }, []);

  // Sync Tier 0 configuration from Super Admin
  useEffect(() => {
    fetch('/api/auth/signup')
      .then(res => res.json())
      .then(data => {
        if (data.tier?.caps) {
          setTierCaps(data.tier.caps);
          if (data.tier.name) {
            setTierInfo({ name: data.tier.name, tag: data.tier.tag || 'Free' });
          }
          const modes = data.tier.caps.modes || {};
          setChannels({
            pickup: Boolean(modes.pickup),
            delivery: Boolean(modes.delivery),
            dinein: Boolean(modes.dinein)
          });
        }
      })
      .catch(err => console.error('Error fetching tier caps:', err));
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleDocClick = (e) => {
      if (openDropdown && !e.target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
        setDropdownQuery('');
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape' && openDropdown) {
        setOpenDropdown(null);
        setDropdownQuery('');
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [openDropdown]);

  // Password strength calculation
  const getStrength = (p) => {
    let n = 0;
    if (p.length >= 8) n++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) n++;
    if (/\d/.test(p)) n++;
    if (/[^\w]/.test(p) || p.length >= 14) n++;
    return p ? Math.max(1, n) : 0;
  };

  const st = getStrength(password);
  const strengthColors = ['#ececec', '#cf2e36', '#b06a00', '#138a52', '#138a52'];
  const strengthLabels = ['', 'Weak', 'Okay', 'Good', 'Strong'];

  // Handle Wizard Next
  const handleNext = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!name.trim()) return setError('Enter your full name.');
      if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
      if (password.length < 8) return setError('Password needs at least 8 characters.');
      if (st < 2) return setError('Please choose a stronger password.');
      return setStep(2);
    }

    if (step === 2) {
      if (!store.trim()) return setError('Enter your restaurant name.');
      if (!slug) return setError('Choose a storefront link.');
      return setStep(3);
    }

    // Step 3: Submit Registration
    if (!Object.values(channels).some(Boolean)) {
      return setError('Pick at least one channel.');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          store: store.trim(),
          slug,
          country,
          currency,
          channels,
          eventId: eventIdRef.current,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      createdDataRef.current = data;

      try {
        localStorage.setItem('dlnew_account', JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          store: store.trim(),
          slug,
          country,
          currency
        }));
        localStorage.setItem('dl_mode', 'new');
      } catch (err) {}

      // Start the animated build sequence
      startBuildSequence(slug);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startBuildSequence = (finalSlug) => {
    const t0 = performance.now();
    setBuilding(true);
    setBuildElapsed(0);
    setBuildDone(false);

    const tick = () => {
      const el = performance.now() - t0;
      if (el < BUILD_MS) {
        setBuildElapsed(el);
        buildRafRef.current = requestAnimationFrame(tick);
        return;
      }
      setBuildElapsed(BUILD_MS);
      setBuildDone(true);
      setTimeout(() => {
        const doRedirect = () => {
          window.location.href = '/manager/dashboard';
        };

        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'sign_up',
            restaurant_id: createdDataRef.current?.restaurantId || createdDataRef.current?.tenantId || finalSlug,
            event_id: eventIdRef.current,
            eventCallback: doRedirect,
            eventTimeout: 2000
          });
        } else {
          doRedirect();
        }
      }, 1600);
    };

    buildRafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (buildRafRef.current) cancelAnimationFrame(buildRafRef.current);
    };
  }, []);

  // Dropdown filtering
  const q = dropdownQuery.trim().toLowerCase();
  const countryFlag = (c) => `https://flagcdn.com/w80/${c.toLowerCase()}.png`;

  const filteredCountries = COUNTRIES.filter(c => !q || c[1].toLowerCase().includes(q));
  const filteredCurrencies = Object.entries(CURRENCIES).filter(([k, v]) => !q || k.toLowerCase().includes(q) || v[0].toLowerCase().includes(q));

  const curObj = CURRENCIES[currency] || ['USD', '$'];
  const curSym = curObj[1].trim();
  const activeCountryObj = COUNTRIES.find(c => c[0] === country);
  const activeCountryName = activeCountryObj ? activeCountryObj[1] : '';

  const formatPrice = (v) => {
    if (currency === 'JPY') return curSym + Math.round(v * 150);
    return curSym + v.toFixed(2);
  };

  // Build steps definitions
  const activeChannelLabels = CHANNELS.filter(c => channels[c.key]).map(c => c.label);
  const chText = activeChannelLabels.length > 1
    ? activeChannelLabels.slice(0, -1).join(', ') + ' and ' + activeChannelLabels[activeChannelLabels.length - 1]
    : activeChannelLabels[0] || 'Pick-up';

  const buildLabels = [
    'Creating your account',
    `Reserving dinelabs.co/${slug || 'yourrestaurant'}`,
    `Setting ${currency} pricing${activeCountryName ? ' for ' + activeCountryName : ''}`,
    `Turning on ${chText}`,
    'Preparing your menu builder',
    'Publishing your storefront',
  ];

  const activeBuildIdx = Math.min(Math.floor(buildElapsed / (BUILD_MS / buildLabels.length)), buildLabels.length - 1);
  const buildProgressPct = buildDone ? 100 : Math.min(99, Math.round((1 - Math.pow(1 - Math.min(1, buildElapsed / BUILD_MS), 1.7)) * 100));

  // Phone preview scaling
  const phoneScale = Math.max(0.5, Math.min(1, (windowHeight - 190) / 612));
  const phoneWidth = Math.round(300 * phoneScale) + 'px';
  const phoneHeight = Math.round(612 * phoneScale) + 'px';

  return (
    <div className="dl-auth-wrap" style={{ minHeight: '100vh', minHeight: '100dvh', height: '100vh', height: '100dvh', overflow: 'hidden', display: 'flex', background: '#fff', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: '#0a0a0a' }}>
      <GTMHead />
      <GTMBody />
      
      {/* Left Column: Form Steps */}
      <main className="dl-auth-main" style={{ flex: '1 1 50%', minWidth: 0, display: 'flex', flexDirection: 'column', padding: 'clamp(16px, 3vh, 28px) 32px', overflowY: 'auto' }}>
        
        {/* Mobile Header Logo */}
        <div style={{ display: 'none' }} className="mobile-only-logo">
          <img src="/assets/dinelabs-logo.png" alt="Dinelabs Manager" style={{ display: 'block', width: '150px', height: 'auto', margin: '0 auto 24px' }} />
        </div>

        <form onSubmit={handleNext} onFocusCapture={triggerSignUpStart} onClickCapture={triggerSignUpStart} noValidate style={{ margin: 'auto', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Step Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'clamp(14px, 3vh, 24px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#6b6b6b' }}>
              <span>Step {step} of 3</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '4px', borderRadius: '999px', background: i <= step ? '#0a0a0a' : '#e6e6e6', transition: 'background .3s' }} />
              ))}
            </div>
          </div>

          {/* STEP 1: ACCOUNT DETAILS */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(24px, 4vh, 30px)', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>Create your account</h1>
              <p style={{ margin: '8px 0 clamp(12px, 3vh, 24px)', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b' }}>
                Get your restaurant's storefront live in a few minutes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="su-name" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: 'clamp(5px, 1vh, 8px)' }}>Full name</label>
                <input
                  id="su-name"
                  autoComplete="name"
                  placeholder="Nino Kapanadze"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  style={{ height: 'clamp(40px, 5.5vh, 46px)', padding: '0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'clamp(8px, 2vh, 16px)' }}>
                <label htmlFor="su-email" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: 'clamp(5px, 1vh, 8px)' }}>Work email</label>
                <input
                  id="su-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@restaurant.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  style={{ height: 'clamp(40px, 5.5vh, 46px)', padding: '0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'clamp(8px, 2vh, 16px)' }}>
                <label htmlFor="su-pass" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: 'clamp(5px, 1vh, 8px)' }}>Password</label>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <input
                    id="su-pass"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    style={{ flex: 1, minWidth: 0, height: 'clamp(40px, 5.5vh, 46px)', padding: '0 76px 0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', height: '30px', padding: '0 12px', border: 0, borderRadius: '8px', background: '#f5f5f5', font: 'inherit', fontSize: '12.5px', fontWeight: 500, color: '#0a0a0a', cursor: 'pointer' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ height: '3px', borderRadius: '999px', background: i <= st ? strengthColors[st] : '#ececec', transition: 'background .2s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b6b6b', minWidth: '64px', textAlign: 'right' }}>
                    {strengthLabels[st]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RESTAURANT PROFILE */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(24px, 4vh, 30px)', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>Tell us about your restaurant</h1>
              <p style={{ margin: '8px 0 clamp(12px, 3vh, 24px)', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b' }}>
                This is how customers will find you. You can change it later in Store profile.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="su-store" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: 'clamp(5px, 1vh, 8px)' }}>Restaurant name</label>
                <input
                  id="su-store"
                  placeholder="e.g. Forno Vivo"
                  value={store}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore(val);
                    if (!slugTouched) setSlug(slugify(val));
                    setError('');
                  }}
                  style={{ height: 'clamp(40px, 5.5vh, 46px)', padding: '0 16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', boxShadow: '0 1px 2px rgba(10,10,10,.04)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'clamp(8px, 2vh, 16px)' }}>
                <label htmlFor="su-slug" style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: 'clamp(5px, 1vh, 8px)' }}>Storefront link</label>
                <div style={{ display: 'flex', alignItems: 'center', height: 'clamp(40px, 5.5vh, 46px)', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fff', boxShadow: '0 1px 2px rgba(10,10,10,.04)', overflow: 'hidden' }}>
                  <span style={{ padding: '0 0 0 16px', fontSize: '15px', color: '#9a9a9a', whiteSpace: 'nowrap' }}>dinelabs.co/</span>
                  <input
                    id="su-slug"
                    placeholder="fornovivo"
                    value={slug}
                    onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); setError(''); }}
                    style={{ flex: 1, minWidth: 0, height: '100%', padding: '0 16px 0 2px', border: 0, background: 'transparent', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 30, display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '12px', marginTop: 'clamp(8px, 2vh, 16px)' }}>
                
                {/* Country Dropdown */}
                <div data-dropdown style={{ position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: 'clamp(5px, 1vh, 8px)' }}>Country</label>
                  <button
                    type="button"
                    aria-expanded={openDropdown === 'country'}
                    onClick={() => { setOpenDropdown(openDropdown === 'country' ? null : 'country'); setDropdownQuery(''); }}
                    style={{ height: 'clamp(40px, 5.5vh, 46px)', padding: '0 14px', borderRadius: '12px', border: `1px solid ${openDropdown === 'country' ? '#0a0a0a' : '#e0e0e0'}`, background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f5f5f5', backgroundImage: `url(${countryFlag(country)})`, backgroundSize: 'cover', backgroundPosition: 'center', flex: 'none', boxShadow: '0 0 0 1px rgba(10,10,10,.08)' }} />
                    <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeCountryName}</span>
                    <span style={{ width: '7px', height: '7px', borderRight: '1.5px solid #6b6b6b', borderBottom: '1.5px solid #6b6b6b', transform: 'translateY(-2px) rotate(45deg)', flex: 'none', marginLeft: 'auto' }} />
                  </button>

                  {openDropdown === 'country' && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '300px', maxWidth: 'calc(100vw - 48px)', zIndex: 50, background: '#fff', border: '1px solid #ececec', borderRadius: '14px', boxShadow: '0 12px 40px rgba(10,10,10,.14)', padding: '6px' }}>
                      <input
                        autoFocus
                        placeholder="Search countries"
                        value={dropdownQuery}
                        onChange={(e) => setDropdownQuery(e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '9px', border: '1px solid #ececec', background: '#fafafa', font: 'inherit', fontSize: '14px', color: '#0a0a0a', outline: 'none', marginBottom: '4px' }}
                      />
                      <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {filteredCountries.map(c => (
                          <button
                            key={c[0]}
                            type="button"
                            onClick={() => { setCountry(c[0]); setCurrency(c[2]); setOpenDropdown(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 10px', border: 0, borderRadius: '8px', background: c[0] === country ? '#f5f5f5' : 'transparent', font: 'inherit', fontSize: '14px', color: '#0a0a0a', cursor: 'pointer', textAlign: 'left' }}
                          >
                            <img src={countryFlag(c[0])} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', flex: 'none' }} />
                            <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c[1]}</span>
                            {c[0] === country && <span style={{ fontSize: '13px', color: '#0a0a0a' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Currency Dropdown */}
                <div data-dropdown style={{ position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 500, marginBottom: 'clamp(5px, 1vh, 8px)' }}>Currency</label>
                  <button
                    type="button"
                    aria-expanded={openDropdown === 'currency'}
                    onClick={() => { setOpenDropdown(openDropdown === 'currency' ? null : 'currency'); setDropdownQuery(''); }}
                    style={{ height: 'clamp(40px, 5.5vh, 46px)', padding: '0 14px', borderRadius: '12px', border: `1px solid ${openDropdown === 'currency' ? '#0a0a0a' : '#e0e0e0'}`, background: '#fff', font: 'inherit', fontSize: '15px', color: '#0a0a0a', outline: 'none', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ minWidth: '28px', height: '24px', padding: '0 6px', borderRadius: '6px', background: '#f5f5f5', display: 'grid', placeItems: 'center', fontSize: '12.5px', fontWeight: 500, flex: 'none' }}>
                      {curSym}
                    </span>
                    <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currency}</span>
                    <span style={{ width: '7px', height: '7px', borderRight: '1.5px solid #6b6b6b', borderBottom: '1.5px solid #6b6b6b', transform: 'translateY(-2px) rotate(45deg)', flex: 'none', marginLeft: 'auto' }} />
                  </button>

                  {openDropdown === 'currency' && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '300px', maxWidth: 'calc(100vw - 48px)', zIndex: 50, background: '#fff', border: '1px solid #ececec', borderRadius: '14px', boxShadow: '0 12px 40px rgba(10,10,10,.14)', padding: '6px' }}>
                      <input
                        autoFocus
                        placeholder="Search currencies"
                        value={dropdownQuery}
                        onChange={(e) => setDropdownQuery(e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '9px', border: '1px solid #ececec', background: '#fafafa', font: 'inherit', fontSize: '14px', color: '#0a0a0a', outline: 'none', marginBottom: '4px' }}
                      />
                      <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {filteredCurrencies.map(([k, v]) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => { setCurrency(k); setOpenDropdown(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 10px', border: 0, borderRadius: '8px', background: k === currency ? '#f5f5f5' : 'transparent', font: 'inherit', fontSize: '14px', color: '#0a0a0a', cursor: 'pointer', textAlign: 'left' }}
                          >
                            <span style={{ minWidth: '34px', height: '24px', padding: '0 6px', borderRadius: '6px', background: '#f5f5f5', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 500, flex: 'none' }}>
                              {v[1].trim()}
                            </span>
                            <span style={{ fontWeight: 500, flex: 'none' }}>{k}</span>
                            <span style={{ flex: 1, minWidth: 0, color: '#6b6b6b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v[0]}</span>
                            {k === currency && <span style={{ fontSize: '13px', color: '#0a0a0a' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: HOW DO YOU SERVE */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h1 style={{ margin: 0, fontSize: 'clamp(24px, 4vh, 30px)', lineHeight: 1.1, fontWeight: 400, letterSpacing: '-.035em' }}>How do you serve?</h1>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: '#f5f5f5', color: '#555', border: '1px solid #e0e0e0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {tierInfo.tag || 'Free'} Plan
                </span>
              </div>
              <p style={{ margin: '8px 0 clamp(10px, 2.5vh, 20px)', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b' }}>
                Pick active channels for your storefront. Only modes enabled in Tier 0 can be toggled.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CHANNELS.map(ch => {
                  const isAllowed = Boolean(tierCaps?.modes ? tierCaps.modes[ch.key] : (ch.key === 'pickup'));
                  const on = isAllowed && !!channels[ch.key];

                  return (
                    <button
                      key={ch.key}
                      type="button"
                      onClick={() => {
                        if (!isAllowed) {
                          setError(`This is the Free version. ${ch.label} is currently disabled in your plan. Upgrade in Super Admin to unlock.`);
                          return;
                        }
                        setError('');
                        setChannels(prev => ({ ...prev, [ch.key]: !prev[ch.key] }));
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: `1px solid ${on ? '#0a0a0a' : isAllowed ? '#e0e0e0' : '#ebebeb'}`,
                        background: on ? '#fafafa' : isAllowed ? '#fff' : '#fafafa',
                        opacity: isAllowed ? 1 : 0.65,
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: isAllowed ? 'pointer' : 'not-allowed',
                        transition: 'border-color .12s, background .12s, opacity .12s'
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: on ? '#0a0a0a' : isAllowed ? '#f5f5f5' : '#f0f0f0', display: 'grid', placeItems: 'center', flex: 'none', transition: 'background .15s' }}>
                        {ch.key === 'pickup' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={on ? '#fff' : isAllowed ? '#0a0a0a' : '#888'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        )}
                        {ch.key === 'delivery' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={on ? '#fff' : isAllowed ? '#0a0a0a' : '#888'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18.5" cy="17.5" r="3.5" /><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="15" cy="5" r="1" /><path d="M12 17.5V14l-3-3 4-3 2 3h2" />
                          </svg>
                        )}
                        {ch.key === 'dinein' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={on ? '#fff' : isAllowed ? '#0a0a0a' : '#888'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 500, color: '#0a0a0a' }}>{ch.label}</span>
                          {!isAllowed && (
                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#fbe9ea', color: '#cf2e36', border: '1px solid #fad2d4', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                              Free: Disabled
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b6b6b', marginTop: '3px', lineHeight: 1.4 }}>
                          {isAllowed ? ch.desc : `Disabled in your free plan. Only active modes configured in Tier 0 can be enabled.`}
                        </div>
                      </div>
                      <div style={{ width: '22px', height: '22px', borderRadius: '7px', border: `1.5px solid ${on ? '#0a0a0a' : isAllowed ? '#cfcfcf' : '#e0e0e0'}`, background: on ? '#0a0a0a' : isAllowed ? '#fff' : '#f0f0f0', color: on ? '#fff' : '#888', display: 'grid', placeItems: 'center', fontSize: '13px', flex: 'none' }}>
                        {on ? '✓' : !isAllowed ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        ) : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#fbe9ea', color: '#cf2e36', fontSize: '13px', fontWeight: 500 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cf2e36', flex: 'none' }} />
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: 'clamp(14px, 3vh, 24px)' }}>
            {step > 1 && !loading && (
              <button
                type="button"
                onClick={() => { setStep(step - 1); setError(''); }}
                style={{ height: 'clamp(42px, 6vh, 50px)', padding: '0 22px', border: '1px solid #e0e0e0', borderRadius: '999px', background: '#fff', color: '#0a0a0a', font: 'inherit', fontSize: '15.5px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flex: 'none' }}
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading || (step === 1 && st < 2)}
              style={{
                flex: 1,
                minWidth: 0,
                height: 'clamp(42px, 6vh, 50px)',
                border: 0,
                borderRadius: '999px',
                background: (step === 1 && st < 2) ? '#e6e6e6' : '#0a0a0a',
                color: (step === 1 && st < 2) ? '#9a9a9a' : '#fff',
                font: 'inherit',
                fontSize: '15.5px',
                fontWeight: 500,
                letterSpacing: '-.01em',
                cursor: (step === 1 && st < 2) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading && (
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
              )}
              {loading ? 'Creating your storefront…' : step === 3 ? 'Create storefront' : 'Continue'}
            </button>
          </div>

          {step === 1 && (
            <>
              <p style={{ margin: '12px 0 0', fontSize: '13px', lineHeight: 1.5, color: '#6b6b6b' }}>
                By creating an account you accept the Dinelabs <Link href="/terms" target="_blank" style={{ color: '#0a0a0a', textDecoration: 'underline' }}>Terms</Link> &amp; <Link href="/privacy" target="_blank" style={{ color: '#0a0a0a', textDecoration: 'underline' }}>Privacy Policy</Link>.
              </p>
              <div style={{ height: '1px', background: '#ececec', margin: 'clamp(12px, 3vh, 24px) 0 clamp(10px, 2.2vh, 18px)' }} />
              <div style={{ fontSize: '14px', color: '#6b6b6b' }}>
                Already have an account?{' '}
                <Link href="/manager" style={{ fontWeight: 500, color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Sign in
                </Link>
              </div>
            </>
          )}

        </form>
      </main>

      {/* Right Column: Live Mobile Mockup Preview */}
      <aside style={{ flex: '1 1 50%', minWidth: 0, background: '#f4f1ec', display: 'flex', flexDirection: 'column', padding: 'clamp(16px, 3vh, 28px) 32px', position: 'relative', overflow: 'hidden' }}>
        <img src="/assets/dinelabs-logo.png" alt="Dinelabs Manager" style={{ display: 'block', width: '150px', height: 'auto', alignSelf: 'flex-start' }} />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.4vh, 20px)', padding: 'clamp(12px, 2vh, 20px) 0' }}>
          
          {/* Phone Frame */}
          <div style={{ width: phoneWidth, height: phoneHeight, flex: 'none', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '300px', height: '612px', transform: `scale(${phoneScale})`, transformOrigin: '0 0', boxSizing: 'border-box', border: '9px solid #0a0a0a', borderRadius: '44px', background: '#fff', boxShadow: '0 30px 60px -20px rgba(40,30,20,.35), 0 2px 6px rgba(40,30,20,.12)', overflow: 'hidden', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              
              {/* Dynamic Island */}
              <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '84px', height: '22px', borderRadius: '999px', background: '#0a0a0a', zIndex: 2 }} />

              {/* Inner Phone Viewport */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: '344px', height: '724px', transform: 'scale(0.8198)', transformOrigin: '0 0', color: '#0a0a0a', background: '#fff' }}>
                <div style={{ height: '34px' }} />
                
                {/* Header */}
                <div style={{ position: 'relative', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 17px 0 24px', borderBottom: '1px solid #eeeff1' }}>
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M1 1.5h14M1 7h14M1 12.5h14" />
                  </svg>
                  <div style={{ position: 'absolute', left: '84px', right: '84px', textAlign: 'center', fontSize: '19px', fontWeight: 500, color: '#5b5b5b', letterSpacing: '-.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {store.trim() || 'Your Logo'}
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 12px', borderRadius: '999px', background: '#f2f3f5', fontSize: '13px', fontWeight: 600 }}>
                    <span style={{ fontSize: '13px', lineHeight: 1 }}>🇬🇧</span>EN
                  </span>
                </div>

                {/* Popular Carousel */}
                <div style={{ padding: '25px 16px 0', fontSize: '20px', fontWeight: 700, letterSpacing: '-.02em', lineHeight: '24px' }}>✨ Popular</div>
                <div style={{ display: 'flex', gap: '13px', padding: '19px 0 0 16px', overflow: 'hidden' }}>
                  <div style={{ flex: 'none', width: '177px' }}>
                    <div style={{ position: 'relative', height: '110px', borderRadius: '14px', overflow: 'hidden', background: '#c8141c' }}>
                      <img src="/assets/food-wrap.jpeg" alt="Wrap" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', right: '12px', bottom: '12px', width: '26px', height: '26px', borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 700, lineHeight: '17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Boneless Chicken Wrap</div>
                    <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 500, lineHeight: '17px', fontVariantNumeric: 'tabular-nums' }}>{formatPrice(7.5)}</div>
                  </div>

                  <div style={{ flex: 'none', width: '177px' }}>
                    <div style={{ position: 'relative', height: '110px', borderRadius: '14px', overflow: 'hidden', background: '#c8141c' }}>
                      <img src="/assets/food-fries.jpeg" alt="Fries" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', right: '12px', bottom: '12px', width: '26px', height: '26px', borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 700, lineHeight: '17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Loaded Fries</div>
                    <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 500, lineHeight: '17px', fontVariantNumeric: 'tabular-nums' }}>{formatPrice(4.3)}</div>
                  </div>
                </div>

                {/* Search Bar */}
                <div style={{ margin: '27px 17px 0 16px', height: '41px', borderRadius: '999px', background: '#f2f3f5', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 18px', fontSize: '14px', color: '#9a9ca1', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b5b5b" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                  Search menu items...
                </div>

                {/* Categories Tabs */}
                <div style={{ position: 'relative', display: 'flex', gap: '10px', padding: '30px 0 11px 16px', borderBottom: '1px solid #eeeff1', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {['All', 'Appetizers', 'Burgers', 'Wraps'].map((l, i) => (
                    <span key={l} style={{ flex: 'none', height: '34px', padding: '0 16px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: 500, background: i === 0 ? '#0a0a0a' : '#f2f3f5', color: i === 0 ? '#fff' : '#0a0a0a' }}>
                      {l}
                    </span>
                  ))}
                </div>

                {/* Appetizers Header & Items */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 17px 0 16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-.02em' }}>Appetizers</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#6b6b6b' }}>2 items</span>
                </div>

                <div style={{ padding: '8px 17px 0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '12px 0 18px', borderBottom: '1px solid #eeeff1' }}>
                    <div style={{ position: 'relative', width: '84px', height: '84px', borderRadius: '12px', flex: 'none', overflow: 'hidden', background: '#c8141c' }}>
                      <img src="/assets/food-popcorn.jpeg" alt="Chicken Popcorn" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingTop: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: '17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Chicken Popcorn</div>
                      <div style={{ fontSize: '12px', color: '#6b6b6b', marginTop: '4px', lineHeight: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Crispy bite-sized pieces of marinated chicken</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>{formatPrice(4.5)}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '12px 0 18px' }}>
                    <div style={{ position: 'relative', width: '84px', height: '84px', borderRadius: '12px', flex: 'none', overflow: 'hidden', background: '#c8141c' }}>
                      <img src="/assets/food-shrimps.jpeg" alt="Dynamite Shrimps" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingTop: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: '17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dynamite Shrimps</div>
                      <div style={{ fontSize: '12px', color: '#6b6b6b', marginTop: '4px', lineHeight: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Crispy shrimps tossed in a creamy spicy sauce</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>{formatPrice(6.9)}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Basket Bar */}
                <div style={{ position: 'absolute', left: '16px', right: '10px', bottom: '20px', height: '50px', borderRadius: '999px', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 0 22px', boxShadow: '0 10px 24px -10px rgba(0,0,0,.45)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <span style={{ position: 'relative', display: 'inline-flex' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h8.7a1.5 1.5 0 0 0 1.5-1.2L21 7H6" /></svg>
                      <span style={{ position: 'absolute', top: '-9px', right: '-8px', width: '16px', height: '16px', borderRadius: '50%', background: '#e1262f', fontSize: '10px', fontWeight: 600, display: 'grid', placeItems: 'center' }}>1</span>
                    </span>
                    View Basket
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatPrice(14.5)}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Live Preview Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '32px', padding: '0 14px', borderRadius: '999px', background: 'rgba(255,255,255,.7)', border: '1px solid rgba(10,10,10,.06)', fontSize: '12.5px', color: '#5e5a54', maxWidth: '100%' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#138a52', flex: 'none' }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Live preview · <span style={{ color: '#0a0a0a' }}>dinelabs.co/{slug || 'yourrestaurant'}</span>
            </span>
          </div>

        </div>
      </aside>

      {/* FULLSCREEN BUILD SEQUENCE OVERLAY */}
      {building && (
        <div role="status" aria-live="polite" style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#f4f1ec', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '88px 24px 48px' }}>
          <img src="/assets/dinelabs-logo.png" alt="Dinelabs Manager" style={{ position: 'absolute', top: '28px', left: '32px', display: 'block', width: '130px', height: 'auto' }} />
          
          <div style={{ margin: 'auto', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            
            {/* Circular Progress Ring */}
            <div style={{ position: 'relative', width: '128px', height: '128px', flex: 'none' }}>
              <svg width="128" height="128" viewBox="0 0 128 128" style={{ display: 'block', transform: 'rotate(-90deg)' }}>
                <circle cx="64" cy="64" r="56" fill="none" stroke="#e4ded3" strokeWidth="6" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={buildDone ? '#138a52' : '#0a0a0a'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="351.86"
                  strokeDashoffset={(351.86 * (1 - buildProgressPct / 100)).toFixed(2)}
                  style={{ transition: 'stroke .4s, stroke-dashoffset .2s ease-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                {!buildDone ? (
                  <span style={{ fontSize: '30px', fontWeight: 500, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums' }}>
                    {buildProgressPct}<span style={{ fontSize: '16px', color: '#6b6b6b', marginLeft: '1px' }}>%</span>
                  </span>
                ) : (
                  <span style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#138a52', display: 'grid', placeItems: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            <h1 style={{ margin: '32px 0 0', fontSize: '30px', lineHeight: 1.15, fontWeight: 400, letterSpacing: '-.035em', textWrap: 'balance' }}>
              {buildDone ? 'Your storefront is live' : `Building ${store.trim() || 'your restaurant'}`}
            </h1>
            <p style={{ margin: '10px 0 0', fontSize: '15.5px', lineHeight: 1.5, color: '#6b6b6b', textWrap: 'pretty' }}>
              {buildDone ? 'Taking you to your dashboard…' : 'Hang tight — this only takes a few seconds.'}
            </p>

            {/* Checklist */}
            <div style={{ width: '100%', marginTop: '32px', background: '#fff', borderRadius: '18px', boxShadow: '0 12px 40px rgba(40,30,20,.10), 0 1px 2px rgba(40,30,20,.06)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
              {buildLabels.map((lbl, i) => {
                const isItemDone = buildDone || i < activeBuildIdx;
                const isItemActive = !buildDone && i === activeBuildIdx;
                return (
                  <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 12px', borderRadius: '12px', background: isItemActive ? '#fafafa' : 'transparent', transition: 'background .3s' }}>
                    <div style={{ width: '22px', height: '22px', flex: 'none', display: 'grid', placeItems: 'center' }}>
                      {isItemDone && (
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0a0a0a', display: 'grid', placeItems: 'center' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                      )}
                      {isItemActive && (
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #e6e6e6', borderTopColor: '#0a0a0a', animation: 'spin .7s linear infinite', display: 'block' }} />
                      )}
                      {!isItemDone && !isItemActive && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dcdcdc' }} />
                      )}
                    </div>
                    <span style={{ flex: 1, minWidth: 0, fontSize: '14.5px', fontWeight: isItemActive ? 500 : 400, color: (isItemDone || isItemActive) ? '#0a0a0a' : '#9a9a9a', transition: 'color .3s' }}>
                      {lbl}
                    </span>
                  </div>
                );
              })}
            </div>

            {buildDone && (
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', height: '34px', padding: '0 14px', borderRadius: '999px', background: '#fff', border: '1px solid rgba(10,10,10,.06)', fontSize: '13px', color: '#5e5a54', maxWidth: '100%' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#138a52', flex: 'none' }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Live at <span style={{ color: '#0a0a0a', fontWeight: 500 }}>dinelabs.co/{slug}</span>
                </span>
              </div>
            )}

          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 860px) {
          aside { display: none !important; }
          .mobile-only-logo { display: block !important; margin: 0 auto 20px !important; }
          .dl-auth-wrap {
            height: auto !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            overflow-y: auto !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .dl-auth-main {
            flex: 1 1 100% !important;
            width: 100% !important;
            padding: 32px 20px 48px !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            height: auto !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
}

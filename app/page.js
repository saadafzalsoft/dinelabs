'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  Layers, 
  Cpu, 
  Clock, 
  Smartphone, 
  Languages, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  BadgeDollarSign,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Store,
      title: 'Instant QR Storefronts',
      desc: 'Publish your restaurant menu to a customizable, lightweight mobile web application instantly. Let customers order directly via table QR scans.'
    },
    {
      icon: Cpu,
      title: 'Real-time Live Orders',
      desc: 'Track and process orders in real time. Features audio chime alerts, status progression logs, and automatic table association.'
    },
    {
      icon: Languages,
      title: 'AI Translations Pool',
      desc: 'Seamlessly translate your items and descriptions into any world language, with automatic fallbacks to Google Translate API.'
    },
    {
      icon: Layers,
      title: 'Customizable Menus',
      desc: 'Configure deep product modifier groups, sizing variations, premium toppings, and ingredient removals with automatic price impacts.'
    },
    {
      icon: Clock,
      title: 'Delivery Zone geofencing',
      desc: 'Draw custom delivery boundaries, set independent transit times, and configure flat delivery fees per service area.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Access Control',
      desc: 'High-privilege console logs, remote store masquerading, custom encryption session tokens, and instant password rotation.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$29',
      priceYr: '$290',
      tag: 'Essentials',
      popular: false,
      limits: [
        'Up to 30 Active Products',
        '1 Translation Language',
        '1 Fulfillment Mode (Pickup)',
        'Email Alerts Notification',
        'Direct Storefront Slug (/bartartine)'
      ]
    },
    {
      name: 'Growth',
      price: '$79',
      priceYr: '$790',
      tag: 'Most Popular',
      popular: true,
      limits: [
        'Up to 150 Active Products',
        'Up to 3 Active Languages',
        '2 Fulfillment Modes (Pickup, Dine-in)',
        'Email + WhatsApp Notification',
        'Custom Delivery Geofences',
        'Priority Technical Support'
      ]
    },
    {
      name: 'Enterprise Pro',
      price: '$199',
      priceYr: '$1,990',
      tag: 'Unlimited Scaling',
      popular: false,
      limits: [
        'Unlimited Active Products',
        'All World Languages Enabled',
        'All Fulfillment Modes (Dine-in, Pickup, Delivery)',
        'All Alert Channels (Email, WhatsApp, Telegram)',
        'Zero Transaction Fees',
        '24/7 Premium SLA Support'
      ]
    }
  ];

  return (
    <div className="landing-viewport" style={{
      fontFamily: "'Inter', sans-serif",
      background: '#090a0f',
      color: '#f4f5f7',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#4f46e5',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)'
          }}>
            <UtensilsCrossed style={{ width: '18px', height: '18px', color: '#fff' }} />
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '22px',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>DineLabs</span>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => router.push('/manager')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
          >
            Manager Portal
          </button>
          <button 
            onClick={() => router.push('/super')}
            style={{
              background: '#4f46e5',
              border: 'none',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4338ca'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4f46e5'}
          >
            Super Console
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '80px 20px 60px',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          background: 'rgba(79, 70, 229, 0.15)',
          filter: 'blur(100px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.25)',
            color: '#a5b4fc',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '12.5px',
            fontWeight: '700',
            marginBottom: '28px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            <Sparkles style={{ width: '13px', height: '13px' }} />
            Next-Gen Restaurant Infrastructure
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '62px',
            fontWeight: '900',
            lineHeight: '1.05',
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            background: 'linear-gradient(to bottom, #ffffff, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Frictionless Ordering for Modern Restaurants
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            lineHeight: '1.6',
            maxWidth: '680px',
            margin: '0 auto 40px',
            fontWeight: '500'
          }}>
            DineLabs gives hospitality operators their own high-performance storefronts, table QR systems, and automated translations pool. Zero commissions, full developer control.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button 
              onClick={() => router.push('/bartartine')}
              style={{
                background: '#ffffff',
                border: 'none',
                color: '#090a0f',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>Explore Prototype Store</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Business Model highlight */}
      <section style={{
        maxWidth: '1000px',
        margin: '40px auto 80px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px',
          padding: '40px 48px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px'
            }}>
              <BadgeDollarSign style={{ width: '14px', height: '14px' }} />
              Zero Transaction Fees
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '32px',
              fontWeight: '800',
              letterSpacing: '-0.025em',
              marginBottom: '18px'
            }}>Our Business Model</h2>
            <p style={{
              fontSize: '15px',
              color: '#94a3b8',
              lineHeight: '1.6',
              margin: 0
            }}>
              Traditional food discovery aggregators demand up to 30% of each ticket, eroding restaurant margins. 
              <br/><br/>
              DineLabs operates on a **pure B2B SaaS model**. You pay a simple, flat subscription fee matching your item catalogs, active translation languages, and ordering channels. We never charge transaction commissions or hide extra setup costs.
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(255,255,255,0.02)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#10b981', display: 'flex' }}><Check style={{ width: '18px', height: '18px' }} /></div>
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Keep 100% of your order checkout volume</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#10b981', display: 'flex' }}><Check style={{ width: '18px', height: '18px' }} /></div>
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Direct relationship with your store customers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#10b981', display: 'flex' }}><Check style={{ width: '18px', height: '18px' }} /></div>
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Deploy custom geofence delivery zones</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#10b981', display: 'flex' }}><Check style={{ width: '18px', height: '18px' }} /></div>
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>No customer lock-in or proprietary tablets</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 80px',
        padding: '0 40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '36px',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            marginBottom: '10px'
          }}>Core Capabilities</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Robust tools engineered specifically for high-volume kitchen operations.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.015)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '28px',
              transition: 'border-color 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)'}
            >
              <div style={{
                background: 'rgba(79, 70, 229, 0.1)',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                color: '#a5b4fc',
                marginBottom: '20px'
              }}>
                <f.icon style={{ width: '22px', height: '22px' }} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '800',
                marginBottom: '10px',
                color: '#fff'
              }}>{f.title}</h3>
              <p style={{
                fontSize: '14px',
                color: '#94a3b8',
                lineHeight: '1.6',
                margin: 0
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Comparison */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 100px',
        padding: '0 40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '36px',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            marginBottom: '10px'
          }}>Subscription Tiers</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Select a subscription layout that maps to your restaurant scale.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {pricingTiers.map((t, idx) => (
            <div key={idx} style={{
              background: t.popular ? 'linear-gradient(to bottom, rgba(79, 70, 229, 0.08), rgba(79, 70, 229, 0.02))' : 'rgba(255,255,255,0.01)',
              border: t.popular ? '2px solid #4f46e5' : '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '36px 30px',
              position: 'relative'
            }}>
              {t.popular && (
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#4f46e5',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Best Value
                </span>
              )}
              <div style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tag}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '900', margin: '8px 0 16px' }}>{t.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                <span style={{ fontSize: '42px', fontWeight: '900', color: '#fff' }}>{t.price}</span>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '600' }}>/ month</span>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {t.limits.map((l, lIdx) => (
                  <div key={lIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#4f46e5', flexShrink: 0 }} />
                    <span style={{ color: '#cbd5e1' }}>{l}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => router.push('/manager')}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: t.popular ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  background: t.popular ? '#4f46e5' : 'transparent',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (t.popular) e.currentTarget.style.background = '#4338ca';
                  else e.currentTarget.style.borderColor = '#fff';
                }}
                onMouseLeave={(e) => {
                  if (t.popular) e.currentTarget.style.background = '#4f46e5';
                  else e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Minimal copyright credit to avoid cluttering footer layout */}
      <div style={{
        textAlign: 'center',
        padding: '30px 20px',
        fontSize: '12px',
        color: '#475569',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        &copy; {new Date().getFullYear()} DineLabs Inc. All rights reserved. Platform optimized for modern hospitality operations.
      </div>
    </div>
  );
}

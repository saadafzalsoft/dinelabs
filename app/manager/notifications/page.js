'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  Save,
  Mail,
  MessageSquare,
  Send,
  Info,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { useManager } from '../layout';

function NotificationsPageContent() {
  const router = useRouter();
  const { tenantSettings, loading, refreshTenantSettings } = useManager();

  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  // States
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappRecipient, setWhatsappRecipient] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState('');

  useEffect(() => {
    if (tenantSettings) {
      setSettings(tenantSettings);
      setEmailEnabled(tenantSettings.notifications?.emailEnabled || false);
      setEmailRecipient(tenantSettings.notifications?.emailRecipient || '');
      setWhatsappEnabled(tenantSettings.notifications?.whatsappEnabled || false);
      setWhatsappRecipient(tenantSettings.notifications?.whatsappRecipient || '');
      setTelegramEnabled(tenantSettings.notifications?.telegramEnabled || false);
      setTelegramChatId(tenantSettings.notifications?.telegramChatId || '');
    }
  }, [tenantSettings]);

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleSaveSettings = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const currentRes = await fetch('/api/tenant/settings');
      if (!currentRes.ok) throw new Error('Could not fetch settings');
      const currentData = await currentRes.json();

      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          notifications: {
            emailEnabled,
            emailRecipient,
            whatsappEnabled,
            whatsappRecipient,
            telegramEnabled,
            telegramChatId
          }
        })
      });

      if (res.ok) {
        refreshTenantSettings();
        triggerToast('Notification channels saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="fade-in" style={{ padding: '8px 0', maxWidth: '800px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    );
  }

  const isEmailAssigned = settings?.assignedNotifications?.email !== false;
  const isWhatsappAssigned = !!settings?.assignedNotifications?.whatsapp;
  const isTelegramAssigned = !!settings?.assignedNotifications?.telegram;

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub">Choose where new orders are sent. Pick as many channels as you like — they fire the moment an order comes in.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          <Check className="ic" />
          <span>{saving ? 'Saving...' : 'Save changes'}</span>
        </button>
      </div>

      <section>
        <div className="card">
          <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell className="ic" style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontWeight: 'bold' }}>Order notification channels</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Dashboard Channel */}
            <div className="notifications-channel-grid">
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--ink)', color: '#ffffff', display: 'grid', placeItems: 'center' }}>
                <LayoutDashboard style={{ width: '20px', height: '20px' }} />
              </div>
              <div style={{ paddingTop: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '700' }}>
                  <span>Dashboard live orders</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: '22px', padding: '0 9px', borderRadius: '999px', background: 'var(--surface-2)', color: 'var(--ink-2)', fontSize: '11.5px', fontWeight: '700', border: '1px solid var(--line)' }}>
                    <Check style={{ width: '11px', height: '11px', color: 'var(--pos)' }} />
                    Always on
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px', lineHeight: '1.45' }}>
                  New orders appear on the Live Orders board with a chime and a badge in the sidebar. The home base for every restaurant.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingOriginal: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-muted)' }}>Built-in</span>
              </div>
            </div>

            {/* Email Channel */}
            <div 
              className="notifications-channel-grid"
              style={{ 
                backgroundColor: isEmailAssigned ? 'transparent' : 'rgba(176,106,0,0.025)'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: emailEnabled && isEmailAssigned ? 'var(--ink)' : 'var(--surface-2)', color: emailEnabled && isEmailAssigned ? '#ffffff' : 'var(--ink)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}>
                <Mail style={{ width: '20px', height: '20px' }} />
              </div>
              <div style={{ paddingTop: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '700' }}>
                  <span>Email order receipts</span>
                  {!isEmailAssigned && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: '22px', padding: '0 9px', borderRadius: '999px', background: 'var(--warn-bg)', color: 'var(--warn)', fontSize: '11.5px', fontWeight: '700' }}>
                      Locked
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px', lineHeight: '1.45' }}>
                  A formatted order summary sent the second the order is placed.
                </div>
                
                {isEmailAssigned ? (
                  <div style={{ marginTop: '14px', maxWidth: '380px' }}>
                    <label className="label" style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Send order receipts to
                    </label>
                    <input 
                      type="email" 
                      className="input" 
                      placeholder="orders@yourstore.com" 
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      disabled={!emailEnabled}
                      style={{ height: '40px', borderRadius: '10px' }}
                    />
                    {emailEnabled && emailRecipient && (
                      <div className="nt-status ok" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--pos)', marginTop: '8px' }}>
                        <Check style={{ width: '12px', height: '12px' }} />
                        <span>Active</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '14px' }}>
                    <Lock style={{ width: '12px', height: '12px' }} />
                    <span>Activates after admin approval.</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', paddingOriginal: '6px' }}>
                {isEmailAssigned ? (
                  <label className="switch">
                    <input 
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={(e) => setEmailEnabled(e.target.checked)}
                    />
                    <span className="track"></span>
                  </label>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Locked</span>
                )}
              </div>
            </div>

            {/* WhatsApp Channel */}
            <div 
              className="notifications-channel-grid"
              style={{ 
                backgroundColor: isWhatsappAssigned ? 'transparent' : 'rgba(176,106,0,0.025)'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: whatsappEnabled && isWhatsappAssigned ? 'var(--ink)' : 'var(--surface-2)', color: whatsappEnabled && isWhatsappAssigned ? '#ffffff' : 'var(--ink)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}>
                <MessageSquare style={{ width: '20px', height: '20px' }} />
              </div>
              <div style={{ paddingTop: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '700' }}>
                  <span>WhatsApp alerts</span>
                  {!isWhatsappAssigned && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: '22px', padding: '0 9px', borderRadius: '999px', background: 'var(--warn-bg)', color: 'var(--warn)', fontSize: '11.5px', fontWeight: '700' }}>
                      Premium / Locked
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px', lineHeight: '1.45' }}>
                  An instant chat message to your team — great for kitchens that already live in WhatsApp.
                </div>
                
                {isWhatsappAssigned ? (
                  <div style={{ marginTop: '14px', maxWidth: '380px' }}>
                    <label className="label" style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      WhatsApp phone number (with country code)
                    </label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="+995 5xx xxx xxx" 
                      value={whatsappRecipient}
                      onChange={(e) => setWhatsappRecipient(e.target.value)}
                      disabled={!whatsappEnabled}
                      style={{ height: '40px', borderRadius: '10px' }}
                    />
                    {whatsappEnabled && whatsappRecipient && (
                      <div className="nt-status ok" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--pos)', marginTop: '8px' }}>
                        <Check style={{ width: '12px', height: '12px' }} />
                        <span>Active</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '14px' }}>
                    <Lock style={{ width: '12px', height: '12px' }} />
                    <span>Locked: Request admin to activate WhatsApp channel.</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', paddingOriginal: '6px' }}>
                {isWhatsappAssigned ? (
                  <label className="switch">
                    <input 
                      type="checkbox"
                      checked={whatsappEnabled}
                      onChange={(e) => setWhatsappEnabled(e.target.checked)}
                    />
                    <span className="track"></span>
                  </label>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Locked</span>
                )}
              </div>
            </div>

            {/* Telegram Channel */}
            <div 
              className="notifications-channel-grid"
              style={{ 
                backgroundColor: isTelegramAssigned ? 'transparent' : 'rgba(176,106,0,0.025)'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: telegramEnabled && isTelegramAssigned ? 'var(--ink)' : 'var(--surface-2)', color: telegramEnabled && isTelegramAssigned ? '#ffffff' : 'var(--ink)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}>
                <Send style={{ width: '20px', height: '20px' }} />
              </div>
              <div style={{ paddingTop: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '700' }}>
                  <span>Telegram Bot alerts</span>
                  {!isTelegramAssigned && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: '22px', padding: '0 9px', borderRadius: '999px', background: 'var(--warn-bg)', color: 'var(--warn)', fontSize: '11.5px', fontWeight: '700' }}>
                      Locked
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px', lineHeight: '1.45' }}>
                  A direct message via our Dinelabs Orders bot. Free and reliable.
                </div>
                
                {isTelegramAssigned ? (
                  <div style={{ marginTop: '14px', maxWidth: '380px' }}>
                    <label className="label" style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Telegram Chat ID
                    </label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. 987654321" 
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      disabled={!telegramEnabled}
                      style={{ height: '40px', borderRadius: '10px' }}
                    />
                    {telegramEnabled && telegramChatId && (
                      <div className="nt-status ok" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--pos)', marginTop: '8px' }}>
                        <Check style={{ width: '12px', height: '12px' }} />
                        <span>Active</span>
                      </div>
                    )}
                    <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', fontSize: '0.8rem', color: '#0369a1', lineHeight: '1.45' }}>
                      <strong>💬 Telegram Bot Setup Guide:</strong>
                      <ol style={{ paddingLeft: '16px', marginTop: '6px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>Find the bot <strong>@DinelabsOrdersBot</strong> on Telegram (or search in the app).</li>
                        <li>Click <strong>Start</strong> (or send <code>/start</code>) to initiate a chat with the bot.</li>
                        <li>Retrieve your unique Telegram Chat ID. You can easily find it by messaging <strong>@userinfobot</strong> on Telegram.</li>
                        <li>Copy the numeric Chat ID, paste it above, enable the channel, and click <strong>Save changes</strong>.</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '14px' }}>
                    <Lock style={{ width: '12px', height: '12px' }} />
                    <span>Locked: Request admin to activate Telegram channel.</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', paddingOriginal: '6px' }}>
                {isTelegramAssigned ? (
                  <label className="switch">
                    <input 
                      type="checkbox"
                      checked={telegramEnabled}
                      onChange={(e) => setTelegramEnabled(e.target.checked)}
                    />
                    <span className="track"></span>
                  </label>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Locked</span>
                )}
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 22px', backgroundColor: '#f9fafb', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', borderTop: '1px solid var(--line)', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
            <Info className="ic" style={{ width: '15px', height: '15px', color: 'var(--text-muted)' }} />
            <span>Notifications stop automatically when your store is outside opening hours.</span>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function ManagerNotificationsPage() {
  return (
    <Suspense fallback={
      <div className="fade-in" style={{ padding: '8px 0', maxWidth: '800px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    }>
      <NotificationsPageContent />
    </Suspense>
  );
}

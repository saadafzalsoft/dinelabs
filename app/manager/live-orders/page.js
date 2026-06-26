'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BellRing,
  Bike,
  ShoppingBag,
  Utensils,
  LayoutGrid,
  Clock,
  ReceiptText,
  User,
  Phone,
  Mail,
  Info,
  X,
  Check,
  ArrowRight,
  Inbox,
  ChefHat,
  PackageCheck,
  CheckCheck,
  StickyNote,
  AlertCircle,
  Languages
} from 'lucide-react';
import { useManager } from '../layout';

function LiveOrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { orders, loading, refreshOrders, tenantSettings, lang, t } = useManager();

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
  const [channelFilter, setChannelFilter] = useState(''); // '' | 'delivery' | 'pickup' | 'dine-in'
  
  // Local storage cleared completed orders ids to keep Kanban board clean
  const [dismissedIds, setDismissedIds] = useState([]);
  
  // Selected order for details modal popup
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Translation states
  const [translatedNotes, setTranslatedNotes] = useState('');
  const [translatedAddress, setTranslatedAddress] = useState('');
  const [translatedItemNotes, setTranslatedItemNotes] = useState({});
  const [translatingNotes, setTranslatingNotes] = useState(false);
  const [translatingAddress, setTranslatingAddress] = useState(false);
  const [translatingItemNotes, setTranslatingItemNotes] = useState({}); // idx -> boolean

  useEffect(() => {
    setTranslatedNotes('');
    setTranslatedAddress('');
    setTranslatedItemNotes({});
    setTranslatingNotes(false);
    setTranslatingAddress(false);
    setTranslatingItemNotes({});
  }, [selectedOrder?._id]);

  const handleTranslateText = async (text, type, idx = null) => {
    if (!text) return;
    try {
      if (type === 'notes') setTranslatingNotes(true);
      else if (type === 'address') setTranslatingAddress(true);
      else if (type === 'itemNotes') {
        setTranslatingItemNotes(prev => ({ ...prev, [idx]: true }));
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: lang || 'en' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translated) {
          if (type === 'notes') setTranslatedNotes(data.translated);
          else if (type === 'address') setTranslatedAddress(data.translated);
          else if (type === 'itemNotes') {
            setTranslatedItemNotes(prev => ({ ...prev, [idx]: data.translated }));
          }
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      if (type === 'notes') setTranslatingNotes(false);
      else if (type === 'address') setTranslatingAddress(false);
      else if (type === 'itemNotes') {
        setTranslatingItemNotes(prev => ({ ...prev, [idx]: false }));
      }
    }
  };

  // State for delivery transit minutes modal
  const [deliveryMinutesModal, setDeliveryMinutesModal] = useState(null);
  const [transitMinutes, setTransitMinutes] = useState(20);

  // Audio Notification references
  const audioContextRef = useRef(null);
  const soundIntervalRef = useRef(null);

  // Load dismissed orders from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dl_dismissed_orders');
        if (saved) {
          setDismissedIds(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed loading dismissed orders list', e);
      }
    }
  }, []);



  // Check if there is an orderNo query scanning parameter to highlight & auto-open
  useEffect(() => {
    if (orders.length > 0 && typeof window !== 'undefined') {
      const scannedOrderNo = searchParams.get('orderNo');
      if (scannedOrderNo) {
        const targetOrder = orders.find(o => o.orderNo.toString() === scannedOrderNo.toString());
        if (targetOrder) {
          setSelectedOrder(targetOrder);
          // Clean search query from URL to avoid locked redirects on manual reloads
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    }
  }, [orders, searchParams]);

  // Persistent audio alert loop for Pending orders
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  useEffect(() => {
    if (pendingOrdersCount > 0) {
      startNotificationSound();
    } else {
      stopNotificationSound();
    }
    return () => stopNotificationSound();
  }, [pendingOrdersCount]);

  const startNotificationSound = () => {
    if (soundIntervalRef.current) return;
    
    soundIntervalRef.current = setInterval(() => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Programmatic bell tone generation (synthesizing a dual bell ring)
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

        // Pleasant high-pitch double ping chime alert (bell A5 + C#6)
        playChime(0, 880); 
        playChime(0.15, 1109);
      } catch (e) {
        console.warn('Audio Context blocked by browser permission rules. Playback requires click interaction.');
      }
    }, 2000); // Persistent loop chime every 2 seconds
  };

  const stopNotificationSound = () => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
  };

  const triggerAlertSoundToggle = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioContextRef.current.resume();
    
    // Add custom transient notification toast
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">🔔</span><span>${t('Audio notification ring path connected!')}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  // Mutates order status
  const handleModifyStatus = async (orderId, newStatus, deliveryMinutes = null) => {
    try {
      const payload = { status: newStatus };
      if (deliveryMinutes !== null) {
        payload.deliveryMinutes = deliveryMinutes;
      }
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Refresh context orders cache
        refreshOrders();
        
        // Update selected order in state if it's currently open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({
            ...prev,
            status: newStatus,
            ...(deliveryMinutes !== null ? { deliveryMinutes } : {})
          }));
        }

        // Add custom visual alert toast
        let label = t('Status updated');
        if (newStatus === 'accepted') label = t('Order accepted!');
        else if (newStatus === 'ready') label = t('Order marked ready!');
        else if (newStatus === 'shipped') label = t('Order shipped!');
        else if (newStatus === 'completed') label = t('Order completed!');
        else if (newStatus === 'declined') label = t('Order declined');

        const el = document.createElement('div');
        el.className = 'toast-wrap';
        el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${label}</span></div>`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
      } else {
        alert('Failed modifying order status');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReadyClick = (order) => {
    if (order.type === 'delivery') {
      setTransitMinutes(20);
      setDeliveryMinutesModal(order);
    } else {
      handleModifyStatus(order._id, 'ready');
    }
  };

  // Dismiss / Clear completed order from active Kanban board
  const handleDismissOrder = (orderId) => {
    const updatedDismissed = [...dismissedIds, orderId];
    setDismissedIds(updatedDismissed);
    localStorage.setItem('dl_dismissed_orders', JSON.stringify(updatedDismissed));
    
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(null);
    }

    // Trigger visual toast
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${t('Order cleared from active board')}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  // 7. Get calculated counts for status stats headers
  const getStats = () => {
    const c = (status) => orders.filter(o => o.status === status).length;
    // Ready active counts are ready, shipped, or completed orders that haven't been dismissed
    const readyActive = orders.filter(o => ['ready', 'shipped', 'completed'].includes(o.status) && !dismissedIds.includes(o._id)).length;
    const completedTotalCount = orders.filter(o => o.status === 'completed').length;
    
    return {
      new: c('pending'),
      preparing: c('accepted'),
      ready: readyActive,
      completedToday: completedTotalCount
    };
  };

  const stats = getStats();

  // Kanban Columns definition
  const columns = [
    { key: 'pending', title: 'New', dot: 'var(--neg)' },
    { key: 'accepted', title: 'In progress', dot: 'var(--info)' },
    { key: 'completed_group', title: 'Ready / Shipped', dot: 'var(--pos)' }
  ];

  const channelIcons = {
    'dine-in': Utensils,
    pickup: ShoppingBag,
    delivery: Bike
  };

  const channelLabels = {
    'dine-in': 'Dine-in',
    pickup: 'Pick-up',
    delivery: 'Delivery'
  };

  const getFulfillmentInfo = (o) => {
    if (o.type === 'dine-in') {
      return {
        label: t('Dine-in table'),
        value: `${t('Table')} ${o.customer?.tableNo || t('N/A')}`,
        extra: t('Indoor Seating')
      };
    }
    if (o.type === 'delivery') {
      return {
        label: t('Delivery address'),
        value: o.customer?.address || t('N/A'),
        extra: ''
      };
    }
    return {
      label: t('Pick-up info'),
      value: t('Counter collection'),
      extra: `${t('Ready in')} ${o.customer?.phone ? t('20 min') : t('15 min')}`
    };
  };

  return (
    <div className="fade-in">
      
      {/* Autoplay prompt header */}
      {pendingOrdersCount > 0 && (
        <div 
          onClick={triggerAlertSoundToggle}
          style={{ 
            backgroundColor: '#fee2e2', 
            color: '#ef4444', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            marginBottom: '24px', 
            fontWeight: '700', 
            fontSize: '0.85rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.05)',
            cursor: 'pointer',
            fontFamily: 'var(--font)'
          }}
        >
          <span>🚨 {t('YOU HAVE')} {pendingOrdersCount} {t('NEW PENDING ORDER(S). CLICK HERE TO CONNECT THE WEB AUDIO ALERT CHIMES.')}</span>
          <span style={{ textDecoration: 'underline' }}>{t('Enable Alert Sound')}</span>
        </div>
      )}

      {/* Title */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('Live orders')}</h1>
          <p className="page-sub">{t('Incoming orders update in real time. Advance each through the kitchen flow.')}</p>
        </div>
        <div className="row gap10">
          <button 
            className={`live-toggle ${pendingOrdersCount > 0 ? 'on' : ''}`}
            onClick={triggerAlertSoundToggle}
          >
            <span className="pulse"></span>{t('Live Monitor')}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats">
        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--neg-bg)', color: 'var(--neg)' }}><Inbox className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.new}</div>
            <div className="stat-l">{t('New orders')}</div>
          </div>
        </div>

        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--warn-bg)', color: 'var(--warn)' }}><ChefHat className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.preparing}</div>
            <div className="stat-l">{t('Preparing')}</div>
          </div>
        </div>

        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--pos-bg)', color: 'var(--pos)' }}><PackageCheck className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.ready}</div>
            <div className="stat-l">{t('Ready to go')}</div>
          </div>
        </div>

        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--ink)' }}><CheckCheck className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.completedToday}</div>
            <div className="stat-l">{t('Completed today')}</div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="row between wrap gap12" style={{ marginBottom: '18px' }}>
        <div className="chips">
          <button 
            className={`chip ${channelFilter === '' ? 'on' : ''}`}
            onClick={() => setChannelFilter('')}
          >
            <LayoutGrid className="ic" />
            <span>{t('All channels')}</span>
          </button>
          
          <button 
            className={`chip ${channelFilter === 'delivery' ? 'on' : ''}`}
            onClick={() => setChannelFilter('delivery')}
          >
            <Bike className="ic" />
            <span>{t('Delivery')}</span>
          </button>
          
          <button 
            className={`chip ${channelFilter === 'pickup' ? 'on' : ''}`}
            onClick={() => setChannelFilter('pickup')}
          >
            <ShoppingBag className="ic" />
            <span>{t('Pick-up')}</span>
          </button>

          <button 
            className={`chip ${channelFilter === 'dine-in' ? 'on' : ''}`}
            onClick={() => setChannelFilter('dine-in')}
          >
            <Utensils className="ic" />
            <span>{t('Dine-in')}</span>
          </button>
        </div>
        <span className="card-note">{t('Auto-refresh on')} &bull; {t('SSE Polling')}</span>
      </div>

      {/* Kanban Board Grid */}
      <div className="board">
        {columns.map(col => {
          // Filter orders belonging to this column status
          let list;
          if (col.key === 'completed_group') {
            list = orders.filter(o => o.status === 'ready' || o.status === 'shipped' || o.status === 'completed');
            // Exclude dismissed completed orders from third column
            list = list.filter(o => !dismissedIds.includes(o._id));
          } else {
            list = orders.filter(o => o.status === col.key);
          }

          // Apply channels filter if set
          if (channelFilter) {
            list = list.filter(o => o.type === channelFilter);
          }

          return (
            <div key={col.key} className="col">
              <div className="col-head">
                <span className="col-dot" style={{ backgroundColor: col.dot }}></span>
                <span className="col-title">{t(col.title)}</span>
                <span className="col-count">{list.length}</span>
              </div>

              <div className="col-body">
                {list.length === 0 ? (
                  <div className="col-empty">{t('No orders')}</div>
                ) : (
                  list.map(order => {
                    const itemsCount = order.items.reduce((s, it) => s + it.quantity, 0);
                    const ChannelIcon = channelIcons[order.type] || ShoppingBag;
                    
                    const durationMins = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60));
                    const timeLabel = durationMins <= 0 ? t('Just now') : `${durationMins}${t('m ago')}`;

                    const subtext = order.type === 'dine-in' 
                      ? `${order.customer?.name || t('Guest Diner')} · ${t('Table')} ${order.customer?.tableNo || t('N/A')}`
                      : order.type === 'delivery'
                        ? `${order.customer?.name || t('Guest')} · ${order.customer?.address?.substring(0, 24)}...`
                        : `${order.customer?.name || t('Guest')} · ${t('Pick-up')}`;

                    return (
                      <div 
                        key={order._id} 
                        className="ocard"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="oc-top">
                          <span className="oc-id">#{order.orderNo}</span>
                          <span className={`oc-ch ch-${order.type === 'dine-in' ? 'dinein' : order.type}`}>
                            <ChannelIcon className="ic" style={{ width: '13px', height: '13px' }} />
                            {t(channelLabels[order.type]) || order.type}
                          </span>
                          <span className="oc-time">{timeLabel}</span>
                        </div>

                        <div className="oc-cust" style={{ fontWeight: '600', fontSize: '0.85rem' }}>{subtext}</div>
                        {order.notes && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            marginTop: '6px'
                          }}>
                            <StickyNote style={{ width: '12px', height: '12px', flexShrink: 0 }} />
                            <span style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {order.notes}
                            </span>
                          </div>
                        )}
                        
                        <div className="oc-items" style={{ margin: '8px 0', fontSize: '0.82rem' }}>
                          {order.items.slice(0, 3).map((it, idx) => (
                            <div key={idx} style={{ marginBottom: '3px' }}>
                              <span className="qty">{it.quantity}</span>
                              <span>{typeof it.name === 'object' ? (it.name[lang] || it.name.en) : it.name}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div style={{ color: 'var(--ink-3)', paddingLeft: '24px', fontSize: '0.78rem' }}>
                              + {order.items.length - 3} {t('more items...')}
                            </div>
                          )}
                        </div>

                        <div className="oc-foot">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className="oc-total tnum" style={{ fontWeight: '800' }}>
                              {currencySymbol}{parseFloat(order.total).toFixed(2)}
                            </span>
                            {['ready', 'shipped', 'completed'].includes(order.status) && (
                              <span style={{ 
                                fontSize: '0.7rem', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontWeight: 'bold',
                                alignSelf: 'flex-start',
                                backgroundColor: 
                                  order.status === 'ready' ? 'var(--pos-bg)' : 
                                  order.status === 'shipped' ? 'var(--info-bg)' : 
                                  'var(--surface-3)',
                                color: 
                                  order.status === 'ready' ? 'var(--pos)' : 
                                  order.status === 'shipped' ? 'var(--info)' : 
                                  'var(--ink-3)'
                              }}>
                                {order.status === 'ready' ? t('Ready') : 
                                 order.status === 'shipped' ? `${t('Shipped')} (${order.deliveryMinutes || 20}${t('m')})` : 
                                 t('Completed')}
                              </span>
                            )}
                          </div>
                          <span className="oc-actions" onClick={e => e.stopPropagation()}>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <ReceiptText className="ic" style={{ width: '13px', height: '13px' }} />
                              <span>{t('Details')}</span>
                            </button>

                            {order.status === 'pending' && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleModifyStatus(order._id, 'accepted')}
                              >
                                <span>{t('Accept')}</span>
                                <ArrowRight className="ic" style={{ width: '13px', height: '13px' }} />
                              </button>
                            )}

                            {order.status === 'accepted' && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleReadyClick(order)}
                              >
                                <Check className="ic" style={{ width: '13px', height: '13px' }} />
                                <span>{t('Ready')}</span>
                              </button>
                            )}

                            {(order.status === 'ready' || order.status === 'shipped') && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleModifyStatus(order._id, 'completed')}
                              >
                                <Check className="ic" style={{ width: '13px', height: '13px' }} />
                                <span>{t('Complete')}</span>
                              </button>
                            )}

                            {order.status === 'completed' && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleDismissOrder(order._id)}
                              >
                                <Check className="ic" style={{ width: '13px', height: '13px' }} />
                                <span>{t('Done')}</span>
                              </button>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Details dialog modal */}
      {selectedOrder && (
        <>
          <div className="od-scrim open" onClick={() => setSelectedOrder(null)}></div>
          <div className="order-modal open" role="dialog" aria-modal="true">
            <div className="om-bar">
              <h3>
                <ReceiptText className="ic" />
                <span>{t('Order details')}</span>
              </h3>
              <button 
                className="x" 
                onClick={() => setSelectedOrder(null)} 
                title={t('Close')}
              >
                <X className="ic" />
              </button>
            </div>
            
            <div id="odBody">
              <div className="od-grid">
                
                {/* Left meta column */}
                <div className="od-col">
                  <div className="od-head">
                    <div className="od-id">{t('Order')} #{selectedOrder.orderNo}</div>
                    <span className="od-status">
                      <span 
                        className="od-dot" 
                        style={{ 
                          backgroundColor: 
                            selectedOrder.status === 'pending' ? 'var(--neg)' : 
                            selectedOrder.status === 'accepted' ? 'var(--warn)' : 
                            'var(--pos)' 
                        }}
                      ></span>
                      {selectedOrder.status === 'pending' ? t('New') : 
                       selectedOrder.status === 'accepted' ? t('In progress') : 
                       selectedOrder.status === 'ready' ? t('Ready') : 
                       selectedOrder.status === 'shipped' ? t('Shipped') : 
                       t('Completed')}
                    </span>
                  </div>

                  <div className="od-meta">
                    <span className={`oc-ch ch-${selectedOrder.type === 'dine-in' ? 'dinein' : selectedOrder.type}`}>
                      <Info className="ic" />
                      {t(channelLabels[selectedOrder.type]) || selectedOrder.type}
                    </span>
                    <span className="od-time">
                      <Clock className="ic" />
                      <span>{t('Placed')} {new Date(selectedOrder.createdAt).toLocaleTimeString()}</span>
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="od-sec">
                    <div className="od-sec-t">{t('Customer')}</div>
                    <div className="od-info">
                      <div className="od-row">
                        <User className="ic" />
                        <span>{selectedOrder.customer?.name || t('Walk-in Guest')}</span>
                      </div>
                      
                      {selectedOrder.customer?.phone && (
                        <a className="od-row od-link" href={`tel:${selectedOrder.customer.phone}`}>
                          <Phone className="ic" />
                          <span>{selectedOrder.customer.phone}</span>
                        </a>
                      )}

                      {selectedOrder.customer?.email && (
                        <a className="od-row od-link" href={`mailto:${selectedOrder.customer.email}`}>
                          <Mail className="ic" />
                          <span>{selectedOrder.customer.email}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Fulfillment details */}
                  <div className="od-sec">
                    <div className="od-sec-t" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>{getFulfillmentInfo(selectedOrder).label}</span>
                      {selectedOrder.type === 'delivery' && selectedOrder.customer?.address && (
                        <button 
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', height: '22px', padding: '0 6px', gap: '3px' }}
                          onClick={() => handleTranslateText(selectedOrder.customer.address, 'address')}
                          disabled={translatingAddress}
                        >
                          <Languages style={{ width: '11px', height: '11px' }} />
                          <span>{translatingAddress ? t('Translating...') : t('Translate')}</span>
                        </button>
                      )}
                    </div>
                    <div className="od-info">
                      <div className="od-row">
                        <Info className="ic" />
                        <span style={{ wordBreak: 'break-word' }}>{selectedOrder.customer?.address || t('N/A')}</span>
                      </div>
                      {translatedAddress && (
                        <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#1d4ed8', backgroundColor: '#eff6ff', borderLeft: '3px solid #3b82f6', padding: '6px 10px', borderRadius: '4px', fontStyle: 'italic' }}>
                          <span style={{ fontWeight: '600', color: '#2563eb', fontSize: '0.72rem', display: 'block' }}>Translated ({lang}):</span>
                          {translatedAddress}
                        </div>
                      )}
                      {getFulfillmentInfo(selectedOrder).extra && (
                        <div className="od-row od-mut">
                          <Info className="ic" />
                          <span>{getFulfillmentInfo(selectedOrder).extra}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Instructions / Notes */}
                  {selectedOrder.notes && (
                    <div className="od-sec" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px' }}>
                      <div className="od-sec-t" style={{ color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <StickyNote className="ic" style={{ color: '#b45309', width: '16px', height: '16px' }} />
                          <span>{t('Special Instructions')}</span>
                        </div>
                        <button 
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', height: '24px', padding: '0 8px', gap: '4px', border: '1px solid #d97706', color: '#d97706' }}
                          onClick={() => handleTranslateText(selectedOrder.notes, 'notes')}
                          disabled={translatingNotes}
                        >
                          <Languages style={{ width: '12px', height: '12px' }} />
                          <span>{translatingNotes ? t('Translating...') : t('Translate')}</span>
                        </button>
                      </div>
                      <div className="od-info" style={{ marginTop: '8px', color: '#78350f', fontSize: '0.85rem' }}>
                        <div>{selectedOrder.notes}</div>
                        {translatedNotes && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #fde68a', fontStyle: 'italic', fontWeight: '500' }}>
                            <span style={{ fontSize: '0.75rem', color: '#b45309', display: 'block', marginBottom: '2px' }}>Translated ({lang}):</span>
                            {translatedNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right items column */}
                <div className="od-col">
                  <div className="od-sec">
                    <div className="od-sec-t">
                      {t('Items')} &bull; {selectedOrder.items.reduce((s, it) => s + it.quantity, 0)}
                    </div>
                    
                    <div className="od-items" style={{ marginTop: '12px' }}>
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="od-item">
                          <span className="od-thumb">
                            <ReceiptText className="ic" />
                          </span>
                          <div className="od-item-main">
                            <div className="od-item-top">
                              <span className="od-q">{item.quantity}</span>
                              <span className="od-n" style={{ fontWeight: '700' }}>{typeof item.name === 'object' ? (item.name[lang] || item.name.en) : item.name}</span>
                              <span className="od-p tnum">
                                {currencySymbol}{parseFloat(item.priceCalculated || item.price || 0).toFixed(2)}
                              </span>
                            </div>
                            
                            {/* Addon details mapping */}
                            <div className="od-addons" style={{ marginTop: '6px' }}>
                              {item.size && (
                                <span className="od-addon">{t('Size')}: {typeof item.size === 'object' ? (item.size[lang] || item.size.en) : item.size}</span>
                              )}
                              {item.addons?.map((add, aIdx) => (
                                <span key={aIdx} className="od-addon">+{typeof add === 'object' ? (add[lang] || add.en) : add}</span>
                              ))}
                              {item.removedIngredients?.map((rem, rIdx) => (
                                <span key={rIdx} className="od-addon rem">{t('No')} {typeof rem === 'object' ? (rem[lang] || rem.en) : rem}</span>
                              ))}
                            </div>

                            {item.notes && (
                              <div className="od-note" style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <StickyNote className="ic" />
                                  <span>{item.notes}</span>
                                  <button 
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.68rem', height: '20px', padding: '0 4px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '6px' }}
                                    onClick={() => handleTranslateText(item.notes, 'itemNotes', idx)}
                                    disabled={translatingItemNotes[idx]}
                                  >
                                    <Languages style={{ width: '10px', height: '10px' }} />
                                    <span>{translatingItemNotes[idx] ? t('Translating...') : t('Translate')}</span>
                                  </button>
                                </div>
                                {translatedItemNotes[idx] && (
                                  <div style={{ paddingLeft: '22px', fontSize: '0.78rem', color: '#16a34a', fontStyle: 'italic', fontWeight: '500' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--ink-3)' }}>Translated: </span>
                                    {translatedItemNotes[idx]}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="od-total">
                      <span>{t('Total')}</span>
                      <span className="tnum">{currencySymbol}{parseFloat(selectedOrder.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action buttons footer */}
              <div className="od-foot">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button 
                      className="btn btn-danger btn-lg od-cancel"
                      onClick={() => handleModifyStatus(selectedOrder._id, 'declined')}
                    >
                      {t('Decline')}
                    </button>
                    <button 
                      className="btn btn-primary btn-lg od-primary"
                      onClick={() => handleModifyStatus(selectedOrder._id, 'accepted')}
                    >
                      {t('Accept order')}
                      <ArrowRight className="ic" />
                    </button>
                  </>
                )}

                {selectedOrder.status === 'accepted' && (
                  <button 
                    className="btn btn-primary btn-lg od-primary"
                    onClick={() => handleReadyClick(selectedOrder)}
                  >
                    {t('Mark Ready')}
                    <Check className="ic" />
                  </button>
                )}

                {(selectedOrder.status === 'ready' || selectedOrder.status === 'shipped') && (
                  <button 
                    className="btn btn-primary btn-lg od-primary"
                    onClick={() => handleModifyStatus(selectedOrder._id, 'completed')}
                  >
                    {t('Complete Order')}
                    <Check className="ic" />
                  </button>
                )}

                {selectedOrder.status === 'completed' && (
                  <button 
                    className="btn btn-primary btn-lg od-primary"
                    onClick={() => handleDismissOrder(selectedOrder._id)}
                  >
                    {t('Fulfill order')}
                    <Check className="ic" />
                  </button>
                )}
              </div>

            </div>
          </div>
        </>
      )}

      {/* Delivery Transit Minutes Modal */}
      {deliveryMinutesModal && (
        <>
          <div className="od-scrim open" onClick={() => setDeliveryMinutesModal(null)}></div>
          <div className="order-modal open" style={{ maxWidth: '400px' }} role="dialog" aria-modal="true">
            <div className="om-bar">
              <h3>
                <Bike className="ic" />
                <span>{t('Delivery Transit Time')}</span>
              </h3>
              <button 
                className="x" 
                onClick={() => setDeliveryMinutesModal(null)} 
                title={t('Close')}
              >
                <X className="ic" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--ink-3)' }}>
                {t('Enter the estimated delivery transit time in minutes for Order')} <strong>#{deliveryMinutesModal.orderNo}</strong>.
              </p>
              <input
                type="number"
                value={transitMinutes}
                onChange={(e) => setTransitMinutes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--surface-2)',
                  color: 'var(--ink)',
                  fontSize: '1rem',
                  marginBottom: '20px'
                }}
                min="1"
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setDeliveryMinutesModal(null)}>
                  {t('Cancel')}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleModifyStatus(deliveryMinutesModal._id, 'shipped', parseInt(transitMinutes));
                    setDeliveryMinutesModal(null);
                  }}
                >
                  {t('Confirm & Ship')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default function ManagerLiveOrdersPage() {
  return (
    <Suspense fallback={
      <div className="fade-in">
        <div className="page-head">
          <div>
            <div className="skeleton" style={{ width: '150px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
          </div>
        </div>
        
        {/* Stats Row Skeleton */}
        <div className="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card stat" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div className="skeleton" style={{ width: '40px', height: '24px', borderRadius: '4px', marginBottom: '6px' }} />
                <div className="skeleton" style={{ width: '80px', height: '12px', borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Board Columns Skeleton */}
        <div className="board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="col-head" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="skeleton" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                <div className="skeleton" style={{ width: '80px', height: '16px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '20px', height: '16px', borderRadius: '4px', marginLeft: 'auto' }} />
              </div>
              <div className="col-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2].map(j => (
                  <div key={j} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="skeleton" style={{ width: '60px', height: '16px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ width: '60px', height: '16px', borderRadius: '4px' }} />
                    </div>
                    <div className="skeleton" style={{ width: '120px', height: '14px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '90%', height: '12px', borderRadius: '3px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div className="skeleton" style={{ width: '50px', height: '16px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ width: '70px', height: '28px', borderRadius: '6px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <LiveOrdersPageContent />
    </Suspense>
  );
}

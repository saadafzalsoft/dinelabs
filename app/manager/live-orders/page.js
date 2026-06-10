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
  AlertCircle
} from 'lucide-react';

function LiveOrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState(''); // '' | 'delivery' | 'pickup' | 'dine-in'
  
  // Local storage cleared completed orders ids to keep Kanban board clean
  const [dismissedIds, setDismissedIds] = useState([]);
  
  // Selected order for details modal popup
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  // Fetch orders and poll every 5 seconds for real-time order queuing
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed fetching live orders queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
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
    el.innerHTML = `<div class="toast"><span class="ic">🔔</span><span>Audio notification ring path connected!</span></div>`;
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
        // Optimistic UI state update
        setOrders(prev =>
          prev.map(o => o._id === orderId ? {
            ...o,
            status: newStatus,
            ...(deliveryMinutes !== null ? { deliveryMinutes } : {})
          } : o)
        );
        
        // Update selected order in state if it's currently open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({
            ...prev,
            status: newStatus,
            ...(deliveryMinutes !== null ? { deliveryMinutes } : {})
          }));
        }

        // Add custom visual alert toast
        let label = 'Status updated';
        if (newStatus === 'accepted') label = 'Order accepted!';
        else if (newStatus === 'ready') label = 'Order marked ready!';
        else if (newStatus === 'shipped') label = 'Order shipped!';
        else if (newStatus === 'completed') label = 'Order completed!';
        else if (newStatus === 'declined') label = 'Order declined';

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
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>Order cleared from active board</span></div>`;
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
        label: 'Dine-in table',
        value: `Table ${o.customer?.tableNo || 'N/A'}`,
        extra: 'Indoor Seating'
      };
    }
    if (o.type === 'delivery') {
      return {
        label: 'Delivery address',
        value: o.customer?.address || 'N/A',
        extra: ''
      };
    }
    return {
      label: 'Pick-up info',
      value: 'Counter collection',
      extra: `Ready in ${o.customer?.phone ? '20 min' : '15 min'}`
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
          <span>🚨 YOU HAVE {pendingOrdersCount} NEW PENDING ORDER(S). CLICK HERE TO CONNECT THE WEB AUDIO ALERT CHIMES.</span>
          <span style={{ textDecoration: 'underline' }}>Enable Alert Sound</span>
        </div>
      )}

      {/* Title */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Live orders</h1>
          <p className="page-sub">Incoming orders update in real time. Advance each through the kitchen flow.</p>
        </div>
        <div className="row gap10">
          <button 
            className={`live-toggle ${pendingOrdersCount > 0 ? 'on' : ''}`}
            onClick={triggerAlertSoundToggle}
          >
            <span className="pulse"></span>Live Monitor
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats">
        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--neg-bg)', color: 'var(--neg)' }}><Inbox className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.new}</div>
            <div className="stat-l">New orders</div>
          </div>
        </div>

        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--warn-bg)', color: 'var(--warn)' }}><ChefHat className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.preparing}</div>
            <div className="stat-l">Preparing</div>
          </div>
        </div>

        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--pos-bg)', color: 'var(--pos)' }}><PackageCheck className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.ready}</div>
            <div className="stat-l">Ready to go</div>
          </div>
        </div>

        <div className="card stat">
          <span className="stat-ic" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--ink)' }}><CheckCheck className="ic" /></span>
          <div>
            <div className="stat-v tnum">{stats.completedToday}</div>
            <div className="stat-l">Completed today</div>
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
            <span>All channels</span>
          </button>
          
          <button 
            className={`chip ${channelFilter === 'delivery' ? 'on' : ''}`}
            onClick={() => setChannelFilter('delivery')}
          >
            <Bike className="ic" />
            <span>Delivery</span>
          </button>
          
          <button 
            className={`chip ${channelFilter === 'pickup' ? 'on' : ''}`}
            onClick={() => setChannelFilter('pickup')}
          >
            <ShoppingBag className="ic" />
            <span>Pick-up</span>
          </button>

          <button 
            className={`chip ${channelFilter === 'dine-in' ? 'on' : ''}`}
            onClick={() => setChannelFilter('dine-in')}
          >
            <Utensils className="ic" />
            <span>Dine-in</span>
          </button>
        </div>
        <span className="card-note">Auto-refresh on &bull; SSE Polling</span>
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
                <span className="col-title">{col.title}</span>
                <span className="col-count">{list.length}</span>
              </div>

              <div className="col-body">
                {list.length === 0 ? (
                  <div className="col-empty">No orders</div>
                ) : (
                  list.map(order => {
                    const itemsCount = order.items.reduce((s, it) => s + it.quantity, 0);
                    const ChannelIcon = channelIcons[order.type] || ShoppingBag;
                    
                    const durationMins = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60));
                    const timeLabel = durationMins <= 0 ? 'Just now' : `${durationMins}m ago`;

                    const subtext = order.type === 'dine-in' 
                      ? `${order.customer?.name || 'Guest Diner'} · Table ${order.customer?.tableNo || 'N/A'}`
                      : order.type === 'delivery'
                        ? `${order.customer?.name || 'Guest'} · ${order.customer?.address?.substring(0, 24)}...`
                        : `${order.customer?.name || 'Guest'} · Pick-up`;

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
                            {channelLabels[order.type] || order.type}
                          </span>
                          <span className="oc-time">{timeLabel}</span>
                        </div>

                        <div className="oc-cust" style={{ fontWeight: '600', fontSize: '0.85rem' }}>{subtext}</div>
                        
                        <div className="oc-items" style={{ margin: '8px 0', fontSize: '0.82rem' }}>
                          {order.items.slice(0, 3).map((it, idx) => (
                            <div key={idx} style={{ marginBottom: '3px' }}>
                              <span className="qty">{it.quantity}</span>
                              <span>{it.name}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div style={{ color: 'var(--ink-3)', paddingLeft: '24px', fontSize: '0.78rem' }}>
                              + {order.items.length - 3} more items...
                            </div>
                          )}
                        </div>

                        <div className="oc-foot">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className="oc-total tnum" style={{ fontWeight: '800' }}>
                              ${parseFloat(order.total).toFixed(2)}
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
                                {order.status === 'ready' ? 'Ready' : 
                                 order.status === 'shipped' ? `Shipped (${order.deliveryMinutes || 20}m)` : 
                                 'Completed'}
                              </span>
                            )}
                          </div>
                          <span className="oc-actions" onClick={e => e.stopPropagation()}>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <ReceiptText className="ic" style={{ width: '13px', height: '13px' }} />
                              <span>Details</span>
                            </button>

                            {order.status === 'pending' && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleModifyStatus(order._id, 'accepted')}
                              >
                                <span>Accept</span>
                                <ArrowRight className="ic" style={{ width: '13px', height: '13px' }} />
                              </button>
                            )}

                            {order.status === 'accepted' && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleReadyClick(order)}
                              >
                                <Check className="ic" style={{ width: '13px', height: '13px' }} />
                                <span>Ready</span>
                              </button>
                            )}

                            {(order.status === 'ready' || order.status === 'shipped') && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleModifyStatus(order._id, 'completed')}
                              >
                                <Check className="ic" style={{ width: '13px', height: '13px' }} />
                                <span>Complete</span>
                              </button>
                            )}

                            {order.status === 'completed' && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleDismissOrder(order._id)}
                              >
                                <Check className="ic" style={{ width: '13px', height: '13px' }} />
                                <span>Done</span>
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
                <span>Order details</span>
              </h3>
              <button 
                className="x" 
                onClick={() => setSelectedOrder(null)} 
                title="Close"
              >
                <X className="ic" />
              </button>
            </div>
            
            <div id="odBody">
              <div className="od-grid">
                
                {/* Left meta column */}
                <div className="od-col">
                  <div className="od-head">
                    <div className="od-id">Order #{selectedOrder.orderNo}</div>
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
                      {selectedOrder.status === 'pending' ? 'New' : 
                       selectedOrder.status === 'accepted' ? 'In progress' : 
                       selectedOrder.status === 'ready' ? 'Ready' : 
                       selectedOrder.status === 'shipped' ? 'Shipped' : 
                       'Completed'}
                    </span>
                  </div>

                  <div className="od-meta">
                    <span className={`oc-ch ch-${selectedOrder.type === 'dine-in' ? 'dinein' : selectedOrder.type}`}>
                      <Info className="ic" />
                      {channelLabels[selectedOrder.type] || selectedOrder.type}
                    </span>
                    <span className="od-time">
                      <Clock className="ic" />
                      <span>Placed {new Date(selectedOrder.createdAt).toLocaleTimeString()}</span>
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="od-sec">
                    <div className="od-sec-t">Customer</div>
                    <div className="od-info">
                      <div className="od-row">
                        <User className="ic" />
                        <span>{selectedOrder.customer?.name || 'Walk-in Guest'}</span>
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
                    <div className="od-sec-t">{getFulfillmentInfo(selectedOrder).label}</div>
                    <div className="od-info">
                      <div className="od-row">
                        <Info className="ic" />
                        <span>{getFulfillmentInfo(selectedOrder).value}</span>
                      </div>
                      {getFulfillmentInfo(selectedOrder).extra && (
                        <div className="od-row od-mut">
                          <Info className="ic" />
                          <span>{getFulfillmentInfo(selectedOrder).extra}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right items column */}
                <div className="od-col">
                  <div className="od-sec">
                    <div className="od-sec-t">
                      Items &bull; {selectedOrder.items.reduce((s, it) => s + it.quantity, 0)}
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
                              <span className="od-n" style={{ fontWeight: '700' }}>{item.name}</span>
                              <span className="od-p tnum">
                                ${parseFloat(item.priceCalculated || item.price || 0).toFixed(2)}
                              </span>
                            </div>
                            
                            {/* Addon details mapping */}
                            <div className="od-addons" style={{ marginTop: '6px' }}>
                              {item.size && (
                                <span className="od-addon">Size: {item.size}</span>
                              )}
                              {item.addons?.map((add, aIdx) => (
                                <span key={aIdx} className="od-addon">+{add}</span>
                              ))}
                              {item.removedIngredients?.map((rem, rIdx) => (
                                <span key={rIdx} className="od-addon rem">No {rem}</span>
                              ))}
                            </div>

                            {item.notes && (
                              <div className="od-note" style={{ marginTop: '6px' }}>
                                <StickyNote className="ic" />
                                <span>{item.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="od-total">
                      <span>Total</span>
                      <span className="tnum">${parseFloat(selectedOrder.total).toFixed(2)}</span>
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
                      Decline
                    </button>
                    <button 
                      className="btn btn-primary btn-lg od-primary"
                      onClick={() => handleModifyStatus(selectedOrder._id, 'accepted')}
                    >
                      Accept order
                      <ArrowRight className="ic" />
                    </button>
                  </>
                )}

                {selectedOrder.status === 'accepted' && (
                  <button 
                    className="btn btn-primary btn-lg od-primary"
                    onClick={() => handleReadyClick(selectedOrder)}
                  >
                    Mark Ready
                    <Check className="ic" />
                  </button>
                )}

                {(selectedOrder.status === 'ready' || selectedOrder.status === 'shipped') && (
                  <button 
                    className="btn btn-primary btn-lg od-primary"
                    onClick={() => handleModifyStatus(selectedOrder._id, 'completed')}
                  >
                    Complete Order
                    <Check className="ic" />
                  </button>
                )}

                {selectedOrder.status === 'completed' && (
                  <button 
                    className="btn btn-primary btn-lg od-primary"
                    onClick={() => handleDismissOrder(selectedOrder._id)}
                  >
                    Fulfill order
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
                <span>Delivery Transit Time</span>
              </h3>
              <button 
                className="x" 
                onClick={() => setDeliveryMinutesModal(null)} 
                title="Close"
              >
                <X className="ic" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--ink-3)' }}>
                Enter the estimated delivery transit time in minutes for Order <strong>#{deliveryMinutesModal.orderNo}</strong>.
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
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleModifyStatus(deliveryMinutesModal._id, 'shipped', parseInt(transitMinutes));
                    setDeliveryMinutesModal(null);
                  }}
                >
                  Confirm & Ship
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
    <Suspense fallback={<h3 className="mut3">Loading live orders...</h3>}>
      <LiveOrdersPageContent />
    </Suspense>
  );
}

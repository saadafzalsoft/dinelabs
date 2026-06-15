'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Armchair,
  Plus,
  Trash2,
  QrCode,
  Map,
  Move,
  Type,
  X,
  Printer,
  Download,
  Check,
  Save
} from 'lucide-react';

function DineInPageContent() {
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [dineInEnabled, setDineInEnabled] = useState(true);
  const [newTableName, setNewTableName] = useState('');
  const [editingTableId, setEditingTableId] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');

  // QR Drawer States
  const [qrOpen, setQrOpen] = useState(false);
  const [activeTable, setActiveTable] = useState(null);

  // Floor Plan drag-and-drop refs & state
  const boardRef = useRef(null);
  const dragCtxRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const fetchData = async () => {
    try {
      const settingsRes = await fetch('/api/tenant/settings');
      if (settingsRes.status === 401) {
        router.push('/manager');
        return;
      }
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
        setDineInEnabled(settingsData.enabledModes?.dineIn ?? true);
      }

      const tablesRes = await fetch('/api/tables');
      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        setTables(tablesData);
      }
    } catch (err) {
      console.error('Error fetching dine-in data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleSaveStatus = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const currentRes = await fetch('/api/tenant/settings');
      if (!currentRes.ok) throw new Error('Could not fetch settings');
      const currentData = await currentRes.json();

      const nextEnabledModes = {
        ...(currentData.enabledModes || { delivery: true, pickup: true }),
        dineIn: dineInEnabled
      };

      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          enabledModes: nextEnabledModes
        })
      });

      if (res.ok) {
        triggerToast('Dine-in status updated successfully!');
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

  const handleAddTable = async (e) => {
    if (e) e.preventDefault();
    const name = newTableName.trim();
    if (!name) return;

    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          chairs: 4,
          location: 'Indoor',
          x: 35 + Math.random() * 20,
          y: 35 + Math.random() * 20,
          shape: 'square'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTables(prev => [...prev, data.table]);
        setNewTableName('');
        triggerToast(`Added table ${name}`);
      } else {
        alert(data.error || 'Failed adding table');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTable = async (id, name) => {
    if (!confirm(`Are you sure you want to delete Table "${name}"?`)) return;

    try {
      const res = await fetch('/api/tables', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setTables(prev => prev.filter(t => t._id !== id));
        triggerToast(`Deleted ${name}`);
      } else {
        alert('Failed deleting table');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameTable = async (table, newName) => {
    const name = newName.trim();
    if (!name || name === table.name) {
      setEditingTableId(null);
      return;
    }

    try {
      const res = await fetch('/api/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: table._id,
          name
        })
      });

      if (res.ok) {
        setTables(prev => prev.map(t => t._id === table._id ? { ...t, name } : t));
        triggerToast('Table renamed successfully');
      } else {
        alert('Failed to rename table');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingTableId(null);
    }
  };

  // Drag handlers
  const handlePointerDown = (e, table) => {
    if (editingTableId) return; // ignore drag during rename
    e.preventDefault();
    const boardEl = boardRef.current;
    if (!boardEl) return;
    const rect = boardEl.getBoundingClientRect();
    const NODE_W = 96;
    const NODE_H = 70;

    dragCtxRef.current = {
      tableId: table._id,
      startX: e.clientX,
      startY: e.clientY,
      startTableX: table.x / 100, // convert percent to ratio
      startTableY: table.y / 100,
      rect,
      NODE_W,
      NODE_H,
      hasMoved: false
    };
    setDraggingId(table._id);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingId || !dragCtxRef.current) return;
    const ctx = dragCtxRef.current;
    const dx = e.clientX - ctx.startX;
    const dy = e.clientY - ctx.startY;

    if (!ctx.hasMoved && Math.hypot(dx, dy) > 4) {
      ctx.hasMoved = true;
    }

    const bw = ctx.rect.width;
    const bh = ctx.rect.height;

    const startPixelX = ctx.startTableX * (bw - ctx.NODE_W);
    const startPixelY = ctx.startTableY * (bh - ctx.NODE_H);

    const newPixelX = Math.max(0, Math.min(bw - ctx.NODE_W, startPixelX + dx));
    const newPixelY = Math.max(0, Math.min(bh - ctx.NODE_H, startPixelY + dy));

    const ratioX = newPixelX / (bw - ctx.NODE_W);
    const ratioY = newPixelY / (bh - ctx.NODE_H);

    setTables(prev => prev.map(t => t._id === ctx.tableId ? { ...t, x: ratioX * 100, y: ratioY * 100 } : t));
  };

  const handlePointerUp = async (e) => {
    if (!draggingId || !dragCtxRef.current) return;
    const ctx = dragCtxRef.current;
    const table = tables.find(t => t._id === ctx.tableId);

    setDraggingId(null);
    dragCtxRef.current = null;

    if (table) {
      if (!ctx.hasMoved) {
        // Simple click -> Open QR drawer
        handleOpenQR(table);
        return;
      }

      try {
        await fetch('/api/tables', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: table._id,
            x: table.x,
            y: table.y
          })
        });
      } catch (err) {
        console.error('Failed saving table coordinates', err);
      }
    }
  };

  const handleOpenQR = (table) => {
    setActiveTable(table);
    setQrOpen(true);
  };

  const getTableUrl = (tableName) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${settings.slug}?table=${encodeURIComponent(tableName)}`;
    }
    return `https://dinelabs.co/${settings?.slug}?table=${encodeURIComponent(tableName)}`;
  };

  const handlePrintQR = () => {
    if (!activeTable || !settings) return;
    const qrUrlStr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getTableUrl(activeTable.name))}`;
    const w = window.open('', '_blank', 'width=480,height=640');
    w.document.write(`
      <html><head><title>${activeTable.name} — QR Code</title>
      <style>
        body{margin:0;font-family:-apple-system,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:20px}
        .name{font-size:26px;font-weight:800;letter-spacing:-.02em}
        img{width:300px;height:300px;border:1px solid #e0e0e0;border-radius:18px;padding:18px}
        .u{font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#555;word-break:break-all;text-align:center;max-width:400px}
        .scan{font-size:15px;font-weight:600;color:#333}
      </style></head>
      <body>
        <div class="name">${activeTable.name}</div>
        <img src="${qrUrlStr}" />
        <div class="scan">Scan to order at your table</div>
        <div class="u">${getTableUrl(activeTable.name)}</div>
        <script>window.onload=function(){setTimeout(function(){window.print()},250)}<\/script>
      </body></html>`);
    w.document.close();
  };

  const handleDownloadQR = async () => {
    if (!activeTable) return;
    const qrUrlStr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getTableUrl(activeTable.name))}`;
    try {
      const response = await fetch(qrUrlStr);
      const blob = await response.blob();
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = `${activeTable.name.replace(/\s+/g, '-')}-qr.png`;
      a.click();
      URL.revokeObjectURL(blobURL);
      triggerToast('QR Code download started');
    } catch (err) {
      console.error('Failed to download QR code image', err);
      // Fallback: open in new tab
      window.open(qrUrlStr, '_blank');
    }
  };

  if (loading || !settings) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h3 className="mut3">Loading dine-in settings...</h3>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Dine-in</h1>
          <p className="page-sub">Create tables, hand each one a QR code to order from, and arrange your room on the floor plan.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSaveStatus}
          disabled={saving}
        >
          <Check className="ic" />
          <span>{saving ? 'Saving...' : 'Save changes'}</span>
        </button>
      </div>

      <div className="svc-grid">
        
        {/* Status card */}
        <section data-screen-label="Dine-in status">
          <div className="card">
            <div className={`svc-status ${dineInEnabled ? 'on' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="svc-ic" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: dineInEnabled ? 'var(--brand-red-light)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dineInEnabled ? 'var(--brand-red)' : '#9ca3af' }}>
                  <Armchair className="ic" style={{ width: '24px', height: '24px' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Accepting dine-in orders</span>
                    <span className={`pill ${dineInEnabled ? 'pill-pos' : 'pill-soft'}`} style={{ height: '22px', fontSize: '10px', fontWeight: 'bold' }}>
                      {dineInEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Guests scan the QR code on their table to browse the menu and order from their seat.
                  </div>
                </div>
              </div>
              
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={dineInEnabled}
                  onChange={() => setDineInEnabled(!dineInEnabled)}
                />
                <span className="track"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Tables list card */}
        <section data-screen-label="Tables">
          <div className="card">
            <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Tables catalog</span>
              </div>
              <span className="card-note" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {tables.length} table{tables.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Inline Table creation form */}
            <form onSubmit={handleAddTable} className="tbl-add" style={{ display: 'flex', gap: '10px', padding: '18px 22px', borderBottom: '1px solid var(--line)', backgroundColor: 'var(--surface-2)', alignItems: 'center' }}>
              <input 
                className="input" 
                type="text"
                placeholder="e.g. Table 6" 
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                maxLength={24}
                style={{ flex: 1, maxWidth: '320px', backgroundColor: '#ffffff', borderRadius: '10px', height: '40px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus className="ic" style={{ width: '16px', height: '16px' }} />
                <span>Add table</span>
              </button>
            </form>

            {/* Tables Grid */}
            <div className="tbl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(218px, 1fr))', gap: '14px', padding: '22px' }}>
              {tables.map(table => (
                <div key={table._id} className="tbl-card" style={{ border: '1px solid var(--line-2)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#ffffff' }}>
                  <div className="tbl-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div className="tbl-ic" style={{ width: '40px', height: '40px', borderRadius: '11px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--ink)' }}>
                      <Armchair className="ic" style={{ width: '19px', height: '19px' }} />
                    </div>
                    <button 
                      type="button" 
                      className="tbl-x" 
                      onClick={() => handleDeleteTable(table._id, table.name)}
                      title="Delete table"
                      style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid var(--line)', backgroundColor: '#ffffff', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.12s' }}
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>

                  <div>
                    {editingTableId === table._id ? (
                      <input 
                        type="text"
                        className="input"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        onBlur={() => handleRenameTable(table, editNameValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameTable(table, editNameValue);
                          if (e.key === 'Escape') setEditingTableId(null);
                        }}
                        autoFocus
                        style={{ height: '32px', fontSize: '14px', fontWeight: 'bold' }}
                      />
                    ) : (
                      <div 
                        className="tbl-name" 
                        onDoubleClick={() => {
                          setEditingTableId(table._id);
                          setEditNameValue(table.name);
                        }}
                        title="Double-click to rename"
                        style={{ fontWeight: '700', fontSize: '15.5px', cursor: 'pointer' }}
                      >
                        {table.name}
                      </div>
                    )}
                    <div className="tbl-sub" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', wordBreak: 'break-all' }}>
                      {getTableUrl(table.name).replace(/https?:\/\//, '')}
                    </div>
                  </div>

                  <div className="tbl-card-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm" 
                      onClick={() => handleOpenQR(table)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <QrCode className="ic" style={{ width: '14.5px', height: '14.5px' }} />
                      <span>QR code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Floor plan */}
        <section data-screen-label="Floor plan">
          <div className="card">
            <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px' }}>
              <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Map className="ic" style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
                <span>Interactive floor plan</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Drag to arrange your dining room layout</p>
            </div>

            <div className="fp-wrap" style={{ padding: '22px' }}>
              <div 
                ref={boardRef}
                className="fp-board" 
                onPointerMove={handlePointerMove}
                style={{
                  position: 'relative',
                  height: '460px',
                  borderRadius: '14px',
                  border: '1px solid var(--line-2)',
                  backgroundColor: '#ffffff',
                  backgroundImage: 'radial-gradient(var(--line-2) 1.1px, transparent 1.1px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '12px 12px',
                  overflow: 'hidden',
                  touchAction: 'none'
                }}
              >
                {tables.length === 0 ? (
                  <div className="fp-empty" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontSize: '13.5px', fontWeight: '600' }}>
                    No tables yet — add one above to place it here.
                  </div>
                ) : (
                  tables.map(table => {
                    const isDragging = draggingId === table._id;
                    const bw = boardRef.current ? boardRef.current.clientWidth : 500;
                    const bh = boardRef.current ? boardRef.current.clientHeight : 460;
                    const NODE_W = 96;
                    const NODE_H = 70;

                    // Compute pixel coordinates
                    const posX = (table.x / 100) * (bw - NODE_W);
                    const posY = (table.y / 100) * (bh - NODE_H);

                    return (
                      <div
                        key={table._id}
                        onPointerDown={(e) => handlePointerDown(e, table)}
                        onPointerUp={handlePointerUp}
                        className={`fp-node ${isDragging ? 'dragging' : ''}`}
                        style={{
                          position: 'absolute',
                          width: `${NODE_W}px`,
                          height: `${NODE_H}px`,
                          left: `${posX}px`,
                          top: `${posY}px`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '3px',
                          backgroundColor: '#ffffff',
                          border: isDragging ? '2px solid var(--ink)' : '1px solid var(--line-2)',
                          borderRadius: '13px',
                          boxShadow: isDragging ? 'var(--sh-lg)' : 'var(--sh-sm)',
                          cursor: isDragging ? 'grabbing' : 'grab',
                          userSelect: 'none',
                          zIndex: isDragging ? 6 : 3,
                          transition: isDragging ? 'none' : 'border-color .12s, box-shadow .12s'
                        }}
                      >
                        <Armchair className="ic" style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
                        <span className="fp-label" style={{ fontWeight: '700', fontSize: '12.5px', color: 'var(--ink)', whiteSpace: 'nowrap', maxWidth: '84px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {table.name}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="fp-hint" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                <Move className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Drag to reposition</span>
                <span style={{ color: 'var(--line-strong)' }}>·</span>
                <Type className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Double-click name on list cards to rename</span>
                <span style={{ color: 'var(--line-strong)' }}>·</span>
                <QrCode className="ic" style={{ width: '14px', height: '14px' }} />
                <span>Click table on layout to open QR</span>
              </div>
            </div>
          </div>
        </section>

      </div>

        {/* QR Code Drawer */}
        {qrOpen && activeTable && (
          <>
            <div 
              className="drawer-scrim open" 
              onClick={() => setQrOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
              }}
            ></div>
            <aside 
              className="drawer open"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '380px',
                backgroundColor: '#ffffff',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideLeft 0.25s ease-out'
              }}
            >
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideLeft {
                  from { transform: translateX(100%); }
                  to { transform: translateX(0); }
                }
              `}} />

              <div className="rail-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <QrCode style={{ width: '20px', height: '20px', color: 'var(--brand-red)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Table QR code</h3>
                </div>
                <button 
                  className="x" 
                  onClick={() => setQrOpen(false)} 
                  title="Close"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  <X style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="rail-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div className="qr-stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                  <div className="qr-table-name" style={{ fontSize: '1.25rem', fontWeight: '800' }}>{activeTable.name}</div>
                  
                  <div className="qr-frame" style={{ width: '220px', height: '220px', border: '1px solid var(--line-2)', borderRadius: '16px', backgroundColor: '#ffffff', display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-sm)', padding: '12px' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getTableUrl(activeTable.name))}`} 
                      alt="Concierge QR code" 
                      style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="qr-url" style={{ fontSize: '12.5px', color: 'var(--ink-2)', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center', backgroundColor: 'var(--surface-2)', border: '1px solid var(--line)', padding: '9px 12px', borderRadius: '9px', width: '100%' }}>
                    {getTableUrl(activeTable.name).replace(/https?:\/\//, '')}
                  </div>

                  <div className="qr-actions" style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
                    <button className="btn btn-outline" onClick={handlePrintQR} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '40px' }}>
                      <Printer className="ic" style={{ width: '16px', height: '16px' }} />
                      <span>Print</span>
                    </button>
                    <button className="btn btn-primary" onClick={handleDownloadQR} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '40px' }}>
                      <Download className="ic" style={{ width: '16px', height: '16px' }} />
                      <span>Download</span>
                    </button>
                  </div>

                  <p className="qr-note" style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5', marginTop: '10px' }}>
                    Guests scan this to open {activeTable.name}'s menu and order without waiting for a server.
                  </p>
                </div>
              </div>
            </aside>
          </>
        )}

      </div>
  );
}

export default function ManagerDineInPage() {
  return (
    <Suspense fallback={<h3>Loading dine-in settings...</h3>}>
      <DineInPageContent />
    </Suspense>
  );
}

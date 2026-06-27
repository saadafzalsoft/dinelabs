'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useManager } from '../layout';
import qrcode from 'qrcode-generator';
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

const generateQRDataUrl = async (data, logoUrl, storeName, qrStyle = 'fluid') => {
  return new Promise((resolve) => {
    try {
      // 1. Initialize QR Code
      const qr = qrcode(0, 'H');
      qr.addData(data);
      qr.make();
      const count = qr.getModuleCount();

      // 2. Setup canvas
      const canvasSize = 1000;
      const margin = 80;
      const drawSize = canvasSize - 2 * margin;
      const moduleSize = drawSize / count;

      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d');

      // 3. Draw Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // 4. Center logic
      const center = Math.floor(count / 2);
      const clearRadius = 3; // 7x7 modules centered
      
      const isCenter = (r, c) => {
        return Math.abs(r - center) <= clearRadius && Math.abs(c - center) <= clearRadius;
      };

      const isFinder = (r, c, count) => {
        if (r < 7 && c < 7) return true; // Top-Left
        if (r < 7 && c >= count - 7) return true; // Top-Right
        if (r >= count - 7 && c < 7) return true; // Bottom-Left
        return false;
      };

      const isModuleDark = (r, c) => {
        if (r < 0 || r >= count || c < 0 || c >= count) return false;
        if (isFinder(r, c, count) || isCenter(r, c)) return false;
        return qr.isDark(r, c);
      };

      // 5. Draw Custom Modules
      ctx.fillStyle = '#000000';

      const drawCustomRoundedRect = (ctx, x, y, w, h, tl, tr, br, bl) => {
        const pad = 0.4;
        x = x - pad / 2;
        y = y - pad / 2;
        w = w + pad;
        h = h + pad;
        if (tl > 0) tl += pad / 2;
        if (tr > 0) tr += pad / 2;
        if (br > 0) br += pad / 2;
        if (bl > 0) bl += pad / 2;

        ctx.beginPath();
        ctx.moveTo(x + tl, y);
        ctx.lineTo(x + w - tr, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
        ctx.lineTo(x + w, y + h - br);
        ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
        ctx.lineTo(x + bl, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
        ctx.lineTo(x, y + tl);
        ctx.quadraticCurveTo(x, y, x + tl, y);
        ctx.closePath();
      };

      const drawCircle = (ctx, cx, cy, r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.closePath();
      };

      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (isModuleDark(r, c)) {
            const x = margin + c * moduleSize;
            const y = margin + r * moduleSize;

            if (qrStyle === 'fluid') {
              const top = isModuleDark(r - 1, c);
              const bottom = isModuleDark(r + 1, c);
              const left = isModuleDark(r, c - 1);
              const right = isModuleDark(r, c + 1);

              const tl = (!top && !left) ? moduleSize * 0.5 : 0;
              const tr = (!top && !right) ? moduleSize * 0.5 : 0;
              const br = (!bottom && !right) ? moduleSize * 0.5 : 0;
              const bl = (!bottom && !left) ? moduleSize * 0.5 : 0;

              drawCustomRoundedRect(ctx, x, y, moduleSize, moduleSize, tl, tr, br, bl);
              ctx.fill();
            } else {
              // circular style
              drawCircle(ctx, x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.43);
              ctx.fill();
            }
          }
        }
      }

      // 6. Draw Finder Patterns (Squircles vs Concentric Circular Star)
      const drawFinder = (x, y) => {
        const size = 7 * moduleSize;
        const cx = x + 3.5 * moduleSize;
        const cy = y + 3.5 * moduleSize;

        if (qrStyle === 'fluid') {
          // Outer squircle
          ctx.fillStyle = '#000000';
          drawCustomRoundedRect(ctx, x, y, size, size, 2.2 * moduleSize, 2.2 * moduleSize, 2.2 * moduleSize, 2.2 * moduleSize);
          ctx.fill();

          // White border squircle
          ctx.fillStyle = '#ffffff';
          drawCustomRoundedRect(ctx, x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize, 1.4 * moduleSize, 1.4 * moduleSize, 1.4 * moduleSize, 1.4 * moduleSize);
          ctx.fill();

          // Inner solid dot squircle
          ctx.fillStyle = '#000000';
          drawCustomRoundedRect(ctx, x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize, 0.8 * moduleSize, 0.8 * moduleSize, 0.8 * moduleSize, 0.8 * moduleSize);
          ctx.fill();
        } else {
          // concentric circles + star
          // 1. Outer black circle
          ctx.fillStyle = '#000000';
          drawCircle(ctx, cx, cy, 3.5 * moduleSize);
          ctx.fill();

          // 2. Middle white circle
          ctx.fillStyle = '#ffffff';
          drawCircle(ctx, cx, cy, 2.5 * moduleSize);
          ctx.fill();

          // 3. Inner 4-pointed star (concave sides)
          ctx.fillStyle = '#000000';
          const r = 1.5 * moduleSize;
          ctx.beginPath();
          ctx.moveTo(cx, cy - r);
          // Top to Right
          ctx.quadraticCurveTo(cx + r * 0.15, cy - r * 0.15, cx + r, cy);
          // Right to Bottom
          ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.15, cx, cy + r);
          // Bottom to Left
          ctx.quadraticCurveTo(cx - r * 0.15, cy + r * 0.15, cx - r, cy);
          // Left to Top
          ctx.quadraticCurveTo(cx - r * 0.15, cy - r * 0.15, cx, cy - r);
          ctx.closePath();
          ctx.fill();
        }
      };

      // Top-Left Finder
      drawFinder(margin, margin);
      // Top-Right Finder
      drawFinder(margin + (count - 7) * moduleSize, margin);
      // Bottom-Left Finder
      drawFinder(margin, margin + (count - 7) * moduleSize);

      // 7. Draw White Backing Card at the center
      const centerAreaSize = (2 * clearRadius + 1) * moduleSize;
      const centerCardX = margin + (center - clearRadius) * moduleSize;
      const centerCardY = margin + (center - clearRadius) * moduleSize;
      const cardRadius = qrStyle === 'fluid' ? 2.0 * moduleSize : 0.8 * moduleSize;

      // Slightly increase the size of the backing card to clear neighboring dots
      const backingOffset = 4;
      ctx.fillStyle = '#ffffff';
      drawCustomRoundedRect(
        ctx, 
        centerCardX - backingOffset, 
        centerCardY - backingOffset, 
        centerAreaSize + 2 * backingOffset, 
        centerAreaSize + 2 * backingOffset, 
        cardRadius, cardRadius, cardRadius, cardRadius
      );
      ctx.fill();

      // 8. Load Logo / Initials Fallback
      const logoSize = centerAreaSize * (qrStyle === 'fluid' ? 0.75 : 0.85);
      const logoX = canvasSize / 2 - logoSize / 2;
      const logoY = canvasSize / 2 - logoSize / 2;

      const drawInitials = () => {
        // Fallback: draw colored initials card inside white backing
        const fallbackSize = centerAreaSize * 0.75;
        const fallbackX = canvasSize / 2 - fallbackSize / 2;
        const fallbackY = canvasSize / 2 - fallbackSize / 2;
        
        ctx.fillStyle = '#000000'; // Dark elegant backing
        drawCustomRoundedRect(
          ctx, 
          fallbackX, 
          fallbackY, 
          fallbackSize, 
          fallbackSize, 
          fallbackSize * 0.35, 
          fallbackSize * 0.35, 
          fallbackSize * 0.35, 
          fallbackSize * 0.35
        );
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(fallbackSize * 0.55)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const initials = (storeName || 'QR')
          .split(/\s+/)
          .map(w => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        ctx.fillText(initials, canvasSize / 2, canvasSize / 2);
        resolve(canvas.toDataURL('image/png'));
      };

      if (!logoUrl) {
        drawInitials();
      } else {
        // Fetch as a Blob client-side from the local proxy to bypass CORS/tainting completely!
        fetch(logoUrl)
          .then(res => {
            if (!res.ok) throw new Error('Proxy returned bad status');
            return res.blob();
          })
          .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;
              const img = new Image();
              img.onload = () => {
                let dx = logoX;
                let dy = logoY;
                let dw = logoSize;
                let dh = logoSize;

                if (img.width > img.height) {
                  dh = logoSize * (img.height / img.width);
                  dy = canvasSize / 2 - dh / 2;
                } else if (img.height > img.width) {
                  dw = logoSize * (img.width / img.height);
                  dx = canvasSize / 2 - dw / 2;
                }

                ctx.drawImage(img, dx, dy, dw, dh);
                resolve(canvas.toDataURL('image/png'));
              };
              img.onerror = (e) => {
                console.error('Image load from local base64 failed', e);
                drawInitials();
              };
              img.src = base64data;
            };
          })
          .catch(err => {
            console.warn('QR logo load via fetch failed, using fallback initials', err);
            drawInitials();
          });
      }
    } catch (err) {
      console.error('Error generating custom QR code canvas', err);
      resolve('');
    }
  });
};

function DineInPageContent() {
  const router = useRouter();
  const { 
    tenantSettings, 
    tables: contextTables, 
    loading: contextLoading, 
    refreshTenantSettings, 
    refreshTables,
    t,
    lang
  } = useManager();

  const [settings, setSettings] = useState(null);
  const [tables, setTables] = useState([]);
  const [saving, setSaving] = useState(false);

  // States
  const [dineInEnabled, setDineInEnabled] = useState(true);
  const [newTableName, setNewTableName] = useState('');
  const [editingTableId, setEditingTableId] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');

  // QR Drawer States
  const [qrOpen, setQrOpen] = useState(false);
  const [activeTable, setActiveTable] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrStyle, setQrStyle] = useState('fluid');

  // Floor Plan drag-and-drop refs & state
  const boardRef = useRef(null);
  const dragCtxRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const loading = contextLoading;

  useEffect(() => {
    if (tenantSettings) {
      setSettings(tenantSettings);
      setDineInEnabled(tenantSettings.enabledModes?.dineIn ?? true);
    }
  }, [tenantSettings]);

  useEffect(() => {
    if (contextTables) {
      setTables(contextTables);
    }
  }, [contextTables]);

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
        await refreshTenantSettings();
        triggerToast(t('Dine-in status updated successfully!'));
      } else {
        alert(t('Failed to save settings'));
      }
    } catch (e) {
      console.error(e);
      alert(t('Error saving settings'));
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
        await refreshTables();
        setNewTableName('');
        triggerToast(t('Added table {name}').replace('{name}', name));
      } else {
        alert(t(data.error || 'Failed adding table'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTable = async (id, name) => {
    if (!confirm(t('Are you sure you want to delete Table "{name}"?').replace('{name}', name))) return;

    try {
      const res = await fetch('/api/tables', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        await refreshTables();
        triggerToast(t('Deleted {name}').replace('{name}', name));
      } else {
        alert(t('Failed deleting table'));
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
        await refreshTables();
        triggerToast(t('Table renamed successfully'));
      } else {
        alert(t('Failed to rename table'));
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
        const res = await fetch('/api/tables', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: table._id,
            x: table.x,
            y: table.y
          })
        });
        if (res.ok) {
          await refreshTables();
        }
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

  useEffect(() => {
    let active = true;
    if (qrOpen && activeTable && settings) {
      setQrDataUrl('');
      const data = getTableUrl(activeTable.name);
      const logoUrl = settings.logoUrl || tenantSettings?.logoUrl;
      const storeName = settings.name || tenantSettings?.name || 'DineLabs';

      let finalLogoUrl = logoUrl;
      if (logoUrl && logoUrl.startsWith('http')) {
        finalLogoUrl = `/api/proxy-image?url=${encodeURIComponent(logoUrl)}`;
      }

      generateQRDataUrl(data, finalLogoUrl, storeName, qrStyle).then((dataUrl) => {
        if (active) {
          setQrDataUrl(dataUrl);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [qrOpen, activeTable, settings, tenantSettings, qrStyle]);

  const handlePrintQR = () => {
    if (!activeTable || !settings || !qrDataUrl) return;
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
        <img src="${qrDataUrl}" />
        <div class="scan">${t('Scan to order at your table')}</div>
        <div class="u">${getTableUrl(activeTable.name)}</div>
        <script>window.onload=function(){setTimeout(function(){window.print()},250)}<\/script>
      </body></html>`);
    w.document.close();
  };

  const handleDownloadQR = async () => {
    if (!activeTable || !qrDataUrl) return;
    try {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `${activeTable.name.replace(/\s+/g, '-')}-qr.png`;
      a.click();
      triggerToast(t('QR Code download started'));
    } catch (err) {
      console.error('Failed to download QR code image', err);
      window.open(qrDataUrl, '_blank');
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

  return (
    <div className="fade-in">
      
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('Dine-in')}</h1>
          <p className="page-sub">{t('Create tables, hand each one a QR code to order from, and arrange your room on the floor plan.')}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSaveStatus}
          disabled={saving}
        >
          <Check className="ic" />
          <span>{saving ? t('Saving...') : t('Save changes')}</span>
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
                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{t('Accepting dine-in orders')}</span>
                    <span className={`pill ${dineInEnabled ? 'pill-pos' : 'pill-soft'}`} style={{ height: '22px', fontSize: '10px', fontWeight: 'bold' }}>
                      {dineInEnabled ? t('Active') : t('Disabled')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {t('Guests scan the QR code on their table to browse the menu and order from their seat.')}
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
                <span style={{ fontWeight: 'bold' }}>{t('Tables catalog')}</span>
              </div>
              <span className="card-note" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {tables.length} {tables.length === 1 ? t('table') : t('tables')}
              </span>
            </div>

            {/* Inline Table creation form */}
            <form onSubmit={handleAddTable} className="tbl-add" style={{ display: 'flex', gap: '10px', padding: '18px 22px', borderBottom: '1px solid var(--line)', backgroundColor: 'var(--surface-2)', alignItems: 'center' }}>
              <input 
                className="input" 
                type="text"
                placeholder={t('e.g. Table 6')} 
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                maxLength={24}
                style={{ flex: 1, maxWidth: '320px', backgroundColor: '#ffffff', borderRadius: '10px', height: '40px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus className="ic" style={{ width: '16px', height: '16px' }} />
                <span>{t('Add table')}</span>
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
                      title={t('Delete table')}
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
                        title={t('Double-click to rename')}
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
                      <span>{t('QR code')}</span>
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
                <span>{t('Interactive floor plan')}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>{t('Drag to arrange your dining room layout')}</p>
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
                    {t('No tables yet — add one above to place it here.')}
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
                <span>{t('Drag to reposition')}</span>
                <span style={{ color: 'var(--line-strong)' }}>·</span>
                <Type className="ic" style={{ width: '14px', height: '14px' }} />
                <span>{t('Double-click name on list cards to rename')}</span>
                <span style={{ color: 'var(--line-strong)' }}>·</span>
                <QrCode className="ic" style={{ width: '14px', height: '14px' }} />
                <span>{t('Click table on layout to open QR')}</span>
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
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{t('Table QR code')}</h3>
                </div>
                <button 
                  className="x" 
                  onClick={() => setQrOpen(false)} 
                  title={t('Close')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  <X style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="rail-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div className="qr-stage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                  <div className="qr-table-name" style={{ fontSize: '1.25rem', fontWeight: '800' }}>{activeTable.name}</div>
                  
                  {/* Style selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{t('QR Code Style')}</label>
                    <div style={{ display: 'flex', gap: '8px', width: '100%', backgroundColor: 'var(--surface-2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                      <button 
                        onClick={() => setQrStyle('fluid')} 
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          backgroundColor: qrStyle === 'fluid' ? '#ffffff' : 'transparent',
                          color: qrStyle === 'fluid' ? 'var(--brand-red)' : 'var(--text-muted)',
                          boxShadow: qrStyle === 'fluid' ? 'var(--sh-sm)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {t('Fluid Connected')}
                      </button>
                      <button 
                        onClick={() => setQrStyle('circular')} 
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          backgroundColor: qrStyle === 'circular' ? '#ffffff' : 'transparent',
                          color: qrStyle === 'circular' ? 'var(--brand-red)' : 'var(--text-muted)',
                          boxShadow: qrStyle === 'circular' ? 'var(--sh-sm)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {t('Circular Star')}
                      </button>
                    </div>
                  </div>

                  <div className="qr-frame" style={{ width: '220px', height: '220px', border: '1px solid var(--line-2)', borderRadius: '16px', backgroundColor: '#ffffff', display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-sm)', padding: '12px' }}>
                    {qrDataUrl ? (
                      <img 
                        src={qrDataUrl} 
                        alt="Concierge QR code" 
                        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                      />
                    ) : (
                      <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                    )}
                  </div>

                  <div className="qr-url" style={{ fontSize: '12.5px', color: 'var(--ink-2)', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center', backgroundColor: 'var(--surface-2)', border: '1px solid var(--line)', padding: '9px 12px', borderRadius: '9px', width: '100%' }}>
                    {getTableUrl(activeTable.name).replace(/https?:\/\//, '')}
                  </div>

                  <div className="qr-actions" style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
                    <button className="btn btn-outline" onClick={handlePrintQR} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '40px' }}>
                      <Printer className="ic" style={{ width: '16px', height: '16px' }} />
                      <span>{t('Print')}</span>
                    </button>
                    <button className="btn btn-primary" onClick={handleDownloadQR} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '40px' }}>
                      <Download className="ic" style={{ width: '16px', height: '16px' }} />
                      <span>{t('Download')}</span>
                    </button>
                  </div>

                  <p className="qr-note" style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5', marginTop: '10px' }}>
                    {t("Guests scan this to open {tableName}'s menu and order without waiting for a server.").replace('{tableName}', activeTable.name)}
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
      <DineInPageContent />
    </Suspense>
  );
}

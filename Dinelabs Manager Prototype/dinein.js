/* ===================== DINE-IN PAGE ===================== */
renderShell('dinein');

/* ---------- storefront slug for QR links ---------- */
const STORE_SLUG = (RESTAURANT.name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '');
const tableUrl = (code) => `order.${STORE_SLUG}.ge?table=${code}`;

/* ---------- state ---------- */
const DEFAULT_TABLES = [
  { id: 't1', code: 'T1', name: 'Table 1', x: 0.10, y: 0.12 },
  { id: 't2', code: 'T2', name: 'Table 2', x: 0.42, y: 0.12 },
  { id: 't3', code: 'T3', name: 'Table 3', x: 0.74, y: 0.14 },
  { id: 't4', code: 'T4', name: 'Table 4', x: 0.16, y: 0.58 },
  { id: 't5', code: 'T5', name: 'Table 5', x: 0.56, y: 0.60 },
];
let DI = Object.assign({ on: true }, store.get('dineinMeta', {}));
let TABLES = store.get('dineinTables', null) || structuredClone(DEFAULT_TABLES);
const saveMeta = () => store.set('dineinMeta', { on: DI.on });
const saveTables = () => store.set('dineinTables', TABLES);

let seq = TABLES.reduce((m, t) => Math.max(m, parseInt(t.id.slice(1)) || 0), 0);
function nextCode() {
  let n = 1;
  const used = new Set(TABLES.map(t => t.code));
  while (used.has('T' + n)) n++;
  return 'T' + n;
}

/* ===================== status hero ===================== */
$('#diToggle').checked = DI.on;
function applyStatus() {
  const s = $('#diStatus'), pill = $('#diPill');
  s.classList.toggle('on', DI.on);
  pill.classList.toggle('live', DI.on);
  pill.classList.toggle('paused', !DI.on);
  $('#diPillTxt').textContent = DI.on ? 'Live on storefront' : 'Paused';
  $('#diStatusSub').textContent = DI.on
    ? 'Guests scan the QR code on their table to browse the menu and order from their seat.'
    : 'When off, table QR codes show a "not accepting orders" message to guests.';
}
$('#diToggle').addEventListener('change', (e) => {
  DI.on = e.target.checked; saveMeta(); applyStatus();
  toast(`Dine-in ${DI.on ? 'enabled' : 'paused'}`, DI.on ? 'armchair' : 'pause-circle');
});

/* ===================== table cards ===================== */
function renderCards() {
  $('#tblCount').textContent = `${TABLES.length} table${TABLES.length === 1 ? '' : 's'}`;
  $('#tblGrid').innerHTML = TABLES.map(t => `
    <div class="tbl-card" data-id="${t.id}">
      <div class="tbl-card-top">
        <div class="tbl-ic"><i class="ic" data-lucide="utensils"></i></div>
        <button class="tbl-x" data-del title="Delete table"><i class="ic" data-lucide="x"></i></button>
      </div>
      <div>
        <div class="tbl-name" data-name title="Double-click to rename">${esc(t.name)}</div>
        <div class="tbl-sub">${t.code} · ${tableUrl(t.code)}</div>
      </div>
      <div class="tbl-card-actions">
        <button class="btn btn-outline btn-sm" data-qr><i class="ic" data-lucide="qr-code"></i>QR code</button>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

$('#tblGrid').addEventListener('click', (e) => {
  const card = e.target.closest('.tbl-card'); if (!card) return;
  const t = TABLES.find(x => x.id === card.dataset.id);
  if (e.target.closest('[data-del]')) {
    TABLES = TABLES.filter(x => x.id !== t.id); saveTables(); renderCards(); renderPlan();
    toast(`Deleted ${t.name}`, 'trash-2');
  } else if (e.target.closest('[data-qr]')) {
    openQR(t);
  }
});

/* double-click a card name to rename inline */
$('#tblGrid').addEventListener('dblclick', (e) => {
  const nameEl = e.target.closest('[data-name]'); if (!nameEl) return;
  const card = e.target.closest('.tbl-card');
  const t = TABLES.find(x => x.id === card.dataset.id);
  startCardRename(nameEl, t);
});

function startCardRename(nameEl, t) {
  nameEl.setAttribute('contenteditable', 'true');
  nameEl.focus();
  document.getSelection().selectAllChildren(nameEl);
  const commit = () => {
    nameEl.removeAttribute('contenteditable');
    const v = nameEl.textContent.trim();
    if (v && v !== t.name) { t.name = v; saveTables(); renderPlan(); toast('Table renamed'); }
    nameEl.textContent = t.name;
    nameEl.removeEventListener('keydown', onKey);
    nameEl.removeEventListener('blur', commit);
    renderCards();
  };
  const onKey = (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); nameEl.blur(); }
    if (ev.key === 'Escape') { nameEl.textContent = t.name; nameEl.blur(); }
  };
  nameEl.addEventListener('keydown', onKey);
  nameEl.addEventListener('blur', commit, { once: true });
}

/* add table */
function addTable() {
  const input = $('#newTblName');
  const name = input.value.trim() || `Table ${seq + 1}`;
  const code = nextCode();
  seq++;
  TABLES.push({ id: 't' + (seq), code, name, x: 0.35 + Math.random() * 0.2, y: 0.35 + Math.random() * 0.2 });
  saveTables(); input.value = ''; renderCards(); renderPlan();
  toast(`Added ${name}`, 'plus');
}
$('#addTblBtn').addEventListener('click', addTable);
$('#newTblName').addEventListener('keydown', (e) => { if (e.key === 'Enter') addTable(); });

/* ===================== floor plan ===================== */
const board = $('#fpBoard');
const NODE_W = 96, NODE_H = 70;

function renderPlan() {
  if (!TABLES.length) {
    board.innerHTML = `<div class="fp-empty">No tables yet — add one above to place it here.</div>`;
    return;
  }
  board.innerHTML = TABLES.map(t => `
    <div class="fp-node" data-id="${t.id}" style="left:0;top:0">
      <i class="ic" data-lucide="utensils"></i>
      <span class="fp-label">${esc(t.name)}</span>
    </div>`).join('');
  lucide.createIcons();
  positionNodes();
  board.querySelectorAll('.fp-node').forEach(attachDrag);
}

function positionNodes() {
  const bw = board.clientWidth, bh = board.clientHeight;
  board.querySelectorAll('.fp-node').forEach(node => {
    const t = TABLES.find(x => x.id === node.dataset.id);
    node.style.left = (t.x * (bw - NODE_W)) + 'px';
    node.style.top = (t.y * (bh - NODE_H)) + 'px';
  });
}
window.addEventListener('resize', () => { if (TABLES.length) positionNodes(); });

let clickTimer = null;
function attachDrag(node) {
  const t = TABLES.find(x => x.id === node.dataset.id);
  let startX, startY, originLeft, originTop, moved;

  node.addEventListener('pointerdown', (e) => {
    if (node.querySelector('.fp-edit')) return; // renaming
    e.preventDefault();
    node.setPointerCapture(e.pointerId);
    startX = e.clientX; startY = e.clientY;
    originLeft = parseFloat(node.style.left); originTop = parseFloat(node.style.top);
    moved = false;
    node.classList.add('dragging');
  });

  node.addEventListener('pointermove', (e) => {
    if (!node.classList.contains('dragging')) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (!moved && Math.hypot(dx, dy) > 4) moved = true;
    const bw = board.clientWidth, bh = board.clientHeight;
    const left = Math.max(0, Math.min(bw - NODE_W, originLeft + dx));
    const top = Math.max(0, Math.min(bh - NODE_H, originTop + dy));
    node.style.left = left + 'px';
    node.style.top = top + 'px';
  });

  node.addEventListener('pointerup', (e) => {
    if (!node.classList.contains('dragging')) return;
    node.classList.remove('dragging');
    const bw = board.clientWidth, bh = board.clientHeight;
    t.x = parseFloat(node.style.left) / (bw - NODE_W);
    t.y = parseFloat(node.style.top) / (bh - NODE_H);
    if (moved) { saveTables(); }
    else {
      // treat as click → open QR (debounced so a double-click renames instead)
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => openQR(t), 230);
    }
  });

  node.addEventListener('dblclick', (e) => {
    clearTimeout(clickTimer);
    startNodeRename(node, t);
  });
}

function startNodeRename(node, t) {
  const label = node.querySelector('.fp-label');
  const input = document.createElement('input');
  input.className = 'fp-edit'; input.value = t.name; input.maxLength = 24;
  label.replaceWith(input);
  input.focus(); input.select();
  const commit = (save) => {
    const v = input.value.trim();
    if (save && v) { t.name = v; saveTables(); }
    renderCards();
    renderPlan();
  };
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); commit(true); }
    if (ev.key === 'Escape') { commit(false); }
  });
  input.addEventListener('blur', () => commit(true), { once: true });
  input.addEventListener('pointerdown', (ev) => ev.stopPropagation());
}

/* ===================== QR drawer ===================== */
const qrScrim = $('#qrScrim'), qrDrawer = $('#qrDrawer');
let activeTable = null;

function openQR(t) {
  activeTable = t;
  $('#qrName').textContent = t.name;
  $('#qrNoteName').textContent = t.name;
  $('#qrUrl').textContent = tableUrl(t.code);
  drawQR($('#qrCanvas'), tableUrl(t.code));
  qrScrim.classList.add('open'); qrDrawer.classList.add('open');
}
function closeQR() { qrScrim.classList.remove('open'); qrDrawer.classList.remove('open'); }
$('#qrClose').addEventListener('click', closeQR);
qrScrim.addEventListener('click', closeQR);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQR(); });

/* stylized (non-scannable) QR placeholder, deterministic from text */
function drawQR(canvas, text) {
  const ctx = canvas.getContext('2d');
  const N = 25, quiet = 2, total = N + quiet * 2;
  const px = Math.floor(canvas.width / total);
  const offset = Math.floor((canvas.width - px * total) / 2);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // reserved finder zones (7x7 + 1 separator)
  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);

  // PRNG seeded by text
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  let seed = h >>> 0;
  const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  ctx.fillStyle = '#0a0a0a';
  const cell = (cx, cy) => ctx.fillRect(offset + (cx + quiet) * px, offset + (cy + quiet) * px, px, px);

  // data modules
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue;
      // timing rows for realism
      if (x === 6 || y === 6) { if ((x + y) % 2 === 0) cell(x, y); continue; }
      if (rnd() > 0.52) cell(x, y);
    }
  }

  // finder pattern (7x7) drawer
  const finder = (gx, gy) => {
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
      const edge = i === 0 || i === 6 || j === 0 || j === 6;
      const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
      if (edge || core) cell(gx + i, gy + j);
    }
  };
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
}

/* download / print */
$('#qrDownload').addEventListener('click', () => {
  if (!activeTable) return;
  const a = document.createElement('a');
  a.href = $('#qrCanvas').toDataURL('image/png');
  a.download = `${activeTable.name.replace(/\s+/g, '-')}-qr.png`;
  a.click();
  toast(`Downloaded ${activeTable.name} QR`, 'download');
});

$('#qrPrint').addEventListener('click', () => {
  if (!activeTable) return;
  const data = $('#qrCanvas').toDataURL('image/png');
  const w = window.open('', '_blank', 'width=480,height=640');
  w.document.write(`
    <html><head><title>${esc(activeTable.name)} — QR</title>
    <style>
      body{margin:0;font-family:-apple-system,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:20px}
      .name{font-size:26px;font-weight:800;letter-spacing:-.02em}
      img{width:300px;height:300px;image-rendering:pixelated;border:1px solid #e0e0e0;border-radius:18px;padding:18px}
      .u{font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#555}
      .scan{font-size:15px;font-weight:600;color:#333}
    </style></head>
    <body>
      <div class="name">${esc(activeTable.name)}</div>
      <img src="${data}" />
      <div class="scan">Scan to order at your table</div>
      <div class="u">${esc(tableUrl(activeTable.code))}</div>
      <script>window.onload=function(){setTimeout(function(){window.print()},250)}<\/script>
    </body></html>`);
  w.document.close();
});

/* ---------- save ---------- */
$('#diSave').addEventListener('click', () => { saveMeta(); saveTables(); toast('Dine-in settings saved', 'check-circle-2'); });

/* ---------- init ---------- */
applyStatus();
renderCards();
renderPlan();

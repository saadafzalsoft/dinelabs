/* ===================== LIVE ORDERS BOARD ===================== */
renderShell('orders');

const COLS = [
  { key: 'new', title: 'New', dot: 'var(--neg)' },
  { key: 'progress', title: 'In progress', dot: 'var(--info)' },
  { key: 'ready', title: 'Ready', dot: 'var(--pos)' },
];
const NEXT = { new: 'progress', progress: 'ready' };
const ADVANCE_LABEL = { new: 'Accept', progress: 'Ready' };
const DONE_LABEL = { delivery: 'Dispatch', pickup: 'Picked up', dinein: 'Served' };

let channelFilter = '';
let live = store.get('ordersLive', true);
let completedToday = store.get('completedToday', 47);
let timer = null;

const NAMES = ['Aria Cole', 'Ravi Shah', 'Mina Park', 'Tom Beck', 'Lia Vance', 'Omar Diab', 'Nora Kemp', 'Yuki Sato'];
const ADDRS = ['12 Leselidze St · 1.4 km', '8 Abashidze · 2.8 km', '40 Chavchavadze · 3.1 km', '5 Erekle II · 0.9 km'];
const randPhone = () => '+995 5' + (90 + Math.floor(Math.random() * 9)) + ' ' + String(10 + Math.floor(Math.random() * 89)) + ' ' + String(10 + Math.floor(Math.random() * 89)) + ' ' + String(10 + Math.floor(Math.random() * 89));
const emailOf = (n) => n.toLowerCase().replace(/[^a-z]+/g, '.') + '@gmail.com';

function timeLabel(m) { return m <= 0 ? 'Just now' : m + 'm ago'; }
function itemCount(o) { return o.items.reduce((s, [, q]) => s + q, 0); }

function updateNavBadge() {
  const n = ORDERS_DATA.filter(o => o.status === 'new').length;
  const link = document.querySelector('.sidebar .nav-item.active');
  if (!link) return;
  let b = link.querySelector('.badge');
  if (n === 0) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement('span'); b.className = 'badge'; link.appendChild(b); }
  b.textContent = n;
}

function renderStats() {
  const c = (s) => ORDERS_DATA.filter(o => o.status === s).length;
  const stats = [
    { v: c('new'), l: 'New orders', ic: 'inbox', bg: 'var(--neg-bg)', col: 'var(--neg)' },
    { v: c('progress'), l: 'Preparing', ic: 'chef-hat', bg: 'var(--warn-bg)', col: 'var(--warn)' },
    { v: c('ready'), l: 'Ready to go', ic: 'package-check', bg: 'var(--pos-bg)', col: 'var(--pos)' },
    { v: completedToday, l: 'Completed today', ic: 'check-check', bg: 'var(--surface-2)', col: 'var(--ink)' },
  ];
  $('#stats').innerHTML = stats.map(s => `
    <div class="card stat">
      <span class="stat-ic" style="background:${s.bg};color:${s.col}"><i class="ic" data-lucide="${s.ic}"></i></span>
      <div><div class="stat-v tnum">${s.v}</div><div class="stat-l">${s.l}</div></div>
    </div>`).join('');
  lucide.createIcons();
}

function card(o) {
  const items = o.items.map(([n, q]) => `<div><span class="qty">${q}</span>${n}</div>`).join('');
  const sub = o.channel === 'dinein' ? o.customer : (o.channel === 'delivery' ? `${o.customer} · ${o.addr || ''}` : `${o.customer} · ready in ${o.mins < 15 ? 15 - o.mins : 5} min`);
  const advance = NEXT[o.status]
    ? `<button class="btn btn-primary btn-sm" data-act="advance" data-id="${o.id}">${ADVANCE_LABEL[o.status]}<i class="ic" data-lucide="arrow-right"></i></button>`
    : `<button class="btn btn-primary btn-sm" data-act="done" data-id="${o.id}"><i class="ic" data-lucide="check"></i>${DONE_LABEL[o.channel]}</button>`;
  const details = `<button class="btn btn-outline btn-sm" data-act="details" data-id="${o.id}"><i class="ic" data-lucide="receipt-text"></i>Details</button>`;
  return `<div class="ocard" data-id="${o.id}">
    <div class="oc-top">
      <span class="oc-id">#${o.id}</span>
      <span class="oc-ch ch-${o.channel}"><i class="ic" data-lucide="${CHANNEL[o.channel].icon}"></i>${CHANNEL[o.channel].label}</span>
      <span class="oc-time">${timeLabel(o.mins)}</span>
    </div>
    <div class="oc-cust">${sub}</div>
    <div class="oc-items">${items}</div>
    <div class="oc-foot">
      <span class="oc-total tnum">${money(o.total)}</span>
      <span class="oc-actions">${details}${advance}</span>
    </div>
  </div>`;
}

function renderBoard() {
  $('#board').innerHTML = COLS.map(col => {
    const list = ORDERS_DATA.filter(o => o.status === col.key && (!channelFilter || o.channel === channelFilter));
    const total = ORDERS_DATA.filter(o => o.status === col.key).length;
    return `<div class="col">
      <div class="col-head"><span class="col-dot" style="background:${col.dot}"></span><span class="col-title">${col.title}</span><span class="col-count">${total}</span></div>
      <div class="col-body" data-col="${col.key}">
        ${list.length ? list.map(card).join('') : '<div class="col-empty">No orders</div>'}
      </div>
    </div>`;
  }).join('');
  lucide.createIcons();
  renderStats();
  updateNavBadge();
}

/* ---- actions ---- */
$('#board').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn) {
    // clicking anywhere else on a card opens its details
    const cardEl = e.target.closest('.ocard');
    if (cardEl) openDetails(cardEl.dataset.id);
    return;
  }
  const id = btn.dataset.id; const o = ORDERS_DATA.find(x => x.id === id); if (!o) return;
  const act = btn.dataset.act;
  if (act === 'advance') {
    o.status = NEXT[o.status]; o.mins = 0; saveOrders(); renderBoard();
    toast(`#${id} → ${COLS.find(c => c.key === o.status).title}`, 'arrow-right');
  } else if (act === 'details') {
    openDetails(id);
  } else if (act === 'done') {
    removeOrder(id, 'done');
  }
});

/* remove an order (completed or cancelled) with the exit animation */
function removeOrder(id, kind) {
  const cardEl = document.querySelector(`.ocard[data-id="${id}"]`);
  if (cardEl) cardEl.classList.add('removing');
  setTimeout(() => {
    window.ORDERS_DATA = ORDERS_DATA.filter(x => x.id !== id);
    if (kind === 'done') { completedToday++; store.set('completedToday', completedToday); }
    saveOrders(); renderBoard();
  }, 260);
  toast(kind === 'done' ? `#${id} completed` : `#${id} cancelled`, kind === 'done' ? 'check-circle-2' : 'x-circle');
}

/* ---- order details modal ---- */
const unitPrice = (name) => { const p = PRODUCTS_SEED.find(x => x.name === name); return p ? p.price : 0; };

/* per-item add-ons / note / picture — synthesised deterministically from order id + item */
const SIZE_POOL = ['Small', 'Medium', 'Large'];
const ADDON_POOL = ['Extra Cheese · +$2.00', 'Mushrooms · +$1.50', 'Pepperoni · +$2.00', 'Extra Sauce · +$1.00', 'Jalapeños · +$1.00'];
const REMOVE_POOL = ['No Onion', 'No Garlic', 'No Olives'];
const NOTE_POOL = ['Well done, please.', 'Cut into 8 slices.', 'Allergy: nut-free.', 'Extra napkins.', 'Light on the sauce.'];
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function itemExtras(orderId, name) {
  const p = PRODUCTS_SEED.find(x => x.name === name) || { mods: [], icon: 'utensils' };
  const h = hashStr(orderId + '|' + name);
  const addons = [];
  if (p.mods.includes('Choose Size')) addons.push(SIZE_POOL[h % 3]);
  if (p.mods.includes('Premium Addons')) { addons.push(ADDON_POOL[h % ADDON_POOL.length]); if ((h >>> 3) % 2) addons.push(ADDON_POOL[(h >>> 1) % ADDON_POOL.length]); }
  if (p.mods.includes('Remove Ingredients') && (h >>> 4) % 2) addons.push(REMOVE_POOL[h % REMOVE_POOL.length]);
  const note = (h % 3 === 0) ? NOTE_POOL[h % NOTE_POOL.length] : '';
  return { addons: [...new Set(addons)], note, icon: p.icon || 'utensils', removals: REMOVE_POOL };
}

const fulfillment = (o) => {
  if (o.channel === 'dinein') return { ic: 'utensils', label: 'Dine-in', value: o.table || 'Table', extra: o.customer && o.customer.includes('·') ? o.customer.split('·')[1].trim() : '' };
  if (o.channel === 'delivery') return { ic: 'bike', label: 'Delivery address', value: o.addr || '—', extra: '' };
  return { ic: 'shopping-bag', label: 'Pick-up', value: 'Counter collection', extra: `Ready in ${o.mins < 15 ? 15 - o.mins : 5} min` };
};

function openDetails(id) {
  const o = ORDERS_DATA.find(x => x.id === id); if (!o) return;
  const f = fulfillment(o);
  const name = o.guest || (o.channel === 'dinein' ? 'Walk-in guest' : o.customer);
  const itemsRows = o.items.map(([n, q]) => {
    const ex = itemExtras(o.id, n);
    const isRemoval = (a) => ex.removals.includes(a);
    const chips = ex.addons.map(a => `<span class="od-addon ${isRemoval(a) ? 'rem' : ''}">${a}</span>`).join('');
    return `<div class="od-item">
      <span class="od-thumb"><i class="ic" data-lucide="${ex.icon}"></i></span>
      <div class="od-item-main">
        <div class="od-item-top"><span class="od-q">${q}</span><span class="od-n">${n}</span><span class="od-p tnum">${money(unitPrice(n) * q)}</span></div>
        ${chips ? `<div class="od-addons">${chips}</div>` : ''}
        ${ex.note ? `<div class="od-note"><i class="ic" data-lucide="sticky-note"></i><span>${ex.note}</span></div>` : ''}
      </div>
    </div>`;
  }).join('');
  const st = STATUS[o.status];
  const prim = NEXT[o.status]
    ? { act: 'advance', label: ADVANCE_LABEL[o.status], icon: 'arrow-right' }
    : { act: 'done', label: DONE_LABEL[o.channel], icon: 'check' };
  $('#odBody').innerHTML = `
    <div class="od-grid">
      <div class="od-col">
        <div class="od-head">
          <div class="od-id">Order #${o.id}</div>
          <span class="od-status"><span class="od-dot" style="background:${st.dot}"></span>${st.label}</span>
        </div>
        <div class="od-meta">
          <span class="oc-ch ch-${o.channel}"><i class="ic" data-lucide="${CHANNEL[o.channel].icon}"></i>${CHANNEL[o.channel].label}</span>
          <span class="od-time"><i class="ic" data-lucide="clock"></i>Placed ${timeLabel(o.mins)}</span>
        </div>

        <div class="od-sec">
          <div class="od-sec-t">Customer</div>
          <div class="od-info">
            <div class="od-row"><i class="ic" data-lucide="user"></i><span>${name}</span></div>
            <a class="od-row od-link" href="tel:${(o.phone||'').replace(/\\s/g,'')}"><i class="ic" data-lucide="phone"></i><span>${o.phone || '—'}</span></a>
            <a class="od-row od-link" href="mailto:${o.email||''}"><i class="ic" data-lucide="mail"></i><span>${o.email || '—'}</span></a>
          </div>
        </div>

        <div class="od-sec">
          <div class="od-sec-t">${f.label}</div>
          <div class="od-info">
            <div class="od-row"><i class="ic" data-lucide="${f.ic}"></i><span>${f.value}</span></div>
            ${f.extra ? `<div class="od-row od-mut"><i class="ic" data-lucide="info"></i><span>${f.extra}</span></div>` : ''}
          </div>
        </div>
      </div>

      <div class="od-col">
        <div class="od-sec">
          <div class="od-sec-t">Items · ${itemCount(o)}</div>
          <div class="od-items">${itemsRows}</div>
          <div class="od-total"><span>Total</span><span class="tnum">${money(o.total)}</span></div>
        </div>
      </div>
    </div>

    <div class="od-foot">
      <button class="btn btn-danger btn-lg od-cancel" id="odCancel" data-id="${o.id}">Cancel</button>
      <button class="btn btn-primary btn-lg od-primary" id="odPrimary" data-id="${o.id}" data-act="${prim.act}">${prim.label}<i class="ic" data-lucide="${prim.icon}"></i></button>
    </div>`;
  lucide.createIcons();
  $('#odScrim').classList.add('open');
  $('#orderModal').classList.add('open');
}
function closeDetails() {
  $('#odScrim').classList.remove('open');
  $('#orderModal').classList.remove('open');
}
$('#odScrim').addEventListener('click', closeDetails);
$('#odClose').addEventListener('click', closeDetails);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetails(); });
$('#odBody').addEventListener('click', (e) => {
  const cancel = e.target.closest('#odCancel');
  if (cancel) { const id = cancel.dataset.id; closeDetails(); removeOrder(id, 'cancel'); return; }
  const prim = e.target.closest('#odPrimary');
  if (prim) {
    const id = prim.dataset.id; const o = ORDERS_DATA.find(x => x.id === id); if (!o) return;
    closeDetails();
    if (prim.dataset.act === 'advance') {
      o.status = NEXT[o.status]; o.mins = 0; saveOrders(); renderBoard();
      toast(`#${id} → ${COLS.find(c => c.key === o.status).title}`, 'arrow-right');
    } else {
      removeOrder(id, 'done');
    }
  }
});

/* ---- filters ---- */
$('#chips').addEventListener('click', (e) => {
  const c = e.target.closest('.chip'); if (!c) return;
  channelFilter = c.dataset.ch;
  $$('#chips .chip').forEach(x => x.classList.toggle('on', x === c));
  renderBoard();
});

/* ---- live simulation ---- */
function spawnOrder() {
  const channels = ['delivery', 'pickup', 'dinein'];
  const ch = channels[Math.floor(Math.random() * 3)];
  const pool = PRODUCTS_SEED.slice();
  const n = 1 + Math.floor(Math.random() * 3);
  const items = [];
  for (let i = 0; i < n; i++) {
    const p = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; if (!p) break;
    items.push([p.name, 1 + Math.floor(Math.random() * 2)]);
  }
  const total = items.reduce((s, [name, q]) => s + (PRODUCTS_SEED.find(p => p.name === name).price * q), 0);
  const ids = ORDERS_DATA.map(o => +o.id); const id = String((ids.length ? Math.max(...ids) : 1042) + 1);
  const o = { id, channel: ch, mins: 0, status: 'new', items, total: +total.toFixed(2) };
  if (ch === 'dinein') { o.table = 'Table ' + (1 + Math.floor(Math.random() * 6)); o.customer = o.table + ' · Indoor'; o.guest = NAMES[Math.floor(Math.random() * NAMES.length)]; }
  else if (ch === 'delivery') { o.customer = NAMES[Math.floor(Math.random() * NAMES.length)]; o.addr = ADDRS[Math.floor(Math.random() * ADDRS.length)]; }
  else { o.customer = NAMES[Math.floor(Math.random() * NAMES.length)]; }
  o.phone = randPhone(); o.email = emailOf(o.guest || o.customer);
  ORDERS_DATA.unshift(o); saveOrders(); renderBoard();
  // highlight the new card
  const el2 = document.querySelector(`.ocard[data-id="${id}"]`); if (el2) el2.classList.add('pop-in');
  toast(`New ${CHANNEL[ch].label} order #${id}`, 'bell-ring');
}

function setLive(on) {
  live = on; store.set('ordersLive', on);
  $('#liveBtn').classList.toggle('on', on);
  $('#liveNote').textContent = on ? 'Auto-refresh on · new orders arrive automatically' : 'Auto-refresh paused';
  clearInterval(timer);
  if (on) timer = setInterval(spawnOrder, 16000);
}
$('#liveBtn').addEventListener('click', () => setLive(!live));
$('#simBtn')?.addEventListener('click', spawnOrder);

/* ---- init ---- */
renderBoard();
setLive(live);

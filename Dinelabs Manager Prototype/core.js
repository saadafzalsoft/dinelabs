/* ============================================================
   Dinelabs Manager — shared shell, data & helpers
   ============================================================ */

/* ---------- tiny helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const store = {
  get(k, d) { try { const v = localStorage.getItem('dl_' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('dl_' + k, JSON.stringify(v)); } catch {} }
};

/* ---------- restaurant ---------- */
const RESTAURANT = { name: 'Pizza Hut', plan: 'Tier 2 · Pro', initials: 'PH' };

/* ---------- mock data (shared across pages) ---------- */
const CATEGORIES = ['Offers & Promotions', 'Classic Pizzas', 'Sides & Appetizers', 'Beverages'];
const MODIFIERS = ['Choose Size', 'Premium Addons', 'Remove Ingredients', 'Extra Cheese'];

const PRODUCTS_SEED = [
  { id: 'p1', name: 'Korean BBQ Chicken', cats: ['Offers & Promotions', 'Classic Pizzas'], mods: ['Choose Size', 'Premium Addons', 'Remove Ingredients'], price: 16.90, icon: 'pizza' },
  { id: 'p2', name: 'Garlic Flatzz', cats: ['Sides & Appetizers'], mods: ['Premium Addons'], price: 8.50, icon: 'utensils' },
  { id: 'p3', name: 'Coca-Cola', cats: ['Beverages'], mods: [], price: 2.50, icon: 'cup-soda' },
  { id: 'p4', name: 'Cheese Pizza', cats: ['Classic Pizzas'], mods: ['Choose Size', 'Premium Addons', 'Remove Ingredients'], price: 12.50, icon: 'pizza' },
  { id: 'p5', name: 'Chicken Sticks', cats: ['Sides & Appetizers'], mods: ['Premium Addons'], price: 9.20, icon: 'drumstick' },
  { id: 'p6', name: 'Still Water', cats: ['Beverages'], mods: [], price: 1.50, icon: 'glass-water' },
  { id: 'p7', name: 'Vegetarian Supreme', cats: ['Classic Pizzas'], mods: ['Choose Size', 'Premium Addons', 'Remove Ingredients'], price: 14.80, icon: 'pizza' },
  { id: 'p8', name: 'Pepperoni Feast', cats: ['Classic Pizzas'], mods: ['Choose Size', 'Premium Addons', 'Remove Ingredients'], price: 15.90, icon: 'pizza' },
];

/* ---------- orders (shared: dashboard snapshot, board, badge) ---------- */
const ORDERS_SEED = [
  { id: '1042', channel: 'dinein', table: 'Table 4', customer: 'Table 4 · Indoor', mins: 1, status: 'new',
    items: [['Pepperoni Feast', 1], ['Garlic Flatzz', 1], ['Coca-Cola', 2]], total: 23.80 },
  { id: '1041', channel: 'delivery', customer: 'Mara Ito', addr: '14 Vasil St · 2.1 km', mins: 3, status: 'new',
    items: [['Korean BBQ Chicken', 1], ['Chicken Sticks', 1]], total: 26.10 },
  { id: '1040', channel: 'pickup', customer: 'James Okafor', mins: 6, status: 'new',
    items: [['Cheese Pizza', 1], ['Still Water', 1]], total: 14.00 },
  { id: '1039', channel: 'delivery', customer: 'Lena Brandt', addr: '9 Rustaveli Ave · 3.4 km', mins: 11, status: 'progress',
    items: [['Vegetarian Supreme', 1], ['Coca-Cola', 1]], total: 17.30 },
  { id: '1038', channel: 'dinein', table: 'Table 2', customer: 'Table 2 · Bar Area', mins: 14, status: 'progress',
    items: [['Pepperoni Feast', 1], ['Cheese Pizza', 1]], total: 28.40 },
  { id: '1037', channel: 'pickup', customer: 'Sofia Renner', mins: 19, status: 'accepted',
    items: [['Garlic Flatzz', 2]], total: 17.00 },
  { id: '1036', channel: 'delivery', customer: 'Dan Pekić', addr: '22 Marjanishvili · 1.6 km', mins: 24, status: 'ready',
    items: [['Korean BBQ Chicken', 1], ['Still Water', 2]], total: 19.90 },
  { id: '1035', channel: 'dinein', table: 'Table 1', customer: 'Table 1 · Indoor', mins: 31, status: 'ready',
    items: [['Cheese Pizza', 2], ['Coca-Cola', 2]], total: 30.00 },
];
function loadOrders() {
  const saved = store.get('orders', null);
  window.ORDERS_DATA = saved || ORDERS_SEED.map(o => ({ ...o }));
  return window.ORDERS_DATA;
}
function saveOrders() { store.set('orders', window.ORDERS_DATA); }
loadOrders();

const CHANNEL = {
  delivery: { label: 'Delivery', icon: 'bike' },
  pickup:   { label: 'Pick-up', icon: 'shopping-bag' },
  dinein:   { label: 'Dine-in', icon: 'utensils' },
};
const STATUS = {
  new:      { label: 'New', dot: 'var(--neg)' },
  accepted: { label: 'Accepted', dot: 'var(--warn)' },
  progress: { label: 'In progress', dot: 'var(--info)' },
  ready:    { label: 'Ready', dot: 'var(--pos)' },
};

/* ---------- nav definition ---------- */
const NAV = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'Dashboard.html' },
    { id: 'orders', label: 'Live Orders', icon: 'receipt-text', href: 'Orders.html', badgeKey: 'newOrders' },
  ]},
  { group: 'Menu', items: [
    { id: 'categories', label: 'Categories', icon: 'layers', soon: true },
    { id: 'products', label: 'Products', icon: 'utensils-crossed', href: 'Products.html' },
    { id: 'addons', label: 'Add-ons', icon: 'plus-circle', soon: true },
  ]},
  { group: 'Store settings', items: [
    { id: 'hours', label: 'Opening hours', icon: 'clock', soon: true },
    { id: 'delivery', label: 'Delivery', icon: 'bike', soon: true },
    { id: 'dinein', label: 'Dine-in', icon: 'armchair', soon: true },
    { id: 'pickup', label: 'Pick-up', icon: 'shopping-bag', soon: true },
  ]},
  { group: 'Account', items: [
    { id: 'profile', label: 'Store profile', icon: 'settings', soon: true },
    { id: 'notif', label: 'Notifications', icon: 'bell', soon: true },
  ]},
];

/* ---------- render shell ---------- */
function renderShell(active) {
  const sb = $('#sidebar');
  const newOrders = (window.ORDERS_DATA ? window.ORDERS_DATA.filter(o => o.status === 'new').length : 0);
  const counts = { newOrders };

  sb.innerHTML = `
    <div class="brand">
      <img src="assets/dinelabs-logo.png" alt="Dinelabs Manager" style="width:186px;height:auto;display:block" />
    </div>
    <nav class="nav">
      ${NAV.map(g => `
        <div class="nav-group">
          <div class="nav-label">${g.group}</div>
          ${g.items.map(it => {
            const isActive = it.id === active;
            const badge = it.badgeKey && counts[it.badgeKey] ? `<span class="badge">${counts[it.badgeKey]}</span>` : '';
            const tag = it.soon ? `<a class="nav-item soon" title="Not in this prototype"><i class="ic" data-lucide="${it.icon}"></i>${it.label}</a>`
              : `<a class="nav-item ${isActive ? 'active' : ''}" href="${it.href}"><i class="ic" data-lucide="${it.icon}"></i>${it.label}${badge}</a>`;
            return tag;
          }).join('')}
        </div>`).join('')}
    </nav>
    <div class="nav-foot">
      <div class="user-chip">
        <div class="avatar">${RESTAURANT.initials}</div>
        <div class="user-meta">
          <div class="user-name">${RESTAURANT.name}</div>
          <div class="user-sub">${RESTAURANT.plan}</div>
        </div>
        <i class="ic" data-lucide="chevrons-up-down" style="width:16px;height:16px;color:var(--ink-3);margin-left:auto"></i>
      </div>
    </div>`;

  const tb = $('#topbar');
  const crumbMap = { dashboard: 'Dashboard', orders: 'Live Orders', products: 'Products' };
  tb.innerHTML = `
    <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Menu"><i class="ic" data-lucide="menu"></i></button>
    <div class="crumb"><i class="ic" data-lucide="store" style="width:15px;height:15px"></i> ${RESTAURANT.name} <span style="color:var(--line-strong)">/</span> <b>${crumbMap[active] || ''}</b></div>
    <div class="topbar-spacer"></div>
    <div class="searchbox">
      <i class="ic" data-lucide="search"></i>
      <input placeholder="Search orders, products…" />
    </div>
    <button class="btn btn-outline btn-sm" style="height:40px"><i class="ic" data-lucide="external-link"></i> Storefront</button>
    <button class="icon-btn" aria-label="Notifications"><i class="ic" data-lucide="bell"></i><span class="dot"></span></button>`;

  if (window.lucide) lucide.createIcons();

  const mt = $('#menuToggle');
  if (mt) mt.addEventListener('click', () => sb.classList.toggle('open'));
}

/* ---------- toast ---------- */
function toast(msg, icon = 'check-circle-2') {
  let wrap = $('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="ic" data-lucide="${icon}"></i><span>${msg}</span><span class="t-x" data-lucide="x"></span>`;
  wrap.appendChild(t);
  if (window.lucide) lucide.createIcons();
  const close = () => { t.style.transition = 'opacity .2s, transform .2s'; t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 200); };
  t.querySelector('.t-x').addEventListener('click', close);
  setTimeout(close, 3200);
}

/* ---------- mini SVG icon helper (for charts etc.) ---------- */
function el(tag, attrs = {}, children = []) {
  const ns = 'http://www.w3.org/2000/svg';
  const e = document.createElementNS(ns, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (Array.isArray(children) ? children : [children]).forEach(c => c && e.appendChild(c));
  return e;
}

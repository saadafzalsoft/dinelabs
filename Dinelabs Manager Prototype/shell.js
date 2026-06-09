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
const RESTAURANT = { name: 'Pizza Hut', plan: 'Tier 2 · Pro', initials: 'PH', logo: 'assets/pizza-hut-logo.jpg' };

/* ---------- mock data (shared across pages) ---------- */
const CATEGORIES = ['Offers & Promotions', 'Classic Pizzas', 'Sides & Appetizers', 'Beverages'];
const MODIFIERS = ['Choose Size', 'Premium Addons', 'Remove Ingredients', 'Extra Cheese'];
const TYPE_LABEL = { variations: 'Variations', addons: 'Add-ons', removals: 'Removals' };
const MOD_GROUPS_SEED = [
  { name: 'Choose Size', type: 'variations', icon: 'ruler', opts: ['Small', 'Medium', 'Large'] },
  { name: 'Premium Addons', type: 'addons', icon: 'plus-circle', opts: ['Extra Cheese · +$2.00', 'Mushrooms · +$1.50', 'Pepperoni · +$2.00'] },
  { name: 'Remove Ingredients', type: 'removals', icon: 'minus-circle', opts: ['No Onion', 'No Garlic', 'No Olives'] },
  { name: 'Extra Cheese', type: 'addons', icon: 'plus-circle', opts: ['Single · +$1.50', 'Double · +$3.00'] },
];

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
  { id: '1042', channel: 'dinein', table: 'Table 4', customer: 'Table 4 · Indoor', guest: 'Nika Beridze', phone: '+995 595 11 24 88', email: 'nika.beridze@gmail.com', mins: 1, status: 'new',
    items: [['Pepperoni Feast', 1], ['Garlic Flatzz', 1], ['Coca-Cola', 2]], total: 23.80 },
  { id: '1041', channel: 'delivery', customer: 'Mara Ito', addr: '14 Vasil St · 2.1 km', phone: '+995 591 70 33 19', email: 'mara.ito@outlook.com', mins: 3, status: 'new',
    items: [['Korean BBQ Chicken', 1], ['Chicken Sticks', 1]], total: 26.10 },
  { id: '1040', channel: 'pickup', customer: 'James Okafor', phone: '+995 599 42 18 06', email: 'j.okafor@gmail.com', mins: 6, status: 'new',
    items: [['Cheese Pizza', 1], ['Still Water', 1]], total: 14.00 },
  { id: '1039', channel: 'delivery', customer: 'Lena Brandt', addr: '9 Rustaveli Ave · 3.4 km', phone: '+995 558 90 12 47', email: 'lena.brandt@gmail.com', mins: 11, status: 'progress',
    items: [['Vegetarian Supreme', 1], ['Coca-Cola', 1]], total: 17.30 },
  { id: '1038', channel: 'dinein', table: 'Table 2', customer: 'Table 2 · Bar Area', guest: 'Sandro Tabidze', phone: '+995 577 31 64 90', email: 'sandro.t@gmail.com', mins: 14, status: 'progress',
    items: [['Pepperoni Feast', 1], ['Cheese Pizza', 1]], total: 28.40 },
  { id: '1037', channel: 'pickup', customer: 'Sofia Renner', phone: '+995 595 83 27 51', email: 'sofia.renner@gmail.com', mins: 19, status: 'progress',
    items: [['Garlic Flatzz', 2]], total: 17.00 },
  { id: '1036', channel: 'delivery', customer: 'Dan Pekić', addr: '22 Marjanishvili · 1.6 km', phone: '+995 593 60 14 72', email: 'dan.pekic@gmail.com', mins: 24, status: 'ready',
    items: [['Korean BBQ Chicken', 1], ['Still Water', 2]], total: 19.90 },
  { id: '1035', channel: 'dinein', table: 'Table 1', customer: 'Table 1 · Indoor', guest: 'Tamar Lomidze', phone: '+995 599 05 88 36', email: 'tamar.lomidze@gmail.com', mins: 31, status: 'ready',
    items: [['Cheese Pizza', 2], ['Coca-Cola', 2]], total: 30.00 },
];
function loadOrders() {
  const saved = store.get('ordersV2', null);
  window.ORDERS_DATA = saved || ORDERS_SEED.map(o => ({ ...o }));
  return window.ORDERS_DATA;
}
function saveOrders() { store.set('ordersV2', window.ORDERS_DATA); }
loadOrders();

const CHANNEL = {
  delivery: { label: 'Delivery', icon: 'bike' },
  pickup:   { label: 'Pick-up', icon: 'shopping-bag' },
  dinein:   { label: 'Dine-in', icon: 'utensils' },
};
const STATUS = {
  new:      { label: 'New', dot: 'var(--neg)' },
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
    { id: 'categories', label: 'Categories', icon: 'layers', href: 'Categories.html' },
    { id: 'products', label: 'Products', icon: 'utensils-crossed', href: 'Products.html' },
    { id: 'addons', label: 'Add-ons', icon: 'plus-circle', href: 'Add-ons.html' },
  ]},
  { group: 'Store settings', items: [
    { id: 'hours', label: 'Opening hours', icon: 'clock', href: 'Opening hours.html' },
    { id: 'delivery', label: 'Delivery', icon: 'bike', href: 'Delivery.html' },
    { id: 'dinein', label: 'Dine-in', icon: 'armchair', href: 'Dine-in.html' },
    { id: 'pickup', label: 'Pick-up', icon: 'shopping-bag', href: 'Pick-up.html' },
  ]},
  { group: 'Account', items: [
    { id: 'profile', label: 'Store profile', icon: 'settings', href: 'Store profile.html' },
    { id: 'notif', label: 'Notifications', icon: 'bell', href: 'Notifications.html' },
  ]},
];

/* ---------- language flags (circular) ---------- */
const FLAGS = {
  en: { label: 'English', svg: '<svg viewBox="0 0 36 36"><rect width="36" height="36" fill="#012169"/><path d="M0,0 36,36 M36,0 0,36" stroke="#fff" stroke-width="7"/><path d="M0,0 36,36 M36,0 0,36" stroke="#C8102E" stroke-width="4"/><rect x="14" width="8" height="36" fill="#fff"/><rect y="14" width="36" height="8" fill="#fff"/><rect x="15.5" width="5" height="36" fill="#C8102E"/><rect y="15.5" width="36" height="5" fill="#C8102E"/></svg>' },
  ka: { label: 'ქართული · Georgian', svg: '<svg viewBox="0 0 36 36"><rect width="36" height="36" fill="#fff"/><rect x="15" width="6" height="36" fill="#ff0000"/><rect y="15" width="36" height="6" fill="#ff0000"/><g fill="#ff0000"><rect x="6" y="8" width="6" height="2"/><rect x="8" y="6" width="2" height="6"/><rect x="24" y="8" width="6" height="2"/><rect x="26" y="6" width="2" height="6"/><rect x="6" y="26" width="6" height="2"/><rect x="8" y="24" width="2" height="6"/><rect x="24" y="26" width="6" height="2"/><rect x="26" y="24" width="2" height="6"/></g></svg>' },
  ru: { label: 'Русский · Russian', svg: '<svg viewBox="0 0 36 36"><rect width="36" height="12" fill="#fff"/><rect y="12" width="36" height="12" fill="#0039A6"/><rect y="24" width="36" height="12" fill="#D52B1E"/></svg>' },
  es: { label: 'Español · Spanish', svg: '<svg viewBox="0 0 36 36"><rect width="36" height="36" fill="#AA151B"/><rect y="9" width="36" height="18" fill="#F1BF00"/></svg>' },
  fr: { label: 'Français · French', svg: '<svg viewBox="0 0 36 36"><rect width="12" height="36" fill="#0055A4"/><rect x="12" width="12" height="36" fill="#fff"/><rect x="24" width="12" height="36" fill="#EF4135"/></svg>' },
};
const flagCircle = (code) => `<span class="flag-circle">${FLAGS[code].svg}</span>`;

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
        <div class="avatar">${RESTAURANT.logo ? `<img src="${RESTAURANT.logo}" alt="${RESTAURANT.name}" />` : RESTAURANT.initials}</div>
        <div class="user-meta">
          <div class="user-name">${RESTAURANT.name}</div>
          <div class="user-sub">${RESTAURANT.plan}</div>
        </div>
        <i class="ic" data-lucide="chevrons-up-down" style="width:16px;height:16px;color:var(--ink-3);margin-left:auto"></i>
      </div>
    </div>`;

  const tb = $('#topbar');
  const crumbMap = { dashboard: 'Dashboard', orders: 'Live Orders', products: 'Products', categories: 'Categories', addons: 'Add-ons', hours: 'Opening hours', profile: 'Store profile', notif: 'Notifications', delivery: 'Delivery', pickup: 'Pick-up', dinein: 'Dine-in' };
  const lang = store.get('lang', 'en');
  tb.innerHTML = `
    <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Menu"><i class="ic" data-lucide="menu"></i></button>
    <div class="crumb"><i class="ic" data-lucide="store" style="width:15px;height:15px"></i> ${RESTAURANT.name} <span style="color:var(--line-strong)">/</span> <b>${crumbMap[active] || ''}</b></div>
    <div class="topbar-spacer"></div>
    <button class="btn btn-outline btn-sm" style="height:40px"><i class="ic" data-lucide="external-link"></i> ${RESTAURANT.name}</button>
    <button class="btn btn-outline btn-sm" id="supportBtn" style="height:40px"><i class="ic" data-lucide="life-buoy"></i> Contact support</button>
    <div class="lang-wrap">
      <button class="lang-btn" id="langBtn" aria-label="Language" title="Language">
        <i class="ic" data-lucide="chevron-down" style="width:16px;height:16px;color:var(--ink-2)"></i>
        <span id="langFlag">${flagCircle(lang)}</span>
      </button>
      <div class="lang-menu" id="langMenu">
        <div class="lang-menu-head">Language</div>
        ${Object.keys(FLAGS).map(code => `<button class="lang-opt ${code === lang ? 'active' : ''}" data-lang="${code}">${flagCircle(code)}<span>${FLAGS[code].label}</span><i class="ic check-ic" data-lucide="check"></i></button>`).join('')}
      </div>
    </div>`;

  if (window.lucide) lucide.createIcons();

  const mt = $('#menuToggle');
  if (mt) mt.addEventListener('click', () => sb.classList.toggle('open'));

  const langBtn = $('#langBtn');
  const langMenu = $('#langMenu');
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('open'); });
    langMenu.addEventListener('click', (e) => {
      const opt = e.target.closest('[data-lang]'); if (!opt) return;
      const code = opt.dataset.lang;
      store.set('lang', code);
      $('#langFlag').innerHTML = flagCircle(code);
      $$('#langMenu .lang-opt').forEach(o => o.classList.toggle('active', o === opt));
      langMenu.classList.remove('open');
      if (window.lucide) lucide.createIcons();
      toast(`${FLAGS[code].label.split(' · ')[0]} selected`, 'languages');
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) langMenu.classList.remove('open'); });
  }
  const supportBtn = $('#supportBtn');
  if (supportBtn) supportBtn.addEventListener('click', () => toast('Support team notified — we’ll be in touch shortly', 'life-buoy'));
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

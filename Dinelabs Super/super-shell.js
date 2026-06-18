/* ============================================================
   Dinelabs SUPER — internal portal: data, shell, modals, helpers
   ============================================================ */

/* ---------- tiny helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem('dls_' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('dls_' + k, JSON.stringify(v)); } catch {} }
};
const el = (tag, attrs = {}, children = []) => {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (Array.isArray(children) ? children : [children]).forEach(c => c && e.appendChild(c));
  return e;
};

/* ---------- date helpers (fixed "today") ---------- */
const NOW = new Date('2026-06-17T00:00:00');
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const iso = (d) => d.toISOString().slice(0, 10);
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate = (s) => { if (!s) return '—'; const d = new Date(s + 'T00:00:00'); return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };
const daysUntil = (s) => Math.round((new Date(s + 'T00:00:00') - NOW) / 86400000);

/* ---------- currencies ---------- */
const CURRENCIES = {
  USD: { sym: '$', name: 'US Dollar' }, EUR: { sym: '€', name: 'Euro' },
  GBP: { sym: '£', name: 'British Pound' }, GEL: { sym: '₾', name: 'Georgian Lari' },
  AED: { sym: 'د.إ', name: 'UAE Dirham' },
};
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const money = (n, cur = 'USD') => (CURRENCIES[cur]?.sym || '$') + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const moneyK = (n, cur = 'USD') => (CURRENCIES[cur]?.sym || '$') + (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : fmt(n));
const usd = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- billing cycles ---------- */
const CYCLES = {
  monthly: { label: 'Monthly', days: 30,  per: 'mo' },
  annual:  { label: 'Annual',  days: 365, per: 'yr' },
};
const cyclePer = (cycle) => CYCLES[cycle]?.per || 'mo';
function cycleAmount(tier, cycle) {
  if (!tier) return 0;
  if (cycle === 'annual') return tier.priceAnnual != null ? tier.priceAnnual : tier.price * 10;
  return tier.price;
}

/* ---------- accent palettes (switchable via Tweaks) ---------- */
const ACCENTS = {
  blue:  { name: 'Blue',  accent: '#0177FB', a2: '#0166d6', a3: '#0153b0', bg: '#e7f1ff', bg2: '#d3e5ff', line: '#bcd8ff' },
  red:   { name: 'Red',   accent: '#E63901', a2: '#c63001', a3: '#a32801', bg: '#fdebe4', bg2: '#fbd9cd', line: '#f7c6b5' },
  green: { name: 'Green', accent: '#2D9F63', a2: '#268653', a3: '#1f6e44', bg: '#e7f4ec', bg2: '#d4ecde', line: '#bfe2ce' },
  black: { name: 'Black', accent: '#1a1a1a', a2: '#000000', a3: '#000000', bg: '#f0f0f0', bg2: '#e6e6e6', line: '#d6d6d6' },
};
const ACCENT_KEY = 'superAccent';
function currentAccentKey() { const k = store.get(ACCENT_KEY, 'black'); return ACCENTS[k] ? k : 'black'; }
function applyAccent(key) {
  const a = ACCENTS[key] || ACCENTS.blue, r = document.documentElement.style;
  r.setProperty('--accent', a.accent);
  r.setProperty('--accent-2', a.a2);
  r.setProperty('--accent-3', a.a3);
  r.setProperty('--accent-bg', a.bg);
  r.setProperty('--accent-bg-2', a.bg2);
  r.setProperty('--accent-line', a.line);
}

/* ---------- operator (logged-in internal user) ---------- */
const OPERATOR = { name: 'Mariam Kapanadze', role: 'Operations · Super Admin', initials: 'MK' };

/* ---------- countries ---------- */
const COUNTRIES = ['Georgia', 'United Arab Emirates', 'United Kingdom', 'Germany', 'Spain', 'Italy', 'France', 'United States'];
const COUNTRY_CUR = { 'Georgia': 'GEL', 'United Arab Emirates': 'AED', 'United Kingdom': 'GBP', 'Germany': 'EUR', 'Spain': 'EUR', 'Italy': 'EUR', 'France': 'EUR', 'United States': 'USD' };

/* ---------- ordering modes & notification channels ---------- */
const MODES = {
  delivery: { label: 'Delivery', icon: 'bike' },
  pickup: { label: 'Pick-up', icon: 'shopping-bag' },
  dinein: { label: 'Dine-in', icon: 'utensils' },
};
const CHANNELS = {
  email: { label: 'Email', icon: 'mail' },
  whatsapp: { label: 'WhatsApp', icon: 'message-circle' },
  telegram: { label: 'Telegram', icon: 'send' },
};
const LANGS = { en: 'English', ka: 'Georgian', ru: 'Russian', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', ar: 'Arabic' };

/* features always included on every tier (cannot be turned off) */
const CORE_FEATURES = [
  { name: 'Live orders board', icon: 'receipt-text' },
  { name: 'Menu management', icon: 'utensils-crossed' },
];

/* ---------- tiers (capability model) ---------- */
const TIERS_SEED = [
  { id: 't1', name: 'Tier 1', tag: 'Starter', price: 29, priceAnnual: 290, lv: 1,
    caps: { maxProducts: 30, maxTranslations: 1, langs: ['en', 'ka', 'ru'],
            modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 } } },
  { id: 't2', name: 'Tier 2', tag: 'Pro', price: 79, priceAnnual: 790, lv: 2,
    caps: { maxProducts: 150, maxTranslations: 3, langs: ['en', 'ka', 'ru', 'es', 'fr', 'de', 'it'],
            modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 0 } } },
  { id: 't3', name: 'Tier 3', tag: 'Enterprise', price: 199, priceAnnual: 1990, lv: 3,
    caps: { maxProducts: 0, maxTranslations: 8, langs: ['en', 'ka', 'ru', 'es', 'fr', 'de', 'it', 'ar'],
            modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 1 } } },
];

/* ---------- stores (mock ~20) ---------- */
const CLIENTS_SEED = [
  { id: 'pizza-hut', name: 'Pizza Hut', tier: 't2', status: 'active', country: 'Georgia', cur: 'GEL', ordersToday: 184, rev: 3142, lastMin: 2, err: 0.4, products: 96, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['en', 'ka', 'ru'], def: 'en', email: 'manager@pizzahut.ge', pass: 'Ph7-Tbilisi!', created: 142 },
  { id: 'burger-palace', name: 'Burger Palace', tier: 't2', status: 'active', country: 'Georgia', cur: 'GEL', ordersToday: 96, rev: 1840, lastMin: 4, err: 0.9, products: 54, modes: { delivery: 1, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['en', 'ka'], def: 'ka', email: 'owner@burgerpalace.ge', pass: 'Bp4-Grill99', created: 88 },
  { id: 'sakura-sushi', name: 'Sakura Sushi', tier: 't3', status: 'active', country: 'United Arab Emirates', cur: 'AED', ordersToday: 213, rev: 9420, lastMin: 1, err: 0.2, products: 240, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 1 }, langs: ['en', 'ar'], def: 'en', email: 'admin@sakura.ae', pass: 'Sk3-Dubai$2', created: 210 },
  { id: 'taco-loco', name: 'Taco Loco', tier: 't1', status: 'active', country: 'Spain', cur: 'EUR', ordersToday: 41, rev: 720, lastMin: 12, err: 1.1, products: 22, modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['es'], def: 'es', email: 'hola@tacoloco.es', pass: 'Tl1-Madrid7', created: 54 },
  { id: 'the-green-bowl', name: 'The Green Bowl', tier: 't2', status: 'active', country: 'United Kingdom', cur: 'GBP', ordersToday: 73, rev: 1560, lastMin: 6, err: 0.6, products: 88, modes: { delivery: 1, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['en'], def: 'en', email: 'hello@greenbowl.co.uk', pass: 'Gb2-London5', created: 121 },
  { id: 'bella-napoli', name: 'Bella Napoli', tier: 't2', status: 'active', country: 'Italy', cur: 'EUR', ordersToday: 58, rev: 1290, lastMin: 9, err: 0.7, products: 110, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['it', 'en'], def: 'it', email: 'ciao@bellanapoli.it', pass: 'Bn2-Napoli3', created: 167 },
  { id: 'spice-route', name: 'Spice Route', tier: 't1', status: 'suspended', country: 'United Arab Emirates', cur: 'AED', ordersToday: 0, rev: 0, lastMin: 2880, err: 0, products: 28, modes: { delivery: 1, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['en', 'ar'], def: 'en', email: 'info@spiceroute.ae', pass: 'Sr1-Spice44', created: 73 },
  { id: 'le-petit-cafe', name: 'Le Petit Café', tier: 't1', status: 'active', country: 'France', cur: 'EUR', ordersToday: 34, rev: 540, lastMin: 18, err: 1.4, products: 19, modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['fr'], def: 'fr', email: 'bonjour@lepetitcafe.fr', pass: 'Lp1-Paris88', created: 39 },
  { id: 'dragon-wok', name: 'Dragon Wok', tier: 't2', status: 'active', country: 'Germany', cur: 'EUR', ordersToday: 88, rev: 1710, lastMin: 5, err: 2.6, products: 72, modes: { delivery: 1, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['de', 'en'], def: 'de', email: 'mail@dragonwok.de', pass: 'Dw2-Berlin6', created: 95 },
  { id: 'smash-grill', name: 'Smash & Grill', tier: 't3', status: 'active', country: 'United States', cur: 'USD', ordersToday: 264, rev: 7180, lastMin: 1, err: 0.3, products: 156, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 1 }, langs: ['en', 'es'], def: 'en', email: 'ops@smashandgrill.com', pass: 'Sg3-Austin$9', created: 198 },
  { id: 'falafel-house', name: 'Falafel House', tier: 't1', status: 'active', country: 'Georgia', cur: 'GEL', ordersToday: 47, rev: 610, lastMin: 14, err: 0.8, products: 24, modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['ka'], def: 'ka', email: 'hi@falafelhouse.ge', pass: 'Fh1-Falafel2', created: 61 },
  { id: 'khinkali-king', name: 'Khinkali King', tier: 't2', status: 'active', country: 'Georgia', cur: 'GEL', ordersToday: 129, rev: 2240, lastMin: 3, err: 0.5, products: 64, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['ka', 'en', 'ru'], def: 'ka', email: 'admin@khinkaliking.ge', pass: 'Kk2-Khinka7', created: 134 },
  { id: 'morning-brew', name: 'Morning Brew', tier: 't1', status: 'suspended', country: 'United Kingdom', cur: 'GBP', ordersToday: 0, rev: 0, lastMin: 6120, err: 0, products: 17, modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['en'], def: 'en', email: 'team@morningbrew.co.uk', pass: 'Mb1-Coffee3', created: 47 },
  { id: 'ocean-catch', name: 'Ocean Catch', tier: 't3', status: 'active', country: 'Spain', cur: 'EUR', ordersToday: 156, rev: 4630, lastMin: 2, err: 0.4, products: 132, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 1 }, langs: ['es', 'en'], def: 'es', email: 'reservas@oceancatch.es', pass: 'Oc3-Mares$8', created: 176 },
  { id: 'curry-leaf', name: 'Curry Leaf', tier: 't2', status: 'active', country: 'United Kingdom', cur: 'GBP', ordersToday: 81, rev: 1670, lastMin: 7, err: 3.4, products: 90, modes: { delivery: 1, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['en'], def: 'en', email: 'orders@curryleaf.co.uk', pass: 'Cl2-Curry55', created: 102 },
  { id: 'doner-hub', name: 'Döner Hub', tier: 't1', status: 'active', country: 'Germany', cur: 'EUR', ordersToday: 52, rev: 690, lastMin: 16, err: 1.0, products: 26, modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['de'], def: 'de', email: 'kontakt@donerhub.de', pass: 'Dh1-Doner12', created: 44 },
  { id: 'sweet-tooth', name: 'Sweet Tooth Bakery', tier: 't1', status: 'active', country: 'France', cur: 'EUR', ordersToday: 38, rev: 470, lastMin: 22, err: 0.6, products: 21, modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['fr'], def: 'fr', email: 'hello@sweettooth.fr', pass: 'St1-Sweet66', created: 31 },
  { id: 'nomad-kebab', name: 'Nomad Kebab', tier: 't2', status: 'active', country: 'United Arab Emirates', cur: 'AED', ordersToday: 112, rev: 2980, lastMin: 4, err: 0.7, products: 70, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['en', 'ar'], def: 'en', email: 'admin@nomadkebab.ae', pass: 'Nk2-Kebab$4', created: 119 },
  { id: 'pasta-fresca', name: 'Pasta Fresca', tier: 't2', status: 'suspended', country: 'Italy', cur: 'EUR', ordersToday: 0, rev: 0, lastMin: 4320, err: 0, products: 80, modes: { delivery: 1, pickup: 1, dinein: 1 }, channels: { email: 1, whatsapp: 1, telegram: 0 }, langs: ['it', 'en'], def: 'it', email: 'info@pastafresca.it', pass: 'Pf2-Pasta78', created: 84 },
  { id: 'cloud-nine', name: 'Cloud Nine Desserts', tier: 't1', status: 'active', country: 'Georgia', cur: 'GEL', ordersToday: 29, rev: 380, lastMin: 27, err: 1.2, products: 18, modes: { delivery: 0, pickup: 1, dinein: 0 }, channels: { email: 1, whatsapp: 0, telegram: 0 }, langs: ['ka'], def: 'ka', email: 'hello@cloudnine.ge', pass: 'Cn1-Cloud33', created: 36 },
];

/* renewal offsets (days from NOW) per seed index; suspended omitted, negative = overdue */
const RENEWAL_OFFSET = [12, 3, 26, 5, -8, 17, null, 9, 2, 34, -5, 4, null, 29, 7, 22, -2, 1, null, 38];
const ANNUAL_IDX = new Set([2, 9, 13]); // enterprise stores billed annually

function seedBilling(c, i) {
  const tier = TIERS_SEED.find(t => t.id === c.tier);
  const cycle = ANNUAL_IDX.has(i) ? 'annual' : 'monthly';
  const amount = cycleAmount(tier, cycle);
  const off = RENEWAL_OFFSET[i];
  let renewal, start;
  if (off == null) { // suspended — keep last known dates in the past-ish
    renewal = addDays(NOW, -4); start = addDays(renewal, -30);
  } else {
    renewal = addDays(NOW, off);
    start = addDays(renewal, -(CYCLES[cycle]?.days || 30));
  }
  return { cycle, amount, start: iso(start), renewal: iso(renewal) };
}

/* ---------- live data load/save ---------- */
const SEED_VERSION = 4;
function loadData() {
  const fresh = store.get('seedV', 0) !== SEED_VERSION;
  const savedTiers = store.get('tiers', null);
  const savedClients = store.get('clients', null);
  // schema guard: discard pre-billing / pre-caps data and bump on seed changes
  const tiersOk = !fresh && Array.isArray(savedTiers) && savedTiers.length && savedTiers[0].caps && savedTiers[0].priceAnnual != null;
  const clientsOk = !fresh && Array.isArray(savedClients) && savedClients.length && savedClients.every(c => c.billing && c.pass);
  window.TIERS = tiersOk ? savedTiers : TIERS_SEED.map(t => ({ ...t, caps: JSON.parse(JSON.stringify(t.caps)) }));
  window.CLIENTS = clientsOk ? savedClients : CLIENTS_SEED.map((c, i) => ({ ...c, billing: seedBilling(c, i) }));
  if (!tiersOk) saveTiers();
  if (!clientsOk) saveClients();
  if (fresh) store.set('seedV', SEED_VERSION);
  return window.CLIENTS;
}
function saveClients() { store.set('clients', window.CLIENTS); }
function saveTiers() { store.set('tiers', window.TIERS); }
loadData();
applyAccent(currentAccentKey());

/* ---------- lookups ---------- */
const getClient = (id) => window.CLIENTS.find(c => c.id === id);
const getTier = (id) => window.TIERS.find(t => t.id === id);
const initialsOf = (name) => name.split(/\s+/).filter(w => /[a-z]/i.test(w[0])).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
const productLimitLabel = (t) => t.caps.maxProducts === 0 ? 'Unlimited' : t.caps.maxProducts.toLocaleString('en-US');

/* ---------- billing helpers ---------- */
function billingState(c) {
  if (c.status === 'suspended') return { label: 'Paused', cls: 'paused', days: null, pending: 0, soon: false, overdue: false };
  const days = daysUntil(c.billing.renewal);
  const overdue = days < 0, soon = days >= 0 && days <= 7;
  return { label: overdue ? 'Overdue' : soon ? 'Due soon' : 'Active', cls: overdue ? 'overdue' : soon ? 'soon' : 'ok', days, pending: c.billing.amount, soon, overdue };
}

/* ---------- shared render snippets ---------- */
function tierPill(tierId) {
  const t = getTier(tierId); if (!t) return '';
  return `<span class="tier t${t.lv}"><span class="lv">${t.name}</span> · ${t.tag}</span>`;
}
function statusPill(status) {
  return status === 'active'
    ? `<span class="stat active"><span class="dot"></span>Active</span>`
    : `<span class="stat suspended"><span class="dot"></span>Suspended</span>`;
}
function modeIcons(c) {
  return `<span class="modes">${Object.keys(MODES).map(m =>
    `<span class="mode-ic ${c.modes[m] ? 'on' : ''}" title="${MODES[m].label}${c.modes[m] ? '' : ' (off)'}"><i class="ic" data-lucide="${MODES[m].icon}"></i></span>`).join('')}</span>`;
}
function errCell(c) {
  if (c.status === 'suspended') return `<span class="err"><span class="dot" style="background:var(--ink-3)"></span>—</span>`;
  const cls = c.err >= 2.5 ? 'bad' : c.err >= 1.5 ? 'warn' : 'ok';
  return `<span class="err ${cls}"><span class="dot"></span>${c.err.toFixed(1)}%</span>`;
}
function freshness(c) {
  if (c.status === 'suspended') return `<span class="fresh cold">—</span>`;
  const m = c.lastMin;
  const t = m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
  return `<span class="fresh ${m > 120 ? 'cold' : ''}">${t}</span>`;
}
function monogram(c, lg) {
  return `<span class="cmono ${lg ? 'lg' : ''}">${initialsOf(c.name)}</span>`;
}

/* ---------- nav ---------- */
const SNAV = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'Super Dashboard.html' },
  ]},
  { group: 'Stores', items: [
    { id: 'clients', label: 'Stores', icon: 'store', href: 'Super Clients.html' },
  ]},
  { group: 'Platform', items: [
    { id: 'tiers', label: 'Tiers', icon: 'layers', href: 'Super Tiers.html' },
    { id: 'billing', label: 'Billing', icon: 'credit-card', href: 'Super Billing.html' },
  ]},
];

/* ---------- shell ---------- */
function renderSuperShell(active) {
  const activeCount = window.CLIENTS.filter(c => c.status === 'active').length;
  const suspended = window.CLIENTS.length - activeCount;
  const sb = $('#sidebar');
  sb.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="assets/dinelabs-super-logo.svg" alt="Dinelabs Super" />
    </div>
    <nav class="nav">
      ${SNAV.map(g => `
        <div class="nav-group">
          <div class="nav-label">${g.group}</div>
          ${g.items.map(it => {
            const badge = it.id === 'clients' ? `<span class="badge" style="background:var(--ink-3)">${window.CLIENTS.length}</span>` : '';
            return `<a class="nav-item ${it.id === active ? 'active' : ''}" href="${it.href}"><i class="ic" data-lucide="${it.icon}"></i>${it.label}${badge}</a>`;
          }).join('')}
        </div>`).join('')}
    </nav>
    <div class="nav-foot">
      <div class="user-chip">
        <div class="avatar op"><i class="ic" data-lucide="shield" style="width:18px;height:18px"></i></div>
        <div class="user-meta">
          <div class="user-name">Super Admin</div>
          <div class="user-sub">Internal portal</div>
        </div>
      </div>
    </div>`;

  const crumbMap = { dashboard: 'Dashboard', clients: 'Stores', tiers: 'Tiers', billing: 'Billing', client: 'Store' };
  const tb = $('#topbar');
  tb.innerHTML = `
    <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Menu"><i class="ic" data-lucide="menu"></i></button>
    <div class="crumb"><i class="ic" data-lucide="shield" style="width:15px;height:15px"></i> Super Admin <span style="color:var(--line-strong)">/</span> <b>${crumbMap[active] || ''}</b></div>
    <div class="topbar-spacer"></div>
    <span class="internal-pill"><i class="ic" data-lucide="lock"></i> ${activeCount} active · ${suspended} suspended</span>
    <button class="btn btn-accent btn-sm" id="newClientBtn" style="height:40px"><i class="ic" data-lucide="plus"></i> New store</button>`;

  if (window.lucide) lucide.createIcons();
  const mt = $('#menuToggle'); if (mt) mt.addEventListener('click', () => sb.classList.toggle('open'));
  const nb = $('#newClientBtn'); if (nb) nb.addEventListener('click', openCreateModal);
  mountModalHost();
  mountAccentTweaks();
}

/* ============================================================
   Tweaks panel — accent color switcher (host-protocol aware)
   ============================================================ */
function mountAccentTweaks() {
  if ($('#twkPanel')) return;
  if (!$('#twkStyle')) {
    const st = document.createElement('style'); st.id = 'twkStyle';
    st.textContent = `
      .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:240px;
        background:rgba(250,250,249,.82);color:var(--ink);
        -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
        border:.5px solid rgba(255,255,255,.6);border-radius:14px;
        box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);overflow:hidden}
      .twk-hd{display:flex;align-items:center;justify-content:space-between;padding:11px 9px 11px 15px;cursor:move;user-select:none}
      .twk-hd b{font-size:12.5px;font-weight:800;letter-spacing:-.01em}
      .twk-x{border:0;background:transparent;color:var(--ink-3);width:24px;height:24px;border-radius:7px;font-size:13px;line-height:1;cursor:pointer}
      .twk-x:hover{background:rgba(0,0,0,.06);color:var(--ink)}
      .twk-body{padding:2px 15px 16px;display:flex;flex-direction:column;gap:9px}
      .twk-sect{font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)}
      .twk-sw-grid{display:flex;flex-direction:column;gap:7px}
      .twk-sw{display:flex;align-items:center;gap:10px;height:38px;padding:0 12px;border-radius:10px;
        border:1.5px solid var(--line-2);background:#fff;color:var(--ink-2);font:inherit;font-weight:700;font-size:13px;cursor:pointer;text-align:left}
      .twk-sw:hover{border-color:var(--line-strong)}
      .twk-sw .sw-dot{width:18px;height:18px;border-radius:6px;flex:none}
      .twk-sw .sw-hex{margin-left:auto;font-size:11.5px;font-weight:600;color:var(--ink-3);font-variant-numeric:tabular-nums}
      .twk-sw.on{border-color:var(--ink);background:var(--surface-2)}
      .twk-sw.on .sw-hex{color:var(--ink-2)}`;
    document.head.appendChild(st);
  }
  const panel = document.createElement('div');
  panel.id = 'twkPanel'; panel.className = 'twk-panel'; panel.style.display = 'none';
  panel.innerHTML = `
    <div class="twk-hd" id="twkHd"><b>Tweaks</b><button class="twk-x" id="twkClose" aria-label="Close">✕</button></div>
    <div class="twk-body">
      <div class="twk-sect">Accent color</div>
      <div class="twk-sw-grid" id="twkAccent">
        ${Object.entries(ACCENTS).map(([k, a]) => `<button class="twk-sw ${k === currentAccentKey() ? 'on' : ''}" data-acc="${k}"><span class="sw-dot" style="background:${a.accent}"></span>${a.name}<span class="sw-hex">${a.accent}</span></button>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(panel);

  $('#twkClose').addEventListener('click', () => { panel.style.display = 'none'; window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); });
  $$('#twkAccent .twk-sw').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.acc; store.set(ACCENT_KEY, k); applyAccent(k);
    $$('#twkAccent .twk-sw').forEach(x => x.classList.toggle('on', x === b));
    document.dispatchEvent(new CustomEvent('accentchange', { detail: k }));
  }));

  // simple drag
  const hd = $('#twkHd'); let sx, sy, ox, oy, drag = false;
  hd.addEventListener('mousedown', e => { if (e.target.id === 'twkClose') return; drag = true; sx = e.clientX; sy = e.clientY; const r = panel.getBoundingClientRect(); ox = r.left; oy = r.top; e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (!drag) return; panel.style.left = (ox + e.clientX - sx) + 'px'; panel.style.top = (oy + e.clientY - sy) + 'px'; panel.style.right = 'auto'; panel.style.bottom = 'auto'; });
  window.addEventListener('mouseup', () => { drag = false; });

  window.addEventListener('message', (e) => {
    const t = e?.data?.type;
    if (t === '__activate_edit_mode') panel.style.display = 'block';
    else if (t === '__deactivate_edit_mode') panel.style.display = 'none';
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
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

/* ============================================================
   Modal host
   ============================================================ */
function mountModalHost() {
  if ($('#modalScrim')) return;
  const scrim = document.createElement('div');
  scrim.className = 'modal-scrim'; scrim.id = 'modalScrim';
  const modal = document.createElement('div');
  modal.className = 'modal'; modal.id = 'modalHost';
  modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
  document.body.appendChild(scrim);
  document.body.appendChild(modal);
  scrim.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && scrim.classList.contains('open')) closeModal(); });
}
function openModal(html) {
  mountModalHost();
  const modal = $('#modalHost');
  modal.innerHTML = html;
  if (window.lucide) lucide.createIcons();
  $('#modalScrim').classList.add('open');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  $$('[data-close]', modal).forEach(b => b.addEventListener('click', closeModal));
}
function closeModal() {
  const scrim = $('#modalScrim'), modal = $('#modalHost');
  if (!scrim || !modal) return;
  scrim.classList.remove('open'); modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   Create-store modal (tier-aware)
   ============================================================ */
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const genPassword = () => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ', b = 'abcdefghijkmnpqrstuvwxyz', n = '23456789', s = '!@#$';
  const pick = (p) => p[Math.floor(Math.random() * p.length)];
  let p = pick(a) + pick(b) + pick(b) + pick(b) + pick(n) + pick(n) + pick(s) + pick(b) + pick(n);
  return p.split('').sort(() => Math.random() - .5).join('');
};

function openCreateModal() {
  const tierOpts = window.TIERS.map((t, i) => `
    <div class="tp ${i === 0 ? 'on' : ''}" data-tier="${t.id}">
      <div class="tp-name">${t.name}</div>
      <div class="tp-price">${money(t.price)}/mo · ${t.tag}</div>
      <div class="tp-feats">${productLimitLabel(t)} products · ${t.caps.maxTranslations} lang${t.caps.maxTranslations > 1 ? 's' : ''}</div>
    </div>`).join('');

  openModal(`
  <div class="modal-card is-form is-wide" style="flex-direction:column;max-height:calc(100vh - 48px)">
    <button class="modal-x" data-close aria-label="Close"><i class="ic" data-lucide="x"></i></button>
    <div class="modal-head">
      <div class="modal-icon" style="background:var(--accent)"><i class="ic" data-lucide="store"></i></div>
      <div><h3>Create a new store</h3><p>Provision a tenant environment, storefront and Manager login.</p></div>
    </div>
    <div class="modal-body" id="createBody">
      <form id="createForm" novalidate>

        <div class="form-sec">
          <div class="form-sec-head"><span class="fs-ic"><i class="ic" data-lucide="store"></i></span><div><div class="fs-t">Store</div><div class="fs-s">Public identity & storefront URL</div></div></div>
          <div class="field">
            <label class="label" for="cName">Store name</label>
            <input class="input" id="cName" placeholder="e.g. Burger Palace" autocomplete="off" />
          </div>
          <div class="field" style="margin-bottom:4px">
            <label class="label">Storefront URL <span class="opt">— auto-filled from the name</span></label>
            <div class="slug-field"><span class="pfx">dinelabs.co/</span><input id="cSlug" placeholder="burger-palace" autocomplete="off" /></div>
          </div>
        </div>

        <div class="form-sec">
          <div class="form-sec-head"><span class="fs-ic"><i class="ic" data-lucide="key-round"></i></span><div><div class="fs-t">Manager credentials</div><div class="fs-s">Initial login for Dinelabs Manager</div></div></div>
          <div class="field-row">
            <div class="field"><label class="label" for="cEmail">Manager email</label><input class="input" id="cEmail" type="email" placeholder="owner@store.com" autocomplete="off" /></div>
            <div class="field"><label class="label" for="cPass">Temporary password</label>
              <div class="pw-field"><input class="input" id="cPass" value="${genPassword()}" /><button type="button" class="pw-gen" id="cPassGen"><i class="ic" data-lucide="refresh-cw"></i>New</button></div>
            </div>
          </div>
        </div>

        <div class="form-sec">
          <div class="form-sec-head"><span class="fs-ic"><i class="ic" data-lucide="layers"></i></span><div><div class="fs-t">Plan</div><div class="fs-s">Tier sets the limits & available channels</div></div></div>
          <div class="tier-pick" id="cTiers">${tierOpts}</div>
        </div>

        <div class="form-sec">
          <div class="form-sec-head"><span class="fs-ic"><i class="ic" data-lucide="credit-card"></i></span><div><div class="fs-t">Billing</div><div class="fs-s">What this store pays</div></div></div>
          <div class="field">
            <label class="label">Billing cycle</label>
            <div class="chip-grid" id="cCycle">
              <div class="sel-chip radio on" data-cycle="monthly">Monthly</div>
              <div class="sel-chip radio" data-cycle="annual">Annual</div>
            </div>
          </div>
          <div class="field">
            <label class="label">Free trial <span class="opt">— optional</span></label>
            <div class="chip-grid" id="cTrial">
              <div class="sel-chip" data-trial="on"><span class="chk"><i class="ic" data-lucide="check"></i></span>14-day free trial</div>
            </div>
            <div class="card-note" style="margin-top:8px;display:flex;align-items:center;gap:7px"><i class="ic" data-lucide="gift" style="width:14px;height:14px"></i>Works with any cycle — first charge is delayed 14 days.</div>
          </div>
          <div class="field-row">
            <div class="field"><label class="label" for="cAmount">Amount</label><div class="input-affix"><span class="pfx">$</span><input class="input" id="cAmount" type="number" min="0" step="1" /></div></div>
            <div class="field"><label class="label" for="cStart">Subscription start</label><input class="input" id="cStart" type="date" value="${iso(NOW)}" /></div>
          </div>
          <div class="card-note" style="display:flex;align-items:center;gap:7px"><i class="ic" data-lucide="calendar-clock" style="width:14px;height:14px"></i>Renews <b id="cRenewPreview" style="color:var(--ink);margin:0 3px">—</b> · editable later from Billing</div>
        </div>

        <div class="form-sec">
          <div class="form-sec-head"><span class="fs-ic"><i class="ic" data-lucide="globe"></i></span><div><div class="fs-t">Locale</div><div class="fs-s">Country, currency & storefront languages</div></div></div>
          <div class="field-row">
            <div class="field"><label class="label" for="cCountry">Country</label>
              <select class="select" id="cCountry">${COUNTRIES.map(c => `<option ${c === 'Georgia' ? 'selected' : ''}>${c}</option>`).join('')}</select>
            </div>
            <div class="field"><label class="label" for="cCur">Base currency</label>
              <select class="select" id="cCur">${Object.keys(CURRENCIES).map(c => `<option value="${c}" ${c === 'GEL' ? 'selected' : ''}>${c} · ${CURRENCIES[c].sym} ${CURRENCIES[c].name}</option>`).join('')}</select>
            </div>
          </div>
          <div class="field">
            <label class="label">Storefront languages <span class="opt" id="cLangHint"></span></label>
            <div class="chip-grid" id="cLangs"></div>
          </div>
          <div class="field" style="margin-bottom:4px">
            <label class="label">Default language</label>
            <div class="chip-grid" id="cDef"></div>
          </div>
        </div>

        <div class="form-sec">
          <div class="form-sec-head"><span class="fs-ic"><i class="ic" data-lucide="sliders-horizontal"></i></span><div><div class="fs-t">Ordering modes</div><div class="fs-s" id="cModesHint">Allowed by the selected tier</div></div></div>
          <div class="chip-grid" id="cModes"></div>
        </div>

        <div class="form-sec">
          <div class="form-sec-head"><span class="fs-ic"><i class="ic" data-lucide="bell"></i></span><div><div class="fs-t">Order channels</div><div class="fs-s" id="cChHint">Where order alerts are delivered</div></div></div>
          <div class="chip-grid" id="cChannels"></div>
        </div>

      </form>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-close type="button">Cancel</button>
      <button class="btn btn-accent" id="createSubmit" type="button"><i class="ic" data-lucide="circle-plus"></i>Create store</button>
    </div>
  </div>`);

  wireCreateForm();
}

function wireCreateForm() {
  const nameEl = $('#cName'), slugEl = $('#cSlug');
  let slugTouched = false;
  nameEl.addEventListener('input', () => { if (!slugTouched) slugEl.value = slugify(nameEl.value); });
  slugEl.addEventListener('input', () => { slugTouched = true; slugEl.value = slugify(slugEl.value); });
  $('#cPassGen').addEventListener('click', () => { $('#cPass').value = genPassword(); });
  $('#cCountry').addEventListener('change', (e) => { const cur = COUNTRY_CUR[e.target.value]; if (cur) $('#cCur').value = cur; });

  const selectedTier = () => getTier($('#cTiers .tp.on')?.dataset.tier || window.TIERS[0].id);
  const selectedCycle = () => $('#cCycle .sel-chip.on')?.dataset.cycle || 'monthly';

  const updateBilling = () => {
    const t = selectedTier(), cycle = selectedCycle();
    $('#cAmount').value = cycleAmount(t, cycle);
    updateRenewPreview();
  };
  const updateRenewPreview = () => {
    const start = $('#cStart').value || iso(NOW);
    const trial = !!$('#cTrial .sel-chip.on');
    const days = trial ? 14 : (CYCLES[selectedCycle()]?.days || 30);
    const renewal = addDays(new Date(start + 'T00:00:00'), days);
    $('#cRenewPreview').textContent = fmtDate(iso(renewal)) + (trial ? ' · trial ends' : '');
  };
  $('#cStart').addEventListener('change', updateRenewPreview);
  $$('#cTrial .sel-chip').forEach(ch => ch.addEventListener('click', () => { ch.classList.toggle('on'); updateRenewPreview(); }));

  // tier-aware locale/modes/channels
  const rebuildForTier = () => {
    const t = selectedTier(), caps = t.caps;
    $('#cLangHint').textContent = `— up to ${caps.maxTranslations} on this tier`;
    // languages limited to tier's available pool
    const langWrap = $('#cLangs');
    const prevSel = $$('#cLangs .lang-chip.on').map(c => c.dataset.lang).filter(l => caps.langs.includes(l));
    let sel = prevSel.length ? prevSel : (caps.langs.includes('en') ? ['en'] : [caps.langs[0]]);
    sel = sel.slice(0, caps.maxTranslations);
    langWrap.innerHTML = caps.langs.map(code =>
      `<div class="sel-chip lang-chip ${sel.includes(code) ? 'on' : ''}" data-lang="${code}"><span class="chk"><i class="ic" data-lucide="check"></i></span>${LANGS[code]}</div>`).join('');
    $$('#cLangs .lang-chip').forEach(c => c.addEventListener('click', () => {
      const on = c.classList.contains('on');
      if (!on && $$('#cLangs .lang-chip.on').length >= caps.maxTranslations) { toast(`${t.name} allows up to ${caps.maxTranslations} language${caps.maxTranslations > 1 ? 's' : ''}`, 'languages'); return; }
      c.classList.toggle('on'); rebuildDefault();
    }));
    // modes — only those the tier allows
    const allowedModes = Object.keys(MODES).filter(m => caps.modes[m]);
    $('#cModes').innerHTML = allowedModes.length ? allowedModes.map((m, i) => `<div class="sel-chip mode-chip on" data-mode="${m}"><span class="chk"><i class="ic" data-lucide="check"></i></span><i class="ic" data-lucide="${MODES[m].icon}"></i>${MODES[m].label}</div>`).join('') : '<span class="mut3" style="font-size:13px">No ordering modes on this tier</span>';
    $$('#cModes .mode-chip').forEach(c => c.addEventListener('click', () => c.classList.toggle('on')));
    // channels — only those allowed
    const allowedCh = Object.keys(CHANNELS).filter(ch => caps.channels[ch]);
    $('#cChannels').innerHTML = allowedCh.map((ch, i) => `<div class="sel-chip ch-chip ${i === 0 ? 'on' : ''}" data-ch="${ch}"><span class="chk"><i class="ic" data-lucide="check"></i></span><i class="ic" data-lucide="${CHANNELS[ch].icon}"></i>${CHANNELS[ch].label}</div>`).join('');
    $$('#cChannels .ch-chip').forEach(c => c.addEventListener('click', () => c.classList.toggle('on')));
    rebuildDefault();
    if (window.lucide) lucide.createIcons();
  };
  const rebuildDefault = () => {
    const sel = $$('#cLangs .lang-chip.on').map(c => c.dataset.lang);
    const defWrap = $('#cDef');
    if (!sel.length) { defWrap.innerHTML = `<span class="mut3" style="font-size:13px">Select at least one language above</span>`; return; }
    const cur = $('#cDef .sel-chip.on')?.dataset.lang;
    const def = sel.includes(cur) ? cur : sel[0];
    defWrap.innerHTML = sel.map(code => `<div class="sel-chip radio def-chip ${code === def ? 'on' : ''}" data-lang="${code}">${LANGS[code]}</div>`).join('');
    $$('#cDef .def-chip').forEach(c => c.addEventListener('click', () => { $$('#cDef .def-chip').forEach(x => x.classList.toggle('on', x === c)); }));
  };

  $$('#cTiers .tp').forEach(tp => tp.addEventListener('click', () => {
    $$('#cTiers .tp').forEach(x => x.classList.toggle('on', x === tp));
    updateBilling(); rebuildForTier();
  }));
  $$('#cCycle .sel-chip').forEach(ch => ch.addEventListener('click', () => { $$('#cCycle .sel-chip').forEach(x => x.classList.toggle('on', x === ch)); updateBilling(); }));

  updateBilling();
  rebuildForTier();
  $('#createSubmit').addEventListener('click', submitCreate);
}

function submitCreate() {
  const name = $('#cName').value.trim();
  const slug = $('#cSlug').value.trim();
  const email = $('#cEmail').value.trim();
  const tier = $('#cTiers .tp.on')?.dataset.tier || 't1';
  const langs = $$('#cLangs .lang-chip.on').map(c => c.dataset.lang);
  const def = $('#cDef .def-chip.on')?.dataset.lang || langs[0];

  let ok = true;
  const flag = (e, bad) => { e.style.borderColor = bad ? 'var(--neg)' : ''; if (bad) ok = false; };
  flag($('#cName'), !name);
  $('#cSlug').closest('.slug-field').style.borderColor = slug ? '' : 'var(--neg)'; if (!slug) ok = false;
  flag($('#cEmail'), !email || !/.+@.+\..+/.test(email));
  if (!langs.length) { ok = false; toast('Pick at least one storefront language', 'languages'); }
  if (!ok) { toast('Please complete the highlighted fields', 'alert-circle'); return; }
  if (window.CLIENTS.some(c => c.id === slug)) { toast('That storefront URL is already taken', 'alert-circle'); $('#cSlug').closest('.slug-field').style.borderColor = 'var(--neg)'; return; }

  const modes = {}; Object.keys(MODES).forEach(m => { const ch = $(`#cModes .mode-chip[data-mode="${m}"]`); modes[m] = ch && ch.classList.contains('on') ? 1 : 0; });
  const channels = {}; Object.keys(CHANNELS).forEach(c => { const ch = $(`#cChannels .ch-chip[data-ch="${c}"]`); channels[c] = ch && ch.classList.contains('on') ? 1 : 0; });

  const cycle = $('#cCycle .sel-chip.on').dataset.cycle;
  const amount = +$('#cAmount').value || 0;
  const start = $('#cStart').value || iso(NOW);
  const trial = !!$('#cTrial .sel-chip.on');
  const renewal = iso(addDays(new Date(start + 'T00:00:00'), trial ? 14 : (CYCLES[cycle]?.days || 30)));

  const client = {
    id: slug, name, tier, status: 'active',
    country: $('#cCountry').value, cur: $('#cCur').value,
    ordersToday: 0, rev: 0, lastMin: 0, err: 0, products: 0,
    modes, channels, langs, def, email, pass: $('#cPass').value,
    billing: { cycle, amount, start, renewal, trial }, created: 0, isNew: true,
  };
  window.CLIENTS.unshift(client);
  saveClients();
  closeModal();
  toast(`${name} created · storefront live at dinelabs.co/${slug}`, 'party-popper');
  setTimeout(() => { window.location.href = 'Super Client.html?id=' + encodeURIComponent(slug); }, 700);
}

/* ============================================================
   Password — view & change
   ============================================================ */
function openPasswordModal(id, onDone) {
  const c = getClient(id); if (!c) return;
  openModal(`
  <div class="modal-card" style="max-width:480px">
    <button class="modal-x" data-close aria-label="Close"><i class="ic" data-lucide="x"></i></button>
    <div class="modal-head">
      <div class="modal-icon" style="background:var(--accent)"><i class="ic" data-lucide="key-round"></i></div>
      <div><h3>Manager password</h3><p>For ${c.name}'s Dinelabs Manager login.</p></div>
    </div>
    <div class="modal-body" style="padding-bottom:8px">
      <div class="field"><label class="label">Manager email</label><input class="input" value="${c.email}" readonly style="background:var(--surface-2)" /></div>
      <div class="field" style="margin-bottom:6px">
        <label class="label" for="pwVal">Password</label>
        <div class="pw-field"><input class="input" id="pwVal" value="${c.pass || ''}" /><button type="button" class="pw-gen" id="pwGen"><i class="ic" data-lucide="refresh-cw"></i>New</button></div>
      </div>
      <div class="masq-warn"><i class="ic" data-lucide="info"></i><span>Editing here sets a new password immediately. Share it with the store securely — they can change it later in Manager.</span></div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-close type="button">Cancel</button>
      <button class="btn btn-accent" id="pwSave" type="button"><i class="ic" data-lucide="check"></i>Save password</button>
    </div>
  </div>`);
  $('#pwGen').addEventListener('click', () => { $('#pwVal').value = genPassword(); });
  $('#pwSave').addEventListener('click', () => {
    const v = $('#pwVal').value.trim();
    if (v.length < 6) { $('#pwVal').style.borderColor = 'var(--neg)'; toast('Password must be at least 6 characters', 'alert-circle'); return; }
    c.pass = v; saveClients(); closeModal(); toast(`Password updated for ${c.name}`, 'key-round'); onDone && onDone();
  });
}

/* ============================================================
   Masquerade
   ============================================================ */
function openMasquerade(id) {
  const c = getClient(id); if (!c) return;
  if (c.status === 'suspended') { toast('Reactivate this store before masquerading', 'alert-circle'); return; }
  openModal(`
  <div class="modal-card" style="max-width:480px">
    <button class="modal-x" data-close aria-label="Close"><i class="ic" data-lucide="x"></i></button>
    <div class="modal-head">
      <div class="modal-icon masq-icon"><i class="ic" data-lucide="user-round-cog"></i></div>
      <div><h3>Masquerade as ${c.name}</h3><p>Open their Dinelabs Manager exactly as the store sees it.</p></div>
    </div>
    <div class="modal-body" style="padding-bottom:8px">
      <div class="masq-row">
        ${monogram(c)}
        <div style="flex:1;min-width:0"><div class="cname">${c.name}</div><div class="cslug">dinelabs.co/<b>${c.id}</b></div></div>
        ${tierPill(c.tier)}
      </div>
      <div class="masq-warn"><i class="ic" data-lucide="shield-alert"></i><span>You'll be acting <b>on behalf of this store</b>. Actions are logged to the audit trail. You can exit masquerade at any time.</span></div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-close type="button">Cancel</button>
      <button class="btn btn-accent" id="masqGo" type="button"><i class="ic" data-lucide="log-in"></i>Enter Manager</button>
    </div>
  </div>`);
  $('#masqGo').addEventListener('click', () => {
    store.set('masq', { id: c.id, name: c.name });
    closeModal();
    toast(`Masquerade session started for ${c.name} — opens the tenant Manager app`, 'user-round-cog');
  });
}

/* ============================================================
   Suspend / activate
   ============================================================ */
function toggleSuspend(id, onDone) {
  const c = getClient(id); if (!c) return;
  const suspending = c.status === 'active';
  if (suspending) {
    openModal(`
    <div class="modal-card" style="max-width:460px">
      <button class="modal-x" data-close aria-label="Close"><i class="ic" data-lucide="x"></i></button>
      <div class="modal-head">
        <div class="modal-icon" style="background:var(--neg)"><i class="ic" data-lucide="pause"></i></div>
        <div><h3>Suspend ${c.name}?</h3><p>Ordering stops immediately on their storefront.</p></div>
      </div>
      <div class="modal-body" style="padding-bottom:8px">
        <div class="masq-warn" style="background:var(--neg-bg);color:#9b3b40"><i class="ic" data-lucide="info"></i><span>Customers will see a <b>"temporarily unavailable"</b> notice. No new orders are accepted. Menu, settings and data are kept safe and restored on reactivation. A suspended store can then be permanently deleted.</span></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-close type="button">Keep active</button>
        <button class="btn btn-danger" id="suspGo" type="button"><i class="ic" data-lucide="pause"></i>Suspend store</button>
      </div>
    </div>`);
    $('#suspGo').addEventListener('click', () => {
      c.status = 'suspended'; c.ordersToday = 0; c.rev = 0; saveClients();
      closeModal(); toast(`${c.name} suspended`, 'pause'); onDone && onDone();
    });
  } else {
    c.status = 'active'; saveClients();
    toast(`${c.name} reactivated`, 'play'); onDone && onDone();
  }
}

/* ============================================================
   Delete (only after suspended)
   ============================================================ */
function deleteClient(id, onDone) {
  const c = getClient(id); if (!c) return;
  if (c.status !== 'suspended') { toast('Suspend the store before deleting it', 'alert-circle'); return; }
  openModal(`
  <div class="modal-card" style="max-width:470px">
    <button class="modal-x" data-close aria-label="Close"><i class="ic" data-lucide="x"></i></button>
    <div class="modal-head">
      <div class="modal-icon" style="background:var(--neg)"><i class="ic" data-lucide="trash-2"></i></div>
      <div><h3>Delete ${c.name}?</h3><p>This permanently removes the tenant and all its data.</p></div>
    </div>
    <div class="modal-body" style="padding-bottom:8px">
      <div class="masq-warn" style="background:var(--neg-bg);color:#9b3b40"><i class="ic" data-lucide="alert-triangle"></i><span>This <b>cannot be undone</b>. The storefront, menu, orders and billing history for <b>dinelabs.co/${c.id}</b> will be erased.</span></div>
      <div class="field" style="margin-top:14px;margin-bottom:2px">
        <label class="label" for="delConfirm">Type <b>${c.id}</b> to confirm</label>
        <input class="input" id="delConfirm" placeholder="${c.id}" autocomplete="off" />
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-close type="button">Cancel</button>
      <button class="btn btn-danger" id="delGo" type="button" disabled style="opacity:.5"><i class="ic" data-lucide="trash-2"></i>Delete permanently</button>
    </div>
  </div>`);
  const inp = $('#delConfirm'), go = $('#delGo');
  inp.addEventListener('input', () => { const ok = inp.value.trim() === c.id; go.disabled = !ok; go.style.opacity = ok ? '1' : '.5'; });
  go.addEventListener('click', () => {
    if (inp.value.trim() !== c.id) return;
    window.CLIENTS = window.CLIENTS.filter(x => x.id !== id); saveClients();
    closeModal(); toast(`${c.name} deleted`, 'trash-2');
    if (onDone) onDone(); else setTimeout(() => { window.location.href = 'Super Clients.html'; }, 500);
  });
}

/* ============================================================
   Edit subscription dates / amount (used by Billing page)
   ============================================================ */
function openBillingEdit(id, onDone) {
  const c = getClient(id); if (!c) return;
  const b = c.billing;
  openModal(`
  <div class="modal-card" style="max-width:480px">
    <button class="modal-x" data-close aria-label="Close"><i class="ic" data-lucide="x"></i></button>
    <div class="modal-head">
      <div class="modal-icon" style="background:var(--accent)"><i class="ic" data-lucide="calendar-cog"></i></div>
      <div><h3>Edit subscription</h3><p>${c.name} · dinelabs.co/${c.id}</p></div>
    </div>
    <div class="modal-body" style="padding-bottom:8px">
      <div class="field"><label class="label">Billing cycle</label>
        <div class="chip-grid" id="bCycle">
          <div class="sel-chip radio ${b.cycle === 'monthly' ? 'on' : ''}" data-cycle="monthly">Monthly</div>
          <div class="sel-chip radio ${b.cycle === 'annual' ? 'on' : ''}" data-cycle="annual">Annual</div>
        </div>
      </div>
      <div class="field"><label class="label" for="bAmount">Amount per period</label><div class="input-affix"><span class="pfx">$</span><input class="input" id="bAmount" type="number" min="0" step="1" value="${b.amount}" /></div></div>
      <div class="field-row">
        <div class="field"><label class="label" for="bStart">Start date</label><input class="input" id="bStart" type="date" value="${b.start}" /></div>
        <div class="field"><label class="label" for="bRenew">Renewal date</label><input class="input" id="bRenew" type="date" value="${b.renewal}" /></div>
      </div>
      <div class="card-note" style="display:flex;align-items:center;gap:7px"><i class="ic" data-lucide="info" style="width:14px;height:14px"></i>Set renewal manually, or use the cycle to recompute it from the start date.</div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" id="bRecompute" type="button"><i class="ic" data-lucide="wand-2"></i>Recompute renewal</button>
      <div style="flex:1"></div>
      <button class="btn btn-ghost" data-close type="button">Cancel</button>
      <button class="btn btn-accent" id="bSave" type="button"><i class="ic" data-lucide="check"></i>Save</button>
    </div>
  </div>`);
  $$('#bCycle .sel-chip').forEach(ch => ch.addEventListener('click', () => $$('#bCycle .sel-chip').forEach(x => x.classList.toggle('on', x === ch))));
  $('#bRecompute').addEventListener('click', () => {
    const cycle = $('#bCycle .sel-chip.on').dataset.cycle;
    const start = $('#bStart').value || iso(NOW);
    $('#bRenew').value = iso(addDays(new Date(start + 'T00:00:00'), CYCLES[cycle]?.days || 30));
    toast('Renewal recomputed', 'wand-2');
  });
  $('#bSave').addEventListener('click', () => {
    c.billing = { ...c.billing, cycle: $('#bCycle .sel-chip.on').dataset.cycle, amount: +$('#bAmount').value || 0, start: $('#bStart').value, renewal: $('#bRenew').value };
    saveClients(); closeModal(); toast(`Subscription updated for ${c.name}`, 'calendar-check'); onDone && onDone();
  });
}

/* expose */
Object.assign(window, {
  $, $$, store, el, NOW, addDays, iso, fmtDate, daysUntil,
  money, moneyK, usd, fmt, CURRENCIES, COUNTRIES, COUNTRY_CUR, MODES, CHANNELS, LANGS, CORE_FEATURES, OPERATOR,
  CYCLES, cyclePer, cycleAmount, ACCENTS, applyAccent, currentAccentKey,
  loadData, saveClients, saveTiers, getClient, getTier, initialsOf, productLimitLabel, billingState,
  tierPill, statusPill, modeIcons, errCell, freshness, monogram,
  renderSuperShell, toast, openModal, closeModal, openCreateModal, openMasquerade, toggleSuspend, deleteClient,
  openPasswordModal, openBillingEdit, slugify, genPassword,
});

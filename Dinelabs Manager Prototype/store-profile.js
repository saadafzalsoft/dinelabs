/* ===================== STORE PROFILE PAGE ===================== */
renderShell('profile');

/* ---------- option data ---------- */
const COUNTRIES = [
  { code: 'GE', name: 'Georgia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PL', name: 'Poland' },
  { code: 'TR', name: 'Türkiye' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'RU', name: 'Russia' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'IN', name: 'India' },
  { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' },
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',        sym: '$'   },
  { code: 'EUR', name: 'Euro',             sym: '€'   },
  { code: 'GBP', name: 'British Pound',    sym: '£'   },
  { code: 'GEL', name: 'Georgian Lari',    sym: '₾'   },
  { code: 'TRY', name: 'Turkish Lira',     sym: '₺'   },
  { code: 'AED', name: 'UAE Dirham',       sym: 'AED' },
  { code: 'SAR', name: 'Saudi Riyal',      sym: 'SAR' },
  { code: 'RUB', name: 'Russian Ruble',    sym: '₽'   },
  { code: 'UAH', name: 'Ukrainian Hryvnia',sym: '₴'   },
  { code: 'INR', name: 'Indian Rupee',     sym: '₹'   },
  { code: 'JPY', name: 'Japanese Yen',     sym: '¥'   },
  { code: 'PLN', name: 'Polish Złoty',     sym: 'zł'  },
  { code: 'AUD', name: 'Australian Dollar',sym: 'A$'  },
  { code: 'CAD', name: 'Canadian Dollar',  sym: 'C$'  },
  { code: 'BRL', name: 'Brazilian Real',   sym: 'R$'  },
  { code: 'MXN', name: 'Mexican Peso',     sym: 'MX$' },
  { code: 'SGD', name: 'Singapore Dollar', sym: 'S$'  },
];

const SOCIALS = [
  { key: 'website',   label: 'Website',   icon: 'globe',     pfx: 'https://', pad: 60, ph: 'pizzahut.ge' },
  { key: 'instagram', label: 'Instagram', icon: 'camera',    pfx: '@',        pad: 24, ph: 'pizzahut' },
  { key: 'facebook',  label: 'Facebook',  icon: 'thumbs-up', pfx: 'fb.com/',  pad: 60, ph: 'pizzahut' },
  { key: 'tiktok',    label: 'TikTok',    icon: 'music-2',   pfx: '@',        pad: 24, ph: 'pizzahut' },
  { key: 'x',         label: 'X (Twitter)', icon: 'at-sign', pfx: '@',        pad: 24, ph: 'pizzahut' },
  { key: 'youtube',   label: 'YouTube',   icon: 'play',     pfx: 'youtube.com/@', pad: 110, ph: 'pizzahut' },
];

/* ---------- state ---------- */
const DEFAULTS = {
  country: 'GE',
  location: '14 Rustaveli Ave, Tbilisi',
  currency: 'USD',
  mainLang: 'en',
  transLangs: ['ka', 'ru'],
  mgrLang: 'en',
  socials: { website: 'pizzahut.ge', instagram: '', facebook: '', tiktok: '', x: '', youtube: '' },
};
let SP = Object.assign({}, structuredClone(DEFAULTS), store.get('storeProfile', {}));
SP.socials = Object.assign({}, DEFAULTS.socials, SP.socials || {});
const saveSP = () => store.set('storeProfile', SP);

/* ---------- identity ---------- */
$('#spCountry').innerHTML = COUNTRIES.map(c => `<option value="${c.code}" ${c.code === SP.country ? 'selected' : ''}>${c.name}</option>`).join('');
$('#spCurrency').innerHTML = CURRENCIES.map(c => `<option value="${c.code}" ${c.code === SP.currency ? 'selected' : ''}>${c.sym} · ${c.code} — ${c.name}</option>`).join('');
$('#spLocation').value = SP.location;

$('#spCountry').addEventListener('change', (e) => { SP.country = e.target.value; saveSP(); });
$('#spCurrency').addEventListener('change', (e) => { SP.currency = e.target.value; saveSP(); });
$('#spLocation').addEventListener('input', (e) => { SP.location = e.target.value; saveSP(); });

/* ---------- languages ---------- */
function langChip(code, { selected = false, main = false, disabled = false } = {}) {
  const f = FLAGS[code];
  const [native, latin] = f.label.split(' · ');
  const sub = latin ? `<span class="sub">${latin}</span>` : '';
  return `
    <button type="button" class="lang-chip ${main ? 'main' : selected ? 'on' : ''}" data-lang="${code}" ${disabled ? 'disabled' : ''}>
      ${flagCircle(code)}
      <span class="meta"><span class="name">${native}</span>${sub}</span>
      <i class="ic check-ic" data-lucide="${main ? 'star' : 'check'}"></i>
    </button>`;
}

function renderMainLang() {
  $('#spMainLang').innerHTML = Object.keys(FLAGS).map(code => langChip(code, { main: code === SP.mainLang })).join('');
}
function renderTransLang() {
  $('#spTransLang').innerHTML = Object.keys(FLAGS).map(code => {
    const isMain = code === SP.mainLang;
    return langChip(code, { selected: SP.transLangs.includes(code), disabled: isMain });
  }).join('');
  const n = SP.transLangs.filter(c => c !== SP.mainLang).length;
  $('#spTransCount').textContent = n === 0 ? 'No translations yet — only the main language will show.'
    : `Storefront available in ${n + 1} language${n + 1 === 1 ? '' : 's'} including main.`;
}
function renderMgrLang() {
  $('#spMgrLang').innerHTML = Object.keys(FLAGS).map(code => langChip(code, { main: code === SP.mgrLang })).join('');
}

$('#spMainLang').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  SP.mainLang = b.dataset.lang;
  // main is implicitly always "translated", so drop it from the extras list to avoid the visual double-state
  SP.transLangs = SP.transLangs.filter(c => c !== SP.mainLang);
  saveSP(); renderMainLang(); renderTransLang(); lucide.createIcons();
});

$('#spTransLang').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]'); if (!b || b.disabled) return;
  const c = b.dataset.lang;
  if (SP.transLangs.includes(c)) SP.transLangs = SP.transLangs.filter(x => x !== c);
  else SP.transLangs.push(c);
  saveSP(); renderTransLang(); lucide.createIcons();
});

$('#spMgrLang').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  SP.mgrLang = b.dataset.lang;
  store.set('lang', SP.mgrLang); // keeps the topbar flag in sync
  saveSP(); renderMgrLang(); lucide.createIcons();
  $('#langFlag') && ($('#langFlag').innerHTML = flagCircle(SP.mgrLang));
});

/* ---------- socials ---------- */
$('#spSocial').innerHTML = SOCIALS.map(s => `
  <div class="sp-social-row">
    <label class="lbl" for="sp-${s.key}"><i class="ic" data-lucide="${s.icon}"></i>${s.label}</label>
    <div class="sp-input-pfx" data-pfx style="--pfx-pad:${s.pad}px">
      <span class="pfx">${s.pfx}</span>
      <input class="input" id="sp-${s.key}" data-skey="${s.key}" value="${SP.socials[s.key] || ''}" placeholder="${s.ph}" />
    </div>
  </div>`).join('');

$('#spSocial').addEventListener('input', (e) => {
  const t = e.target;
  if (!t.matches('[data-skey]')) return;
  SP.socials[t.dataset.skey] = t.value.trim();
  saveSP();
});

/* ---------- save ---------- */
$('#spSave').addEventListener('click', () => {
  saveSP();
  toast('Store profile saved', 'check-circle-2');
});

/* ---------- initial render ---------- */
renderMainLang();
renderTransLang();
renderMgrLang();
lucide.createIcons();

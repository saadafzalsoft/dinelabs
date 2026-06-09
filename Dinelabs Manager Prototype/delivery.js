/* ===================== DELIVERY PAGE ===================== */
renderShell('delivery');

/* ---------- currency lookup (from saved Store profile) ---------- */
const CURRENCY_SYM = {
  USD:'$', EUR:'€', GBP:'£', GEL:'₾', TRY:'₺', RUB:'₽', UAH:'₴', INR:'₹', JPY:'¥', PLN:'zł',
  AUD:'A$', CAD:'C$', BRL:'R$', MXN:'MX$', SGD:'S$', AED:'AED', SAR:'SAR',
};
function currencySymbol() {
  const sp = store.get('storeProfile', null);
  return CURRENCY_SYM[sp && sp.currency] || '$';
}

/* ---------- state ---------- */
const DEFAULTS = {
  on: true,
  etaFrom: 25,
  etaTo: 40,
  minOrder: 12.0,
  fee: 2.5,
};
let DL = Object.assign({}, DEFAULTS, store.get('delivery', {}));
const saveDL = () => store.set('delivery', DL);

/* ---------- hydrate ---------- */
$('#dlToggle').checked   = DL.on;
$('#dlEtaFrom').value    = DL.etaFrom;
$('#dlEtaTo').value      = DL.etaTo;
$('#dlMin').value        = DL.minOrder.toFixed(2);
$('#dlFee').value        = DL.fee.toFixed(2);

/* ---------- render ---------- */
function applyStatus() {
  const status = $('#dlStatus');
  const pill = $('#dlPill');
  const pillTxt = $('#dlPillTxt');
  const sub = $('#dlStatusSub');

  status.classList.toggle('on', DL.on);
  pill.classList.toggle('live', DL.on);
  pill.classList.toggle('paused', !DL.on);
  pillTxt.textContent = DL.on ? 'Live on storefront' : 'Paused';
  sub.textContent = DL.on
    ? `Customers can order delivery now. ETA shown as ${DL.etaFrom}–${DL.etaTo} min.`
    : 'When off, the delivery option is hidden from the storefront and existing baskets switch to pick-up.';

  $('#dlSecTiming').setAttribute('aria-disabled', String(!DL.on));
  $('#dlSecPricing').setAttribute('aria-disabled', String(!DL.on));
}

function renderPrefixes() {
  const s = currencySymbol();
  const wide = s.length > 2;
  $('#dlMinPfx').textContent = s;
  $('#dlFeePfx').textContent = s;
  $$('.money-input').forEach(el => el.classList.toggle('wide', wide));
}

function renderPreview() {
  const s = currencySymbol();
  const min = Number.isFinite(DL.minOrder) ? DL.minOrder.toFixed(2) : '0.00';
  const fee = Number.isFinite(DL.fee) ? DL.fee.toFixed(2) : '0.00';
  $('#dlPreview').innerHTML = DL.on
    ? `<i class="ic" data-lucide="bike"></i>
       Storefront shows: <b>${DL.etaFrom}–${DL.etaTo} min</b>
       <span class="sep">·</span> Min order <b>${s}${min}</b>
       <span class="sep">·</span> Fee <b>${s}${fee}</b>`
    : `<i class="ic" data-lucide="pause-circle"></i> Delivery is paused — these rules will apply the moment you turn it back on.`;
  lucide.createIcons();
}

function renderAll() { applyStatus(); renderPrefixes(); renderPreview(); }

/* ---------- interactions ---------- */
$('#dlToggle').addEventListener('change', (e) => {
  DL.on = e.target.checked; saveDL(); renderAll();
  toast(`Delivery ${DL.on ? 'enabled' : 'paused'}`, DL.on ? 'bike' : 'pause-circle');
});

const liveSync = {
  '#dlEtaFrom': v => DL.etaFrom = clampInt(v, 5, 240),
  '#dlEtaTo':   v => DL.etaTo   = clampInt(v, 5, 240),
  '#dlMin':     v => DL.minOrder = clampFloat(v, 0, 9999),
  '#dlFee':     v => DL.fee      = clampFloat(v, 0, 999),
};
for (const [sel, fn] of Object.entries(liveSync)) {
  $(sel).addEventListener('input', (e) => { fn(e.target.value); saveDL(); renderPreview(); applyStatus(); });
}

// keep eta sane: from <= to
$('#dlEtaFrom').addEventListener('blur', () => {
  if (DL.etaFrom > DL.etaTo) { DL.etaTo = DL.etaFrom; $('#dlEtaTo').value = DL.etaTo; saveDL(); renderPreview(); applyStatus(); }
});
$('#dlEtaTo').addEventListener('blur', () => {
  if (DL.etaTo < DL.etaFrom) { DL.etaFrom = DL.etaTo; $('#dlEtaFrom').value = DL.etaFrom; saveDL(); renderPreview(); applyStatus(); }
});

function clampInt(v, lo, hi) { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo; }
function clampFloat(v, lo, hi) { const n = parseFloat(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo; }

$('#dlSave').addEventListener('click', () => { saveDL(); toast('Delivery settings saved', 'check-circle-2'); });

renderAll();

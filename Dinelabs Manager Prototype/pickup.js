/* ===================== PICK-UP PAGE ===================== */
renderShell('pickup');

const DEFAULTS = { on: true, etaFrom: 15, etaTo: 25 };
let PU = Object.assign({}, DEFAULTS, store.get('pickup', {}));
const savePU = () => store.set('pickup', PU);

$('#puToggle').checked = PU.on;
$('#puEtaFrom').value  = PU.etaFrom;
$('#puEtaTo').value    = PU.etaTo;

function applyStatus() {
  const status = $('#puStatus');
  const pill = $('#puPill');
  status.classList.toggle('on', PU.on);
  pill.classList.toggle('live', PU.on);
  pill.classList.toggle('paused', !PU.on);
  $('#puPillTxt').textContent = PU.on ? 'Live on storefront' : 'Paused';
  $('#puStatusSub').textContent = PU.on
    ? `Customers can place pick-up orders now. Ready-in time shown as ${PU.etaFrom}–${PU.etaTo} min.`
    : 'When off, the pick-up option is hidden from the storefront.';
  $('#puSecTiming').setAttribute('aria-disabled', String(!PU.on));
}

function renderPreview() {
  $('#puPreview').innerHTML = PU.on
    ? `<i class="ic" data-lucide="shopping-bag"></i>Storefront shows: <b>Ready in ${PU.etaFrom}–${PU.etaTo} min</b>`
    : `<i class="ic" data-lucide="pause-circle"></i>Pick-up is paused — this ETA will apply the moment you turn it back on.`;
  lucide.createIcons();
}

$('#puToggle').addEventListener('change', (e) => {
  PU.on = e.target.checked; savePU(); applyStatus(); renderPreview();
  toast(`Pick-up ${PU.on ? 'enabled' : 'paused'}`, PU.on ? 'shopping-bag' : 'pause-circle');
});

const clampInt = (v, lo, hi) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo; };

$('#puEtaFrom').addEventListener('input', (e) => { PU.etaFrom = clampInt(e.target.value, 5, 180); savePU(); applyStatus(); renderPreview(); });
$('#puEtaTo').addEventListener('input',   (e) => { PU.etaTo   = clampInt(e.target.value, 5, 180); savePU(); applyStatus(); renderPreview(); });
$('#puEtaFrom').addEventListener('blur', () => { if (PU.etaFrom > PU.etaTo) { PU.etaTo = PU.etaFrom; $('#puEtaTo').value = PU.etaTo; savePU(); applyStatus(); renderPreview(); } });
$('#puEtaTo').addEventListener('blur',   () => { if (PU.etaTo < PU.etaFrom) { PU.etaFrom = PU.etaTo; $('#puEtaFrom').value = PU.etaFrom; savePU(); applyStatus(); renderPreview(); } });

$('#puSave').addEventListener('click', () => { savePU(); toast('Pick-up settings saved', 'check-circle-2'); });

applyStatus();
renderPreview();

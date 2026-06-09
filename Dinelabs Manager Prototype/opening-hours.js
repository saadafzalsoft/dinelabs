/* ===================== OPENING HOURS PAGE ===================== */
renderShell('hours');

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

const DEFAULT_HOURS = {
  mon: { open: true,  slots: [['11:00', '22:00']] },
  tue: { open: true,  slots: [['11:00', '22:00']] },
  wed: { open: true,  slots: [['11:00', '22:00']] },
  thu: { open: true,  slots: [['11:00', '22:00']] },
  fri: { open: true,  slots: [['11:00', '23:30']] },
  sat: { open: true,  slots: [['11:00', '23:30']] },
  sun: { open: false, slots: [['12:00', '21:00']] },
};

let HOURS = store.get('openingHours', null) || structuredClone(DEFAULT_HOURS);
// one time range per day
Object.values(HOURS).forEach(d => { if (d.slots && d.slots.length > 1) d.slots = [d.slots[0]]; });
const saveHours = () => store.set('openingHours', HOURS);

/* ---- time helpers ---- */
function toMins(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function fmt(t) {
  const [h, m] = t.split(':').map(Number);
  const ap = h < 12 ? 'AM' : 'PM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
}
function slotHours(slot) {
  let d = toMins(slot[1]) - toMins(slot[0]);
  if (d <= 0) d += 1440; // crosses midnight
  return d / 60;
}
function dayHours(d) { return d.open ? d.slots.reduce((s, sl) => s + slotHours(sl), 0) : 0; }
function dayLabel(d) {
  if (!d.open) return 'Closed';
  return d.slots.map(s => `${fmt(s[0])} – ${fmt(s[1])}`).join(',  ');
}

/* ---- render ---- */
function renderHours() {
  $('#ohList').innerHTML = DAYS.map(({ key, label }) => {
    const d = HOURS[key];
    const slots = d.open ? `
      <div class="oh-slots">
        ${d.slots.map((s, i) => `
          <div class="oh-slot" data-i="${i}">
            <input class="oh-time" type="time" value="${s[0]}" data-from aria-label="${label} opens" />
            <span class="oh-dash">–</span>
            <input class="oh-time" type="time" value="${s[1]}" data-to aria-label="${label} closes" />
            ${d.slots.length > 1 ? `<button class="iconbtn del" data-delslot title="Remove time slot"><i class="ic" data-lucide="x"></i></button>` : ''}
          </div>`).join('')}
      </div>`
      : `<div class="oh-closed">Closed all day</div>`;

    return `
      <div class="oh-row ${d.open ? '' : 'closed'}" data-day="${key}">
        <div class="oh-day">
          <label class="switch" title="${d.open ? 'Open' : 'Closed'}">
            <input type="checkbox" data-toggle ${d.open ? 'checked' : ''} />
            <span class="track"></span>
          </label>
          <div>
            <div class="oh-name">${label}</div>
            <div class="oh-status">${dayHours(d) ? dayHours(d).toFixed(1).replace('.0', '') + ' hrs' : 'Not accepting orders'}</div>
          </div>
        </div>
        ${slots}
        <div class="oh-rowact"></div>
      </div>`;
  }).join('');
  lucide.createIcons();
  renderSummary();
}

function renderSummary() {
  const sum = $('#ohSummary');
  if (!sum) return;
  const openDays = DAYS.filter(({ key }) => HOURS[key].open).length;
  const total = DAYS.reduce((s, { key }) => s + dayHours(HOURS[key]), 0);
  sum.textContent = `${openDays} of 7 days open · ${total.toFixed(1).replace('.0', '')} hrs / week`;
}

/* update just one row's status + the summary, without a full re-render (keeps input focus) */
function refreshRowStatus(row, d) {
  const st = row.querySelector('.oh-status');
  if (st) st.textContent = dayHours(d) ? dayHours(d).toFixed(1).replace('.0', '') + ' hrs' : 'Not accepting orders';
  renderSummary();
}

/* ---- interactions ---- */
$('#ohList').addEventListener('input', (e) => {
  const t = e.target;
  if (!t.classList.contains('oh-time')) return;
  const row = t.closest('.oh-row');
  const slotEl = t.closest('.oh-slot');
  const d = HOURS[row.dataset.day];
  const i = +slotEl.dataset.i;
  d.slots[i][t.hasAttribute('data-from') ? 0 : 1] = t.value;
  saveHours();
  refreshRowStatus(row, d);
});

$('#ohList').addEventListener('click', (e) => {
  const row = e.target.closest('.oh-row');
  if (!row) return;
  const key = row.dataset.day;
  const d = HOURS[key];

  if (e.target.closest('[data-toggle]')) {
    // toggle handled on change below; ignore click bubbling
    return;
  }
  if (e.target.closest('[data-addslot]')) {
    const last = d.slots[d.slots.length - 1];
    d.slots.push(last ? [last[1], last[1]] : ['09:00', '17:00']);
    saveHours(); renderHours();
  } else if (e.target.closest('[data-delslot]')) {
    const i = +e.target.closest('.oh-slot').dataset.i;
    d.slots.splice(i, 1);
    saveHours(); renderHours();
  } else if (e.target.closest('[data-copy]')) {
    DAYS.forEach(({ key: k }) => {
      HOURS[k] = { open: true, slots: structuredClone(d.slots) };
    });
    saveHours(); renderHours();
    toast(`Applied ${DAYS.find(x => x.key === key).label}’s hours to every day`, 'copy');
  }
});

$('#ohList').addEventListener('change', (e) => {
  const t = e.target;
  if (!t.matches('[data-toggle]')) return;
  const row = t.closest('.oh-row');
  const d = HOURS[row.dataset.day];
  d.open = t.checked;
  if (d.open && (!d.slots || !d.slots.length)) d.slots = [['11:00', '22:00']];
  saveHours(); renderHours();
  toast(`${DAYS.find(x => x.key === row.dataset.day).label} marked ${d.open ? 'open' : 'closed'}`, d.open ? 'clock' : 'moon');
});

/* ---- save ---- */
$('#ohSave').addEventListener('click', () => {
  saveHours();
  toast('Opening hours saved', 'check-circle-2');
});

renderHours();

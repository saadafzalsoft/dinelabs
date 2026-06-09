/* ===================== NOTIFICATIONS PAGE ===================== */
renderShell('notif');

const CHANNELS = [
  {
    key: 'dashboard',
    icon: 'layout-dashboard',
    title: 'Dashboard live orders',
    sub: 'New orders appear on the Live Orders board with a chime and a badge in the sidebar. The home base for every restaurant.',
    always: true,
  },
  {
    key: 'email',
    icon: 'mail',
    title: 'Email',
    sub: 'A formatted order summary sent the second the order is placed.',
    field: { kind: 'email', label: 'Send order receipts to', placeholder: 'orders@yourstore.com' },
  },
  {
    key: 'whatsapp',
    img: 'assets/whatsapp-logo.png',
    title: 'WhatsApp',
    sub: 'An instant chat message to your team — great for kitchens that already live in WhatsApp.',
    premium: true,
    field: { kind: 'tel', label: 'WhatsApp number', placeholder: '5xx xxx xxxx', pfx: '+995' },
  },
  {
    key: 'telegram',
    img: 'assets/telegram-logo.png',
    title: 'Telegram',
    sub: 'A direct message via our Dinelabs Orders bot. Free and reliable.',
    field: { kind: 'tel', label: 'Telegram number', placeholder: '5xx xxx xxxx', pfx: '+995' },
  },
];

const DEFAULT_STATE = {
  dashboard: { on: true },
  email:     { on: true,  value: 'orders@pizzahut.ge' },
  whatsapp:  { on: false, value: '' },
  telegram:  { on: false, value: '' },
};

let NOTIF = Object.assign({}, structuredClone(DEFAULT_STATE), store.get('notifications', {}));
for (const k of Object.keys(DEFAULT_STATE)) NOTIF[k] = Object.assign({}, DEFAULT_STATE[k], NOTIF[k] || {});
const saveNotif = () => store.set('notifications', NOTIF);

/* ---- render ---- */
function renderList() {
  $('#ntList').innerHTML = CHANNELS.map(ch => {
    const s = NOTIF[ch.key];
    const on = s.on;

    const titleBits = [`<span>${ch.title}</span>`];
    if (ch.always) titleBits.push(`<span class="pill-always"><i class="ic" data-lucide="check-circle-2"></i>Always on</span>`);
    if (ch.premium) titleBits.push(`<span class="pill-premium"><i class="ic" data-lucide="sparkles"></i>Premium</span>`);

    const field = ch.field ? (() => {
      const v = s.value || '';
      const dis = ch.premium ? 'disabled' : '';
      if (ch.field.pfx) {
        return `
          <div class="nt-input">
            <label class="label">${ch.field.label}</label>
            <div class="input-affix">
              <span class="pfx">${ch.field.pfx}</span>
              <input class="input" type="${ch.field.kind}" data-val placeholder="${ch.field.placeholder}" value="${v}" ${dis} />
            </div>
            ${ch.premium ? `<div class="nt-status"><i class="ic" data-lucide="lock"></i>Activates after you upgrade.</div>`
              : (on && v ? `<div class="nt-status ok"><i class="ic" data-lucide="check"></i>Verified</div>` : '')}
          </div>`;
      }
      return `
        <div class="nt-input">
          <label class="label">${ch.field.label}</label>
          <input class="input" type="${ch.field.kind}" data-val placeholder="${ch.field.placeholder}" value="${v}" ${dis} />
          ${on && v ? `<div class="nt-status ok"><i class="ic" data-lucide="check"></i>Verified</div>` : ''}
        </div>`;
    })() : '';

    const act = ch.always
      ? `<span class="mut3" style="font-size:12.5px;font-weight:600">Built-in</span>`
      : ch.premium
        ? `<button class="nt-locked-btn" data-upgrade><i class="ic" data-lucide="sparkles"></i>Upgrade plan</button>`
        : `<label class="switch" title="${on ? 'On' : 'Off'}">
             <input type="checkbox" data-toggle ${on ? 'checked' : ''} />
             <span class="track"></span>
           </label>`;

    return `
      <div class="nt-row ${on ? 'on' : ''} ${ch.premium ? 'locked' : ''}" data-ch="${ch.key}">
        <div class="nt-icon ${ch.img ? 'has-img' : ''}">${ch.img ? `<img src="${ch.img}" alt="${ch.title}" />` : `<i class="ic" data-lucide="${ch.icon}"></i>`}</div>
        <div class="nt-meta">
          <div class="nt-title">${titleBits.join('')}</div>
          <div class="nt-sub">${ch.sub}</div>
          ${field}
        </div>
        <div class="nt-act">${act}</div>
      </div>`;
  }).join('');
  lucide.createIcons();
  renderSummary();
}

function renderSummary() {
  const active = CHANNELS.filter(ch => NOTIF[ch.key].on && !ch.premium).length;
  $('#ntSummary').textContent = `${active} channel${active === 1 ? '' : 's'} active`;
}

/* ---- interactions ---- */
$('#ntList').addEventListener('change', (e) => {
  const t = e.target;
  if (!t.matches('[data-toggle]')) return;
  const row = t.closest('.nt-row');
  const key = row.dataset.ch;
  NOTIF[key].on = t.checked;
  saveNotif(); renderList();
  toast(`${CHANNELS.find(c => c.key === key).title} ${t.checked ? 'on' : 'off'}`, t.checked ? 'bell-ring' : 'bell-off');
});

$('#ntList').addEventListener('input', (e) => {
  const t = e.target;
  if (!t.matches('[data-val]')) return;
  const key = t.closest('.nt-row').dataset.ch;
  NOTIF[key].value = t.value;
  saveNotif();
});

$('#ntList').addEventListener('click', (e) => {
  if (e.target.closest('[data-upgrade]')) {
    toast('Plan upgrade flow — not implemented in this prototype', 'sparkles');
  }
});

$('#ntSave').addEventListener('click', () => {
  saveNotif();
  toast('Notification settings saved', 'check-circle-2');
});

renderList();

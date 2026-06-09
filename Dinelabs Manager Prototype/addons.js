/* ===================== MODIFIER ADD-ONS PAGE ===================== */
renderShell('addons');

/* ---- option migration: opts can be ['Small', 'Extra Cheese · +$2.00'] strings
        or {name, price?} objects. Normalize on read. ---- */
function normalizeOpt(o, type) {
  if (typeof o === 'string') {
    const m = o.match(/^(.*?)\s*·\s*\+?\$([\d.]+)\s*$/);
    if (m) return { name: m[1].trim(), price: parseFloat(m[2]) || 0 };
    return type === 'removals' ? { name: o } : { name: o, price: 0 };
  }
  if (type === 'removals') return { name: o.name };
  return { name: o.name, price: +o.price || 0 };
}
function normalizeGroup(g) {
  return { ...g, opts: (g.opts || []).map(o => normalizeOpt(o, g.type)) };
}

let MOD_GROUPS = (store.get('modGroupsState', null) || MOD_GROUPS_SEED).map(m => normalizeGroup(m));
const PRODUCTS = store.get('productsState', null) || PRODUCTS_SEED.map(p => ({ ...p, avail: true }));
let editIdx = null;
let editingOpts = []; // working copy while drawer is open
const saveMods = () => store.set('modGroupsState', MOD_GROUPS);

const HINTS = {
  variations: 'Customer must choose <b>one</b>. Give each option a price (or $0 if it doesn\'t change the total). Example: Small, Medium, Large.',
  addons: 'Customer can pick <b>any number</b> of extras, each with an additional charge. Example: Extra Cheese +$2.00, Bacon +$1.50.',
  removals: 'Customer can opt to remove items at <b>no extra cost</b>. Example: No onions, No pickles.',
};

function fmtOptDisplay(opt, type) {
  if (type === 'removals') return opt.name;
  if ((opt.price || 0) === 0) return type === 'variations' ? `${opt.name}` : opt.name;
  const price = '$' + (+opt.price).toFixed(2);
  return type === 'variations' ? `${opt.name} · ${price}` : `${opt.name} · +${price}`;
}

function renderMods() {
  $('#modList').innerHTML = MOD_GROUPS.map((m, idx) => {
    const usedBy = PRODUCTS.filter(p => p.mods.includes(m.name)).length;
    const opts = m.opts.length
      ? m.opts.map(o => `<span class="tag">${fmtOptDisplay(o, m.type)}</span>`).join('')
      : '<span class="mut3" style="font-size:12.5px">No options yet</span>';
    return `<div class="mod-card" data-idx="${idx}">
      <div class="mod-top">
        <span class="thumb" style="width:38px;height:38px"><i class="ic" data-lucide="${m.icon}"></i></span>
        <div><div class="mod-title">${m.name}</div><div class="mut3" style="font-size:12px">${TYPE_LABEL[m.type]} · ${m.opts.length} options · used by ${usedBy} item${usedBy!==1?'s':''}</div></div>
        <div class="row gap8" style="margin-left:auto">
          <button class="iconbtn" data-medit title="Edit"><i class="ic" data-lucide="pencil"></i></button>
          <button class="iconbtn del" data-mdel title="Delete"><i class="ic" data-lucide="trash-2"></i></button>
        </div>
      </div>
      <div class="mod-opts">${opts}</div>
    </div>`;
  }).join('');
  lucide.createIcons();
}

/* ---- drawer ---- */
function openModDrawer() { $('#modScrim').classList.add('open'); $('#modDrawer').classList.add('open'); }
function closeModDrawer() { $('#modScrim').classList.remove('open'); $('#modDrawer').classList.remove('open'); }
$('#modDrawerClose').addEventListener('click', closeModDrawer);
$('#modScrim').addEventListener('click', closeModDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModDrawer(); });

$('#addModBtn').addEventListener('click', () => { resetModForm(); openModDrawer(); $('#nmName').focus(); });

$('#modList').addEventListener('click', (e) => {
  const card = e.target.closest('.mod-card'); if (!card) return;
  const idx = +card.dataset.idx; const m = MOD_GROUPS[idx];
  if (e.target.closest('[data-mdel]')) {
    MOD_GROUPS.splice(idx, 1); saveMods(); renderMods();
    toast(`Deleted “${m.name}”`, 'trash-2');
  } else if (e.target.closest('[data-medit]')) {
    editIdx = idx;
    $('#nmName').value = m.name;
    editingOpts = m.opts.map(o => ({ ...o }));
    setType(m.type);
    $('#modDrawerTitle').textContent = 'Edit modifier group';
    $('#modDrawerIcon').setAttribute('data-lucide', 'pencil');
    $('#nmCreate').innerHTML = '<i class="ic" data-lucide="save"></i>Save changes';
    lucide.createIcons();
    openModDrawer(); $('#nmName').focus();
  }
});

/* ---- type-aware option editor ---- */
function currentType() { return ($('#nmType .type-card.on') || {}).dataset?.type || 'variations'; }
const iconForType = (type) => type === 'removals' ? 'minus-circle' : (type === 'variations' ? 'ruler' : 'plus-circle');

function setType(type) {
  $$('#nmType .type-card').forEach(x => x.classList.toggle('on', x.dataset.type === type));
  // hint
  $('#nmHintText').innerHTML = HINTS[type];
  // editor layout
  $('#nmOptAdd').dataset.type = type;
  $('#nmOptPriceWrap').style.display = type === 'removals' ? 'none' : '';
  $('#nmOptPfx').textContent = type === 'addons' ? '+$' : '$';
  // option name placeholders
  $('#nmOptName').placeholder = type === 'variations' ? 'e.g. Medium' : (type === 'addons' ? 'e.g. Extra Cheese' : 'e.g. Onions');
  $('#nmOptPrice').value = '';
  // price defaults
  if (type === 'removals') {
    editingOpts = editingOpts.map(o => ({ name: o.name }));
  } else {
    editingOpts = editingOpts.map(o => ({ name: o.name, price: +o.price || 0 }));
  }
  renderOptsEditor();
  lucide.createIcons();
}
$$('#nmType .type-card').forEach(c => c.addEventListener('click', () => setType(c.dataset.type)));

function renderOptsEditor() {
  const type = currentType();
  const list = $('#nmOpts');
  list.innerHTML = editingOpts.map((o, i) => {
    const priceCell = type === 'removals'
      ? ''
      : `<span class="opt-price">${type === 'addons' ? '+' : ''}$${(+o.price || 0).toFixed(2)}</span>`;
    return `<div class="opt-row" data-type="${type}" data-i="${i}">
      <span class="opt-name">${o.name}</span>
      ${priceCell}
      <button type="button" class="opt-rm" data-rm title="Remove"><i class="ic" data-lucide="x"></i></button>
    </div>`;
  }).join('');
  $('#nmOptsCount').textContent = '· ' + editingOpts.length;
  lucide.createIcons();
}

$('#nmOpts').addEventListener('click', (e) => {
  const row = e.target.closest('[data-i]'); if (!row) return;
  if (e.target.closest('[data-rm]')) {
    editingOpts.splice(+row.dataset.i, 1);
    renderOptsEditor();
  }
});

function addOption() {
  const type = currentType();
  const name = $('#nmOptName').value.trim();
  if (!name) { toast('Enter an option name', 'info'); return; }
  if (editingOpts.some(o => o.name.toLowerCase() === name.toLowerCase())) {
    toast('That option already exists', 'info'); return;
  }
  if (type === 'removals') {
    editingOpts.push({ name });
  } else {
    const price = parseFloat($('#nmOptPrice').value);
    editingOpts.push({ name, price: isFinite(price) ? price : 0 });
  }
  $('#nmOptName').value = '';
  $('#nmOptPrice').value = '';
  renderOptsEditor();
  $('#nmOptName').focus();
}
$('#nmOptAddBtn').addEventListener('click', addOption);
$('#nmOptName').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } });
$('#nmOptPrice').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } });

function resetModForm() {
  editIdx = null;
  editingOpts = [];
  $('#nmName').value = '';
  $('#nmOptName').value = '';
  $('#nmOptPrice').value = '';
  setType('variations');
  $('#modDrawerTitle').textContent = 'New modifier group';
  $('#modDrawerIcon').setAttribute('data-lucide', 'sliders-horizontal');
  $('#nmCreate').innerHTML = '<i class="ic" data-lucide="plus"></i>Create group';
  lucide.createIcons();
}

$('#nmCreate').addEventListener('click', () => {
  const name = $('#nmName').value.trim();
  if (!name) { toast('Enter a group name', 'info'); return; }
  const type = currentType();
  if (editingOpts.length === 0) { toast('Add at least one option', 'info'); return; }
  const opts = editingOpts.map(o => type === 'removals' ? { name: o.name } : { name: o.name, price: +o.price || 0 });
  if (editIdx !== null) {
    const m = MOD_GROUPS[editIdx];
    m.name = name; m.type = type; m.icon = iconForType(type); m.opts = opts;
    toast(`Saved “${name}”`);
  } else {
    MOD_GROUPS.push({ name, type, icon: iconForType(type), opts });
    toast(`Created “${name}”`);
  }
  saveMods(); resetModForm(); closeModDrawer(); renderMods();
});

resetModForm();
renderMods();

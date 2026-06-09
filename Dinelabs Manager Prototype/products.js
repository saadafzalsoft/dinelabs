/* ===================== PRODUCTS CATALOG PAGE ===================== */
renderShell('products');

/* ---- state ---- */
let PRODUCTS = store.get('productsState', null) || PRODUCTS_SEED.map(p => ({ ...p, avail: true }));
const CATS = store.get('categoriesState', null) || CATEGORIES.map((name, i) => ({ name, pinned: name === 'Sides & Appetizers', order: i }));
const MOD_GROUPS = store.get('modGroupsState', null) || MOD_GROUPS_SEED.map(m => ({ ...m }));

const selected = new Set();
let editId = null;

const saveProducts = () => store.set('productsState', PRODUCTS);

/* ===================== CATALOG ===================== */
function fillCatFilter() {
  const sel = $('#pCat');
  sel.innerHTML = '<option value="">All categories</option>' + CATS.map(c => `<option>${c.name}</option>`).join('');
}
function thumb(p) { return `<span class="thumb"><i class="ic" data-lucide="${p.icon || 'utensils'}"></i></span>`; }

function renderCatalog() {
  const q = $('#pSearch').value.trim().toLowerCase();
  const cat = $('#pCat').value;
  const av = $('#pAvail').value;
  const rows = PRODUCTS.filter(p =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (!cat || p.cats.includes(cat)) &&
    (!av || (av === 'in' ? p.avail : !p.avail))
  );
  const body = $('#pBody');
  $('#pEmpty').classList.toggle('hide', rows.length > 0);

  // Group rows by primary category (first cat) — preserve PRODUCTS order within group
  const order = CATS.map(c => c.name);
  const groups = new Map();
  order.forEach(name => groups.set(name, []));
  groups.set('Uncategorized', []);
  rows.forEach(p => {
    const key = (p.cats && p.cats[0]) || 'Uncategorized';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  });

  const rowHtml = (p) => {
    const mods = p.mods.length ? p.mods.map(m => `<span class="tag">${m}</span>`).join(' ') : '<span class="mut3">None</span>';
    const on = selected.has(p.id);
    return `<tr data-id="${p.id}">
      <td class="drag-col"><span class="drag-handle" data-handle title="Drag to reorder"><i class="ic" data-lucide="grip-vertical"></i></span></td>
      <td><span class="check ${on ? 'on' : ''}" data-check><i class="ic" data-lucide="check"></i></span></td>
      <td>
        <div class="p-cell">
          ${thumb(p)}
          <div><div class="p-name">${p.name}</div><div class="mut3" style="font-size:12px">${p.cats.join(' · ')}</div></div>
        </div>
      </td>
      <td><div style="display:flex;flex-wrap:wrap;gap:5px;max-width:240px">${mods}</div></td>
      <td><span class="price tnum">${money(p.price)}</span></td>
      <td>
        <div class="avail-cell">
          <label class="switch"><input type="checkbox" data-avail ${p.avail ? 'checked' : ''}><span class="track"></span></label>
          <span class="pill ${p.avail ? 'pill-pos' : 'pill-soft'}" style="height:22px"><span class="dot"></span>${p.avail ? 'In stock' : 'Out'}</span>
        </div>
      </td>
      <td>
        <div class="row gap8" style="justify-content:flex-end">
          <button class="iconbtn" data-edit title="Edit"><i class="ic" data-lucide="pencil"></i></button>
          <button class="iconbtn del" data-del title="Delete"><i class="ic" data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>`;
  };

  let html = '';
  for (const [name, list] of groups) {
    if (!list.length) continue;
    html += `<tr class="cat-row" data-cat="${name}">
      <td colspan="7">
        <div class="cat-row-inner">
          <span class="cat-name">${name}</span>
          <span class="cat-count">${list.length} product${list.length===1?'':'s'}</span>
        </div>
      </td>
    </tr>`;
    html += list.map(rowHtml).join('');
  }
  body.innerHTML = html;
  lucide.createIcons();
  updateBulk();
}

function updateBulk() {
  const n = selected.size;
  $('#bulkbar').classList.toggle('hide', n === 0);
  $('#bbCount').textContent = n + ' selected';
  $('#bulkbar').classList.toggle('armed', n > 0);
  const allVisible = $$('#pBody tr[data-id]').every(tr => selected.has(tr.dataset.id));
  $('#checkAll').classList.toggle('on', allVisible && $$('#pBody tr[data-id]').length > 0);
}

/* delegated clicks on table */
$('#pBody').addEventListener('click', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const id = tr.dataset.id;
  if (e.target.closest('[data-check]')) {
    selected.has(id) ? selected.delete(id) : selected.add(id);
    tr.querySelector('[data-check]').classList.toggle('on');
    updateBulk();
  } else if (e.target.closest('[data-edit]')) {
    startEdit(id);
  } else if (e.target.closest('[data-del]')) {
    const p = PRODUCTS.find(x => x.id === id);
    PRODUCTS = PRODUCTS.filter(x => x.id !== id); selected.delete(id);
    saveProducts(); renderCatalog(); toast(`Deleted “${p.name}”`, 'trash-2');
  }
});
$('#pBody').addEventListener('change', (e) => {
  if (e.target.matches('[data-avail]')) {
    const id = e.target.closest('tr').dataset.id;
    const p = PRODUCTS.find(x => x.id === id);
    p.avail = e.target.checked; saveProducts(); renderCatalog();
    toast(`${p.name} marked ${p.avail ? 'in stock' : 'out of stock'}`, p.avail ? 'check-circle-2' : 'circle-slash');
  }
});

$('#checkAll').addEventListener('click', () => {
  const visible = $$('#pBody tr[data-id]').map(tr => tr.dataset.id);
  const allOn = visible.every(id => selected.has(id));
  visible.forEach(id => allOn ? selected.delete(id) : selected.add(id));
  renderCatalog();
});

/* ---- drag to reorder ---- */
let dragId = null;
const pBodyEl = $('#pBody');
pBodyEl.addEventListener('mousedown', (e) => {
  const tr = e.target.closest('tr');
  if (tr && e.target.closest('[data-handle]')) tr.setAttribute('draggable', 'true');
});
pBodyEl.addEventListener('mouseup', () => $$('#pBody tr').forEach(tr => tr.removeAttribute('draggable')));
pBodyEl.addEventListener('dragstart', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  dragId = tr.dataset.id; tr.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
});
pBodyEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  const tr = e.target.closest('tr'); if (!tr || !tr.dataset.id || tr.dataset.id === dragId) return;
  const r = tr.getBoundingClientRect();
  const below = e.clientY > r.top + r.height / 2;
  $$('#pBody tr').forEach(x => x.classList.remove('drop-above', 'drop-below'));
  tr.classList.add(below ? 'drop-below' : 'drop-above');
});
pBodyEl.addEventListener('drop', (e) => {
  e.preventDefault();
  const tr = e.target.closest('tr'); if (!tr || !dragId || !tr.dataset.id || tr.dataset.id === dragId) return;
  const targetId = tr.dataset.id;
  const below = tr.classList.contains('drop-below');
  const from = PRODUCTS.findIndex(p => p.id === dragId);
  const item = PRODUCTS.splice(from, 1)[0];
  let to = PRODUCTS.findIndex(p => p.id === targetId);
  if (below) to++;
  PRODUCTS.splice(to, 0, item);
  saveProducts();
  renderCatalog();
  toast(`Reordered “${item.name}”`, 'arrow-up-down');
});
pBodyEl.addEventListener('dragend', () => {
  dragId = null;
  $$('#pBody tr').forEach(x => { x.classList.remove('dragging', 'drop-above', 'drop-below'); x.removeAttribute('draggable'); });
});

['#pSearch', '#pCat', '#pAvail'].forEach(s => $(s).addEventListener('input', renderCatalog));

/* ---- one-time reorder hint ---- */
if (store.get('reorderHintDismissed', false)) $('#reorderHint').classList.add('hide');
$('#reorderHintX').addEventListener('click', () => {
  $('#reorderHint').classList.add('hide');
  store.set('reorderHintDismissed', true);
});

$('#bulkApply').addEventListener('click', () => {
  const act = $('#bulkAction').value;
  if (!act || selected.size === 0) { toast('Select products and an action first', 'info'); return; }
  const ids = [...selected];
  if (act === 'del') { PRODUCTS = PRODUCTS.filter(p => !selected.has(p.id)); toast(`Deleted ${ids.length} product${ids.length>1?'s':''}`, 'trash-2'); }
  else { ids.forEach(id => { const p = PRODUCTS.find(x => x.id === id); if (p) p.avail = act === 'in'; }); toast(`${ids.length} marked ${act === 'in' ? 'in stock' : 'out of stock'}`); }
  selected.clear(); $('#bulkAction').value = ''; saveProducts(); renderCatalog();
});

/* ---- add / edit product drawer ---- */
function openDrawer() {
  $('#drawerScrim').classList.add('open');
  $('#prodDrawer').classList.add('open');
}
function closeDrawer() {
  $('#drawerScrim').classList.remove('open');
  $('#prodDrawer').classList.remove('open');
}
$('#addProductBtn').addEventListener('click', () => { resetRail(); openDrawer(); $('#npName').focus(); });
$('#drawerClose').addEventListener('click', closeDrawer);
$('#drawerScrim').addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

function buildChecklists() {
  $('#npCats').innerHTML = CATS.map(c => `<label class="chk"><span class="check" data-c="${c.name}"><i class="ic" data-lucide="check"></i></span>${c.name}</label>`).join('');
  $('#npMods').innerHTML = MOD_GROUPS.map(m => `<label class="chk"><span class="check" data-m="${m.name}"><i class="ic" data-lucide="check"></i></span>${m.name}<span class="meta">${TYPE_LABEL[m.type]}</span></label>`).join('');
  lucide.createIcons();
  $$('#npCats .check, #npMods .check').forEach(ch => ch.addEventListener('click', () => ch.classList.toggle('on')));
}
function railValues() {
  return {
    name: $('#npName').value.trim(),
    price: parseFloat($('#npPrice').value) || 0,
    cats: $$('#npCats .check.on').map(c => c.dataset.c),
    mods: $$('#npMods .check.on').map(c => c.dataset.m),
  };
}
function startEdit(id) {
  const p = PRODUCTS.find(x => x.id === id); editId = id;
  $('#npName').value = p.name; $('#npPrice').value = p.price.toFixed(2);
  $$('#npCats .check').forEach(c => c.classList.toggle('on', p.cats.includes(c.dataset.c)));
  $$('#npMods .check').forEach(c => c.classList.toggle('on', p.mods.includes(c.dataset.m)));
  $('#drawerTitle').textContent = 'Edit product';
  $('#drawerIcon').setAttribute('data-lucide', 'pencil');
  $('#npCreate').innerHTML = '<i class="ic" data-lucide="save"></i>Save changes';
  lucide.createIcons();
  openDrawer();
}
function resetRail() {
  editId = null; $('#npName').value = ''; $('#npPrice').value = '';
  $$('#npCats .check, #npMods .check').forEach(c => c.classList.remove('on'));
  $('#drawerTitle').textContent = 'Add new product';
  $('#drawerIcon').setAttribute('data-lucide', 'plus-circle');
  $('#npCreate').innerHTML = '<i class="ic" data-lucide="plus"></i>Create product'; lucide.createIcons();
}
$('#npCreate').addEventListener('click', () => {
  const v = railValues();
  if (!v.name) { toast('Enter a product name', 'info'); return; }
  if (!v.cats.length) { toast('Pick at least one category', 'info'); return; }
  if (editId) {
    const p = PRODUCTS.find(x => x.id === editId); Object.assign(p, v);
    toast(`Saved “${v.name}”`);
  } else {
    PRODUCTS.unshift({ id: 'p' + Date.now(), ...v, avail: true, icon: v.cats.includes('Beverages') ? 'cup-soda' : (v.cats.includes('Classic Pizzas') ? 'pizza' : 'utensils') });
    toast(`Added “${v.name}”`);
  }
  saveProducts(); resetRail(); closeDrawer(); renderCatalog();
});
$('#npDrop').addEventListener('click', () => toast('Image upload is mocked in this prototype', 'image'));

/* ---- bulk upload drawer ---- */
let bulkParsed = [];
function openBulk() { $('#bulkScrim').classList.add('open'); $('#bulkDrawer').classList.add('open'); }
function closeBulk() {
  $('#bulkScrim').classList.remove('open'); $('#bulkDrawer').classList.remove('open');
  bulkParsed = []; $('#bulkPreviewWrap').style.display = 'none';
  $('#bulkPreview').innerHTML = ''; $('#bulkRowsLabel').textContent = '· 0 rows';
  $('#bulkDropLabel').textContent = 'Drag a .csv or .xlsx file here, or click to browse';
  $('#bulkImport').disabled = true; $('#bulkFile').value = '';
}
$('#bulkUploadBtn').addEventListener('click', openBulk);
$('#bulkClose').addEventListener('click', closeBulk);
$('#bulkScrim').addEventListener('click', closeBulk);

$('#bulkTemplate').addEventListener('click', () => {
  const csv = 'name,category,price,sku,availability,modifiers\nMargherita,Classic Pizzas,12.50,PZ-001,in,Crust;Toppings\nCaesar Salad,Sides & Appetizers,8.00,SD-014,in,Dressing\n';
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'product-template.csv'; a.click(); URL.revokeObjectURL(a.href);
  toast('Template downloaded', 'file-down');
});

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const head = lines.shift().split(',').map(s => s.trim().toLowerCase());
  return lines.map(line => {
    const cells = line.split(',').map(s => s.trim());
    const row = {}; head.forEach((h, i) => row[h] = cells[i] || ''); return row;
  });
}
function renderBulkPreview() {
  const tb = $('#bulkPreview'); tb.innerHTML = '';
  bulkParsed.slice(0, 6).forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.name||'—'}</td><td>${r.category||'—'}</td><td>$${(+r.price||0).toFixed(2)}</td><td style="color:var(--ink-3)">${r.sku||'—'}</td>`;
    tb.appendChild(tr);
  });
  $('#bulkRowsLabel').textContent = `· ${bulkParsed.length} row${bulkParsed.length===1?'':'s'}`;
  $('#bulkPreviewWrap').style.display = bulkParsed.length ? '' : 'none';
  $('#bulkImport').disabled = !bulkParsed.length;
}
$('#bulkDrop').addEventListener('click', () => $('#bulkFile').click());
$('#bulkDrop').addEventListener('dragover', e => { e.preventDefault(); $('#bulkDrop').style.borderColor = 'var(--accent, var(--ink))'; });
$('#bulkDrop').addEventListener('dragleave', () => { $('#bulkDrop').style.borderColor = ''; });
$('#bulkDrop').addEventListener('drop', e => {
  e.preventDefault(); $('#bulkDrop').style.borderColor = '';
  const f = e.dataTransfer.files[0]; if (f) handleBulkFile(f);
});
$('#bulkFile').addEventListener('change', e => { const f = e.target.files[0]; if (f) handleBulkFile(f); });

function handleBulkFile(file) {
  $('#bulkDropLabel').textContent = file.name;
  if (/\.xlsx$/i.test(file.name)) {
    bulkParsed = [
      { name: 'Imported Pepperoni', category: 'Classic Pizzas', price: '14.50', sku: 'PZ-022', availability: 'in' },
      { name: 'Imported Garlic Knots', category: 'Sides & Appetizers', price: '6.00', sku: 'SD-031', availability: 'in' },
      { name: 'Imported Cola', category: 'Beverages', price: '2.50', sku: 'BV-009', availability: 'in' },
    ];
    renderBulkPreview(); return;
  }
  const reader = new FileReader();
  reader.onload = () => { try { bulkParsed = parseCsv(reader.result); renderBulkPreview(); }
    catch (err) { toast('Could not parse file', 'alert-triangle'); } };
  reader.readAsText(file);
}

$('#bulkImport').addEventListener('click', () => {
  if (!bulkParsed.length) return;
  let added = 0;
  bulkParsed.forEach(r => {
    if (!r.name) return;
    PRODUCTS.unshift({
      id: 'p' + Date.now() + '-' + (added++),
      name: r.name,
      price: +r.price || 0,
      cats: r.category ? [r.category] : [],
      mods: (r.modifiers || '').split(';').map(s => s.trim()).filter(Boolean),
      avail: (r.availability || 'in').toLowerCase() !== 'out',
      icon: /pizza/i.test(r.category||'') ? 'pizza' : /beverage|drink/i.test(r.category||'') ? 'cup-soda' : 'utensils',
    });
  });
  saveProducts(); renderCatalog();
  toast(`Imported ${added} product${added===1?'':'s'}`, 'upload-cloud');
  closeBulk();
});

/* ---- init ---- */
fillCatFilter();
buildChecklists();
renderCatalog();

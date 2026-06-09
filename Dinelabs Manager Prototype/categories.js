/* ===================== CATEGORIES & STARRED PAGE ===================== */
renderShell('categories');

let CATS = store.get('categoriesState', null) || CATEGORIES.map((name, i) => ({ name, pinned: name === 'Sides & Appetizers', order: i }));
let editName = null;
const saveCats = () => store.set('categoriesState', CATS);

function renderCats() {
  $('#catCount').textContent = CATS.length + ' categories';
  $('#catBody').innerHTML = CATS.map((c, i) => `
    <tr data-name="${c.name}">
      <td class="drag-col"><span class="drag-handle" data-handle title="Drag to reorder"><i class="ic" data-lucide="grip-vertical"></i></span></td>
      <td><span class="p-name">${c.name}</span></td>
      <td style="text-align:center"><button class="star ${c.pinned ? 'on' : ''}" data-star><i class="ic" data-lucide="star"></i></button></td>
      <td>
        <div class="row gap8" style="justify-content:flex-end">
          <button class="iconbtn" data-cedit title="Edit"><i class="ic" data-lucide="pencil"></i></button>
          <button class="iconbtn del" data-cdel title="Delete"><i class="ic" data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>`).join('');
  lucide.createIcons();
}

/* ---- drawer ---- */
function openCatDrawer() { $('#catScrim').classList.add('open'); $('#catDrawer').classList.add('open'); }
function closeCatDrawer() { $('#catScrim').classList.remove('open'); $('#catDrawer').classList.remove('open'); }
$('#catDrawerClose').addEventListener('click', closeCatDrawer);
$('#catScrim').addEventListener('click', closeCatDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCatDrawer(); });

function resetCatForm() {
  editName = null; $('#ncName').value = '';
  $('#catDrawerTitle').textContent = 'Add category';
  $('#catDrawerIcon').setAttribute('data-lucide', 'folder-plus');
  $('#ncCreate').innerHTML = '<i class="ic" data-lucide="plus"></i>Create category';
  lucide.createIcons();
}

$('#addCatBtn').addEventListener('click', () => { resetCatForm(); openCatDrawer(); $('#ncName').focus(); });

$('#catBody').addEventListener('click', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const name = tr.dataset.name; const c = CATS.find(x => x.name === name);
  if (e.target.closest('[data-star]')) {
    if (c.pinned) {
      c.pinned = false;
      toast(`${name} unpinned`, 'star-off');
    } else {
      CATS.forEach(x => x.pinned = false);
      c.pinned = true;
      toast(`${name} pinned & promoted`, 'star');
    }
    saveCats(); renderCats();
  } else if (e.target.closest('[data-cdel]')) {
    CATS = CATS.filter(x => x.name !== name); saveCats(); renderCats();
    toast(`Deleted “${name}”`, 'trash-2');
  } else if (e.target.closest('[data-cedit]')) {
    editName = name;
    $('#ncName').value = name;
    $('#catDrawerTitle').textContent = 'Edit category';
    $('#catDrawerIcon').setAttribute('data-lucide', 'pencil');
    $('#ncCreate').innerHTML = '<i class="ic" data-lucide="save"></i>Save changes';
    lucide.createIcons();
    openCatDrawer(); $('#ncName').focus();
  }
});

$('#ncCreate').addEventListener('click', () => {
  const name = $('#ncName').value.trim();
  if (!name) { toast('Enter a category name', 'info'); return; }
  if (editName) {
    const c = CATS.find(x => x.name === editName);
    if (c) { c.name = name; }
    toast(`Saved “${name}”`);
  } else {
    if (CATS.some(x => x.name.toLowerCase() === name.toLowerCase())) { toast('That category already exists', 'info'); return; }
    CATS.push({ name, pinned: false, order: CATS.length });
    toast(`Added “${name}”`);
  }
  saveCats(); resetCatForm(); closeCatDrawer(); renderCats();
});

/* ---- drag-and-drop reorder ---- */
let dragName = null;
const catBodyEl = $('#catBody');
catBodyEl.addEventListener('mousedown', (e) => {
  const tr = e.target.closest('tr');
  if (tr && e.target.closest('[data-handle]')) tr.setAttribute('draggable', 'true');
});
catBodyEl.addEventListener('mouseup', () => $$('#catBody tr').forEach(tr => tr.removeAttribute('draggable')));
catBodyEl.addEventListener('dragstart', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  dragName = tr.dataset.name; tr.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
});
catBodyEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  const tr = e.target.closest('tr'); if (!tr || !tr.dataset.name || tr.dataset.name === dragName) return;
  const r = tr.getBoundingClientRect();
  const below = e.clientY > r.top + r.height / 2;
  $$('#catBody tr').forEach(x => x.classList.remove('drop-above', 'drop-below'));
  tr.classList.add(below ? 'drop-below' : 'drop-above');
});
catBodyEl.addEventListener('drop', (e) => {
  e.preventDefault();
  const tr = e.target.closest('tr'); if (!tr || !dragName || !tr.dataset.name || tr.dataset.name === dragName) return;
  const targetName = tr.dataset.name;
  const below = tr.classList.contains('drop-below');
  const from = CATS.findIndex(c => c.name === dragName);
  const item = CATS.splice(from, 1)[0];
  let to = CATS.findIndex(c => c.name === targetName);
  if (below) to++;
  CATS.splice(to, 0, item);
  CATS.forEach((c, i) => c.order = i);
  saveCats();
  renderCats();
  toast(`Reordered “${item.name}”`, 'arrow-up-down');
});
catBodyEl.addEventListener('dragend', () => {
  dragName = null;
  $$('#catBody tr').forEach(x => { x.classList.remove('dragging', 'drop-above', 'drop-below'); x.removeAttribute('draggable'); });
});

/* dismiss reorder hint */
$('#reorderHintX')?.addEventListener('click', () => {
  $('#reorderHint').style.display = 'none';
  store.set('catReorderHintDismissed', true);
});
if (store.get('catReorderHintDismissed', false)) $('#reorderHint').style.display = 'none';

renderCats();

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  Bookmark,
  Sparkles,
  GripVertical,
  CheckCheck,
  Edit2,
  Trash2,
  X,
  Save,
  SearchX,
  MoveVertical,
  ArrowUpDown,
  FolderPlus,
  Star,
  Pencil
} from 'lucide-react';
import { useManager } from '../layout';

function CategoriesPageContent() {
  const router = useRouter();
  const { categories: contextCategories, loading, refreshCategories, lang, t } = useManager();
  
  const [categories, setCategories] = useState([]);
  const [savingCategory, setSavingCategory] = useState(false);
  const [showReorderHint, setShowReorderHint] = useState(true);
  
  // Drawer state
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');

  // Drag and drop states
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    setCategories(contextCategories);
  }, [contextCategories]);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    if (draggedId === id) return;
    e.preventDefault();
  };

  const handleDrop = async (e, id) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;

    const draggedIdx = categories.findIndex(c => c._id === draggedId);
    const targetIdx = categories.findIndex(c => c._id === id);

    if (draggedIdx !== -1 && targetIdx !== -1) {
      const updated = [...categories];
      const [draggedItem] = updated.splice(draggedIdx, 1);
      updated.splice(targetIdx, 0, draggedItem);

      // Re-assign ordering fields sequentially
      updated.forEach((cat, index) => {
        cat.order = index;
      });

      setCategories(updated);

      // Persist sorting changes to server API
      try {
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reorderedIds: updated.map(c => c._id)
          })
        });
        if (res.ok) {
          refreshCategories();
        } else {
          console.error('Failed to persist categories sorting order');
          refreshCategories(); // Revert on failure
        }
      } catch (err) {
        console.error('Failed to save category order', err);
        refreshCategories(); // Revert on failure
      }
    }
    setDraggedId(null);
  };

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleCategorySubmit = async () => {
    if (!catName.trim() || savingCategory) return;

    setSavingCategory(true);
    try {
      if (editingCategory) {
        // Edit Category
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory._id,
            name: catName,
            lang: lang
          })
        });
        if (res.ok) {
          refreshCategories();
          closeCategoryDrawer();
          triggerToast(t('Saved "{catName}"').replace('{catName}', catName));
        } else {
          alert(t('Failed saving category changes'));
        }
      } else {
        // Add Category
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: catName, lang: lang })
        });
        const data = await res.json();
        if (res.ok) {
          setCategories([...categories, data.category]);
          refreshCategories();
          closeCategoryDrawer();
          triggerToast(t('Created "{catName}"').replace('{catName}', catName));
        } else {
          alert(data.error || t('Failed adding category'));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleTogglePinCategory = async (category) => {
    const newPinnedState = !category.isPinned;
    
    // 1. Optimistic Update
    setCategories(prev => prev.map(c => {
      if (c._id === category._id) {
        return { ...c, isPinned: newPinnedState };
      }
      if (newPinnedState === true) {
        return { ...c, isPinned: false }; // only one category can be pinned at a time
      }
      return c;
    }));

    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category._id, isPinned: newPinnedState })
      });

      if (res.ok) {
        triggerToast(newPinnedState ? t('Category pinned storefront!') : t('Category unpinned'));
        refreshCategories();
      } else {
        refreshCategories();
        alert(t('Failed to update category pin status'));
      }
    } catch (e) {
      console.error(e);
      refreshCategories();
      alert(t('Error updating category pin status'));
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(t('Delete category "{name}"? Products inside this category won\'t be deleted but will lose this category reference.').replace('{name}', name))) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== id));
        refreshCategories();
        triggerToast(t('Deleted "{name}"').replace('{name}', name));
      } else {
        alert(t('Failed deleting category'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadCategoryForEdit = (category) => {
    setEditingCategory(category);
    setCatName(category.name[lang] || category.name.en || '');
    setIsCategoryOpen(true);
  };

  const closeCategoryDrawer = () => {
    setEditingCategory(null);
    setCatName('');
    setIsCategoryOpen(false);
  };

  const renderSkeletonCategories = () => (
    <div className="card">
      <div className="toolbar" style={{ justifyContent: 'space-between', opacity: 0.5 }}>
        <div className="skeleton" style={{ width: '120px', height: '24px', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px' }}></div>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Category</th>
            <th style={{ textAlign: 'center', width: '120px' }}>Pinned</th>
            <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map(i => (
            <tr key={i}>
              <td><div className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '4px' }}></div></td>
              <td>
                <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px', marginBottom: '6px' }}></div>
                <div className="skeleton" style={{ width: '80px', height: '12px', borderRadius: '4px' }}></div>
              </td>
              <td><div style={{ display: 'flex', justifyContent: 'center' }}><div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div></div></td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
                  <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="fade-in">
      
      {/* Title */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('Categories & Starred')}</h1>
          <p className="page-sub">{t('Organise your menu into sections and promote starred categories on the storefront.')}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setCatName('');
            setIsCategoryOpen(true);
          }}
        >
          <Plus className="ic" />
          <span>{t('Add category')}</span>
        </button>
      </div>

      <section>
        {loading ? (
          renderSkeletonCategories()
        ) : (
          <div className="card">
            
            {/* Header toolbar */}
            <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <Layers className="ic" style={{ color: 'var(--text-muted)' }} />
                <span>{t('Categories')}</span>
              </div>
              <span className="card-note" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {categories.length} {t('categories')}
              </span>
            </div>

            {/* Reorder hint strip */}
            {showReorderHint && (
              <div className="reorder-hint">
                <MoveVertical className="ic" />
                <span>{t('Drag the')} <span className="grip-chip"><GripVertical className="ic" /></span> {t('handle on any row to reorder your categories.')}</span>
                <button 
                  className="x" 
                  onClick={() => setShowReorderHint(false)}
                  title={t('Got it')}
                >
                  <X className="ic" />
                </button>
              </div>
            )}

            {/* Categories list table */}
            <table className="tbl">
              <thead>
                <tr>
                  <th className="drag-col" title={t('Drag rows to reorder')} style={{ width: '40px' }}>
                    <ArrowUpDown style={{ width: '14px', height: '14px', color: 'var(--ink-3)' }} />
                  </th>
                  <th>{t('Category')}</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>{t('Pinned')}</th>
                  <th style={{ textAlign: 'right', width: '120px' }}>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: 'var(--ink-3)' }}>
                      <SearchX style={{ width: '26px', height: '26px', display: 'block', margin: '0 auto 8px' }} />
                      <div style={{ fontWeight: 600 }}>{t('No categories found. Click add category to start.')}</div>
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => (
                    <tr 
                      key={c._id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, c._id)}
                      onDragOver={(e) => handleDragOver(e, c._id)}
                      onDrop={(e) => handleDrop(e, c._id)}
                      className={draggedId === c._id ? 'dragging' : ''}
                    >
                      <td className="drag-col">
                        <span className="drag-handle" title="Drag to reorder">
                          <GripVertical className="ic" />
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{c.name[lang] || c.name.en || ''}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {Object.keys(c.name)
                            .filter(l => l !== lang && c.name[l])
                            .map(l => `${l.toUpperCase()}: ${c.name[l]}`)
                            .join(' · ')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          type="button"
                          className={`star ${c.isPinned ? 'on' : ''}`}
                          onClick={() => handleTogglePinCategory(c)}
                          title={c.isPinned ? 'Pinned Main storefront' : 'Pin to storefront header'}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'inline-grid',
                            placeItems: 'center',
                            margin: '0 auto'
                          }}
                        >
                          <Star className="ic" fill={c.isPinned ? "gold" : "none"} style={{ color: c.isPinned ? '#eab308' : '#9ca3af', width: '20px', height: '20px' }} />
                        </button>
                      </td>
                      <td>
                        <div className="row gap8" style={{ justifyContent: 'flex-end' }}>
                          <button 
                            className="iconbtn" 
                            onClick={() => loadCategoryForEdit(c)}
                            title="Edit"
                          >
                            <Pencil className="ic" />
                          </button>
                          <button 
                            className="iconbtn del" 
                            onClick={() => handleDeleteCategory(c._id, c.name[lang] || c.name.en)}
                            title="Delete"
                          >
                            <Trash2 className="ic" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        )}
      </section>

      {/* ============================================================
          SLIDE DRAWER: ADD / EDIT CATEGORY
          ============================================================ */}
      <div className={`drawer-scrim ${isCategoryOpen ? 'open' : ''}`} onClick={closeCategoryDrawer}></div>
      <aside className={`drawer ${isCategoryOpen ? 'open' : ''}`}>
        <div className="rail-head">
          <FolderPlus className="ic" />
          <h3>{editingCategory ? t('Edit category') : t('Add category')}</h3>
          <button className="x" onClick={closeCategoryDrawer} title={t('Close')}>
            <X className="ic" />
          </button>
        </div>

        <div className="rail-body">
          <div className="field">
            <label className="label">{t('Category name')}</label>
            <input 
              className="input" 
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Desserts" 
            />
          </div>

          <button 
            className="btn btn-primary btn-block btn-lg"
            onClick={handleCategorySubmit}
            disabled={savingCategory}
            style={{ marginTop: '24px' }}
          >
            <Save className="ic" />
            <span>{savingCategory ? t('Saving...') : (editingCategory ? t('Save changes') : t('Create category'))}</span>
          </button>
        </div>
      </aside>

    </div>
  );
}

export default function ManagerCategoriesPage() {
  return (
    <Suspense fallback={
      <div className="fade-in">
        <div className="page-head">
          <div>
            <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
          </div>
          <div className="skeleton" style={{ width: '130px', height: '40px', borderRadius: '10px' }} />
        </div>
        <div className="card">
          <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '18px 22px' }}>
            <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '4px' }} />
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Category</th>
                <th style={{ textAlign: 'center', width: '120px' }}>Pinned</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map(i => (
                <tr key={i}>
                  <td><div className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '4px' }}></div></td>
                  <td>
                    <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px', marginBottom: '6px' }}></div>
                    <div className="skeleton" style={{ width: '80px', height: '12px', borderRadius: '4px' }}></div>
                  </td>
                  <td><div style={{ display: 'flex', justifyContent: 'center' }}><div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '50%' }}></div></div></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
                      <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    }>
      <CategoriesPageContent />
    </Suspense>
  );
}

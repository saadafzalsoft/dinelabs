'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Ruler,
  PlusCircle,
  MinusCircle,
  Info
} from 'lucide-react';
import { useManager } from '../layout';

function AddonsPageContent() {
  const router = useRouter();
  const { modifierGroups: contextModifierGroups, loading, refreshModifierGroups, lang } = useManager();

  const [modifierGroups, setModifierGroups] = useState([]);

  // Form states: Modifier Group
  const [isModifierOpen, setIsModifierOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('variations'); // 'variations' | 'addons' | 'removals'
  const [groupOptions, setGroupOptions] = useState([{ name: '', price: '0.00' }]);
  const [savingGroup, setSavingGroup] = useState(false);

  useEffect(() => {
    setModifierGroups(contextModifierGroups);
  }, [contextModifierGroups]);

  useEffect(() => {
    refreshModifierGroups();
  }, [refreshModifierGroups]);

  const fetchModifierGroups = () => {
    refreshModifierGroups();
  };

  const triggerToast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const clearGroupForm = () => {
    setEditingGroup(null);
    setGroupName('');
    setGroupType('variations');
    setGroupOptions([{ name: '', price: '0.00' }]);
  };

  const closeModifierDrawer = () => {
    clearGroupForm();
    setIsModifierOpen(false);
  };

  const handleAddOptionRow = () => {
    setGroupOptions([...groupOptions, { name: '', price: '0.00' }]);
  };

  const handleRemoveOptionRow = (index) => {
    setGroupOptions(groupOptions.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index, field, value) => {
    setGroupOptions(groupOptions.map((opt, idx) => {
      if (idx === index) {
        return { ...opt, [field]: value };
      }
      return opt;
    }));
  };

  const handleGroupSubmit = async () => {
    if (!groupName.trim() || groupOptions.length === 0 || savingGroup) return;

    const filteredOptions = groupOptions.filter(o => o.name.trim() !== '');
    if (filteredOptions.length === 0) {
      alert('Must include at least one option.');
      return;
    }

    setSavingGroup(true);
    try {
      const payload = {
        name: groupName,
        type: groupType,
        options: filteredOptions,
        lang: lang
      };

      if (editingGroup) {
        // Edit modifier group
        const res = await fetch('/api/modifier-groups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingGroup._id,
            ...payload
          })
        });

        if (res.ok) {
          fetchModifierGroups();
          closeModifierDrawer();
          triggerToast(`Saved "${groupName}"`);
        } else {
          alert('Failed saving modifier group changes');
        }
      } else {
        // Add modifier group
        const res = await fetch('/api/modifier-groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          setModifierGroups([...modifierGroups, data.modifierGroup]);
          refreshModifierGroups();
          closeModifierDrawer();
          triggerToast(`Created "${groupName}"`);
        } else {
          alert(data.error || 'Failed creating modifier group');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDeleteGroup = async (id, name) => {
    if (!confirm(`Delete modifier group "${name}" permanently? Reference to this group will be automatically removed from all products.`)) return;

    try {
      const res = await fetch('/api/modifier-groups', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setModifierGroups(modifierGroups.filter(g => g._id !== id));
        refreshModifierGroups();
        triggerToast(`Deleted "${name}"`);
      } else {
        alert('Failed deleting modifier group');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadGroupForEdit = (group) => {
    setEditingGroup(group);
    setGroupName(group.name[lang] || group.name.en || '');
    setGroupType(group.type);
    
    const optionsForForm = group.options.map(o => ({
      name: typeof o.name === 'object' ? (o.name[lang] || o.name.en || '') : o.name,
      price: o.price.toString()
    }));
    setGroupOptions(optionsForForm);
    setIsModifierOpen(true);
  };

  const renderSkeletonModifiers = () => (
    <div className="card">
      <div className="toolbar" style={{ justifyContent: 'space-between', opacity: 0.5 }}>
        <div className="skeleton" style={{ width: '150px', height: '24px', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px' }}></div>
      </div>
      <div className="card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', backgroundColor: 'var(--bg)' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="mod-card" style={{ opacity: 0.7 }}>
            <div className="mod-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: '100px', height: '16px', borderRadius: '4px' }}></div>
              <div className="skeleton" style={{ width: '60px', height: '18px', borderRadius: '12px' }}></div>
            </div>
            <div className="mod-opts" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '4px' }}></div>
              <div className="skeleton" style={{ width: '80px', height: '20px', borderRadius: '4px' }}></div>
              <div className="skeleton" style={{ width: '50px', height: '20px', borderRadius: '4px' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
              <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
              <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      
      {/* Title */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Modifier Add-ons</h1>
          <p className="page-sub">Create and configure variations, extras, and ingredient exclusions for storefront customization.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            clearGroupForm();
            setIsModifierOpen(true);
          }}
        >
          <Plus className="ic" />
          <span>Add group</span>
        </button>
      </div>

      <section>
        {loading ? (
          renderSkeletonModifiers()
        ) : (
          <div className="card">
            
            {/* Header toolbar */}
            <div className="card-head" style={{ borderBottom: '1px solid var(--line)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <SlidersHorizontal className="ic" style={{ color: 'var(--text-muted)' }} />
                <span>Modifier Groups</span>
              </div>
              <span className="card-note" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {modifierGroups.length} groups
              </span>
            </div>

            {/* Modifiers List mapping cards */}
            <div className="card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', padding: '20px' }}>
              {modifierGroups.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--ink-3)', gridColumn: '1 / -1' }}>
                  No modifier groups created yet. Click Add group to get started.
                </div>
              ) : (
                modifierGroups.map(grp => (
                  <div key={grp._id} className="mod-card" style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '180px' }}>
                    <div className="mod-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <span className="mod-title" style={{ fontWeight: '700', fontSize: '1rem' }}>{grp.name[lang] || grp.name.en}</span>
                      <span className="pill pill-soft" style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', textTransform: 'uppercase' }}>
                        {grp.type === 'variations' ? 'Sizes' : grp.type === 'addons' ? 'Add-on' : 'Removal'}
                      </span>
                    </div>

                    <div className="mod-opts" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flexGrow: 1, alignContent: 'flex-start', marginBottom: '16px' }}>
                      {grp.options?.map((opt, oIdx) => {
                        const nameLabel = typeof opt.name === 'object' ? (opt.name[lang] || opt.name.en || '') : opt.name;
                        return (
                          <span key={oIdx} className="tag" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', backgroundColor: '#f3f4f6', color: '#1f2937', fontWeight: '600' }}>
                            {nameLabel} {parseFloat(opt.price) > 0 ? `(+$${parseFloat(opt.price).toFixed(2)})` : ''}
                          </span>
                        );
                      })}
                    </div>

                    <div className="row gap8" style={{ justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                      <button 
                        className="iconbtn" 
                        onClick={() => loadGroupForEdit(grp)}
                        title="Edit"
                      >
                        <Pencil className="ic" />
                      </button>
                      <button 
                        className="iconbtn del" 
                        onClick={() => handleDeleteGroup(grp._id, grp.name[lang] || grp.name.en)}
                        title="Delete"
                      >
                        <Trash2 className="ic" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}
      </section>

      {/* ============================================================
          SLIDE DRAWER: ADD / EDIT MODIFIER GROUP
          ============================================================ */}
      <div className={`drawer-scrim ${isModifierOpen ? 'open' : ''}`} onClick={closeModifierDrawer}></div>
      <aside className={`drawer ${isModifierOpen ? 'open' : ''}`}>
        <div className="rail-head">
          <SlidersHorizontal className="ic" />
          <h3>{editingGroup ? 'Edit modifier group' : 'New modifier group'}</h3>
          <button className="x" onClick={closeModifierDrawer} title="Close">
            <X className="ic" />
          </button>
        </div>

        <div className="rail-body">
          <div className="field">
            <label className="label">Group name</label>
            <input 
              className="input" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Choose Size" 
            />
          </div>

          <div className="field">
            <label className="label">Type</label>
            <div className="type-picker" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button 
                type="button" 
                className={`type-card ${groupType === 'variations' ? 'on' : ''}`}
                onClick={() => setGroupType('variations')}
              >
                <span className="tc-ic"><Ruler className="ic" /></span>
                <span className="tc-lbl">Variations</span>
              </button>
              <button 
                type="button" 
                className={`type-card ${groupType === 'addons' ? 'on' : ''}`}
                onClick={() => setGroupType('addons')}
              >
                <span className="tc-ic"><PlusCircle className="ic" /></span>
                <span className="tc-lbl">Add-ons</span>
              </button>
              <button 
                type="button" 
                className={`type-card ${groupType === 'removals' ? 'on' : ''}`}
                onClick={() => setGroupType('removals')}
              >
                <span className="tc-ic"><MinusCircle className="ic" /></span>
                <span className="tc-lbl">Removals</span>
              </button>
            </div>
          </div>

          <div className="nm-hint" style={{ display: 'flex', gap: '8px', padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', margin: '16px 0', fontSize: '0.78rem', color: '#1e40af' }}>
            <Info className="ic" style={{ flexShrink: 0, width: '16px', height: '16px' }} />
            <span>
              {groupType === 'variations' && 'Variations forces customers to pick exactly one option (e.g. sizes) that defines the base price.'}
              {groupType === 'addons' && 'Add-ons lets visitors select multiple optional ingredients for an extra price.'}
              {groupType === 'removals' && 'Removals lets customers strike out default ingredients for free.'}
            </span>
          </div>

          <div className="field">
            <label className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Options</span>
              <button 
                type="button" 
                onClick={handleAddOptionRow}
                style={{ background: 'none', border: 'none', color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                + Add Option
              </button>
            </label>

            <div className="opt-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {groupOptions.map((opt, idx) => (
                <div key={idx} className="opt-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    className="input" 
                    value={opt.name}
                    onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                    placeholder={groupType === 'variations' ? "e.g. Large" : groupType === 'addons' ? "e.g. Extra Cheese" : "e.g. No Onions"}
                    style={{ height: '36px', fontSize: '0.8rem', flex: 2 }}
                  />
                  {groupType !== 'removals' && (
                    <div className="input-affix" style={{ flex: 1 }}>
                      <span className="pfx" style={{ fontSize: '12px' }}>$</span>
                      <input 
                        className="input" 
                        value={opt.price}
                        onChange={(e) => handleOptionChange(idx, 'price', e.target.value)}
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        style={{ height: '36px', fontSize: '0.8rem', paddingLeft: '20px' }}
                      />
                    </div>
                  )}
                  {groupOptions.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveOptionRow(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-primary btn-block btn-lg"
            onClick={handleGroupSubmit}
            disabled={savingGroup}
            style={{ marginTop: '24px' }}
          >
            <Save className="ic" />
            <span>{savingGroup ? 'Saving...' : (editingGroup ? 'Save changes' : 'Create group')}</span>
          </button>
        </div>
      </aside>

    </div>
  );
}

export default function ManagerAddonsPage() {
  return (
    <Suspense fallback={
      <div className="fade-in">
        <div className="page-head">
          <div>
            <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
          </div>
          <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '10px' }} />
        </div>
        <div className="card">
          <div className="toolbar" style={{ justifyContent: 'space-between', opacity: 0.5, padding: '16px 20px', display: 'flex' }}>
            <div className="skeleton" style={{ width: '150px', height: '24px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '4px' }}></div>
          </div>
          <div className="card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', padding: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="mod-card" style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff', opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div className="skeleton" style={{ width: '100px', height: '16px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '60px', height: '18px', borderRadius: '12px' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '80px', height: '20px', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                  <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                  <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <AddonsPageContent />
    </Suspense>
  );
}

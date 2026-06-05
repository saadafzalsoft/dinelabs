'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'products'; // 'products' | 'categories' | 'addons'

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection / Bulk state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Editing state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // Form states: Product
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCatIds, setProdCatIds] = useState([]);
  const [prodImage, setProdImage] = useState('');
  const [prodModGroups, setProdModGroups] = useState([]);
  const [savingProduct, setSavingProduct] = useState(false);

  // Form states: Category
  const [catName, setCatName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Form states: Modifier Group
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('variations'); // 'variations' | 'addons' | 'removals'
  const [groupOptions, setGroupOptions] = useState([{ name: '', price: '0.00' }]);
  const [savingGroup, setSavingGroup] = useState(false);

  // Inline modifier creation form states
  const [showInlineMod, setShowInlineMod] = useState(false);
  const [inlineModName, setInlineModName] = useState('');
  const [inlineModType, setInlineModType] = useState('variations');
  const [inlineModOptions, setInlineModOptions] = useState([{ name: '', price: '0.00' }]);
  const [creatingInlineMod, setCreatingInlineMod] = useState(false);

  const handleCreateInlineMod = async (e) => {
    e.preventDefault();
    if (!inlineModName || inlineModOptions.length === 0 || creatingInlineMod) return;

    const filteredOptions = inlineModOptions.filter(o => o.name.trim() !== '');
    if (filteredOptions.length === 0) {
      alert('Must include at least one option.');
      return;
    }

    setCreatingInlineMod(true);
    try {
      const res = await fetch('/api/modifier-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inlineModName,
          type: inlineModType,
          options: filteredOptions
        })
      });
      const data = await res.json();
      if (res.ok) {
        setModifierGroups([...modifierGroups, data.modifierGroup]);
        setProdModGroups([...prodModGroups, data.modifierGroup._id]);
        
        // Clear fields
        setInlineModName('');
        setInlineModType('variations');
        setInlineModOptions([{ name: '', price: '0.00' }]);
        setShowInlineMod(false);
      } else {
        alert(data.error || 'Failed creating inline modifier group');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingInlineMod(false);
    }
  };

  // Load all catalog data
  const fetchCatalogData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      const catRes = await fetch('/api/categories');
      const modRes = await fetch('/api/modifier-groups');

      if (prodRes.ok && catRes.ok && modRes.ok) {
        setProducts(await prodRes.json());
        setCategories(await catRes.json());
        setModifierGroups(await modRes.json());
      }
    } catch (err) {
      console.error('Error fetching catalog data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(x => x !== id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Image file size is too large. Please select an image under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProdImage(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  // Bulk mutations
  const handleBulkAction = async () => {
    if (selectedIds.length === 0 || !bulkAction) return;

    try {
      let payload = {
        isBulkAction: true,
        productIds: selectedIds
      };

      if (bulkAction === 'stock-in') {
        payload.isAvailable = true;
      } else if (bulkAction === 'stock-out') {
        payload.isAvailable = false;
      } else if (bulkAction.startsWith('cat-')) {
        const catId = bulkAction.substring(4);
        payload.categories = [catId];
      } else if (bulkAction === 'delete') {
        const delRes = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isBulkAction: true, productIds: selectedIds })
        });
        if (delRes.ok) {
          setProducts(products.filter(p => !selectedIds.includes(p._id)));
          setSelectedIds([]);
          setBulkAction('');
        }
        return;
      }

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setProducts(products.map(p => {
          if (selectedIds.includes(p._id)) {
            const updated = { ...p };
            if (payload.isAvailable !== undefined) updated.isAvailable = payload.isAvailable;
            if (payload.categories !== undefined) updated.categories = payload.categories;
            return updated;
          }
          return p;
        }));
        setSelectedIds([]);
        setBulkAction('');
      } else {
        alert('Failed performing bulk action');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product._id, isAvailable: !product.isAvailable })
      });
      if (res.ok) {
        setProducts(products.map(p => p._id === product._id ? { ...p, isAvailable: !p.isAvailable } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || savingProduct) return;

    setSavingProduct(true);
    try {
      if (editingProduct) {
        // Edit product
        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProduct._id,
            name: prodName,
            price: parseFloat(prodPrice),
            description: prodDesc,
            categories: prodCatIds,
            imageUrl: prodImage || '/assets/cheese_pizza.png',
            modifierGroups: prodModGroups
          })
        });

        if (res.ok) {
          fetchCatalogData();
          clearProductForm();
        } else {
          alert('Failed saving changes');
        }
      } else {
        // Add product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: prodName,
            price: parseFloat(prodPrice),
            description: prodDesc,
            categories: prodCatIds,
            imageUrl: prodImage || '/assets/cheese_pizza.png',
            modifierGroups: prodModGroups
          })
        });

        const data = await res.json();
        if (res.ok) {
          setProducts([...products, data.product]);
          clearProductForm();
        } else {
          alert(data.error || 'Failed adding product');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}" permanently?`)) return;

    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert('Failed deleting product');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadProductForEdit = (product) => {
    setEditingProduct(product);
    setProdName(product.name.en || '');
    setProdPrice(product.price.toString());
    setProdDesc(product.description?.en || '');
    setProdCatIds(product.categories || []);
    setProdImage(product.imageUrl || '');
    setProdModGroups(product.modifierGroups || []);
  };

  const clearProductForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdCatIds([]);
    setProdImage('');
    setProdModGroups([]);
  };

  // Category submission
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catName || savingCategory) return;

    setSavingCategory(true);
    try {
      if (editingCategory) {
        // Edit Category
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory._id,
            name: catName
          })
        });
        if (res.ok) {
          fetchCatalogData();
          clearCategoryForm();
        } else {
          alert('Failed saving category changes');
        }
      } else {
        // Add Category
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: catName })
        });
        const data = await res.json();
        if (res.ok) {
          setCategories([...categories, data.category]);
          clearCategoryForm();
        } else {
          alert(data.error || 'Failed adding category');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleTogglePinCategory = async (category) => {
    try {
      const newPinnedState = !category.isPinned;
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category._id, isPinned: newPinnedState })
      });

      if (res.ok) {
        setCategories(categories.map(c => {
          if (c._id === category._id) {
            return { ...c, isPinned: newPinnedState };
          }
          if (newPinnedState === true) {
            return { ...c, isPinned: false };
          }
          return c;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`Delete category "${name}"? Products inside this category won't be deleted but will lose this category reference.`)) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== id));
        fetchCatalogData(); // reload products to reflect pulled categories
      } else {
        alert('Failed deleting category');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadCategoryForEdit = (category) => {
    setEditingCategory(category);
    setCatName(category.name.en || '');
  };

  const clearCategoryForm = () => {
    setEditingCategory(null);
    setCatName('');
  };

  // Addons submission (Modifier Groups)
  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || groupOptions.length === 0 || savingGroup) return;

    const filteredOptions = groupOptions.filter(o => o.name.trim() !== '');
    if (filteredOptions.length === 0) {
      alert('Must include at least one option.');
      return;
    }

    setSavingGroup(true);
    try {
      if (editingGroup) {
        // Edit modifier group
        const res = await fetch('/api/modifier-groups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingGroup._id,
            name: groupName,
            type: groupType,
            options: filteredOptions
          })
        });

        if (res.ok) {
          fetchCatalogData();
          clearGroupForm();
        } else {
          alert('Failed saving modifier group changes');
        }
      } else {
        // Add modifier group
        const res = await fetch('/api/modifier-groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: groupName,
            type: groupType,
            options: filteredOptions
          })
        });

        const data = await res.json();
        if (res.ok) {
          setModifierGroups([...modifierGroups, data.modifierGroup]);
          clearGroupForm();
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
        fetchCatalogData(); // reload products to reflect pulled modifier groups references
      } else {
        alert('Failed deleting modifier group');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadGroupForEdit = (group) => {
    setEditingGroup(group);
    setGroupName(group.name.en || '');
    setGroupType(group.type);
    
    // Options name maps to option.name.en or option.name
    const optionsForForm = group.options.map(o => ({
      name: typeof o.name === 'object' ? (o.name.en || '') : o.name,
      price: o.price.toString()
    }));
    setGroupOptions(optionsForForm);
  };

  const clearGroupForm = () => {
    setEditingGroup(null);
    setGroupName('');
    setGroupType('variations');
    setGroupOptions([{ name: '', price: '0.00' }]);
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

  const formatPrice = (amount) => {
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  const switchTab = (newTab) => {
    router.push(`/manager/products?tab=${newTab}`);
  };

  if (loading) {
    return <h3>Loading catalog details...</h3>;
  }

  return (
    <div>
      {/* Top Tab Bar switcher */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
        {[
          { id: 'products', name: '🍕 Products catalog' },
          { id: 'categories', name: '📋 Categories & Starred' },
          { id: 'addons', name: '➕ Modifier Add-ons' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: '700',
              padding: '12px 24px',
              cursor: 'pointer',
              color: tab === t.id ? 'var(--text-main)' : 'var(--text-muted)',
              borderBottom: tab === t.id ? '3px solid var(--brand-red)' : '3px solid transparent',
              transition: 'var(--transition-smooth)',
              marginRight: '8px'
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px' }}>
        
        {/* ============================================================
            TAB 1: PRODUCTS LIST
            ============================================================ */}
        {tab === 'products' && (
          <>
            {/* Left Products Table */}
            <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
              
              {/* Bulk Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                  {selectedIds.length} items selected
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={bulkAction} 
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="form-control"
                    style={{ padding: '8px 12px', fontSize: '0.8rem', width: '200px' }}
                  >
                    <option value="">-- Choose Bulk Action --</option>
                    <option value="stock-in">Mark In Stock</option>
                    <option value="stock-out">Mark Out Of Stock</option>
                    <option value="delete">Delete Selected</option>
                    <optgroup label="Mass Assign Category">
                      {categories.map(c => (
                        <option key={c._id} value={`cat-${c._id}`}>{c.name.en}</option>
                      ))}
                    </optgroup>
                  </select>
                  <button 
                    onClick={handleBulkAction}
                    disabled={selectedIds.length === 0 || !bulkAction}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--text-main)', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', opacity: (selectedIds.length === 0 || !bulkAction) ? 0.5 : 1 }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Products Grid Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>
                      <input 
                        type="checkbox"
                        checked={products.length > 0 && selectedIds.length === products.length}
                        onChange={handleSelectAll}
                        style={{ width: '16px', height: '16px' }}
                      />
                    </th>
                    <th style={{ padding: '12px' }}>Product</th>
                    <th style={{ padding: '12px' }}>Categories</th>
                    <th style={{ padding: '12px' }}>Modifiers Mapping</th>
                    <th style={{ padding: '12px' }}>Base Price</th>
                    <th style={{ padding: '12px' }}>Availability</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px' }}>
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(product._id)}
                          onChange={(e) => handleSelectOne(product._id, e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                      </td>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={product.imageUrl} alt={product.name?.en} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: '700' }}>{product.name?.en}</div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{product.name?.ar}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {product.categories?.map(cId => {
                          const cat = categories.find(c => c._id === cId);
                          return cat ? (
                            <span key={cId} style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold', marginRight: '4px' }}>
                              {cat.name?.en}
                            </span>
                          ) : null;
                        })}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {product.modifierGroups?.map(mId => {
                          const grp = modifierGroups.find(g => g._id === mId);
                          return grp ? (
                            <span key={mId} style={{ display: 'inline-block', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold', marginRight: '4px', marginBottom: '2px' }}>
                              {grp.name?.en}
                            </span>
                          ) : null;
                        })}
                        {(!product.modifierGroups || product.modifierGroups.length === 0) && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontWeight: '700' }}>{formatPrice(product.price)}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleToggleStock(product)}
                          style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            backgroundColor: product.isAvailable ? '#d1fae5' : '#fee2e2',
                            color: product.isAvailable ? '#10b981' : '#ef4444'
                          }}
                        >
                          {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => loadProductForEdit(product)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            title="Edit Product"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name?.en)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Product Form */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', height: 'fit-content' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{editingProduct ? '✏️ Edit Product' : '🍕 Add New Product'}</span>
                {editingProduct && (
                  <button onClick={clearProductForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </h4>
              <form onSubmit={handleProductSubmit}>
                <div className="form-group">
                  <label className="form-label">English Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Pepperoni Feast"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    placeholder="14.99"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    required
                  />
                </div>
                
                {/* Categories Checkboxes mapping */}
                <div className="form-group">
                  <label className="form-label">Product Categories</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto', border: '1px solid #d1d5db', padding: '10px', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)' }}>
                    {categories.map(cat => (
                      <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          checked={prodCatIds.includes(cat._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProdCatIds([...prodCatIds, cat._id]);
                            } else {
                              setProdCatIds(prodCatIds.filter(x => x !== cat._id));
                            }
                          }}
                        />
                        <span>{cat.name?.en}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Modifier Groups Checkboxes mapping */}
                <div className="form-group">
                  <label className="form-label">Add-on Modifier Groups</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto', border: '1px solid #d1d5db', padding: '10px', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', marginBottom: '8px' }}>
                    {modifierGroups.map(grp => (
                      <label key={grp._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          checked={prodModGroups.includes(grp._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProdModGroups([...prodModGroups, grp._id]);
                            } else {
                              setProdModGroups(prodModGroups.filter(x => x !== grp._id));
                            }
                          }}
                        />
                        <span>{grp.name?.en} ({grp.type})</span>
                      </label>
                    ))}
                  </div>

                  {/* Toggle inline modifier creator */}
                  {!showInlineMod ? (
                    <button
                      type="button"
                      onClick={() => setShowInlineMod(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                    >
                      ⚡ Create Modifier Inline
                    </button>
                  ) : (
                    <div style={{ border: '1px dashed var(--brand-red)', borderRadius: '12px', padding: '12px', marginTop: '10px', backgroundColor: '#fffdfd' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.78rem', color: 'var(--brand-red)' }}>Create Modifier Inline</strong>
                        <button
                          type="button"
                          onClick={() => setShowInlineMod(false)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="form-group" style={{ marginBottom: '8px' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Group Name (e.g. Choose Size)"
                          value={inlineModName}
                          onChange={(e) => setInlineModName(e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '8px' }}>
                        <select
                          className="form-control"
                          value={inlineModType}
                          onChange={(e) => setInlineModType(e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        >
                          <option value="variations">Variations (Mandatory Size/Price)</option>
                          <option value="addons">Addons (Optional Extra Price)</option>
                          <option value="removals">Remove Ingredients (Optional Free)</option>
                        </select>
                      </div>

                      {/* Options list for inline modifier */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Options</span>
                          <button
                            type="button"
                            onClick={() => setInlineModOptions([...inlineModOptions, { name: '', price: '0.00' }])}
                            style={{ background: 'none', border: 'none', color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '0.72rem', cursor: 'pointer' }}
                          >
                            + Add Option
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {inlineModOptions.map((opt, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Medium"
                                value={opt.name}
                                onChange={(e) => {
                                  setInlineModOptions(inlineModOptions.map((o, i) => i === idx ? { ...o, name: e.target.value } : o));
                                }}
                                style={{ padding: '4px 8px', fontSize: '0.72rem', flex: 2 }}
                              />
                              {inlineModType !== 'removals' && (
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control"
                                  placeholder="0.00"
                                  value={opt.price}
                                  onChange={(e) => {
                                    setInlineModOptions(inlineModOptions.map((o, i) => i === idx ? { ...o, price: e.target.value } : o));
                                  }}
                                  style={{ padding: '4px 8px', fontSize: '0.72rem', flex: 1 }}
                                />
                              )}
                              {inlineModOptions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setInlineModOptions(inlineModOptions.filter((_, i) => i !== idx))}
                                  style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateInlineMod}
                        disabled={creatingInlineMod}
                        className="checkout-btn"
                        style={{ fontSize: '0.72rem', padding: '6px 12px', height: 'auto', width: 'auto' }}
                      >
                        {creatingInlineMod ? 'Creating...' : '✓ Create & Map'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Image drag & drop picker */}
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ 
                      flexGrow: 1, 
                      border: '2px dashed #d1d5db', 
                      borderRadius: '12px', 
                      padding: '12px', 
                      textAlign: 'center', 
                      position: 'relative',
                      backgroundColor: 'var(--bg-secondary)',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          opacity: 0, 
                          cursor: 'pointer' 
                        }} 
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        📷 Choose Image File
                      </span>
                    </div>
                    {prodImage && (
                      <div style={{ position: 'relative', width: '54px', height: '54px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                        <img src={prodImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button"
                          onClick={() => setProdImage('')}
                          style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="2"
                    placeholder="Enter ingredients description"
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="checkout-btn"
                  disabled={savingProduct}
                  style={{ fontSize: '0.85rem', padding: '10px' }}
                >
                  {savingProduct ? 'Saving details...' : (editingProduct ? 'Save Changes' : 'Create Product')}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ============================================================
            TAB 2: CATEGORIES LIST
            ============================================================ */}
        {tab === 'categories' && (
          <>
            {/* Left Categories Table */}
            <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Order</th>
                    <th style={{ padding: '12px' }}>Category Name</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Promoted / Pinned</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{cat.order}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '700' }}>{cat.name?.en}</div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cat.name?.ar}</span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleTogglePinCategory(cat)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            opacity: cat.isPinned ? 1 : 0.2
                          }}
                          title={cat.isPinned ? 'Promoted (Top of Storefront)' : 'Pin promotion'}
                        >
                          ⭐
                        </button>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => loadCategoryForEdit(cat)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            title="Edit Category"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id, cat.name?.en)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            title="Delete Category"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Category Form */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', height: 'fit-content' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{editingCategory ? '✏️ Edit Category' : '📋 Add Category'}</span>
                {editingCategory && (
                  <button onClick={clearCategoryForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </h4>
              <form onSubmit={handleCategorySubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Category Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Desserts"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="checkout-btn"
                  disabled={savingCategory}
                  style={{ fontSize: '0.85rem', padding: '10px' }}
                >
                  {savingCategory ? 'Saving changes...' : (editingCategory ? 'Save Changes' : 'Create Category')}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ============================================================
            TAB 3: MODIFIER ADD-ONS LIST
            ============================================================ */}
        {tab === 'addons' && (
          <>
            {/* Left Modifiers Table */}
            <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Group Name</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Options List</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modifierGroups.map(group => (
                    <tr key={group._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '700' }}>{group.name?.en}</div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{group.name?.ar}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {group.type === 'variations' ? (
                          <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                            Mandatory Sizes
                          </span>
                        ) : group.type === 'addons' ? (
                          <span style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                            Premium Addon
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                            Ingredient Removal
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {group.options?.map((opt, idx) => (
                            <span key={idx} style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '500' }}>
                              {typeof opt.name === 'object' ? opt.name.en : opt.name} {opt.price > 0 ? `(+${formatPrice(opt.price)})` : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => loadGroupForEdit(group)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            title="Edit Group"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(group._id, group.name?.en)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            title="Delete Group"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Addons Form */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', height: 'fit-content' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{editingGroup ? '✏️ Edit Modifier' : '➕ Add Modifier Group'}</span>
                {editingGroup && (
                  <button onClick={clearGroupForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </h4>
              <form onSubmit={handleGroupSubmit}>
                <div className="form-group">
                  <label className="form-label">Modifier Group Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Premium Addons"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Modifier Type</label>
                  <select
                    className="form-control"
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value)}
                  >
                    <option value="variations">Variations (Mandatory Size/Price)</option>
                    <option value="addons">Addons (Optional Extra Price)</option>
                    <option value="removals">Remove Ingredients (Optional Zero Price)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Group Options</span>
                    <button type="button" onClick={handleAddOptionRow} style={{ background: 'none', border: 'none', color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>
                      + Add Option
                    </button>
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    {groupOptions.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Extra Cheese"
                          value={opt.name}
                          onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                          required
                          style={{ flex: 2, padding: '8px 12px', fontSize: '0.8rem' }}
                        />
                        {groupType !== 'removals' && (
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            placeholder="Price"
                            value={opt.price}
                            onChange={(e) => handleOptionChange(idx, 'price', e.target.value)}
                            required
                            style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                          />
                        )}
                        {groupOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionRow(idx)}
                            style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="checkout-btn"
                  disabled={savingGroup}
                  style={{ fontSize: '0.85rem', padding: '10px' }}
                >
                  {savingGroup ? 'Saving changes...' : (editingGroup ? 'Save Changes' : 'Create Modifier')}
                </button>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function ManagerProductsPage() {
  return (
    <Suspense fallback={<h3>Loading catalog details...</h3>}>
      <ProductsPageContent />
    </Suspense>
  );
}

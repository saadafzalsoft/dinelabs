'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Upload,
  Plus,
  Layers,
  MoveVertical,
  GripVertical,
  ArrowUpDown,
  Check,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  ImageUp,
  UploadCloud,
  FileDown,
  ArrowUpRight,
  Sparkles,
  SearchX,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Save,
  FolderPlus,
  SlidersHorizontal,
  Star,
  Ruler,
  MinusCircle,
  Info,
  FileSpreadsheet
} from 'lucide-react';
import { useManager } from '../layout';
import SearchSelect from '../../components/SearchSelect';

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = 'products'; // Fixed to products page, other tabs removed

  const {
    products: contextProducts,
    categories: contextCategories,
    modifierGroups: contextModifierGroups,
    loading,
    refreshProducts,
    refreshCategories,
    refreshModifierGroups,
    lang,
    tenantSettings,
    t
  } = useManager();

  const currency = tenantSettings?.baseCurrency || 'USD';
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    LBP: 'LBP ',
    AED: 'AED ',
    SAR: 'SR ',
    QAR: 'QR ',
    KWD: 'KD ',
    BHD: 'BD ',
    OMR: 'RO '
  };
  const currencySymbol = currencySymbols[currency] || (currency + ' ');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);

  useEffect(() => {
    setProducts(contextProducts);
    setCategories(contextCategories);
    setModifierGroups(contextModifierGroups);
  }, [contextProducts, contextCategories, contextModifierGroups]);

  const fetchCatalogData = () => {
    refreshProducts();
    refreshCategories();
    refreshModifierGroups();
  };

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [selectedAvailFilter, setSelectedAvailFilter] = useState('');

  // Selection / Bulk state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Drawers Open State
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isModifierOpen, setIsModifierOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Reorder hint display
  const [showReorderHint, setShowReorderHint] = useState(true);

  // Form states: Product
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscountedPrice, setProdDiscountedPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCatIds, setProdCatIds] = useState([]);
  const [prodImage, setProdImage] = useState('');
  const [prodModGroups, setProdModGroups] = useState([]);
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodVariations, setProdVariations] = useState([]);
  const [prodAddons, setProdAddons] = useState([]);
  const [prodRemovals, setProdRemovals] = useState([]);
  const [savingProduct, setSavingProduct] = useState(false);

  // Form states: Category
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Form states: Modifier Group
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('variations'); // 'variations' | 'addons' | 'removals'
  const [groupOptions, setGroupOptions] = useState([{ name: '', price: '0.00' }]);
  const [savingGroup, setSavingGroup] = useState(false);

  // Bulk file parser states
  const [bulkFileRows, setBulkFileRows] = useState([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef(null);

  // Drag and drop states
  const [draggedId, setDraggedId] = useState(null);
  const [draggedType, setDraggedType] = useState(null);

  const handleDragStart = (e, id, type) => {
    setDraggedId(id);
    setDraggedType(type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id, type) => {
    if (draggedType !== type) return;
    e.preventDefault();
  };

  const handleDrop = async (e, targetId, type) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId || draggedType !== type) return;

    if (type === 'category') {
      const fromIndex = categories.findIndex(c => c._id === draggedId);
      const toIndex = categories.findIndex(c => c._id === targetId);
      if (fromIndex !== -1 && toIndex !== -1) {
        const updated = [...categories];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setCategories(updated);

        try {
          const reorderedIds = updated.map(c => c._id);
          const res = await fetch('/api/categories', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reorderedIds })
          });
          if (res.ok) {
            triggerToast(t('Categories reordered successfully'));
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else if (type === 'product') {
      const fromIndex = products.findIndex(p => p._id === draggedId);
      const toIndex = products.findIndex(p => p._id === targetId);
      if (fromIndex !== -1 && toIndex !== -1) {
        const updated = [...products];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setProducts(updated);

        try {
          const reorderedIds = updated.map(p => p._id);
          const res = await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reorderedIds })
          });
          if (res.ok) {
            triggerToast(t('Products reordered successfully'));
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    setDraggedId(null);
    setDraggedType(null);
  };



  const triggerToast = (msg, icon) => {
    const el = document.createElement('div');
    el.className = 'toast-wrap';
    el.innerHTML = `<div class="toast"><span class="ic">✓</span><span>${msg}</span></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  // Selection / Bulk handlers
  const handleSelectAll = () => {
    const filteredIds = getFilteredProducts().map(p => p._id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleImageUploadClick = () => {
    // Hidden file input trigger for catalog image uploading
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 3 * 1024 * 1024) {
        alert(t('Image file size is too large. Please select an image under 3MB.'));
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          setProdImage(uploadData.url);
          triggerToast(t('Image uploaded successfully!'), 'image');
        } else {
          const uploadData = await uploadRes.json();
          alert(t('Upload failed: ') + (uploadData.error || t('Unknown error')));
        }
      } catch (err) {
        console.error(err);
        alert(t('Failed to upload image'));
      }
    };
    input.click();
  };

  // Bulk actions
  const handleBulkApply = async () => {
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
      } else if (bulkAction.startsWith('set-category:')) {
        const catId = bulkAction.split(':')[1];
        const promises = selectedIds.map(pId => {
          return fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: pId, categories: [catId] })
          });
        });
        await Promise.all(promises);

        setProducts(products.map(p => {
          if (selectedIds.includes(p._id)) {
            return { ...p, categories: [catId] };
          }
          return p;
        }));

        setSelectedIds([]);
        setBulkAction('');
        triggerToast(t('Updated categories for selected products'));
        return;
      } else if (bulkAction.startsWith('add-modifier:')) {
        const mgId = bulkAction.split(':')[1];
        const promises = selectedIds.map(pId => {
          const product = products.find(p => p._id === pId);
          if (!product) return Promise.resolve();
          const currentGroups = product.modifierGroups || [];
          if (currentGroups.includes(mgId)) return Promise.resolve();
          return fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: pId, modifierGroups: [...currentGroups, mgId] })
          });
        });
        await Promise.all(promises);

        setProducts(products.map(p => {
          if (selectedIds.includes(p._id)) {
            const currentGroups = p.modifierGroups || [];
            if (!currentGroups.includes(mgId)) {
              return { ...p, modifierGroups: [...currentGroups, mgId] };
            }
          }
          return p;
        }));

        setSelectedIds([]);
        setBulkAction('');
        triggerToast(t('Added modifier group to selected products'));
        return;
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
          triggerToast(t('Deleted selected products'));
        }
        return;
      } else if (bulkAction === 'add-to-offers' || bulkAction === 'remove-from-offers') {
        const offersCat = categories.find(c => {
          const enName = c.name?.en?.toLowerCase() || '';
          return enName.includes('offers') || enName.includes('promotion') || c.isPinned;
        });
        if (!offersCat) {
          alert(t('Offers & Promotions category not found'));
          return;
        }

        const isAdding = bulkAction === 'add-to-offers';
        const promises = selectedIds.map(pId => {
          const product = products.find(p => p._id === pId);
          if (!product) return Promise.resolve();
          const currentCats = product.categories || [];
          let newCats;
          if (isAdding) {
            if (currentCats.includes(offersCat._id)) return Promise.resolve();
            newCats = [...currentCats, offersCat._id];
          } else {
            if (!currentCats.includes(offersCat._id)) return Promise.resolve();
            newCats = currentCats.filter(id => id !== offersCat._id);
          }
          
          return fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: pId, categories: newCats })
          });
        });

        await Promise.all(promises);

        setProducts(products.map(p => {
          if (selectedIds.includes(p._id)) {
            const currentCats = p.categories || [];
            let newCats = currentCats;
            if (isAdding) {
              if (!currentCats.includes(offersCat._id)) newCats = [...currentCats, offersCat._id];
            } else {
              newCats = currentCats.filter(id => id !== offersCat._id);
            }
            return { ...p, categories: newCats };
          }
          return p;
        }));

        setSelectedIds([]);
        setBulkAction('');
        triggerToast(isAdding ? t('Products added to Offers & Promotions') : t('Products removed from Offers & Promotions'));
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
            return updated;
          }
          return p;
        }));
        setSelectedIds([]);
        setBulkAction('');
        triggerToast(t('Updated {count} items').replace('{count}', selectedIds.length));
      } else {
        alert(t('Failed performing bulk action'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStock = async (product) => {
    const nextStockState = !product.isAvailable;
    // Optimistic UI update
    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isAvailable: nextStockState } : p));
    triggerToast(t('{productName} marked {state}').replace('{productName}', t(product.name)).replace('{state}', nextStockState ? t('in stock') : t('out of stock')));

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product._id, isAvailable: nextStockState })
      });
      if (!res.ok) {
        // Rollback
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isAvailable: !nextStockState } : p));
        triggerToast(t('Failed to update stock state'));
      }
    } catch (e) {
      console.error(e);
      // Rollback
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isAvailable: !nextStockState } : p));
      triggerToast(t('Failed to update stock state'));
    }
  };

  const handleToggleFeatured = async (product) => {
    const nextFeaturedState = !product.isFeatured;
    // Optimistic UI update
    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: nextFeaturedState } : p));
    triggerToast(t('{productName} {state}').replace('{productName}', t(product.name)).replace('{state}', nextFeaturedState ? t('marked as featured') : t('removed from featured')));

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product._id, isFeatured: nextFeaturedState })
      });
      if (!res.ok) {
        // Rollback
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: !nextFeaturedState } : p));
        triggerToast(t('Failed to update featured state'));
      }
    } catch (e) {
      console.error(e);
      // Rollback
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: !nextFeaturedState } : p));
      triggerToast(t('Failed to update featured state'));
    }
  };

  // Product variations state helpers
  const handleAddVariationRow = () => {
    setProdVariations([...prodVariations, { name: '', price: '0.00' }]);
  };
  const handleRemoveVariationRow = (index) => {
    setProdVariations(prodVariations.filter((_, idx) => idx !== index));
  };
  const handleVariationChange = (index, field, value) => {
    setProdVariations(prodVariations.map((v, idx) => idx === index ? { ...v, [field]: value } : v));
  };

  // Product addons state helpers
  const handleAddAddonRow = () => {
    setProdAddons([...prodAddons, { name: '', price: '0.00' }]);
  };
  const handleRemoveAddonRow = (index) => {
    setProdAddons(prodAddons.filter((_, idx) => idx !== index));
  };
  const handleAddonChange = (index, field, value) => {
    setProdAddons(prodAddons.map((a, idx) => idx === index ? { ...a, [field]: value } : a));
  };

  // Product removals state helpers
  const handleAddRemovalRow = () => {
    setProdRemovals([...prodRemovals, { name: '' }]);
  };
  const handleRemoveRemovalRow = (index) => {
    setProdRemovals(prodRemovals.filter((_, idx) => idx !== index));
  };
  const handleRemovalChange = (index, value) => {
    setProdRemovals(prodRemovals.map((r, idx) => idx === index ? { ...r, name: value } : r));
  };

  // Product submission
  const handleProductSubmit = async () => {
    if (!prodName || !prodPrice || savingProduct) {
      alert(t('Please fill out name and price.'));
      return;
    }

    setSavingProduct(true);
    try {
      const payload = {
        name: prodName,
        price: parseFloat(prodPrice),
        description: prodDesc,
        categories: prodCatIds,
        imageUrl: prodImage || '',
        modifierGroups: prodModGroups,
        isFeatured: prodIsFeatured,
        variations: prodVariations.filter(v => v.name.trim() !== ''),
        addons: prodAddons.filter(a => a.name.trim() !== ''),
        removals: prodRemovals.filter(r => r.name.trim() !== ''),
        discountedPrice: prodDiscountedPrice ? parseFloat(prodDiscountedPrice) : 0,
        lang: lang
      };

      if (editingProduct) {
        // Edit product
        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProduct._id,
            ...payload
          })
        });

        const data = await res.json();
        if (res.ok) {
          fetchCatalogData();
          closeProductDrawer();
          triggerToast(t('Saved "{name}"').replace('{name}', prodName));
        } else {
          alert(t(data.error || 'Failed saving changes'));
        }
      } else {
        // Add product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          setProducts([data.product, ...products]);
          closeProductDrawer();
          triggerToast(t('Created "{name}"').replace('{name}', prodName));
        } else {
          alert(t(data.error || 'Failed adding product'));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(t('Delete "{name}" permanently?').replace('{name}', name))) return;

    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        triggerToast(t('Deleted "{name}"').replace('{name}', name));
      } else {
        alert(t('Failed deleting product'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadProductForEdit = (product) => {
    setEditingProduct(product);
    setProdName(product.name[lang] || product.name.en || '');
    setProdPrice(product.price.toString());
    setProdDiscountedPrice(product.discountedPrice ? product.discountedPrice.toString() : '');
    setProdDesc(product.description?.[lang] || product.description?.en || '');
    setProdCatIds(product.categories || []);
    setProdImage(product.imageUrl || '');
    setProdModGroups(product.modifierGroups || []);
    setProdIsFeatured(product.isFeatured || false);
    setProdVariations(
      (product.variations || []).map(v => ({
        name: typeof v.name === 'object' ? (v.name[lang] || v.name.en || '') : (v.name || ''),
        price: v.price?.toString() || '0.00'
      }))
    );
    setProdAddons(
      (product.addons || []).map(a => ({
        name: typeof a.name === 'object' ? (a.name[lang] || a.name.en || '') : (a.name || ''),
        price: a.price?.toString() || '0.00'
      }))
    );
    setProdRemovals(
      (product.removals || []).map(r => ({
        name: typeof r.name === 'object' ? (r.name[lang] || r.name.en || '') : (r.name || '')
      }))
    );
    setIsProductOpen(true);
  };

  const closeProductDrawer = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdCatIds([]);
    setProdImage('');
    setProdModGroups([]);
    setProdIsFeatured(false);
    setProdVariations([]);
    setProdAddons([]);
    setProdRemovals([]);
    setIsProductOpen(false);
  };

  // Category submission
  const handleCategorySubmit = async () => {
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
            name: catName,
            lang: lang
          })
        });
        if (res.ok) {
          fetchCatalogData();
          closeCategoryDrawer();
          triggerToast(`Saved "${catName}"`);
        } else {
          alert('Failed saving category changes');
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
          closeCategoryDrawer();
          triggerToast(`Created "${catName}"`);
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
            return { ...c, isPinned: false }; // only one categories can be pinned main storefront top
          }
          return c;
        }));
        triggerToast(newPinnedState ? t('Category pinned storefront!') : t('Category unpinned'));
      }
    } catch (e) {
      console.error(e);
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
        fetchCatalogData(); // reload products to reflect pulled categories
        triggerToast(`Deleted "${name}"`);
      } else {
        alert('Failed deleting category');
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

  // Modifier Groups submission
  const handleGroupSubmit = async () => {
    if (!groupName || groupOptions.length === 0 || savingGroup) return;

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
          fetchCatalogData();
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
    if (!confirm(t('Delete modifier group "{name}" permanently? Reference to this group will be automatically removed from all products.').replace('{name}', name))) return;

    try {
      const res = await fetch('/api/modifier-groups', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setModifierGroups(modifierGroups.filter(g => g._id !== id));
        fetchCatalogData(); // reload products to reflect pulled modifier groups references
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
    
    // Options name maps to option.name[lang] || option.name.en or option.name
    const optionsForForm = group.options.map(o => ({
      name: typeof o.name === 'object' ? (o.name[lang] || o.name.en || '') : o.name,
      price: o.price.toString()
    }));
    setGroupOptions(optionsForForm);
    setIsModifierOpen(true);
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

  // Bulk Upload File Handler
  const handleBulkFileTemplate = () => {
    const csv = 'name,category,price,short description,modifiers\nMargherita,Classic Pizzas,12.50,"Classic margherita pizza with fresh basil, mozzarella, and tomato sauce",Crust;Toppings\nCaesar Salad,Sides & Appetizers,8.00,"Crispy romaine lettuce, parmesan cheese, and caesar dressing",Dressing\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'product-template.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    triggerToast(t('Template CSV downloaded!'), 'file-down');
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length === 0) {
          alert(t('CSV file is empty'));
          return;
        }

        const parseCSVLine = (line) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const rawHeader = lines.shift() || '';
        const head = parseCSVLine(rawHeader.replace(/^\uFEFF/, '')).map(s => s.toLowerCase().trim());
        
        const parsed = lines.map(line => {
          const cells = parseCSVLine(line);
          const row = {};
          head.forEach((h, i) => {
            row[h] = cells[i] || '';
          });
          return row;
        });
        
        setBulkFileRows(parsed);
      } catch (err) {
        console.error(err);
        alert(t('Could not parse template CSV file.'));
      }
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (bulkFileRows.length === 0 || importing) return;

    setImporting(true);
    setImportedCount(0);
    let successCount = 0;
    try {
      for (const row of bulkFileRows) {
        if (!row.name) {
          setImportedCount(prev => prev + 1);
          continue;
        }
        
        // Find mapped category IDs or create temporary ones, or match by name
        let matchedCatIds = [];
        if (row.category) {
          const match = categories.find(c => c.name.en.toLowerCase() === row.category.toLowerCase());
          if (match) matchedCatIds.push(match._id);
        }

        // Parse modifiers column if it exists
        let matchedModifierGroups = [];
        if (row.modifiers) {
          const modNames = row.modifiers.split(';').map(m => m.trim().toLowerCase());
          modNames.forEach(name => {
            const match = modifierGroups.find(mg => mg.name.en.toLowerCase() === name);
            if (match) matchedModifierGroups.push(match._id);
          });
        }

        // Map short description or other description variants
        const descriptionText = (
          row['short description'] || 
          row['short_description'] || 
          row['description'] || 
          row['product description'] || 
          row['desc'] || 
          ''
        ).trim();

        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.name,
            price: parseFloat(row.price) || 0,
            description: descriptionText,
            categories: matchedCatIds,
            imageUrl: '',
            modifierGroups: matchedModifierGroups,
            isAvailable: true
          })
        });
        successCount++;
        setImportedCount(successCount);
      }

      fetchCatalogData();
      closeBulkDrawer();
      triggerToast(t('Imported {count} products!').replace('{count}', successCount));
    } catch (e) {
      console.error(e);
      alert(t('Error importing file rows'));
    } finally {
      setImporting(false);
      setImportedCount(0);
    }
  };

  const closeBulkDrawer = () => {
    setBulkFileRows([]);
    setBulkFileName('');
    setImporting(false);
    setImportedCount(0);
    setIsBulkOpen(false);
  };

  // Products filtering logic
  const getFilteredProducts = () => {
    return products.filter(p => {
      const nameMatch = searchQuery === '' || (p.name[lang] || p.name.en)?.toLowerCase().includes(searchQuery.toLowerCase());
      const catMatch = selectedCatFilter === '' || p.categories?.includes(selectedCatFilter);
      const availMatch = selectedAvailFilter === '' || 
        (selectedAvailFilter === 'in' ? p.isAvailable : !p.isAvailable);

      return nameMatch && catMatch && availMatch;
    });
  };

  const getProductsGroupedByCategory = () => {
    const list = getFilteredProducts();
    const groups = {};

    categories.forEach(c => {
      groups[c._id] = {
        categoryId: c._id,
        categoryName: c.name[lang] || c.name.en || '',
        list: []
      };
    });
    
    groups['uncategorized'] = {
      categoryId: 'uncategorized',
      categoryName: 'Uncategorized',
      list: []
    };

    list.forEach(p => {
      if (!p.categories || p.categories.length === 0) {
        groups['uncategorized'].list.push(p);
      } else {
        p.categories.forEach(catId => {
          const match = categories.find(c => c._id === catId);
          if (match && groups[match._id]) {
            if (!groups[match._id].list.some(x => x._id === p._id)) {
              groups[match._id].list.push(p);
            }
          }
        });
      }
    });

    return Object.values(groups).filter(g => g.list.length > 0);
  };

  const groupedCategoryData = getProductsGroupedByCategory();

  const switchTab = (newTab) => {
    router.push(`/manager/products?tab=${newTab}`);
  };

  const renderSkeletonTable = () => (
    <div className="card">
      <div className="toolbar" style={{ height: '48px', opacity: 0.5 }}>
        <div className="skeleton" style={{ width: '200px', height: '36px', borderRadius: '8px' }}></div>
        <div className="skeleton" style={{ width: '150px', height: '36px', borderRadius: '8px', marginLeft: '12px' }}></div>
        <div className="skeleton" style={{ width: '150px', height: '36px', borderRadius: '8px', marginLeft: '12px' }}></div>
        <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px', marginLeft: 'auto' }}></div>
      </div>
      <div style={{ overflowX: 'auto', marginTop: '16px' }}>
        <table className="tbl" style={{ minWidth: '720px' }}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th style={{ width: '40px' }}></th>
              <th>{t('Product')}</th>
              <th>{t('Modifiers')}</th>
              <th>{t('Price')}</th>
              <th>{t('Availability')}</th>
              <th style={{ textAlign: 'right' }}>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i}>
                <td><div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div></td>
                <td><div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '8px' }}></div>
                    <div>
                      <div className="skeleton" style={{ width: '140px', height: '16px', borderRadius: '4px', marginBottom: '6px' }}></div>
                      <div className="skeleton" style={{ width: '220px', height: '12px', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </td>
                <td><div className="skeleton" style={{ width: '80px', height: '18px', borderRadius: '12px' }}></div></td>
                <td><div className="skeleton" style={{ width: '50px', height: '16px', borderRadius: '4px' }}></div></td>
                <td><div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '12px' }}></div></td>
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
  );

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
            <th>{t('Category')}</th>
            <th style={{ textAlign: 'center', width: '120px' }}>{t('Promoted')}</th>
            <th style={{ textAlign: 'right', width: '120px' }}>{t('Actions')}</th>
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
          <h1 className="page-title">{t('Products catalog')}</h1>
          <p className="page-sub">{t('Manage your menu items, prices, modifiers and availability.')}</p>
        </div>
      </div>

      {/* ============================================================
          TAB 1: PRODUCTS LIST
          ============================================================ */}
      {tab === 'products' && (
        <section>
          {loading ? (
            renderSkeletonTable()
          ) : (
            <div className="card">
              
              {/* Toolbar */}
              <div className="toolbar">
                <div className="tb-search">
                  <Search className="ic" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Search products…')} 
                  />
                </div>

                {/* Category filter select */}
                <SearchSelect
                  value={selectedCatFilter}
                  onChange={setSelectedCatFilter}
                  options={[
                    { value: '', label: t('All categories') },
                    ...categories.map(c => ({ value: c._id, label: c.name[lang] || c.name.en }))
                  ]}
                  placeholder={t('All categories')}
                  style={{ width: '180px' }}
                />

                {/* Availability filter select */}
                <SearchSelect
                  value={selectedAvailFilter}
                  onChange={setSelectedAvailFilter}
                  options={[
                    { value: '', label: t('All availability') },
                    { value: 'in', label: t('In stock') },
                    { value: 'out', label: t('Out of stock') }
                  ]}
                  placeholder={t('All availability')}
                  style={{ width: '160px' }}
                />

                {/* Buttons */}
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsBulkOpen(true)}
                  style={{ marginLeft: 'auto' }}
                >
                  <Upload className="ic" />
                  <span>{t('Bulk upload')}</span>
                </button>
                
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    resetRail();
                    setIsProductOpen(true);
                  }}
                >
                  <Plus className="ic" />
                  <span>{t('Add product')}</span>
                </button>
              </div>

              {/* Reorder hint strip */}
              {showReorderHint && (
                <div className="reorder-hint">
                  <MoveVertical className="ic" />
                  <span>{t('Drag the')} <span className="grip-chip"><GripVertical className="ic" /></span> {t('handle on any row to reorder your products.')}</span>
                  <button 
                    className="x" 
                    onClick={() => setShowReorderHint(false)}
                    title={t('Got it')}
                  >
                    <X className="ic" />
                  </button>
                </div>
              )}

              {/* Bulk Toolbar overlay */}
              {selectedIds.length > 0 && (
                <div className="bulkbar armed">
                  <span className="bb-count">{selectedIds.length} {t('selected')}</span>
                  <div style={{ flex: 1 }}></div>
                  
                  {/* Dropdown 1: General Actions / Status */}
                  <SearchSelect
                    value={['stock-in', 'stock-out', 'add-to-offers', 'remove-from-offers', 'delete'].includes(bulkAction) ? bulkAction : ''}
                    onChange={setBulkAction}
                    options={[
                      { value: '', label: t('Bulk action…') },
                      { value: 'stock-in', label: t('Mark in stock') },
                      { value: 'stock-out', label: t('Mark out of stock') },
                      { value: 'add-to-offers', label: t('Add to Offers & Promotions') },
                      { value: 'remove-from-offers', label: t('Remove from Offers & Promotions') },
                      { value: 'delete', label: t('Delete selected') }
                    ]}
                    placeholder={t('Bulk action…')}
                    style={{ width: '200px' }}
                  />

                  {/* Dropdown 2: Category Assignment */}
                  <SearchSelect
                    value={bulkAction.startsWith('set-category:') ? bulkAction : ''}
                    onChange={setBulkAction}
                    options={[
                      { value: '', label: t('Assign Category') },
                      ...categories.map(c => ({
                        value: `set-category:${c._id}`,
                        label: c.name[lang] || c.name.en
                      }))
                    ]}
                    placeholder={t('Assign Category')}
                    style={{ width: '180px' }}
                  />

                  {/* Dropdown 3: Add-ons / Modifiers Assignment */}
                  <SearchSelect
                    value={bulkAction.startsWith('add-modifier:') ? bulkAction : ''}
                    onChange={setBulkAction}
                    options={[
                      { value: '', label: t('Assign Add-ons') },
                      ...modifierGroups.map(mg => ({
                        value: `add-modifier:${mg._id}`,
                        label: `${mg.name[lang] || mg.name.en} (${t(mg.type === 'variations' ? 'Sizes' : mg.type === 'addons' ? 'Add-on' : 'Removal')})`
                      }))
                    ]}
                    placeholder={t('Assign Add-ons')}
                    style={{ width: '220px' }}
                  />

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleBulkApply}
                    disabled={!bulkAction}
                  >
                    {t('Apply')}
                  </button>
                </div>
              )}

              {/* Catalog Grid Table */}
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl" style={{ minWidth: '720px' }}>
                  <thead>
                    <tr>
                      <th className="drag-col" title={t('Drag rows to reorder')}>
                        <ArrowUpDown style={{ width: '14px', height: '14px', color: 'var(--ink-3)' }} />
                      </th>
                      <th style={{ width: '42px' }}>
                        <span 
                          className={`check ${getFilteredProducts().length > 0 && getFilteredProducts().every(p => selectedIds.includes(p._id)) ? 'on' : ''}`}
                          onClick={handleSelectAll}
                        >
                          <Check className="ic" />
                        </span>
                      </th>
                      <th>{t('Product')}</th>
                      <th>{t('Category')}</th>
                      <th>{t('Price')}</th>
                      <th>{t('Availability')}</th>
                      <th style={{ textAlign: 'right' }}>{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCategoryData.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: 'var(--ink-3)' }}>
                          <SearchX style={{ width: '26px', height: '26px', display: 'block', margin: '0 auto 8px' }} />
                          <div style={{ fontWeight: 600 }}>No products match your filters.</div>
                        </td>
                      </tr>
                    ) : (
                      groupedCategoryData.map(group => (
                        <React.Fragment key={group.categoryId}>
                          {/* Category Row header in table */}
                          <tr className="cat-row">
                            <td colSpan="7">
                              <div className="cat-row-inner">
                                <span className="cat-name">{t(group.categoryName)}</span>
                                <span className="cat-count">
                                  {group.list.length} {group.list.length === 1 ? t('product') : t('products')}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Product Rows list */}
                          {group.list.map(p => {
                            const isSelected = selectedIds.includes(p._id);
                            return (
                              <tr 
                                key={p._id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, p._id, 'product')}
                                onDragOver={(e) => handleDragOver(e, p._id, 'product')}
                                onDrop={(e) => handleDrop(e, p._id, 'product')}
                                className={draggedId === p._id ? 'dragging' : ''}
                              >
                                <td className="drag-col">
                                  <span className="drag-handle" title="Drag to reorder">
                                    <GripVertical className="ic" />
                                  </span>
                                </td>
                                
                                <td>
                                  <span 
                                    className={`check ${isSelected ? 'on' : ''}`}
                                    onClick={() => handleSelectOne(p._id)}
                                  >
                                    <Check className="ic" />
                                  </span>
                                </td>

                                <td>
                                  <div className="p-cell">
                                    <span className="thumb">
                                      {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name[lang] || p.name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      ) : (
                                        <img src="/assets/No Image Icon.svg" alt="No image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      )}
                                    </span>
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div className="p-name">{p.name[lang] || p.name.en}</div>
                                      </div>
                                      <div className="mut3" style={{ fontSize: '12px' }}>{p.description?.[lang] || p.description?.en || t('No description')}</div>
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxWidth: '240px' }}>
                                    {p.categories?.length > 0 ? (
                                      p.categories.map(catId => {
                                        const matchedCat = categories.find(c => c._id === catId);
                                        return matchedCat ? (
                                          <span key={catId} className="tag" style={{ backgroundColor: 'var(--pos-bg)', color: 'var(--pos)', borderColor: 'transparent', fontWeight: '600' }}>
                                            {matchedCat.name[lang] || matchedCat.name.en}
                                          </span>
                                        ) : null;
                                      })
                                    ) : (
                                      <span className="mut3">{t('Uncategorized')}</span>
                                    )}
                                  </div>
                                </td>

                                <td>
                                  {p.discountedPrice && p.discountedPrice > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                      <span className="price tnum" style={{ textDecoration: 'line-through', color: 'var(--ink-3)', fontSize: '0.8em' }}>{currencySymbol}{parseFloat(p.price).toFixed(2)}</span>
                                      <span className="price tnum" style={{ color: '#000000', fontWeight: '700' }}>{currencySymbol}{parseFloat(p.discountedPrice).toFixed(2)}</span>
                                    </div>
                                  ) : (
                                    <span className="price tnum">{currencySymbol}{parseFloat(p.price).toFixed(2)}</span>
                                  )}
                                </td>

                                <td>
                                  <div className="avail-cell">
                                    <label className="switch">
                                      <input 
                                        type="checkbox"
                                        checked={p.isAvailable}
                                        onChange={() => handleToggleStock(p)}
                                      />
                                      <span className="track"></span>
                                    </label>
                                    <span className={`pill ${p.isAvailable ? 'pill-pos' : 'pill-soft'}`} style={{ height: '22px' }}>
                                      <span className="dot"></span>
                                      {p.isAvailable ? t('In stock') : t('Out')}
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  <div className="row gap8" style={{ justifyContent: 'flex-end' }}>
                                    <button 
                                      className="iconbtn" 
                                      onClick={() => loadProductForEdit(p)}
                                      title={t('Edit')}
                                    >
                                      <Pencil className="ic" />
                                    </button>
                                    <button 
                                      className="iconbtn del" 
                                      onClick={() => handleDeleteProduct(p._id, p.name[lang] || p.name.en)}
                                      title={t('Delete')}
                                    >
                                      <Trash2 className="ic" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </section>
      )}



      {/* ============================================================
          SLIDE DRAWER: ADD / EDIT PRODUCT
          ============================================================ */}
      <div className={`drawer-scrim ${isProductOpen ? 'open' : ''}`} onClick={closeProductDrawer}></div>
      <aside className={`drawer ${isProductOpen ? 'open' : ''}`}>
        <div className="rail-head">
          <PlusCircle className="ic" />
          <h3>{editingProduct ? t('Edit product') : t('Add new product')}</h3>
          <button className="x" onClick={closeProductDrawer} title={t('Close')}>
            <X className="ic" />
          </button>
        </div>
        
        <div className="rail-body">
          <div className="field">
            <label className="label">{t('Product name')}</label>
            <input 
              className="input" 
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder={t('e.g. Pepperoni Feast')} 
            />
          </div>

          <div className="field">
            <label className="label">{t('Base price')}</label>
            <div className="input-affix">
              <span className="pfx">{currencySymbol}</span>
              <input 
                className="input" 
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                placeholder="0.00" 
                type="number"
                step="0.01"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">
              {t('Discounted price')}{' '}
              <span style={{ fontWeight: '400', color: 'var(--ink-3)', fontSize: '0.75rem' }}>
                ({t('optional')})
              </span>
            </label>
            <div className="input-affix">
              <span className="pfx">{currencySymbol}</span>
              <input 
                className="input" 
                value={prodDiscountedPrice}
                onChange={(e) => setProdDiscountedPrice(e.target.value)}
                placeholder={t('0.00 (leave empty for no discount)')} 
                type="number"
                step="0.01"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">{t('Categories')}</label>
            <div className="checklist" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {categories.map(c => (
                <label key={c._id} className="chk">
                  <span 
                    className={`check ${prodCatIds.includes(c._id) ? 'on' : ''}`}
                    onClick={() => {
                      if (prodCatIds.includes(c._id)) {
                        setProdCatIds(prodCatIds.filter(x => x !== c._id));
                      } else {
                        setProdCatIds([...prodCatIds, c._id]);
                      }
                    }}
                  >
                    <Check className="ic" />
                  </span>
                  <span>{t(c.name)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">
              {t('Modifier groups')}{' '}
              <span className="opt">&middot; {t('optional')}</span>
            </label>
            <div className="checklist" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {modifierGroups.map(grp => (
                <label key={grp._id} className="chk">
                  <span 
                    className={`check ${prodModGroups.includes(grp._id) ? 'on' : ''}`}
                    onClick={() => {
                      if (prodModGroups.includes(grp._id)) {
                        setProdModGroups(prodModGroups.filter(x => x !== grp._id));
                      } else {
                        setProdModGroups([...prodModGroups, grp._id]);
                      }
                    }}
                  >
                    <Check className="ic" />
                  </span>
                  <span>{t(grp.name)}</span>
                  <span className="meta">{t(grp.type === 'variations' ? 'Sizes' : grp.type === 'addons' ? 'Add-on' : 'Removal')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">
              {t('Product image')}{' '}
              <span className="opt">&middot; {t('optional')}</span>
            </label>
            <div className="dropzone" onClick={handleImageUploadClick}>
              <ImageUp className="ic" />
              <span>{prodImage ? t('Image uploaded!') : t('Click to choose image file')}</span>
            </div>
            {prodImage && (
              <div style={{ marginTop: '10px', position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--line-2)' }}>
                <img src={prodImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => setProdImage('')}
                  style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '2px' }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            )}
          </div>

          <div className="field">
            <label className="label">
              {t('Description')}{' '}
              <span className="opt">&middot; {t('optional')}</span>
            </label>
            <textarea 
              className="input" 
              rows="3"
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              placeholder={t('e.g. Loaded with spicy beef pepperoni...')}
            />
          </div>

          {/* Featured product configuration removed */}

          <hr style={{ border: 'none', borderTop: '1px solid var(--line-2)', margin: '20px 0' }} />

          {/* Product variations */}
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="label" style={{ margin: 0, fontWeight: '800' }}>{t('Product-Level Variations (e.g. Sizes)')}</label>
              <button 
                type="button" 
                onClick={handleAddVariationRow}
                style={{ background: 'none', border: 'none', color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                + {t('Add Size/Price')}
              </button>
            </div>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--ink-3)', marginBottom: '12px' }}>
              {t('These define absolute pricing that overrides the base product price when chosen.')}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prodVariations.map((v, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    className="input" 
                    value={v.name}
                    onChange={(e) => handleVariationChange(idx, 'name', e.target.value)}
                    placeholder={t('e.g. Large')}
                    style={{ flex: 2, height: '36px', fontSize: '0.8rem' }}
                  />
                  <div className="input-affix" style={{ flex: 1 }}>
                    <span className="pfx" style={{ fontSize: '12px' }}>{currencySymbol}</span>
                    <input 
                      className="input" 
                      value={v.price}
                      onChange={(e) => handleVariationChange(idx, 'price', e.target.value)}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      style={{ height: '36px', fontSize: '0.8rem', paddingLeft: '20px' }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveVariationRow(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--line-2)', margin: '20px 0' }} />

          {/* Product-level Add-ons */}
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="label" style={{ margin: 0, fontWeight: '800' }}>{t('Product-Level Add-ons')}</label>
              <button 
                type="button" 
                onClick={handleAddAddonRow}
                style={{ background: 'none', border: 'none', color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                + {t('Add Add-on')}
              </button>
            </div>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--ink-3)', marginBottom: '12px' }}>
              {t('Extra ingredients or customizations for this product with optional extra charge.')}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prodAddons.map((a, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    className="input" 
                    value={a.name}
                    onChange={(e) => handleAddonChange(idx, 'name', e.target.value)}
                    placeholder={t('e.g. Extra Pepperoni')}
                    style={{ flex: 2, height: '36px', fontSize: '0.8rem' }}
                  />
                  <div className="input-affix" style={{ flex: 1 }}>
                    <span className="pfx" style={{ fontSize: '12px' }}>{currencySymbol}</span>
                    <input 
                      className="input" 
                      value={a.price}
                      onChange={(e) => handleAddonChange(idx, 'price', e.target.value)}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      style={{ height: '36px', fontSize: '0.8rem', paddingLeft: '20px' }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveAddonRow(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--line-2)', margin: '20px 0' }} />

          {/* Product-level Removals */}
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="label" style={{ margin: 0, fontWeight: '800' }}>{t('Product-Level Removals')}</label>
              <button 
                type="button" 
                onClick={handleAddRemovalRow}
                style={{ background: 'none', border: 'none', color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                + {t('Add Removal')}
              </button>
            </div>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--ink-3)', marginBottom: '12px' }}>
              {t('Ingredients customers can exclude from the item (e.g. No Onions) for free.')}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prodRemovals.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    className="input" 
                    value={r.name}
                    onChange={(e) => handleRemovalChange(idx, e.target.value)}
                    placeholder={t('e.g. No Onions')}
                    style={{ flex: 1, height: '36px', fontSize: '0.8rem' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRemovalRow(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-primary btn-block btn-lg"
            onClick={handleProductSubmit}
            disabled={savingProduct}
            style={{ marginTop: '24px' }}
          >
            <Save className="ic" />
            <span>{savingProduct ? t('Saving...') : (editingProduct ? t('Save changes') : t('Create product'))}</span>
          </button>
        </div>
      </aside>



      {/* ============================================================
          SLIDE DRAWER: BULK UPLOAD SHEET
          ============================================================ */}
      <div className={`drawer-scrim ${isBulkOpen ? 'open' : ''}`} onClick={importing ? undefined : closeBulkDrawer}></div>
      <aside className={`drawer ${isBulkOpen ? 'open' : ''}`}>
        <div className="rail-head">
          <UploadCloud className="ic" />
          <h3>{t('Bulk upload products')}</h3>
          <button className="x" onClick={importing ? undefined : closeBulkDrawer} title={t('Close')} disabled={importing}>
            <X className="ic" />
          </button>
        </div>

        <div className="rail-body">
          <div className="field" style={{ opacity: importing ? 0.5 : 1, pointerEvents: importing ? 'none' : 'auto' }}>
            <label className="label">{t('Step 1')} &middot; {t('Download the template')}</label>
            <p className="opt" style={{ margin: '0 0 4px' }}>
              {t('Download a template CSV sheet structured with: name, category, price, short description, modifiers.')}
            </p>
            <p className="opt" style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              💡 <b>{t('Note on Modifiers:')}</b> {t('You can assign global modifier groups to imported items by listing their exact names in the modifiers column, separated by semicolons (e.g., Choose Size;Premium Addons;Removals).')}
            </p>
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleBulkFileTemplate}
              disabled={importing}
            >
              <FileDown className="ic" />
              <span>{t('Download CSV template')}</span>
            </button>
          </div>

          <div className="field" style={{ opacity: importing ? 0.5 : 1, pointerEvents: importing ? 'none' : 'auto' }}>
            <label className="label">{t('Step 2')} &middot; {t('Upload your file')}</label>
            <div 
              className="dropzone"
              onClick={() => !importing && fileInputRef.current.click()}
            >
              <FileSpreadsheet className="ic" />
              <span>{bulkFileName ? bulkFileName : t('Drag a .csv file here, or click to browse')}</span>
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleBulkFileChange}
              hidden
              disabled={importing}
            />
          </div>

          {bulkFileRows.length > 0 && (
            <div className="field" style={{ opacity: importing ? 0.5 : 1 }}>
              <label className="label">{t('Preview')} &middot; {bulkFileRows.length} {t('rows')}</label>
              <div style={{ border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto' }}>
                <table className="tbl" style={{ margin: 0, fontSize: '0.75rem' }}>
                  <thead>
                    <tr><th>{t('Name')}</th><th>{t('Category')}</th><th>{t('Price')}</th></tr>
                  </thead>
                  <tbody>
                    {bulkFileRows.slice(0, 5).map((r, rIdx) => (
                      <tr key={rIdx}>
                        <td>{r.name}</td>
                        <td>{r.category}</td>
                        <td>{currencySymbol}{parseFloat(r.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {importing && (
            <div style={{ marginTop: '20px', backgroundColor: 'var(--surface-2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
                <span>{t('Importing Products...')}</span>
                <span>{importedCount} {t('of')} {bulkFileRows.length}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(importedCount / bulkFileRows.length) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--brand-red, #dc2626)',
                  transition: 'width 0.2s ease-out'
                }}></div>
              </div>
            </div>
          )}

          <button 
            className="btn btn-primary btn-block btn-lg"
            onClick={handleBulkImport}
            disabled={bulkFileRows.length === 0 || importing}
            style={{ marginTop: '24px' }}
          >
            <Upload className="ic" />
            <span>{importing ? t('Importing...') : t('Import products')}</span>
          </button>
        </div>
      </aside>

    </div>
  );
}

const resetRail = () => {
  // Global form resets logic handled on triggers
};

export default function ManagerProductsPage() {
  return (
    <Suspense fallback={
      <div className="fade-in">
        <div className="page-head">
          <div>
            <div className="skeleton" style={{ width: '180px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '360px', height: '16px', borderRadius: '4px' }} />
          </div>
        </div>
        <div className="card">
          <div className="toolbar" style={{ height: '48px', opacity: 0.5 }}>
            <div className="skeleton" style={{ width: '200px', height: '36px', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ width: '150px', height: '36px', borderRadius: '8px', marginLeft: '12px' }}></div>
            <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px', marginLeft: 'auto' }}></div>
          </div>
          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
            <table className="tbl" style={{ minWidth: '720px' }}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th style={{ width: '40px' }}></th>
                  <th>Product</th>
                  <th>Modifiers</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td><div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div></td>
                    <td><div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '8px' }}></div>
                        <div>
                          <div className="skeleton" style={{ width: '140px', height: '16px', borderRadius: '4px', marginBottom: '6px' }}></div>
                          <div className="skeleton" style={{ width: '220px', height: '12px', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    </td>
                    <td><div className="skeleton" style={{ width: '80px', height: '18px', borderRadius: '12px' }}></div></td>
                    <td><div className="skeleton" style={{ width: '50px', height: '16px', borderRadius: '4px' }}></div></td>
                    <td><div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '12px' }}></div></td>
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
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { WORLD_LANGUAGES } from '../../lib/constants';
import {
  Menu,
  X,
  Search,
  Plus,
  ShoppingBag,
  Utensils,
  Bike,
  Star,
  FileText,
  ChevronDown,
  Check,
  ShoppingCart,
  SlidersHorizontal
} from 'lucide-react';

export default function StorefrontClient({ tenant, initialProducts, initialCategories, initialModifierGroups }) {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table');

  // State
  const [lang, setLang] = useState(tenant.defaultLanguage || 'en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const LANGUAGES = WORLD_LANGUAGES;
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState('dine-in'); // 'dine-in' | 'pickup' | 'delivery'
  const [tableNo, setTableNo] = useState('');
  
  // Customizer modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalSize, setModalSize] = useState('');
  const [modalAddons, setModalAddons] = useState([]);
  const [modalRemovals, setModalRemovals] = useState([]);
  const [modalQty, setModalQty] = useState(1);
  const [modalNotes, setModalNotes] = useState('');
  const [modalPrice, setModalPrice] = useState(0);

  // Load cart and details from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(`dinelabs_cart_${tenant.slug}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }

    // Table registration
    let currentTable = '';
    if (tableParam) {
      try {
        currentTable = decodeURIComponent(tableParam);
      } catch (e) {
        currentTable = tableParam;
      }
      setTableNo(currentTable);
      localStorage.setItem(`dinelabs_table_${tenant.slug}`, currentTable);
    } else {
      setTableNo('');
      localStorage.removeItem(`dinelabs_table_${tenant.slug}`);
    }

    // Set mode from local storage or pick default
    const savedMode = localStorage.getItem(`dinelabs_mode_${tenant.slug}`);
    if (savedMode) {
      setMode(savedMode);
    } else {
      if (currentTable) {
        setMode('dine-in');
      } else {
        // Pick first enabled mode
        if (tenant.enabledModes.dineIn) setMode('dine-in');
        else if (tenant.enabledModes.pickup) setMode('pickup');
        else if (tenant.enabledModes.delivery) setMode('delivery');
      }
    }
  }, [tableParam, tenant.slug, tenant.enabledModes]);

  // Persist cart to localStorage
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(`dinelabs_cart_${tenant.slug}`, JSON.stringify(newCart));
  };

  // Persist fulfillment mode to localStorage
  const handleModeChange = (newMode) => {
    if (tenant.status !== 'active') return; // Browse only
    setMode(newMode);
    localStorage.setItem(`dinelabs_mode_${tenant.slug}`, newMode);
  };

  // Dynamic price formatter
  const formatPrice = (amount) => {
    if (tenant.baseCurrency === 'LBP') {
      return 'LBP ' + parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  // Helper to resolve translated keys
  const t = (textMap) => {
    if (!textMap) return '';
    return textMap[lang] || textMap['en'] || '';
  };

  // UI dictionary translations
  // UI dictionary translations
  const dictRaw = {
    en: {
      searchPlaceholder: "Search pizzas, sides, beverages...",
      all: "All",
      offers: "Offers & Pinned",
      add: "Add to Cart",
      emptyTitle: "Your basket is empty",
      emptySub: "Choose delicious items from the menu to build your order.",
      subtotal: "Subtotal",
      deliveryFee: "Delivery Fee",
      total: "Total",
      checkout: "Go to Checkout",
      dineIn: "Dine-in",
      dineInDesc: "Table",
      pickup: "Pickup",
      pickupDesc: "15 mins",
      delivery: "Delivery",
      deliveryDesc: "45 mins",
      outOfStock: "Out of stock",
      warningSuspended: "Service temporarily unavailable (Billing suspended)",
      warningClosed: "The shop is closed. No orders are being accepted at this time.",
      closed: "Closed",
      sizeLabel: "Choose Size",
      addonLabel: "Premium Addons",
      removalLabel: "Remove Ingredients",
      chooseMandatory: "Mandatory selection",
      addedToCart: "Added to cart!",
      tableNoPlaceholder: "Table number auto-scanned",
      free: "Free",
      noFooter: "Strictly No Footer"
    },
    ar: {
      searchPlaceholder: "ابحث عن البيتزا، المقبلات، المشروبات...",
      all: "الكل",
      offers: "العروض والخصومات",
      add: "إضافة إلى السلة",
      emptyTitle: "سلتك فارغة",
      emptySub: "اختر أطباقاً شهية من القائمة لبناء طلبك المميز.",
      subtotal: "المجموع الفرعي",
      deliveryFee: "رسوم التوصيل",
      total: "المجموع الكلي",
      checkout: "الانتقال إلى الدفع",
      dineIn: "داخل المطعم",
      dineInDesc: "طاولة",
      pickup: "استلام",
      pickupDesc: "١٥ دقيقة",
      delivery: "توصيل",
      deliveryDesc: "٤٥ دقيقة",
      outOfStock: "غير متوفر",
      warningSuspended: "الخدمة غير متوفرة مؤقتاً (الحساب معلق)",
      warningClosed: "المحل مغلق حالياً. لا يتم استقبال أي طلبات الآن.",
      closed: "مغلق",
      sizeLabel: "اختر الحجم",
      addonLabel: "إضافات مميزة",
      removalLabel: "إزالة المكونات",
      chooseMandatory: "اختيار إلزامي",
      addedToCart: "تمت الإضافة إلى السلة!",
      tableNoPlaceholder: "تم تسجيل رقم الطاولة تلقائياً",
      free: "مجاني",
      noFooter: "يمنع تذييل الصفحة"
    },
    ru: {
      searchPlaceholder: "Поиск пиццы, гарниров, напитков...",
      all: "Все",
      offers: "Акции и рекомендации",
      add: "В корзину",
      emptyTitle: "Ваша корзина пуста",
      emptySub: "Выберите вкусные блюда из меню, чтобы создать заказ.",
      subtotal: "Подытог",
      deliveryFee: "Доставка",
      total: "Итого",
      checkout: "Перейти к оплате",
      dineIn: "В заведении",
      dineInDesc: "Столик",
      pickup: "Самовывоз",
      pickupDesc: "15 мин",
      delivery: "Доставка",
      deliveryDesc: "45 мин",
      outOfStock: "Нет в наличии",
      warningSuspended: "Сервис временно недоступен (аккаунт приостановлен)",
      warningClosed: "Магазин закрыт. Заказы временно не принимаются.",
      closed: "Закрыто",
      sizeLabel: "Выберите размер",
      addonLabel: "Добавки",
      removalLabel: "Исключить ингредиенты",
      chooseMandatory: "Обязательный выбор",
      addedToCart: "Добавлено в корзину!",
      tableNoPlaceholder: "Столик отсканирован",
      free: "Бесплатно",
      noFooter: "Без футера"
    },
    es: {
      searchPlaceholder: "Buscar pizzas, guarniciones, bebidas...",
      all: "Todo",
      offers: "Ofertas y destacados",
      add: "Añadir al carrito",
      emptyTitle: "Tu cesta está vacía",
      emptySub: "Elige deliciosos platos del menú para armar tu pedido.",
      subtotal: "Subtotal",
      deliveryFee: "Costo de entrega",
      total: "Total",
      checkout: "Proceder al pago",
      dineIn: "En el local",
      dineInDesc: "Mesa",
      pickup: "Para llevar",
      pickupDesc: "15 min",
      delivery: "Entrega",
      deliveryDesc: "45 min",
      outOfStock: "Agotado",
      warningSuspended: "Servicio temporalmente no disponible (cuenta suspendida)",
      warningClosed: "La tienda está cerrada. No se aceptan pedidos en este momento.",
      closed: "Cerrado",
      sizeLabel: "Elegir tamaño",
      addonLabel: "Extras premium",
      removalLabel: "Quitar ingredientes",
      chooseMandatory: "Selección obligatoria",
      addedToCart: "¡Añadido al carrito!",
      tableNoPlaceholder: "Mesa auto-escaneada",
      free: "Gratis",
      noFooter: "Sin pie de página"
    },
    fr: {
      searchPlaceholder: "Rechercher des pizzas, accompagnements, boissons...",
      all: "Tout",
      offers: "Offres et sélections",
      add: "Ajouter au panier",
      emptyTitle: "Votre panier est vide",
      emptySub: "Choisissez de délicieux articles dans le menu pour composer votre commande.",
      subtotal: "Sous-total",
      deliveryFee: "Frais de livraison",
      total: "Total",
      checkout: "Passer à la caisse",
      dineIn: "Sur place",
      dineInDesc: "Table",
      pickup: "À emporter",
      pickupDesc: "15 min",
      delivery: "Livraison",
      deliveryDesc: "45 min",
      outOfStock: "Épuisé",
      warningSuspended: "Service temporairement indisponible (compte suspendu)",
      warningClosed: "Le magasin est fermé. Aucun ordre n'est accepté pour le moment.",
      closed: "Fermé",
      sizeLabel: "Choisir la taille",
      addonLabel: "Suppléments premium",
      removalLabel: "Retirer des ingrédients",
      chooseMandatory: "Sélection obligatoire",
      addedToCart: "Ajouté au panier !",
      tableNoPlaceholder: "Table auto-scannée",
      free: "Gratuit",
      noFooter: "Sans pied de page"
    },
    de: {
      searchPlaceholder: "Pizzas, Beilagen, Getränke suchen...",
      all: "Alle",
      offers: "Angebote & Pinned",
      add: "In den Warenkorb",
      emptyTitle: "Ihr Warenkorb ist leer",
      emptySub: "Wählen Sie leckere Artikel aus dem Menü, um Ihre Bestellung aufzugeben.",
      subtotal: "Zwischensumme",
      deliveryFee: "Liefergebühr",
      total: "Gesamt",
      checkout: "Zur Kasse",
      dineIn: "Vor Ort",
      dineInDesc: "Tisch",
      pickup: "Abholung",
      pickupDesc: "15 Min.",
      delivery: "Lieferung",
      deliveryDesc: "45 Min.",
      outOfStock: "Ausverkauft",
      warningSuspended: "Dienst vorübergehend nicht verfügbar (Zahlung ausgesetzt)",
      warningClosed: "Das Geschäft ist geschlossen. Zurzeit werden keine Bestellungen angenommen.",
      closed: "Geschlossen",
      sizeLabel: "Größe wählen",
      addonLabel: "Premium-Extras",
      removalLabel: "Zutaten entfernen",
      chooseMandatory: "Pflichtfeld",
      addedToCart: "In den Warenkorb gelegt!",
      tableNoPlaceholder: "Tischnummer automatisch gescannt",
      free: "Kostenlos",
      noFooter: "Keine Fußzeile"
    },
    it: {
      searchPlaceholder: "Cerca pizze, contorni, bevande...",
      all: "Tutto",
      offers: "Offerte e Consigliati",
      add: "Aggiungi al carrello",
      emptyTitle: "Il tuo carrello è vuoto",
      emptySub: "Scegli deliziosi piatti dal menu per comporre il tuo ordine.",
      subtotal: "Totale parziale",
      deliveryFee: "Spese di spedizione",
      total: "Totale",
      checkout: "Procedi all'ordine",
      dineIn: "Al tavolo",
      dineInDesc: "Tavolo",
      pickup: "Asporto",
      pickupDesc: "15 min",
      delivery: "Consegna",
      deliveryDesc: "45 min",
      outOfStock: "Esaurito",
      warningSuspended: "Servizio temporaneamente non disponibile (conto sospeso)",
      warningClosed: "Il negozio è chiuso. Non si accettano ordini al momento.",
      closed: "Chiuso",
      sizeLabel: "Scegli dimensione",
      addonLabel: "Aggiunte premium",
      removalLabel: "Rimuovi ingredienti",
      chooseMandatory: "Selezione obbligatoria",
      addedToCart: "Aggiunto al carrello!",
      tableNoPlaceholder: "Tavolo scansionato automaticamente",
      free: "Gratis",
      noFooter: "Nessun piè di pagina"
    },
    ka: {
      searchPlaceholder: "მოძებნეთ პიცა, გარნირი, სასმელები...",
      all: "ყველა",
      offers: "აქციები და რჩეული",
      add: "კალათაში დამატება",
      emptyTitle: "თქვენი კალათა ცარიელია",
      emptySub: "აირჩიეთ გემრიელი კერძები მენიუდან შეკვეთის გასაფორმებლად.",
      subtotal: "ჯამი",
      deliveryFee: "მიწოდების საფასური",
      total: "სულ",
      checkout: "გაფორმება",
      dineIn: "ადგილზე",
      dineInDesc: "მაგიდა",
      pickup: "წაღება",
      pickupDesc: "15 წთ",
      delivery: "მიწოდება",
      deliveryDesc: "45 წთ",
      outOfStock: "ამოიწურა",
      warningSuspended: "სერვისი დროებით მიუწვდომელია (ანგარიში შეჩერებულია)",
      warningClosed: "მაღაზია დაკეტილია. შეკვეთები ამჟამად არ მიიღება.",
      closed: "დაკეტილია",
      sizeLabel: "აირჩიეთ ზომა",
      addonLabel: "პრემიუმ დანამატები",
      removalLabel: "ინგრედიენტების ამოღება",
      chooseMandatory: "სავალდებულო არჩევანი",
      addedToCart: "დაემატა კალათაში!",
      tableNoPlaceholder: "მაგიდის ნომერი სკანირებულია",
      free: "უფასო",
      noFooter: "ფუტერის გარეშე"
    }
  };

  const dict = new Proxy(dictRaw, {
    get: (target, name) => {
      return target[name] || target['en'];
    }
  });

  // Check if store is open
  const checkIfStoreOpen = (openingHours) => {
    if (!openingHours || !Array.isArray(openingHours)) return true;
    
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];
    
    const hoursToday = openingHours.find(h => h.day === currentDay);
    if (!hoursToday || !hoursToday.isOpen) return false;

    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

    return currentTimeStr >= hoursToday.open && currentTimeStr <= hoursToday.close;
  };

  const isClosed = !checkIfStoreOpen(tenant.openingHours);

  // Filter products based on search query and category pill
  const filteredProducts = initialProducts.filter(product => {
    // Search query filter
    const nameMatch = t(product.name).toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = t(product.description).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || descMatch;

    if (!matchesSearch) return false;

    // Category filter
    if (activeCategory === 'all') return true;
    return product.categories.includes(activeCategory);
  });

  // Category list filter: Pinned category will be pinned to the top of the storefront list
  const sortedCategories = [...initialCategories].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.order - b.order;
  });

  // Opening the tripartite customisation modal
  const openCustomizer = (product) => {
    if (tenant.status !== 'active') return; // Suspended is browse-only
    if (!product.isAvailable) return; // Out of stock — prevent ordering
    if (isClosed) return; // Shop is closed, no ordering!

    setSelectedProduct(product);
    setModalQty(1);

    // Initialise Modifiers
    const sizeMod = initialModifierGroups.find(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'variations' && product.modifierGroups?.includes(m._id));
    if (product.variations && product.variations.length > 0) {
      setModalSize(product.variations[0].name?.en || product.variations[0].name); // Default to first product-level size
    } else if (sizeMod && sizeMod.options.length > 0) {
      setModalSize(sizeMod.options[0].name.en); // Default to first global size
    } else {
      setModalSize('');
    }

    setModalAddons([]);
    setModalRemovals([]);
    setModalNotes('');
  };

  // Real-time customizer item price calculation
  useEffect(() => {
    if (!selectedProduct) return;
    
    let price = (selectedProduct.discountedPrice && selectedProduct.discountedPrice > 0) ? selectedProduct.discountedPrice : selectedProduct.price;

    // Size impact
    if (selectedProduct.variations && selectedProduct.variations.length > 0) {
      const selectedOption = selectedProduct.variations.find(o => (o.name?.en || o.name) === modalSize);
      if (selectedOption) {
        price = selectedOption.price; // OVERRIDES the base price!
      }
    } else {
      const sizeMod = initialModifierGroups.find(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'variations' && selectedProduct.modifierGroups?.includes(m._id));
      if (sizeMod && modalSize) {
        const selectedOption = sizeMod.options.find(o => o.name.en === modalSize);
        if (selectedOption) {
          price += selectedOption.price;
        }
      }
    }

    // Addons impact (Product-Level)
    if (selectedProduct.addons) {
      modalAddons.forEach(addonName => {
        const option = selectedProduct.addons.find(o => (o.name?.en || o.name) === addonName);
        if (option) {
          price += option.price;
        }
      });
    }

    // Addons impact (Global Modifier Groups)
    const addonsMod = initialModifierGroups.find(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'addons' && selectedProduct.modifierGroups?.includes(m._id));
    if (addonsMod) {
      modalAddons.forEach(addonName => {
        const option = addonsMod.options.find(o => o.name.en === addonName);
        if (option) {
          price += option.price;
        }
      });
    }

    setModalPrice(price * modalQty);
  }, [selectedProduct, modalSize, modalAddons, modalQty, initialModifierGroups, tenant._id]);

  // Adding item to cart
  const addToCart = () => {
    if (!selectedProduct) return;

    // Validate size selection if sizes modifier group or variations are present
    const sizeMod = initialModifierGroups.find(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'variations' && selectedProduct.modifierGroups?.includes(m._id));
    const hasVariations = (selectedProduct.variations && selectedProduct.variations.length > 0) || sizeMod;
    if (hasVariations && !modalSize) {
      alert(dict[lang].chooseMandatory);
      return;
    }

    const cartItem = {
      id: new Date().getTime().toString(), // Unique cart element id
      productId: selectedProduct._id,
      name: selectedProduct.name,
      basePrice: (selectedProduct.discountedPrice && selectedProduct.discountedPrice > 0) ? selectedProduct.discountedPrice : selectedProduct.price,
      quantity: modalQty,
      size: modalSize,
      addons: modalAddons,
      removedIngredients: modalRemovals,
      notes: modalNotes,
      unitPrice: modalPrice / modalQty,
      totalPrice: modalPrice,
      imageUrl: selectedProduct.imageUrl
    };

    const newCart = [...cart, cartItem];
    saveCart(newCart);
    setSelectedProduct(null); // Close modal
  };

  // Cart modifications
  const updateCartQty = (cartId, delta) => {
    if (tenant.status !== 'active') return;
    const newCart = cart.map(item => {
      if (item.id === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return {
          ...item,
          quantity: newQty,
          totalPrice: item.unitPrice * newQty
        };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeCartItem = (cartId) => {
    if (tenant.status !== 'active') return;
    const newCart = cart.filter(item => item.id !== cartId);
    saveCart(newCart);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = mode === 'delivery' ? (tenant.deliveryFee || 0) : 0.00;
  const total = subtotal + deliveryFee;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="main-viewport">
      {/* 1. Subscription suspended header warning bar */}
      {tenant.status !== 'active' && (
        <div className="masquerade-banner" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
          <span>⚠️ {dict[lang].warningSuspended}</span>
        </div>
      )}

      {/* 2. Shop Closed warning marquee banner */}
      {isClosed && (
        <div className="closed-banner" style={{ 
          position: 'fixed', 
          top: tenant.status !== 'active' ? '40px' : 0, 
          left: 0, 
          right: 0, 
          height: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f59e0b',
          color: '#000000',
          fontWeight: 'bold',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <marquee scrollamount="5" style={{ width: '100%', fontSize: '0.85rem' }}>
            ⚠️ {dict[lang].warningClosed}
          </marquee>
        </div>
      )}

      {/* Header */}
      <header className="header" style={{ 
        top: (tenant.status !== 'active' && isClosed) ? '80px' : (tenant.status !== 'active' || isClosed) ? '40px' : 0 
      }}>
        <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="menu-toggle-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-main)',
                padding: '6px'
              }}
            >
              <Menu className="ic" style={{ width: '22px', height: '22px' }} />
            </button>
            
            <Link href={`/${tenant.slug}`} className="logo" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {tenant.logoUrl && !logoError ? (
                <img 
                  src={tenant.logoUrl} 
                  alt={tenant.name} 
                  style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                  onError={() => setLogoError(true)}
                />
              ) : null}
              {(!tenant.logoUrl || logoError) && (
                <span id="navbar-text-logo">
                  {tenant.name.toLowerCase() === 'bar tartine' ? (
                    <>bar <span>tartine</span></>
                  ) : (
                    tenant.name
                  )}
                </span>
              )}
            </Link>
          </div>

          {/* Right Header: Languages switcher dropdown */}
          <div className="header-right" style={{ position: 'relative' }}>
            {tenant.languages && tenant.languages.length > 1 && (
              <>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flag-selector"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid var(--line-2)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-main)'
                  }}
                >
                  <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                    {LANGUAGES[lang]?.flag || '🌐'}
                  </span>
                  <span>{LANGUAGES[lang]?.code || lang.toUpperCase()}</span>
                  <span style={{ fontSize: '10px', opacity: 0.6 }}>▼</span>
                </button>

                {langMenuOpen && (
                  <>
                    <div 
                      onClick={() => setLangMenuOpen(false)}
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--line-2)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        minWidth: '160px',
                        padding: '6px 0',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {tenant.languages.map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            setLang(l);
                            setLangMenuOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 16px',
                            border: 'none',
                            background: lang === l ? 'var(--bg-secondary)' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            fontFamily: 'inherit',
                            fontSize: '14px',
                            fontWeight: lang === l ? '700' : '500',
                            color: 'var(--text-main)',
                            transition: 'background 0.2s'
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>{LANGUAGES[l]?.flag || '🌐'}</span>
                          <span>{LANGUAGES[l]?.label || l.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

       {/* Main Grid Wrapper */}
      <div 
        className="main-wrapper" 
        style={{ 
          paddingTop: (tenant.status !== 'active' && isClosed) 
            ? 'calc(var(--header-height) + 80px)' 
            : (tenant.status !== 'active' || isClosed) 
              ? 'calc(var(--header-height) + 40px)' 
              : 'var(--header-height)'
        }}
      >
        {/* Left catalog panel */}
        <main className="left-panel">
          
          {/* Starred Promotion pinned category banner */}
          {sortedCategories.filter(c => c.isPinned).map(cat => {
            const promoProducts = initialProducts.filter(p => p.categories.includes(cat._id));
            if (promoProducts.length === 0) return null;
            return (
              <section key={cat._id} className="promo-section" style={{ marginBottom: '32px' }}>
                <div className="section-header">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star style={{ width: '18px', height: '18px', fill: '#eab308', color: '#eab308' }} />
                    <span>{t(cat.name)}</span>
                  </h2>
                </div>
                <div className="offers-row">
                  {promoProducts.map(product => (
                    <div 
                      key={product._id} 
                      className="offer-card"
                      onClick={() => openCustomizer(product)}
                      style={{ ...(isClosed ? { cursor: 'default' } : {}), ...(product.isAvailable ? {} : { opacity: 0.5, pointerEvents: 'none' }) }}
                    >
                      <div className="offer-image-wrapper">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={t(product.name)} 
                            className="offer-img"
                          />
                        ) : (
                          <img 
                            src="/assets/No Image Icon.svg" 
                            alt={t(product.name)} 
                            className="offer-img"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                        {tenant.status === 'active' && !isClosed && (
                          <div className="plus-overlay-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus className="ic" style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                          </div>
                        )}
                      </div>
                      <h3 className="offer-title">{t(product.name)}</h3>
                      {!product.isAvailable ? (
                        <span className="out-of-stock-badge">{dict[lang].outOfStock}</span>
                      ) : isClosed ? (
                        <p className="offer-price" style={{ color: 'var(--brand-red)', fontWeight: 'bold', textDecoration: 'none' }}>{dict[lang].closed}</p>
                      ) : product.discountedPrice && product.discountedPrice > 0 ? (
                        <p className="offer-price" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8em' }}>{formatPrice(product.price)}</span>
                          <span style={{ color: 'var(--brand-red)', fontWeight: '700' }}>{formatPrice(product.discountedPrice)}</span>
                        </p>
                      ) : (
                        <p className="offer-price" style={{ textDecoration: 'none' }}>{formatPrice(product.price)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Search bar */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder={dict[lang].searchPlaceholder} 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search className="ic" style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
            </span>
          </div>

          {/* Categories Pills bar */}
          <div className="categories-row-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="categories-pills-list" style={{ flex: 1 }}>
              <button 
                onClick={() => setActiveCategory('all')}
                className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
                style={{ border: 'none', font: 'inherit' }}
              >
                {dict[lang].all}
              </button>
              {sortedCategories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  className={`category-pill ${activeCategory === cat._id ? 'active' : ''}`}
                  style={{ border: 'none', font: 'inherit' }}
                >
                  {t(cat.name)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsFilterPopupOpen(true)}
              className="category-filter-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--line-2)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                flexShrink: 0,
                color: 'var(--text-main)',
                transition: 'all 0.2s'
              }}
              title="Filter Categories"
            >
              <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* 2-Column Product Grid list */}
          <section className="products-list-section">
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product._id} 
                  className="product-card"
                  onClick={() => openCustomizer(product)}
                  style={{ opacity: product.isAvailable ? 1 : 0.6, cursor: isClosed ? 'default' : 'pointer' }}
                >
                  <div className="product-image-container" style={{ position: 'relative' }}>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={t(product.name)} 
                        className="product-img"
                      />
                    ) : (
                      <img 
                        src="/assets/No Image Icon.svg" 
                        alt={t(product.name)} 
                        className="product-img"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    {tenant.status === 'active' && !isClosed && (
                      <div className="plus-overlay-btn" style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 2
                      }}>
                        <Plus className="ic" style={{ width: '16px', height: '16px', color: '#000000' }} />
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{t(product.name)}</h3>
                    <p className="product-desc">{t(product.description)}</p>
                    
                    {!product.isAvailable ? (
                      <span className="out-of-stock-badge">{dict[lang].outOfStock}</span>
                    ) : isClosed ? (
                      <span className="closed-badge" style={{ backgroundColor: '#f59e0b', color: '#000000', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', width: 'fit-content', display: 'inline-block' }}>
                        {dict[lang].closed}
                      </span>
                    ) : product.discountedPrice && product.discountedPrice > 0 ? (
                      <div className="product-price-row" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="product-price" style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8em' }}>{formatPrice(product.price)}</span>
                        <span className="product-price" style={{ color: 'var(--brand-red)', fontWeight: '700' }}>{formatPrice(product.discountedPrice)}</span>
                      </div>
                    ) : (
                      <div className="product-price-row">
                        <span className="product-price" style={{ textDecoration: 'none' }}>{formatPrice(product.price)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right shopping basket panel */}
        <aside className={`right-panel ${isMobileCartOpen ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '16px' }}>
            <h2 className="basket-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '20px' }}>
              Basket
            </h2>
            <button 
              type="button"
              onClick={() => setIsMobileCartOpen(false)}
              className="mobile-only-close-basket"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              ✕
            </button>
          </div>

          {/* Fulfillment toggles */}
          {tenant.status === 'active' && (
            <div className="delivery-toggle-wrapper">
              {tenant.enabledModes.dineIn && (
                <div 
                  onClick={() => handleModeChange('dine-in')}
                  className={`toggle-option ${mode === 'dine-in' ? 'active' : ''}`}
                >
                  <div className="toggle-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Utensils style={{ width: '14px', height: '14px' }} />
                    <span>{dict[lang].dineIn}</span>
                  </div>
                  <div className="toggle-desc">{tableNo ? tableNo : dict[lang].dineInDesc}</div>
                </div>
              )}
              {tenant.enabledModes.pickup && (
                <div 
                  onClick={() => handleModeChange('pickup')}
                  className={`toggle-option ${mode === 'pickup' ? 'active' : ''}`}
                >
                  <div className="toggle-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShoppingBag style={{ width: '14px', height: '14px' }} />
                    <span>{dict[lang].pickup}</span>
                  </div>
                  <div className="toggle-desc">{dict[lang].pickupDesc}</div>
                </div>
              )}
              {tenant.enabledModes.delivery && (
                <div 
                  onClick={() => handleModeChange('delivery')}
                  className={`toggle-option ${mode === 'delivery' ? 'active' : ''}`}
                >
                  <div className="toggle-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bike style={{ width: '14px', height: '14px' }} />
                    <span>{dict[lang].delivery}</span>
                  </div>
                  <div className="toggle-desc">{dict[lang].deliveryDesc}</div>
                </div>
              )}
            </div>
          )}

          {/* Empty state vs Cart list */}
          {cart.length === 0 ? (
            <div className="basket-empty-state">
              <span className="basket-empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <ShoppingBag className="ic" style={{ width: '48px', height: '48px', color: 'var(--text-muted)' }} />
              </span>
              <h3 className="basket-empty-title">{dict[lang].emptyTitle}</h3>
              <p className="basket-empty-sub">{dict[lang].emptySub}</p>
            </div>
          ) : (
            <>
              <div className="basket-items-list">
                {cart.map(item => (
                  <div key={item.id} className="basket-item">
                    <div className="basket-item-info">
                      <h4 className="basket-item-name">{t(item.name)}</h4>
                      <p className="basket-item-customizations">
                        {item.size && `${item.size}`}
                        {item.addons.length > 0 && `, +${item.addons.join(', ')}`}
                        {item.removedIngredients.length > 0 && `, (No ${item.removedIngredients.join(', ')})`}
                      </p>
                      <span className="basket-item-price">{formatPrice(item.totalPrice)}</span>
                    </div>

                    {tenant.status === 'active' && (
                      <div className="basket-qty-control">
                        <span 
                          className="basket-qty-btn"
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeCartItem(item.id);
                            } else {
                              updateCartQty(item.id, -1);
                            }
                          }}
                        >
                          {item.quantity === 1 ? '🗑️' : '-'}
                        </span>
                        <span className="basket-qty-num">{item.quantity}</span>
                        <span 
                          className="basket-qty-btn"
                          onClick={() => updateCartQty(item.id, 1)}
                        >
                          +
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Basket totals block */}
              <div className="basket-footer">
                <div className="basket-summary-row">
                  <span>{dict[lang].subtotal}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {mode === 'delivery' && (
                  <div className="basket-summary-row">
                    <span>{dict[lang].deliveryFee}</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="basket-summary-row total">
                  <span>{dict[lang].total}</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {tenant.status === 'active' ? (
                  isClosed ? (
                    <div style={{ color: '#000000', backgroundColor: '#f59e0b', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', padding: '12px', borderRadius: '12px', border: '1px solid #f59e0b' }}>
                      ⚠️ {dict[lang].warningClosed}
                    </div>
                  ) : (
                    <Link href={`/${tenant.slug}/checkout${(tableNo && mode === 'dine-in') ? `?table=${encodeURIComponent(tableNo)}` : ''}`} className="checkout-btn">
                      {dict[lang].checkout}
                    </Link>
                  )
                ) : (
                  <div style={{ color: '#ef4444', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', padding: '12px' }}>
                    {dict[lang].warningSuspended}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Sticky Bottom View Cart Floating Bar on Mobile */}
      {cart.length > 0 && tenant.status === 'active' && !isClosed && (
        <button 
          type="button"
          onClick={() => setIsMobileCartOpen(true)}
          className="mobile-cart-float visible" 
          style={{ border: 'none', font: 'inherit', width: 'calc(100% - 32px)', cursor: 'pointer', zIndex: 90 }}
        >
          <div className="mobile-cart-left">
            <div className="mobile-cart-icon-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCart className="ic" style={{ width: '18px', height: '18px' }} />
              <span className="mobile-cart-badge">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
            </div>
            <span className="mobile-cart-text">View Basket</span>
          </div>
          <span className="mobile-cart-price">{formatPrice(total)}</span>
        </button>
      )}

      {/* 
      ========================================================================
         TRIPARTITE MODIFIER SELECTION POPUP MODAL
      ========================================================================
      */}
      {selectedProduct && (
        <div className="modal-overlay active">
          <div className="modal-card">
            {/* Header / Close */}
            <div className="modal-image-wrapper">
              {selectedProduct.imageUrl ? (
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={t(selectedProduct.name)} 
                  className="modal-pizza-img"
                />
              ) : (
                <img 
                  src="/assets/No Image Icon.svg" 
                  alt={t(selectedProduct.name)} 
                  className="modal-pizza-img"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Modal Customizer Body */}
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh', padding: 0 }}>
              
              {/* Scrollable Options List */}
              <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
                <h3 className="modal-title">{t(selectedProduct.name)}</h3>
                <p className="modal-desc">{t(selectedProduct.description)}</p>
                
                {/* Product-Level Variations */}
                {selectedProduct.variations && selectedProduct.variations.length > 0 ? (
                  <div className="modal-modifier-section">
                    <h4 className="modal-section-title">{dict[lang].sizeLabel} ({dict[lang].chooseMandatory})</h4>
                    <div className="modal-options-list">
                      {selectedProduct.variations.map((option, idx) => {
                        const optName = option.name?.en || option.name;
                        return (
                          <label key={idx} className="option-row">
                            <div className="option-row-left">
                              <input 
                                type="radio" 
                                name="product-size" 
                                value={optName}
                                checked={modalSize === optName}
                                onChange={() => setModalSize(optName)}
                              />
                              <span>{t(option.name)}</span>
                            </div>
                            <span className="option-row-price">{formatPrice(option.price)}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Modifier Group 1: Sizes variations (Mandatory!) */
                  initialModifierGroups
                    .filter(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'variations' && selectedProduct.modifierGroups?.includes(m._id))
                    .map(group => (
                      <div key={group._id} className="modal-modifier-section">
                        <h4 className="modal-section-title">{t(group.name)} ({dict[lang].chooseMandatory})</h4>
                        <div className="modal-options-list">
                          {group.options.map((option, idx) => (
                            <label key={idx} className="option-row">
                              <div className="option-row-left">
                                <input 
                                  type="radio" 
                                  name="pizza-size" 
                                  value={option.name.en}
                                  checked={modalSize === option.name.en}
                                  onChange={() => setModalSize(option.name.en)}
                                />
                                <span>{t(option.name)}</span>
                              </div>
                              {option.price > 0 && (
                                <span className="option-row-price">+{formatPrice(option.price)}</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))
                )}

                {/* Product-Level Add-ons */}
                {selectedProduct.addons && selectedProduct.addons.length > 0 && (
                  <div className="modal-modifier-section">
                    <h4 className="modal-section-title">{dict[lang].addonLabel}</h4>
                    <div className="modal-options-list">
                      {selectedProduct.addons.map((option, idx) => {
                        const optName = option.name?.en || option.name;
                        const isChecked = modalAddons.includes(optName);
                        return (
                          <label key={idx} className="option-row">
                            <div className="option-row-left">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setModalAddons([...modalAddons, optName]);
                                  } else {
                                    setModalAddons(modalAddons.filter(a => a !== optName));
                                  }
                                }}
                              />
                              <span>{t(option.name)}</span>
                            </div>
                            <span className="option-row-price">+{formatPrice(option.price)}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Modifier Group 2: Global Addons checkboxes (Optional) */}
                {initialModifierGroups
                  .filter(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'addons' && selectedProduct.modifierGroups?.includes(m._id))
                  .map(group => (
                    <div key={group._id} className="modal-modifier-section">
                      <h4 className="modal-section-title">{t(group.name)}</h4>
                      <div className="modal-options-list">
                        {group.options.map((option, idx) => {
                          const isChecked = modalAddons.includes(option.name.en);
                          return (
                            <label key={idx} className="option-row">
                              <div className="option-row-left">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setModalAddons([...modalAddons, option.name.en]);
                                    } else {
                                      setModalAddons(modalAddons.filter(a => a !== option.name.en));
                                    }
                                  }}
                                />
                                <span>{t(option.name)}</span>
                              </div>
                              <span className="option-row-price">+{formatPrice(option.price)}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                {/* Product-Level Removals */}
                {selectedProduct.removals && selectedProduct.removals.length > 0 && (
                  <div className="modal-modifier-section">
                    <h4 className="modal-section-title">{dict[lang].removalLabel}</h4>
                    <div className="modal-options-list">
                      {selectedProduct.removals.map((option, idx) => {
                        const optName = option.name?.en || option.name;
                        const isRemoved = modalRemovals.includes(optName);
                        return (
                          <label 
                            key={idx} 
                            className={`remove-option-row ${isRemoved ? 'removed' : ''}`}
                          >
                            <div className="remove-option-left">
                              <input 
                                type="checkbox"
                                checked={isRemoved}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setModalRemovals([...modalRemovals, optName]);
                                  } else {
                                    setModalRemovals(modalRemovals.filter(r => r !== optName));
                                  }
                                }}
                              />
                              <span>{isRemoved ? '🚫' : '✓'} {t(option.name)}</span>
                            </div>
                            <span className="option-row-price">{dict[lang].free}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Modifier Group 3: Global Ingredient removals checkboxes (Optional, Zero cost) */}
                {initialModifierGroups
                  .filter(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'removals' && selectedProduct.modifierGroups?.includes(m._id))
                  .map(group => (
                    <div key={group._id} className="modal-modifier-section">
                      <h4 className="modal-section-title">{t(group.name)}</h4>
                      <div className="modal-options-list">
                        {group.options.map((option, idx) => {
                          const isRemoved = modalRemovals.includes(option.name.en);
                          return (
                            <label 
                              key={idx} 
                              className={`remove-option-row ${isRemoved ? 'removed' : ''}`}
                            >
                              <div className="remove-option-left">
                                <input 
                                  type="checkbox"
                                  checked={isRemoved}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setModalRemovals([...modalRemovals, option.name.en]);
                                    } else {
                                      setModalRemovals(modalRemovals.filter(r => r !== option.name.en));
                                    }
                                  }}
                                />
                                <span>{isRemoved ? '🚫' : '✓'} {t(option.name)}</span>
                              </div>
                              <span className="option-row-price">{dict[lang].free}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                {/* Special Instructions / Item Notes */}
                <div className="modal-modifier-section">
                  <h4 className="modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText className="ic" style={{ width: '15px', height: '15px' }} />
                    <span>Special Instructions</span>
                  </h4>
                  <textarea
                    className="form-control"
                    placeholder="e.g. No onions, extra sauce, allergies..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-light, #e5e7eb)',
                      fontSize: '0.85rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      backgroundColor: '#f9fafb'
                    }}
                  />
                </div>
              </div>

              {/* Fixed Footer Bar */}
              <div className="modal-footer-bar" style={{ padding: '16px 24px 24px', margin: 0, borderTop: '1px solid var(--border-light)', backgroundColor: '#ffffff', borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px', display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <div className="modal-qty-selector">
                  <span 
                    className="modal-qty-btn"
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                  >
                    -
                  </span>
                  <span className="modal-qty-num">{modalQty}</span>
                  <span 
                    className="modal-qty-btn"
                    onClick={() => setModalQty(modalQty + 1)}
                  >
                    +
                  </span>
                </div>
                <button 
                  onClick={addToCart}
                  className="modal-add-btn"
                  style={{ flex: 1 }}
                >
                  <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span>{dict[lang].add}</span>
                    <span>{formatPrice(modalPrice)}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar Categories Menu Drawer */}
      <div 
        className={`drawer-scrim ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          zIndex: 2000
        }}
      ></div>
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 25px rgba(0,0,0,0.1)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          zIndex: 2001,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifySpaceBetween: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Menu</h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSidebarOpen(false);
            }}
            style={{
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeCategory === 'all' ? 'var(--bg-secondary)' : 'transparent',
              fontWeight: activeCategory === 'all' ? '700' : '500',
              cursor: 'pointer',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          >
            {dict[lang].all}
          </button>
          {sortedCategories.map(cat => (
            <button
              key={cat._id}
              onClick={() => {
                setActiveCategory(cat._id);
                setSidebarOpen(false);
              }}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeCategory === cat._id ? 'var(--bg-secondary)' : 'transparent',
                fontWeight: activeCategory === cat._id ? '700' : '500',
                cursor: 'pointer',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            >
              {t(cat.name)}
            </button>
          ))}
          
          {tenant.address && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-primary)' }}></i> Address
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.4' }}>{tenant.address}</p>
            </div>
          )}

          {(() => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDay = days[new Date().getDay()];
            const hoursToday = tenant.openingHours?.find(h => h.day === currentDay);
            if (!hoursToday) return null;
            return (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-clock" style={{ color: 'var(--color-primary)' }}></i> Today's Hours
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>
                  {hoursToday.isOpen ? `${hoursToday.open} - ${hoursToday.close}` : 'Closed'}
                </p>
              </div>
            );
          })()}

          {(tenant.website || tenant.facebook || tenant.x || tenant.youtube || tenant.instagram || tenant.tiktok || tenant.whatsappNumber || (tenant.notifications && tenant.notifications.whatsappNumber)) && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px', paddingBottom: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Follow Us
              </h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {tenant.website && (
                  <a href={tenant.website.startsWith('http') ? tenant.website : `https://${tenant.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', fontSize: '1.2rem', textDecoration: 'none' }}>
                    <i className="fa-solid fa-globe"></i>
                  </a>
                )}
                {tenant.facebook && (
                  <a href={tenant.facebook.startsWith('http') ? tenant.facebook : `https://facebook.com/${tenant.facebook}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2', fontSize: '1.2rem', textDecoration: 'none' }}>
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                )}
                {tenant.x && (
                  <a href={tenant.x.startsWith('http') ? tenant.x : `https://x.com/${tenant.x}`} target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontSize: '1.2rem', textDecoration: 'none' }}>
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                )}
                {tenant.youtube && (
                  <a href={tenant.youtube.startsWith('http') ? tenant.youtube : `https://youtube.com/${tenant.youtube}`} target="_blank" rel="noopener noreferrer" style={{ color: '#FF0000', fontSize: '1.2rem', textDecoration: 'none' }}>
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                )}
                {tenant.instagram && (
                  <a href={tenant.instagram.startsWith('http') ? tenant.instagram : `https://instagram.com/${tenant.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', fontSize: '1.2rem', textDecoration: 'none' }}>
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                )}
                {tenant.tiktok && (
                  <a href={tenant.tiktok.startsWith('http') ? tenant.tiktok : `https://tiktok.com/@${tenant.tiktok}`} target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontSize: '1.2rem', textDecoration: 'none' }}>
                    <i className="fa-brands fa-tiktok"></i>
                  </a>
                )}
                {(tenant.whatsappNumber || (tenant.notifications && tenant.notifications.whatsappNumber)) && (
                  <a href={`https://wa.me/${(tenant.whatsappNumber || tenant.notifications.whatsappNumber).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontSize: '1.2rem', textDecoration: 'none' }}>
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Categories Filter Popup Modal */}
      {isFilterPopupOpen && (
        <>
          <div 
            className="filter-scrim" 
            onClick={() => setIsFilterPopupOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 99999,
              backdropFilter: 'blur(2px)'
            }}
          />
          <div 
            className="filter-popup pop-in"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              width: '90%',
              maxWidth: '440px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              zIndex: 100000,
              fontFamily: 'inherit'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/assets/Categories Icon.svg" alt="Categories" style={{ width: '18px', height: '18px', display: 'block' }} />
                <span>Categories</span>
              </h3>
              <button 
                onClick={() => setIsFilterPopupOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setIsFilterPopupOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: activeCategory === 'all' ? '1px solid var(--text-main)' : '1px solid var(--line-2)',
                  backgroundColor: activeCategory === 'all' ? 'var(--bg-secondary)' : '#ffffff',
                  fontWeight: activeCategory === 'all' ? '700' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{dict[lang].all}</span>
                {activeCategory === 'all' && <Check style={{ width: '16px', height: '16px' }} />}
              </button>

              {sortedCategories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setActiveCategory(cat._id);
                    setIsFilterPopupOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: activeCategory === cat._id ? '1px solid var(--text-main)' : '1px solid var(--line-2)',
                    backgroundColor: activeCategory === cat._id ? 'var(--bg-secondary)' : '#ffffff',
                    fontWeight: activeCategory === cat._id ? '700' : '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{t(cat.name)}</span>
                  {activeCategory === cat._id && <Check style={{ width: '16px', height: '16px' }} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile Cart Scrim Overlay */}
      {isMobileCartOpen && (
        <div 
          onClick={() => setIsMobileCartOpen(false)}
          className="mobile-cart-scrim"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(1px)',
            zIndex: 140
          }}
        />
      )}
    </div>
  );
}

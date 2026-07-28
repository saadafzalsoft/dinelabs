'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { WORLD_LANGUAGES } from '../../lib/constants';
import { checkIfStoreOpen } from '../../lib/timezone';
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = 'ltr';
      document.body.dir = 'ltr';
    }
  }, [lang]);

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

  // Set dynamic favicon based on store logo
  useEffect(() => {
    if (typeof window !== 'undefined' && tenant?.logoUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = tenant.logoUrl;
    }
  }, [tenant]);

  // Load cart and details from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem(`dinelabs_lang_${tenant.slug}`);
    if (savedLang) {
      setLang(savedLang);
    }
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
      const savedTable = localStorage.getItem(`dinelabs_table_${tenant.slug}`);
      if (savedTable) {
        currentTable = savedTable;
        setTableNo(savedTable);
      } else {
        setTableNo('');
      }
    }

    // Set mode from local storage or pick default
    const savedMode = localStorage.getItem(`dinelabs_mode_${tenant.slug}`);
    if (currentTable) {
      setMode(savedMode && ['dine-in', 'pickup', 'delivery'].includes(savedMode) ? savedMode : 'dine-in');
    } else {
      // If no QR code scanned, dine-in is disabled! Pick pickup or delivery.
      if (savedMode && savedMode !== 'dine-in') {
        setMode(savedMode);
      } else {
        if (tenant.enabledModes.pickup) setMode('pickup');
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
    const currency = tenant.baseCurrency || 'USD';
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
    const symbol = currencySymbols[currency] || (currency + ' ');
    const formattedAmount = currency === 'LBP'
      ? parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : parseFloat(amount).toFixed(2).replace('.', ',');
    return `${symbol}${formattedAmount}`;
  };

  // Helper to resolve translated keys
  const t = (textMap) => {
    if (!textMap) return '';
    if (typeof textMap === 'string') return textMap;
    return textMap[lang] || textMap['en'] || textMap['ar'] || Object.values(textMap)[0] || '';
  };

  // UI dictionary translations
  const dictRaw = {
    en: {
      basket: "Basket",
      viewBasket: "View Basket",
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
      open: "Open",
      sizeLabel: "Choose Size",
      addonLabel: "Premium Addons",
      removalLabel: "Remove Ingredients",
      chooseMandatory: "Mandatory selection",
      addedToCart: "Added to cart!",
      tableNoPlaceholder: "Table number auto-scanned",
      free: "Free",
      noFooter: "Strictly No Footer",
      followShare: "Follow & Share",
      location: "Location",
      openingHoursTitle: "Opening Hours",
      builtWith: "Built with",
      Sunday: "Sunday",
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday"
    },
    ar: {
      basket: "السلة",
      viewBasket: "عرض السلة",
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
      open: "مفتوح",
      sizeLabel: "اختر الحجم",
      addonLabel: "إضافات مميزة",
      removalLabel: "إزالة المكونات",
      chooseMandatory: "اختيار إلزامي",
      addedToCart: "تمت الإضافة إلى السلة!",
      tableNoPlaceholder: "تم تسجيل رقم الطاولة تلقائياً",
      free: "مجاني",
      noFooter: "يمنع تذييل الصفحة",
      followShare: "تابعنا وشارك",
      location: "الموقع",
      openingHoursTitle: "أوقات العمل",
      builtWith: "صنع بواسطة",
      Sunday: "الأحد",
      Monday: "الإثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت"
    },
    ru: {
      basket: "Корзина",
      viewBasket: "Просмотреть корзину",
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
      open: "Открыто",
      sizeLabel: "Выберите размер",
      addonLabel: "Добавки",
      removalLabel: "Исключить ингредиенты",
      chooseMandatory: "Обязательный выбор",
      addedToCart: "Добавлено в корзину!",
      tableNoPlaceholder: "Столик отсканирован",
      free: "Бесплатно",
      noFooter: "Без футера",
      followShare: "Подписывайтесь и делитесь",
      location: "Местоположение",
      openingHoursTitle: "Часы работы",
      builtWith: "Создано с помощью",
      Sunday: "Воскресенье",
      Monday: "Понедельник",
      Tuesday: "Вторник",
      Wednesday: "Среда",
      Thursday: "Четверг",
      Friday: "Пятница",
      Saturday: "Суббота"
    },
    es: {
      basket: "Cesta",
      viewBasket: "Ver cesta",
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
      open: "Abierto",
      sizeLabel: "Elegir tamaño",
      addonLabel: "Extras premium",
      removalLabel: "Quitar ingredientes",
      chooseMandatory: "Selección obligatoria",
      addedToCart: "¡Añadido al carrito!",
      tableNoPlaceholder: "Mesa auto-escaneada",
      free: "Gratis",
      noFooter: "Sin pie de página",
      followShare: "Síguenos y comparte",
      location: "Ubicación",
      openingHoursTitle: "Horario de apertura",
      builtWith: "Creado con",
      Sunday: "Domingo",
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado"
    },
    fr: {
      basket: "Panier",
      viewBasket: "Voir le panier",
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
      open: "Ouvert",
      sizeLabel: "Choisir la taille",
      addonLabel: "Suppléments premium",
      removalLabel: "Retirer des ingrédients",
      chooseMandatory: "Sélection obligatoire",
      addedToCart: "Ajouté au panier !",
      tableNoPlaceholder: "Table auto-scannée",
      free: "Gratuit",
      noFooter: "Sans pied de page",
      followShare: "Suivez-nous & partagez",
      location: "Emplacement",
      openingHoursTitle: "Heures d'ouverture",
      builtWith: "Créé avec",
      Sunday: "Dimanche",
      Monday: "Lundi",
      Tuesday: "Mardi",
      Wednesday: "Mercredi",
      Thursday: "Jeudi",
      Friday: "Vendredi",
      Saturday: "Samedi"
    },
    de: {
      basket: "Warenkorb",
      viewBasket: "Warenkorb ansehen",
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
      open: "Offen",
      sizeLabel: "Größe wählen",
      addonLabel: "Premium-Extras",
      removalLabel: "Zutaten entfernen",
      chooseMandatory: "Pflichtfeld",
      addedToCart: "In den Warenkorb gelegt!",
      tableNoPlaceholder: "Tischnummer автоматически gescannt",
      free: "Kostenlos",
      noFooter: "Keine Fußzeile",
      followShare: "Folgen & teilen",
      location: "Standort",
      openingHoursTitle: "Öffnungszeiten",
      builtWith: "Erstellt mit",
      Sunday: "Sonntag",
      Monday: "Montag",
      Tuesday: "Dienstag",
      Wednesday: "Mittwoch",
      Thursday: "Donnerstag",
      Friday: "Freitag",
      Saturday: "Samstag"
    },
    it: {
      basket: "Carrello",
      viewBasket: "Visualizza il carrello",
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
      open: "Aperto",
      sizeLabel: "Scegli dimensione",
      addonLabel: "Aggiunte premium",
      removalLabel: "Rimuovi ingredienti",
      chooseMandatory: "Selezione obbligatoria",
      addedToCart: "Aggiunto al carrello!",
      tableNoPlaceholder: "Tavolo scansionato automaticamente",
      free: "Gratis",
      noFooter: "Nessun piè di pagina",
      followShare: "Seguici e condividi",
      location: "Posizione",
      openingHoursTitle: "Orari di apertura",
      builtWith: "Creato con",
      Sunday: "Domenica",
      Monday: "Lunedì",
      Tuesday: "Martedì",
      Wednesday: "Mercoledì",
      Thursday: "Giovedì",
      Friday: "Venerdì",
      Saturday: "Sabato"
    },
    ka: {
      basket: "კალათა",
      viewBasket: "კალათის ნახვა",
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
      open: "ღია",
      sizeLabel: "აირჩიეთ ზომა",
      addonLabel: "პრემიუმ დანამატები",
      removalLabel: "ინგრედიენტების ამოღება",
      chooseMandatory: "სავალდებულო არჩევანი",
      addedToCart: "დაემატა კალათაში!",
      tableNoPlaceholder: "მაგიდის ნომერი სკანირებულია",
      free: "უფასო",
      noFooter: "ფუტერის გარეშე",
      followShare: "მოგვყევით და გააზიარეთ",
      location: "მდებარეობა",
      openingHoursTitle: "სამუშაო საათები",
      builtWith: "შექმნილია",
      Sunday: "კვირა",
      Monday: "ორშაბათი",
      Tuesday: "სამშაბათი",
      Wednesday: "ოთხშაბათი",
      Thursday: "ხუთშაბათი",
      Friday: "პარასკევი",
      Saturday: "შაბათი"
    }
  };

  const dict = new Proxy(dictRaw, {
    get: (target, name) => {
      const langDict = target[name] || target['en'] || {};
      return new Proxy(langDict, {
        get: (innerTarget, key) => {
          return innerTarget[key] || key;
        }
      });
    }
  });

  // Check if store is open in store's local timezone
  const isClosed = !checkIfStoreOpen(tenant.openingHours, tenant.country);

  // Filter products based on search query
  const filteredProducts = initialProducts.filter(product => {
    // Search query filter
    const nameMatch = t(product.name).toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = t(product.description).toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || descMatch;
  });

  // Category list filter: Pinned category will be pinned to the top of the storefront list
  const sortedCategories = [...initialCategories].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.order - b.order;
  });

  const visibleCategories = sortedCategories.filter(c => !c.isPinned);

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

    // Resolve size, addons, and removals to full name objects
    let resolvedSize = modalSize;
    if (modalSize) {
      const pv = selectedProduct.variations?.find(o => (typeof o.name === 'object' ? (o.name.en || Object.values(o.name)[0]) === modalSize : o.name === modalSize));
      if (pv && typeof pv.name === 'object') {
        resolvedSize = pv.name;
      } else if (sizeMod) {
        const opt = sizeMod.options?.find(o => (typeof o.name === 'object' ? (o.name.en || Object.values(o.name)[0]) === modalSize : o.name === modalSize));
        if (opt && typeof opt.name === 'object') {
          resolvedSize = opt.name;
        }
      }
    }

    const resolvedAddons = modalAddons.map(addonName => {
      const pa = selectedProduct.addons?.find(o => (typeof o.name === 'object' ? (o.name.en || Object.values(o.name)[0]) === addonName : o.name === addonName));
      if (pa && typeof pa.name === 'object') {
        return pa.name;
      }
      for (const group of initialModifierGroups.filter(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'addons' && selectedProduct.modifierGroups?.includes(m._id))) {
        const opt = group.options?.find(o => (typeof o.name === 'object' ? (o.name.en || Object.values(o.name)[0]) === addonName : o.name === addonName));
        if (opt && typeof opt.name === 'object') {
          return opt.name;
        }
      }
      return addonName;
    });

    const resolvedRemovals = modalRemovals.map(removalName => {
      const pr = selectedProduct.removals?.find(o => (typeof o.name === 'object' ? (o.name.en || Object.values(o.name)[0]) === removalName : o.name === removalName));
      if (pr && typeof pr.name === 'object') {
        return pr.name;
      }
      for (const group of initialModifierGroups.filter(m => m.tenantId.toString() === tenant._id.toString() && m.type === 'removals' && selectedProduct.modifierGroups?.includes(m._id))) {
        const opt = group.options?.find(o => (typeof o.name === 'object' ? (o.name.en || Object.values(o.name)[0]) === removalName : o.name === removalName));
        if (opt && typeof opt.name === 'object') {
          return opt.name;
        }
      }
      return removalName;
    });

    const cartItem = {
      id: new Date().getTime().toString(), // Unique cart element id
      productId: selectedProduct._id,
      name: selectedProduct.name,
      basePrice: (selectedProduct.discountedPrice && selectedProduct.discountedPrice > 0) ? selectedProduct.discountedPrice : selectedProduct.price,
      quantity: modalQty,
      size: resolvedSize,
      addons: resolvedAddons,
      removedIngredients: resolvedRemovals,
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
    <div dir="ltr" className="main-viewport">
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
          padding: '8px 16px',
          textAlign: 'center'
        }}>
          <div style={{ width: '100%', fontSize: '0.85rem' }}>
            ⚠️ {dict[lang].warningClosed}
          </div>
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
                            localStorage.setItem(`dinelabs_lang_${tenant.slug}`, l);
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
              <section key={cat._id} className="promo-section" style={{ marginBottom: '-14px' }}>
                <div className="section-header">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  
                    <span>{t(cat.name)}</span>
                  </h2>
                </div>
                <div className="offers-row">
                  {promoProducts.map(product => (
                    <div
                      key={product._id}
                      className="offer-card"
                      onClick={() => { if (product.isAvailable) openCustomizer(product); }}
                      style={{
                        opacity: (!product.isAvailable || isClosed) ? 0.5 : 1,
                        cursor: (!product.isAvailable || isClosed) ? 'default' : 'pointer'
                      }}
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
                            <Plus className="ic" style={{ width: '16px', height: '16px', color: '#000000' }} />
                          </div>
                        )}
                      </div>
                      <h3 className="offer-title">{t(product.name)}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {product.discountedPrice && product.discountedPrice > 0 ? (
                          <div className="offer-price" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8em' }}>{formatPrice(product.price)}</span>
                            <span style={{ color: '#000000', fontWeight: '700' }}>{formatPrice(product.discountedPrice)}</span>
                          </div>
                        ) : (
                          <p className="offer-price" style={{ margin: 0 }}>{formatPrice(product.price)}</p>
                        )}
                        {!product.isAvailable && (
                          <span className="out-of-stock-badge" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>{dict[lang].outOfStock}</span>
                        )}
                      </div>
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
                onClick={() => {
                  setActiveCategory('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
                style={{ border: 'none', font: 'inherit' }}
              >
                {dict[lang].all}
              </button>
              {visibleCategories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setActiveCategory(cat._id);
                    const el = document.getElementById(`cat-section-${cat._id}`);
                    if (el) {
                      const yOffset = -120; // offset for sticky header
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
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

          {/* Categorized Product Grid list */}
          <section className="products-list-section">
            {(() => {
              const renderProductCard = (product) => (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() => { if (product.isAvailable) openCustomizer(product); }}
                  style={{
                    opacity: (!product.isAvailable || isClosed) ? 0.5 : 1,
                    cursor: (!product.isAvailable || isClosed) ? 'default' : 'pointer'
                  }}
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
                  <div className="product-info" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="product-title">{t(product.name)}</h3>
                    <p className="product-desc">{t(product.description)}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {product.discountedPrice && product.discountedPrice > 0 ? (
                        <div className="product-price-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                          <span className="product-price" style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8em' }}>{formatPrice(product.price)}</span>
                          <span className="product-price" style={{ color: '#000000', fontWeight: '700' }}>{formatPrice(product.discountedPrice)}</span>
                        </div>
                      ) : (
                        <div className="product-price-row" style={{ margin: 0 }}>
                          <span className="product-price" style={{ textDecoration: 'none' }}>{formatPrice(product.price)}</span>
                        </div>
                      )}
                      {!product.isAvailable && (
                        <span className="out-of-stock-badge" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>{dict[lang].outOfStock}</span>
                      )}
                    </div>
                  </div>
                </div>
              );

              const categoriesToDisplay = visibleCategories;

              const categorizedProductIds = new Set();
              const categoryBlocks = categoriesToDisplay.map(cat => {
                const catProducts = filteredProducts.filter(p => p.categories && p.categories.includes(cat._id));
                if (catProducts.length === 0) return null;

                catProducts.forEach(p => categorizedProductIds.add(p._id));

                return (
                  <div key={cat._id} id={`cat-section-${cat._id}`} className="category-section-block" style={{ marginBottom: '32px' }}>
                    <div className="category-section-header" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid var(--line)'
                    }}>
                      <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        margin: 0,
                        color: 'var(--text-main)',
                        letterSpacing: '-0.02em'
                      }}>
                        {t(cat.name)}
                      </h2>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {catProducts.length} {catProducts.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <div className="products-grid">
                      {catProducts.map(renderProductCard)}
                    </div>
                  </div>
                );
              }).filter(Boolean);

              // Check for products not matched in mapped categories (uncategorized)
              const uncategorizedProducts = filteredProducts.filter(p => !categorizedProductIds.has(p._id));

              return (
                <>
                  {categoryBlocks}
                  {uncategorizedProducts.length > 0 && (
                    <div className="category-section-block" style={{ marginBottom: '32px' }}>
                      <div className="category-section-header" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '2px solid var(--line)'
                      }}>
                        <h2 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.25rem',
                          fontWeight: '800',
                          margin: 0,
                          color: 'var(--text-main)',
                          letterSpacing: '-0.02em'
                        }}>
                          {t('Other Items')}
                        </h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          {uncategorizedProducts.length} {uncategorizedProducts.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <div className="products-grid">
                        {uncategorizedProducts.map(renderProductCard)}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </section>
        </main>

        {/* Right shopping basket panel */}
        <aside className={`right-panel ${isMobileCartOpen ? 'active' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '16px' }}>
            <h2 className="basket-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '20px' }}>
              {dict[lang].basket}
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
              {tenant.enabledModes.dineIn && Boolean(tableNo || tableParam) && (
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
                        {item.size && `${t(item.size)}`}
                        {item.addons.length > 0 && `, +${item.addons.map(a => t(a)).join(', ')}`}
                        {item.removedIngredients.length > 0 && `, (${{ en: 'No', ar: 'بدون', ru: 'Без', es: 'Sin', fr: 'Sans', de: 'Ohne', it: 'Senza', ka: 'გარეშე' }[lang] || 'No'} ${item.removedIngredients.map(r => t(r)).join(', ')})`}
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
      {tenant.status === 'active' && !isClosed && cart.length > 0 && (
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
            <span className="mobile-cart-text">{dict[lang].viewBasket}</span>
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
          width: '320px',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 25px rgba(0,0,0,0.1)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          zIndex: 2001,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid #ef4444',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxSizing: 'border-box'
          }}>
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold' }}>
                {tenant.name?.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', fontFamily: 'var(--font-heading, inherit)' }}>
              {tenant.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isClosed ? '#ef4444' : '#22c55e',
                display: 'inline-block'
              }}></span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isClosed ? '#ef4444' : '#22c55e' }}>
                {isClosed ? (dict[lang].closed || 'Closed') : (dict[lang].open || 'Open')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#374151',
              flexShrink: 0
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {/* FOLLOW & SHARE */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '12px', marginTop: 0 }}>
              {dict[lang].followShare || 'FOLLOW & SHARE'}
            </h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${(tenant.whatsappNumber || (tenant.notifications && tenant.notifications.whatsappNumber) || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111827',
                  fontSize: '1.2rem',
                  textDecoration: 'none'
                }}
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              {/* Instagram */}
              {tenant.instagram && (
                <a
                  href={tenant.instagram.startsWith('http') ? tenant.instagram : `https://instagram.com/${tenant.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    fontSize: '1.2rem',
                    textDecoration: 'none'
                  }}
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              {/* TikTok */}
              {tenant.tiktok && (
                <a
                  href={tenant.tiktok.startsWith('http') ? tenant.tiktok : `https://tiktok.com/@${tenant.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    fontSize: '1.2rem',
                    textDecoration: 'none'
                  }}
                >
                  <i className="fa-brands fa-tiktok"></i>
                </a>
              )}
              {/* Share button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: tenant.name,
                      url: window.location.href
                    }).catch(err => console.log(err));
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111827',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                <i className="fa-solid fa-share-nodes"></i>
              </button>
            </div>
          </div>

          {/* LOCATION */}
          {tenant.address && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '12px', marginTop: 0 }}>
                {dict[lang].location || 'LOCATION'}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#374151',
                  flexShrink: 0
                }}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1f2937', lineHeight: '1.4' }}>
                  {tenant.address}
                </span>
              </div>
            </div>
          )}

          {/* OPENING HOURS */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '12px', marginTop: 0 }}>
              {dict[lang].openingHoursTitle || 'OPENING HOURS'}
            </h4>
            <div style={{
              border: '1px solid #f3f4f6',
              borderRadius: '16px',
              padding: '16px',
              backgroundColor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {(() => {
                const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const currentDayIndex = new Date().getDay();
                const currentDayName = daysOrder[currentDayIndex];

                return daysOrder.map(day => {
                  const hours = tenant.openingHours?.find(h => h.day === day) || { isOpen: false, open: '', close: '' };
                  const isCurrent = day === currentDayName;

                  return (
                    <div
                      key={day}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.9rem',
                        fontWeight: isCurrent ? '700' : '400',
                        color: isCurrent ? '#000000' : '#6b7280'
                      }}
                    >
                      <span>{dict[lang][day] || day}</span>
                      <span>
                        {hours.isOpen ? `${hours.open} - ${hours.close}` : (dict[lang].closed || 'Closed')}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Badge footer */}
          <div style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px'
          }}>
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: '#4b5563',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{dict[lang].builtWith || 'Built with'}</span>
              <strong style={{ color: '#111827', fontWeight: '700' }}>DineLabs</strong>
            </div>
          </div>
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
                  window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  textAlign: 'left',
                  color: 'var(--text-main)'
                }}
              >
                <span>{dict[lang].all}</span>
                {activeCategory === 'all' && <Check style={{ width: '16px', height: '16px' }} />}
              </button>

              {visibleCategories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setActiveCategory(cat._id);
                    setIsFilterPopupOpen(false);
                    const el = document.getElementById(`cat-section-${cat._id}`);
                    if (el) {
                      const yOffset = -120;
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
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
                    textAlign: 'left',
                    color: 'var(--text-main)'
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

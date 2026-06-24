'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import SearchSelect from '../../components/SearchSelect';

export default function CheckoutPage() {
  const router = useRouter();
  const { storename } = useParams();
  const searchParams = useSearchParams();
  const tableParam = searchParams ? searchParams.get('table') : '';

  // Loading and State
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState('dine-in'); // 'dine-in' | 'pickup' | 'delivery'
  const [tableNo, setTableNo] = useState('');
  const [tablesList, setTablesList] = useState([]); // Dine-in physical tables
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Phone inputs
  const [countryCode, setCountryCode] = useState('+961');
  const [phoneNum, setPhoneNum] = useState('');

  // Delivery fields split
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('cash-on-arrival'); // 'cash-on-arrival' | 'pay-at-counter' | 'billed-to-room'
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lang, setLang] = useState('en');

  // Load language from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(`dinelabs_lang_${storename}`);
      if (savedLang) setLang(savedLang);
    }
  }, [storename]);

  // Translation dictionary
  const dict = {
    en: { backToMenu: 'Back to Menu', checkout: 'Checkout', yourInfo: 'Your Information', name: 'Name', phone: 'Phone Number', email: 'Email', city: 'City', street: 'Street name', building: 'Building name / no.', floor: 'Floor', instructions: 'Instructions for driver (Optional)', deliveryArea: 'Delivery Area', ourLocation: 'Our Location', getDirections: 'Get Directions', pickupInfo: 'Your pick-up information', dineInInfo: 'Your dine-in information', selectTable: 'Select Table', orderSummary: 'Order Summary', subtotal: 'Subtotal', deliveryFee: 'Delivery Fee', total: 'Total', placeOrder: 'Place Order', placing: 'Placing...', shopClosed: 'The shop is closed. No orders are being accepted at this time.', paymentMethod: 'Payment method', cashOnArrival: 'Cash on arrival', payAtCounter: 'Pay at counter', billedToRoom: 'Billed to room' },
    ar: { backToMenu: 'العودة إلى القائمة', checkout: 'الدفع', yourInfo: 'معلوماتك', name: 'الاسم', phone: 'رقم الهاتف', email: 'البريد الإلكتروني', city: 'المدينة', street: 'اسم الشارع', building: 'اسم المبنى / رقمه', floor: 'الطابق', instructions: 'تعليمات للسائق (اختياري)', deliveryArea: 'منطقة التوصيل', ourLocation: 'موقعنا', getDirections: 'الحصول على الاتجاهات', pickupInfo: 'معلومات الاستلام', dineInInfo: 'معلومات تناول الطعام', selectTable: 'اختر الطاولة', orderSummary: 'ملخص الطلب', subtotal: 'المجموع الفرعي', deliveryFee: 'رسوم التوصيل', total: 'الإجمالي', placeOrder: 'تأكيد الطلب', placing: 'جارٍ التأكيد...', shopClosed: 'المتجر مغلق. لا يتم قبول طلبات في الوقت الحالي.', paymentMethod: 'طريقة الدفع', cashOnArrival: 'الدفع عند الوصول', payAtCounter: 'الدفع عند الكاونتر', billedToRoom: 'على حساب الغرفة' },
    ru: { backToMenu: 'Назад в меню', checkout: 'Оформление', yourInfo: 'Ваша информация', name: 'Имя', phone: 'Телефон', email: 'Эл. почта', city: 'Город', street: 'Улица', building: 'Дом', floor: 'Этаж', instructions: 'Инструкции для курьера (необязательно)', deliveryArea: 'Зона доставки', ourLocation: 'Наш адрес', getDirections: 'Маршрут', pickupInfo: 'Данные для самовывоза', dineInInfo: 'Данные для зала', selectTable: 'Выберите столик', orderSummary: 'Итого заказа', subtotal: 'Подытог', deliveryFee: 'Доставка', total: 'Итого', placeOrder: 'Оформить заказ', placing: 'Оформляем...', shopClosed: 'Ресторан закрыт.', paymentMethod: 'Способ оплаты', cashOnArrival: 'Наличные при доставке', payAtCounter: 'Оплата на кассе', billedToRoom: 'На номер' },
    es: { backToMenu: 'Volver al menú', checkout: 'Pago', yourInfo: 'Tu información', name: 'Nombre', phone: 'Teléfono', email: 'Correo electrónico', city: 'Ciudad', street: 'Calle', building: 'Edificio', floor: 'Piso', instructions: 'Instrucciones para el conductor (Opcional)', deliveryArea: 'Zona de entrega', ourLocation: 'Nuestra ubicación', getDirections: 'Obtener indicaciones', pickupInfo: 'Info de recogida', dineInInfo: 'Info para comer aquí', selectTable: 'Seleccionar mesa', orderSummary: 'Resumen del pedido', subtotal: 'Subtotal', deliveryFee: 'Envío', total: 'Total', placeOrder: 'Realizar pedido', placing: 'Realizando...', shopClosed: 'La tienda está cerrada.', paymentMethod: 'Método de pago', cashOnArrival: 'Efectivo al llegar', payAtCounter: 'Pagar en caja', billedToRoom: 'Cargo a habitación' },
    fr: { backToMenu: 'Retour au menu', checkout: 'Paiement', yourInfo: 'Vos informations', name: 'Nom', phone: 'Téléphone', email: 'E-mail', city: 'Ville', street: 'Rue', building: 'Bâtiment', floor: 'Étage', instructions: 'Instructions pour le livreur (Facultatif)', deliveryArea: 'Zone de livraison', ourLocation: 'Notre adresse', getDirections: 'Itinéraire', pickupInfo: 'Infos retrait', dineInInfo: 'Infos sur place', selectTable: 'Choisir une table', orderSummary: 'Résumé de la commande', subtotal: 'Sous-total', deliveryFee: 'Frais de livraison', total: 'Total', placeOrder: 'Passer la commande', placing: 'Envoi...', shopClosed: 'Le restaurant est fermé.', paymentMethod: 'Mode de paiement', cashOnArrival: 'Espèces à la livraison', payAtCounter: 'Payer au comptoir', billedToRoom: 'Facturé à la chambre' },
    de: { backToMenu: 'Zurück zum Menü', checkout: 'Kasse', yourInfo: 'Ihre Informationen', name: 'Name', phone: 'Telefon', email: 'E-Mail', city: 'Stadt', street: 'Straße', building: 'Gebäude', floor: 'Stockwerk', instructions: 'Anweisungen für den Fahrer (Optional)', deliveryArea: 'Liefergebiet', ourLocation: 'Unser Standort', getDirections: 'Wegbeschreibung', pickupInfo: 'Abholinformationen', dineInInfo: 'Vor-Ort-Informationen', selectTable: 'Tisch auswählen', orderSummary: 'Bestellübersicht', subtotal: 'Zwischensumme', deliveryFee: 'Liefergebühr', total: 'Gesamt', placeOrder: 'Bestellung aufgeben', placing: 'Wird bestellt...', shopClosed: 'Das Restaurant ist geschlossen.', paymentMethod: 'Zahlungsmethode', cashOnArrival: 'Barzahlung bei Lieferung', payAtCounter: 'An der Kasse zahlen', billedToRoom: 'Auf Zimmer buchen' },
    it: { backToMenu: 'Torna al menu', checkout: 'Cassa', yourInfo: 'Le tue informazioni', name: 'Nome', phone: 'Telefono', email: 'Email', city: 'Città', street: 'Via', building: 'Edificio', floor: 'Piano', instructions: 'Istruzioni per il corriere (Facoltativo)', deliveryArea: 'Zona di consegna', ourLocation: 'La nostra posizione', getDirections: 'Indicazioni stradali', pickupInfo: 'Info ritiro', dineInInfo: 'Info per mangiare al ristorante', selectTable: 'Seleziona tavolo', orderSummary: 'Riepilogo ordine', subtotal: 'Subtotale', deliveryFee: 'Spese di consegna', total: 'Totale', placeOrder: 'Conferma ordine', placing: 'Invio...', shopClosed: 'Il ristorante è chiuso.', paymentMethod: 'Metodo di pagamento', cashOnArrival: 'Contanti alla consegna', payAtCounter: 'Pagamento al bancone', billedToRoom: 'Addebito in camera' },
    ka: { backToMenu: 'მენიუში დაბრუნება', checkout: 'შეკვეთის გაფორმება', yourInfo: 'თქვენი ინფორმაცია', name: 'სახელი', phone: 'ტელეფონი', email: 'ელ. ფოსტა', city: 'ქალაქი', street: 'ქუჩა', building: 'შენობა', floor: 'სართული', instructions: 'ინსტრუქციები მძღოლისთვის (არჩევითი)', deliveryArea: 'მიტანის ზონა', ourLocation: 'ჩვენი მისამართი', getDirections: 'მიმართულების მიღება', pickupInfo: 'წაღების ინფორმაცია', dineInInfo: 'ადგილზე ჭამის ინფორმაცია', selectTable: 'მაგიდის არჩევა', orderSummary: 'შეკვეთის შეჯამება', subtotal: 'ქვეჯამი', deliveryFee: 'მიტანის საფასური', total: 'ჯამი', placeOrder: 'შეკვეთის გაფორმება', placing: 'მიმდინარეობს...', shopClosed: 'რესტორანი დახურულია.', paymentMethod: 'გადახდის მეთოდი', cashOnArrival: 'ნაღდი ანგარიშსწორება', payAtCounter: 'გადახდა სალაროში', billedToRoom: 'ოთახზე ჩაწერა' },
  };
  const d = dict[lang] || dict.en;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    localStorage.setItem(`dinelabs_mode_${storename}`, newMode);
  };

  // Fetch tenant info and load cart from localStorage on mount
  useEffect(() => {
    async function init() {
      try {
        const settingsRes = await fetch(`/api/tenant/settings?tenantSlug=${storename}`);
        if (settingsRes.ok) {
          const t = await settingsRes.json();
          setTenant(t);
        }
      } catch (err) {
        console.error('Error fetching tenant settings', err);
      }

      // Fetch physical tables for Dine-in interactive layouts
      try {
        const tablesRes = await fetch(`/api/tables?tenantSlug=${storename}`);
        if (tablesRes.ok) {
          const tablesData = await tablesRes.json();
          setTablesList(tablesData);
        }
      } catch (err) {
        console.error('Failed fetching tables', err);
      }

      // Load cart
      const savedCart = localStorage.getItem(`dinelabs_cart_${storename}`);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCart(parsed);
          if (parsed.length === 0) {
            router.push(`/${storename}`);
          }
        } catch (e) {
          router.push(`/${storename}`);
        }
      } else {
        router.push(`/${storename}`);
      }

      // Load modes
      let currentTable = '';
      if (tableParam) {
        try {
          currentTable = decodeURIComponent(tableParam);
        } catch (e) {
          currentTable = tableParam;
        }
        setTableNo(currentTable);
        localStorage.setItem(`dinelabs_table_${storename}`, currentTable);
      } else {
        setTableNo('');
        localStorage.removeItem(`dinelabs_table_${storename}`);
      }

      const savedMode = localStorage.getItem(`dinelabs_mode_${storename}`) || 'dine-in';
      if (currentTable && savedMode === 'dine-in') {
        setMode('dine-in');
      } else {
        setMode(savedMode);
      }

      setLoading(false);
    }
    init();
  }, [storename, router]);

  // Auto-fill customer form from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(`dinelabs_customer_${storename}`);
      if (saved) {
        const c = JSON.parse(saved);
        if (c.name) setName(c.name);
        if (c.email) setEmail(c.email);
        if (c.countryCode) setCountryCode(c.countryCode);
        if (c.phoneNum) setPhoneNum(c.phoneNum);
        if (c.city) setCity(c.city);
        if (c.street) setStreet(c.street);
        if (c.building) setBuilding(c.building);
        if (c.floor) setFloor(c.floor);
        if (c.instructions) setInstructions(c.instructions);
      }
    } catch (e) {
      console.error('Error loading saved customer data', e);
    }
  }, [storename]);

  // Persist customer form data to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const data = { name, email, countryCode, phoneNum, city, street, building, floor, instructions };
    localStorage.setItem(`dinelabs_customer_${storename}`, JSON.stringify(data));
  }, [name, email, countryCode, phoneNum, city, street, building, floor, instructions, storename]);

  // Auto-assign table if missing in Dine-in mode
  useEffect(() => {
    if (mode === 'dine-in' && !tableNo && tablesList.length > 0) {
      const availableTable = tablesList.find(t => !t.isBooked);
      if (availableTable) {
        setTableNo(availableTable.name);
      } else {
        setTableNo(tablesList[0].name);
      }
    }
  }, [mode, tableNo, tablesList]);

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

  const isClosed = tenant ? !checkIfStoreOpen(tenant.openingHours) : false;

  // Dynamic price formatter using comma decimal separator: LBP XX,XX or $XX,XX
  const formatPrice = (amount) => {
    if (tenant?.baseCurrency === 'LBP') {
      // Formatter for LBP currency
      return 'LBP ' + parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  const getCurrencyLabel = () => {
    return tenant?.baseCurrency || 'USD';
  };

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const selectedZone = tenant?.deliveryMode === 'custom' && tenant?.deliveryZones
    ? tenant.deliveryZones.find(z => z.id === selectedZoneId)
    : null;

  // Delivery fee read from tenant settings (manager configurable)
  const deliveryFee = mode === 'delivery' 
    ? (tenant?.deliveryMode === 'custom' 
      ? (selectedZone?.fee || 0) 
      : (tenant?.deliveryFee || 0)) 
    : 0.00;

  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (isClosed) {
      setErrorMessage('The shop is closed. No orders are being accepted at this time.');
      return;
    }

    // Field validation
    if (!name.trim()) {
      setErrorMessage('Full Name is required');
      return;
    }
    if (!phoneNum.trim()) {
      setErrorMessage('Phone Number is required');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email Address is required');
      return;
    }

    if (mode === 'delivery') {
      if (tenant?.deliveryMode === 'custom' && !selectedZoneId) {
        setErrorMessage('Please select your delivery area');
        return;
      }
      if (!city.trim() || !street.trim() || !building.trim() || !floor.trim()) {
        setErrorMessage('All delivery address details (City, Street, Building, Floor) are required');
        return;
      }
      const minOrder = tenant.minOrderValue || 0;
      if (subtotal < minOrder) {
        setErrorMessage(`Minimum order value for delivery is ${formatPrice(minOrder)}. Your subtotal is ${formatPrice(subtotal)}.`);
        return;
      }
    }

    setSubmitting(true);
    setErrorMessage('');

    // Compile combined address for delivery
    const combinedAddress = mode === 'delivery'
      ? `${selectedZone ? `[Area: ${selectedZone.name}] ` : ''}${city.trim()}, ${street.trim()}, ${building.trim()}, Floor ${floor.trim()}${instructions.trim() ? ` (Instructions: ${instructions.trim()})` : ''}`
      : '';

    // Compile phone with country code
    const fullPhone = `${countryCode} ${phoneNum.trim()}`;

    try {
      const orderPayload = {
        tenantSlug: storename,
        type: mode,
        customer: {
          name: name.trim(),
          phone: fullPhone,
          email: email.trim(),
          address: combinedAddress,
          tableNo: mode === 'dine-in' ? tableNo : null
        },
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name.en,
          price: item.basePrice,
          quantity: item.quantity,
          size: item.size,
          addons: item.addons,
          removedIngredients: item.removedIngredients,
          notes: item.notes || '',
          priceCalculated: item.unitPrice
        })),
        subtotal,
        deliveryFee,
        total,
        language: 'en'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Clear cart
      localStorage.removeItem(`dinelabs_cart_${storename}`);
      
      // Redirect to confirmation screen
      router.push(`/${storename}/confirmation/${data.order._id}`);
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while placing order. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading || !tenant) {
    return (
      <div className="main-viewport" style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header Back button skeleton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div className="skeleton" style={{ width: '120px', height: '24px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '180px', height: '36px', borderRadius: '12px' }} />
          </div>

          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
            {/* Left form skeleton */}
            <div className="checkout-left" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="skeleton" style={{ width: '100%', height: '56px', borderRadius: '16px' }} />
              <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="skeleton" style={{ width: '200px', height: '24px', borderRadius: '6px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
                </div>
              </div>
            </div>

            {/* Right summary skeleton */}
            <div className="checkout-right" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="skeleton" style={{ width: '150px', height: '24px', borderRadius: '6px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '8px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '8px' }} />
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-viewport" style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: isClosed ? '80px 20px 40px 20px' : '40px 20px' }}>
      {isClosed && (
        <div className="closed-banner" style={{ 
          position: 'fixed', 
          top: 0, 
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
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i> The shop is closed. No orders are being accepted at this time.
          </marquee>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}} />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header navigation back button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <a href={`/${storename}${tableNo ? `?table=${encodeURIComponent(tableNo)}` : ''}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ← Back to Menu
          </a>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '800' }}>Checkout</h1>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: '600', fontSize: '0.9rem' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }}></i> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Left Column: Fulfillment details & customer form info */}
            <div className="checkout-left" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Mode is auto-detected from localStorage — toggle hidden */}
              <div className="delivery-toggle-wrapper" style={{ display: 'none', marginBottom: '20px' }}>
                {tenant.enabledModes?.delivery && (
                  <div 
                    onClick={() => handleModeChange('delivery')}
                    className={`toggle-option ${mode === 'delivery' ? 'active' : ''}`}
                  >
                    <div className="toggle-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-motorcycle" style={{ fontSize: '14px' }}></i>
                      <span>Delivery</span>
                    </div>
                    <div className="toggle-desc">
                      {tenant.deliveryMode === 'custom' && selectedZone
                        ? `${selectedZone.time} mins`
                        : `${tenant.waitTimes?.delivery || 30} mins`}
                    </div>
                  </div>
                )}
                {tenant.enabledModes?.pickup && (
                  <div 
                    onClick={() => handleModeChange('pickup')}
                    className={`toggle-option ${mode === 'pickup' ? 'active' : ''}`}
                  >
                    <div className="toggle-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-bag-shopping" style={{ fontSize: '14px' }}></i>
                      <span>Pickup</span>
                    </div>
                    <div className="toggle-desc">{tenant.waitTimes?.pickup || 15} mins</div>
                  </div>
                )}
                {tenant.enabledModes?.dineIn && (
                  <div 
                    onClick={() => handleModeChange('dine-in')}
                    className={`toggle-option ${mode === 'dine-in' ? 'active' : ''}`}
                  >
                    <div className="toggle-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-utensils" style={{ fontSize: '14px' }}></i>
                      <span>Dine-in</span>
                    </div>
                    <div className="toggle-desc">{tableNo ? tableNo : 'Table'}</div>
                  </div>
                )}
              </div>

              {/* ==========================================
                  SCENARIO 1: DELIVERY CHECKOUT VIEW
                  ========================================== */}
              {mode === 'delivery' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px' }}>
                    Your Information
                  </h3>

                  {tenant.deliveryMode === 'custom' && (
                    <div className="form-group">
                      <label className="form-label">Delivery Area</label>
                      <SearchSelect
                        value={selectedZoneId}
                        onChange={(val) => setSelectedZoneId(val)}
                        options={tenant.deliveryZones?.map(z => ({
                          value: z.id,
                          label: `${z.name} (Fee: ${formatPrice(z.fee)} · Time: ${z.time} min)`,
                          subtitle: z.name
                        })) || []}
                        placeholder="Search & select your delivery area..."
                        style={{ width: '100%', marginBottom: '16px' }}
                      />
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <SearchSelect
                        value={countryCode}
                        onChange={setCountryCode}
                        options={[
                          { value: '+961', label: 'LB +961' },
                          { value: '+1', label: 'US +1' },
                          { value: '+971', label: 'AE +971' }
                        ]}
                        style={{ width: '110px', flexShrink: 0 }}
                      />
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="Phone Number"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Street name"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Building name / no.</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Building name or number"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Floor</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Floor level"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Instructions for driver (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Ring the second bell"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ==========================================
                  SCENARIO 2: PICK-UP CHECKOUT VIEW
                  ========================================== */}
              {mode === 'pickup' && (
                <>
                  {/* Local location card with map */}
                  {tenant.address ? (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '1.2rem', backgroundColor: 'var(--bg-secondary)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                          <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-primary)' }}></i>
                        </span>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{tenant.address}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Our Location</span>
                        </div>
                      </div>

                      <div style={{ width: '100%', height: '250px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)', marginBottom: tenant.googleMapsLink ? '16px' : '0' }}>
                        <iframe 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          loading="lazy" 
                          allowFullScreen 
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(tenant.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                      
                      {tenant.googleMapsLink && (
                        <a 
                          href={tenant.googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '8px',
                            textDecoration: 'none',
                            color: 'var(--text-main)',
                            fontWeight: '700',
                            fontSize: '0.82rem',
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '12px',
                            padding: '12px',
                            width: '100%',
                            textAlign: 'center'
                          }}
                        >
                          <i className="fa-solid fa-map-location-dot"></i> Get Directions on Google Maps
                        </a>
                      )}
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'left', marginBottom: '20px', fontSize: '0.85rem', color: '#b45309', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#d97706' }}></i> Pickup address is not available yet. Please contact the store directly for pickup location details.
                    </div>
                  )}

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px' }}>
                      Your Information
                    </h3>
                    
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Phone Number</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <SearchSelect
                          value={countryCode}
                          onChange={setCountryCode}
                          options={[
                            { value: '+961', label: 'LB +961' },
                            { value: '+1', label: 'US +1' },
                            { value: '+971', label: 'AE +971' }
                          ]}
                          style={{ width: '110px', flexShrink: 0 }}
                        />
                        <input 
                          type="tel" 
                          className="form-control" 
                          placeholder="Phone Number"
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ==========================================
                  SCENARIO 3: DINE-IN CHECKOUT VIEW
                  ========================================== */}
              {mode === 'dine-in' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px' }}>
                    Your Information
                  </h3>
 
                  {/* Auto Assigned read only table input */}
                  <div className="form-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      value={`Table: ${tableNo || 'Auto Assigning...'}`}
                      disabled
                      style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', fontWeight: '700', color: 'var(--text-main)' }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone Number</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <SearchSelect
                        value={countryCode}
                        onChange={setCountryCode}
                        options={[
                          { value: '+961', label: 'LB +961' },
                          { value: '+1', label: 'US +1' },
                          { value: '+971', label: 'AE +971' }
                        ]}
                        style={{ width: '110px', flexShrink: 0 }}
                      />
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="Phone Number"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fulfillment Standard Delivery/Pickup message */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '1.1rem', backgroundColor: 'var(--bg-secondary)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                  <i className="fa-solid fa-bullseye" style={{ color: 'var(--color-primary)' }}></i>
                </span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Standard</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {mode === 'delivery'
                      ? (tenant.deliveryMode === 'custom' && selectedZone
                          ? `In ${selectedZone.time} mins`
                          : `In ${tenant.waitTimes?.delivery || 30} mins`)
                      : `In ${tenant.waitTimes?.pickup || 15} mins`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Item List Summary & Place Order */}
            <div className="checkout-right" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>
              
              {/* Checkout Item List Summary */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ fontWeight: '700' }}>{item.quantity}x {item.name.en}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {item.size && `${item.size}`}
                          {item.addons?.length > 0 && `, +${item.addons.join(', ')}`}
                          {item.removedIngredients?.length > 0 && `, (No ${item.removedIngredients.join(', ')})`}
                        </span>
                        {item.notes && (
                          <div style={{ fontSize: '0.7rem', color: '#6b7280', fontStyle: 'italic', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa-solid fa-note-sticky" style={{ fontSize: '0.75rem' }}></i> {item.notes}
                          </div>
                        )}
                      </div>
                      <span style={{ fontWeight: '600' }}>{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>Item subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {mode === 'delivery' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span>Delivery Fee</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', borderTop: '1px dashed var(--border-light)', marginTop: '12px', paddingTop: '12px' }}>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={submitting || isClosed}
                className="checkout-btn"
                style={{
                  backgroundColor: (submitting || isClosed) ? 'var(--text-muted)' : 'var(--text-main)',
                  height: '52px',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 24px',
                  borderRadius: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                  width: '100%',
                  border: 'none',
                  color: '#ffffff',
                  cursor: (submitting || isClosed) ? 'not-allowed' : 'pointer'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isClosed ? (
                    <>
                      <i className="fa-solid fa-lock"></i> Shop is Closed
                    </>
                  ) : mode === 'delivery' ? (
                    <>
                      <i className="fa-solid fa-motorcycle"></i> Place Order
                    </>
                  ) : mode === 'pickup' ? (
                    <>
                      <i className="fa-solid fa-bag-shopping"></i> Place Order
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-utensils"></i> Place Order
                    </>
                  )}
                </span>
                <span>{formatPrice(total)}</span>
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

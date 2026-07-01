'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const { storename, id } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [table, setTable] = useState(null);
  const [error, setError] = useState(false);

  const prevStatusRef = useRef(null);
  const audioContextRef = useRef(null);

  const [lang, setLang] = useState('en');

  // Load language from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(`dinelabs_lang_${storename}`);
      if (savedLang) setLang(savedLang);
    }
  }, [storename]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = 'ltr';
      document.body.dir = 'ltr';
    }
  }, [lang]);

  const dictRaw = {
    en: {
      connectingTracker: 'Connecting to kitchen tracker...',
      notFoundTitle: 'Order or Store Not Found',
      notFoundDesc: 'We could not locate this order details page. Please verify your link or return to the menu.',
      backToMenu: 'Back to Menu',
      returnToMenu: 'Return to Menu',
      placed: 'Placed',
      placedDesc: 'Order received by kitchen',
      preparing: 'Preparing',
      preparingDesc: 'Chef is cooking your order',
      ready: 'Ready',
      readyDesc: 'Ready for collection',
      onTheWay: 'On the Way',
      onTheWayDesc: 'Out for delivery transit',
      completed: 'Completed',
      completedDesc: 'Thank you for your visit!',
      orderDeclinedTitle: 'Order Declined',
      enjoyMealTitle: 'Enjoy Your Meal!',
      readyPickupTitle: 'Ready for Pickup!',
      outDeliveryTitle: 'Order Out for Delivery!',
      trackingTitle: 'Tracking Your Order',
      orderActive: 'Order #{orderNo} is active in {tenantName}\'s system.',
      estimatedTime: 'Estimated Time Remaining',
      mins: 'mins',
      transitInfo: 'Courier is in transit',
      kitchenInfo: 'Includes kitchen cooking prep time',
      declinedInfo: 'We apologize, but your order has been declined. Please contact the kitchen directly for details.',
      dineInPass: 'Table Ticket Pass',
      dineInPassDesc: 'Present this pass or keep it open for your waiter.',
      assignedTable: 'Your Assigned Table',
      chairs: 'Chairs',
      section: 'Section',
      mobileGuide: 'Scan this card to instantly find order #{orderNo} on your device, approve the kitchen ticket, and match the table placement.',
      scanTitle: 'Waiter QR Code',
      guideHeader: 'Waitstaff Scanning Guide:',
      noCancelInfo: 'Order cannot be cancelled or modified after submission. For any changes, please contact the restaurant directly.',
      fulfillmentDetails: 'Fulfillment details',
      fulfillmentMode: 'Fulfillment Mode',
      tableCode: 'Table Code',
      customerName: 'Customer Name',
      phoneNumber: 'Phone Number',
      deliveryAddress: 'Delivery Address',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      'dine-in': 'Dine-In',
      pickup: 'Pickup',
      delivery: 'Delivery',
      note: 'Note',
      no: 'No'
    },
    ar: {
      connectingTracker: 'الاتصال بتعقب المطبخ...',
      notFoundTitle: 'لم يتم العثور على الطلب أو المتجر',
      notFoundDesc: 'تعذر علينا تحديد موقع صفحة تفاصيل هذا الطلب. ييرجى التحقق من الرابط الخاص بك أو العودة إلى القائمة.',
      backToMenu: 'العودة إلى القائمة',
      returnToMenu: 'العودة إلى القائمة',
      placed: 'تم الطلب',
      placedDesc: 'تم استلام الطلب في المطبخ',
      preparing: 'قيد التحضير',
      preparingDesc: 'الشيف يطبخ طلبك الآن',
      ready: 'جاهز للاستلام',
      readyDesc: 'جاهز للاستلام من المطعم',
      onTheWay: 'في الطريق',
      onTheWayDesc: 'خارج للتوصيل مع السائق',
      completed: 'اكتمل',
      completedDesc: 'شكراً لزيارتكم!',
      orderDeclinedTitle: 'تم رفض الطلب',
      enjoyMealTitle: 'بالهناء والشفاء!',
      readyPickupTitle: 'جاهز للاستلام!',
      outDeliveryTitle: 'خارج للتوصيل!',
      trackingTitle: 'تتبع طلبك',
      orderActive: 'الطلب #{orderNo} نشط في نظام {tenantName}.',
      estimatedTime: 'الوقت المتبقي المقدر',
      mins: 'دقيقة',
      transitInfo: 'السائق في الطريق إليك',
      kitchenInfo: 'يشمل وقت تحضير الطعام في المطبخ',
      declinedInfo: 'نعتذر، ولكن تم رفض طلبك. يرجى التواصل مع المطعم مباشرة للحصول على التفاصيل.',
      dineInPass: 'تذكرة الطاولة',
      dineInPassDesc: 'قم بتقديم هذه التذكرة للنادل أو اتركها مفتوحة.',
      assignedTable: 'طاولتك المخصصة',
      chairs: 'كراسي',
      section: 'قسم',
      mobileGuide: 'امسح هذا الرمز للعثور على الطلب #{orderNo} فوراً على جهازك، وتأكيد تذكرة المطبخ ومطابقة موقع الطاولة.',
      scanTitle: 'رمز استجابة النادل',
      guideHeader: 'دليل مسح الموظفين:',
      noCancelInfo: 'لا يمكن إلغاء الطلب أو تعديله بعد الإرسال. لأي تغييرات، يرجى الاتصال بالمطعم مباشرة.',
      fulfillmentDetails: 'تفاصيل التنفيذ',
      fulfillmentMode: 'طريقة الطلب',
      tableCode: 'رقم الطاولة',
      customerName: 'اسم العميل',
      phoneNumber: 'رقم الهاتف',
      deliveryAddress: 'عنوان التوصيل',
      orderSummary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      deliveryFee: 'رسوم التوصيل',
      total: 'الإجمالي',
      'dine-in': 'داخل المطعم',
      pickup: 'استلام',
      delivery: 'توصيل',
      note: 'ملاحظة',
      no: 'بدون'
    },
    ru: {
      connectingTracker: 'Подключение к трекеру кухни...',
      notFoundTitle: 'Заказ или магазин не найден',
      notFoundDesc: 'Мы не смогли найти эту страницу деталей заказа. Пожалуйста, проверьте ссылку или вернитесь в меню.',
      backToMenu: 'Назад в меню',
      returnToMenu: 'Вернуться в меню',
      placed: 'Оформлен',
      placedDesc: 'Заказ получен кухней',
      preparing: 'Приготовление',
      preparingDesc: 'Шеф-повар готовит ваш заказ',
      ready: 'Готов',
      readyDesc: 'Готов к выдаче',
      onTheWay: 'В пути',
      onTheWayDesc: 'Передан курьеру для доставки',
      completed: 'Завершен',
      completedDesc: 'Спасибо за ваш визит!',
      orderDeclinedTitle: 'Заказ отклонен',
      enjoyMealTitle: 'Приятного аппетита!',
      readyPickupTitle: 'Готов к выдаче!',
      outDeliveryTitle: 'Заказ в пути!',
      trackingTitle: 'Отслеживание заказа',
      orderActive: 'Заказ #{orderNo} активен в системе {tenantName}.',
      estimatedTime: 'Оставшееся время (расчетное)',
      mins: 'мин',
      transitInfo: 'Курьер в пути',
      kitchenInfo: 'Включая время приготовления на кухне',
      declinedInfo: 'К сожалению, ваш заказ был отклонен. Пожалуйста, свяжитесь с рестораном напрямую для получения подробностей.',
      dineInPass: 'Билет для столика',
      dineInPassDesc: 'Предъявите этот билет или держите его открытым для официанта.',
      assignedTable: 'Ваш столик',
      chairs: 'Стулья',
      section: 'Сектор',
      mobileGuide: 'Отсканируйте эту карту, чтобы мгновенно найти заказ #{orderNo} на своем устройстве, подтвердить кухонный билет и сопоставить размещение столика.',
      scanTitle: 'QR-код официанта',
      guideHeader: 'Руководство по сканированию для персонала:',
      noCancelInfo: 'Заказ не может быть отменен или изменен после отправки. Для внесения изменений свяжитесь с рестораном напрямую.',
      fulfillmentDetails: 'Детали выполнения',
      fulfillmentMode: 'Способ выполнения',
      tableCode: 'Код столика',
      customerName: 'Имя клиента',
      phoneNumber: 'Номер телефона',
      deliveryAddress: 'Адрес доставки',
      orderSummary: 'Итого заказа',
      subtotal: 'Подытог',
      deliveryFee: 'Доставка',
      total: 'Итого',
      'dine-in': 'В заведении',
      pickup: 'Самовывоз',
      delivery: 'Доставка',
      note: 'Примечание',
      no: 'Без'
    },
    es: {
      connectingTracker: 'Conectando al rastreador de cocina...',
      notFoundTitle: 'Pedido o tienda no encontrado',
      notFoundDesc: 'No pudimos localizar esta página de detalles del pedido. Por favor verifique su enlace o regrese al menú.',
      backToMenu: 'Volver al menú',
      returnToMenu: 'Volver al menú',
      placed: 'Pedido',
      placedDesc: 'Pedido recibido por la cocina',
      preparing: 'Preparando',
      preparingDesc: 'El chef está cocinando su pedido',
      ready: 'Listo',
      readyDesc: 'Listo para retirar',
      onTheWay: 'En camino',
      onTheWayDesc: 'En tránsito de entrega',
      completed: 'Completado',
      completedDesc: '¡Gracias por su visita!',
      orderDeclinedTitle: 'Pedido rechazado',
      enjoyMealTitle: '¡Disfrute de su comida!',
      readyPickupTitle: '¡Listo para recoger!',
      outDeliveryTitle: '¡Pedido enviado!',
      trackingTitle: 'Seguimiento de su pedido',
      orderActive: 'El pedido #{orderNo} está activo en el sistema de {tenantName}.',
      estimatedTime: 'Tiempo estimado restante',
      mins: 'min',
      transitInfo: 'El repartidor está en camino',
      kitchenInfo: 'Incluye el tiempo de preparación en cocina',
      declinedInfo: 'Lo sentimos, pero su pedido ha sido rechazado. Comuníquese directamente con el restaurante para obtener detalles.',
      dineInPass: 'Pase de mesa',
      dineInPassDesc: 'Presente este pase o manténgalo abierto para su camarero.',
      assignedTable: 'Su mesa asignada',
      chairs: 'Sillas',
      section: 'Sección',
      mobileGuide: 'Escanee esta tarjeta para encontrar instantáneamente el pedido #{orderNo} en su dispositivo, aprobar el ticket de cocina y coincidir con la ubicación de la mesa.',
      scanTitle: 'Código QR del camarero',
      guideHeader: 'Guía de escaneo del personal:',
      noCancelInfo: 'El pedido no se puede cancelar ni modificar después del envío. Para cualquier cambio, póngase en contacto directamente con el restaurante.',
      fulfillmentDetails: 'Detalles del servicio',
      fulfillmentMode: 'Modo de entrega',
      tableCode: 'Código de mesa',
      customerName: 'Nombre del cliente',
      phoneNumber: 'Número de teléfono',
      deliveryAddress: 'Dirección de entrega',
      orderSummary: 'Resumen del pedido',
      subtotal: 'Subtotal',
      deliveryFee: 'Envío',
      total: 'Total',
      'dine-in': 'En el local',
      pickup: 'Recogida',
      delivery: 'Entrega',
      note: 'Nota',
      no: 'Sin'
    },
    fr: {
      connectingTracker: 'Connexion au suivi de cuisine...',
      notFoundTitle: 'Commande ou restaurant non trouvé',
      notFoundDesc: 'Nous n\'avons pas pu localiser cette page de détails de commande. Veuillez vérifier votre lien ou retourner au menu.',
      backToMenu: 'Retour au menu',
      returnToMenu: 'Retour au menu',
      placed: 'Reçue',
      placedDesc: 'Commande reçue par la cuisine',
      preparing: 'En préparation',
      preparingDesc: 'Le chef prépare votre commande',
      ready: 'Prête',
      readyDesc: 'Prête pour retrait',
      onTheWay: 'En chemin',
      onTheWayDesc: 'En cours de livraison',
      completed: 'Terminée',
      completedDesc: 'Merci pour votre visite !',
      orderDeclinedTitle: 'Commande déclinée',
      enjoyMealTitle: 'Bon appétit !',
      readyPickupTitle: 'Prêt pour le retrait !',
      outDeliveryTitle: 'Commande en cours de livraison !',
      trackingTitle: 'Suivi de commande',
      orderActive: 'La commande #{orderNo} est active dans le système de {tenantName}.',
      estimatedTime: 'Temps d\'attente estimé',
      mins: 'min',
      transitInfo: 'Le livreur est en route',
      kitchenInfo: 'Comprend le temps de préparation en cuisine',
      declinedInfo: 'Nous sommes désolés, mais votre commande a été déclinée. Veuillez contacter directement le restaurant.',
      dineInPass: 'Ticket de table',
      dineInPassDesc: 'Présentez ce ticket ou laissez-le ouvert pour le serveur.',
      assignedTable: 'Votre table assignée',
      chairs: 'Chaises',
      section: 'Section',
      mobileGuide: 'Scannez cette carte pour retrouver instantanément la commande #{orderNo} sur votre appareil, approuver le ticket de cuisine et correspondre à l\'emplacement de la table.',
      scanTitle: 'Code QR serveur',
      guideHeader: 'Guide de scan pour le personnel :',
      noCancelInfo: 'La commande ne peut être annulée ou modifiée après envoi. Pour tout changement, veuillez contacter le restaurant.',
      fulfillmentDetails: 'Détails d\'exécution',
      fulfillmentMode: 'Mode de livraison',
      tableCode: 'Code de table',
      customerName: 'Nom du client',
      phoneNumber: 'Numéro de téléphone',
      deliveryAddress: 'Adresse de livraison',
      orderSummary: 'Résumé de commande',
      subtotal: 'Sous-total',
      deliveryFee: 'Livraison',
      total: 'Total',
      'dine-in': 'Sur place',
      pickup: 'Retrait',
      delivery: 'Livraison',
      note: 'Note',
      no: 'Sans'
    },
    de: {
      connectingTracker: 'Verbindung zum Küchen-Tracker...',
      notFoundTitle: 'Bestellung oder Restaurant nicht gefunden',
      notFoundDesc: 'Wir konnten diese Bestelldetailseite nicht finden. Bitte überprüfen Sie Ihren Link oder kehren Sie zum Menü zurück.',
      backToMenu: 'Zurück zum Menü',
      returnToMenu: 'Zurück zum Menü',
      placed: 'Aufgegeben',
      placedDesc: 'Bestellung in der Küche eingegangen',
      preparing: 'Zubereitung',
      preparingDesc: 'Der Koch bereitet Ihre Bestellung zu',
      ready: 'Bereit',
      readyDesc: 'Bereit zur Abholung',
      onTheWay: 'Unterwegs',
      onTheWayDesc: 'In der Lieferung',
      completed: 'Abgeschlossen',
      completedDesc: 'Vielen Dank für Ihren Besuch!',
      orderDeclinedTitle: 'Bestellung abgelehnt',
      enjoyMealTitle: 'Guten Appetit!',
      readyPickupTitle: 'Bereit zur Abholung!',
      outDeliveryTitle: 'Bestellung auf dem Weg!',
      trackingTitle: 'Bestellungsverfolgung',
      orderActive: 'Die Bestellung #{orderNo} ist im System von {tenantName} aktiv.',
      estimatedTime: 'Geschätzte verbleibende Zeit',
      mins: 'Min.',
      transitInfo: 'Kurier ist unterwegs',
      kitchenInfo: 'Inklusive Zubereitungszeit in der Küche',
      declinedInfo: 'Es tut uns leid, aber Ihre Bestellung wurde abgelehnt. Bitte wenden Sie sich direkt an das Restaurant.',
      dineInPass: 'Tisch-Pass',
      dineInPassDesc: 'Zeigen Sie diesen Pass vor oder halten Sie ihn für den Kellner offen.',
      assignedTable: 'Ihr zugewiesener Tisch',
      chairs: 'Stühle',
      section: 'Bereich',
      mobileGuide: 'Scannen Sie diese Karte, um die Bestellung #{orderNo} sofort auf Ihrem Gerät zu finden, das Küchenticket zu genehmigen und die Tischplatzierung abzugleichen.',
      scanTitle: 'Kellner QR-Code',
      guideHeader: 'Scananleitung für das Personal:',
      noCancelInfo: 'Die Bestellung kann nach dem Absenden nicht mehr storniert oder geändert werden. Für Änderungen wenden Sie sich bitte direkt an das Restaurant.',
      fulfillmentDetails: 'Erfüllungsdetails',
      fulfillmentMode: 'Erfüllungsmodus',
      tableCode: 'Tisch-Code',
      customerName: 'Kundenname',
      phoneNumber: 'Telefonnummer',
      deliveryAddress: 'Lieferadresse',
      orderSummary: 'Bestellübersicht',
      subtotal: 'Zwischensumme',
      deliveryFee: 'Lieferung',
      total: 'Gesamt',
      'dine-in': 'Vor Ort',
      pickup: 'Abholung',
      delivery: 'Lieferung',
      note: 'Hinweis',
      no: 'Ohne'
    },
    it: {
      connectingTracker: 'Connessione al tracker della cucina...',
      notFoundTitle: 'Ordine o negozio non trovato',
      notFoundDesc: 'Impossibile trovare questa pagina dei dettagli dell\'ordine. Verifica il link o torna al menu.',
      backToMenu: 'Torna al menu',
      returnToMenu: 'Torna al menu',
      placed: 'Inviato',
      placedDesc: 'Ordine ricevuto dalla cucina',
      preparing: 'In preparazione',
      preparingDesc: 'Lo chef sta preparando il tuo ordine',
      ready: 'Pronto',
      readyDesc: 'Pronto per il ritiro',
      onTheWay: 'In consegna',
      onTheWayDesc: 'In viaggio con il corriere',
      completed: 'Completato',
      completedDesc: 'Grazie per la tua visita!',
      orderDeclinedTitle: 'Ordine rifiutato',
      enjoyMealTitle: 'Buon appetito!',
      readyPickupTitle: 'Pronto per il ritiro!',
      outDeliveryTitle: 'Ordine in consegna!',
      trackingTitle: 'Tracciamento dell\'ordine',
      orderActive: 'L\'ordine #{orderNo} è attivo nel sistema di {tenantName}.',
      estimatedTime: 'Tempo stimato rimanente',
      mins: 'min',
      transitInfo: 'Il corriere è in transito',
      kitchenInfo: 'Include il tempo di preparazione in cucina',
      declinedInfo: 'Siamo spiacenti, ma il tuo ordine è stato rifiutato. Contatta direttamente il ristorante per dettagli.',
      dineInPass: 'Pass del tavolo',
      dineInPassDesc: 'Mostra questo pass o tienilo aperto per il cameriere.',
      assignedTable: 'Il tuo tavolo assegnato',
      chairs: 'Sedie',
      section: 'Sezione',
      mobileGuide: 'Scansiona questa scheda per trovare istantaneamente l\'ordine #{orderNo} sul tuo dispositivo, approvare il ticket della cucina e abbinare il posizionamento del tavolo.',
      scanTitle: 'Codice QR cameriere',
      guideHeader: 'Guida alla scansione per lo staff:',
      noCancelInfo: 'L\'ordine non può essere annullato o modificato dopo l\'invio. Per modifiche contatta direttamente il ristorante.',
      fulfillmentDetails: 'Dettagli dell\'ordine',
      fulfillmentMode: 'Fulfillment Mode',
      tableCode: 'Codice tavolo',
      customerName: 'Nome cliente',
      phoneNumber: 'Numero di telefono',
      deliveryAddress: 'Indirizzo di consegna',
      orderSummary: 'Riepilogo ordine',
      subtotal: 'Subtotale',
      deliveryFee: 'Consegna',
      total: 'Totale',
      'dine-in': 'Al tavolo',
      pickup: 'Ritiro',
      delivery: 'Consegna',
      note: 'Nota',
      no: 'Senza'
    },
    ka: {
      connectingTracker: 'მიმდინარეობს კავშირი სამზარეულოსთან...',
      notFoundTitle: 'შეკვეთა ან მაღაზია ვერ მოიძებნა',
      notFoundDesc: 'ამ შეკვეთის დეტალების გვერდი ვერ მოიძებნა. გთხოვთ, შეამოწმოთ ბმული ან დაბრუნდეთ მენიუში.',
      backToMenu: 'მენიუში დაბრუნება',
      returnToMenu: 'მენიუში დაბრუნება',
      declinedInfo: 'სამწუხაროდ, თქვენი შეკვეთა უარყოფილია. გთხოვთ, დაუკავშირდეთ რესტორანს დეტალებისთვის.',
      dineInPass: 'მაგიდის საშვი',
      dineInPassDesc: 'წარუდგინეთ ეს საშვი ოფიციანტს ან დატოვეთ გახსნილი.',
      assignedTable: 'თქვენი მაგიდა',
      chairs: 'სკამები',
      section: 'სექცია',
      mobileGuide: 'დაასკანირეთ ეს ბარათი შეკვეთის #{orderNo} მობილურზე სანახავად, სამზარეულოს ბილეთის დასადასტურებლად და მაგიდის შესაბამისობისთვის.',
      scanTitle: 'ოფიციანტის QR კოდი',
      guideHeader: 'ინსტრუქცია პერსონალისთვის:',
      noCancelInfo: 'შეკვეთის გაუქმება ან შეცვლა გაგზავნის შემდეგ შეუძლებელია. ცვლილებებისთვის დაუკავშირდით რესტორანს.',
      fulfillmentDetails: 'შეკვეთის დეტალები',
      fulfillmentMode: 'მიწოდების ტიპი',
      tableCode: 'მაგიდის კოდი',
      customerName: 'კლიენტის სახელი',
      phoneNumber: 'ტელეფონის ნომერი',
      deliveryAddress: 'მიწოდების მისამართი',
      orderSummary: 'შეკვეთის შეჯამება',
      subtotal: 'ქვეჯამი',
      deliveryFee: 'მიწოდება',
      total: 'ჯამი',
      'dine-in': 'ადგილზე',
      pickup: 'წაღება',
      delivery: 'მიწოდება',
      note: 'შენიშვნა',
      no: 'გარეშე'
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

  const resolveText = (val) => {
    if (!val) return '';
    if (typeof val === 'string') {
      const globalDict = {
        'Extra Nutella': { en: 'Extra Nutella', ar: 'إكسترا نوتيلا', fr: 'Extra Nutella', de: 'Extra Nutella', es: 'Extra Nutella', ru: 'Доп. Нутелла', ka: 'დამატებითი ნუტელა' },
        'Extra Star Shaped Ice': { en: 'Extra Star Shaped Ice', ar: 'ثلج نجمي إضافي', fr: 'Glaçons étoile extra', de: 'Extra Sterneneis', es: 'Hielo estrella extra', ru: 'Доп. лед в форме звезд', ka: 'დამატებითი ვარსკვლავისებრი ყინული' },
        'No Ice': { en: 'No Ice', ar: 'بدون ثلج', fr: 'Sans glaçons', de: 'Ohne Eis', es: 'Sin hielo', ru: 'Без льда', ka: 'უყინულოდ' },
        'No Glass': { en: 'No Glass', ar: 'بدون كوب', fr: 'Sans verre', de: 'Ohne Glas', es: 'Sin vaso', ru: 'Без стакана', ka: 'უჭიქოდ' },
        'Small': { en: 'Small', ar: 'صغير', fr: 'Petit', de: 'Klein', es: 'Pequeño', ru: 'Маленький', ka: 'პატარა' },
        'Medium': { en: 'Medium', ar: 'وسط', fr: 'Moyen', de: 'Mittel', es: 'Mediano', ru: 'Средний', ka: 'საშუალო' },
        'Large': { en: 'Large', ar: 'كبير', fr: 'Grand', de: 'Groß', es: 'Grande', ru: 'Большой', ka: 'დიდი' },
        'Extra Large': { en: 'Extra Large', ar: 'كبير جداً', fr: 'Très grand', de: 'Sehr groß', es: 'Muy grande', ru: 'Очень большой', ka: 'ძალიან დიდი' }
      };
      if (globalDict[val]) {
        return globalDict[val][lang] || globalDict[val]['en'] || val;
      }
      return val;
    }
    return val[lang] || val['en'] || val['ar'] || Object.values(val)[0] || '';
  };

  // Sound play helper using Web Audio API
  const playStatusChangeSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const playChime = (timeOffset, freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.4);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.5);
      };

      // Sound signature: double pleasant chime
      playChime(0, 523.25); // C5
      playChime(0.15, 659.25); // E5
    } catch (e) {
      console.warn('Audio feedback blocked by browser.', e);
    }
  };

  // Set document title
  useEffect(() => {
    document.title = 'Order Status Tracker - DineLabs';
  }, []);

  // Poll order state every 10 seconds
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);

          // If status changed and it's not the initial load, play sound
          if (prevStatusRef.current && prevStatusRef.current !== data.status) {
            playStatusChangeSound();
          }
          prevStatusRef.current = data.status;
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error polling order details:', err);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);

    return () => clearInterval(interval);
  }, [id]);

  // Fetch tenant and tables settings once on mount
  useEffect(() => {
    if (!storename) return;

    const fetchTenantData = async () => {
      try {
        const res = await fetch(`/api/tenant/settings?tenantSlug=${storename}`);
        if (res.ok) {
          const tenantData = await res.json();
          setTenant(tenantData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching tenant details:', err);
      }
    };

    fetchTenantData();
  }, [storename]);

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

  // Fetch tables and find the table match once order is loaded
  useEffect(() => {
    if (!tenant || !order || order.type !== 'dine-in') return;

    const fetchTableInfo = async () => {
      try {
        const res = await fetch(`/api/tables?tenantSlug=${storename}`);
        if (res.ok) {
          const tables = await res.json();
          const matchedTable = tables.find(t => t.name === order.customer.tableNo);
          if (matchedTable) {
            setTable(matchedTable);
          }
        }
      } catch (err) {
        console.error('Error matching table information:', err);
      }
    };

    fetchTableInfo();
  }, [tenant, order, storename]);

  // Loading state finishes once both tenant and order are retrieved
  useEffect(() => {
    if (order && tenant) {
      setLoading(false);
    }
  }, [order, tenant]);

  // Audio activation helper
  const handleInteraction = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '60px 20px', textAlign: 'center', color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>
        <h2>{dict[lang].notFoundTitle || 'Order or Store Not Found'}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{dict[lang].notFoundDesc || 'We could not locate this order details page. Please verify your link or return to the menu.'}</p>
        <a href={`/${storename}`} className="checkout-btn" style={{ display: 'inline-flex', marginTop: '20px', padding: '12px 24px', textDecoration: 'none', borderRadius: '12px' }}>
          {dict[lang].backToMenu || 'Back to Menu'}
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div className="pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--brand-red)' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{dict[lang].connectingTracker || 'Connecting to kitchen tracker...'}</p>
      </div>
    );
  }

  // Helper formats
  const formatPrice = (amount) => {
    const currency = tenant?.baseCurrency || 'USD';
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

  // Status mapping logic
  // pending -> Placed
  // accepted -> Preparing
  // ready / shipped -> On the Way / Ready
  // completed -> Completed
  const getActiveStep = () => {
    const status = order.status;
    if (status === 'pending') return 0;
    if (status === 'accepted') return 1;
    if (status === 'ready' || status === 'shipped') return 2;
    if (status === 'completed') return 3;
    return 0; // Default
  };

  const activeStep = getActiveStep();

  // Progress Bar Steps Definitions
  const steps = [
    { label: dict[lang].placed, desc: dict[lang].placedDesc, icon: 'fa-clipboard-check' },
    { label: dict[lang].preparing, desc: dict[lang].preparingDesc, icon: 'fa-fire-burner' },
    { 
      label: order.type === 'delivery' ? dict[lang].onTheWay : dict[lang].ready, 
      desc: order.type === 'delivery' ? dict[lang].onTheWayDesc : dict[lang].readyDesc,
      icon: order.type === 'delivery' ? 'fa-truck-fast' : 'fa-hand-holding'
    },
    { label: dict[lang].completed, desc: dict[lang].completedDesc, icon: 'fa-circle-check' }
  ];

  // Estimated Minutes Left Calculation
  const getEstimatedMinutesLeft = () => {
    if (order.status === 'pending') {
      return (order.type === 'delivery' ? (tenant.waitTimes?.delivery || 40) : (tenant.waitTimes?.pickup || 20));
    }
    if (order.status === 'accepted') {
      // Return prep time minus elapsed time
      const elapsed = Math.floor((new Date() - new Date(order.createdAt)) / 60000);
      const limit = order.type === 'delivery' ? (tenant.waitTimes?.delivery || 40) : (tenant.waitTimes?.pickup || 20);
      return Math.max(1, limit - elapsed);
    }
    if (order.status === 'shipped') {
      // Return deliveryMinutes or default 20
      const elapsed = Math.floor((new Date() - new Date(order.updatedAt)) / 60000);
      const limit = order.deliveryMinutes || 20;
      return Math.max(1, limit - elapsed);
    }
    return 0;
  };

  const estimatedMinutes = getEstimatedMinutesLeft();

  const getOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  return (
    <div 
      dir="ltr"
      onClick={handleInteraction}
      style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 20px', fontFamily: 'var(--font-body)', color: 'var(--text-main)' }}
    >
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Tracker Live Status Panel */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '24px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          {/* Status Indicator check circle */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            backgroundColor: 
              order.status === 'declined' ? 'var(--neg-bg)' : 
              order.status === 'completed' ? 'var(--pos-bg)' : 
              'var(--info-bg)', 
            color: 
              order.status === 'declined' ? 'var(--neg)' : 
              order.status === 'completed' ? 'var(--pos)' : 
              'var(--info)', 
            fontSize: '32px', 
            marginBottom: '16px' 
          }}>
            {order.status === 'declined' ? (
              <i className="fa-solid fa-xmark"></i>
            ) : order.status === 'completed' ? (
              <i className="fa-solid fa-check"></i>
            ) : (
              <i className="fa-solid fa-hourglass-half fa-spin"></i>
            )}
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>
            {order.status === 'declined' ? dict[lang].orderDeclinedTitle :
             order.status === 'completed' ? dict[lang].enjoyMealTitle :
             order.status === 'ready' ? dict[lang].readyPickupTitle :
             order.status === 'shipped' ? dict[lang].outDeliveryTitle :
             dict[lang].trackingTitle}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            {dict[lang].orderActive.replace('{orderNo}', order.orderNo).replace('{tenantName}', tenant.name)}
          </p>

          {/* Time display indicator */}
          {estimatedMinutes > 0 && order.status !== 'declined' && order.status !== 'ready' && (
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '16px', 
              padding: '16px', 
              marginBottom: '28px',
              border: '1px solid var(--border-light)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {dict[lang].estimatedTime}
              </span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--brand-red)', margin: '4px 0' }}>
                {estimatedMinutes} <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>{dict[lang].mins}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {order.status === 'shipped' ? dict[lang].transitInfo : dict[lang].kitchenInfo}
              </span>
            </div>
          )}

          {/* Declined banner */}
          {order.status === 'declined' && (
            <div style={{ backgroundColor: 'var(--neg-bg)', color: 'var(--neg)', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: '700' }}>
              {dict[lang].declinedInfo}
            </div>
          )}

          {/* Premium Progress Bar Timeline */}
          {order.status !== 'declined' && (
            <div style={{ textAlign: 'left', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '32px' }}>
                {/* Horizontal progress bar line background */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  right: '12px', 
                  height: '4px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  zIndex: 1 
                }}></div>
                {/* Active progress bar line foreground */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  width: `${(activeStep / 3) * 100}%`, 
                  height: '4px', 
                  backgroundColor: 'var(--pos)', 
                  transition: 'width 0.4s ease', 
                  zIndex: 2 
                }}></div>

                {/* Steps dots */}
                {steps.map((step, idx) => {
                  const isCompleted = idx < activeStep;
                  const isActive = idx === activeStep;
                  return (
                    <div key={idx} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: idx === 0 ? 'flex-start' : idx === 3 ? 'flex-end' : 'center', 
                      zIndex: 3 
                    }}>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        backgroundColor: isCompleted ? 'var(--pos)' : isActive ? 'var(--info)' : '#ffffff', 
                        border: `3px solid ${isCompleted ? 'var(--pos)' : isActive ? 'var(--info)' : 'var(--border-light)'}`,
                        color: isCompleted || isActive ? '#ffffff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        transition: 'all 0.4s ease'
                      }}>
                        {isCompleted ? <i className="fa-solid fa-check"></i> : <i className={`fa-solid ${step.icon}`} style={{ fontSize: '11px' }}></i>}
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: isActive ? '800' : '600', 
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        marginTop: '8px',
                        whiteSpace: 'nowrap'
                      }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Detail Card */}
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '12px', 
                padding: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                borderLeft: '4px solid var(--pos)'
              }}>
                <span style={{ fontSize: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-bell" style={{ color: 'var(--pos)' }}></i>
                </span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{steps[activeStep]?.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>{steps[activeStep]?.desc}</div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Premium Scannable Table Ticket for Dine-In sessions */}
        {order.type === 'dine-in' && (
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '24px', 
            border: '2px solid var(--pos)', 
            padding: '24px', 
            textAlign: 'center', 
            marginBottom: '24px', 
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ribbons / Badges */}
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '-30px',
              backgroundColor: 'var(--pos)',
              color: '#ffffff',
              transform: 'rotate(45deg)',
              fontSize: '0.65rem',
              fontWeight: '900',
              padding: '4px 30px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {dict[lang]['dine-in']}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#d1fae5', color: 'var(--pos)', fontSize: '24px', marginBottom: '16px', justifyContent: 'center' }}>
              <i className="fa-solid fa-utensils"></i>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text-main)' }}>
              {dict[lang].dineInPass}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '16px' }}>
              {dict[lang].dineInPassDesc}
            </p>

            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '16px', 
              padding: '16px', 
              marginBottom: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px dashed var(--border-light)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {dict[lang].assignedTable}
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '900', color: 'var(--brand-red)', margin: '4px 0' }}>
                {order.customer.tableNo}
              </span>
              {table && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <i className="fa-solid fa-map-pin"></i> {table.location} {dict[lang].section} · <i className="fa-solid fa-chair"></i> {table.chairs} {dict[lang].chairs}
                </span>
              )}
          </div>
        </div>
      )}

        <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'left', marginBottom: '24px', fontSize: '0.85rem', color: '#b45309', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-circle-info" style={{ color: '#d97706', fontSize: '1.1rem' }}></i> {dict[lang].noCancelInfo}
        </div>

        {/* Card: Summary of customer fulfillment */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            {dict[lang].fulfillmentDetails}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{dict[lang].fulfillmentMode}</span>
              <span style={{ fontWeight: '700', textTransform: 'capitalize' }}>{dict[lang][order.type] || order.type}</span>
            </div>

            {order.type === 'dine-in' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{dict[lang].tableCode}</span>
                <span style={{ fontWeight: '700' }}>{order.customer.tableNo}</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{dict[lang].customerName}</span>
                  <span style={{ fontWeight: '700' }}>{order.customer.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{dict[lang].phoneNumber}</span>
                  <span style={{ fontWeight: '700' }}>{order.customer.phone}</span>
                </div>
              </>
            )}

            {order.type === 'delivery' && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{dict[lang].deliveryAddress}</span>
                <span style={{ fontWeight: '600', lineHeight: 1.4 }}>{order.customer.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card: Order Details Summary */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            {dict[lang].orderSummary}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{item.quantity}x {typeof item.name === 'object' ? (item.name[lang] || item.name.en) : item.name}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {item.size && `${resolveText(item.size)}`}
                    {item.addons && item.addons.length > 0 && `, +${item.addons.map(a => resolveText(a)).join(', ')}`}
                    {item.removedIngredients && item.removedIngredients.length > 0 && `, (${dict[lang].no || 'No'} ${item.removedIngredients.map(r => resolveText(r)).join(', ')})`}
                  </span>
                  {item.notes && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-red)', fontStyle: 'italic', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fa-solid fa-pencil" style={{ fontSize: '0.75rem' }}></i> {dict[lang].note}: {item.notes}
                    </div>
                  )}
                </div>
                <span style={{ fontWeight: '600' }}>{formatPrice(item.priceCalculated * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>{dict[lang].subtotal}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.type === 'delivery' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>{dict[lang].deliveryFee}</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', borderTop: '1px dashed var(--border-light)', marginTop: '12px', paddingTop: '12px' }}>
              <span>{dict[lang].total}</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Back to menu button */}
        <a 
          href={`/${storename}${order.type === 'dine-in' && order.customer?.tableNo ? `?table=${encodeURIComponent(order.customer.tableNo)}` : ''}`} 
          className="checkout-btn"
          style={{ textDecoration: 'none', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {dict[lang].returnToMenu}
        </a>
      </div>
    </div>
  );
}

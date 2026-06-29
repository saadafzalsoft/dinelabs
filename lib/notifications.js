import nodemailer from 'nodemailer';
import { getDb } from './db';

const translations = {
  en: {
    newOrder: '🔔 New Order Alert',
    fulfillment: 'Fulfillment Mode',
    restaurant: 'Restaurant',
    customerDetails: 'Customer Details',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    table: 'Table',
    address: 'Address',
    items: 'Items',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    trackOrder: '📍 Track your order',
    trackDesc: 'Click the button above to see real-time order status updates.',
    specialInstructions: 'Special Instructions / Notes',
    no: 'No',
    statusPrepared: 'prepared and ready!',
    statusPreparing: 'is now preparing in the kitchen!',
    statusTransit: 'is on its way!',
    statusDelivered: 'has been completed!',
    statusCancelled: 'has been cancelled',
    msgPreparing: 'Great news! The kitchen has accepted your order and is preparing it. We estimate it will be ready/dispatched soon based on our standard cooking times.',
    msgReady: 'Your order is prepared and ready! Please proceed to the counter or await tableside service.',
    msgTransit: 'Your delivery is on its way! The driver has departed.',
    msgDelivered: 'Thank you for dining with us! Your order is complete. We hope you enjoy your meal!',
    msgCancelled: 'We apologize, but your order has been cancelled. Please contact the kitchen directly for details.',
    statusSubjectAccepted: 'Accepted',
    statusSubjectReady: 'Ready for Collection',
    statusSubjectTransit: 'Out for Delivery',
    statusSubjectCompleted: 'Fulfilled',
    statusSubjectCancelled: 'Cancelled',
    mins: 'minutes',
    estimatedTransit: 'Estimated delivery transit'
  },
  ar: {
    newOrder: '🔔 تنبيه طلب جديد',
    fulfillment: 'طريقة الطلب',
    restaurant: 'المطعم',
    customerDetails: 'تفاصيل العميل',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    table: 'الطاولة',
    address: 'العنوان',
    items: 'الطلبات',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'رسوم التوصيل',
    total: 'الإجمالي',
    trackOrder: '📍 تتبع طلبك',
    trackDesc: 'انقر فوق الزر أعلاه لمشاهدة تحديثات حالة الطلب المباشرة.',
    specialInstructions: 'تعليمات خاصة / ملاحظات',
    no: 'بدون',
    statusPrepared: 'جاهز للاستلام!',
    statusPreparing: 'قيد التحضير في المطبخ!',
    statusTransit: 'خارج للتوصيل!',
    statusDelivered: 'اكتمل!',
    statusCancelled: 'تم إلغاؤه',
    msgPreparing: 'أخبار رائعة! قبل المطبخ طلبك وهو قيد التحضير الآن. نتوقع أن يكون جاهزًا قريبًا.',
    msgReady: 'طلبك جاهز ولذيذ! يرجى التوجه للاستلام أو انتظار الخدمة.',
    msgTransit: 'طلبك في الطريق إليك! غادر السائق المطعم.',
    msgDelivered: 'شكراً لزيارتكم! اكتمل طلبك ونأمل أن تستمتع بوجبتك.',
    msgCancelled: 'نعتذر، ولكن تم رفض أو إلغاء طلبك. يرجى الاتصال بالمطعم مباشرة للحصول على التفاصيل.',
    statusSubjectAccepted: 'مقبول',
    statusSubjectReady: 'جاهز للاستلام',
    statusSubjectTransit: 'خارج للتوصيل',
    statusSubjectCompleted: 'مكتمل',
    statusSubjectCancelled: 'ملغي',
    mins: 'دقيقة',
    estimatedTransit: 'وقت التوصيل المقدر'
  },
  ru: {
    newOrder: '🔔 Новый заказ',
    fulfillment: 'Способ получения',
    restaurant: 'Ресторан',
    customerDetails: 'Данные клиента',
    name: 'Имя',
    phone: 'Телефон',
    email: 'Эл. почта',
    table: 'Столик',
    address: 'Адрес',
    items: 'Позиции',
    subtotal: 'Подытог',
    deliveryFee: 'Доставка',
    total: 'Итого',
    trackOrder: '📍 Отслеживать заказ',
    trackDesc: 'Нажмите кнопку выше для просмотра статуса заказа в реальном времени.',
    specialInstructions: 'Специальные инструкции',
    no: 'Без',
    statusPrepared: 'готов к выдаче!',
    statusPreparing: 'готовится на кухне!',
    statusTransit: 'в пути к вам!',
    statusDelivered: 'успешно завершен!',
    statusCancelled: 'был отменен',
    msgPreparing: 'Отличные новости! Кухня приняла ваш заказ и уже готовит его.',
    msgReady: 'Ваш заказ готов к выдаче! Пожалуйста, заберите его.',
    msgTransit: 'Ваш заказ в пути! Курьер уже выехал.',
    msgDelivered: 'Спасибо, что выбрали нас! Заказ выполнен. Приятного аппетита!',
    msgCancelled: 'К сожалению, ваш заказ был отменен рестораном.',
    statusSubjectAccepted: 'Принят',
    statusSubjectReady: 'Готов к выдаче',
    statusSubjectTransit: 'В пути',
    statusSubjectCompleted: 'Выполнен',
    statusSubjectCancelled: 'Отменен',
    mins: 'минут',
    estimatedTransit: 'Расчетное время доставки'
  },
  es: {
    newOrder: '🔔 Nuevo pedido',
    fulfillment: 'Modo de entrega',
    restaurant: 'Restaurante',
    customerDetails: 'Detalles del cliente',
    name: 'Nombre',
    phone: 'Teléfono',
    email: 'Correo electrónico',
    table: 'Mesa',
    address: 'Dirección',
    items: 'Artículos',
    subtotal: 'Subtotal',
    deliveryFee: 'Envío',
    total: 'Total',
    trackOrder: '📍 Rastrea tu pedido',
    trackDesc: 'Haga clic en el botón de arriba para ver las actualizaciones en tiempo real.',
    specialInstructions: 'Instrucciones especiales',
    no: 'Sin',
    statusPrepared: '¡listo para recoger!',
    statusPreparing: '¡se está preparando en la cocina!',
    statusTransit: '¡está en camino!',
    statusDelivered: '¡ha sido completado!',
    statusCancelled: 'ha sido cancelado',
    msgPreparing: '¡Excelentes noticias! La cocina ha aceptado su pedido y lo está preparando.',
    msgReady: '¡Su pedido está listo! Por favor proceda a retirarlo.',
    msgTransit: '¡Su pedido está en camino! El repartidor ha salido.',
    msgDelivered: '¡Gracias por elegirnos! Su pedido está completo. ¡Que disfrute de su comida!',
    msgCancelled: 'Lamentamos informarle que su pedido ha sido cancelado por el restaurante.',
    statusSubjectAccepted: 'Aceptado',
    statusSubjectReady: 'Listo para retirar',
    statusSubjectTransit: 'En camino',
    statusSubjectCompleted: 'Completado',
    statusSubjectCancelled: 'Cancelado',
    mins: 'minutos',
    estimatedTransit: 'Tiempo de entrega estimado'
  },
  fr: {
    newOrder: '🔔 Nouvelle commande',
    fulfillment: 'Mode de livraison',
    restaurant: 'Restaurant',
    customerDetails: 'Détails du client',
    name: 'Nom',
    phone: 'Téléphone',
    email: 'E-mail',
    table: 'Table',
    address: 'Adresse',
    items: 'Articles',
    subtotal: 'Sous-total',
    deliveryFee: 'Livraison',
    total: 'Total',
    trackOrder: '📍 Suivre votre commande',
    trackDesc: 'Cliquez sur le bouton ci-dessus pour voir le statut de la commande en temps réel.',
    specialInstructions: 'Instructions spéciales',
    no: 'Sans',
    statusPrepared: 'prête pour retrait!',
    statusPreparing: 'en préparation en cuisine!',
    statusTransit: 'est en route!',
    statusDelivered: 'a été livrée!',
    statusCancelled: 'a été annulée',
    msgPreparing: 'Excellente nouvelle ! La cuisine a accepté votre commande et la prépare.',
    msgReady: 'Votre commande est prête ! Veuillez procéder au retrait.',
    msgTransit: 'Votre commande est en route ! Le livreur est parti.',
    msgDelivered: 'Merci de votre visite ! Votre commande est complète. Bon appétit !',
    msgCancelled: 'Nous sommes désolés, mais votre commande a été annulée.',
    statusSubjectAccepted: 'Acceptée',
    statusSubjectReady: 'Prête pour retrait',
    statusSubjectTransit: 'En cours de livraison',
    statusSubjectCompleted: 'Livrée',
    statusSubjectCancelled: 'Annulée',
    mins: 'minutes',
    estimatedTransit: 'Temps de livraison estimé'
  },
  de: {
    newOrder: '🔔 Neue Bestellung',
    fulfillment: 'Erfüllungsmodus',
    restaurant: 'Restaurant',
    customerDetails: 'Kundendetails',
    name: 'Name',
    phone: 'Telefon',
    email: 'E-Mail',
    table: 'Tisch',
    address: 'Adresse',
    items: 'Artikel',
    subtotal: 'Zwischensumme',
    deliveryFee: 'Lieferung',
    total: 'Gesamt',
    trackOrder: '📍 Bestellung verfolgen',
    trackDesc: 'Klicken Sie auf die Schaltfläche oben, um den Bestellstatus in Echtzeit zu sehen.',
    specialInstructions: 'Spezielle Hinweise',
    no: 'Ohne',
    statusPrepared: 'bereit zur Abholung!',
    statusPreparing: 'wird in der Küche zubereitet!',
    statusTransit: 'ist auf dem Weg!',
    statusDelivered: 'wurde abgeschlossen!',
    statusCancelled: 'wurde storniert',
    msgPreparing: 'Gute Nachrichten! Die Küche hat Ihre Bestellung angenommen und bereitet sie zu.',
    msgReady: 'Ihre Bestellung ist bereit! Bitte holen Sie sie ab.',
    msgTransit: 'Ihre Bestellung ist auf dem Weg! Der Kurier ist unterwegs.',
    msgDelivered: 'Vielen Dank für Ihre Bestellung! Guten Appetit!',
    msgCancelled: 'Es tut uns leid, aber Ihre Bestellung wurde storniert.',
    statusSubjectAccepted: 'Angenommen',
    statusSubjectReady: 'Bereit zur Abholung',
    statusSubjectTransit: 'Unterwegs',
    statusSubjectCompleted: 'Abgeschlossen',
    statusSubjectCancelled: 'Storniert',
    mins: 'Minuten',
    estimatedTransit: 'Geschätzte Lieferzeit'
  },
  it: {
    newOrder: '🔔 Nuovo ordine',
    fulfillment: 'Fulfillment Mode',
    restaurant: 'Ristorante',
    customerDetails: 'Dettagli cliente',
    name: 'Nome',
    phone: 'Telefono',
    email: 'Email',
    table: 'Tavolo',
    address: 'Indirizzo',
    items: 'Articoli',
    subtotal: 'Subtotale',
    deliveryFee: 'Consegna',
    total: 'Totale',
    trackOrder: '📍 Traccia il tuo ordine',
    trackDesc: 'Clicca sul pulsante sopra per vedere gli aggiornamenti dello stato dell\'ordine.',
    specialInstructions: 'Istruzioni speciali',
    no: 'Senza',
    statusPrepared: 'pronto per il ritiro!',
    statusPreparing: 'in preparazione in cucina!',
    statusTransit: 'in consegna!',
    statusDelivered: 'completato!',
    statusCancelled: 'è stato annullato',
    msgPreparing: 'Ottime notizie! La cucina ha accettato il tuo ordine e lo sta preparando.',
    msgReady: 'Il tuo ordine è pronto! Procedi al ritiro.',
    msgTransit: 'Il tuo ordine è in viaggio! Il corriere è partito.',
    msgDelivered: 'Grazie per aver ordinato da noi! Buon appetito!',
    msgCancelled: 'Siamo spiacenti, ma il tuo ordine è stato annullato dal ristorante.',
    statusSubjectAccepted: 'Accettato',
    statusSubjectReady: 'Pronto per il ritiro',
    statusSubjectTransit: 'In consegna',
    statusSubjectCompleted: 'Completato',
    statusSubjectCancelled: 'Annullato',
    mins: 'minuti',
    estimatedTransit: 'Tempo di consegna stimato'
  },
  ka: {
    newOrder: '🔔 ახალი შეკვეთა',
    fulfillment: 'მიწოდების ტიპი',
    restaurant: 'რესტორანი',
    customerDetails: 'კლიენტის მონაცემები',
    name: 'სახელი',
    phone: 'ტელეფონი',
    email: 'ელ. ფოსტა',
    table: 'მაგიდა',
    address: 'მისამართი',
    items: 'პროდუქტები',
    subtotal: 'ქვეჯამი',
    deliveryFee: 'მიწოდება',
    total: 'ჯამი',
    trackOrder: '📍 თვალყური ადევნეთ შეკვეთას',
    trackDesc: 'დააწკაპუნეთ ღილაკს შეკვეთის რეალურ დროში სტატუსის სანახავად.',
    specialInstructions: 'სპეციალური შენიშვნები',
    no: 'გარეშე',
    statusPrepared: 'მზადაა წასაღებად!',
    statusPreparing: 'მზადდება სამზარეულოში!',
    statusTransit: 'გზაშია!',
    statusDelivered: 'დასრულდა!',
    statusCancelled: 'უარყოფილია',
    msgPreparing: 'კარგი ამბავი! შეკვეთა მიღებულია და მზადდება სამზარეულოში.',
    msgReady: 'თვენი შეკვეთა მზადაა! გთხოვთ გაიტანოთ.',
    msgTransit: 'თქვენი შეკვეთა გზაშია! კურიერი გამოვიდა.',
    msgDelivered: 'გმადლობთ სტუმრობისთვის! შეკვეთა დასრულებულია, გემრიელად მიირთვით!',
    msgCancelled: 'სამწუხაროდ, თქვენი შეკვეთა უარყოფილია რესტორნის მიერ.',
    statusSubjectAccepted: 'მიღებულია',
    statusSubjectReady: 'მზადაა წასაღებად',
    statusSubjectTransit: 'გზაშია',
    statusSubjectCompleted: 'დასრულებულია',
    statusSubjectCancelled: 'უარყოფილია',
    mins: 'წუთი',
    estimatedTransit: 'მიწოდების სავარაუდო დრო'
  }
};

const formatPrice = (amount, currency) => {
  if (currency === 'LBP') {
    return 'LBP ' + parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const symbols = {
    USD: '$', EUR: '€', GBP: '£', LBP: 'LBP ', AED: 'AED ', SAR: 'SR ', QAR: 'QR ', KWD: 'KD ', BHD: 'BD ', OMR: 'RO '
  };
  const symbol = symbols[currency] || (currency + ' ');
  return symbol + parseFloat(amount).toFixed(2).replace('.', ',');
};

const resolveText = (val, lang) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[lang] || val['en'] || '';
};

export async function sendOrderNotifications(order, tenant) {
  if (!tenant) {
    console.log('Tenant is missing');
    return;
  }

  const assigned = tenant.assignedNotifications || { email: true, telegram: true };
  const notifications = {
    emailEnabled: (tenant.notifications?.emailEnabled !== false) && (assigned.email !== false),
    telegramEnabled: (tenant.notifications?.telegramEnabled !== false) && (!!assigned.telegram),
    emailRecipient: tenant.notifications?.emailRecipient || '',
    telegramChatId: tenant.notifications?.telegramChatId || ''
  };

  const currency = tenant.baseCurrency || 'USD';
  const targetLang = tenant.defaultLanguage || 'en';

  const tr = (key) => {
    const langDict = translations[targetLang] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  const typeLabels = {
    'dine-in': tr('table'),
    'pickup': tr('fulfillment') + ': ' + resolveText({ en: 'Pickup', ar: 'استلام', ka: 'წაღება' }, targetLang),
    'delivery': tr('fulfillment') + ': ' + resolveText({ en: 'Delivery', ar: 'توصيل', ka: 'მიწოდება' }, targetLang)
  };

  // Build plain text message for Telegram
  const buildTextMessage = () => {
    let msg = `🔔 *${tr('newOrder')} #${order.orderNo}*\n`;
    msg += `--------------------------------\n`;
    msg += `${tr('fulfillment')}: *${resolveText(typeLabels[order.type] || order.type, targetLang)}*\n`;
    msg += `${tr('restaurant')}: *${tenant.name}*\n\n`;
    
    msg += `*${tr('customerDetails')}:*\n`;
    msg += `• ${tr('name')}: ${order.customer.name}\n`;
    msg += `• ${tr('phone')}: ${order.customer.phone}\n`;
    msg += `• ${tr('email')}: ${order.customer.email}\n`;
    if (order.type === 'dine-in' && order.customer.tableNo) {
      msg += `• ${tr('table')}: ${order.customer.tableNo}\n`;
    }
    if (order.type === 'delivery' && order.customer.address) {
      msg += `• ${tr('address')}: ${order.customer.address}\n`;
    }
    if (order.notes) {
      msg += `• ${tr('specialInstructions')}: ${order.notes}\n`;
    }
    msg += `\n*${tr('items')}:*\n`;
    order.items.forEach(item => {
      msg += `• ${item.quantity}x ${resolveText(item.name, targetLang)}`;
      if (item.size) msg += ` (${resolveText(item.size, targetLang)})`;
      if (item.addons && item.addons.length > 0) {
        msg += ` [Add-ons: ${item.addons.map(a => resolveText(a, targetLang)).join(', ')}]`;
      }
      if (item.removedIngredients && item.removedIngredients.length > 0) {
        msg += ` [${tr('no')}: ${item.removedIngredients.map(r => resolveText(r, targetLang)).join(', ')}]`;
      }
      if (item.notes) {
        msg += ` (Note: ${item.notes})`;
      }
      msg += `\n`;
    });
    msg += `\n`;
    msg += `*${tr('subtotal')}:* ${formatPrice(order.subtotal, currency)}\n`;
    if (order.type === 'delivery') {
      msg += `*${tr('deliveryFee')}:* ${formatPrice(order.deliveryFee, currency)}\n`;
    }
    msg += `*${tr('total')}:* ${formatPrice(order.total, currency)}`;

    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://dinelabs.co'}/${tenant.slug}/confirmation/${order._id}`;
    msg += `\n\n📍 *${tr('trackOrder')}:*\n${trackingUrl}`;
    return msg;
  };

  // Build HTML message for Email
  const buildHtmlMessage = () => {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
        ${tenant.logoUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="cid:tenantlogo" alt="${tenant.name}" style="max-height: 80px; border-radius: 12px;" /></div>` : ''}
        <h2 style="color: #ef4444; margin-top: 0; text-align: center;">${tr('newOrder')} - #${order.orderNo}</h2>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p><strong>${tr('fulfillment')}:</strong> ${resolveText(typeLabels[order.type] || order.type, targetLang)}</p>
        <p><strong>${tr('restaurant')}:</strong> ${tenant.name}</p>
        
        <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">${tr('customerDetails')}</h3>
        <ul style="list-style: none; padding-left: 0; line-height: 1.6;">
          <li><strong>${tr('name')}:</strong> ${order.customer.name}</li>
          <li><strong>${tr('phone')}:</strong> ${order.customer.phone}</li>
          <li><strong>${tr('email')}:</strong> ${order.customer.email}</li>
          ${order.type === 'dine-in' && order.customer.tableNo ? `<li><strong>${tr('table')}:</strong> ${order.customer.tableNo}</li>` : ''}
          ${order.type === 'delivery' && order.customer.address ? `<li><strong>${tr('address')}:</strong> ${order.customer.address}</li>` : ''}
          ${order.notes ? `<li><strong>${tr('specialInstructions')}:</strong> ${order.notes}</li>` : ''}
        </ul>

        <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">${tr('items')}</h3>
        <table border="0" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9fafb; text-align: left;">
              <th style="border-bottom: 1px solid #e5e7eb;">Qty</th>
              <th style="border-bottom: 1px solid #e5e7eb;">Item</th>
              <th style="border-bottom: 1px solid #e5e7eb;">Details</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="border-bottom: 1px solid #e5e7eb; vertical-align: top;">${item.quantity}x</td>
                <td style="border-bottom: 1px solid #e5e7eb; vertical-align: top;"><strong>${resolveText(item.name, targetLang)}</strong></td>
                <td style="border-bottom: 1px solid #e5e7eb; font-size: 0.85em; color: #4b5563; vertical-align: top;">
                  ${item.size ? `Size: ${resolveText(item.size, targetLang)}<br/>` : ''}
                  ${item.addons && item.addons.length > 0 ? `Add-ons: ${item.addons.map(a => resolveText(a, targetLang)).join(', ')}<br/>` : ''}
                  ${item.removedIngredients && item.removedIngredients.length > 0 ? `${tr('no')}: ${item.removedIngredients.map(r => resolveText(r, targetLang)).join(', ')}<br/>` : ''}
                  ${item.notes ? `Note: ${item.notes}` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 20px; line-height: 1.6;">
          <p style="margin: 4px 0; display: flex; justify-content: space-between;">
            <span>${tr('subtotal')}:</span> <strong>${formatPrice(order.subtotal, currency)}</strong>
          </p>
          ${order.type === 'delivery' ? `
            <p style="margin: 4px 0; display: flex; justify-content: space-between;">
              <span>${tr('deliveryFee')}:</span> <strong>${formatPrice(order.deliveryFee, currency)}</strong>
            </p>
          ` : ''}
          <h3 style="margin: 12px 0 0 0; display: flex; justify-content: space-between; border-top: 1px dashed #e5e7eb; padding-top: 12px; color: #ef4444;">
            <span>${tr('total')}:</span> <span>${formatPrice(order.total, currency)}</span>
          </h3>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://dinelabs.co'}/${tenant.slug}/confirmation/${order._id}" 
             style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 0.95rem;">
            ${tr('trackOrder')}
          </a>
          <p style="margin-top: 8px; font-size: 0.75rem; color: #9ca3af;">${tr('trackDesc')}</p>
        </div>
      </div>
    `;
  };

  let emailRecipient = notifications.emailRecipient;
  if (!emailRecipient) {
    try {
      const db = await getDb();
      const user = await db.collection('users').findOne({ tenantId: tenant._id.toString(), role: 'manager' });
      if (user) {
        emailRecipient = user.email;
      }
    } catch (e) {
      console.error('Error finding manager user email:', e);
    }
  }
  if (!emailRecipient) {
    emailRecipient = process.env.SMTP_USER || 'orders@dinelabs.co';
  }

  // Compile final email recipients: always include customer and manager (if enabled)
  const emailList = [];
  if (notifications.emailEnabled && emailRecipient) {
    emailList.push(emailRecipient);
  }
  if (order.customer?.email) {
    emailList.push(order.customer.email);
  }
  const finalEmailTo = emailList.join(', ');

  let telegramChatId = (notifications.telegramChatId || process.env.TELEGRAM_CHAT_ID || '').trim();

  // Send Telegram message task (run first / concurrently)
  const sendTelegramTask = async () => {
    if (!notifications.telegramEnabled || !telegramChatId) return;
    try {
      const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
      if (!botToken) {
        console.warn('TELEGRAM_BOT_TOKEN is not defined in environment variables');
        return;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: buildTextMessage(),
          parse_mode: 'Markdown'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        console.log('✅ Telegram notification sent successfully');
      } else {
        console.warn(`Telegram API warning: status ${res.status}`);
      }
    } catch (e) {
      if (e.name === 'AbortError' || e.code === 'UND_ERR_CONNECT_TIMEOUT') {
        console.warn('⚠️ Telegram notification timed out (network connection timeout)');
      } else {
        console.warn('⚠️ Telegram notification skipped:', e.message || e);
      }
    }
  };

  // Send Email task
  const sendEmailTask = async () => {
    if (!finalEmailTo) return;
    try {
      const smtpUser = process.env.SMTP_USER;
      if (smtpUser) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.titan.email',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
          auth: {
            user: smtpUser,
            pass: process.env.SMTP_PASS
          }
        });

        const attachments = [];
        if (tenant.logoUrl) {
          attachments.push({
            filename: 'logo.png',
            path: tenant.logoUrl,
            cid: 'tenantlogo'
          });
        }

        const info = await transporter.sendMail({
          from: `"${tenant.name}" <${smtpUser}>`,
          to: finalEmailTo,
          subject: `${tr('newOrder')} - #${order.orderNo}`,
          html: buildHtmlMessage(),
          attachments
        });

        console.log('✅ SMTP email notification sent successfully to:', finalEmailTo, info.messageId);
      } else {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          console.warn('Neither SMTP_USER nor RESEND_API_KEY is defined in environment variables');
        } else {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              from: `${tenant.name} <onboarding@resend.dev>`,
              to: finalEmailTo,
              subject: `${tr('newOrder')} - #${order.orderNo}`,
              html: buildHtmlMessage()
            })
          });

          const resData = await response.json();
          if (!response.ok) {
            console.error('Resend email notification failed:', resData);
          } else {
            console.log('✅ Resend email notification sent successfully:', resData.id);
          }
        }
      }
    } catch (e) {
      console.error('Error sending email notification:', e);
    }
  };

  // Dispatch Telegram first and run concurrently in parallel
  await Promise.allSettled([sendTelegramTask(), sendEmailTask()]);
}

export async function sendOrderStatusUpdateNotification(order, tenant, newStatus, deliveryMinutes) {
  if (!order || !tenant) return;
  if (!order.customer?.email) {
    console.log('Customer has no email address, skipping status update notification');
    return;
  }

  const currency = tenant.baseCurrency || 'USD';
  const targetLang = tenant.defaultLanguage || 'en';

  const tr = (key) => {
    const langDict = translations[targetLang] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  const assigned = tenant.assignedNotifications || { email: true, telegram: true };
  const notifications = {
    emailEnabled: (tenant.notifications?.emailEnabled !== false) && (assigned.email !== false),
    emailRecipient: tenant.notifications?.emailRecipient || ''
  };

  if (!notifications.emailEnabled) {
    console.log('Email notifications disabled for tenant');
    return;
  }

  // Get status subject and text
  let statusText = '';
  let statusSubject = '';
  let statusMessage = '';

  if (newStatus === 'accepted') {
    statusSubject = `${tr('statusSubjectAccepted')} - #${order.orderNo} - ${tenant.name}`;
    statusText = tr('statusPreparing');
    statusMessage = tr('msgPreparing');
  } else if (newStatus === 'ready') {
    statusSubject = `${tr('statusSubjectReady')} - #${order.orderNo} - ${tenant.name}`;
    statusText = tr('statusPrepared');
    statusMessage = tr('msgReady');
  } else if (newStatus === 'shipped') {
    statusSubject = `${tr('statusSubjectTransit')} - #${order.orderNo} - ${tenant.name}`;
    statusText = tr('statusTransit');
    statusMessage = `${tr('msgTransit')} ${tr('estimatedTransit')}: <strong>${deliveryMinutes || 20} ${tr('mins')}</strong>.`;
  } else if (newStatus === 'completed') {
    statusSubject = `${tr('statusSubjectCompleted')} - #${order.orderNo} - ${tenant.name}`;
    statusText = tr('statusDelivered');
    statusMessage = tr('msgDelivered');
  } else if (newStatus === 'declined') {
    statusSubject = `${tr('statusSubjectCancelled')} - #${order.orderNo} - ${tenant.name}`;
    statusText = tr('statusCancelled');
    statusMessage = tr('msgCancelled');
  } else {
    return;
  }

  const buildHtml = () => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
      ${tenant.logoUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="cid:tenantlogo" alt="${tenant.name}" style="max-height: 80px; border-radius: 12px;" /></div>` : ''}
      <h2 style="color: #ef4444; margin-top: 0; text-align: center;">🍕 ${tenant.name}</h2>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <div style="text-align: center; padding: 10px 0;">
        <span style="font-size: 1.15em; font-weight: bold; color: #1f2937;">Your order #${order.orderNo} ${statusText}</span>
        <p style="color: #4b5563; font-size: 0.95em; margin-top: 10px; line-height: 1.5;">${statusMessage}</p>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 0.9em; color: #374151;">
        <strong>Order Details:</strong>
        <ul style="padding-left: 20px; margin-top: 8px;">
          ${order.items.map(item => `<li>${item.quantity}x ${resolveText(item.name, targetLang)} ${item.size ? `(${resolveText(item.size, targetLang)})` : ''}</li>`).join('')}
        </ul>
        <div style="border-top: 1px dashed #e5e7eb; padding-top: 8px; margin-top: 8px; font-weight: bold;">
          Total: ${formatPrice(order.total, currency)}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 0.8em; color: #9ca3af;">Thank you for choosing DineLabs</p>
      </div>
    </div>
  `;

  try {
    const smtpUser = process.env.SMTP_USER;
    if (smtpUser) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.titan.email',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
        auth: {
          user: smtpUser,
          pass: process.env.SMTP_PASS
        }
      });

      const attachments = [];
      if (tenant.logoUrl) {
        attachments.push({
          filename: 'logo.png',
          path: tenant.logoUrl,
          cid: 'tenantlogo'
        });
      }

      await transporter.sendMail({
        from: `"${tenant.name}" <${smtpUser}>`,
        to: order.customer.email,
        subject: statusSubject,
        html: buildHtml(),
        attachments
      });
      console.log(`Status email notification sent to ${order.customer.email} for status: ${newStatus}`);
    }
  } catch (e) {
    console.error('Error sending order status email:', e);
  }
}

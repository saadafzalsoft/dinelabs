import nodemailer from 'nodemailer';
import { getDb } from './db';

const formatPrice = (amount, currency) => {
  if (currency === 'LBP') {
    return 'LBP ' + parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
};

export async function sendOrderNotifications(order, tenant) {
  if (!tenant) {
    console.log('Tenant is missing');
    return;
  }

  // Hydrate notification configuration defaults
  const assigned = tenant.assignedNotifications || { email: true, whatsapp: true, telegram: true };
  const notifications = {
    emailEnabled: (tenant.notifications?.emailEnabled !== false) && (assigned.email !== false),
    whatsappEnabled: (tenant.notifications?.whatsappEnabled !== false) && (!!assigned.whatsapp),
    telegramEnabled: (tenant.notifications?.telegramEnabled !== false) && (!!assigned.telegram),
    emailRecipient: tenant.notifications?.emailRecipient || '',
    whatsappRecipient: tenant.notifications?.whatsappRecipient || '',
    telegramChatId: tenant.notifications?.telegramChatId || ''
  };

  const currency = tenant.baseCurrency || 'USD';

  // Build plain text message for WhatsApp and Telegram
  const buildTextMessage = () => {
    let msg = `🔔 *New Order #${order.orderNo}*\n`;
    msg += `--------------------------------\n`;
    msg += `Fulfillment: *${order.type.toUpperCase()}*\n`;
    msg += `Restaurant: *${tenant.name}*\n\n`;
    
    msg += `*Customer Details:*\n`;
    msg += `• Name: ${order.customer.name}\n`;
    msg += `• Phone: ${order.customer.phone}\n`;
    msg += `• Email: ${order.customer.email}\n`;
    if (order.type === 'dine-in' && order.customer.tableNo) {
      msg += `• Table: ${order.customer.tableNo}\n`;
    }
    if (order.type === 'delivery' && order.customer.address) {
      msg += `• Address: ${order.customer.address}\n`;
    }
    msg += `\n*Items:*\n`;
    order.items.forEach(item => {
      msg += `• ${item.quantity}x ${item.name}`;
      if (item.size) msg += ` (${item.size})`;
      if (item.addons && item.addons.length > 0) {
        msg += ` [Add-ons: ${item.addons.join(', ')}]`;
      }
      if (item.removedIngredients && item.removedIngredients.length > 0) {
        msg += ` [No: ${item.removedIngredients.join(', ')}]`;
      }
      msg += `\n`;
    });
    msg += `\n`;
    msg += `*Subtotal:* ${formatPrice(order.subtotal, currency)}\n`;
    if (order.type === 'delivery') {
      msg += `*Delivery Fee:* ${formatPrice(order.deliveryFee, currency)}\n`;
    }
    msg += `*Total:* ${formatPrice(order.total, currency)}`;

    // Tracking link
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.dinelabs.co'}/${tenant.slug}/confirmation/${order._id}`;
    msg += `\n\n📍 *Track your order:*\n${trackingUrl}`;
    return msg;
  };

  // Build HTML message for Email
  const buildHtmlMessage = () => {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
        <h2 style="color: #ef4444; margin-top: 0;">🔔 New Order Alert - #${order.orderNo}</h2>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p><strong>Fulfillment Mode:</strong> ${order.type.toUpperCase()}</p>
        <p><strong>Restaurant:</strong> ${tenant.name}</p>
        
        <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Customer Details</h3>
        <ul style="list-style: none; padding-left: 0; line-height: 1.6;">
          <li><strong>Name:</strong> ${order.customer.name}</li>
          <li><strong>Phone:</strong> ${order.customer.phone}</li>
          <li><strong>Email:</strong> ${order.customer.email}</li>
          ${order.type === 'dine-in' && order.customer.tableNo ? `<li><strong>Table:</strong> ${order.customer.tableNo}</li>` : ''}
          ${order.type === 'delivery' && order.customer.address ? `<li><strong>Address:</strong> ${order.customer.address}</li>` : ''}
        </ul>

        <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Items</h3>
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
                <td style="border-bottom: 1px solid #e5e7eb; vertical-align: top;"><strong>${item.name}</strong></td>
                <td style="border-bottom: 1px solid #e5e7eb; font-size: 0.85em; color: #4b5563; vertical-align: top;">
                  ${item.size ? `Size: ${item.size}<br/>` : ''}
                  ${item.addons && item.addons.length > 0 ? `Add-ons: ${item.addons.join(', ')}<br/>` : ''}
                  ${item.removedIngredients && item.removedIngredients.length > 0 ? `Removed: ${item.removedIngredients.join(', ')}` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 20px; line-height: 1.6;">
          <p style="margin: 4px 0; display: flex; justify-content: space-between;">
            <span>Subtotal:</span> <strong>${formatPrice(order.subtotal, currency)}</strong>
          </p>
          ${order.type === 'delivery' ? `
            <p style="margin: 4px 0; display: flex; justify-content: space-between;">
              <span>Delivery Fee:</span> <strong>${formatPrice(order.deliveryFee, currency)}</strong>
            </p>
          ` : ''}
          <h3 style="margin: 12px 0 0 0; display: flex; justify-content: space-between; border-top: 1px dashed #e5e7eb; padding-top: 12px; color: #ef4444;">
            <span>Total:</span> <span>${formatPrice(order.total, currency)}</span>
          </h3>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.dinelabs.co'}/${tenant.slug}/confirmation/${order._id}" 
             style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 0.95rem;">
            📍 Track Your Order
          </a>
          <p style="margin-top: 8px; font-size: 0.75rem; color: #9ca3af;">Click the button above to see real-time order status updates.</p>
        </div>
      </div>
    `;
  };

  // Determine recipients using env setup or database lookup fallback
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

  // Compile final email recipients list: include customer email if available
  const emailList = [emailRecipient];
  if (order.customer?.email) {
    emailList.push(order.customer.email);
  }
  const finalEmailTo = emailList.join(', ');

  let whatsappRecipient = notifications.whatsappRecipient || process.env.WHATSAPP_RECIPIENT;
  let telegramChatId = notifications.telegramChatId || process.env.TELEGRAM_CHAT_ID;

  // Send Email (SMTP with Nodemailer or fallback to Resend)
  if (notifications.emailEnabled && finalEmailTo) {
    try {
      const smtpUser = process.env.SMTP_USER;
      if (smtpUser) {
        // Use SMTP via Titan Mail / Custom SMTP config
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.titan.email',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
          auth: {
            user: smtpUser,
            pass: process.env.SMTP_PASS
          }
        });

        const info = await transporter.sendMail({
          from: `"DineLabs Notifications" <${smtpUser}>`,
          to: finalEmailTo,
          subject: `New Order Alert - #${order.orderNo}`,
          html: buildHtmlMessage()
        });

        console.log('SMTP email notification sent successfully to:', finalEmailTo, info.messageId);
      } else {
        // Fallback to Resend API
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
              from: 'DineLabs <onboarding@resend.dev>',
              to: finalEmailTo,
              subject: `New Order Alert - #${order.orderNo}`,
              html: buildHtmlMessage()
            })
          });

          const resData = await response.json();
          if (!response.ok) {
            console.error('Resend email notification failed:', resData);
          } else {
            console.log('Resend email notification sent successfully:', resData.id);
          }
        }
      }
    } catch (e) {
      console.error('Error sending email notification:', e);
    }
  }

  // Send WhatsApp via Twilio
  if (notifications.whatsappEnabled && whatsappRecipient) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

      if (!accountSid || !authToken) {
        console.warn('Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) are not defined in environment variables');
      } else {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        
        const params = new URLSearchParams();
        params.append('From', `whatsapp:${twilioNumber}`);
        params.append('To', `whatsapp:${whatsappRecipient}`);
        params.append('Body', buildTextMessage());

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authHeader
          },
          body: params.toString()
        });

        const resData = await response.json();
        if (!response.ok) {
          console.error('Twilio WhatsApp notification failed:', resData);
        } else {
          console.log('Twilio WhatsApp notification sent successfully:', resData.sid);
        }
      }
    } catch (e) {
      console.error('Error sending WhatsApp notification:', e);
    }
  }

  // Send Telegram message
  if (notifications.telegramEnabled && telegramChatId) {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        console.warn('TELEGRAM_BOT_TOKEN is not defined in environment variables');
      } else {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: buildTextMessage(),
            parse_mode: 'Markdown'
          })
        });

        const resData = await response.json();
        if (!response.ok || !resData.ok) {
          console.error('Telegram notification failed:', resData);
        } else {
          console.log('Telegram notification sent successfully');
        }
      }
    } catch (e) {
      console.error('Error sending Telegram notification:', e);
    }
  }
}

export async function sendOrderStatusUpdateNotification(order, tenant, newStatus, deliveryMinutes) {
  if (!order || !tenant) return;
  if (!order.customer?.email) {
    console.log('Customer has no email address, skipping status update notification');
    return;
  }

  const currency = tenant.baseCurrency || 'USD';
  const assigned = tenant.assignedNotifications || { email: true, whatsapp: true, telegram: true };
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
    statusSubject = `Order #${order.orderNo} Accepted - ${tenant.name}`;
    statusText = 'is now preparing in the kitchen!';
    statusMessage = `Great news! The kitchen has accepted your order and is preparing it. We estimate it will be ready/dispatched soon based on our standard cooking times.`;
  } else if (newStatus === 'ready') {
    statusSubject = `Order #${order.orderNo} Ready for Collection - ${tenant.name}`;
    statusText = 'is ready!';
    statusMessage = `Your order is prepared and ready! Please proceed to the counter or await tableside service.`;
  } else if (newStatus === 'shipped') {
    statusSubject = `Order #${order.orderNo} Out for Delivery - ${tenant.name}`;
    statusText = 'is on its way!';
    statusMessage = `Your delivery is on its way! The driver has departed. Estimated delivery transit: <strong>${deliveryMinutes || 20} minutes</strong>.`;
  } else if (newStatus === 'completed') {
    statusSubject = `Order #${order.orderNo} Fulfilled - ${tenant.name}`;
    statusText = 'has been completed!';
    statusMessage = `Thank you for dining with us! Your order is complete. We hope you enjoy your meal!`;
  } else if (newStatus === 'declined') {
    statusSubject = `Order #${order.orderNo} Cancelled - ${tenant.name}`;
    statusText = 'has been cancelled';
    statusMessage = `We regret to inform you that your order has been cancelled by the restaurant. For details, please contact the restaurant directly.`;
  } else {
    return; // Don't notify other intermediate/unknown statuses
  }

  const buildHtml = () => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
      <h2 style="color: #ef4444; margin-top: 0; text-align: center;">🍕 ${tenant.name}</h2>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <div style="text-align: center; padding: 10px 0;">
        <span style="font-size: 1.15em; font-weight: bold; color: #1f2937;">Your order #${order.orderNo} ${statusText}</span>
        <p style="color: #4b5563; font-size: 0.95em; margin-top: 10px; line-height: 1.5;">${statusMessage}</p>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 0.9em; color: #374151;">
        <strong>Order Details:</strong>
        <ul style="padding-left: 20px; margin-top: 8px;">
          ${order.items.map(item => `<li>${item.quantity}x ${item.name} ${item.size ? `(${item.size})` : ''}</li>`).join('')}
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

      await transporter.sendMail({
        from: `"${tenant.name}" <${smtpUser}>`,
        to: order.customer.email,
        subject: statusSubject,
        html: buildHtml()
      });
      console.log(`Status email notification sent to ${order.customer.email} for status: ${newStatus}`);
    }
  } catch (e) {
    console.error('Error sending order status email:', e);
  }
}


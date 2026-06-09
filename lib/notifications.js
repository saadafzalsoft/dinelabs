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
  const assigned = tenant.assignedNotifications || { email: true, whatsapp: false, telegram: false };
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

  let whatsappRecipient = notifications.whatsappRecipient || process.env.WHATSAPP_RECIPIENT;
  let telegramChatId = notifications.telegramChatId || process.env.TELEGRAM_CHAT_ID;

  // Send Email (SMTP with Nodemailer or fallback to Resend)
  if (notifications.emailEnabled && emailRecipient) {
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
          to: emailRecipient,
          subject: `New Order Alert - #${order.orderNo}`,
          html: buildHtmlMessage()
        });

        console.log('SMTP email notification sent successfully:', info.messageId);
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
              to: emailRecipient,
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

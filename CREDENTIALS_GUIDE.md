# DineLabs Integration Credentials Setup Guide

This guide describes how to configure and obtain the credentials required for the multi-channel notification engine (Email, WhatsApp, and Telegram).

---

## 1. Resend Email Integration
DineLabs uses **Resend** for sending transactional email alerts.

### Step-by-Step Procedure:
1. **Sign Up**: Go to [resend.com](https://resend.com) and create a free account.
2. **Verify Domain**: 
   - Navigate to the **Domains** tab in the sidebar.
   - Click **Add Domain**, enter your website's domain name, and configure the DNS settings (SPF/DKIM) on your registrar (e.g. GoDaddy, Namecheap).
3. **Generate API Key**:
   - Go to the **API Keys** tab in the Resend dashboard.
   - Click **Create API Key**, name it (e.g. `DineLabs Manager`), select the permission role as `Sending access` or `Full access`, and click **Add**.
   - Copy the generated token immediately.
4. **Environment Configuration**:
   - Save the copied token in your project's `.env` file under:
     ```env
     RESEND_API_KEY=re_your_api_key_here
     ```
5. **Testing Sandbox**:
   - If your domain is not verified yet, you can test sending notifications to your registered account email by using `onboarding@resend.dev` as the sender address.

---

## 2. Twilio WhatsApp Integration
DineLabs uses the **Twilio Messaging API** to send automated WhatsApp order alerts.

### Step-by-Step Procedure:
1. **Sign Up**: Register for a Twilio developer console account at [twilio.com](https://twilio.com).
2. **Retrieve SID & Auth Token**:
   - From your dashboard console, look under **Account Info**.
   - Copy the **Account SID** and **Auth Token**.
3. **Configure WhatsApp Sandbox**:
   - Navigate to **Messaging** > **Try it out** > **Send a WhatsApp Message**.
   - Note down the Twilio Sandbox WhatsApp number (usually `+14155238886`).
   - Follow the instructions to join the sandbox by scanning the QR code or texting the specific sandbox join code (e.g., `join sandbox-keyword`) from your recipient phone number to the sandbox number.
4. **Environment Configuration**:
   - Add these values to your `.env` file:
     ```env
     TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     TWILIO_AUTH_TOKEN=your_auth_token_here
     TWILIO_WHATSAPP_NUMBER=+14155238886
     ```

---

## 3. Telegram Bot Integration
DineLabs dispatches instant notifications to your manager's private chat or group via a Telegram Bot.

### Step-by-Step Procedure:
1. **Create a Telegram Bot**:
   - Open Telegram and search for the user [@BotFather](https://t.me/BotFather) (the official bot builder).
   - Start the chat and send the command:
     ```text
     /newbot
     ```
   - Enter a friendly name for your bot (e.g. `DineLabs Alert Bot`).
   - Choose a unique username ending in `bot` (e.g. `dinelabs_alert_bot`).
   - Copy the **HTTP API Access Token** provided by @BotFather.
2. **Obtain Your Telegram Chat ID**:
   - To receive alerts, you need your unique numeric Chat ID.
   - Search for the [@userinfobot](https://t.me/userinfobot) on Telegram and start a conversation.
   - It will reply with your dynamic ID (e.g. `543210987`). Copy this number.
3. **Environment Configuration**:
   - Add the bot token to your `.env` file:
     ```env
     TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
     ```
   - In the DineLabs manager portal's settings page, under the **Order Alerts** tab, check the Telegram box and paste your numeric Chat ID.

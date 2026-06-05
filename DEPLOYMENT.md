# DineLabs VPS Deployment Guide (Ubuntu Server)

This guide walks you through setting up and hosting the **DineLabs** application on an Ubuntu VPS.

Choose between **Option A (Docker Compose - Recommended)** or **Option B (PM2 Process Manager)** depending on your preferred environment.

---

## 📋 Prerequisites

Before starting, connect to your Ubuntu VPS via SSH:
```bash
ssh user@your_server_ip
```

### 1. Update Host OS packages
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Git and Curl
```bash
sudo apt install -y git curl
```

---

## 🐳 Option A: Docker Compose Deployment (Recommended)

Using Docker isolates the Next.js runtime environment and simplifies builds.

### 1. Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose
```

### 2. Clone and Setup Environment
```bash
# Clone the repository
git clone <your-repository-url> /var/www/dinelabs
cd /var/www/dinelabs

# Create production .env file
cp .env .env.production
nano .env
```
Fill out the variables in `.env` (MongoDB connection URI, JWT secret key, and notifications settings: Resend, Twilio, Telegram). Refer to `CREDENTIALS_GUIDE.md` for details on obtaining keys.

### 3. Build and Start Container
Run the build process in the background:
```bash
sudo docker-compose up -d --build
```
Verify the container is active:
```bash
sudo docker ps
```
Your application is now running on `http://localhost:3000` inside Docker.

### 4. Viewing Application Logs
```bash
sudo docker-compose logs -f
```

---

## 📦 Option B: PM2 Deployment (Direct Node.js Execution)

If you prefer to run the application directly on the host machine using PM2.

### 1. Install Node.js (v20) and PM2
```bash
# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -y -g pm2
```

### 2. Clone, Install, and Compile
```bash
# Clone the repository
git clone <your-repository-url> /var/www/dinelabs
cd /var/www/dinelabs

# Create production .env file
nano .env

# Install production dependencies
npm install

# Compile the standalone production bundle
npm run build
```

### 3. Start Application with PM2 Clustering
```bash
pm2 start ecosystem.config.cjs

# Make PM2 restart automatically on server reboot
pm2 startup
pm2 save
```
Verify the process status:
```bash
pm2 status
```

### 4. Viewing Logs
```bash
pm2 logs dinelabs
```

---

## 🌐 Configuring Nginx Reverse Proxy (Ports 80 / 443)

Nginx routes internet traffic from port 80/443 directly to port 3000.

### 1. Install Nginx
```bash
sudo apt install -y nginx
```

### 2. Configure Configuration Blocks
Create a new server block file:
```bash
sudo nano /etc/nginx/sites-available/dinelabs
```
Paste the following configurations (replacing `yourdomain.com` with your domain name):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Gzip Compression Config
    gzip on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss;
    gzip_vary on;

    # Proxy headers setup
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static asset optimization caching
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        expires 365d;
        access_log off;
    }
}
```

### 3. Enable Configuration and Restart Nginx
```bash
# Link config to sites-enabled
sudo ln -s /etc/nginx/sites-available/dinelabs /etc/nginx/sites-enabled/

# Remove default site config (if present)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration syntax
sudo nginx -t

# Reload configurations
sudo systemctl reload nginx
```

---

## 🔒 Securing Connection with SSL (HTTPS Let's Encrypt)

Secure your digital menus with free SSL certificates via Certbot.

### 1. Install Certbot for Nginx
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Request and Auto-configure SSL Certificates
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the interactive prompt instructions. Certbot will automatically rewrite the Nginx configurations to redirect all port 80 HTTP traffic to port 443 HTTPS.

### 3. Verify Auto-renewals Cron
Let's Encrypt certificates are valid for 90 days. Certbot configures a cron job automatically to renew them. Test it using:
```bash
sudo certbot renew --dry-run
```

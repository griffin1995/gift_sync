# GiftSync Cloudflare Deployment Guide

This guide covers deploying GiftSync to `giftsync.jackgriffin.dev` using your existing Cloudflare infrastructure.

## 🌐 Cloudflare Setup

### 1. DNS Configuration
Add these DNS records in your Cloudflare dashboard for `jackgriffin.dev`:

```
Type: CNAME
Name: giftsync
Target: [your-deployment-target]
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 2. Deployment Options

#### Option A: Cloudflare Pages (Recommended)
**Best for:** Frontend hosting with automatic deployments

1. **Connect Repository:**
   - Go to Cloudflare Dashboard → Pages
   - Connect your GitHub repository
   - Select the `web/` directory as build output

2. **Build Settings:**
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: web
   ```

3. **Environment Variables:**
   ```
   NODE_ENV=production
   VITE_API_URL=https://giftsync-api.jackgriffin.dev
   VITE_POSTHOG_KEY=your-posthog-key
   VITE_SENTRY_DSN=your-sentry-dsn
   ```

#### Option B: Cloudflare Workers (For API)
**Best for:** Backend API hosting

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Configure `wrangler.toml`:**
   ```toml
   name = "giftsync-api"
   main = "src/index.js"
   compatibility_date = "2024-01-01"
   
   [env.staging]
   route = "giftsync-api.jackgriffin.dev/*"
   
   [[env.staging.vars]]
   ENVIRONMENT = "staging"
   API_BASE_URL = "https://giftsync-api.jackgriffin.dev"
   ```

## 🚀 Deployment Architecture

### Recommended Setup:
```
Frontend:  giftsync.jackgriffin.dev       (Cloudflare Pages)
API:       giftsync-api.jackgriffin.dev   (Cloudflare Workers or External)
Database:  Supabase (Free Tier)
Redis:     Upstash (Free Tier)
Storage:   Supabase Storage
```

### Alternative Setup (Simpler):
```
Full App:  giftsync.jackgriffin.dev       (Cloudflare Pages)
Database:  Supabase (Free Tier)
Storage:   Supabase Storage
```

## 🔧 Configuration Steps

### 1. Update Environment Files

Copy and configure the staging environment:
```bash
cp .env.staging .env
# Edit .env with your actual values
```

### 2. Configure CORS
Update your backend to allow your Cloudflare domain:

```javascript
// backend/app/main_simple.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://giftsync.jackgriffin.dev",
        "https://jackgriffin.dev",
        "http://localhost:3000"  # For development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. SSL Configuration
Cloudflare automatically provides SSL certificates. Configure SSL settings:

1. **SSL/TLS Mode:** Full (strict)
2. **Always Use HTTPS:** On
3. **HSTS:** Enabled
4. **Minimum TLS Version:** 1.2

## 📱 Web App Setup

Since your current setup has the web app, let's configure it for Cloudflare Pages:

### 1. Prepare Web Directory
```bash
cd web
npm install
npm run build
```

### 2. Cloudflare Pages Configuration
Create `web/_redirects` file:
```
# SPA fallback
/*    /index.html   200

# API proxy (if needed)
/api/*  https://giftsync-api.jackgriffin.dev/api/:splat  200
```

### 3. Build Settings in Cloudflare
```
Framework preset: React
Build command: npm run build
Build output directory: dist
Root directory: web
Node.js version: 18
```

## 🔗 DNS Records You'll Need

Add these to your Cloudflare DNS:

```
# Main app
Type: CNAME
Name: giftsync
Target: giftsync-pages.pages.dev
Proxy: On

# API (if separate)
Type: CNAME  
Name: giftsync-api
Target: giftsync-api.your-workers-domain.workers.dev
Proxy: On
```

## 🌍 Environment Variables for Cloudflare

### Cloudflare Pages Environment Variables:
```
NODE_ENV=production
VITE_API_BASE_URL=https://giftsync.jackgriffin.dev/api
VITE_APP_URL=https://giftsync.jackgriffin.dev
VITE_POSTHOG_KEY=your-posthog-key
VITE_SENTRY_DSN=your-sentry-dsn
```

### Cloudflare Workers Environment Variables (if using):
```
ENVIRONMENT=staging
DATABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-key
SECRET_KEY=your-secret
CORS_ORIGINS=https://giftsync.jackgriffin.dev
```

## 🚀 Quick Deployment Steps

### Method 1: Direct Upload
```bash
# Build the web app
cd web && npm run build

# Upload to Cloudflare Pages
npx wrangler pages publish dist --project-name=giftsync
```

### Method 2: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect repository in Cloudflare Pages
3. Automatic deployments on every push

## 📊 Monitoring & Analytics

### Cloudflare Analytics
- Built-in web analytics
- Performance monitoring  
- Security insights

### Custom Analytics
- PostHog: User behavior tracking
- Sentry: Error monitoring
- Cloudflare Web Analytics: Core web vitals

## 🔄 Future Migration Path

When ready for a custom domain:
1. **Register domain** (e.g., giftsync.com)
2. **Add to Cloudflare** 
3. **Update DNS** records
4. **Update environment** variables
5. **Test and switch** traffic

## 💰 Cost Breakdown

### Current Setup (Free):
- **Cloudflare Pages:** Free (up to 500 builds/month)
- **Cloudflare Workers:** Free (100K requests/day)
- **Supabase:** Free tier
- **Upstash:** Free tier
- **Domain:** Using existing jackgriffin.dev
- **Total:** $0/month

### When You Scale:
- **Cloudflare Pages Pro:** $20/month (unlimited builds)
- **Cloudflare Workers Paid:** $5/month (10M requests)
- **Supabase Pro:** $25/month 
- **Custom Domain:** ~$12/year
- **Total:** ~$50/month for significant traffic

## 🎯 Next Steps

1. **Set up Cloudflare Pages** with your GitHub repo
2. **Configure DNS** record for giftsync.jackgriffin.dev
3. **Deploy web app** and test
4. **Set up external services** (Supabase, PostHog, etc.)
5. **Configure monitoring** and analytics

This approach gives you a professional staging environment at zero cost while keeping your options open for future scaling!
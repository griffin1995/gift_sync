# GiftSync Deployment Guide

## 🚀 Production Deployment Strategy

### Architecture Overview
- **Backend**: Railway (FastAPI + Supabase)
- **Frontend**: Vercel (Next.js)
- **Database**: Supabase (PostgreSQL)
- **Domain**: Custom domain configuration

## 🚄 Railway Backend Deployment

### Prerequisites
1. Railway account: https://railway.app
2. Railway CLI installed: `npm install -g @railway/cli`
3. Git repository pushed to GitHub

### Backend Deployment Steps

1. **Login to Railway**
   ```bash
   railway login
   ```

2. **Initialize Railway Project**
   ```bash
   cd backend
   railway init
   ```

3. **Set Environment Variables**
   ```bash
   # Required Environment Variables for Railway
   railway variables set SECRET_KEY="your-production-secret-key-256-bit"
   railway variables set SUPABASE_URL="https://xchsarvamppwephulylt.supabase.co"
   railway variables set SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaHNhcnZhbXBwd2VwaHVseWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY1MjksImV4cCI6MjA2NTg1MjUyOX0.qF2gpIKT7-wFOiIpgAe5unwHsAAttZXu_RAbVkexfb0"
   railway variables set SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaHNhcnZhbXBwd2VwaHVseWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI3NjUyOSwiZXhwIjoyMDY1ODUyNTI5fQ.ylz1FGYPLvvfX6UkZhAm8i65nwcnO90QN90ZxXdYZLE"
   
   # Production Settings
   railway variables set ENVIRONMENT="production"
   railway variables set DEBUG="false"
   railway variables set ALLOWED_HOSTS="*"
   
   # Optional: Advanced Features
   railway variables set SENTRY_DSN="your-sentry-dsn"
   railway variables set MIXPANEL_TOKEN="your-mixpanel-token"
   ```

4. **Deploy to Railway**
   ```bash
   railway up
   ```

5. **Get Backend URL**
   ```bash
   railway domain
   # Example output: https://giftsync-backend-production.up.railway.app
   ```

## ▲ Vercel Frontend Deployment

### Prerequisites
1. Vercel account: https://vercel.com
2. Vercel CLI installed: `npm install -g vercel`
3. Backend deployed and URL obtained

### Frontend Deployment Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy Frontend**
   ```bash
   cd web
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:

   ```bash
   # Required Variables
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
   NEXT_PUBLIC_WEB_URL=https://your-vercel-domain.vercel.app
   
   # Optional Analytics
   NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   NEXT_PUBLIC_GA_ID=your-google-analytics-id
   ```

4. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Details

### Railway Configuration (railway.toml)
The backend includes comprehensive Railway configuration:
- ✅ Dockerfile-based deployment
- ✅ Health checks on `/health`
- ✅ Auto-restart on failure
- ✅ Production environment variables
- ✅ Multi-worker setup (4 workers)
- ✅ All ML and analytics features enabled

### Vercel Configuration (vercel.json)
The frontend includes optimal Vercel configuration:
- ✅ Next.js framework optimization
- ✅ Security headers
- ✅ API proxying to backend
- ✅ Global CDN distribution
- ✅ Automatic HTTPS

## 🌐 Custom Domain Setup

### Backend Domain (Railway)
1. In Railway dashboard, go to your service
2. Click "Settings" > "Domains"
3. Add custom domain: `api.giftsync.com`
4. Update DNS records as instructed

### Frontend Domain (Vercel)
1. In Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add custom domain: `app.giftsync.com`
4. Update DNS records as instructed

## 🔍 Health Checks & Monitoring

### Backend Health Check
- URL: `https://your-backend-url/health`
- Expected Response: `{"status":"healthy","timestamp":"...","version":"1.0.0"}`

### Frontend Health Check
- URL: `https://your-frontend-url`
- Expected: Homepage loads successfully

### Test Complete Flow
1. Visit frontend URL
2. Register new account
3. Login successfully
4. Dashboard loads with recommendations
5. All API calls work correctly

## 📊 Production Environment Variables

### Backend (Railway)
```bash
# Core Settings
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-256-bit-secret-key
PORT=8000
WORKERS=4

# Database
SUPABASE_URL=https://xchsarvamppwephulylt.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Security
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
ALGORITHM=HS256

# Features
ENABLE_REGISTRATION=true
ENABLE_ML_RECOMMENDATIONS=true
ENABLE_AFFILIATE_TRACKING=true

# Performance
MAX_RECOMMENDATIONS_PER_USER=50
MAX_SWIPES_PER_SESSION=50
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=100

# ML Settings
ML_BATCH_SIZE=32
ML_UPDATE_INTERVAL_MINUTES=5

# Monitoring
PROMETHEUS_ENABLED=true
SENTRY_DSN=your-sentry-dsn
```

### Frontend (Vercel)
```bash
# Core Settings
NEXT_PUBLIC_API_URL=https://your-railway-backend-url
NEXT_PUBLIC_WEB_URL=https://your-vercel-frontend-url

# Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# App Metadata
NEXT_PUBLIC_APP_NAME=GiftSync
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION=AI-powered gift recommendation platform
```

## 🚨 Troubleshooting

### Common Issues

**Backend Won't Start**
- Check Railway logs: `railway logs`
- Verify environment variables are set
- Ensure Supabase credentials are correct

**Frontend Can't Connect to Backend**
- Verify `NEXT_PUBLIC_API_URL` points to Railway backend
- Check CORS settings in backend
- Ensure backend is healthy

**Database Connection Issues**
- Verify Supabase service key permissions
- Check RLS policies allow service operations
- Test database connectivity manually

### Success Indicators
✅ Backend health check returns `{"status":"healthy"}`
✅ Frontend loads without console errors
✅ User registration works end-to-end
✅ Dashboard shows recommendations
✅ All API endpoints respond correctly

## 📈 Performance Optimization

### Backend
- ✅ 4 workers for concurrent request handling
- ✅ Optimized Docker image with minimal layers
- ✅ Health check monitoring
- ✅ Auto-restart on failures

### Frontend
- ✅ Next.js optimization with SWC minifier
- ✅ Image optimization and lazy loading
- ✅ Global CDN distribution via Vercel
- ✅ Automatic code splitting

## 🔐 Security Features

### Backend Security
- ✅ JWT token authentication
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure headers

### Frontend Security
- ✅ CSP headers
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure token storage

---

**Deployment Status**: Ready for production deployment
**Est. Deployment Time**: 15-20 minutes
**Monthly Cost**: ~$0-25 (Railway Hobby + Vercel Pro as needed)
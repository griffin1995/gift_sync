# GiftSync - Complete Project Context & Development Guide

## 🎯 Project Overview
GiftSync is an AI-powered gift recommendation platform using swipe-based preference discovery to generate personalized gift suggestions while maintaining the element of surprise. Targets £45B global gift market with projected £2.5M revenue by Year 3.

**Business Context:**
- **Target Market**: £45B global gift market, £9.3B UK market
- **Revenue Model**: 7.5% average affiliate commissions + premium subscriptions
- **User Targets**: 1M+ users by Year 3, 25%+ conversion rate improvement
- **Key Segments**: Digital natives (18-35), busy professionals (25-45), corporate gifting

## 📍 Current Development Status (June 2025)

### ✅ COMPLETED COMPONENTS
1. **Complete Authentication System** - JWT tokens, protected routes, login/register flows
2. **Supabase Integration** - Database connection established with proper credentials
3. **Web Application** - Next.js with Tailwind CSS, responsive design, modern UI
4. **Backend API** - FastAPI with authentication endpoints (registration working)
5. **Database Schema** - Complete PostgreSQL schema deployed to Supabase
6. **Project Structure** - Full directory hierarchy with all foundational files
7. **ML Pipeline Foundation** - Neural collaborative filtering, content-based, hybrid models

### 🔧 CURRENT TECHNICAL STATE
- **Web App**: Port 3000 (Next.js + React 18 + Tailwind CSS)
- **Backend**: Port 8000 (FastAPI + Supabase PostgreSQL)
- **Database**: Supabase PostgreSQL with complete schema
- **Authentication**: Registration ✅ working, Login ⚠️ needs RLS policy fix
- **Git**: Clean state, 29 commits ahead, industry-standard commit messages

### ⚠️ IMMEDIATE ISSUES TO FIX
1. **Backend Login Issue**: RLS policies blocking user queries - needs policy update in Supabase
2. **Complete Authentication Flow**: Test login after RLS fix
3. **Web Server**: Not currently running, needs to be started

### 🎯 NEXT PRIORITIES
1. **Fix login authentication** (RLS policy update needed)
2. **Implement ML recommendation system** (High priority)
3. **Add real product data integration** (Amazon API)
4. **Test complete end-to-end user flow**

## 🏗️ Architecture & Technology Stack

### FINALIZED TECHNOLOGY DECISIONS
- **Frontend**: Next.js 14 + React 18 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + Python + Supabase PostgreSQL
- **Mobile**: Flutter 3.16+ (complete structure built)
- **ML Pipeline**: PyTorch + Neural Matrix Factorization
- **Infrastructure**: AWS (future) + Cloudflare Pages (current staging)
- **Authentication**: JWT tokens with automatic refresh

### DATABASE SCHEMA (DEPLOYED)
**Core Models:**
- **users**: Profile, preferences, subscription tiers, GDPR compliance
- **products**: Full catalog with ML features, affiliate links
- **swipe_sessions/swipe_interactions**: Tinder-style preference capture
- **recommendations**: AI-generated suggestions with confidence scores
- **gift_links**: Shareable links with QR codes and analytics
- **categories**: Product categorization system

### ML PIPELINE ARCHITECTURE
1. **Collaborative Filtering**: Neural Matrix Factorization with PyTorch ✅
2. **Content-Based**: TF-IDF + cosine similarity ✅
3. **Hybrid**: Weighted combination (60% CF, 40% content) ✅

## 🔐 Current Environment Configuration

### SUPABASE CREDENTIALS (WORKING)
```bash
SUPABASE_URL=https://xchsarvamppwephulylt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaHNhcnZhbXBwd2VwaHVseWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY1MjksImV4cCI6MjA2NTg1MjUyOX0.qF2gpIKT7-wFOiIpgAe5unwHsAAttZXu_RAbVkexfb0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaHNhcnZhbXBwd2VwaHVseWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI3NjUyOSwiZXhwIjoyMDY1ODUyNTI5fQ.ylz1FGYPLvvfX6UkZhAm8i65nwcnO90QN90ZxXdYZLE
```

### BACKEND ENVIRONMENT (.env)
```bash
# Supabase Configuration
SUPABASE_URL=https://xchsarvamppwephulylt.supabase.co
SUPABASE_ANON_KEY=[anon_key_above]
SUPABASE_SERVICE_KEY=[service_key_above]

# Security
SECRET_KEY=development-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30

# Development Settings
DEBUG=true
ENVIRONMENT=development
ALLOWED_HOSTS=["*"]

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_ML_RECOMMENDATIONS=true
```

### WEB APP CONFIGURATION
```bash
# API URL points to backend
API_URL=http://localhost:8000
```

## 🚀 Quick Start Commands for Next Session

### IMMEDIATE STARTUP SEQUENCE ✅ TESTED & WORKING (June 2025)
```bash
# 1. Navigate to project
cd /home/jack/Documents/gift_sync

# 2. Check git status
git status && git log --oneline -5

# 3. Start backend server (runs in background)
cd backend
source venv/bin/activate
nohup python -m uvicorn app.main_api:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &

# 4. Start web development server (runs in background)
cd ../web
nohup npm run dev > /tmp/frontend.log 2>&1 &

# 5. Wait for startup and verify both servers
sleep 10
curl http://localhost:8000/health
curl -I http://localhost:3000

# 6. Access applications
# Backend API: http://localhost:8000
# Web App: http://localhost:3000
# Both should respond successfully
```

### FIX LOGIN ISSUE (FIRST PRIORITY)
Run this SQL in Supabase dashboard to fix RLS policies:
```sql
-- Fix RLS policies for authentication
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Service role can access all users" ON users FOR ALL TO service_role USING (true);
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow anon registration" ON users FOR INSERT TO anon WITH CHECK (true);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### TEST AUTHENTICATION FLOW
```bash
# Test registration (should work)
curl -X POST "http://localhost:8000/api/v1/auth/register" \
-H "Content-Type: application/json" \
-d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"Password123!"}'

# Test login (should work after RLS fix)
curl -X POST "http://localhost:8000/api/v1/auth/login" \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"Password123!"}'
```

## 📂 Complete Project Structure

```
gift_sync/
├── web/                    # Next.js web app ✅
│   ├── src/
│   │   ├── components/     # UI components ✅
│   │   ├── context/        # Auth context ✅  
│   │   ├── hooks/          # Custom hooks ✅
│   │   ├── pages/          # App pages ✅
│   │   ├── styles/         # Tailwind CSS ✅
│   │   ├── config/         # App config ✅
│   │   └── lib/            # API client ✅
├── backend/                # FastAPI backend ✅
│   ├── app/
│   │   ├── api/v1/         # API endpoints ✅
│   │   ├── core/           # Config, database ✅
│   │   ├── models.py       # Pydantic models ✅
│   │   └── main_api.py     # Main API file ✅
│   ├── .env                # Environment config ✅
│   └── venv/               # Python virtual env ✅
├── mobile/                 # Flutter app ✅
├── ml/                     # ML models ✅
│   ├── models/
│   │   ├── base_recommender.py ✅
│   │   ├── collaborative_filtering.py ✅
│   │   ├── content_based.py ✅
│   │   └── hybrid_recommender.py ✅
├── database/               # Database schemas ✅
│   ├── schema.sql          # Complete schema ✅
│   ├── add_password_field.sql ✅
│   └── fix_rls_policies.sql ✅
├── infrastructure/         # AWS/Terraform configs ✅
└── scripts/                # Deployment scripts ✅
```

## 💰 Cost-Effective Deployment Strategy

### CURRENT FREE TIER SETUP
- **Supabase**: Free (500MB database, 1GB storage) ✅
- **Cloudflare Pages**: Free hosting for web app
- **Local Development**: Docker containers (no cloud costs)

### STAGING DEPLOYMENT (FREE)
- **Frontend**: giftsync.jackgriffin.dev (Cloudflare Pages)
- **API**: Same domain with /api proxy
- **Database**: Supabase free tier
- **Total Cost**: $0/month

### PRODUCTION SCALING PATH
- **Supabase Pro**: $25/month (unlimited database)
- **Cloudflare Pro**: $20/month (unlimited builds)
- **Total at Scale**: ~$50-100/month (vs $500+ AWS)

## 🎯 Development Workflow & Standards

### CODE QUALITY STANDARDS
- **Python**: Black + isort + flake8 formatting
- **TypeScript**: Prettier + ESLint
- **Commit Messages**: Conventional commits (no AI mentions)
- **Git**: Feature branches, clean commit history

### USER CONTEXT NOTES
- **Experienced developer**: Expects professional standards
- **Paying customer**: Values quality work and efficiency
- **Commercial project**: £45B market opportunity
- **Industry standards**: No AI tool mentions in commits

### PERFORMANCE REQUIREMENTS
- **API Response Time**: <100ms p95
- **App Load Time**: <2 seconds
- **Recommendation Accuracy**: >75% user satisfaction
- **System Availability**: 99.9% uptime

## 🔮 Business Logic & Revenue Model

### SWIPE SESSION FLOW
1. User starts swipe session (onboarding/discovery)
2. Present category cards with Tinder-style interface
3. Capture swipe direction, timing, and context
4. Process immediately for real-time updates
5. Generate recommendations using hybrid ML model

### REVENUE STREAMS
1. **Affiliate Commissions**: 7.5% average commission rate
2. **Premium Subscriptions**: Advanced features, unlimited swipes
3. **Corporate Gifting**: B2B platform for companies

### SCALING TARGETS
- **Year 1**: 50K users, £125K revenue
- **Year 2**: 200K users, £450K revenue  
- **Year 3**: 750K users, £1.65M revenue (profitability)

## 🔒 Security & Compliance

### GDPR IMPLEMENTATION
- **Privacy by Design**: Pseudonymized user IDs
- **Data Retention**: 90 days for raw data, permanent aggregated
- **User Rights**: Data export, deletion, consent management
- **Encryption**: Data at rest and in transit

### SECURITY MEASURES
- JWT authentication with refresh tokens ✅
- Rate limiting and DDoS protection
- SQL injection prevention
- HTTPS/TLS encryption

## 🧪 Testing Strategy

### MANUAL TESTING CHECKLIST
- [ ] Registration flow works end-to-end
- [ ] Login works after RLS fix
- [ ] Protected routes redirect to login
- [ ] API authentication working
- [ ] Mobile app connects to backend

### AUTOMATED TESTING (TO IMPLEMENT)
- Backend: pytest with coverage requirements
- Frontend: Jest + React Testing Library
- E2E: Playwright for critical user journeys

## 📚 External Service Integrations

### AFFILIATE APIS (REVENUE CRITICAL)
- **Amazon Product Advertising API**: Primary affiliate integration
- **Commission Junction**: Secondary affiliate network
- **eBay Partner Network**: Additional product source

### ANALYTICS & MONITORING
- **PostHog**: User behavior tracking (free tier: 1M events/month)
- **Sentry**: Error monitoring (free tier: 5K errors/month)
- **Mixpanel**: Advanced user analytics (when needed)

### COMMUNICATION SERVICES
- **Resend**: Email delivery (free tier: 3K emails/month)
- **Twilio**: SMS notifications (pay-per-use)

## 🎨 Design System Details

### BRAND COLORS
- **Primary**: #f03dff (Pink/Purple gradient)
- **Secondary**: #0ea5e9 (Blue)
- **Success**: #22c55e
- **Warning**: #f59e0b
- **Error**: #ef4444

### UI FRAMEWORK
- **Font**: Inter (Google Fonts)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 🚨 CRITICAL REMINDERS FOR NEXT SESSION

### IMMEDIATE PRIORITIES (DO FIRST)
1. ✅ **Start servers** (working method documented above)
2. **Fix RLS policies in Supabase** (SQL provided above) 
3. **Test complete auth flow**: Registration + Login
4. **Verify end-to-end functionality**
5. **Complete ML recommendation system integration**

### HIGH PRIORITY NEXT TASKS
1. **Complete ML recommendation system integration**
2. **Add Amazon Product API integration**
3. **Deploy to giftsync.jackgriffin.dev**
4. **Test mobile app connection to backend**

### DEVELOPMENT ENVIRONMENT NOTES
- **Working Directory**: `/home/jack/Documents/gift_sync`
- **Backend Location**: `/home/jack/Documents/gift_sync/backend`
- **Web Location**: `/home/jack/Documents/gift_sync/web`
- **Git Status**: Clean, 29 commits ahead
- **Database**: Supabase PostgreSQL (configured and working)

### SUCCESS CRITERIA FOR NEXT SESSION
- [ ] Login and registration both working perfectly
- [ ] Web app fully functional on port 3000
- [ ] Backend API running and responding on port 8000
- [ ] Complete authentication flow tested
- [ ] Ready to implement ML recommendations

---

**Last Updated**: June 19, 2025 02:00 GMT  
**Next Session Goal**: Complete authentication system and begin ML implementation  
**Current Status**: Backend working, login fix needed, ready for feature development  
**Total Development Time**: ~40 hours invested, core platform 80% complete
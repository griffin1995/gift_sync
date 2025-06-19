# External Services Setup Guide for GiftSync MVP

## AFTER FIXING AUTH ENDPOINTS - SET UP THESE SERVICES

### 1. SUPABASE (Database) - HIGHEST PRIORITY
**URL**: https://supabase.com
**What to do**:
1. Create account and new project
2. Choose region closest to you  
3. **SAVE THESE VALUES**:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: `eyJ...` (from API settings)
   - Service Role Key: `eyJ...` (from API settings)
   - Database URL: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

**Add to `/home/jack/Documents/gift_sync/backend/.env`**:
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key_here
```

**Add to `/home/jack/Documents/gift_sync/web/.env.local`**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. UPSTASH (Redis Cache)
**URL**: https://upstash.com
**What to do**:
1. Create account and new Redis database
2. Choose region closest to you
3. **SAVE**: Redis URL from database details

**Add to both `.env` files**:
```bash
REDIS_URL=redis://your-redis-url-here
```

### 3. DEPLOYMENT (Optional for MVP)
**Frontend**: Vercel (free) - connect GitHub repo
**Backend**: Railway (free $5 credit) - connect GitHub repo

## ENVIRONMENT FILES TO CREATE

### `/home/jack/Documents/gift_sync/backend/.env`
```bash
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key

# Cache  
REDIS_URL=redis://your-redis-url

# Security
SECRET_KEY=your-jwt-secret-key-here
```

### `/home/jack/Documents/gift_sync/web/.env.local`
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## AFTER SETUP - TEST COMMANDS
```bash
# Test backend with real database
cd /home/jack/Documents/gift_sync/backend
source venv/bin/activate
uvicorn app.main_api:app --reload --port 8000

# Test registration with real DB
curl -X POST http://localhost:8000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{"first_name":"Real","last_name":"User","email":"real@example.com","password":"Password123!"}'

# Test web app registration
# Go to http://localhost:3000/auth/register
```

## DATABASE MIGRATION (After Supabase Setup)
```bash
cd /home/jack/Documents/gift_sync/backend
source venv/bin/activate
alembic upgrade head  # Creates database tables
```

## SUCCESS CRITERIA
- ✅ User registration works end-to-end
- ✅ Data persists in Supabase
- ✅ Login works with real database
- ✅ Dashboard shows user data

## COST SUMMARY
- **Supabase**: Free (up to 50MB)
- **Upstash**: Free (10K requests/day) 
- **Vercel**: Free (hobby)
- **Railway**: Free ($5/month credit)
- **Total**: $0 for MVP testing

---
**Order**: 1) Fix auth endpoints, 2) Supabase, 3) Test, 4) Upstash, 5) Deploy
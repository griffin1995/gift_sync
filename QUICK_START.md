# GiftSync Quick Start Guide

## Current Status ✅
- Authentication system: **COMPLETE**
- Web styling: **COMPLETE** 
- API integration: **COMPLETE**
- Git organization: **COMPLETE**

## Start Development Session

### 1. Environment Setup
```bash
# Navigate to project
cd /home/jack/Documents/gift_sync

# Check git status
git status
git log --oneline -5
```

### 2. Start Development Servers
```bash
# Terminal 1: Web Development Server
cd web
npm run dev
# Access at: http://localhost:3000

# Terminal 2: Backend API Server
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
# Access at: http://localhost:8000
```

### 3. Verify Everything Works
```bash
# Test web app
curl -s http://localhost:3000 | head -5

# Test API
curl -s http://localhost:8000/health

# Test authentication pages
curl -s http://localhost:3000/auth/login | head -5
```

## Next Development Options

### Option A: ML Recommendation System (Recommended)
**Goal**: Implement the core AI recommendation engine  
**Time**: 2-3 hours  
**Files to work on**:
- `ml/models/hybrid_recommender.py`
- `backend/app/services/recommendations.py`
- `web/src/pages/discover.tsx`

**Steps**:
1. Implement product similarity algorithms
2. Create user preference learning system  
3. Build hybrid recommendation engine
4. Integrate with swipe interface

### Option B: Product Data Integration
**Goal**: Add real product catalog with Amazon API  
**Time**: 1-2 hours  
**Files to work on**:
- `backend/app/services/products.py`
- `backend/app/integrations/amazon_api.py`
- Database migration for products

**Steps**:
1. Set up Amazon Product Advertising API
2. Create product import system
3. Build product sync pipeline
4. Update web interface with real data

### Option C: Deployment Pipeline
**Goal**: Deploy to production environment  
**Time**: 1-2 hours  
**Files to work on**:
- `.github/workflows/deploy.yml`
- `infrastructure/terraform/`
- Cloudflare configuration

## Current File Structure
```
gift_sync/
├── web/                    # Next.js web app (CURRENT FOCUS)
│   ├── src/
│   │   ├── components/     # UI components ✅
│   │   ├── context/        # Auth context ✅  
│   │   ├── hooks/          # Custom hooks ✅
│   │   ├── pages/          # App pages ✅
│   │   ├── styles/         # Tailwind CSS ✅
│   │   ├── config/         # App config ✅
│   │   └── lib/            # API client ✅
│   ├── package.json        # Dependencies ✅
│   └── next.config.js      # Next.js config ✅
├── backend/                # FastAPI backend ✅
├── mobile/                 # Flutter app ✅
├── ml/                     # ML system (TO IMPLEMENT)
└── infrastructure/         # AWS configs ✅
```

## Testing Commands
```bash
# Manual testing
# 1. Open http://localhost:3000
# 2. Click "Sign In" - should see login form
# 3. Try to access http://localhost:3000/dashboard - should redirect to login
# 4. Register new account - should work end-to-end

# API testing
curl -X POST http://localhost:8000/api/v1/health
curl -X GET http://localhost:8000/docs  # API documentation
```

## Git Workflow
```bash
# Check current status
git status

# Create feature branch (recommended)
git checkout -b feature/ml-recommendations

# Make commits
git add .
git commit -m "feat(ml): implement recommendation engine"

# Return to main when done
git checkout main
git merge feature/ml-recommendations
```

## Environment Variables
- Copy `web/.env.local.example` to `web/.env.local`
- Update values as needed for local development
- Secrets are already configured for development

## Troubleshooting

### Web App Won't Start
```bash
cd web
npm install
npm run dev
```

### Backend Won't Start  
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Authentication Issues
- Check browser console for errors
- Verify API is running on port 8000
- Check network tab for API calls

### Styling Issues
- CSS should be working - if not, restart dev server
- Check globals.css is being imported in _app.tsx

---

**Ready to continue development!** Choose Option A, B, or C based on current priorities.
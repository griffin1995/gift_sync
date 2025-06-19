# GiftSync Development Server Startup Guide

## Quick Start (TL;DR) ✅ TESTED & WORKING

```bash
# 1. Navigate to project root
cd /home/jack/Documents/gift_sync

# 2. Start Backend (runs in background)
cd backend
source venv/bin/activate
nohup python -m uvicorn app.main_api:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &

# 3. Start Frontend (runs in background)
cd ../web
nohup npm run dev > /tmp/frontend.log 2>&1 &

# 4. Wait for both to start (about 5-10 seconds)
sleep 10

# 5. Verify both are running
curl http://localhost:8000/health
curl -I http://localhost:3000

# Expected results:
# Backend: {"status":"healthy","timestamp":"...","version":"1.0.0"}
# Frontend: HTTP/1.1 200 OK
# Both accessible: http://localhost:8000 and http://localhost:3000
```

## Detailed Startup Instructions

### Prerequisites
- Python virtual environment set up in `backend/venv/`
- Node.js dependencies installed in `web/node_modules/`
- Environment variables configured (`.env` files)

### Backend Server (FastAPI - Port 8000)

1. **Navigate to backend directory:**
   ```bash
   cd /home/jack/Documents/gift_sync/backend
   ```

2. **Activate Python virtual environment:**
   ```bash
   source venv/bin/activate
   ```

3. **Start the server (choose one method):**

   **Method A - Background process (recommended for testing):**
   ```bash
   nohup python -m uvicorn app.main_api:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
   ```

   **Method B - Foreground with auto-reload (for development):**
   ```bash
   python -m uvicorn app.main_api:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Verify backend is running:**
   ```bash
   curl http://localhost:8000/health
   # Expected response: {"status":"healthy","timestamp":"...","version":"1.0.0"}
   ```

### Frontend Server (Next.js - Port 3000)

1. **Navigate to web directory:**
   ```bash
   cd /home/jack/Documents/gift_sync/web
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access frontend:**
   - Open browser to: http://localhost:3000
   - Should see GiftSync homepage

## Troubleshooting

### Backend Won't Start
- **Check virtual environment:** Ensure `source venv/bin/activate` was run
- **Check dependencies:** Run `pip install -r requirements.txt` if needed
- **Check environment:** Verify `.env` file exists with Supabase credentials
- **Check logs:** `tail -f /tmp/backend.log` for background process errors

### Frontend Won't Start
- **Check dependencies:** Run `npm install` if node_modules is missing
- **Check environment:** Verify `.env.local` exists with `NEXT_PUBLIC_API_URL=http://localhost:8000`
- **Port conflict:** Ensure port 3000 is available

### Network Errors
- **Backend not responding:** Verify backend is actually running with `curl http://localhost:8000/health`
- **Wrong ports:** Ensure backend on 8000, frontend on 3000
- **CORS issues:** Backend CORS is configured for `*` in development

## Development Workflow

### Starting Both Servers ✅ VERIFIED WORKING METHOD
```bash
# RECOMMENDED: Both servers in background (tested June 2025)
cd /home/jack/Documents/gift_sync/backend
source venv/bin/activate
nohup python -m uvicorn app.main_api:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
cd ../web
nohup npm run dev > /tmp/frontend.log 2>&1 &
sleep 10 && curl http://localhost:8000/health && curl -I http://localhost:3000

# Alternative: Two terminals (if you want to see live logs)
Terminal 1: cd backend && source venv/bin/activate && uvicorn app.main_api:app --reload --port 8000
Terminal 2: cd web && npm run dev
```

### Stopping Servers
```bash
# Stop frontend: Ctrl+C in terminal running npm

# Stop background backend:
pkill -f "uvicorn app.main_api:app"
# Or find process: ps aux | grep uvicorn
# Then kill: kill <PID>
```

## API Testing

### Test Registration
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Test", "last_name": "User", "email": "test@example.com", "password": "TestPassword123", "marketing_consent": false}'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "TestPassword123"}'
```

## Port Configuration

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Backend API | 8000 | http://localhost:8000 | FastAPI server |
| Frontend | 3000 | http://localhost:3000 | Next.js dev server |
| Database | N/A | Supabase Cloud | PostgreSQL (cloud hosted) |

## Environment Files

### Backend `.env`
```bash
SUPABASE_URL=https://xchsarvamppwephulylt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SECRET_KEY=development-secret-key-change-in-production
DEBUG=true
ENVIRONMENT=development
ENABLE_REGISTRATION=true
```

### Frontend `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

## Common Issues & Solutions

1. **"Failed to connect to server"** → Backend not running, start with uvicorn command
2. **"JSON decode error"** → Check JSON syntax in curl commands, avoid special characters
3. **"409 Conflict"** → User already exists, try different email
4. **"Permission denied"** → Check Supabase RLS policies, may need to run SQL fixes
5. **Port already in use** → Kill existing processes with `pkill -f uvicorn` or `pkill -f next`

## Success Indicators

✅ **Backend Working:**
- `curl http://localhost:8000/health` returns JSON with status "healthy"
- Registration/login endpoints respond without network errors

✅ **Frontend Working:**
- http://localhost:3000 loads GiftSync homepage
- Registration form submits without "Network error"
- API calls reach backend successfully

✅ **Full Stack Working:**
- Can register new user through web interface
- Can login with registered credentials
- Protected routes redirect to login when not authenticated
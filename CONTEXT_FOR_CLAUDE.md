# Context for Claude - GiftSync Development

## Session Context
**Project**: GiftSync - AI-powered gift recommendation platform  
**Current Phase**: Web application development with authentication system complete  
**User**: Jack (paying customer, £5 credits)  
**Session Goal**: Continue development work efficiently  

## What We Just Accomplished
1. **Fixed critical CSS styling issues** - Content was appearing in single columns on the right, now properly styled
2. **Resolved configuration errors** - Fixed `config.storage is undefined` error by creating proper config system
3. **Implemented complete authentication system** - JWT tokens, protected routes, auth context, login/register flows
4. **Organized git commits** - Created 9 logical commits with industry-standard messages
5. **Enhanced UI/UX** - Modern styling with Tailwind CSS, responsive design, animations

## Current Technical State
- **Web app**: Fully functional at http://localhost:3000
- **Backend**: Running at http://localhost:8000  
- **Authentication**: Complete and working (login, register, protected routes)
- **Styling**: Modern, responsive design with Tailwind CSS
- **Git**: 24 commits ahead, organized and ready

## User's Development Preferences
- **Commit style**: Industry-standard, no mention of AI tools
- **Code quality**: Professional, production-ready
- **Architecture**: Clean, scalable, well-documented
- **Testing**: Comprehensive, automated where possible

## Next Priority Tasks (from todo list)
1. **Machine Learning recommendation system** (High priority)
2. **Real product data integration (Amazon API)** (High priority)
3. Deploy development environment to Cloudflare (Medium)

## Technical Stack Confirmed Working
- **Frontend**: Next.js 14 + React 18 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + Supabase + PostgreSQL
- **Auth**: JWT tokens with automatic refresh
- **Mobile**: Flutter (separate, already implemented)

## User Context Clues
- Experienced developer who appreciates quality work
- Values proper git organization and commit messages
- Working on a serious commercial project (£45B market opportunity)
- May need to leave session soon, wants to continue seamlessly later
- Paying customer who expects professional development standards

## Development Environment
- **Working directory**: `/home/jack/Documents/gift_sync/web`
- **Node version**: 18+
- **Python**: 3.9+ with virtual environment
- **Database**: Supabase (cloud PostgreSQL)
- **Local servers**: Both web and backend running smoothly

## Key Files Recently Modified
- `web/src/styles/globals.css` - Complete styling system
- `web/src/config/index.ts` - Application configuration
- `web/src/context/AuthContext.tsx` - Authentication system
- `web/src/lib/api.ts` - API client with token management
- `web/src/pages/_app.tsx` - App-wide auth integration

## What NOT to Do
- Don't mention AI assistance or Claude in commits
- Don't break existing functionality
- Don't create unnecessary files
- Don't ignore the established patterns
- Don't make assumptions about what the user wants

## What TO Do
- Continue building the next high-priority features
- Maintain the same code quality standards
- Follow the established architecture patterns
- Use the todo list to track progress
- Make logical, well-organized git commits
- Focus on practical, working solutions

## Current Session Status
User may need to leave soon and wants to return with optimal context. All major systems are working, ready for next development phase.

## Quick Reference Commands
```bash
# Start development
cd /home/jack/Documents/gift_sync/web && npm run dev

# Backend
cd /home/jack/Documents/gift_sync/backend && source venv/bin/activate && uvicorn app.main:app --reload

# Git status
git status && git log --oneline -5

# Test endpoints
curl http://localhost:3000/auth/login
curl http://localhost:8000/health
```
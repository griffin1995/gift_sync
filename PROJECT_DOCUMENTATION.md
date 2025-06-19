# GiftSync - AI-Powered Gift Recommendation Platform

## Project Overview

GiftSync is a modern web application that uses AI to provide personalized gift recommendations. Users can swipe through products (similar to Tinder), train the AI to understand their preferences, and receive tailored gift suggestions. The platform includes features for creating shareable gift links, tracking preferences, and managing gift-giving activities.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with Supabase
- **Authentication**: JWT tokens
- **Analytics**: Custom event tracking
- **Row Level Security**: Supabase RLS policies

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Git**: Version control with conventional commits

## Project Structure

```
gift_sync/
├── web/                           # Frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── auth/            # Authentication components
│   │   │   └── ui/              # General UI components
│   │   ├── context/             # React context providers
│   │   ├── lib/                 # Utility libraries and API client
│   │   ├── pages/               # Next.js pages and routes
│   │   │   ├── auth/           # Authentication pages
│   │   │   └── dashboard/      # Dashboard pages
│   │   ├── styles/             # Global styles
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   └── package.json           # Dependencies and scripts
├── backend/                    # Backend application
│   └── app/
│       ├── main_api.py        # FastAPI application and routes
│       └── database.py        # Database connection and queries
└── database/                  # Database migrations and scripts
    ├── add_password_field.sql
    └── fix_rls_policies.sql
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database (Supabase recommended)

### Environment Variables
Create `.env.local` in the web directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

### Starting Development Servers

#### Backend Server
```bash
cd backend
python -m uvicorn app.main_api:app --reload --host 0.0.0.0 --port 8000
```
- Runs on: http://localhost:8000
- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs

#### Frontend Server  
```bash
cd web
npm install
npm run dev
```
- Runs on: http://localhost:3000
- Supports hot module replacement

### Quick Testing
1. Start both servers
2. Navigate to http://localhost:3000
3. Register a new account or login with existing credentials
4. Access dashboard at http://localhost:3000/dashboard

## Authentication System

### Architecture
- **JWT-based authentication** with access and refresh tokens
- **AuthContext** manages global authentication state
- **AuthGuard** component protects routes and handles redirects
- **Token management** with automatic storage and retrieval

### Key Components

#### AuthContext (`src/context/AuthContext.tsx`)
- Manages authentication state across the application
- Handles login, logout, and token refresh
- Provides authentication status to all components
- Includes error handling for corrupted localStorage data

#### AuthGuard (`src/components/auth/AuthGuard.tsx`)  
- Protects routes based on authentication status
- Redirects unauthenticated users from protected routes
- Redirects authenticated users away from auth pages
- Prevents redirects during logout process

#### Token Manager (`src/lib/api.ts`)
- Stores and retrieves JWT tokens from localStorage
- Provides token access for API requests
- Handles token clearing during logout

### Authentication Flow
1. User submits login credentials
2. Backend validates and returns JWT tokens + user data
3. Frontend stores tokens in localStorage and user data in AuthContext
4. AuthGuard allows access to protected routes
5. API requests automatically include authentication headers

### Route Protection
- **Protected routes**: `/dashboard/*`, `/profile`, `/settings`, `/discover`
- **Auth routes**: `/auth/login`, `/auth/register`, `/auth/forgot-password`
- **Public routes**: `/`, `/about`, `/contact`, `/privacy`, `/terms`, `/pricing`

## API Integration

### API Client (`src/lib/api.ts`)
Centralized HTTP client with:
- Automatic token attachment
- Response/error handling
- Token refresh logic
- Convenient method exports

### Key API Endpoints
- **Authentication**: `/api/v1/auth/login`, `/api/v1/auth/logout`, `/api/v1/auth/me`
- **Users**: `/api/v1/users/me`, `/api/v1/users/me/statistics`
- **Recommendations**: `/api/v1/recommendations` (405 - not implemented)
- **Gift Links**: `/api/v1/gift-links` (405 - not implemented)
- **Analytics**: `/api/v1/analytics/track`

### Error Handling
- Graceful degradation for missing endpoints (405/404 errors)
- Dashboard loads with default values when optional data fails
- User-friendly error messages with toast notifications

## Database Configuration

### Supabase Setup
- PostgreSQL database with Row Level Security (RLS)
- Service key bypass for legitimate backend operations
- User authentication and data storage

### Key Database Issues Resolved
- **RLS Policy Problems**: Added `use_service_key` parameter to bypass RLS for service operations
- **Authentication Failures**: Service operations no longer blocked by user-level security policies

### Database Scripts
- `add_password_field.sql`: Adds password field to users table
- `fix_rls_policies.sql`: Updates RLS policies for proper service access

## Frontend Features

### Pages
- **Homepage** (`/`): Landing page with feature overview and authentication-aware navigation
- **Authentication** (`/auth/*`): Login, registration, and password reset flows
- **Dashboard** (`/dashboard`): Main user interface with statistics, recommendations, and gift links

### Key Components
- **Responsive design** with mobile-first approach
- **Animation system** using Framer Motion for smooth transitions
- **Form validation** with React Hook Form and Zod schemas
- **Toast notifications** for user feedback
- **Loading states** and error boundaries

### Dashboard Features
- User profile display with subscription tier
- Statistics cards (swipes, recommendations, savings)
- Quick action buttons for key features
- Recent recommendations and gift links display
- Activity summary and favorite categories

## Known Issues and Limitations

### Backend API Endpoints
- **Recommendations endpoint**: Returns 405 Method Not Allowed
- **Gift links endpoint**: Returns 405 Method Not Allowed  
- **User statistics endpoint**: Returns 404 Not Found

These endpoints are referenced in the frontend but not yet implemented in the backend. The frontend handles these gracefully with:
- Default empty arrays for recommendations and gift links
- Default zero values for statistics
- Warning logs instead of error crashes

### Authentication Flow
- **Logout redirect**: Brief flash of login page before redirect to homepage (race condition)
- **Token persistence**: Occasionally requires re-login due to localStorage timing

### UI/UX
- **Missing images**: Several referenced images return 404 (hero-bg.webp, favicons)
- **Dead links**: Some navigation links lead to unimplemented pages

## Development Best Practices

### Code Organization
- **Atomic commits** with conventional commit messages
- **Component separation** with clear responsibilities
- **Error boundaries** and graceful error handling
- **TypeScript** for type safety throughout

### Security Considerations
- **No sensitive data** in localStorage beyond necessary tokens
- **Proper token management** with automatic cleanup
- **Input validation** on both client and server
- **RLS policies** for database security

### Performance
- **Lazy loading** for non-critical components
- **Image optimization** through Next.js Image component
- **Bundle optimization** with Next.js built-in features
- **Error recovery** without full page reloads

## Testing and Quality Assurance

### Manual Testing Checklist
- [ ] User registration flow
- [ ] User login/logout flow
- [ ] Dashboard access and data loading
- [ ] Navigation between pages
- [ ] Error handling for failed API calls
- [ ] Responsive design on different screen sizes
- [ ] Token persistence across browser sessions

### Automated Testing
- API client has test suite structure in place
- Frontend components ready for unit testing
- E2E testing framework can be added

## Deployment Considerations

### Frontend Deployment
- Next.js application ready for deployment on Vercel, Netlify, or similar
- Environment variables must be configured for production
- Build optimization enabled by default

### Backend Deployment
- FastAPI application suitable for deployment on cloud platforms
- Database connection must be configured for production environment
- CORS settings need adjustment for production domains

### Environment Configuration
- Separate development, staging, and production configurations
- API URLs and database connections configurable via environment variables
- Secure token storage and transmission

## Future Development

### Immediate Priorities
1. Implement missing backend API endpoints (recommendations, gift links, statistics)
2. Fix logout redirect race condition
3. Add missing image assets
4. Implement error boundaries for better error recovery

### Feature Enhancements
1. **Swipe Interface**: Tinder-like product swiping for preference training
2. **AI Recommendations**: Machine learning integration for personalized suggestions
3. **Social Features**: Friend connections and shared wishlists
4. **Advanced Analytics**: Detailed user behavior tracking and insights
5. **Mobile App**: React Native or native mobile applications

### Technical Improvements
1. **Testing Suite**: Comprehensive unit and integration tests
2. **Performance Monitoring**: Error tracking and performance analytics
3. **Accessibility**: WCAG compliance and screen reader support
4. **Internationalization**: Multi-language support
5. **PWA Features**: Offline support and push notifications

## API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/login
POST /api/v1/auth/register  
POST /api/v1/auth/logout
GET  /api/v1/auth/me
POST /api/v1/auth/refresh
```

### User Management
```
GET  /api/v1/users/me
PUT  /api/v1/users/me
GET  /api/v1/users/me/preferences
PUT  /api/v1/users/me/preferences
GET  /api/v1/users/me/statistics
```

### Analytics
```
POST /api/v1/analytics/track
```

### Health Check
```
GET  /health
```

## Configuration Reference

### Frontend Configuration (`src/config/index.ts`)
- API endpoints and URLs
- Application settings and feature flags
- Validation rules and constraints
- Storage keys and cache settings
- UI configuration (animations, colors, breakpoints)

### Error Messages
- Standardized error handling with user-friendly messages
- Network error handling with retry suggestions
- Authentication error handling with appropriate redirects

## Troubleshooting

### Common Issues

#### "Network error: Unable to connect to server"
- Ensure backend server is running on port 8000
- Check NEXT_PUBLIC_API_URL environment variable
- Verify CORS settings in backend

#### "Failed to load user data"  
- Check authentication token validity
- Verify /api/v1/auth/me endpoint is responding
- Clear localStorage and re-login if persistent

#### Dashboard shows empty state
- Normal behavior when backend endpoints return 405/404
- Check browser console for specific error details
- Verify user authentication is working correctly

#### Logout redirects to login briefly
- Known race condition issue
- Functional but not optimal user experience
- No data persistence issues

### Development Server Issues
- Ensure no port conflicts (3000 for frontend, 8000 for backend)
- Clear npm cache if build issues occur: `npm cache clean --force`
- Restart development servers if hot reload stops working

This documentation provides a comprehensive overview of the GiftSync project, its current state, known issues, and future development directions. The authentication system is fully functional, and the application is ready for continued development and deployment.
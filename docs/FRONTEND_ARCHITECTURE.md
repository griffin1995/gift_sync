# GiftSync Frontend Architecture

## Overview

The GiftSync frontend is a modern React application built with Next.js 14, TypeScript, and Tailwind CSS. It provides a responsive, high-performance user interface for the AI-powered gift recommendation platform.

## Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **React 18**: Component library with concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework

### State Management
- **React Context**: Global state management
- **useReducer**: Predictable state updates
- **localStorage**: Client-side persistence
- **React Query**: Server state management (future)

### Authentication
- **JWT Tokens**: Secure authentication
- **Token Manager**: Automatic refresh logic
- **Protected Routes**: Route guards and redirects
- **Session Persistence**: Login state across browser sessions

### Analytics & Tracking
- **PostHog**: User behavior analytics
- **Feature Flags**: A/B testing and gradual rollouts
- **Event Tracking**: Custom business events
- **Error Monitoring**: Sentry integration

### Affiliate Revenue
- **Amazon Associates**: Affiliate link generation
- **Click Tracking**: Revenue attribution
- **Conversion Analytics**: Performance metrics
- **Commission Calculations**: Revenue reporting

## Project Structure

```
web/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Shared components
│   │   ├── swipe/        # Swipe interface components
│   │   └── ui/           # Base UI elements
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Next.js pages
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   └── config/           # Configuration files
├── docs/                 # Documentation
└── ...config files
```

## Key Components

### Authentication System

#### AuthContext (`/src/context/AuthContext.tsx`)
Centralised authentication state management providing:
- User login/logout functionality
- JWT token management with automatic refresh
- Protected route guards
- User session persistence
- PostHog user identification

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

#### TokenManager (`/src/lib/api.ts`)
Secure token storage and management:
- Access token storage in memory
- Refresh token persistence in localStorage
- Automatic token refresh on expiry
- Request interceptors for authentication

### Product Discovery

#### WorkingSwipeInterface (`/src/components/swipe/WorkingSwipeInterface.tsx`)
Production-ready swipe interface for product discovery:
- Tinder-style swipe gestures
- Real Amazon product integration
- Session progress tracking
- Responsive design with critical CSS requirements
- Fallback to mock data for reliability

Key CSS Requirements:
- Main container: `min-h-96` (prevents flex-1 collapse)
- Product cards: `absolute inset-4` positioning
- Dependency-minimal implementation

### API Integration

#### API Client (`/src/lib/api.ts`)
Comprehensive HTTP client providing:
- Axios-based request handling
- Automatic authentication headers
- Request/response interceptors
- Error handling and retry logic
- Type-safe API calls

```typescript
// Usage examples
const products = await api.getProducts({ limit: 10 });
const user = await api.getCurrentUser();
await api.login(credentials);
```

### Analytics System

#### Analytics Service (`/src/lib/analytics.ts`)
PostHog integration for user behavior tracking:
- Event tracking with custom properties
- User identification and segmentation
- Feature flag management
- Privacy compliance (GDPR)
- Error handling and retry logic

```typescript
// Track user events
trackEvent('product_swiped', {
  direction: 'right',
  product_id: '123',
  category: 'Electronics'
});

// Feature flags
if (analytics.isFeatureEnabled('new_recommendation_engine')) {
  // Show new features
}
```

### Affiliate Revenue

#### Affiliate Service (`/src/lib/affiliate.ts`)
Amazon Associates integration for revenue generation:
- Affiliate link generation with tracking
- Click and conversion tracking
- Revenue analytics and reporting
- Commission rate calculations
- Performance metrics by category/source

```typescript
// Generate affiliate links
const affiliateUrl = generateAffiliateLink(productUrl, {
  campaign: 'product_recommendation',
  source: 'swipe_interface'
});

// Track clicks
await trackAffiliateClick({
  productId: 'prod_123',
  affiliateUrl,
  source: 'recommendation'
});
```

## Configuration Management

### Application Config (`/src/config/index.ts`)
Centralized configuration management:
- Environment-specific settings
- API endpoint definitions
- Feature flags and toggles
- Business logic constants
- Amazon Associates configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_POSTHOG_KEY`: Analytics key
- `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG`: Affiliate tag

## Routing Architecture

### Page Structure
```
pages/
├── index.tsx              # Homepage/landing
├── discover.tsx           # Product discovery interface
├── dashboard.tsx          # User dashboard
├── auth/
│   ├── login.tsx         # User login
│   └── register.tsx      # User registration
└── api/                  # API routes (proxy)
```

### Route Protection
Protected routes automatically redirect unauthenticated users:
```typescript
const { isAuthenticated } = useRequireAuth('/auth/login');
```

## State Management Patterns

### Authentication State
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}
```

### State Updates
Using useReducer for predictable state management:
```typescript
dispatch({ type: 'SET_USER', payload: userData });
dispatch({ type: 'SET_LOADING', payload: false });
dispatch({ type: 'SET_ERROR', payload: errorMessage });
```

## Performance Optimizations

### Next.js Features
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Automatic bundle optimization
- **Static Generation**: Pre-rendered pages where possible
- **Incremental Static Regeneration**: Updated static content

### React Optimizations
- **React.memo**: Component memoization
- **useMemo/useCallback**: Expensive calculation caching
- **Lazy Loading**: Dynamic imports for large components
- **Suspense Boundaries**: Graceful loading states

### Bundle Optimization
- **Tree Shaking**: Remove unused code
- **SWC Compiler**: Faster builds and smaller bundles
- **Console Removal**: Production console.log removal
- **Image Optimization**: Multiple format support

## Security Features

### Authentication Security
- JWT tokens with short expiry (30 minutes)
- Secure token storage (memory + httpOnly cookies future)
- Automatic logout on token expiry
- CSRF protection

### Content Security
- XSS protection headers
- Content type validation
- Trusted host middleware
- CORS configuration

### Privacy Compliance
- GDPR-compliant analytics
- User consent management
- Data opt-out functionality
- Cookie policy compliance

## Development Workflow

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Testing Strategy
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API integration testing
- **E2E Tests**: User journey testing with Cypress
- **Visual Testing**: Component visual regression

### Build Process
```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Linting and formatting
npm run lint
npm run format
```

## Deployment Architecture

### Vercel Deployment
- Automatic deployments from git
- Preview deployments for PRs
- Edge function support
- Global CDN distribution

### Alternative Deployments
- **Static Export**: S3 + CloudFront
- **Docker**: Containerized deployment
- **Traditional Hosting**: Node.js server

### Environment Configuration
```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [/* Amazon CDN, S3 buckets */]
  },
  headers: async () => [/* Security headers */],
  redirects: async () => [/* URL redirects */]
};
```

## Error Handling

### Error Boundaries
React error boundaries catch and handle component errors:
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### API Error Handling
Consistent error handling across API calls:
```typescript
try {
  const data = await api.call();
} catch (error) {
  if (error.status === 401) {
    // Handle authentication error
  }
  // Log error to Sentry
  throw error;
}
```

### User Experience
- Graceful degradation for failed features
- Loading states for async operations
- User-friendly error messages
- Retry mechanisms for transient failures

## Accessibility

### WCAG Compliance
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance

### Screen Reader Support
- Descriptive alt text for images
- Form labels and validation
- Focus management
- Announced state changes

## Analytics & Monitoring

### User Behavior Tracking
- Page views and navigation
- Button clicks and interactions
- Form submissions and errors
- Product swipe actions

### Performance Monitoring
- Core Web Vitals tracking
- API response times
- Error rates and types
- User session analytics

### Business Metrics
- Conversion rates
- Affiliate click-through rates
- User engagement metrics
- Revenue attribution

## Future Enhancements

### Planned Features
- **PWA Support**: Service workers and offline functionality
- **Real-time Updates**: WebSocket integration
- **Advanced Caching**: React Query implementation
- **Micro-frontends**: Component federation

### Performance Improvements
- **Edge Computing**: Vercel Edge Functions
- **Database Optimization**: Connection pooling
- **CDN Enhancement**: Asset optimization
- **Bundle Analysis**: Size monitoring

### User Experience
- **Voice Search**: Speech recognition
- **AR Features**: Product visualization
- **Personalization**: AI-driven UI adaptation
- **Accessibility**: Enhanced screen reader support
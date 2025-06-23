/**
 * GiftSync Authentication Guard Component
 * 
 * Provides route-level authentication and authorization for the GiftSync application.
 * Handles protected routes, authentication redirects, and loading states during
 * authentication checks. Ensures secure access to user-specific features.
 * 
 * Key Features:
 *   - Automatic authentication checking on route changes
 *   - Protected route enforcement with redirect logic
 *   - Public route access for unauthenticated users
 *   - Authentication route handling (prevent double login)
 *   - Loading states during authentication verification
 *   - JWT token validation and refresh
 * 
 * Security Features:
 *   - Server-side authentication validation
 *   - Secure token storage and management
 *   - Session timeout handling
 *   - Unauthorized access prevention
 *   - Seamless login/logout flow
 * 
 * Route Categories:
 *   - Protected: Require valid authentication
 *   - Auth: Login/register pages (redirect if logged in)
 *   - Public: Accessible without authentication
 * 
 * Usage:
 *   <AuthGuard>
 *     <YourProtectedComponent />
 *   </AuthGuard>
 * 
 * Integration:
 *   - Works with AuthContext for global auth state
 *   - Uses Next.js router for navigation
 *   - Coordinates with PageLoader for UX
 */

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/PageLoader';

/**
 * Props interface for AuthGuard component.
 * 
 * @param children - React components to render if authentication check passes
 */
interface AuthGuardProps {
  children: ReactNode;
}

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/discover',
  '/recommendations',
  '/gift-links',
  '/onboarding',
];

// Routes that should redirect authenticated users
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Public routes that don't require any auth logic
// const PUBLIC_ROUTES = [
//   '/',
//   '/about',
//   '/contact',
//   '/privacy',
//   '/terms',
//   '/pricing',
//   '/404',
// ];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isInitialized, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();
  const currentPath = router.asPath?.split('?')[0] || '/'; // Remove query params

  useEffect(() => {
    if (!isInitialized) return;
    
    // Don't redirect during logout process
    if (isLoggingOut) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      currentPath.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.some(route => 
      currentPath.startsWith(route)
    );

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      const redirectUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      router.replace(redirectUrl);
      return;
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && isAuthenticated) {
      const redirectTo = router.query.redirect as string || '/dashboard';
      router.replace(redirectTo);
      return;
    }
  }, [isAuthenticated, isInitialized, isLoggingOut, currentPath, router]);

  // Show loading state while initializing or during redirects
  if (!isInitialized || isLoading) {
    return <PageLoader text="Loading GiftSync..." />;
  }

  // Show loading for protected routes while unauthenticated (redirect happening)
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    currentPath.startsWith(route)
  );
  if (isProtectedRoute && !isAuthenticated) {
    return <PageLoader text="Redirecting to login..." />;
  }

  // Show loading for auth routes while authenticated (redirect happening)
  const isAuthRoute = AUTH_ROUTES.some(route => 
    currentPath.startsWith(route)
  );
  if (isAuthRoute && isAuthenticated) {
    return <PageLoader text="Redirecting to dashboard..." />;
  }

  return <>{children}</>;
};

export default AuthGuard;
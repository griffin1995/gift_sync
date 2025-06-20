import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/PageLoader';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth/login',
  fallback,
  requireAuth = true,
}) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state while initializing
  if (!isInitialized || isLoading) {
    return fallback || <PageLoader text="Checking authentication..." />;
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with the specified redirect path
    const currentPath = router.asPath;
    const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
    router.replace(loginUrl);
    return <PageLoader text="Redirecting to login..." />;
  }

  // If user is authenticated but shouldn't be (e.g., login page)
  if (!requireAuth && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    router.replace('/dashboard');
    return <PageLoader text="Redirecting to dashboard..." />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
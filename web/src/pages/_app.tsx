import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { PWAManager } from '@/components/pwa/PWAManager';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  // Initialize mobile optimizations
  const mobileOptimizations = useMobileOptimizations();

  useEffect(() => {
    // Add custom cursor for better UX
    document.body.style.cursor = 'default';
    
    // Add scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Mobile-specific optimizations
    if (mobileOptimizations.isMobile) {
      // Disable pull-to-refresh on mobile
      document.body.style.overscrollBehavior = 'none';
      
      // Prevent text selection on mobile for better touch experience
      document.body.style.webkitUserSelect = 'none';
      document.body.style.userSelect = 'none';
      
      // Enable hardware acceleration
      document.body.style.transform = 'translateZ(0)';
    }
  }, [mobileOptimizations.isMobile]);

  return (
    <PostHogProvider>
      <ThemeProvider>
        <AuthProvider>
          <AuthGuard>
            <Component {...pageProps} />
            <PWAManager />
          </AuthGuard>
          <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
          />
        </AuthProvider>
      </ThemeProvider>
    </PostHogProvider>
  );
}
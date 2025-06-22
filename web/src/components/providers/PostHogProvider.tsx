import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { analytics, trackPageView } from '@/lib/analytics';

interface PostHogProviderProps {
  children: React.ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const router = useRouter();

  useEffect(() => {
    // Temporarily disable PostHog in production to avoid CORS issues
    if (process.env.NODE_ENV === 'production') {
      console.log('[PostHog Provider] Disabled in production to avoid CORS issues');
      return;
    }
    
    // Initialize PostHog
    analytics.init();

    // Track page views on route changes
    const handleRouteChange = (url: string) => {
      console.log('[PostHog Provider] Route change detected:', url);
      
      // Track pageview with proper properties
      analytics.track('$pageview', {
        $current_url: `${window.location.origin}${url}`,
        $pathname: url,
        $host: window.location.host,
        $referrer: document.referrer,
        page_title: document.title,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Track initial page view
    if (router.isReady) {
      console.log('[PostHog Provider] Initial page view:', router.asPath);
      
      // Initial pageview
      analytics.track('$pageview', {
        $current_url: window.location.href,
        $pathname: router.asPath,
        $host: window.location.host,
        $referrer: document.referrer,
        page_title: document.title,
        initial_page: true,
      });
    }

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.isReady, router.asPath]);

  return <>{children}</>;
}

export default PostHogProvider;
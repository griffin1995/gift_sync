import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { analytics, trackPageView } from '@/lib/analytics';

interface PostHogProviderProps {
  children: React.ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const router = useRouter();

  useEffect(() => {
    // Initialize PostHog
    analytics.init();

    // Track page views on route changes
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Track initial page view
    if (router.isReady) {
      trackPageView(router.asPath);
    }

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.isReady, router.asPath]);

  return <>{children}</>;
}

export default PostHogProvider;
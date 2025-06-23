/**
 * GiftSync PostHog Analytics Provider
 * 
 * Provides application-wide analytics tracking using PostHog for user behavior
 * analysis, feature usage monitoring, and business intelligence. Handles automatic
 * page view tracking, user identification, and custom event collection.
 * 
 * Key Features:
 *   - Automatic page view tracking on route changes
 *   - User identification and session management
 *   - Custom event tracking for business metrics
 *   - Feature flag integration for A/B testing
 *   - Privacy-compliant data collection
 *   - Development/production environment handling
 * 
 * Business Intelligence:
 *   - User journey and funnel analysis
 *   - Feature adoption and usage patterns
 *   - Conversion rate optimization
 *   - A/B test performance tracking
 *   - Revenue attribution and cohort analysis
 * 
 * Privacy Features:
 *   - GDPR-compliant data collection
 *   - User consent management
 *   - Data anonymization options
 *   - Opt-out functionality
 *   - Secure data transmission
 * 
 * Integration Points:
 *   - Authentication: User identification
 *   - E-commerce: Purchase and revenue tracking
 *   - Feature flags: A/B testing and rollouts
 *   - Error tracking: Performance monitoring
 * 
 * Usage:
 *   <PostHogProvider>
 *     <App />
 *   </PostHogProvider>
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { analytics, trackPageView } from '@/lib/analytics';

/**
 * Props interface for PostHogProvider component.
 * 
 * @param children - React components to wrap with analytics tracking
 */
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
import posthog from 'posthog-js';
import { config } from '@/config';

// PostHog Analytics Service
class AnalyticsService {
  private initialized = false;

  init() {
    if (typeof window !== 'undefined' && !this.initialized && config.posthogKey) {
      posthog.init(config.posthogKey, {
        api_host: config.posthogHost || 'https://app.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        debug: config.isDevelopment,
        autocapture: {
          dom_event_allowlist: ['click', 'change', 'submit'],
        },
        session_recording: {
          recordCrossOriginIframes: false,
        },
        disable_session_recording: !config.isProduction,
      });
      
      this.initialized = true;
    }
  }

  // Identify user
  identify(userId: string, properties?: Record<string, any>) {
    if (this.initialized) {
      posthog.identify(userId, properties);
    }
  }

  // Track events
  track(eventName: string, properties?: Record<string, any>) {
    if (this.initialized) {
      posthog.capture(eventName, properties);
    }
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (this.initialized) {
      posthog.people.set(properties);
    }
  }

  // Track page views
  trackPageView(path?: string) {
    if (this.initialized) {
      posthog.capture('$pageview', {
        $current_url: path || window.location.href,
      });
    }
  }

  // Reset user (for logout)
  reset() {
    if (this.initialized) {
      posthog.reset();
    }
  }

  // Group analytics (for organizations/teams)
  group(groupType: string, groupKey: string, properties?: Record<string, any>) {
    if (this.initialized) {
      posthog.group(groupType, groupKey, properties);
    }
  }

  // Feature flags
  isFeatureEnabled(flag: string): boolean {
    if (this.initialized) {
      return posthog.isFeatureEnabled(flag) === true;
    }
    return false;
  }

  // Get feature flag value
  getFeatureFlag(flag: string): string | boolean | undefined {
    if (this.initialized) {
      return posthog.getFeatureFlag(flag);
    }
    return undefined;
  }

  // Opt out/in
  optOut() {
    if (this.initialized) {
      posthog.opt_out_capturing();
    }
  }

  optIn() {
    if (this.initialized) {
      posthog.opt_in_capturing();
    }
  }

  // Check if opted out
  hasOptedOut(): boolean {
    if (this.initialized) {
      return posthog.has_opted_out_capturing();
    }
    return false;
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Convenience functions for common events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  analytics.track(eventName, properties);
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  analytics.identify(userId, properties);
};

export const trackPageView = (path?: string) => {
  analytics.trackPageView(path);
};

export default analytics;
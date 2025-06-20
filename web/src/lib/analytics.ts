import posthog from 'posthog-js';
import { config } from '@/config';
import { createPostHogConfig, validateEvent, getCommonEventProperties } from './posthog-config';

// PostHog Analytics Service
class AnalyticsService {
  private initialized = false;
  private retryCount = 0;
  private maxRetries = 3;

  async init() {
    if (typeof window === 'undefined' || this.initialized || !config.posthogKey) {
      return;
    }

    try {
      const posthogConfig = createPostHogConfig();
      
      console.log('[PostHog] Initializing analytics service...', {
        key: config.posthogKey?.substring(0, 10) + '...',
        host: posthogConfig.api_host,
        debug: posthogConfig.debug,
      });

      posthog.init(config.posthogKey, posthogConfig);
      
      this.initialized = true;
      this.retryCount = 0;

      // Test connectivity
      await this.testConnection();
      
    } catch (error) {
      console.error('[PostHog] Initialization failed:', error);
      
      // Retry initialization
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`[PostHog] Retrying initialization (${this.retryCount}/${this.maxRetries})...`);
        setTimeout(() => this.init(), 1000 * this.retryCount);
      }
    }
  }

  private async testConnection(): Promise<void> {
    if (!this.initialized) return;

    try {
      // Send a test event to verify connectivity
      this.track('analytics_service_initialized', {
        ...getCommonEventProperties(),
        initialization_time: Date.now(),
        retry_count: this.retryCount,
      });
      
      console.log('[PostHog] Connection test successful');
    } catch (error) {
      console.warn('[PostHog] Connection test failed:', error);
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
    if (!this.initialized) {
      console.warn('[PostHog] Analytics not initialized, queueing event:', eventName);
      return;
    }

    if (!validateEvent(eventName, properties)) {
      return;
    }

    try {
      const enrichedProperties = {
        ...getCommonEventProperties(),
        ...properties,
      };

      console.log('[PostHog] Tracking event:', eventName, enrichedProperties);
      posthog.capture(eventName, enrichedProperties);
    } catch (error) {
      console.error('[PostHog] Failed to track event:', eventName, error);
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
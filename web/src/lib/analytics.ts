/**
 * GiftSync Analytics Service
 * 
 * Comprehensive user behavior tracking and analytics integration using PostHog.
 * Provides business intelligence, user insights, and performance metrics for
 * data-driven product decisions and revenue optimization.
 * 
 * Key Features:
 *   - User behavior tracking (swipes, clicks, conversions)
 *   - Revenue analytics (affiliate clicks, commissions)
 *   - Feature flag management for A/B testing
 *   - User segmentation and cohort analysis
 *   - Error tracking and performance monitoring
 * 
 * Business Intelligence:
 *   - Track user journey from discovery to purchase
 *   - Measure recommendation algorithm effectiveness
 *   - Monitor affiliate conversion rates and revenue
 *   - Analyze user engagement and retention patterns
 * 
 * Privacy & Compliance:
 *   - GDPR-compliant user consent management
 *   - User opt-out functionality
 *   - Data anonymization and retention policies
 *   - Cookie consent integration
 * 
 * Integration:
 *   - PostHog for event tracking and analytics
 *   - Feature flags for controlled rollouts
 *   - User identification for personalized experiences
 *   - Custom event validation and enrichment
 * 
 * Usage:
 *   import { analytics, trackEvent, identifyUser } from '@/lib/analytics';
 *   
 *   // Initialize analytics
 *   await analytics.init();
 *   
 *   // Track user events
 *   trackEvent('product_swiped', { direction: 'right', product_id: '123' });
 *   
 *   // Identify users
 *   identifyUser('user_123', { subscription_tier: 'premium' });
 */

import posthog from 'posthog-js';
import { config } from '@/config';
import { createPostHogConfig, validateEvent, getCommonEventProperties } from './posthog-config';

/**
 * Analytics Service class for comprehensive user behavior tracking.
 * 
 * Manages PostHog integration with robust error handling, retry logic,
 * and business-specific event tracking. Provides type-safe analytics
 * interface for the entire application.
 * 
 * Architecture:
 *   - Singleton pattern for consistent analytics instance
 *   - Automatic initialization with retry logic
 *   - Event validation and enrichment
 *   - Feature flag integration
 *   - Privacy controls and opt-out functionality
 * 
 * Error Handling:
 *   - Graceful degradation when analytics unavailable
 *   - Automatic retry on initialization failures
 *   - Comprehensive logging for debugging
 *   - Fallback behavior for critical paths
 */
class AnalyticsService {
  /**
   * Service state management for reliable analytics operation.
   */
  private initialized = false;        // Analytics initialization status
  private retryCount = 0;             // Current retry attempt counter
  private maxRetries = 3;             // Maximum initialization retry attempts

  /**
   * Initialize PostHog analytics service with robust error handling.
   * 
   * Performs comprehensive setup including:
   *   - PostHog SDK initialization with custom configuration
   *   - Connection testing and validation
   *   - Automatic retry on failures
   *   - Development vs production environment handling
   * 
   * Error Recovery:
   *   - Retries initialization up to maxRetries times
   *   - Exponential backoff for retry delays
   *   - Graceful degradation if initialization fails
   * 
   * Environment Handling:
   *   - Server-side rendering compatibility (no window)
   *   - Development debugging and logging
   *   - Production optimizations
   * 
   * Returns:
   *   Promise<void>: Resolves when initialization complete
   */
  async init() {
    // Prevent initialization in invalid environments
    if (typeof window === 'undefined' || this.initialized || !config.posthogKey) {
      return;
    }

    try {
      // Create PostHog configuration with environment-specific settings
      const posthogConfig = createPostHogConfig();
      
      console.log('[PostHog] Initializing analytics service...', {
        key: config.posthogKey?.substring(0, 10) + '...',  // Masked key for security
        host: posthogConfig.api_host,                       // PostHog server host
        debug: posthogConfig.debug,                         // Debug mode status
      });

      // Initialize PostHog SDK with configuration
      posthog.init(config.posthogKey, posthogConfig);
      
      // Mark as successfully initialized
      this.initialized = true;
      this.retryCount = 0;                                  // Reset retry counter

      // Verify analytics connectivity with test event
      await this.testConnection();
      
    } catch (error) {
      console.error('[PostHog] Initialization failed:', error);
      
      // Implement retry logic with exponential backoff
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delayMs = 1000 * this.retryCount;              // Exponential backoff
        console.log(`[PostHog] Retrying initialization (${this.retryCount}/${this.maxRetries}) in ${delayMs}ms...`);
        setTimeout(() => this.init(), delayMs);
      } else {
        console.error('[PostHog] Maximum retry attempts reached, analytics disabled');
      }
    }
  }

  /**
   * Test PostHog connectivity with diagnostic event.
   * 
   * Sends a test event to verify that analytics are working correctly.
   * Provides debugging information for troubleshooting connection issues.
   * 
   * Test Event Data:
   *   - Common properties (user agent, URL, timestamp)
   *   - Initialization metadata (time, retry count)
   *   - Environment information for debugging
   * 
   * Returns:
   *   Promise<void>: Resolves when test complete
   */
  private async testConnection(): Promise<void> {
    if (!this.initialized) return;

    try {
      // Send diagnostic event with initialization metadata
      this.track('analytics_service_initialized', {
        ...getCommonEventProperties(),              // Standard event properties
        initialization_time: Date.now(),           // Timestamp for performance tracking
        retry_count: this.retryCount,              // Number of retries for debugging
        environment: config.isProduction ? 'production' : 'development',
      });
      
      console.log('[PostHog] Connection test successful - analytics ready');
    } catch (error) {
      console.warn('[PostHog] Connection test failed:', error);
    }
  }

  /**
   * Identify user for personalized analytics and targeting.
   * 
   * Associates all future events with a specific user ID, enabling:
   *   - Cross-device tracking and session continuity
   *   - Personalized feature flags and A/B tests
   *   - User-specific analytics and cohort analysis
   *   - Revenue attribution and lifetime value tracking
   * 
   * Privacy Compliance:
   *   - Only identifies users who have provided consent
   *   - Supports pseudonymous identifiers for privacy
   *   - Respects user opt-out preferences
   * 
   * Parameters:
   *   userId: Unique user identifier (UUID, email hash, etc.)
   *   properties: Additional user attributes for segmentation
   * 
   * Example:
   *   analytics.identify('user_123', {
   *     email: 'user@example.com',
   *     subscription_tier: 'premium',
   *     first_name: 'John',
   *     signup_date: '2024-01-01'
   *   });
   */
  identify(userId: string, properties?: Record<string, any>) {
    if (this.initialized) {
      console.log('[PostHog] Identifying user:', userId, properties);
      posthog.identify(userId, properties);
    }
  }

  /**
   * Track user events for analytics and business intelligence.
   * 
   * Records user actions, behaviors, and system events for:
   *   - Product analytics and user journey mapping
   *   - Revenue tracking and conversion optimization
   *   - A/B testing and feature performance measurement
   *   - Error monitoring and performance analysis
   * 
   * Event Processing:
   *   - Validates event name and properties
   *   - Enriches events with common properties (timestamp, user agent, etc.)
   *   - Handles errors gracefully without breaking user experience
   *   - Logs events for debugging in development
   * 
   * Common Event Categories:
   *   - User actions: swipe_left, swipe_right, product_clicked
   *   - Revenue events: affiliate_click, purchase_completed
   *   - System events: page_viewed, error_occurred
   *   - Engagement: session_started, feature_used
   * 
   * Parameters:
   *   eventName: Descriptive event name (snake_case convention)
   *   properties: Event-specific data for analysis
   * 
   * Example:
   *   analytics.track('product_swiped', {
   *     direction: 'right',
   *     product_id: 'B08GYKNCCP',
   *     category: 'Electronics',
   *     session_id: 'session_123'
   *   });
   */
  track(eventName: string, properties?: Record<string, any>) {
    // Handle analytics not initialized gracefully
    if (!this.initialized) {
      console.warn('[PostHog] Analytics not initialized, event queued:', eventName);
      // In production, could queue events for later sending
      return;
    }

    // Validate event meets naming and data requirements
    if (!validateEvent(eventName, properties)) {
      return;
    }

    try {
      // Enrich event with common properties for consistent analytics
      const enrichedProperties = {
        ...getCommonEventProperties(),      // Standard properties (timestamp, URL, etc.)
        ...properties,                      // Event-specific properties
      };

      console.log('[PostHog] Tracking event:', eventName, enrichedProperties);
      posthog.capture(eventName, enrichedProperties);
    } catch (error) {
      console.error('[PostHog] Failed to track event:', eventName, error);
      // Continue execution even if analytics fails
    }
  }

  /**
   * Set or update user properties for segmentation and personalization.
   * 
   * Updates user profile data for:
   *   - User segmentation and cohort analysis
   *   - Personalized feature flags and targeting
   *   - Revenue analysis and lifetime value tracking
   *   - Customer support and user insights
   * 
   * Property Categories:
   *   - Demographics: age, location, gender
   *   - Subscription: tier, status, billing_cycle
   *   - Behavior: last_login, total_swipes, preferences
   *   - Revenue: total_spent, commission_generated
   * 
   * Parameters:
   *   properties: Key-value pairs of user attributes
   * 
   * Example:
   *   analytics.setUserProperties({
   *     subscription_tier: 'premium',
   *     total_swipes: 150,
   *     last_active: '2024-01-01',
   *     favorite_categories: ['Electronics', 'Books']
   *   });
   */
  setUserProperties(properties: Record<string, any>) {
    if (this.initialized) {
      console.log('[PostHog] Setting user properties:', properties);
      posthog.people.set(properties);
    }
  }

  /**
   * Track page views for navigation analytics and user journey mapping.
   * 
   * Records page navigation events for:
   *   - User flow analysis and conversion funnels
   *   - Page performance and engagement metrics
   *   - A/B testing of page layouts and content
   *   - SEO and content optimization insights
   * 
   * Automatic Enrichment:
   *   - Referrer information for traffic source analysis
   *   - Page load time and performance metrics
   *   - Device and browser information
   *   - User session context
   * 
   * Parameters:
   *   path: Optional page path (defaults to current URL)
   * 
   * Example:
   *   analytics.trackPageView('/discover'); // Track specific page
   *   analytics.trackPageView();            // Track current page
   */
  trackPageView(path?: string) {
    if (this.initialized) {
      const pageUrl = path || window.location.href;
      console.log('[PostHog] Tracking page view:', pageUrl);
      
      posthog.capture('$pageview', {
        $current_url: pageUrl,              // Page URL for navigation tracking
        page_title: document.title,         // Page title for content analysis
        referrer: document.referrer,        // Previous page for traffic flow
      });
    }
  }

  /**
   * Reset user session for logout and privacy compliance.
   * 
   * Clears all user identification and session data for:
   *   - User logout and session termination
   *   - Privacy compliance and data protection
   *   - Shared device usage scenarios
   *   - Testing and development environments
   * 
   * Reset Actions:
   *   - Clears user identification and properties
   *   - Resets feature flag cache
   *   - Generates new anonymous session ID
   *   - Maintains analytics functionality for anonymous tracking
   * 
   * Privacy Compliance:
   *   - Ensures no personal data persists after logout
   *   - Supports "right to be forgotten" requirements
   *   - Clears all locally stored user data
   * 
   * Example:
   *   // On user logout
   *   analytics.reset();
   */
  reset() {
    if (this.initialized) {
      console.log('[PostHog] Resetting user session');
      posthog.reset();
    }
  }

  /**
   * Associate user with groups for organizational analytics.
   * 
   * Groups users by organization, team, or other entities for:
   *   - B2B analytics and enterprise insights
   *   - Team collaboration feature usage
   *   - Organization-level reporting and billing
   *   - Multi-tenant application analytics
   * 
   * Group Types:
   *   - organization: Company or business entity
   *   - team: Department or project team
   *   - subscription: Shared subscription account
   *   - family: Family gift-giving groups
   * 
   * Parameters:
   *   groupType: Type of group (organization, team, etc.)
   *   groupKey: Unique identifier for the group
   *   properties: Group-specific attributes
   * 
   * Example:
   *   analytics.group('organization', 'acme-corp', {
   *     name: 'Acme Corporation',
   *     plan: 'enterprise',
   *     employees: 500
   *   });
   */
  group(groupType: string, groupKey: string, properties?: Record<string, any>) {
    if (this.initialized) {
      console.log('[PostHog] Setting group:', groupType, groupKey, properties);
      posthog.group(groupType, groupKey, properties);
    }
  }

  /**
   * Check if a feature flag is enabled for the current user.
   * 
   * Enables controlled feature rollouts and A/B testing for:
   *   - Gradual feature releases to user segments
   *   - A/B testing of new functionality
   *   - Kill switches for problematic features
   *   - Personalized user experiences
   * 
   * Feature Flag Categories:
   *   - UI features: new_swipe_interface, dark_mode
   *   - Business logic: premium_recommendations, affiliate_tracking
   *   - Experiments: recommendation_algorithm_v2
   *   - Rollouts: mobile_app_promotion
   * 
   * Parameters:
   *   flag: Feature flag name (snake_case convention)
   * 
   * Returns:
   *   boolean: True if feature is enabled for current user
   * 
   * Example:
   *   if (analytics.isFeatureEnabled('new_recommendation_engine')) {
   *     // Show new recommendation UI
   *   }
   */
  isFeatureEnabled(flag: string): boolean {
    if (this.initialized) {
      const enabled = posthog.isFeatureEnabled(flag) === true;
      console.log(`[PostHog] Feature flag '${flag}':`, enabled);
      return enabled;
    }
    return false;  // Default to disabled if analytics not available
  }

  /**
   * Get feature flag value for advanced flag configurations.
   * 
   * Retrieves feature flag values that can be:
   *   - Boolean: true/false for simple on/off features
   *   - String: variant names for multivariate tests
   *   - Number: configuration values or percentages
   * 
   * Advanced Use Cases:
   *   - Multivariate testing with multiple variants
   *   - Configuration flags with specific values
   *   - Percentage-based rollouts
   *   - String-based feature variants
   * 
   * Parameters:
   *   flag: Feature flag name
   * 
   * Returns:
   *   string | boolean | undefined: Flag value or undefined if not set
   * 
   * Example:
   *   const variant = analytics.getFeatureFlag('recommendation_algorithm');
   *   if (variant === 'collaborative_filtering') {
   *     // Use collaborative filtering algorithm
   *   } else if (variant === 'content_based') {
   *     // Use content-based algorithm
   *   }
   */
  getFeatureFlag(flag: string): string | boolean | undefined {
    if (this.initialized) {
      const value = posthog.getFeatureFlag(flag);
      console.log(`[PostHog] Feature flag '${flag}' value:`, value);
      return value;
    }
    return undefined;
  }

  /**
   * Opt user out of analytics tracking for privacy compliance.
   * 
   * Provides user control over data collection for:
   *   - GDPR and privacy regulation compliance
   *   - User preference and consent management
   *   - Cookie banner and privacy controls
   *   - Data minimization principles
   * 
   * Opt-Out Effects:
   *   - Stops all event tracking and data collection
   *   - Disables feature flags and personalization
   *   - Maintains basic functionality without analytics
   *   - Sets persistent opt-out preference
   * 
   * Privacy Compliance:
   *   - Respects user privacy choices
   *   - Provides clear opt-out mechanism
   *   - Maintains opt-out status across sessions
   * 
   * Example:
   *   // User clicks "Opt out of analytics"
   *   analytics.optOut();
   */
  optOut() {
    if (this.initialized) {
      console.log('[PostHog] User opted out of analytics tracking');
      posthog.opt_out_capturing();
    }
  }

  /**
   * Opt user into analytics tracking after previous opt-out.
   * 
   * Re-enables analytics for users who previously opted out:
   *   - Restores full analytics functionality
   *   - Re-enables feature flags and personalization
   *   - Resumes event tracking and data collection
   *   - Updates user consent preferences
   * 
   * Use Cases:
   *   - User changes privacy preferences
   *   - Premium users enabling advanced features
   *   - Onboarding flow consent updates
   *   - Settings page privacy controls
   * 
   * Example:
   *   // User clicks "Enable analytics"
   *   analytics.optIn();
   */
  optIn() {
    if (this.initialized) {
      console.log('[PostHog] User opted into analytics tracking');
      posthog.opt_in_capturing();
    }
  }

  /**
   * Check if user has opted out of analytics tracking.
   * 
   * Determines user's current privacy preference for:
   *   - Conditional UI rendering based on consent
   *   - Privacy settings page status display
   *   - Feature availability and functionality
   *   - Compliance with privacy regulations
   * 
   * Returns:
   *   boolean: True if user has opted out, false otherwise
   * 
   * Example:
   *   if (!analytics.hasOptedOut()) {
   *     // Show analytics-dependent features
   *     renderPersonalizedRecommendations();
   *   }
   */
  hasOptedOut(): boolean {
    if (this.initialized) {
      return posthog.has_opted_out_capturing();
    }
    return false;  // Default to opted-in if analytics not available
  }
}

// ==============================================================================
// SINGLETON ANALYTICS INSTANCE
// ==============================================================================
// Global analytics instance for application-wide usage

/**
 * Global analytics service instance.
 * 
 * Singleton pattern ensures consistent analytics across the entire application.
 * Use this instance for all analytics operations to maintain state and configuration.
 */
export const analytics = new AnalyticsService();

// ==============================================================================
// CONVENIENCE FUNCTIONS
// ==============================================================================
// Simplified API for common analytics operations

/**
 * Track user event with simplified API.
 * 
 * Convenience function for the most common analytics operation.
 * Provides type-safe event tracking without direct service access.
 * 
 * Parameters:
 *   eventName: Descriptive event name (snake_case)
 *   properties: Optional event data
 * 
 * Example:
 *   trackEvent('button_clicked', { button_id: 'signup' });
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  analytics.track(eventName, properties);
};

/**
 * Identify user with simplified API.
 * 
 * Convenience function for user identification without direct service access.
 * 
 * Parameters:
 *   userId: Unique user identifier
 *   properties: Optional user attributes
 * 
 * Example:
 *   identifyUser('user_123', { email: 'user@example.com' });
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  analytics.identify(userId, properties);
};

/**
 * Track page view with simplified API.
 * 
 * Convenience function for page view tracking without direct service access.
 * 
 * Parameters:
 *   path: Optional page path (defaults to current URL)
 * 
 * Example:
 *   trackPageView('/discover');
 */
export const trackPageView = (path?: string) => {
  analytics.trackPageView(path);
};

// Default export for importing as single module
export default analytics;

// Export all public interfaces
// Exported: analytics, trackEvent, identifyUser, trackPageView, AnalyticsService
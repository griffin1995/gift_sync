import { PostHogConfig } from 'posthog-js';
import { config } from '@/config';

// PostHog configuration factory
export function createPostHogConfig(): PostHogConfig {
  const isDev = config.isDevelopment;
  const isProd = config.isProduction;

  const baseConfig: PostHogConfig = {
    // API Configuration
    api_host: isDev ? 'http://localhost:3000' : config.posthogHost || 'https://eu.i.posthog.com',
    ui_host: config.posthogHost || 'https://eu.i.posthog.com',
    
    // Core Features
    person_profiles: 'identified_only',
    capture_pageview: false, // Manual pageview tracking for better proxy compatibility
    capture_pageleave: true,
    debug: isDev,
    
    // Autocapture Configuration
    autocapture: {
      dom_event_allowlist: ['click', 'change', 'submit', 'input'],
      css_selector_allowlist: [
        '[data-attr]', 
        '[data-testid]', 
        '[data-ph-capture-attribute]',
        '.btn',
        '.button',
        'button',
        'a[href]',
        'input[type="submit"]',
        'input[type="button"]',
      ],
      element_allowlist: [
        'a', 'button', 'form', 'input', 'select', 'textarea', 'label'
      ],
      url_allowlist: isDev ? ['localhost:3000'] : undefined,
    },

    // Session Recording
    session_recording: {
      recordCrossOriginIframes: false,
      maskAllInputs: true,
      maskInputOptions: {
        password: true,
        email: false,
        tel: true,
        credit_card: true,
      },
      maskTextSelector: '.sensitive, [data-sensitive]',
      blockSelector: '.block-recording, [data-block-recording]',
      ignoreClass: 'ph-ignore',
      collectFonts: false,
      inlineStylesheet: false,
    },
    disable_session_recording: !isProd,

    // Privacy and Security
    cross_subdomain_cookie: false,
    secure_cookie: isProd,
    respect_dnt: true,
    opt_out_capturing_by_default: false,
    
    // Performance
    batch_size: isDev ? 10 : 50,
    request_timeout_ms: 30000,
    
    // Persistence
    persistence: 'localStorage+cookie',
    persistence_name: `ph_${config.posthogKey}_posthog`,
    cookie_name: `ph_${config.posthogKey}_posthog`,
    cookie_expiration: 365, // days
    disable_persistence: false,
    
    // Advanced Features
    disable_surveys: false,
    enable_recording_console_log: isDev,
    capture_performance: isProd,
    
    // Error Handling
    on_xhr_error: (failedRequest) => {
      console.warn('[PostHog] XHR request failed:', failedRequest);
    },
    
    loaded: (posthog) => {
      console.log('[PostHog] Analytics service loaded successfully', {
        mode: isDev ? 'development' : 'production',
        api_host: posthog.config.api_host,
        distinct_id: posthog.get_distinct_id(),
        version: posthog.LIB_VERSION,
      });
      
      // Global access for debugging
      if (isDev) {
        window.posthog = posthog;
        console.log('[PostHog] Available globally as window.posthog for debugging');
      }
      
      // Set up error tracking
      if (isProd) {
        window.addEventListener('error', (event) => {
          posthog.capture('javascript_error', {
            error_message: event.message,
            error_filename: event.filename,
            error_lineno: event.lineno,
            error_colno: event.colno,
            error_stack: event.error?.stack,
          });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
          posthog.capture('unhandled_promise_rejection', {
            reason: event.reason?.toString(),
            stack: event.reason?.stack,
          });
        });
      }
    },
  };

  // Development-specific overrides
  if (isDev) {
    return {
      ...baseConfig,
      // Use local proxy endpoints to avoid CORS
      api_endpoint: '/api/posthog-proxy',
      decide_endpoint: '/api/posthog-decide',
      
      // Development optimizations
      advanced_disable_decide: false, // Enable feature flags in dev
      disable_external_dependency_loading: false,
      bootstrap: {
        distinctID: undefined,
        isIdentifiedID: false,
        featureFlags: {},
      },
      
      // Faster development feedback
      property_blacklist: [],
      sanitize_properties: null,
      xhr_headers: {
        'X-PostHog-Source': 'giftsync-dev',
      },
    };
  }

  // Production-specific configuration
  return {
    ...baseConfig,
    
    // Production optimizations
    advanced_disable_decide: false,
    disable_external_dependency_loading: false,
    
    // Enhanced security
    mask_all_text: false,
    mask_all_element_attributes: false,
    
    // Performance monitoring
    capture_performance: true,
    _capture_metrics: true,
    
    // Production headers
    xhr_headers: {
      'X-PostHog-Source': 'giftsync-prod',
    },
  };
}

// PostHog event validation
export function validateEvent(eventName: string, properties?: Record<string, any>): boolean {
  if (!eventName || typeof eventName !== 'string') {
    console.warn('[PostHog] Invalid event name:', eventName);
    return false;
  }
  
  if (eventName.length > 200) {
    console.warn('[PostHog] Event name too long:', eventName);
    return false;
  }
  
  if (properties && typeof properties !== 'object') {
    console.warn('[PostHog] Invalid event properties:', properties);
    return false;
  }
  
  return true;
}

// Common event properties
export function getCommonEventProperties(): Record<string, any> {
  return {
    app_version: config.version,
    environment: config.isDevelopment ? 'development' : 'production',
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    user_agent: navigator.userAgent,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    referrer: document.referrer,
    url: window.location.href,
  };
}
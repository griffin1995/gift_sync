/**
 * GiftSync Application Configuration
 * 
 * Centralised configuration management for the entire GiftSync application.
 * Provides environment-specific settings, API endpoints, feature flags,
 * and business logic constants.
 * 
 * Configuration Categories:
 *   - Environment: API URLs, deployment settings, analytics keys
 *   - API Endpoints: Complete REST API endpoint definitions
 *   - Application: UI settings, validation rules, error messages
 *   - Amazon Associates: Affiliate program configuration and utilities
 *   - Theme: Design system constants and styling
 * 
 * Environment Variables:
 *   - All sensitive data loaded from environment variables
 *   - Fallback defaults for development
 *   - Production vs development feature toggles
 * 
 * Usage:
 *   import { config, endpoints, appConfig } from '@/config';
 *   const apiUrl = config.apiUrl;
 *   const loginEndpoint = endpoints.auth.login;
 */

import { EnvironmentConfig } from '@/types';

// ==============================================================================
// ENVIRONMENT CONFIGURATION
// ==============================================================================
// Runtime environment settings loaded from environment variables

/**
 * Core environment configuration for API communication and external services.
 * 
 * Automatically adapts between development and production environments
 * based on NODE_ENV and environment variable availability.
 */
export const config: EnvironmentConfig = {
  // Core service URLs
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',        // Backend API base URL
  webUrl: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',        // Frontend application URL
  
  // Analytics and monitoring service keys
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,                     // Mixpanel analytics (optional)
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,                             // Sentry error tracking (optional)
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,                          // Google Analytics ID (optional)
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,                           // PostHog analytics key
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,                         // PostHog service host
  
  // Environment detection
  isProduction: process.env.NODE_ENV === 'production',                      // Production environment flag
  isDevelopment: process.env.NODE_ENV === 'development',                    // Development environment flag
  version: process.env.npm_package_version || '1.0.0',                      // Application version
  
  // Amazon Associates affiliate program configuration
  amazonAssociateTag: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'giftsync-21', // Approved associate tag
  amazonRegion: process.env.NEXT_PUBLIC_AMAZON_REGION || 'uk',                       // Target market region
  amazonApiKey: process.env.NEXT_PUBLIC_AMAZON_API_KEY,                              // Product Advertising API key
  amazonSecretKey: process.env.NEXT_PUBLIC_AMAZON_SECRET_KEY,                        // API secret key
};

// ==============================================================================
// API ENDPOINTS
// ==============================================================================
// Complete REST API endpoint definitions for all backend services

/**
 * Comprehensive API endpoint configuration.
 * 
 * Organises all backend API endpoints by functional area for easy
 * maintenance and consistent usage across the application.
 * 
 * Pattern:
 *   - Static endpoints: Direct string paths
 *   - Dynamic endpoints: Functions that accept parameters
 *   - Consistent naming: Resource-based organisation
 */
export const endpoints = {
  // ===========================================================================
  // AUTHENTICATION ENDPOINTS
  // ===========================================================================
  // User authentication and session management
  auth: {
    login: '/api/v1/auth/login',                    // POST: Authenticate user with email/password
    register: '/api/v1/auth/register',              // POST: Create new user account
    refresh: '/api/v1/auth/refresh',                // POST: Refresh expired access token
    logout: '/api/v1/auth/logout',                  // POST: End user session
    me: '/api/v1/auth/me',                          // GET: Get current user profile
    forgotPassword: '/api/v1/auth/forgot-password', // POST: Request password reset
    resetPassword: '/api/v1/auth/reset-password',   // POST: Reset password with token
    verifyEmail: '/api/v1/auth/verify-email',       // POST: Verify email address
  },
  
  // ===========================================================================
  // USER MANAGEMENT ENDPOINTS
  // ===========================================================================
  // User profile and preference management
  users: {
    profile: '/api/v1/users/me',                    // GET: Get user profile
    updateProfile: '/api/v1/users/me',              // PUT: Update user profile
    preferences: '/api/v1/users/me/preferences',    // GET/PUT: User preferences
    statistics: '/api/v1/users/me/statistics',      // GET: User activity statistics
    deleteAccount: '/api/v1/users/me',              // DELETE: Permanently delete account
  },
  
  // ===========================================================================
  // PRODUCT CATALOG ENDPOINTS
  // ===========================================================================
  // Product search, filtering, and retrieval
  products: {
    list: '/api/v1/products',                                                   // GET: List products with filters
    search: '/api/v1/products/search',                                          // POST: Search products by query
    categories: '/api/v1/products/categories',                                  // GET: Get product categories
    featured: '/api/v1/products/featured',                                      // GET: Get featured products
    trending: '/api/v1/products/trending',                                      // GET: Get trending products
    byCategory: (categoryId: string) => `/api/v1/products/category/${categoryId}`, // GET: Products by category
    byId: (id: string) => `/api/v1/products/${id}`,                            // GET: Single product details
    recommendations: '/api/v1/products/recommendations',                       // GET: Product recommendations
  },
  
  // ===========================================================================
  // SWIPE INTERACTION ENDPOINTS
  // ===========================================================================
  // User preference collection through swipe gestures
  swipes: {
    sessions: '/api/v1/swipes/sessions',                                                    // GET: List user's swipe sessions
    createSession: '/api/v1/swipes/sessions',                                               // POST: Start new swipe session
    currentSession: '/api/v1/swipes/sessions/current',                                      // GET: Get active session
    interactions: (sessionId: string) => `/api/v1/swipes/sessions/${sessionId}/interactions`, // POST: Record swipe interaction
    analytics: '/api/v1/swipes/analytics',                                                  // GET: Swipe analytics data
  },
  
  // ===========================================================================
  // AI RECOMMENDATION ENDPOINTS
  // ===========================================================================
  // Machine learning powered product recommendations
  recommendations: {
    generate: '/api/v1/recommendations/generate',                               // POST: Generate new recommendations
    list: '/api/v1/recommendations',                                            // GET: Get user's recommendations
    byId: (id: string) => `/api/v1/recommendations/${id}`,                     // GET: Single recommendation details
    feedback: (id: string) => `/api/v1/recommendations/${id}/feedback`,        // POST: Provide recommendation feedback
    refresh: '/api/v1/recommendations/refresh',                                 // POST: Refresh recommendation list
  },
  
  // ===========================================================================
  // GIFT LINK SHARING ENDPOINTS
  // ===========================================================================
  // Social sharing and gift link management
  giftLinks: {
    create: '/api/v1/gift-links',                                               // POST: Create shareable gift link
    list: '/api/v1/gift-links',                                                 // GET: List user's gift links
    byId: (id: string) => `/api/v1/gift-links/${id}`,                          // GET: Gift link details
    byToken: (token: string) => `/api/v1/gift-links/share/${token}`,           // GET: Public gift link access
    delete: (id: string) => `/api/v1/gift-links/${id}`,                        // DELETE: Remove gift link
    analytics: (id: string) => `/api/v1/gift-links/${id}/analytics`,           // GET: Gift link analytics
  },
  
  // ===========================================================================
  // ANALYTICS AND TRACKING ENDPOINTS
  // ===========================================================================
  // User behavior tracking and business analytics
  analytics: {
    track: '/api/v1/analytics/track',                                           // POST: Track user events
    events: '/api/v1/analytics/events',                                         // GET: Query analytics events
    dashboard: '/api/v1/analytics/dashboard',                                   // GET: Analytics dashboard data
  },
  
  // ===========================================================================
  // SYSTEM HEALTH ENDPOINTS
  // ===========================================================================
  // Service monitoring and health checks
  health: '/health',                                                            // GET: System health status
};

// ==============================================================================
// APPLICATION CONFIGURATION
// ==============================================================================
// Business logic, UI settings, and application constants

/**
 * Comprehensive application configuration containing all business rules,
 * UI settings, validation patterns, and feature flags.
 * 
 * Used throughout the application for consistent behavior and easy
 * maintenance of business logic.
 */
export const appConfig = {
  // ===========================================================================
  // BRAND AND MESSAGING
  // ===========================================================================
  name: 'GiftSync',                                      // Application name
  description: 'AI-powered gift recommendation platform', // SEO description
  tagline: 'Find the perfect gift with AI',              // Marketing tagline
  
  // Swipe settings
  swipe: {
    maxSwipesPerSession: 50,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    cardPreloadCount: 5,
    animationDuration: 300,
    velocityThreshold: 0.5,
    distanceThreshold: 100,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Image settings
  images: {
    defaultProductImage: '/images/placeholder-product.png',
    defaultUserAvatar: '/images/default-avatar.png',
    defaultCategoryIcon: '/images/category-default.svg',
    cloudinaryBaseUrl: 'https://res.cloudinary.com/giftsync',
  },
  
  // Animation settings
  animations: {
    defaultDuration: 300,
    defaultEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    pageTransition: 200,
  },
  
  // Toast notifications
  toast: {
    defaultDuration: 5000,
    position: 'top-right' as const,
  },
  
  // Local storage keys
  storage: {
    authToken: 'giftsync_auth_token',
    refreshToken: 'giftsync_refresh_token',
    user: 'giftsync_user',
    preferences: 'giftsync_preferences',
    recentSearches: 'giftsync_recent_searches',
    viewedProducts: 'giftsync_viewed_products',
    onboardingCompleted: 'giftsync_onboarding_completed',
    theme: 'giftsync_theme',
  },
  
  // Feature flags
  features: {
    socialLogin: true,
    pushNotifications: true,
    darkMode: true,
    analytics: true,
    affiliateLinks: true,
    affiliateTracking: true,
    beta: {
      voiceSearch: false,
      arFeatures: false,
      chatbot: false,
      amazonApiIntegration: false,
    },
  },
  
  // External URLs
  urls: {
    privacyPolicy: '/privacy',
    termsOfService: '/terms',
    contactUs: '/contact',
    help: '/help',
    blog: '/blog',
    careers: '/careers',
    pressKit: '/press',
    apiDocs: `${config.apiUrl}/docs`,
    affiliateDisclosure: '/affiliate-disclosure',
    cookiePolicy: '/cookie-policy',
  },
  
  // Social media
  social: {
    twitter: 'https://twitter.com/giftsync',
    facebook: 'https://facebook.com/giftsync',
    instagram: 'https://instagram.com/giftsync',
    linkedin: 'https://linkedin.com/company/giftsync',
    youtube: 'https://youtube.com/c/giftsync',
  },
  
  // Contact information
  contact: {
    email: 'hello@giftsync.com',
    support: 'support@giftsync.com',
    press: 'press@giftsync.com',
    partnerships: 'partnerships@giftsync.com',
  },
  
  // App store links
  appStore: {
    ios: 'https://apps.apple.com/app/giftsync',
    android: 'https://play.google.com/store/apps/details?id=com.giftsync.app',
  },
  
  // Subscription tiers
  subscriptionTiers: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Basic recommendations',
        'Limited swipes per day',
        'Email support',
        'Basic analytics',
      ],
    },
    premium: {
      name: 'Premium',
      price: 9.99,
      features: [
        'Unlimited swipes',
        'Advanced AI recommendations',
        'Priority support',
        'Advanced analytics',
        'Gift link customization',
        'Export features',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: 29.99,
      features: [
        'All Premium features',
        'Team collaboration',
        'Bulk gift management',
        'Custom branding',
        'API access',
        'Dedicated support',
      ],
    },
  },
  
  // Validation rules
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    email: {
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'.-]+$/,
    },
  },
  
  // Error messages
  errors: {
    network: 'Network error. Please check your connection and try again.',
    server: 'Server error. Please try again later.',
    unauthorized: 'Please log in to continue.',
    forbidden: 'You do not have permission to access this resource.',
    notFound: 'The requested resource was not found.',
    validation: 'Please check your input and try again.',
    unknown: 'An unexpected error occurred. Please try again.',
  },
  
  // Success messages
  success: {
    login: 'Welcome back!',
    register: 'Account created successfully!',
    logout: 'Logged out successfully.',
    profileUpdated: 'Profile updated successfully.',
    preferencesUpdated: 'Preferences updated successfully.',
    giftLinkCreated: 'Gift link created successfully!',
    giftLinkShared: 'Gift link shared successfully!',
    affiliateLinkGenerated: 'Affiliate link generated successfully!',
  },
};

// Amazon Associates Configuration
export const amazonConfig = {
  // UK Amazon Associates Configuration
  uk: {
    associateTag: 'giftsync-21',
    baseUrl: 'https://amazon.co.uk',
    apiHost: 'webservices.amazon.co.uk',
    marketplace: 'A1F83G8C2ARO7P',
    region: 'eu-west-1',
    currency: 'GBP',
    language: 'en_GB',
  },
  
  // Commission rates by category (approximate)
  commissionRates: {
    electronics: 0.01,          // 1%
    fashion: 0.04,             // 4%
    homeAndGarden: 0.03,       // 3%
    sportsAndOutdoors: 0.03,   // 3%
    books: 0.045,              // 4.5%
    toys: 0.03,                // 3%
    beautyAndPersonalCare: 0.04, // 4%
    automotive: 0.045,         // 4.5%
    industrial: 0.045,         // 4.5%
    outdoorAndGarden: 0.03,    // 3%
    default: 0.02,             // 2%
  },
  
  // Product categories for recommendations
  productCategories: {
    'All': 'All',
    'Electronics': 'Electronics',
    'Fashion': 'Fashion',
    'Home & Garden': 'Garden',
    'Sports & Outdoors': 'SportingGoods',
    'Books': 'Books',
    'Toys & Games': 'Toys',
    'Beauty & Personal Care': 'Beauty',
    'Automotive': 'Automotive',
    'Health & Household': 'HealthPersonalCare',
    'Tools & Home Improvement': 'Tools',
    'Video Games': 'VideoGames',
    'Office Products': 'OfficeProducts',
    'Kitchen & Dining': 'Kitchen',
    'Baby': 'Baby',
    'Pet Supplies': 'PetSupplies',
    'Industrial & Scientific': 'Industrial',
    'Handmade': 'Handmade',
    'Arts, Crafts & Sewing': 'ArtsAndCrafts',
    'Musical Instruments': 'MusicalInstruments',
  },
  
  // API Configuration
  api: {
    version: '5.0',
    requestsPerSecond: 1,
    timeoutMs: 5000,
    retryAttempts: 3,
    retryDelayMs: 1000,
  },
  
  // Tracking and Analytics
  tracking: {
    enableConversionTracking: true,
    enableClickTracking: true,
    enableImpressionTracking: true,
    sessionTimeoutMinutes: 30,
    attributionWindowDays: 30,
  },
};

// Affiliate Link Generation Utilities
export class AffiliateLinksService {
  /**
   * Generates an Amazon affiliate link with proper tracking
   */
  static generateAffiliateLink(
    productUrl: string, 
    options: {
      associateTag?: string;
      ref?: string;
      campaign?: string;
      medium?: string;
      source?: string;
    } = {}
  ): string {
    try {
      const url = new URL(productUrl);
      
      // Ensure we're using the correct Amazon domain
      if (!url.hostname.includes('amazon.co.uk')) {
        // Convert to UK domain if needed
        url.hostname = 'amazon.co.uk';
      }
      
      // Add associate tag
      url.searchParams.set('tag', options.associateTag || amazonConfig.uk.associateTag);
      
      // Add tracking parameters
      if (options.ref) {
        url.searchParams.set('ref_', options.ref);
      }
      
      if (options.campaign) {
        url.searchParams.set('campaign', options.campaign);
      }
      
      if (options.medium) {
        url.searchParams.set('medium', options.medium);
      }
      
      if (options.source) {
        url.searchParams.set('source', options.source);
      }
      
      // Add timestamp for tracking
      url.searchParams.set('timestamp', Date.now().toString());
      
      return url.toString();
    } catch (error) {
      console.error('Error generating affiliate link:', error);
      return productUrl; // Return original URL if generation fails
    }
  }
  
  /**
   * Generates an Amazon search link with affiliate tracking
   */
  static generateSearchLink(
    searchTerm: string,
    category?: string,
    options: {
      associateTag?: string;
      ref?: string;
    } = {}
  ): string {
    const baseUrl = 'https://amazon.co.uk/s';
    const url = new URL(baseUrl);
    
    url.searchParams.set('k', searchTerm);
    url.searchParams.set('tag', options.associateTag || amazonConfig.uk.associateTag);
    
    if (category && amazonConfig.productCategories[category]) {
      url.searchParams.set('i', amazonConfig.productCategories[category]);
    }
    
    if (options.ref) {
      url.searchParams.set('ref', options.ref);
    }
    
    return url.toString();
  }
  
  /**
   * Extracts ASIN from Amazon product URL
   */
  static extractASIN(productUrl: string): string | null {
    try {
      // Common ASIN patterns in Amazon URLs
      const asinPatterns = [
        /\/dp\/([A-Z0-9]{10})/,
        /\/gp\/product\/([A-Z0-9]{10})/,
        /\/product\/([A-Z0-9]{10})/,
        /\/ASIN\/([A-Z0-9]{10})/,
        /asin=([A-Z0-9]{10})/i,
      ];
      
      for (const pattern of asinPatterns) {
        const match = productUrl.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting ASIN:', error);
      return null;
    }
  }
  
  /**
   * Validates if a URL is a valid Amazon product URL
   */
  static isValidAmazonUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const validDomains = [
        'amazon.co.uk',
        'amazon.com',
        'amazon.de',
        'amazon.fr',
        'amazon.it',
        'amazon.es',
        'amazon.ca',
        'amazon.com.au',
        'amazon.co.jp',
      ];
      
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Gets commission rate for a given product category
   */
  static getCommissionRate(category: string): number {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '');
    
    // Map to commission rates
    const categoryMappings: Record<string, keyof typeof amazonConfig.commissionRates> = {
      'electronics': 'electronics',
      'fashion': 'fashion',
      'clothing': 'fashion',
      'homeandgarden': 'homeAndGarden',
      'home': 'homeAndGarden',
      'garden': 'homeAndGarden',
      'sportsandoutdoors': 'sportsAndOutdoors',
      'sports': 'sportsAndOutdoors',
      'books': 'books',
      'toys': 'toys',
      'toysgames': 'toys',
      'games': 'toys',
      'beauty': 'beautyAndPersonalCare',
      'beautyandpersonalcare': 'beautyAndPersonalCare',
      'personalcare': 'beautyAndPersonalCare',
      'automotive': 'automotive',
      'industrial': 'industrial',
      'outdoor': 'outdoorAndGarden',
    };
    
    const mappedCategory = categoryMappings[normalizedCategory];
    return amazonConfig.commissionRates[mappedCategory] || amazonConfig.commissionRates.default;
  }
}

// Theme configuration
export const theme = {
  colors: {
    primary: '#f03dff',
    secondary: '#0ea5e9',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: '#737373',
  },
  
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1600px',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
};

export default config;
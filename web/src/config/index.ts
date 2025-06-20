import { EnvironmentConfig } from '@/types';

// Environment configuration
export const config: EnvironmentConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  webUrl: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  version: process.env.npm_package_version || '1.0.0',
};

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    me: '/api/v1/auth/me',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
    verifyEmail: '/api/v1/auth/verify-email',
  },
  
  // Users
  users: {
    profile: '/api/v1/users/me',
    updateProfile: '/api/v1/users/me',
    preferences: '/api/v1/users/me/preferences',
    statistics: '/api/v1/users/me/statistics',
    deleteAccount: '/api/v1/users/me',
  },
  
  // Products
  products: {
    list: '/api/v1/products',
    search: '/api/v1/products/search',
    categories: '/api/v1/products/categories',
    featured: '/api/v1/products/featured',
    trending: '/api/v1/products/trending',
    byCategory: (categoryId: string) => `/api/v1/products/category/${categoryId}`,
    byId: (id: string) => `/api/v1/products/${id}`,
    recommendations: '/api/v1/products/recommendations',
  },
  
  // Swipes
  swipes: {
    sessions: '/api/v1/swipes/sessions',
    createSession: '/api/v1/swipes/sessions',
    currentSession: '/api/v1/swipes/sessions/current',
    interactions: (sessionId: string) => `/api/v1/swipes/sessions/${sessionId}/interactions`,
    analytics: '/api/v1/swipes/analytics',
  },
  
  // Recommendations
  recommendations: {
    generate: '/api/v1/recommendations/generate',
    list: '/api/v1/recommendations',
    byId: (id: string) => `/api/v1/recommendations/${id}`,
    feedback: (id: string) => `/api/v1/recommendations/${id}/feedback`,
    refresh: '/api/v1/recommendations/refresh',
  },
  
  // Gift Links
  giftLinks: {
    create: '/api/v1/gift-links',
    list: '/api/v1/gift-links',
    byId: (id: string) => `/api/v1/gift-links/${id}`,
    byToken: (token: string) => `/api/v1/gift-links/share/${token}`,
    delete: (id: string) => `/api/v1/gift-links/${id}`,
    analytics: (id: string) => `/api/v1/gift-links/${id}/analytics`,
  },
  
  // Analytics
  analytics: {
    track: '/api/v1/analytics/track',
    events: '/api/v1/analytics/events',
    dashboard: '/api/v1/analytics/dashboard',
  },
  
  // Health
  health: '/health',
};

// App configuration
export const appConfig = {
  name: 'GiftSync',
  description: 'AI-powered gift recommendation platform',
  tagline: 'Find the perfect gift with AI',
  
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
    beta: {
      voiceSearch: false,
      arFeatures: false,
      chatbot: false,
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
  },
};

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
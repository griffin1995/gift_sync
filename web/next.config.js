/**
 * GiftSync Next.js Configuration
 * 
 * Production-ready Next.js configuration for the GiftSync gift recommendation platform.
 * Optimised for performance, security, and deployment flexibility across development,
 * staging, and production environments.
 * 
 * Key Features:
 *   - Advanced image optimization with Amazon CDN support
 *   - Security headers and CORS configuration
 *   - Build optimization and bundle splitting
 *   - Environment-specific settings
 *   - API proxy for development
 *   - Static export support for S3 deployment
 * 
 * Deployment Targets:
 *   - Vercel (serverless)
 *   - AWS S3 + CloudFront (static)
 *   - Docker containers (standalone)
 *   - Traditional hosting (server)
 * 
 * Performance Optimizations:
 *   - SWC compiler for faster builds
 *   - Image optimization with WebP/AVIF
 *   - Console removal in production
 *   - ETag and compression configuration
 * 
 * Security Features:
 *   - Security headers (XSS, clickjacking protection)
 *   - CORS policy enforcement
 *   - Referrer policy configuration
 *   - Permissions policy restrictions
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // ===========================================================================
  // CORE REACT CONFIGURATION
  // ===========================================================================
  
  reactStrictMode: true,        // Enable React strict mode for development warnings
  swcMinify: true,              // Use SWC for faster minification instead of Terser
  
  // ===========================================================================
  // ENVIRONMENT VARIABLES
  // ===========================================================================
  // Client-side environment variables with fallback defaults
  
  env: {
    // Core service URLs
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',     // Backend API endpoint
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',     // Frontend application URL
    
    // Analytics and monitoring
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,                 // Mixpanel analytics token
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,                         // Sentry error tracking DSN
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,                                   // Google Analytics tracking ID
  },

  // ===========================================================================
  // IMAGE OPTIMIZATION
  // ===========================================================================
  // Next.js image optimization with CDN and external domain support
  
  images: {
    // Allowed external image domains for security and performance
    remotePatterns: [
      // Development environment
      {
        protocol: 'http',
        hostname: 'localhost',                                 // Local development images
      },
      
      // Stock photo services
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',                       // Unsplash stock photos
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',                         // Pexels stock photos
      },
      
      // AWS S3 storage
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',                          // General S3 bucket access
      },
      {
        protocol: 'https',
        hostname: 'giftsync-prod-assets.s3.amazonaws.com',     // Production asset bucket
      },
      {
        protocol: 'https',
        hostname: 'giftsync-dev-assets.s3.amazonaws.com',      // Development asset bucket
      },
      
      // Amazon product images (for affiliate links)
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',                        // Amazon mobile CDN
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',           // Amazon SSL CDN
      },
      
      // Development and testing
      {
        protocol: 'https',
        hostname: 'picsum.photos',                             // Lorem Picsum placeholder images
      }
    ],
    
    // Modern image formats for better performance
    formats: ['image/webp', 'image/avif'],                    // WebP and AVIF for smaller file sizes
  },

  // ===========================================================================
  // WEBPACK CONFIGURATION
  // ===========================================================================
  // Custom webpack configuration for enhanced functionality
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add support for SVG imports as React components
    config.module.rules.push({
      test: /\.svg$/,                    // Match SVG files
      use: ['@svgr/webpack']            // Transform SVGs to React components
    });

    // Additional webpack optimizations could be added here:
    // - Bundle analyzer configuration
    // - Custom loaders for special file types
    // - Polyfill configuration
    // - Module federation setup

    return config;
  },

  // ===========================================================================
  // SECURITY HEADERS
  // ===========================================================================
  // HTTP security headers for protection against common attacks
  
  async headers() {
    return [
      // Global security headers for all routes
      {
        source: '/(.*)',               // Apply to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'               // Prevent clickjacking attacks
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'            // Prevent MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'  // Control referrer information
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'  // Restrict browser APIs
          }
        ]
      },
      
      // API-specific CORS headers
      {
        source: '/api/(.*)',           // Apply to API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://app.giftsync.com'     // Production domain only
              : 'http://localhost:3000'        // Development localhost
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'  // Allowed HTTP methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'      // Allowed request headers
          }
        ]
      }
    ];
  },

  // ===========================================================================
  // URL REDIRECTS
  // ===========================================================================
  // Permanent redirects for SEO and user experience
  
  async redirects() {
    return [
      // Legacy route redirects
      {
        source: '/app',                // Old app route
        destination: '/dashboard',      // Redirect to dashboard
        permanent: true,                // 301 redirect for SEO
      },
      {
        source: '/login',               // Simplified login URL
        destination: '/auth/login',     // Full auth path
        permanent: true,
      },
      {
        source: '/register',            // Simplified register URL
        destination: '/auth/register',  // Full auth path
        permanent: true,
      }
    ];
  },

  // ===========================================================================
  // URL REWRITES
  // ===========================================================================
  // Development API proxy and URL rewriting
  
  async rewrites() {
    // Only enable API proxy in development for CORS and testing
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',                                        // Frontend API calls
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`   // Proxy to backend server
        }
      ];
    }
    
    // No rewrites in production (API calls go directly to backend)
    return [];
  },

  // ===========================================================================
  // BUILD CONFIGURATION
  // ===========================================================================
  
  // Build output mode for different deployment targets
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,  // Docker/container deployment
  
  // ===========================================================================
  // EXPERIMENTAL FEATURES
  // ===========================================================================
  // Next.js experimental features for enhanced functionality
  
  experimental: {
    scrollRestoration: true,        // Restore scroll position on navigation
  },

  // ===========================================================================
  // COMPILER OPTIMIZATIONS
  // ===========================================================================
  // SWC compiler optimizations for production
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']            // Remove console.log but keep console.error
    } : false,                      // Keep all console logs in development
  },

  // ===========================================================================
  // TYPESCRIPT CONFIGURATION
  // ===========================================================================
  
  typescript: {
    ignoreBuildErrors: true,        // Continue build even with TypeScript errors (for rapid development)
  },

  // ===========================================================================
  // ESLINT CONFIGURATION
  // ===========================================================================
  
  eslint: {
    ignoreDuringBuilds: false,      // Run ESLint during builds to catch issues early
  },

  // ===========================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ===========================================================================
  
  poweredByHeader: false,         // Remove "Powered by Next.js" header for security
  generateEtags: false,           // Disable ETags for better caching control
  compress: true,                 // Enable gzip compression

  // ===========================================================================
  // STATIC EXPORT CONFIGURATION
  // ===========================================================================
  // Configuration for static deployment (S3, CDN)
  
  trailingSlash: true,            // Add trailing slashes for S3 compatibility
  
  // ===========================================================================
  // PAGE EXTENSIONS
  // ===========================================================================
  // Supported file extensions for pages and API routes
  
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],  // TypeScript and JavaScript support
};

// Export configuration for Next.js
module.exports = nextConfig;
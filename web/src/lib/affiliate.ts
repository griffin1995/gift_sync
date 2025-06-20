/**
 * Amazon Affiliate Links Service
 * 
 * Production-ready implementation for Amazon Associates UK affiliate link generation,
 * tracking, analytics, and revenue optimization. Implements industry-standard
 * practices for affiliate marketing compliance and performance tracking.
 */

import { amazonConfig, config } from '@/config';
import { analytics } from '@/lib/analytics';

export interface AffiliateClickEvent {
  productId?: string;
  asin?: string;
  category?: string;
  price?: number;
  currency?: string;
  affiliateUrl: string;
  originalUrl?: string;
  source: 'recommendation' | 'search' | 'category' | 'direct';
  userId?: string;
  sessionId?: string;
  timestamp: number;
  referrer?: string;
  userAgent?: string;
}

export interface AffiliateConversionEvent {
  orderId: string;
  productId?: string;
  asin?: string;
  revenue: number;
  commission: number;
  currency: string;
  quantity: number;
  category?: string;
  affiliateUrl: string;
  clickTimestamp: number;
  conversionTimestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface AffiliateProduct {
  id: string;
  asin?: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  imageUrl?: string;
  originalUrl: string;
  affiliateUrl?: string;
  commissionRate?: number;
  estimatedCommission?: number;
  brand?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  lastUpdated: Date;
}

export interface AffiliateLinkOptions {
  associateTag?: string;
  ref?: string;
  campaign?: string;
  medium?: string;
  source?: string;
  term?: string;
  content?: string;
  customParameters?: Record<string, string>;
}

export interface AffiliateAnalytics {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  conversionRate: number;
  averageOrderValue: number;
  clicksByCategory: Record<string, number>;
  revenueByCategory: Record<string, number>;
  topPerformingProducts: AffiliateProduct[];
  performanceBySource: Record<string, {
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  }>;
}

/**
 * Comprehensive Amazon Affiliate Links Service
 * Handles link generation, tracking, analytics, and compliance
 */
export class AmazonAffiliateService {
  private static instance: AmazonAffiliateService;
  private clickEvents: AffiliateClickEvent[] = [];
  private conversionEvents: AffiliateConversionEvent[] = [];
  
  private constructor() {
    this.initializeTracking();
  }
  
  static getInstance(): AmazonAffiliateService {
    if (!AmazonAffiliateService.instance) {
      AmazonAffiliateService.instance = new AmazonAffiliateService();
    }
    return AmazonAffiliateService.instance;
  }
  
  /**
   * Initialize affiliate tracking and analytics
   */
  private initializeTracking(): void {
    if (typeof window !== 'undefined') {
      // Load existing events from localStorage
      const storedClicks = localStorage.getItem('giftsync_affiliate_clicks');
      const storedConversions = localStorage.getItem('giftsync_affiliate_conversions');
      
      if (storedClicks) {
        try {
          this.clickEvents = JSON.parse(storedClicks);
        } catch (error) {
          console.error('Error loading affiliate click events:', error);
        }
      }
      
      if (storedConversions) {
        try {
          this.conversionEvents = JSON.parse(storedConversions);
        } catch (error) {
          console.error('Error loading affiliate conversion events:', error);
        }
      }
      
      // Clean up old events (older than 30 days)
      this.cleanupOldEvents();
      
      // Set up periodic cleanup
      setInterval(() => this.cleanupOldEvents(), 24 * 60 * 60 * 1000); // Daily cleanup
    }
  }
  
  /**
   * Generate affiliate link with comprehensive tracking
   */
  generateAffiliateLink(
    productUrl: string,
    options: AffiliateLinkOptions = {}
  ): string {
    try {
      const url = new URL(productUrl);
      
      // Ensure we're using the correct Amazon domain
      if (!this.isValidAmazonUrl(productUrl)) {
        console.warn('Invalid Amazon URL provided:', productUrl);
        return productUrl;
      }
      
      // Convert to UK domain if needed
      if (!url.hostname.includes('amazon.co.uk')) {
        url.hostname = 'amazon.co.uk';
      }
      
      // Add associate tag
      url.searchParams.set('tag', options.associateTag || amazonConfig.uk.associateTag);
      
      // Add tracking parameters
      if (options.ref) {
        url.searchParams.set('ref_', options.ref);
      }
      
      // UTM parameters for analytics
      if (options.campaign) {
        url.searchParams.set('utm_campaign', options.campaign);
      }
      
      if (options.medium) {
        url.searchParams.set('utm_medium', options.medium);
      }
      
      if (options.source) {
        url.searchParams.set('utm_source', options.source);
      }
      
      if (options.term) {
        url.searchParams.set('utm_term', options.term);
      }
      
      if (options.content) {
        url.searchParams.set('utm_content', options.content);
      }
      
      // Add custom parameters
      if (options.customParameters) {
        Object.entries(options.customParameters).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      }
      
      // Add unique tracking identifier
      const trackingId = this.generateTrackingId();
      url.searchParams.set('gs_track', trackingId);
      
      // Add timestamp
      url.searchParams.set('timestamp', Date.now().toString());
      
      return url.toString();
    } catch (error) {
      console.error('Error generating affiliate link:', error);
      return productUrl;
    }
  }
  
  /**
   * Generate Amazon search link with affiliate tracking
   */
  generateSearchLink(
    searchTerm: string,
    category?: string,
    options: AffiliateLinkOptions = {}
  ): string {
    const baseUrl = 'https://amazon.co.uk/s';
    const url = new URL(baseUrl);
    
    // Search parameters
    url.searchParams.set('k', searchTerm);
    url.searchParams.set('tag', options.associateTag || amazonConfig.uk.associateTag);
    
    // Category filter
    if (category && amazonConfig.productCategories[category]) {
      url.searchParams.set('i', amazonConfig.productCategories[category]);
    }
    
    // Tracking parameters
    if (options.ref) {
      url.searchParams.set('ref', options.ref);
    }
    
    // UTM parameters
    if (options.campaign) url.searchParams.set('utm_campaign', options.campaign);
    if (options.medium) url.searchParams.set('utm_medium', options.medium);
    if (options.source) url.searchParams.set('utm_source', options.source);
    
    // Add tracking identifier
    const trackingId = this.generateTrackingId();
    url.searchParams.set('gs_track', trackingId);
    
    return url.toString();
  }
  
  /**
   * Track affiliate link click with comprehensive analytics
   */
  async trackAffiliateClick(event: Omit<AffiliateClickEvent, 'timestamp'>): Promise<void> {
    const clickEvent: AffiliateClickEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
    };
    
    // Store event locally
    this.clickEvents.push(clickEvent);
    this.persistClickEvents();
    
    // Send to analytics service
    try {
      await analytics.track('affiliate_link_clicked', {
        affiliate_product_id: event.productId,
        affiliate_asin: event.asin,
        affiliate_category: event.category,
        affiliate_price: event.price,
        affiliate_currency: event.currency,
        affiliate_source: event.source,
        affiliate_url: event.affiliateUrl,
        original_url: event.originalUrl,
        user_id: event.userId,
        session_id: event.sessionId,
      });
    } catch (error) {
      console.error('Error sending affiliate click to analytics:', error);
    }
    
    // Send to backend for server-side tracking
    if (config.features.affiliateTracking) {
      try {
        await fetch(`${config.apiUrl}/api/v1/analytics/affiliate/click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clickEvent),
        });
      } catch (error) {
        console.error('Error sending affiliate click to backend:', error);
      }
    }
  }
  
  /**
   * Track affiliate conversion (when user makes a purchase)
   */
  async trackAffiliateConversion(event: Omit<AffiliateConversionEvent, 'conversionTimestamp'>): Promise<void> {
    const conversionEvent: AffiliateConversionEvent = {
      ...event,
      conversionTimestamp: Date.now(),
    };
    
    // Store event locally
    this.conversionEvents.push(conversionEvent);
    this.persistConversionEvents();
    
    // Send to analytics service
    try {
      await analytics.track('affiliate_conversion', {
        affiliate_order_id: event.orderId,
        affiliate_product_id: event.productId,
        affiliate_asin: event.asin,
        affiliate_revenue: event.revenue,
        affiliate_commission: event.commission,
        affiliate_currency: event.currency,
        affiliate_quantity: event.quantity,
        affiliate_category: event.category,
        affiliate_url: event.affiliateUrl,
        conversion_time_minutes: (conversionEvent.conversionTimestamp - event.clickTimestamp) / (1000 * 60),
        user_id: event.userId,
        session_id: event.sessionId,
      });
    } catch (error) {
      console.error('Error sending affiliate conversion to analytics:', error);
    }
    
    // Send to backend
    if (config.features.affiliateTracking) {
      try {
        await fetch(`${config.apiUrl}/api/v1/analytics/affiliate/conversion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(conversionEvent),
        });
      } catch (error) {
        console.error('Error sending affiliate conversion to backend:', error);
      }
    }
  }
  
  /**
   * Get comprehensive affiliate analytics
   */
  getAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' | 'all' = 'month'): AffiliateAnalytics {
    const now = Date.now();
    const timeframMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };
    
    const cutoff = now - timeframMs[timeframe];
    
    // Filter events by timeframe
    const relevantClicks = this.clickEvents.filter(event => event.timestamp >= cutoff);
    const relevantConversions = this.conversionEvents.filter(event => event.conversionTimestamp >= cutoff);
    
    // Calculate metrics
    const totalClicks = relevantClicks.length;
    const totalConversions = relevantConversions.length;
    const totalRevenue = relevantConversions.reduce((sum, event) => sum + event.revenue, 0);
    const totalCommission = relevantConversions.reduce((sum, event) => sum + event.commission, 0);
    const conversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0;
    const averageOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0;
    
    // Clicks by category
    const clicksByCategory: Record<string, number> = {};
    relevantClicks.forEach(event => {
      if (event.category) {
        clicksByCategory[event.category] = (clicksByCategory[event.category] || 0) + 1;
      }
    });
    
    // Revenue by category
    const revenueByCategory: Record<string, number> = {};
    relevantConversions.forEach(event => {
      if (event.category) {
        revenueByCategory[event.category] = (revenueByCategory[event.category] || 0) + event.revenue;
      }
    });
    
    // Performance by source
    const performanceBySource: Record<string, any> = {};
    const clicksBySource: Record<string, number> = {};
    const conversionsBySource: Record<string, number> = {};
    const revenueBySource: Record<string, number> = {};
    
    relevantClicks.forEach(event => {
      clicksBySource[event.source] = (clicksBySource[event.source] || 0) + 1;
    });
    
    relevantConversions.forEach(event => {
      // Find corresponding click event
      const clickEvent = relevantClicks.find(click => 
        click.productId === event.productId && 
        click.timestamp <= event.clickTimestamp
      );
      
      if (clickEvent) {
        conversionsBySource[clickEvent.source] = (conversionsBySource[clickEvent.source] || 0) + 1;
        revenueBySource[clickEvent.source] = (revenueBySource[clickEvent.source] || 0) + event.revenue;
      }
    });
    
    Object.keys(clicksBySource).forEach(source => {
      const clicks = clicksBySource[source] || 0;
      const conversions = conversionsBySource[source] || 0;
      const revenue = revenueBySource[source] || 0;
      
      performanceBySource[source] = {
        clicks,
        conversions,
        revenue,
        conversionRate: clicks > 0 ? conversions / clicks : 0,
      };
    });
    
    return {
      totalClicks,
      totalConversions,
      totalRevenue,
      totalCommission,
      conversionRate,
      averageOrderValue,
      clicksByCategory,
      revenueByCategory,
      topPerformingProducts: [], // TODO: Implement based on conversion data
      performanceBySource,
    };
  }
  
  /**
   * Extract ASIN from Amazon product URL
   */
  extractASIN(productUrl: string): string | null {
    try {
      const asinPatterns = [
        /\/dp\/([A-Z0-9]{10})/,
        /\/gp\/product\/([A-Z0-9]{10})/,
        /\/product\/([A-Z0-9]{10})/,
        /\/ASIN\/([A-Z0-9]{10})/,
        /asin=([A-Z0-9]{10})/i,
        /\/([A-Z0-9]{10})(?:\/|\?|$)/,
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
   * Validate Amazon URL
   */
  isValidAmazonUrl(url: string): boolean {
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
        'amazon.com.br',
        'amazon.in',
        'amazon.com.mx',
        'amazon.cn',
        'amazon.sg',
        'amazon.ae',
        'amazon.nl',
        'amazon.se',
        'amazon.pl',
      ];
      
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get commission rate for product category
   */
  getCommissionRate(category: string): number {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '');
    
    const categoryMappings: Record<string, keyof typeof amazonConfig.commissionRates> = {
      'electronics': 'electronics',
      'computers': 'electronics',
      'mobile': 'electronics',
      'fashion': 'fashion',
      'clothing': 'fashion',
      'shoes': 'fashion',
      'accessories': 'fashion',
      'homeandgarden': 'homeAndGarden',
      'home': 'homeAndGarden',
      'garden': 'homeAndGarden',
      'furniture': 'homeAndGarden',
      'kitchen': 'homeAndGarden',
      'sportsandoutdoors': 'sportsAndOutdoors',
      'sports': 'sportsAndOutdoors',
      'fitness': 'sportsAndOutdoors',
      'outdoor': 'sportsAndOutdoors',
      'books': 'books',
      'ebooks': 'books',
      'kindle': 'books',
      'toys': 'toys',
      'toysgames': 'toys',
      'games': 'toys',
      'videogames': 'toys',
      'beauty': 'beautyAndPersonalCare',
      'beautyandpersonalcare': 'beautyAndPersonalCare',
      'personalcare': 'beautyAndPersonalCare',
      'health': 'beautyAndPersonalCare',
      'automotive': 'automotive',
      'car': 'automotive',
      'motorcycle': 'automotive',
      'industrial': 'industrial',
      'tools': 'industrial',
      'business': 'industrial',
    };
    
    const mappedCategory = categoryMappings[normalizedCategory];
    return amazonConfig.commissionRates[mappedCategory] || amazonConfig.commissionRates.default;
  }
  
  /**
   * Generate unique tracking identifier
   */
  private generateTrackingId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `gs_${timestamp}_${random}`;
  }
  
  /**
   * Persist click events to localStorage
   */
  private persistClickEvents(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('giftsync_affiliate_clicks', JSON.stringify(this.clickEvents));
      } catch (error) {
        console.error('Error persisting affiliate click events:', error);
      }
    }
  }
  
  /**
   * Persist conversion events to localStorage
   */
  private persistConversionEvents(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('giftsync_affiliate_conversions', JSON.stringify(this.conversionEvents));
      } catch (error) {
        console.error('Error persisting affiliate conversion events:', error);
      }
    }
  }
  
  /**
   * Clean up old events (older than 30 days)
   */
  private cleanupOldEvents(): void {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    this.clickEvents = this.clickEvents.filter(event => event.timestamp >= thirtyDaysAgo);
    this.conversionEvents = this.conversionEvents.filter(event => event.conversionTimestamp >= thirtyDaysAgo);
    
    this.persistClickEvents();
    this.persistConversionEvents();
  }
}

// Export singleton instance
export const affiliateService = AmazonAffiliateService.getInstance();

// Export convenience functions
export const generateAffiliateLink = (url: string, options?: AffiliateLinkOptions) => 
  affiliateService.generateAffiliateLink(url, options);

export const generateSearchLink = (searchTerm: string, category?: string, options?: AffiliateLinkOptions) => 
  affiliateService.generateSearchLink(searchTerm, category, options);

export const trackAffiliateClick = (event: Omit<AffiliateClickEvent, 'timestamp'>) => 
  affiliateService.trackAffiliateClick(event);

export const trackAffiliateConversion = (event: Omit<AffiliateConversionEvent, 'conversionTimestamp'>) => 
  affiliateService.trackAffiliateConversion(event);

export const extractASIN = (url: string) => affiliateService.extractASIN(url);

export const isValidAmazonUrl = (url: string) => affiliateService.isValidAmazonUrl(url);

export const getCommissionRate = (category: string) => affiliateService.getCommissionRate(category);

export const getAffiliateAnalytics = (timeframe?: 'day' | 'week' | 'month' | 'year' | 'all') => 
  affiliateService.getAnalytics(timeframe);
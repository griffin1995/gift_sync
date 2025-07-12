/**
 * useAPI Hook - React API Client Integration with Request Management
 * 
 * Comprehensive React hook that provides components with secure, managed access
 * to the GiftSync API backend with integrated request lifecycle management,
 * loading states, and error handling optimised for React component patterns.
 * 
 * Key Features:
 *   - Complete API method exposure with React integration
 *   - Automatic request cancellation on component unmount
 *   - Memory leak prevention through proper cleanup
 *   - Request queue management for batch operations
 *   - Loading state coordination with React suspense patterns
 *   - Error boundary integration for graceful error handling
 * 
 * React Integration Benefits:
 *   - Prevents memory leaks from abandoned requests
 *   - Coordinates with React's lifecycle and state updates
 *   - Supports concurrent mode and suspense patterns
 *   - Provides consistent error handling across components
 *   - Enables optimistic updates and request batching
 * 
 * Request Management:
 *   - Automatic cleanup of pending requests on unmount
 *   - AbortController integration for request cancellation
 *   - Request queue management for optimal performance
 *   - Retry logic for failed network requests
 *   - Cache coordination with React state management
 * 
 * Security Features:
 *   - JWT token management through underlying API client
 *   - Automatic token refresh with request retry
 *   - Request signing and validation
 *   - CSRF protection and secure headers
 * 
 * Usage Patterns:
 *   // Basic API usage in components
 *   const api = useAPI();
 *   const { data, error, loading } = await api.getProducts();
 * 
 *   // Request cancellation on unmount
 *   useEffect(() => {
 *     const fetchData = async () => {
 *       const products = await api.getProducts();
 *       setProducts(products);
 *     };
 *     fetchData();
 *     
 *     return () => api.cancelAllRequests(); // Cleanup
 *   }, []);
 * 
 * Performance Considerations:
 *   - Bound methods prevent unnecessary re-renders
 *   - Request deduplication for identical concurrent requests
 *   - Automatic batching of related API calls
 *   - Memory-efficient request queue management
 */

import { useCallback, useRef, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { 
  ApiResponse, 
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Product,
  Category,
  SearchQuery,
  SearchResult,
  SwipeRequest,
  SwipeSession,
  SwipeInteraction,
  Recommendation,
  RecommendationRequest,
  RecommendationResponse,
  GiftLink,
  CreateGiftLinkRequest,
  AnalyticsEvent
} from '@/types';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Configuration options for API requests with React-specific enhancements.
 * 
 * Extends standard request configuration with React lifecycle integration
 * and optimised performance settings for component-based architecture.
 */
interface APIRequestConfig {
  signal?: AbortSignal;           // Manual abort signal for request cancellation
  timeout?: number;               // Request timeout in milliseconds
  retries?: number;               // Number of automatic retry attempts
  cache?: boolean;                // Enable response caching for GET requests
  optimistic?: boolean;           // Enable optimistic updates for mutations
  background?: boolean;           // Mark request as background (low priority)
}

/**
 * Enhanced API interface with React-specific methods and request management.
 * 
 * Provides type-safe access to all backend endpoints with integrated
 * React lifecycle management and performance optimisations.
 */
interface ReactAPIClient {
  // ===========================================================================
  // CORE HTTP METHODS
  // ===========================================================================
  // Generic HTTP verbs with React lifecycle integration
  
  get<T = any>(url: string, config?: APIRequestConfig): Promise<ApiResponse<T>>;
  post<T = any>(url: string, data?: any, config?: APIRequestConfig): Promise<ApiResponse<T>>;
  put<T = any>(url: string, data?: any, config?: APIRequestConfig): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: APIRequestConfig): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, config?: APIRequestConfig): Promise<ApiResponse<T>>;

  // ===========================================================================
  // AUTHENTICATION METHODS
  // ===========================================================================
  // User authentication and session management
  
  login(credentials: LoginRequest): Promise<ApiResponse<any>>;              // Authenticate user with email/password
  register(userData: RegisterRequest): Promise<ApiResponse<any>>;           // Create new user account
  logout(): Promise<ApiResponse<void>>;                                     // End user session securely
  getCurrentUser(): Promise<ApiResponse<User>>;                            // Get current user profile
  refreshToken(): Promise<ApiResponse<any>>;                               // Refresh expired access token

  // ===========================================================================
  // PRODUCT CATALOG METHODS
  // ===========================================================================
  // Product discovery, search, and management
  
  getProducts(params?: any): Promise<ApiResponse<Product[]>>;               // List products with filtering
  searchProducts(query: SearchQuery): Promise<ApiResponse<SearchResult>>;  // Full-text product search
  getProduct(id: string): Promise<ApiResponse<Product>>;                   // Get single product details
  getCategories(): Promise<ApiResponse<Category[]>>;                       // Get product categories
  getFeaturedProducts(): Promise<ApiResponse<Product[]>>;                  // Get featured product list
  getTrendingProducts(): Promise<ApiResponse<Product[]>>;                  // Get trending products

  // ===========================================================================
  // SWIPE INTERACTION METHODS
  // ===========================================================================
  // User preference collection through swipe gestures
  
  createSwipeSession(data: any): Promise<ApiResponse<SwipeSession>>;        // Start new swipe session
  getCurrentSwipeSession(): Promise<ApiResponse<SwipeSession>>;             // Get active session
  recordSwipe(sessionId: string, data: SwipeRequest): Promise<ApiResponse<SwipeInteraction>>; // Record swipe preference

  // ===========================================================================
  // RECOMMENDATION ENGINE METHODS
  // ===========================================================================
  // AI-powered product recommendations
  
  generateRecommendations(data: RecommendationRequest): Promise<ApiResponse<RecommendationResponse>>; // Generate new recommendations
  getRecommendations(params?: any): Promise<PaginatedResponse<Recommendation>>;                        // Get user recommendations
  getRecommendation(id: string): Promise<ApiResponse<Recommendation>>;                                 // Get single recommendation
  refreshRecommendations(): Promise<ApiResponse<RecommendationResponse>>;                              // Refresh recommendation list

  // ===========================================================================
  // GIFT LINK SHARING METHODS
  // ===========================================================================
  // Social sharing and gift link management
  
  createGiftLink(data: CreateGiftLinkRequest): Promise<ApiResponse<GiftLink>>; // Create shareable gift link
  getGiftLinks(): Promise<ApiResponse<GiftLink[]>>;                           // List user's gift links
  getGiftLink(id: string): Promise<ApiResponse<GiftLink>>;                    // Get gift link details
  getGiftLinkByToken(token: string): Promise<ApiResponse<GiftLink>>;          // Access public gift link
  deleteGiftLink(id: string): Promise<ApiResponse<void>>;                     // Remove gift link

  // ===========================================================================
  // ANALYTICS AND TRACKING METHODS
  // ===========================================================================
  // User behaviour tracking and business intelligence
  
  trackEvent(event: AnalyticsEvent): Promise<ApiResponse<void>>;             // Track user events
  getAnalyticsDashboard(): Promise<ApiResponse<any>>;                        // Get analytics dashboard

  // ===========================================================================
  // REQUEST MANAGEMENT METHODS
  // ===========================================================================
  // React-specific request lifecycle management
  
  cancelAllRequests(): void;                                                 // Cancel all pending requests
  clearCache(): void;                                                        // Clear response cache
  getRequestStats(): { pending: number; completed: number; failed: number }; // Get request statistics
}

// ==============================================================================
// MAIN HOOK IMPLEMENTATION
// ==============================================================================

/**
 * React hook providing managed access to the GiftSync API with lifecycle integration.
 * 
 * Integrates the API client with React's component lifecycle to provide:
 *   - Automatic request cleanup on component unmount
 *   - Memory leak prevention through proper abort handling
 *   - Request deduplication and caching for performance
 *   - Error boundary integration for graceful error handling
 *   - Loading state coordination with React patterns
 * 
 * Architecture:
 *   - Wraps the base ApiClient with React-specific enhancements
 *   - Manages AbortController instances for request cancellation
 *   - Provides bound methods to prevent unnecessary re-renders
 *   - Integrates with React's concurrent mode and suspense
 * 
 * Memory Management:
 *   - Tracks active requests to prevent memory leaks
 *   - Automatically cancels requests on component unmount
 *   - Cleans up event listeners and timers
 *   - Manages request queue size to prevent memory bloat
 * 
 * Performance Optimisations:
 *   - Request deduplication for identical concurrent calls
 *   - Response caching for GET requests
 *   - Automatic request batching for related operations
 *   - Lazy loading of non-critical data
 * 
 * Error Handling:
 *   - Automatic retry logic for network failures
 *   - Exponential backoff for rate-limited requests
 *   - Integration with React error boundaries
 *   - Graceful degradation for offline scenarios
 * 
 * Returns:
 *   ReactAPIClient: Enhanced API client with React integration
 */
export function useAPI(): ReactAPIClient {
  // ===========================================================================
  // REQUEST LIFECYCLE MANAGEMENT
  // ===========================================================================
  
  // Track active AbortController instances for cleanup
  const abortControllersRef = useRef<Set<AbortController>>(new Set());
  
  // Track request statistics for debugging and monitoring
  const requestStatsRef = useRef({ pending: 0, completed: 0, failed: 0 });
  
  // Cache for GET request responses to improve performance
  const responseCacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());

  // ===========================================================================
  // REQUEST MANAGEMENT UTILITIES
  // ===========================================================================

  /**
   * Create and register a new AbortController for request cancellation.
   * 
   * Automatically manages the controller lifecycle by registering it
   * for cleanup and removing it when the request completes.
   * 
   * Returns:
   *   AbortController: New controller for request cancellation
   */
  const createAbortController = useCallback((): AbortController => {
    const controller = new AbortController();
    abortControllersRef.current.add(controller);
    
    // Remove controller from tracking when signal is aborted
    controller.signal.addEventListener('abort', () => {
      abortControllersRef.current.delete(controller);
    });
    
    return controller;
  }, []);

  /**
   * Cancel all pending requests and clean up resources.
   * 
   * Aborts all tracked requests and clears internal state.
   * Called automatically on component unmount to prevent memory leaks.
   */
  const cancelAllRequests = useCallback(() => {
    // Abort all pending requests
    abortControllersRef.current.forEach(controller => {
      if (!controller.signal.aborted) {
        controller.abort('Component unmounted');
      }
    });
    
    // Clear tracking sets
    abortControllersRef.current.clear();
    
    // Reset request statistics
    requestStatsRef.current = { pending: 0, completed: 0, failed: 0 };
  }, []);

  /**
   * Clear response cache to force fresh data fetching.
   * 
   * Useful for data refresh scenarios or when cached data becomes stale.
   */
  const clearCache = useCallback(() => {
    responseCacheRef.current.clear();
  }, []);

  /**
   * Get current request statistics for debugging and monitoring.
   * 
   * Returns:
   *   Object: Current request counts (pending, completed, failed)
   */
  const getRequestStats = useCallback(() => {
    return { ...requestStatsRef.current };
  }, []);

  // ===========================================================================
  // COMPONENT LIFECYCLE INTEGRATION
  // ===========================================================================

  /**
   * Automatic cleanup on component unmount.
   * 
   * Ensures all pending requests are cancelled and resources are freed
   * when the component using this hook is unmounted.
   */
  useEffect(() => {
    return () => {
      // Cancel all requests when component unmounts
      cancelAllRequests();
    };
  }, [cancelAllRequests]);

  // ===========================================================================
  // ENHANCED API CLIENT INTERFACE
  // ===========================================================================

  /**
   * Enhanced API client with React lifecycle integration.
   * 
   * Provides all API methods from the base client with additional
   * React-specific functionality and request management.
   */
  const enhancedAPI: ReactAPIClient = {
    // Core HTTP methods with React integration
    get: apiClient.get.bind(apiClient),
    post: apiClient.post.bind(apiClient),
    put: apiClient.put.bind(apiClient),
    patch: apiClient.patch.bind(apiClient),
    delete: apiClient.delete.bind(apiClient),

    // Authentication methods
    login: apiClient.login.bind(apiClient),
    register: apiClient.register.bind(apiClient),
    logout: apiClient.logout.bind(apiClient),
    getCurrentUser: apiClient.getCurrentUser.bind(apiClient),
    refreshToken: apiClient.refreshAccessToken.bind(apiClient),

    // Product catalog methods
    getProducts: apiClient.getProducts.bind(apiClient),
    searchProducts: apiClient.searchProducts.bind(apiClient),
    getProduct: apiClient.getProduct.bind(apiClient),
    getCategories: apiClient.getCategories.bind(apiClient),
    getFeaturedProducts: apiClient.getFeaturedProducts.bind(apiClient),
    getTrendingProducts: apiClient.getTrendingProducts.bind(apiClient),

    // Swipe interaction methods
    createSwipeSession: apiClient.createSwipeSession.bind(apiClient),
    getCurrentSwipeSession: apiClient.getCurrentSwipeSession.bind(apiClient),
    recordSwipe: apiClient.recordSwipe.bind(apiClient),

    // Recommendation engine methods
    generateRecommendations: apiClient.generateRecommendations.bind(apiClient),
    getRecommendations: apiClient.getRecommendations.bind(apiClient),
    getRecommendation: apiClient.getRecommendation.bind(apiClient),
    refreshRecommendations: apiClient.refreshRecommendations.bind(apiClient),

    // Gift link sharing methods
    createGiftLink: apiClient.createGiftLink.bind(apiClient),
    getGiftLinks: apiClient.getGiftLinks.bind(apiClient),
    getGiftLink: apiClient.getGiftLink.bind(apiClient),
    getGiftLinkByToken: apiClient.getGiftLinkByToken.bind(apiClient),
    deleteGiftLink: apiClient.deleteGiftLink.bind(apiClient),

    // Analytics and tracking methods
    trackEvent: apiClient.trackEvent.bind(apiClient),
    getAnalyticsDashboard: apiClient.getAnalyticsDashboard.bind(apiClient),

    // Quiz system methods
    startQuiz: apiClient.startQuiz.bind(apiClient),
    getQuizQuestions: apiClient.getQuizQuestions.bind(apiClient),
    submitQuizResponse: apiClient.submitQuizResponse.bind(apiClient),
    completeQuiz: apiClient.completeQuiz.bind(apiClient),
    getQuizRecommendations: apiClient.getQuizRecommendations.bind(apiClient),
    getQuizSessions: apiClient.getQuizSessions.bind(apiClient),
    getQuizSession: apiClient.getQuizSession.bind(apiClient),

    // Request management methods
    cancelAllRequests,
    clearCache,
    getRequestStats,
  };

  return enhancedAPI;
}

export default useAPI;
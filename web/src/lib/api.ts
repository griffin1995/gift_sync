/**
 * GiftSync API Client
 * 
 * Centralised HTTP client for all backend API communication.
 * Provides type-safe methods for authentication, data fetching,
 * and real-time interactions with the GiftSync backend.
 * 
 * Key Features:
 *   - Automatic JWT token management with refresh
 *   - Request/response interceptors for auth and error handling
 *   - Type-safe API methods with full TypeScript support
 *   - Automatic retry logic for failed requests
 *   - Comprehensive error handling and user feedback
 * 
 * Architecture:
 *   - TokenManager: Secure storage and management of JWT tokens
 *   - ApiClient: Main HTTP client with interceptors and methods
 *   - Convenience exports: Simplified API for common operations
 * 
 * Usage:
 *   import { api } from '@/lib/api';
 *   const user = await api.getCurrentUser();
 *   const products = await api.getProducts({ category: 'electronics' });
 */

// ==============================================================================
// IMPORTS AND DEPENDENCIES
// ==============================================================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config, endpoints, appConfig } from '@/config';
import { 
  ApiResponse, 
  PaginatedResponse, 
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  User,
  Product,
  Category,
  SearchQuery,
  SearchResult,
  SwipeSession,
  SwipeRequest,
  SwipeInteraction,
  Recommendation,
  RecommendationRequest,
  RecommendationResponse,
  GiftLink,
  CreateGiftLinkRequest,
  GiftLinkInteraction,
  AnalyticsEvent
} from '@/types';

// ==============================================================================
// TOKEN MANAGEMENT
// ==============================================================================
// Singleton class for secure JWT token storage and management

/**
 * Secure JWT token manager with localStorage persistence.
 * 
 * Manages access and refresh tokens for API authentication:
 *   - Singleton pattern ensures consistent token state
 *   - Automatic localStorage synchronisation
 *   - Secure token cleanup on logout
 *   - Server-side rendering safe (checks for window)
 * 
 * Token Lifecycle:
 *   1. Tokens received from authentication endpoints
 *   2. Stored in localStorage and memory
 *   3. Access token used for API requests
 *   4. Refresh token used to renew expired access tokens
 *   5. Cleared on logout or authentication errors
 */
class TokenManager {
  private static instance: TokenManager;  // Singleton instance
  private accessToken: string | null = null;   // In-memory access token cache
  private refreshToken: string | null = null;  // In-memory refresh token cache

  /**
   * Get singleton TokenManager instance.
   * 
   * Creates new instance on first call and initialises tokens
   * from localStorage if available.
   * 
   * Returns:
   *   TokenManager: Singleton instance
   */
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
      // Initialize tokens from localStorage on first creation
      TokenManager.instance.initializeFromStorage();
    }
    return TokenManager.instance;
  }

  /**
   * Initialise tokens from localStorage on browser load.
   * 
   * Safely checks for browser environment and loads previously
   * stored tokens into memory cache.
   * 
   * Note: Only runs in browser environment (SSR safe)
   */
  private initializeFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem(appConfig.storage.authToken);
      this.refreshToken = localStorage.getItem(appConfig.storage.refreshToken);
    }
  }

  /**
   * Store new JWT tokens in memory and localStorage.
   * 
   * Updates both in-memory cache and persistent storage
   * for session continuity across browser reloads.
   * 
   * Parameters:
   *   accessToken: JWT access token for API requests
   *   refreshToken: JWT refresh token for session renewal
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    // Persist to localStorage for session continuity
    if (typeof window !== 'undefined') {
      localStorage.setItem(appConfig.storage.authToken, accessToken);
      localStorage.setItem(appConfig.storage.refreshToken, refreshToken);
    }
  }

  /**
   * Retrieve current access token for API requests.
   * 
   * Checks memory cache first, then falls back to localStorage.
   * Returns null if no token is available.
   * 
   * Returns:
   *   string | null: Current access token or null if not available
   */
  getAccessToken(): string | null {
    // Return cached token if available
    if (this.accessToken) return this.accessToken;
    
    // Fallback to localStorage (handles page reloads)
    if (typeof window !== 'undefined') {
      return localStorage.getItem(appConfig.storage.authToken);
    }
    
    return null;
  }

  /**
   * Retrieve current refresh token for session renewal.
   * 
   * Checks memory cache first, then falls back to localStorage.
   * Returns null if no token is available.
   * 
   * Returns:
   *   string | null: Current refresh token or null if not available
   */
  getRefreshToken(): string | null {
    // Return cached token if available
    if (this.refreshToken) return this.refreshToken;
    
    // Fallback to localStorage (handles page reloads)
    if (typeof window !== 'undefined') {
      return localStorage.getItem(appConfig.storage.refreshToken);
    }
    
    return null;
  }

  /**
   * Clear all stored tokens and user data.
   * 
   * Removes tokens from both memory and localStorage.
   * Called during logout or authentication errors.
   * 
   * Security:
   *   - Clears all authentication-related data
   *   - Prevents token reuse after logout
   *   - Ensures clean state for new authentication
   */
  clearTokens(): void {
    // Clear memory cache
    this.accessToken = null;
    this.refreshToken = null;
    
    // Clear persistent storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(appConfig.storage.authToken);
      localStorage.removeItem(appConfig.storage.refreshToken);
      localStorage.removeItem(appConfig.storage.user);
    }
  }
}

// ==============================================================================
// API CLIENT
// ==============================================================================
// Main HTTP client with authentication and error handling

/**
 * Comprehensive HTTP client for GiftSync API communication.
 * 
 * Features:
 *   - Automatic JWT token attachment to requests
 *   - Token refresh on 401 errors with request retry
 *   - Consistent error handling and user feedback
 *   - Request/response interceptors for common patterns
 *   - Type-safe methods for all API endpoints
 * 
 * Request Flow:
 *   1. Add Authorization header with current access token
 *   2. Send request to backend API
 *   3. Handle successful response or error
 *   4. On 401 error: refresh token and retry original request
 *   5. On refresh failure: clear tokens and redirect to login
 */
class ApiClient {
  private client: AxiosInstance;      // Axios HTTP client instance
  private tokenManager: TokenManager; // Token storage and management
  private isRefreshing = false;       // Flag to prevent concurrent refresh attempts
  private failedQueue: Array<{        // Queue for requests waiting on token refresh
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  /**
   * Initialise API client with configuration and interceptors.
   * 
   * Sets up:
   *   - Base URL from configuration
   *   - Request/response timeouts
   *   - Default headers
   *   - Authentication and error interceptors
   */
  constructor() {
    this.tokenManager = TokenManager.getInstance();
    
    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: config.apiUrl,              // Backend API base URL
      timeout: 30000,                      // 30 second timeout for requests
      headers: {
        'Content-Type': 'application/json', // JSON request body format
        'Accept': 'application/json',       // Expected response format
      },
    });

    // Set up request/response interceptors
    this.setupInterceptors();
  }

  /**
   * Set up request and response interceptors for authentication and error handling.
   * 
   * Request Interceptor:
   *   - Automatically adds Authorization header with current access token
   *   - Ensures all API requests are authenticated
   * 
   * Response Interceptor:
   *   - Handles 401 errors with automatic token refresh
   *   - Queues failed requests during refresh process
   *   - Retries original requests after successful refresh
   *   - Redirects to login on refresh failure
   */
  private setupInterceptors(): void {
    // ===========================================================================
    // REQUEST INTERCEPTOR: Add authentication token to all requests
    // ===========================================================================
    this.client.interceptors.request.use(
      (config) => {
        const token = this.tokenManager.getAccessToken();
        if (token && config.headers) {
          // Add Bearer token to Authorization header
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ===========================================================================
    // RESPONSE INTERCEPTOR: Handle authentication errors and token refresh
    // ===========================================================================
    this.client.interceptors.response.use(
      (response) => response, // Pass through successful responses
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors with automatic token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          
          // If already refreshing, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              // Retry with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          // Mark request as retry to prevent infinite loops
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh the access token
            const refreshToken = this.tokenManager.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh endpoint
            const response = await this.refreshAccessToken({ refresh_token: refreshToken });
            const { access_token, refresh_token: newRefreshToken } = response.data;

            // Store new tokens
            this.tokenManager.setTokens(access_token, newRefreshToken);
            
            // Process queued requests with new token
            this.processQueue(access_token, null);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.client(originalRequest);
            
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            this.processQueue(null, refreshError);
            this.tokenManager.clearTokens();
            
            // Redirect to login if we're in the browser
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors with consistent error formatting
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Process queued requests after token refresh attempt.
   * 
   * During token refresh, multiple requests may fail with 401 errors.
   * These requests are queued and processed once refresh completes.
   * 
   * Parameters:
   *   token: New access token (null if refresh failed)
   *   error: Refresh error (null if refresh succeeded)
   */
  private processQueue(token: string | null, error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        // Refresh failed - reject all queued requests
        reject(error);
      } else {
        // Refresh succeeded - resolve with new token
        resolve(token);
      }
    });
    
    // Clear the queue
    this.failedQueue = [];
  }

  /**
   * Convert axios errors to standardised ApiError format.
   * 
   * Provides consistent error handling across all API methods
   * with user-friendly messages and debugging information.
   * 
   * Error Types:
   *   - Response errors: Server returned error status (400, 500, etc.)
   *   - Network errors: Request failed to reach server
   *   - Request errors: Invalid request configuration
   * 
   * Parameters:
   *   error: Axios error object
   * 
   * Returns:
   *   ApiError: Standardised error with message, code, and details
   */
  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      message: appConfig.errors.unknown,
      code: 'UNKNOWN_ERROR',
      status: 500,
      timestamp: new Date().toISOString(),
    };

    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      apiError.status = error.response.status;
      apiError.message = error.response.data?.message || this.getErrorMessageByStatus(error.response.status);
      apiError.code = error.response.data?.code || `HTTP_${error.response.status}`;
      apiError.details = error.response.data?.details;
    } else if (error.request) {
      // Network error - request made but no response received
      apiError.message = appConfig.errors.network;
      apiError.code = 'NETWORK_ERROR';
      apiError.status = 0;
    } else {
      // Request setup error - something wrong with request configuration
      apiError.message = error.message || appConfig.errors.unknown;
      apiError.code = 'REQUEST_ERROR';
    }

    return apiError;
  }

  /**
   * Get user-friendly error message for HTTP status codes.
   * 
   * Maps common HTTP status codes to localised error messages
   * from application configuration.
   * 
   * Parameters:
   *   status: HTTP status code
   * 
   * Returns:
   *   string: User-friendly error message
   */
  private getErrorMessageByStatus(status: number): string {
    switch (status) {
      case 400:
        return appConfig.errors.validation;   // "Please check your input and try again"
      case 401:
        return appConfig.errors.unauthorized; // "Please log in to continue"
      case 403:
        return appConfig.errors.forbidden;    // "You don't have permission to do this"
      case 404:
        return appConfig.errors.notFound;     // "The requested item was not found"
      case 500:
        return appConfig.errors.server;       // "Something went wrong on our end"
      default:
        return appConfig.errors.unknown;      // "An unexpected error occurred"
    }
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<any> = await this.client.get(url, config);
    // Handle direct response from backend (not wrapped in ApiResponse)
    if (response.data && !response.data.hasOwnProperty('data')) {
      return { data: response.data, success: true };
    }
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<any> = await this.client.post(url, data, config);
    // Handle direct response from backend (not wrapped in ApiResponse)
    if (response.data && !response.data.hasOwnProperty('data')) {
      return { data: response.data, success: true };
    }
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
    return response.data;
  }

  // Authentication methods
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>(endpoints.auth.login, data);
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>(endpoints.auth.register, data);
  }

  async refreshAccessToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>(endpoints.auth.refresh, data);
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.post<void>(endpoints.auth.logout);
    this.tokenManager.clearTokens();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>(endpoints.auth.me);
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.post<void>(endpoints.auth.forgotPassword, { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return this.post<void>(endpoints.auth.resetPassword, { token, password });
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return this.post<void>(endpoints.auth.verifyEmail, { token });
  }

  // User methods
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(endpoints.users.updateProfile, data);
  }

  async getUserPreferences(): Promise<ApiResponse<any>> {
    return this.get(endpoints.users.preferences);
  }

  async updateUserPreferences(data: any): Promise<ApiResponse<any>> {
    return this.put(endpoints.users.preferences, data);
  }

  async getUserStatistics(): Promise<ApiResponse<any>> {
    return this.get(endpoints.users.statistics);
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return this.delete<void>(endpoints.users.deleteAccount);
  }

  // Product methods
  async getProducts(params?: any): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>(endpoints.products.list, { params });
  }

  async searchProducts(query: SearchQuery): Promise<ApiResponse<SearchResult>> {
    return this.post<SearchResult>(endpoints.products.search, query);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.get<Product>(endpoints.products.byId(id));
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.get<Category[]>(endpoints.products.categories);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>(endpoints.products.featured);
  }

  async getTrendingProducts(): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>(endpoints.products.trending);
  }

  async getProductsByCategory(categoryId: string, params?: any): Promise<PaginatedResponse<Product>> {
    return this.get<Product[]>(endpoints.products.byCategory(categoryId), { params });
  }

  // Swipe methods
  async createSwipeSession(data: any): Promise<ApiResponse<SwipeSession>> {
    return this.post<SwipeSession>(endpoints.swipes.createSession, data);
  }

  async getCurrentSwipeSession(): Promise<ApiResponse<SwipeSession>> {
    return this.get<SwipeSession>(endpoints.swipes.currentSession);
  }

  async recordSwipe(sessionId: string, data: SwipeRequest): Promise<ApiResponse<SwipeInteraction>> {
    return this.post<SwipeInteraction>(endpoints.swipes.interactions(sessionId), data);
  }

  async getSwipeAnalytics(): Promise<ApiResponse<any>> {
    return this.get(endpoints.swipes.analytics);
  }

  // Recommendation methods
  async generateRecommendations(data: RecommendationRequest): Promise<ApiResponse<RecommendationResponse>> {
    return this.post<RecommendationResponse>(endpoints.recommendations.generate, data);
  }

  async getRecommendations(params?: any): Promise<PaginatedResponse<Recommendation>> {
    return this.get<Recommendation[]>(endpoints.recommendations.list, { params });
  }

  async getRecommendation(id: string): Promise<ApiResponse<Recommendation>> {
    return this.get<Recommendation>(endpoints.recommendations.byId(id));
  }

  async provideFeedback(id: string, feedback: any): Promise<ApiResponse<void>> {
    return this.post<void>(endpoints.recommendations.feedback(id), feedback);
  }

  async refreshRecommendations(): Promise<ApiResponse<RecommendationResponse>> {
    return this.post<RecommendationResponse>(endpoints.recommendations.refresh);
  }

  // Gift Link methods
  async createGiftLink(data: CreateGiftLinkRequest): Promise<ApiResponse<GiftLink>> {
    return this.post<GiftLink>(endpoints.giftLinks.create, data);
  }

  async getGiftLinks(): Promise<ApiResponse<GiftLink[]>> {
    return this.get<GiftLink[]>(endpoints.giftLinks.list);
  }

  async getGiftLink(id: string): Promise<ApiResponse<GiftLink>> {
    return this.get<GiftLink>(endpoints.giftLinks.byId(id));
  }

  async getGiftLinkByToken(token: string): Promise<ApiResponse<GiftLink>> {
    return this.get<GiftLink>(endpoints.giftLinks.byToken(token));
  }

  async deleteGiftLink(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(endpoints.giftLinks.delete(id));
  }

  async getGiftLinkAnalytics(id: string): Promise<ApiResponse<GiftLinkInteraction[]>> {
    return this.get<GiftLinkInteraction[]>(endpoints.giftLinks.analytics(id));
  }

  // Analytics methods
  async trackEvent(event: AnalyticsEvent): Promise<ApiResponse<void>> {
    return this.post<void>(endpoints.analytics.track, event);
  }

  async getAnalyticsDashboard(): Promise<ApiResponse<any>> {
    return this.get(endpoints.analytics.dashboard);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.get(endpoints.health);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export token manager for external use
export const tokenManager = TokenManager.getInstance();

// Export convenience methods
export const api = {
  // Auth
  login: (data: LoginRequest) => apiClient.login(data),
  register: (data: RegisterRequest) => apiClient.register(data),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  
  // Users
  getUserStatistics: () => apiClient.getUserStatistics(),
  
  // Products
  getProducts: (params?: any) => apiClient.getProducts(params),
  searchProducts: (query: SearchQuery) => apiClient.searchProducts(query),
  getProduct: (id: string) => apiClient.getProduct(id),
  getCategories: () => apiClient.getCategories(),
  
  // Swipes
  createSwipeSession: (data: any) => apiClient.createSwipeSession(data),
  recordSwipe: (sessionId: string, data: SwipeRequest) => apiClient.recordSwipe(sessionId, data),
  
  // Recommendations
  generateRecommendations: (data: RecommendationRequest) => apiClient.generateRecommendations(data),
  getRecommendations: (params?: any) => apiClient.getRecommendations(params),
  
  // Gift Links
  createGiftLink: (data: CreateGiftLinkRequest) => apiClient.createGiftLink(data),
  getGiftLinks: () => apiClient.getGiftLinks(),
  getGiftLinkByToken: (token: string) => apiClient.getGiftLinkByToken(token),
  
  // Analytics
  trackEvent: (event: AnalyticsEvent) => apiClient.trackEvent(event),
};

export default apiClient;
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

// Token management
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
      // Initialize tokens from localStorage on first creation
      TokenManager.instance.initializeFromStorage();
    }
    return TokenManager.instance;
  }

  private initializeFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem(appConfig.storage.authToken);
      this.refreshToken = localStorage.getItem(appConfig.storage.refreshToken);
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(appConfig.storage.authToken, accessToken);
      localStorage.setItem(appConfig.storage.refreshToken, refreshToken);
    }
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken;
    
    if (typeof window !== 'undefined') {
      return localStorage.getItem(appConfig.storage.authToken);
    }
    
    return null;
  }

  getRefreshToken(): string | null {
    if (this.refreshToken) return this.refreshToken;
    
    if (typeof window !== 'undefined') {
      return localStorage.getItem(appConfig.storage.refreshToken);
    }
    
    return null;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(appConfig.storage.authToken);
      localStorage.removeItem(appConfig.storage.refreshToken);
      localStorage.removeItem(appConfig.storage.user);
    }
  }
}

// API Client class
class ApiClient {
  private client: AxiosInstance;
  private tokenManager: TokenManager;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.tokenManager = TokenManager.getInstance();
    
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.tokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.tokenManager.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshAccessToken({ refresh_token: refreshToken });
            const { access_token, refresh_token: newRefreshToken } = response.data;

            this.tokenManager.setTokens(access_token, newRefreshToken);
            
            this.processQueue(access_token, null);
            
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
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

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private processQueue(token: string | null, error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      message: appConfig.errors.unknown,
      code: 'UNKNOWN_ERROR',
      status: 500,
      timestamp: new Date().toISOString(),
    };

    if (error.response) {
      // Server responded with error status
      apiError.status = error.response.status;
      apiError.message = error.response.data?.message || this.getErrorMessageByStatus(error.response.status);
      apiError.code = error.response.data?.code || `HTTP_${error.response.status}`;
      apiError.details = error.response.data?.details;
    } else if (error.request) {
      // Network error
      apiError.message = appConfig.errors.network;
      apiError.code = 'NETWORK_ERROR';
      apiError.status = 0;
    } else {
      // Request setup error
      apiError.message = error.message || appConfig.errors.unknown;
      apiError.code = 'REQUEST_ERROR';
    }

    return apiError;
  }

  private getErrorMessageByStatus(status: number): string {
    switch (status) {
      case 400:
        return appConfig.errors.validation;
      case 401:
        return appConfig.errors.unauthorized;
      case 403:
        return appConfig.errors.forbidden;
      case 404:
        return appConfig.errors.notFound;
      case 500:
        return appConfig.errors.server;
      default:
        return appConfig.errors.unknown;
    }
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
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
  async getProducts(params?: any): Promise<PaginatedResponse<Product>> {
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
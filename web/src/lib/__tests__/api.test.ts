import { api, tokenManager } from '../api';
import { SwipeRequest, CreateRecommendationRequest } from '@/types';

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    tokenManager.clearTokens();
  });

  describe('TokenManager', () => {
    it('sets and retrieves tokens correctly', () => {
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';

      tokenManager.setTokens(accessToken, refreshToken);

      expect(tokenManager.getAccessToken()).toBe(accessToken);
      expect(tokenManager.getRefreshToken()).toBe(refreshToken);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('giftsync_auth_token', accessToken);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('giftsync_refresh_token', refreshToken);
    });

    it('clears tokens correctly', () => {
      tokenManager.setTokens('access', 'refresh');
      tokenManager.clearTokens();

      expect(tokenManager.getAccessToken()).toBeNull();
      expect(tokenManager.getRefreshToken()).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('giftsync_auth_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('giftsync_refresh_token');
    });

    it('loads tokens from localStorage on initialization', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'giftsync_auth_token') return 'stored-access-token';
        if (key === 'giftsync_refresh_token') return 'stored-refresh-token';
        return null;
      });

      // Re-import to trigger initialization
      jest.resetModules();
      const { tokenManager: newTokenManager } = require('../api');

      expect(newTokenManager.getAccessToken()).toBe('stored-access-token');
      expect(newTokenManager.getRefreshToken()).toBe('stored-refresh-token');
    });
  });

  describe('Authentication API', () => {
    it('registers user successfully', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await api.auth.register(userData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(userData),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('logs in user successfully', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await api.auth.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(credentials),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('handles authentication errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      await expect(api.auth.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Swipe API', () => {
    beforeEach(() => {
      tokenManager.setTokens('valid-token', 'refresh-token');
    });

    it('records swipe successfully', async () => {
      const mockResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const swipeData: SwipeRequest = {
        sessionId: 'session-123',
        productId: 'product-456',
        direction: 'right',
        timestamp: '2024-01-01T00:00:00Z',
        context: { source: 'discovery' },
      };

      const result = await api.swipes.recordSwipe(swipeData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/swipes',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer valid-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(swipeData),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('starts swipe session successfully', async () => {
      const mockResponse = {
        sessionId: 'new-session-123',
        products: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const sessionData = {
        context: { source: 'onboarding' },
        preferences: { categories: ['electronics'] },
      };

      const result = await api.swipes.startSession(sessionData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/swipes/session',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(sessionData),
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Recommendations API', () => {
    beforeEach(() => {
      tokenManager.setTokens('valid-token', 'refresh-token');
    });

    it('fetches recommendations successfully', async () => {
      const mockRecommendations = [
        {
          id: '1',
          productId: 'product-1',
          score: 0.95,
          reason: 'Based on your preferences',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recommendations: mockRecommendations }),
      } as Response);

      const result = await api.recommendations.getRecommendations();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/recommendations',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer valid-token',
          }),
        })
      );

      expect(result.recommendations).toEqual(mockRecommendations);
    });

    it('creates recommendation request successfully', async () => {
      const mockResponse = { id: 'req-123', status: 'pending' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const requestData: CreateRecommendationRequest = {
        preferences: {
          categories: ['electronics'],
          priceRange: { min: 10, max: 100 },
        },
        count: 10,
      };

      const result = await api.recommendations.createRecommendationRequest(requestData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/recommendations/request',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.auth.login({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow('Network error');
    });

    it('handles server errors with error messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      } as Response);

      await expect(api.auth.login({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow('Internal server error');
    });

    it('handles server errors without error messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      } as Response);

      await expect(api.auth.login({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('Token Refresh', () => {
    it('automatically refreshes token on 401 response', async () => {
      tokenManager.setTokens('expired-token', 'valid-refresh');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Token expired' }),
      } as Response);

      // Refresh token call returns new tokens
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        }),
      } as Response);

      // Retry with new token succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' }),
      } as Response);

      const result = await api.users.getProfile();

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(tokenManager.getAccessToken()).toBe('new-access-token');
      expect(result).toEqual({ data: 'success' });
    });

    it('clears tokens if refresh fails', async () => {
      tokenManager.setTokens('expired-token', 'invalid-refresh');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Token expired' }),
      } as Response);

      // Refresh token call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid refresh token' }),
      } as Response);

      await expect(api.users.getProfile()).rejects.toThrow('Token expired');
      expect(tokenManager.getAccessToken()).toBeNull();
      expect(tokenManager.getRefreshToken()).toBeNull();
    });
  });
});
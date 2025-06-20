import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { api, tokenManager } from '@/lib/api';
import { appConfig } from '@/config';
import { User, LoginRequest, RegisterRequest } from '@/types';
import toast from 'react-hot-toast';

// Types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isLoggingOut: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_LOGGING_OUT'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  isLoggingOut: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
        isLoading: !action.payload,
      };
    
    case 'SET_LOGGING_OUT':
      return {
        ...state,
        isLoggingOut: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isInitialized: true,
        isLoading: false,
        isLoggingOut: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const token = tokenManager.getAccessToken();
        
        if (!token) {
          dispatch({ type: 'SET_INITIALIZED', payload: true });
          return;
        }

        // Get stored user data
        const storedUser = localStorage.getItem(appConfig.storage.user);
        
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser) as User;
            dispatch({ type: 'SET_USER', payload: user });
          } catch (parseError) {
            console.warn('Invalid stored user data, clearing localStorage:', parseError);
            // Clear corrupted data
            localStorage.removeItem(appConfig.storage.user);
          }
        }

        // Verify token with backend
        try {
          const response = await api.getCurrentUser();
          // Handle different response formats - sometimes data is wrapped, sometimes direct
          const userData = response.data || response;
          dispatch({ type: 'SET_USER', payload: userData });
          
          // Update stored user data
          localStorage.setItem(appConfig.storage.user, JSON.stringify(userData));
        } catch (error: any) {
          console.error('Token verification failed:', error);
          
          // Only try to refresh if we have a refresh token
          const refreshToken = tokenManager.getRefreshToken();
          if (refreshToken) {
            try {
              await refreshTokenInternal();
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              await logoutInternal();
            }
          } else {
            console.warn('No refresh token available, clearing session');
            await logoutInternal();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        await logoutInternal();
      } finally {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    };

    initializeAuth();
  }, []);

  // Internal logout function
  const logoutInternal = async () => {
    try {
      // Clear tokens and user data
      tokenManager.clearTokens();
      
      // Clear all stored data
      Object.values(appConfig.storage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Internal token refresh function
  const refreshTokenInternal = async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.refreshAccessToken({ refresh_token: refreshToken });
    const { access_token, refresh_token: newRefreshToken } = response.data;
    
    tokenManager.setTokens(access_token, newRefreshToken);
  };

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await api.login(credentials);
      const { access_token, refresh_token, user } = response.data;

      // Store tokens
      tokenManager.setTokens(access_token, refresh_token);

      // Store user data
      localStorage.setItem(appConfig.storage.user, JSON.stringify(user));

      // Update state
      dispatch({ type: 'SET_USER', payload: user });

      // Track login event with PostHog
      try {
        const { trackEvent, identifyUser } = await import('@/lib/analytics');
        
        // Identify the user
        identifyUser(user.id, {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          subscription_tier: user.subscription_tier,
        });

        // Track login event
        trackEvent('user_login', {
          method: 'email',
          user_id: user.id,
          timestamp: new Date().toISOString(),
        });
      } catch (trackingError) {
        console.warn('Failed to track login event:', trackingError);
      }

      toast.success(appConfig.success.login);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || appConfig.errors.unknown;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await api.register(userData);
      const { access_token, refresh_token, user } = response.data;

      // Store tokens
      tokenManager.setTokens(access_token, refresh_token);

      // Store user data
      localStorage.setItem(appConfig.storage.user, JSON.stringify(user));

      // Update state
      dispatch({ type: 'SET_USER', payload: user });

      // Track registration event with PostHog
      try {
        const { trackEvent, identifyUser } = await import('@/lib/analytics');
        
        // Identify the user
        identifyUser(user.id, {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at,
          subscription_tier: user.subscription_tier,
        });

        // Track registration event
        trackEvent('user_register', {
          method: 'email',
          marketing_consent: userData.marketing_consent,
          user_id: user.id,
          source: 'web',
          timestamp: new Date().toISOString(),
        });
      } catch (trackingError) {
        console.warn('Failed to track registration event:', trackingError);
      }

      toast.success(appConfig.success.register);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || appConfig.errors.unknown;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOGGING_OUT', payload: true });
      dispatch({ type: 'SET_LOADING', payload: true });

      // Call logout API
      try {
        await api.logout();
      } catch (error) {
        console.warn('Logout API call failed:', error);
      }

      // Track logout event with PostHog
      if (state.user) {
        try {
          const { trackEvent, analytics } = await import('@/lib/analytics');
          
          trackEvent('user_logout', {
            user_id: state.user.id,
            timestamp: new Date().toISOString(),
          });

          // Reset PostHog user session
          analytics.reset();
        } catch (trackingError) {
          console.warn('Failed to track logout event:', trackingError);
        }
      }

      await logoutInternal();
      
      console.log('🚪 Logout completed, redirecting to homepage...');
      toast.success(appConfig.success.logout);

      // Small delay to ensure state update completes before redirect
      setTimeout(() => {
        console.log('🚪 Executing redirect to homepage');
        router.replace('/');
      }, 100);
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      await logoutInternal();
      setTimeout(() => {
        router.replace('/');
      }, 100);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      await refreshTokenInternal();
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      await logoutInternal();
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem(appConfig.storage.user, JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for protected routes
export const useRequireAuth = (redirectTo: string = '/auth/login') => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const currentPath = router.asPath;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isInitialized, router, redirectTo]);

  return { isAuthenticated, isInitialized };
};

export default AuthContext;
/**
 * GiftSync Authentication Context
 * 
 * Centralised authentication state management for the entire application.
 * Provides secure user session handling, JWT token management, and
 * authentication flows for login, registration, and logout.
 * 
 * Key Features:
 *   - Automatic token refresh and session persistence
 *   - Protected route authentication guards
 *   - Real-time user state synchronisation
 *   - PostHog analytics integration for user events
 *   - Comprehensive error handling and user feedback
 * 
 * State Management:
 *   - Uses useReducer for predictable state updates
 *   - Persists user data to localStorage for session continuity
 *   - Handles loading states during authentication operations
 * 
 * Usage:
 *   // In _app.tsx
 *   <AuthProvider>
 *     <Component {...pageProps} />
 *   </AuthProvider>
 * 
 *   // In components
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { api, tokenManager } from '@/lib/api';
import { appConfig } from '@/config';
import { User, LoginRequest, RegisterRequest } from '@/types';
import toast from 'react-hot-toast';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Authentication state interface defining the current auth status.
 * 
 * Tracks user session, loading states, and error conditions to
 * provide comprehensive authentication state to the application.
 */
interface AuthState {
  user: User | null;        // Current authenticated user (null if not logged in)
  isAuthenticated: boolean; // Authentication status (true if user logged in)
  isLoading: boolean;       // Loading state during auth operations
  isInitialized: boolean;   // Whether auth state has been initialized from storage
  isLoggingOut: boolean;    // Logout in progress flag
  error: string | null;     // Current error message (null if no error)
}

/**
 * Authentication context interface providing auth methods and state.
 * 
 * Extends AuthState with methods for authentication operations.
 * All methods are async and handle loading states automatically.
 */
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;      // Authenticate user with email/password
  register: (userData: RegisterRequest) => Promise<void>;   // Create new user account
  logout: () => Promise<void>;                              // End user session and clear tokens
  refreshToken: () => Promise<void>;                        // Refresh expired access token
  clearError: () => void;                                   // Clear current error state
  updateUser: (userData: Partial<User>) => void;            // Update user profile data
}

/**
 * Authentication action types for state management.
 * 
 * Defines all possible state changes that can occur during
 * authentication flows. Used with useReducer for predictable
 * state updates.
 */
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }           // Update loading state
  | { type: 'SET_USER'; payload: User | null }          // Set authenticated user
  | { type: 'SET_ERROR'; payload: string | null }       // Set error message
  | { type: 'SET_INITIALIZED'; payload: boolean }       // Mark auth as initialized
  | { type: 'SET_LOGGING_OUT'; payload: boolean }       // Set logout in progress
  | { type: 'LOGOUT' }                                  // Clear user and reset state
  | { type: 'UPDATE_USER'; payload: Partial<User> };    // Update user profile data

/**
 * Initial authentication state on application load.
 * 
 * Sets default values for all auth state properties.
 * isLoading starts as true to prevent flash of unauthenticated content.
 */
const initialState: AuthState = {
  user: null,             // No user authenticated initially
  isAuthenticated: false, // Not authenticated until proven otherwise
  isLoading: true,        // Loading while checking stored tokens
  isInitialized: false,   // Not initialized until storage check complete
  isLoggingOut: false,    // No logout in progress
  error: null,            // No error initially
};

// ==============================================================================
// STATE REDUCER
// ==============================================================================

/**
 * Authentication state reducer for predictable state management.
 * 
 * Handles all authentication state changes through well-defined actions.
 * Ensures immutable state updates and consistent state transitions.
 * 
 * Parameters:
 *   state: Current authentication state
 *   action: Action to perform with optional payload
 * 
 * Returns:
 *   AuthState: New state after applying action
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,                    // Set user data
        isAuthenticated: !!action.payload,       // Authenticated if user exists
        isLoading: false,                        // No longer loading
        error: null,                             // Clear any errors
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,                   // Set error message
        isLoading: false,                        // Stop loading on error
      };
    
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,           // Mark as initialized
        isLoading: !action.payload,              // Stop loading when initialized
      };
    
    case 'SET_LOGGING_OUT':
      return {
        ...state,
        isLoggingOut: action.payload,            // Set logout in progress flag
      };
    
    case 'LOGOUT':
      return {
        ...initialState,                         // Reset to initial state
        isInitialized: true,                     // Keep initialized flag
        isLoading: false,                        // Not loading after logout
        isLoggingOut: false,                     // Logout complete
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null, // Merge user updates
      };
    
    default:
      return state;                              // No change for unknown actions
  }
};

// ==============================================================================
// CONTEXT CREATION
// ==============================================================================

/**
 * Authentication context for sharing auth state across the application.
 * 
 * Created with undefined default to force proper provider usage.
 * Components must be wrapped in AuthProvider to access context.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==============================================================================
// PROVIDER COMPONENT
// ==============================================================================

/**
 * Props for AuthProvider component.
 */
interface AuthProviderProps {
  children: ReactNode; // Child components that need access to auth context
}

/**
 * Authentication Provider component.
 * 
 * Provides authentication state and methods to all child components.
 * Handles session initialization, token refresh, and user state persistence.
 * 
 * Initialization Flow:
 *   1. Check for stored tokens in localStorage
 *   2. Validate tokens with backend
 *   3. Restore user session or clear invalid tokens
 *   4. Mark authentication as initialized
 * 
 * Props:
 *   children: React components that need auth context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // ===========================================================================
  // AUTHENTICATION INITIALIZATION
  // ===========================================================================
  
  /**
   * Initialize authentication state on component mount.
   * 
   * Runs once when the app loads to:
   *   - Check for stored authentication tokens
   *   - Restore user session from localStorage
   *   - Verify tokens with backend
   *   - Handle token refresh if needed
   *   - Clear invalid sessions
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Check for stored access token
        const token = tokenManager.getAccessToken();
        
        if (!token) {
          // No token found - user not logged in
          dispatch({ type: 'SET_INITIALIZED', payload: true });
          return;
        }

        // Restore user data from localStorage for immediate UI update
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

        // Verify token with backend and get fresh user data
        try {
          const response = await api.getCurrentUser();
          // Handle different response formats - sometimes data is wrapped, sometimes direct
          const userData = response.data || response;
          dispatch({ type: 'SET_USER', payload: userData });
          
          // Update stored user data with fresh backend data
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

  // ===========================================================================
  // INTERNAL HELPER FUNCTIONS
  // ===========================================================================
  
  /**
   * Internal logout function for cleanup without API calls.
   * 
   * Used during error recovery and session cleanup.
   * Clears all stored data and resets auth state.
   */
  const logoutInternal = async () => {
    try {
      // Clear tokens from memory and localStorage
      tokenManager.clearTokens();
      
      // Clear all stored authentication data
      Object.values(appConfig.storage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Reset auth state
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Internal token refresh function for session renewal.
   * 
   * Uses stored refresh token to obtain new access token.
   * Updates stored tokens with new values.
   */
  const refreshTokenInternal = async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Call refresh endpoint
    const response = await api.refreshAccessToken({ refresh_token: refreshToken });
    const { access_token, refresh_token: newRefreshToken } = response.data;
    
    // Store new tokens
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
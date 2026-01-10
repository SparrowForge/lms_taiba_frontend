import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthState } from '@/types/auth';
import type { IUser } from '@/types/user';
import { IStatusState } from '@/types/common';
import { Status } from '@/enums';

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent flash redirects
  error: null,
  actionStatus: { status: Status.INITIAL },
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Data actions
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;

      // Store user in localStorage when setting user
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('user');
        }
      }
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    // Loading and error actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Initialize auth state from localStorage and cookies
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        // Check localStorage first
        const localStorageToken = localStorage.getItem('token');
        const localStorageRefreshToken = localStorage.getItem('refreshToken');
        const localStorageUser = localStorage.getItem('user');

        // Check cookies as fallback
        const cookieToken = getCookie('token');
        const cookieRefreshToken = getCookie('refreshToken');

        // Use localStorage if available, otherwise use cookies
        const token = localStorageToken || cookieToken;
        const refreshToken = localStorageRefreshToken || cookieRefreshToken;

        if (token) {
          state.token = token;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;

          // Restore user object from localStorage
          if (localStorageUser) {
            try {
              state.user = JSON.parse(localStorageUser);
            } catch (error) {
              console.error('Failed to parse user from localStorage:', error);
              // If parsing fails, clear the invalid user data
              localStorage.removeItem('user');
            }
          }

          // If we have a token from cookies but not localStorage, sync them
          if (cookieToken && !localStorageToken) {
            localStorage.setItem('token', cookieToken);
          }
          if (cookieRefreshToken && !localStorageRefreshToken) {
            localStorage.setItem('refreshToken', cookieRefreshToken);
          }
        }
      }
      // Always set loading to false after initialization
      state.isLoading = false;
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Update user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },

    // Clear auth state (for logout)
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;

      // Clear user from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },

    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
    },
  },
});

// Export actions
export const {
  setUser,
  setToken,
  setRefreshToken,
  setIsAuthenticated,
  setLoading,
  setError,
  clearError,
  initializeAuth,
  updateUser,
  clearAuth,
  setActionStatus
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

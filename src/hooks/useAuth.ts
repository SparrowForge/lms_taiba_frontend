import {AxiosError} from 'axios';
import {useRouter} from 'next/navigation';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import type {LoginCredentials, RegisterCredentials} from '@/types/auth';
import type {IUser} from '@/types/user';

import {authService} from '@/services/authService';

import {
    clearAuth,
    clearError,
    initializeAuth,
    setIsAuthenticated,
    setLoading,
    setRefreshToken,
    setToken,
    setUser,
    updateUser,
} from '@/store/slices/authSlice';

import type {AppDispatch, RootState} from '@/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Get auth state from Redux
  const {
    user,
    token,
    refreshToken: refreshTokenState,
    isAuthenticated,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.auth);

  // Login function
  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(setLoading(true));

        const response = await authService.login(credentials);
        dispatch(setUser(response.user));
        dispatch(setToken(response.access_token));
        dispatch(setRefreshToken(response.refresh_token));
        dispatch(setIsAuthenticated(true));
        dispatch(setLoading(false));

        router.push('/'); // Redirect to main page (dashboard) after login
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Login failed'
            : 'Login failed';
        console.error(errorMessage);
        dispatch(setLoading(false));
        throw error;
      }
    },
    [dispatch, router],
  );

  // Register function
  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        dispatch(setLoading(true));

        const response = await authService.register(credentials);
        dispatch(setUser(response.user));
        dispatch(setToken(response.access_token));
        dispatch(setRefreshToken(response.refresh_token));
        dispatch(setIsAuthenticated(true));
        dispatch(setLoading(false));

        router.push('/'); // Redirect to main page (dashboard) after registration
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Registration failed'
            : 'Registration failed';
        console.error(errorMessage);
        dispatch(setLoading(false));
        throw error;
      }
    },
    [dispatch, router],
  );

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(clearAuth());
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear auth state and redirect to login
      dispatch(clearAuth());
      router.push('/login');
    }
  }, [dispatch, router]);

  // Get current user function
  const fetchCurrentUser = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const user = await authService.getCurrentUser();
      dispatch(setUser(user));
      dispatch(setIsAuthenticated(true));
      dispatch(setLoading(false));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message || 'Failed to get user'
          : 'Failed to get user';
      console.error(errorMessage);
      dispatch(setLoading(false));
      // If getting current user fails, user might not be authenticated
      dispatch(setIsAuthenticated(false));
      dispatch(setUser(null));
      dispatch(setToken(null));
      dispatch(setRefreshToken(null));
      throw error;
    }
  }, [dispatch]);

  // Refresh token function
  const handleRefreshTokenAction = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      dispatch(setUser(response.user));
      dispatch(setToken(response.access_token));
      dispatch(setRefreshToken(response.refresh_token));
      dispatch(setIsAuthenticated(true));
    } catch (error: unknown) {
      // If refresh fails, user is not authenticated
      dispatch(setIsAuthenticated(false));
      dispatch(setUser(null));
      dispatch(setToken(null));
      dispatch(setRefreshToken(null));
      throw error;
    }
  }, [dispatch]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Update user function
  const updateUserProfile = useCallback(
    (userData: Partial<IUser>) => {
      dispatch(updateUser(userData));
    },
    [dispatch],
  );

  // Initialize auth function
  const initializeAuthState = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Check if user is active
  const isUserActive = useCallback(() => {
    return user?.status === 'active';
  }, [user]);

  // Get user's full name
  const getUserFullName = useCallback(() => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  }, [user]);

  return {
    // State
    user,
    token,
    refreshTokenState,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getCurrentUser: fetchCurrentUser,
    refreshToken: handleRefreshTokenAction,
    clearError: clearAuthError,
    updateUser: updateUserProfile,
    initializeAuth: initializeAuthState,

    // Utilities
    isUserActive,
    getUserFullName,
  };
};

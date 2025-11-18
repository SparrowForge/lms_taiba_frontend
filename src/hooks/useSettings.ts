import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';

import {
  clearError,
  initializeSettings,
  setDarkMode,
  setError,
  setLoading,
  setThemeMode,
} from '@/store/slices/settingsSlice';

export const useSettings = () => {
  const dispatch = useDispatch();
  const { themeMode, isDarkMode, isLoading, error } = useSelector(
    (state: RootState) => state.settings,
  );

  // Initialize settings on mount
  useEffect(() => {
    dispatch(initializeSettings());
  }, [dispatch]);

  // Apply dark mode to DOM when isDarkMode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', themeMode);
      localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }
  }, [themeMode, isDarkMode]);

  // Set theme mode (light, dark, or system)
  const updateThemeMode = useCallback(
    (mode: 'light' | 'dark' | 'system') => {
      dispatch(setThemeMode(mode));
    },
    [dispatch],
  );

  // Toggle dark mode directly
  const toggleDarkMode = useCallback(
    (darkMode: boolean) => {
      dispatch(setDarkMode(darkMode));
    },
    [dispatch],
  );

  // Set loading state
  const setSettingsLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch],
  );

  // Set error state
  const setSettingsError = useCallback(
    (errorMessage: string | null) => {
      dispatch(setError(errorMessage));
    },
    [dispatch],
  );

  // Clear error state
  const clearSettingsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get system preference
  const getSystemPreference = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        dispatch(setDarkMode(e.matches));
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [themeMode, dispatch]);

  return {
    // State
    themeMode,
    isDarkMode,
    isLoading,
    error,

    // Actions
    updateThemeMode,
    toggleDarkMode,
    setSettingsLoading,
    setSettingsError,
    clearSettingsError,
    getSystemPreference,
  };
};

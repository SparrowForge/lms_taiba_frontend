import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISettingsState {
  themeMode: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ISettingsState = {
  themeMode: 'system',
  isDarkMode: false,
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.themeMode = action.payload;

      // Update isDarkMode based on theme mode
      if (action.payload === 'dark') {
        state.isDarkMode = true;
      } else if (action.payload === 'light') {
        state.isDarkMode = false;
      } else {
        // For 'system', check system preference
        if (typeof window !== 'undefined') {
          state.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      }
    },

    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;

      // Update theme mode based on dark mode
      if (action.payload) {
        state.themeMode = 'dark';
      } else {
        state.themeMode = 'light';
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    initializeSettings: (state) => {
      if (typeof window !== 'undefined') {
        // Load from localStorage
        const savedThemeMode = localStorage.getItem('themeMode');
        const savedDarkMode = localStorage.getItem('isDarkMode');

        if (savedThemeMode) {
          state.themeMode = savedThemeMode as 'light' | 'dark' | 'system';
        }

        if (savedDarkMode !== null) {
          state.isDarkMode = JSON.parse(savedDarkMode);
        } else if (state.themeMode === 'system') {
          // Check system preference
          state.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      }
    },
  },
});

export const { setThemeMode, setDarkMode, setLoading, setError, clearError, initializeSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;

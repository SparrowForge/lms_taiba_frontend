import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {AuthState} from '@/types/auth'
import type {IUser} from '@/types/user'
import {IStatusState, Status} from '@/types/common'

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent flash redirects
  error: null,

  // Status fields like user slice
  loginStatus: {
    status: Status.INITIAL,
    message: undefined
  },
  registerStatus: {
    status: Status.INITIAL,
    message: undefined
  },
  userStatus: {
    status: Status.INITIAL,
    message: undefined
  }
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Status actions
    setLoginStatus: (state, action: PayloadAction<IStatusState>) => {
      state.loginStatus = action.payload
    },
    setRegisterStatus: (state, action: PayloadAction<IStatusState>) => {
      state.registerStatus = action.payload
    },
    setUserStatus: (state, action: PayloadAction<IStatusState>) => {
      state.userStatus = action.payload
    },

    // Data actions
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },

    // Loading and error actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },

    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        if (token) {
          state.token = token
          state.refreshToken = refreshToken
          state.isAuthenticated = true
        }
      }
      // Always set loading to false after initialization
      state.isLoading = false
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },

    // Clear auth state (for logout)
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      state.loginStatus = initialState.loginStatus
      state.registerStatus = initialState.registerStatus
      state.userStatus = initialState.userStatus
    }
  }
})

// Export actions
export const {
  setLoginStatus,
  setRegisterStatus,
  setUserStatus,
  setUser,
  setToken,
  setRefreshToken,
  setIsAuthenticated,
  setLoading,
  setError,
  clearError,
  initializeAuth,
  updateUser,
  clearAuth
} = authSlice.actions

// Export reducer
export default authSlice.reducer

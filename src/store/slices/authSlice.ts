import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {authService} from '@/services/authService'
import type {AuthState, IAuthResponse, IUser, LoginCredentials, RegisterCredentials} from '@/types/auth'

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return user
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get user')
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken()
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Token refresh failed')
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
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
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // If getting current user fails, user might not be authenticated
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
      })

    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // If refresh fails, user is not authenticated
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
      })
  },
})

// Export actions
export const { clearError, setLoading, initializeAuth, updateUser } = authSlice.actions

// Export reducer
export default authSlice.reducer

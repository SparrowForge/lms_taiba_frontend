import {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useRouter} from 'next/navigation'
import {
    clearError,
    getCurrentUser,
    initializeAuth,
    login,
    logout,
    refreshToken,
    register,
    updateUser
} from '@/store/slices/authSlice'
import type {IUser, LoginCredentials, RegisterCredentials} from '@/types/auth'
import type {AppDispatch, RootState} from '@/store'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // Get auth state from Redux
  const {
    user,
    token,
    refreshToken: refreshTokenState,
    isAuthenticated,
    isLoading,
    error
  } = useSelector((state: RootState) => state.auth)

  // Login function
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap()
      router.push('/dashboard') // Redirect to dashboard after login
      return result
    } catch (error) {
      throw error
    }
  }, [dispatch, router])

  // Register function
  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(register(credentials)).unwrap()
      router.push('/dashboard') // Redirect to dashboard after registration
      return result
    } catch (error) {
      throw error
    }
  }, [dispatch, router])

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap()
      router.push('/login') // Redirect to login after logout
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, redirect to login
      router.push('/login')
    }
  }, [dispatch, router])

  // Get current user function
  const fetchCurrentUser = useCallback(async () => {
    try {
      const result = await dispatch(getCurrentUser()).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }, [dispatch])

  // Refresh token function
  const handleRefreshTokenAction = useCallback(async () => {
    try {
      const result = await dispatch(refreshToken()).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }, [dispatch])

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Update user function
  const updateUserProfile = useCallback((userData: Partial<IUser>) => {
    dispatch(updateUser(userData))
  }, [dispatch])

  // Initialize auth function
  const initializeAuthState = useCallback(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // Check if user is active
  const isUserActive = useCallback(() => {
    return user?.status === 'active'
  }, [user])

  // Get user's full name
  const getUserFullName = useCallback(() => {
    if (!user) return ''
    return `${user.firstName} ${user.lastName}`.trim()
  }, [user])

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
  }
}

import {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useRouter} from 'next/navigation'
import {
  clearAuth,
  clearError,
  initializeAuth,
  setIsAuthenticated,
  setLoginStatus,
  setRefreshToken,
  setRegisterStatus,
  setToken,
  setUser,
  setUserStatus,
  updateUser
} from '@/store/slices/authSlice'
import {authService} from '@/services/authService'
import type {LoginCredentials, RegisterCredentials} from '@/types/auth'
import type {IUser} from '@/types/user'
import type {AppDispatch, RootState} from '@/store'
import {Status} from '@/types/common'

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
    error,
    loginStatus,
    registerStatus,
    userStatus
  } = useSelector((state: RootState) => state.auth)

  // Helper to get loading states
  const loginLoading = loginStatus.status === Status.LOADING
  const registerLoading = registerStatus.status === Status.LOADING
  const userLoading = userStatus.status === Status.LOADING

  // Helper to get error states
  const loginError = loginStatus.status === Status.FAILED ? loginStatus.message : null
  const registerError = registerStatus.status === Status.FAILED ? registerStatus.message : null
  const userError = userStatus.status === Status.FAILED ? userStatus.message : null

  // Login function
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch(setLoginStatus({status: Status.LOADING}))

      const response = await authService.login(credentials)
      dispatch(setUser(response.user))
      dispatch(setToken(response.access_token))
      dispatch(setRefreshToken(response.refresh_token))
      dispatch(setIsAuthenticated(true))
      dispatch(setLoginStatus({status: Status.SUCCESS}))

      router.push('/') // Redirect to main page (dashboard) after login
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch(setLoginStatus({status: Status.FAILED, message: errorMessage}))
      throw error
    }
  }, [dispatch, router])

  // Register function
  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    try {
      dispatch(setRegisterStatus({status: Status.LOADING}))

      const response = await authService.register(credentials)
      dispatch(setUser(response.user))
      dispatch(setToken(response.access_token))
      dispatch(setRefreshToken(response.refresh_token))
      dispatch(setIsAuthenticated(true))
      dispatch(setRegisterStatus({status: Status.SUCCESS}))

      router.push('/') // Redirect to main page (dashboard) after registration
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch(setRegisterStatus({status: Status.FAILED, message: errorMessage}))
      throw error
    }
  }, [dispatch, router])

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout()
      dispatch(clearAuth())
      router.push('/login') // Redirect to login after logout
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear auth state and redirect to login
      dispatch(clearAuth())
      router.push('/login')
    }
  }, [dispatch, router])

  // Get current user function
  const fetchCurrentUser = useCallback(async () => {
    try {
      dispatch(setUserStatus({status: Status.LOADING}))

      const user = await authService.getCurrentUser()
      dispatch(setUser(user))
      dispatch(setIsAuthenticated(true))
      dispatch(setUserStatus({status: Status.SUCCESS}))

      return user
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get user'
      dispatch(setUserStatus({status: Status.FAILED, message: errorMessage}))
      // If getting current user fails, user might not be authenticated
      dispatch(setIsAuthenticated(false))
      dispatch(setUser(null))
      dispatch(setToken(null))
      dispatch(setRefreshToken(null))
      throw error
    }
  }, [dispatch])

  // Refresh token function
  const handleRefreshTokenAction = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      dispatch(setUser(response.user))
      dispatch(setToken(response.access_token))
      dispatch(setRefreshToken(response.refresh_token))
      dispatch(setIsAuthenticated(true))
      return response
    } catch (error: any) {
      // If refresh fails, user is not authenticated
      dispatch(setIsAuthenticated(false))
      dispatch(setUser(null))
      dispatch(setToken(null))
      dispatch(setRefreshToken(null))
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

    // Status states
    loginStatus,
    loginLoading,
    loginError,
    registerStatus,
    registerLoading,
    registerError,
    userStatus,
    userLoading,
    userError,

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

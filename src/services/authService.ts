import {apiService} from '@/lib/axios'
import type {IAuthResponse, LoginCredentials, RegisterCredentials} from '@/types/auth'
import {IUser} from '@/types/user'

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<IAuthResponse> {
    try {
      const response = await apiService.post<IAuthResponse>('/auth/login', credentials)

      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('refreshToken', response.data.refresh_token)
      }

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Register user
  async register(credentials: RegisterCredentials): Promise<IAuthResponse> {
    try {
      const response = await apiService.post<IAuthResponse>('/auth/register', credentials)

      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('refreshToken', response.data.refresh_token)
      }

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post<null>('/auth/logout')
    } catch (error) {
      // Even if logout API fails, clear local storage
      console.error('Logout API error:', error)
    } finally {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<IUser> {
    try {
      const response = await apiService.get<IUser>('/auth/me')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Refresh token
  async refreshToken(): Promise<IAuthResponse> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiService.post<IAuthResponse>('/auth/refresh', { refresh_token: refreshToken })

      // Update tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('refreshToken', response.data.refresh_token)
      }

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Check if user is authenticated (client-side only)
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
  }

  // Get stored token (client-side only)
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  // Get stored refresh token (client-side only)
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  // Error handler
  private handleError(error: any): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message)
    }
    if (error?.message) {
      return new Error(error.message)
    }
    return new Error('An unexpected error occurred')
  }
}

// Export singleton instance
export const authService = new AuthService()

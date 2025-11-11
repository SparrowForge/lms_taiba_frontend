import type { IAuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { IUser } from '@/types/user';
import { IBaseResponse } from '@/types/common';

import { apiService } from '@/lib/axios';

class AuthService {
  // Helper function to set cookie
  private setCookie(name: string, value: string, days: number = 7) {
    if (typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }
  }

  // Helper function to remove cookie
  private removeCookie(name: string) {
    if (typeof window !== 'undefined') {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<IAuthResponse> {
    try {
      const response = await apiService.post<IAuthResponse>('/auth/login', credentials);

      // Store tokens and user in both localStorage and cookies
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Also store in cookies for server-side access
        this.setCookie('token', response.data.access_token, 7);
        this.setCookie('refreshToken', response.data.refresh_token, 30);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Register user
  async register(credentials: RegisterCredentials): Promise<IAuthResponse> {
    try {
      const response = await apiService.post<IAuthResponse>('/auth/register', credentials);

      // Store tokens and user in both localStorage and cookies
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Also store in cookies for server-side access
        this.setCookie('token', response.data.access_token, 7);
        this.setCookie('refreshToken', response.data.refresh_token, 30);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post<null>('/auth/logout');
    } catch (error) {
      // Even if logout API fails, clear local storage
      console.error('Logout API error:', error);
    } finally {
      // Clear both localStorage and cookies
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Remove cookies
        this.removeCookie('token');
        this.removeCookie('refreshToken');
      }
    }
  }

  // Get current user profile
  async getMe(): Promise<IBaseResponse<IUser>> {
    try {
      const response = await apiService.get<IUser>('/auth/me');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Refresh token
  async refreshToken(): Promise<IAuthResponse> {
    try {
      const refreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post<IAuthResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      // Update tokens and user in both localStorage and cookies
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Update cookies
        this.setCookie('token', response.data.access_token, 7);
        this.setCookie('refreshToken', response.data.refresh_token, 30);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if user is authenticated (client-side only)
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  // Get stored token (client-side only)
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  // Get stored refresh token (client-side only)
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  // Get stored user (client-side only)
  getUser(): IUser | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  }

  // Error handler
  private handleError(error: any): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error?.message) {
      return new Error(error.message);
    }
    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
export const authService = new AuthService();

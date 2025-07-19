import type {IBaseResponse, IEmptyResponse} from './common'

// User interface matching the API response
export interface IUser {
  id: number
  email: string
  firstName: string
  lastName: string
  status: 'active' | 'inactive' | 'suspended'
  phone: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// Authentication response interface
export interface IAuthResponse {
  user: IUser
  access_token: string
  refresh_token: string
}

// Credentials interfaces
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

// Redux state interface
export interface AuthState {
  user: IUser | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// API Response types using IBaseResponse
export type LoginApiResponse = IBaseResponse<IAuthResponse>
export type RegisterApiResponse = IBaseResponse<IAuthResponse>
export type LogoutApiResponse = IEmptyResponse
export type GetCurrentUserApiResponse = IBaseResponse<IUser>
export type RefreshTokenApiResponse = IBaseResponse<IAuthResponse>

// Legacy types for backward compatibility (if needed)
export type User = IUser
export type AuthResponse = IAuthResponse

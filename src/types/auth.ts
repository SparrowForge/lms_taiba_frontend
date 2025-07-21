import {IBaseResponse, IStatusState} from "./common"
import {IUser} from "./user"

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

  // Status fields like user slice
  loginStatus: IStatusState
  registerStatus: IStatusState
  userStatus: IStatusState
}

// API Response types using IBaseResponse
export type LoginApiResponse = IBaseResponse<IAuthResponse>
export type RegisterApiResponse = IBaseResponse<IAuthResponse>
export type LogoutApiResponse = IBaseResponse<void>
export type GetCurrentUserApiResponse = IBaseResponse<IUser>
export type RefreshTokenApiResponse = IBaseResponse<IAuthResponse>

// Legacy types for backward compatibility (if needed)
export type User = IUser
export type AuthResponse = IAuthResponse

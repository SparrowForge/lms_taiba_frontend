import { IUser } from './user';

// Authentication response interface
export interface IAuthResponse {
  user: IUser;
  access_token: string;
  refresh_token: string;
}

// Credentials interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// Redux state interface
export interface AuthState {
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

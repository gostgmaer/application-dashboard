import { User } from "next-auth";
import { JWT } from "next-auth/jwt";





export type Permission = string; // Dynamic permission strings from backend
export type Role = string; // Dynamic role strings from backend

export interface LoginResponse {
  success: boolean;
  message: string;
    permissions: Permission[];
  avatar?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
  '2fa_required'?: boolean;
  otp_method?: 'totp' | 'sms' | 'email';
  expires_at?: string;
  rate_limit?: {
    remaining: number;
    reset_time: number;
  };
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
  "2fa_verified": boolean;
  "2fa_required": boolean;
  error_code?: 'INVALID_OTP' | 'EXPIRED_OTP' | 'MAX_ATTEMPTS_EXCEEDED' | 'RATE_LIMITED' | 'SESSION_EXPIRED';
  remaining_attempts?: number;
  lockout_until?: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
  error_code?: 'RATE_LIMITED' | 'MAX_DAILY_LIMIT' | 'SESSION_EXPIRED' | 'INVALID_METHOD';
  rate_limit?: {
    remaining: number;
    reset_time: number;
  };
  next_resend_at?: string;
}

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   '2fa_verified': boolean;
// }

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  id_token?: string;
  token_type?: string;
  exp?: number;
  error?: string;
  role?: string;
  [key: string]: any;
  "2fa_required"?: boolean;
  "2fa_verified"?: boolean;
  otp_method?: string;
  tempToken?: string;
}

export interface CustomUser extends User {
  accessToken?: string;
  tempToken?: string;
  refreshToken?: string;
  id_token?: string;
  token_type?: string;
  accessTokenExpires?: number;
  role?: string;
  otp_method?: string;
  "2fa_required"?: boolean;
  "2fa_verified"?: boolean;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: Permission | Permission[], operator?: 'AND' | 'OR') => boolean;
  hasRole: (role: Role | Role[]) => boolean;
  isSpecialRole: (role: 'super_admin' | 'admin') => boolean;
}

export interface ProtectedComponentProps {
  children: React.ReactNode;
  permission?: Permission | Permission[];
  role?: Role | Role[];
  operator?: 'AND' | 'OR';
  fallback?: React.ReactNode;
  showError?: boolean;
  showModal?: boolean;
  modalTitle?: string;
  modalDescription?: string;
  onModalClose?: () => void;
}

export interface UserP {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
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

export interface User {
  id: string;
  email: string;
  name: string;
  '2fa_verified': boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}
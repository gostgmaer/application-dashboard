export interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  username: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  profilePicture?: any
  role?: string
  isVerified: boolean
  phoneVerified: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'banned'
  accountType: 'free' | 'premium' | 'enterprise'
  loyaltyPoints: number
  preferences: {
    language: string
    currency: string
    theme: 'light' | 'dark'
    newsletter: boolean
    notifications: boolean
  }
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    google?: string
    pinterest?: string
  }
  socialAccounts: SocialAccount[]
  interests: string[]
  address: Address[]
  paymentMethods: PaymentMethod[]
  shippingPreferences: {
    deliveryMethod: 'standard' | 'express'
    deliveryInstructions?: string
    preferredTime?: string
  }
  subscriptionStatus: 'active' | 'inactive'
  subscriptionType: string
  twoFactorEnabled: boolean
  knownDevices: Device[]
  loginHistory: any
  securityEvents: SecurityEvent[]
  /** OTP Settings */
  otpSettings: {
    enabled: boolean
    preferredMethod: 'totp' | 'email' | 'sms'
    allowFallback: boolean
    requireForLogin: boolean
    requireForSensitiveOps: boolean
  }

  /** Current OTP Session */
  currentOTP: {
    code: string | null
    hashedCode: string | null
    type: 'email' | 'sms' | 'backup' | null
    purpose: 'login' | 'reset' | 'verification' | 'sensitive_op' | null
    expiresAt: string | null
    attempts: number
    maxAttempts: number
    lastSent: string | null
    verified: boolean
  }

  /** TOTP / 2FA Configuration */
  twoFactorAuth: {
    enabled: boolean
    secret: string | null
    backupCodes: {
      code: string
      used: boolean
      usedAt: string | null
      createdAt: string
    }[]
    setupCompleted: boolean
    lastUsed: string | null
  }
}



export interface PaymentMethod {
  id: string
  method: 'credit_card' | 'paypal' | 'bank_transfer'
  holderName: string
  cardNumber: string // masked
  expiryDate: string
  isDefault: boolean
}

export interface SocialAccount {
  id: string
  provider: 'google' | 'facebook' | 'twitter' | 'github' | 'linkedin'
  providerId: string
  email: string
  verified: boolean
  connectedAt: string
}

export interface Device {
  deviceId: string
  name: string
  type: string
  os: string
  browser: string
  lastSeen: string
  isTrusted: boolean
  isActive: boolean
}

export interface LoginHistory {
  loginTime: string
  ipAddress: string
  userAgent: string
  successful: boolean
  failureReason?: string
  deviceId: string
}

export interface SecurityEvent {
  event: string
  description?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  privacyMode: boolean;
  securityAlerts: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface Address {
  id: string;
  label: string;
  aaddressLine1?: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Device {
  id: string;
  name: string;
  result: any;
  ip: string;
  os: string;
  browser: string;
  location: string;
  lastLogin: string;
  trusted: boolean;
  current: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  statusCode: number;
  device: any;
  deviceType: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

export interface SocialConnection {
  provider: 'google' | 'github' | 'facebook' | 'twitter';
  verified: boolean;
  email?: string;
  connectedAt?: string;
}

export interface TOTPSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export type RiskLevel = 'low' | 'medium' | 'high' | string;
export type LoginMethod = 'password' | 'otp' | 'sso' | string;


export interface Coordinates {
  lat: number | null;
  lng: number | null;
}


export interface Location {
  coordinates: Coordinates;
  country: string; // e.g. "Unknown" or ISO country name/code
  region: string; // state/region name or "Unknown"
  city: string; // city name or "Unknown"
  timezone: string | null; // tz database name or null
}


export interface Browser {
  name: string | null;
  version: string | null;
  major: string | null; // major version as string (keeps original shape)
}


export interface OS {
  name: string | null;
  version: string | null;
}



export interface SecurityAnalysis {
  userAgentLength: number;
  hasSecurityHeaders: boolean;
  headerCount: number;
  timestamp: string; // ISO timestamp
}


export interface Security {
  analysis: SecurityAnalysis;
  suspiciousScore: number; // 0..n scoring system
  riskLevel: RiskLevel;
  flags: string[]; // list of short flag identifiers
}

export interface securityEvent {
  location: Location;
  browser: Browser;
  os: OS;
  device: Device;
  security: Security;


  // times are kept as ISO strings to preserve exact incoming shape
  loginTime: string; // ISO timestamp
  detectedAt: string; // ISO timestamp


  ipAddress: string;
  userAgent: string;


  successful: boolean;
  failureReason?: string | null;


  deviceId?: string;
  fingerprint?: string;
  otpUsed?: string; // e.g. "none" | "sms" | "authenticator"


  loginMethod: LoginMethod;


  _id: string; // database id
  id?: string; // duplicate id field present in payload
}
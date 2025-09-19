export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
  phoneNumber?: string;
  connectedAccounts?: connectedAccounts[];
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  profilePicture?: string;
  role?: string;
  isVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  loyaltyPoints: number;
  preferences: {
    language: string;
    currency: string;
    theme: "light" | "dark";
    newsletter: boolean;
    notifications: boolean;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    google?: string;
    github?: string;
    pinterest?: string;
  };
  interests: string[];
  address: Address[];
  paymentMethods: PaymentMethod[];
  shippingPreferences: {
    deliveryMethod: "standard" | "express";
    deliveryInstructions?: string;
    preferredTime?: string;
  };
  subscriptionStatus: "active" | "inactive";
  subscriptionType: "free" | "premium" | "enterprise";
  twoFactorEnabled: boolean;
  knownDevices: Device[];
  loginHistory: LoginHistory[];
  securityEvents: SecurityEvent[];
}

export interface Address {
  id: string;
  label: "home" | "work" | "other";
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  method: "credit_card" | "paypal" | "bank_transfer";
  holderName: string;
  cardNumber: string; // masked
  expiryDate: string;
  isDefault: boolean;
}

export interface connectedAccounts {
  provider: string;
  providerId: string;
  email: string;
  verified: boolean;
  connectedAt: string;
}

export interface Device {
  deviceId: string;
  name: string;
  type: string;
  os: string;
  browser: string;
  lastSeen: string;
  isTrusted: boolean;
  isActive: boolean;
}

export interface LoginHistory {
  loginTime: string;
  ipAddress: string;
  userAgent: string;
  successful: boolean;
  failureReason?: string;
  deviceId: string;
}

export interface SecurityEvent {
  event: string;
  description?: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

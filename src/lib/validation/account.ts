import { z } from 'zod'

// Personal Details Schema
export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().or(z.literal('')),
})

// Security Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const twoFactorSchema = z.object({
  token: z.string().length(6, 'TOTP token must be 6 digits').regex(/^\d+$/, 'TOTP token must contain only numbers')
})


export const twoFactorEmailSchema = z.object({
  email: z.string().email("Invalid email address")
});
// Preferences Schema
export const preferencesSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  currency: z.string().min(1, 'Currency is required'),
  theme: z.enum(['light', 'dark']),
  newsletter: z.boolean(),
  notifications: z.boolean()
})

// Social Media Schema
export const socialMediaSchema = z.object({
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  google: z.string().url('Invalid Google URL').optional().or(z.literal('')),
  pinterest: z.string().url('Invalid Pinterest URL').optional().or(z.literal(''))
})

// Connected Accounts Schema
export const connectedAccountsSchema = z.object({
  google: z.boolean(),
  facebook: z.boolean(),
  twitter: z.boolean(),
  github: z.boolean(),
  linkedin: z.boolean()
})

// Address Schema
export const addressSchema = z.object({
  label: z.enum(['home', 'work', 'other']),
  addressLine1: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional()
})

// Payment Method Schema
export const paymentMethodSchema = z.object({
  method: z.enum(['credit_card', 'paypal', 'bank_transfer']),
  holderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().min(16, 'Card number must be at least 16 digits').max(19, 'Card number is too long'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().length(3, 'CVV must be 3 digits').regex(/^\d+$/, 'CVV must contain only numbers'),
  isDefault: z.boolean().optional()
})

// Shipping Preferences Schema
export const shippingPreferencesSchema = z.object({
  deliveryMethod: z.enum(['standard', 'express']),
  deliveryInstructions: z.string().max(500, 'Delivery instructions too long').optional(),
  preferredTime: z.string().optional()
})

// Subscription Schema
export const subscriptionSchema = z.object({
  subscriptionType: z.enum(['free', 'premium', 'enterprise']),
  autoRenewal: z.boolean()
})

// Interests Schema  
export const interestsSchema = z.object({
  interests: z.array(z.string()).max(20, 'Maximum 20 interests allowed')
})


export const emailSendSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const emailVerificationSchema = z.object({
  emailCode: z.string().min(6, "Verification code must be 6 digits").max(6, "Verification code must be 6 digits"),
});

export const phoneSendSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
});

export const phoneVerificationSchema = z.object({
  phoneCode: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits"),
});

export type PhoneSendFormData = z.infer<typeof phoneSendSchema>;
export type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>;
export type EmailSendFormData = z.infer<typeof emailSendSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;
export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>
export type TwoFactorFormEmailData = z.infer<typeof twoFactorEmailSchema>
export type PreferencesFormData = z.infer<typeof preferencesSchema>
export type SocialMediaFormData = z.infer<typeof socialMediaSchema>
export type ConnectedAccountsFormData = z.infer<typeof connectedAccountsSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>
export type ShippingPreferencesFormData = z.infer<typeof shippingPreferencesSchema>
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>
export type InterestsFormData = z.infer<typeof interestsSchema>
import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
  country: z.string().min(2, 'Country is required'),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').max(20, 'Coupon code too long'),
});

export const guestCheckoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
});

export const cartUpdateSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type GuestCheckoutFormData = z.infer<typeof guestCheckoutSchema>;
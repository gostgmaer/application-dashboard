import { CheckoutData } from '@/types/checkout';

const CHECKOUT_STORAGE_KEY = 'checkout_data';

export class CheckoutStorage {
  static save(data: Partial<CheckoutData>): void {
    try {
      const existing = this.load();
      const updated = { ...existing, ...data };
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save checkout data:', error);
    }
  }

  static load(): Partial<CheckoutData> {
    try {
      const data = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load checkout data:', error);
      return {};
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear checkout data:', error);
    }
  }

  static getStep(): number {
    const data = this.load();
    if (data.cartItems?.length && data.selectedAddress) {
      if (data.priceBreakdown) return 3; // Final review
      return 2; // Coupon/pricing
    }
    if (data.cartItems?.length) return 1; // Address
    return 0; // Cart review
  }
}
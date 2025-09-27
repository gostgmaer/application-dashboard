import { CartItem, Address, Coupon, PriceBreakdown, ApiResponse, Order, CheckoutData } from '@/types/checkout';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    quantity: 1,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    maxQuantity: 5,
    category: 'electronics'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 299.99,
    quantity: 2,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    maxQuantity: 3,
    category: 'electronics'
  }
];

const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Home',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    isDefault: true
  },
  {
    id: '2',
    name: 'Office',
    street: '456 Business Ave, Suite 200',
    city: 'New York',
    state: 'NY',
    postalCode: '10002',
    country: 'United States',
    isDefault: false
  }
];

const mockCoupons: Record<string, Coupon> = {
  'SAVE10': {
    code: 'SAVE10',
    discount: 10,
    type: 'percentage',
    minOrderValue: 100,
    expiryDate: '2025-12-31',
    applicableCategories: ['electronics']
  },
  'FLAT50': {
    code: 'FLAT50',
    discount: 50,
    type: 'fixed',
    minOrderValue: 300,
    expiryDate: '2025-06-30'
  },
  'EXPIRED': {
    code: 'EXPIRED',
    discount: 20,
    type: 'percentage',
    minOrderValue: 0,
    expiryDate: '2024-01-01'
  }
};

export class CheckoutAPI {
  static async getCartItems(): Promise<ApiResponse<CartItem[]>> {
    await delay(800);
    return {
      success: true,
      data: mockCartItems
    };
  }

  static async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<CartItem[]>> {
    await delay(500);
    
    const item = mockCartItems.find(item => item.id === itemId);
    if (!item) {
      return {
        success: false,
        error: 'Item not found'
      };
    }

    if (quantity > item.maxQuantity) {
      return {
        success: false,
        error: `Maximum ${item.maxQuantity} items available`
      };
    }

    item.quantity = quantity;
    return {
      success: true,
      data: mockCartItems
    };
  }

  static async removeCartItem(itemId: string): Promise<ApiResponse<CartItem[]>> {
    await delay(500);
    
    const index = mockCartItems.findIndex(item => item.id === itemId);
    if (index === -1) {
      return {
        success: false,
        error: 'Item not found'
      };
    }

    mockCartItems.splice(index, 1);
    return {
      success: true,
      data: mockCartItems
    };
  }

  static async getUserAddresses(): Promise<ApiResponse<Address[]>> {
    await delay(600);
    return {
      success: true,
      data: mockAddresses
    };
  }

  static async validatePostalCode(postalCode: string): Promise<ApiResponse<{city: string, state: string}>> {
    await delay(1000);
    
    // Mock postal code validation
    const postalCodeData: Record<string, {city: string, state: string}> = {
      '10001': { city: 'New York', state: 'NY' },
      '10002': { city: 'New York', state: 'NY' },
      '90210': { city: 'Beverly Hills', state: 'CA' },
      '94102': { city: 'San Francisco', state: 'CA' }
    };

    const result = postalCodeData[postalCode];
    if (!result) {
      return {
        success: false,
        error: 'Invalid postal code or area not serviceable'
      };
    }

    return {
      success: true,
      data: result
    };
  }

  static async addAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    await delay(800);
    
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
      isDefault: mockAddresses.length === 0
    };

    mockAddresses.push(newAddress);
    
    return {
      success: true,
      data: newAddress
    };
  }

  static async validateCoupon(code: string, cartTotal: number, categories: string[]): Promise<ApiResponse<{discount: number, newTotal: number}>> {
    await delay(1200);
    
    const coupon = mockCoupons[code.toUpperCase()];
    
    if (!coupon) {
      return {
        success: false,
        error: 'Invalid coupon code'
      };
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return {
        success: false,
        error: 'Coupon has expired'
      };
    }

    // Check minimum order value
    if (cartTotal < coupon.minOrderValue) {
      return {
        success: false,
        error: `Minimum order value of $${coupon.minOrderValue} required`
      };
    }

    // Check applicable categories
    if (coupon.applicableCategories && !coupon.applicableCategories.some(cat => categories.includes(cat))) {
      return {
        success: false,
        error: 'Coupon not applicable for selected products'
      };
    }

    const discount = coupon.type === 'percentage' 
      ? cartTotal * (coupon.discount / 100)
      : coupon.discount;

    return {
      success: true,
      data: {
        discount: Math.min(discount, cartTotal),
        newTotal: cartTotal - Math.min(discount, cartTotal)
      }
    };
  }

  static async calculatePricing(cartItems: CartItem[], addressId: string, couponDiscount: number = 0): Promise<ApiResponse<PriceBreakdown>> {
    await delay(1000);
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 500 ? 0 : 29.99; // Free shipping over $500
    const total = subtotal + tax + shipping - couponDiscount;

    // Mock estimated delivery
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 3);

    return {
      success: true,
      data: {
        subtotal,
        tax,
        shipping,
        discount: couponDiscount,
        total: Math.max(total, 0),
        estimatedDelivery: estimatedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    };
  }

  static async validateCheckout(checkoutData: CheckoutData): Promise<ApiResponse<{isValid: boolean}>> {
    await delay(1500);

    // Validate stock availability
    for (const item of checkoutData.cartItems) {
      if (item.quantity > item.maxQuantity) {
        return {
          success: false,
          error: `${item.name} is now out of stock`
        };
      }
    }

    // Re-validate coupon if applied
    if (checkoutData.couponCode && checkoutData.couponDiscount > 0) {
      const categories = Array.from(new Set(checkoutData.cartItems.map(item => item.category)));
      const subtotal = checkoutData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const couponValidation = await this.validateCoupon(checkoutData.couponCode, subtotal, categories);
      if (!couponValidation.success) {
        return {
          success: false,
          error: `Coupon validation failed: ${couponValidation.error}`
        };
      }
    }

    return {
      success: true,
      data: { isValid: true }
    };
  }

  static async createOrder(checkoutData: CheckoutData): Promise<ApiResponse<Order>> {
    await delay(2000);

    // Random success/failure for demo
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Payment processing failed. Please try again.'
      };
    }

    const order: Order = {
      id: `ORD-${Date.now()}`,
      status: 'pending',
      items: checkoutData.cartItems,
      address: checkoutData.selectedAddress!,
      priceBreakdown: checkoutData.priceBreakdown,
      paymentMethod: checkoutData.paymentMethod,
      paymentStatus: checkoutData.paymentMethod === 'cod' ? 'pending' : 'paid',
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      data: order
    };
  }
}
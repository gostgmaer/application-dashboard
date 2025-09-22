export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
  category: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrderValue: number;
  expiryDate: string;
  applicableCategories?: string[];
}

export interface PriceBreakdown {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  estimatedDelivery: string;
}

export interface CheckoutData {
  cartItems: CartItem[];
  selectedAddress: Address | null;
  newAddress: Partial<Address> | null;
  couponCode: string;
  couponDiscount: number;
  priceBreakdown: PriceBreakdown;
  paymentMethod: 'cod' | 'stripe' | 'razorpay' | 'paypal';
  isGuest: boolean;
  guestEmail: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  items: CartItem[];
  address: Address;
  priceBreakdown: PriceBreakdown;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}
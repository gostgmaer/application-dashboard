'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { CheckoutData, CartItem, Address, PriceBreakdown, Order } from '@/types/checkout';
import { CheckoutAPI } from '@/lib/checkoutAPI';
import { CheckoutStorage } from '@/lib/storage';
import { OrderSuccess } from './order-success';
import { CartReview } from './cart-review';
import { AddressSelection } from './address-selection';
import { CouponDiscount } from './coupon-discount';
import { PriceBreakdownComponent } from './price-breakdown';
import { OrderConfirmation } from './order-confirmation';
import { CheckoutStepper } from './checkout-stepper';
const steps = [
  { title: 'Cart Review', description: 'Review your items' },
  { title: 'Delivery Address', description: 'Select address' },
  { title: 'Coupons & Discounts', description: 'Apply savings' },
  { title: 'Final Review', description: 'Confirm details' },
  { title: 'Payment', description: 'Complete order' }
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    cartItems: [],
    selectedAddress: null,
    newAddress: null,
    couponCode: '',
    couponDiscount: 0,
    priceBreakdown: {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      estimatedDelivery: ''
    },
    paymentMethod: 'cod',
    isGuest: false,
    guestEmail: ''
  });

  useEffect(() => {
    initializeCheckout();
  }, []);

  useEffect(() => {
    // Save checkout progress
    if (checkoutData.cartItems.length > 0) {
      CheckoutStorage.save(checkoutData);
    }
  }, [checkoutData]);

  const initializeCheckout = async () => {
    try {
      // Load saved checkout data
      const savedData = CheckoutStorage.load();
      
      // Load fresh cart data
      const cartResponse = await CheckoutAPI.getCartItems();
      
      if (cartResponse.success && cartResponse.data) {
        const newCheckoutData = {
          ...checkoutData,
          ...savedData,
          cartItems: cartResponse.data
        };
        
        setCheckoutData(newCheckoutData);
        
        // Set appropriate step based on saved data
        const savedStep = CheckoutStorage.getStep();
        setCurrentStep(savedStep);
        
        toast.success('Checkout data loaded');
      } else {
        toast.error('Failed to load cart items');
      }
    } catch (error) {
      toast.error('Failed to initialize checkout');
    } finally {
      setLoading(false);
    }
  };

  const updateCheckoutData = (updates: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...updates }));
  };

  const handleCartUpdate = (cartItems: CartItem[]) => {
    updateCheckoutData({ cartItems });
  };

  const handleAddressSelect = (address: Address) => {
    updateCheckoutData({ selectedAddress: address });
  };

  const handleCouponApply = (code: string, discount: number) => {
    updateCheckoutData({ couponCode: code, couponDiscount: discount });
  };

  const handlePriceCalculated = (breakdown: PriceBreakdown) => {
    updateCheckoutData({ priceBreakdown: breakdown });
  };

  const handleOrderComplete = (order: Order) => {
    setCompletedOrder(order);
    CheckoutStorage.clear();
    toast.success('Order completed successfully!');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <OrderSuccess order={completedOrder} />
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CartReview
            cartItems={checkoutData.cartItems}
            onCartUpdate={handleCartUpdate}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <AddressSelection
            selectedAddress={checkoutData.selectedAddress}
            onAddressSelect={handleAddressSelect}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <CouponDiscount
            cartItems={checkoutData.cartItems}
            appliedCoupon={checkoutData.couponCode}
            discount={checkoutData.couponDiscount}
            onCouponApply={handleCouponApply}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PriceBreakdownComponent
            cartItems={checkoutData.cartItems}
            selectedAddress={checkoutData.selectedAddress!}
            couponCode={checkoutData.couponCode}
            couponDiscount={checkoutData.couponDiscount}
            onPriceCalculated={handlePriceCalculated}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <OrderConfirmation
            checkoutData={checkoutData}
            onOrderComplete={handleOrderComplete}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Secure Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your purchase safely and securely</p>
        </div>

        <CheckoutStepper currentStep={currentStep} steps={steps} />

        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
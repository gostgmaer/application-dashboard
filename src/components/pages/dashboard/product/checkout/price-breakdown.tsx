'use client';

import { useState, useEffect } from 'react';
import { Loader2, Truck, Calculator, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CartItem, Address, PriceBreakdown } from '@/types/checkout';
import { CheckoutAPI } from '@/lib/checkoutAPI';

interface PriceBreakdownProps {
  cartItems: CartItem[];
  selectedAddress: Address;
  couponCode: string;
  couponDiscount: number;
  onPriceCalculated: (breakdown: PriceBreakdown) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PriceBreakdownComponent({ 
  cartItems, 
  selectedAddress, 
  couponCode, 
  couponDiscount, 
  onPriceCalculated, 
  onNext, 
  onBack 
}: PriceBreakdownProps) {
  const [loading, setLoading] = useState(true);
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    calculatePricing();
  }, [cartItems, selectedAddress, couponDiscount]);

  const calculatePricing = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await CheckoutAPI.calculatePricing(cartItems, selectedAddress.id, couponDiscount);
      
      if (response.success && response.data) {
        setBreakdown(response.data);
        onPriceCalculated(response.data);
      } else {
        setError(response.error || 'Failed to calculate pricing');
        toast.error(response.error || 'Failed to calculate pricing');
      }
    } catch (error) {
      setError('Failed to calculate pricing');
      toast.error('Failed to calculate pricing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Calculating final pricing...</span>
      </div>
    );
  }

  if (error || !breakdown) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error || 'Failed to calculate pricing'}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={calculatePricing}>
            Retry Calculation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Final Price Breakdown</h2>
        <p className="text-gray-600 dark:text-gray-400">Review your complete order details before proceeding</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Items</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Delivery Address</h3>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{selectedAddress.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedAddress.street}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedAddress.country}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Estimated Delivery: {breakdown.estimatedDelivery}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Price Breakdown</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-gray-100">${breakdown.subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax (8%):</span>
            <span className="text-gray-900 dark:text-gray-100">${breakdown.tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {breakdown.shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `$${breakdown.shipping.toFixed(2)}`
              )}
            </span>
          </div>
          
          {breakdown.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <div className="flex items-center space-x-1">
                <TagIcon className="w-3 h-3" />
                <span>Discount ({couponCode}):</span>
              </div>
              <span>-${breakdown.discount.toFixed(2)}</span>
            </div>
          )}
          
          {breakdown.shipping === 0 && breakdown.subtotal > 500 && (
            <div className="text-xs text-green-600 dark:text-green-400">
              🎉 Free shipping on orders over $500!
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total:</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                ${breakdown.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Coupons
        </Button>
        <Button onClick={onNext} size="lg" className="min-w-[200px]">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
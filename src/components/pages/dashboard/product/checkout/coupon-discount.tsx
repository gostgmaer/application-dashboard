'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Loader2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {  CartItem } from '@/types/checkout';
import { CheckoutAPI } from '@/lib/checkoutAPI';
import {  CouponFormData, couponSchema } from '@/lib/validation/checkout';

interface CouponDiscountProps {
  cartItems: CartItem[];
  appliedCoupon: string;
  discount: number;
  onCouponApply: (code: string, discount: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CouponDiscount({ 
  cartItems, 
  appliedCoupon, 
  discount, 
  onCouponApply, 
  onNext, 
  onBack 
}: CouponDiscountProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: appliedCoupon
    }
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const categories = Array.from(new Set(cartItems.map(item => item.category)));

  const applyCoupon = async (data: CouponFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await CheckoutAPI.validateCoupon(data.code, subtotal, categories);
      
      if (response.success && response.data) {
        onCouponApply(data.code, response.data.discount);
        toast.success(`Coupon applied! You saved $${response.data.discount.toFixed(2)}`);
      } else {
        setError(response.error || 'Failed to apply coupon');
        toast.error(response.error || 'Failed to apply coupon');
      }
    } catch (error) {
      setError('Failed to validate coupon');
      toast.error('Failed to validate coupon');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    onCouponApply('', 0);
    form.setValue('code', '');
    setError('');
    toast.success('Coupon removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Apply Discount</h2>
        <p className="text-gray-600 dark:text-gray-400">Have a coupon code? Enter it below to save on your order</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Tag className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Coupon Code</h3>
        </div>

        {appliedCoupon ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Coupon <strong>{appliedCoupon}</strong> applied successfully! 
                You saved <strong>${discount.toFixed(2)}</strong>
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">{appliedCoupon}</p>
                <p className="text-sm text-green-600 dark:text-green-300">-${discount.toFixed(2)} discount applied</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={removeCoupon}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(applyCoupon)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter coupon code</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input 
                          placeholder="Enter your coupon code" 
                          {...field}
                          className="uppercase"
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <Button type="submit" disabled={loading || !field.value}>
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        )}

        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Available Coupons (Demo):</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">SAVE10</code> - 10% off (min $100)</p>
            <p><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">FLAT50</code> - $50 off (min $300)</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount ({appliedCoupon}):</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold">
            <span className="text-gray-900 dark:text-gray-100">Current Total:</span>
            <span className="text-gray-900 dark:text-gray-100">${(subtotal - discount).toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Final pricing including tax and shipping will be shown on next step
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Address
        </Button>
        <Button onClick={onNext}>
          Continue to Final Review
        </Button>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { CreditCard, Truck, Smartphone, DollarSign, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CheckoutData, Order } from '@/types/checkout';
import { CheckoutAPI } from '@/lib/checkoutAPI';

interface OrderConfirmationProps {
  checkoutData: CheckoutData;
  onOrderComplete: (order: Order) => void;
  onBack: () => void;
}

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: DollarSign, description: 'Pay when your order arrives' },
  { id: 'stripe', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, MasterCard, American Express' },
  { id: 'razorpay', name: 'Razorpay', icon: Smartphone, description: 'UPI, NetBanking, Wallets' },
  { id: 'paypal', name: 'PayPal', icon: CreditCard, description: 'Pay with your PayPal account' },
];

export function OrderConfirmation({ checkoutData, onOrderComplete, onBack }: OrderConfirmationProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>(checkoutData.paymentMethod || 'cod');
  const [processing, setProcessing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string>('');

  const validateAndCreateOrder = async () => {
    setValidating(true);
    setError('');

    try {
      // First validate the entire checkout
      const validation = await CheckoutAPI.validateCheckout(checkoutData);
      
      if (!validation.success) {
        setError(validation.error || 'Order validation failed');
        return;
      }

      setProcessing(true);
      
      // Update checkout data with selected payment method
      const finalCheckoutData = {
        ...checkoutData,
        paymentMethod: selectedPayment as CheckoutData['paymentMethod']
      };

      // Create the order
      const orderResponse = await CheckoutAPI.createOrder(finalCheckoutData);
      
      if (orderResponse.success && orderResponse.data) {
        // Simulate payment processing for online payments
        if (selectedPayment !== 'cod') {
          toast.success('Payment processed successfully!');
        }
        
        onOrderComplete(orderResponse.data);
        toast.success('Order placed successfully!');
      } else {
        setError(orderResponse.error || 'Failed to create order');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setProcessing(false);
      setValidating(false);
    }
  };

  const retryOrder = () => {
    setError('');
    validateAndCreateOrder();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Confirm Your Order</h2>
        <p className="text-gray-600 dark:text-gray-400">Select your payment method and place your order</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Items ({checkoutData.cartItems.length}):</span>
            <span className="text-gray-900 dark:text-gray-100">${checkoutData.priceBreakdown.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span className="text-gray-900 dark:text-gray-100">${checkoutData.priceBreakdown.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {checkoutData.priceBreakdown.shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `$${checkoutData.priceBreakdown.shipping.toFixed(2)}`
              )}
            </span>
          </div>
          {checkoutData.priceBreakdown.discount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount:</span>
              <span>-${checkoutData.priceBreakdown.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-lg">
            <span className="text-gray-900 dark:text-gray-100">Total:</span>
            <span className="text-green-600 dark:text-green-400">${checkoutData.priceBreakdown.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Estimated delivery: {checkoutData.priceBreakdown.estimatedDelivery}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Method</h3>
        
        <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="relative">
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={method.id}
                  className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex-shrink-0">
                    <method.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{method.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={processing || validating}>
          Back to Review
        </Button>
        
        <div className="space-x-2">
          {error && (
            <Button variant="outline" onClick={retryOrder} disabled={processing || validating}>
              Retry
            </Button>
          )}
          
          <Button 
            onClick={validateAndCreateOrder} 
            disabled={processing || validating}
            size="lg"
            className="min-w-[200px]"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating Order...
              </>
            ) : processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {selectedPayment === 'cod' ? 'Placing Order...' : 'Processing Payment...'}
              </>
            ) : (
              selectedPayment === 'cod' ? 'Place Order' : 'Pay & Place Order'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
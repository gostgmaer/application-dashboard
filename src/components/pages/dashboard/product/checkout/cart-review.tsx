'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Address, CartItem } from '@/types/checkout';
import { CheckoutAPI } from '@/lib/checkoutAPI';


interface CartReviewProps {
  cartItems: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
  onNext: () => void;
}

export function CartReview({ cartItems, onCartUpdate, onNext }: CartReviewProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setLoading(itemId);
    try {
      const response = await CheckoutAPI.updateCartItem(itemId, quantity);
      if (response.success && response.data) {
        onCartUpdate(response.data);
        toast.success('Cart updated successfully');
      } else {
        toast.error(response.error || 'Failed to update cart');
      }
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setLoading(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(itemId);
    try {
      const response = await CheckoutAPI.removeCartItem(itemId);
      if (response.success && response.data) {
        onCartUpdate(response.data);
        toast.success('Item removed from cart');
      } else {
        toast.error(response.error || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoading(null);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Add some items to your cart to continue</p>
        <Button onClick={() => window.history.back()}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Review Your Cart</h2>
        <p className="text-gray-600 dark:text-gray-400">Review and update your items before checkout</p>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                Category: {item.category}
              </p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                ${item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1 || loading === item.id}
                className="h-8 w-8"
              >
                {loading === item.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
              </Button>
              
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const quantity = parseInt(e.target.value, 10);
                  if (quantity > 0 && quantity <= item.maxQuantity) {
                    updateQuantity(item.id, quantity);
                  }
                }}
                min="1"
                max={item.maxQuantity}
                className="w-16 text-center"
                disabled={loading === item.id}
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.maxQuantity || loading === item.id}
                className="h-8 w-8"
              >
                {loading === item.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </Button>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Max: {item.maxQuantity}
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => removeItem(item.id)}
              disabled={loading === item.id}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              {loading === item.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-gray-100">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Shipping and taxes calculated at next step
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} size="lg" className="min-w-[200px]">
          Proceed to Address
        </Button>
      </div>
    </div>
  );
}
"use client";

import { CheckCircle, Download, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from '@/types/checkout';
import { toast } from "@/hooks/useToast";

interface OrderSuccessProps {
  order: Order;
}

export function OrderSuccess({ order }: OrderSuccessProps) {
  const downloadInvoice = () => {
    // Mock download functionality

    toast({
      title: "Success",
      description: "Invoice download started",
    });
  };

  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Order Details
        </h3>
        <div className="space-y-3 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">
              {order.id}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="capitalize font-medium text-blue-600">
              {order.status}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Payment:</span>
            <span className="capitalize font-medium">
              {order.paymentStatus === "paid" ? (
                <span className="text-green-600">Paid</span>
              ) : order.paymentMethod === "cod" ? (
                <span className="text-orange-600">Cash on Delivery</span>
              ) : (
                <span className="text-orange-600">Pending</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span className="font-bold text-green-600">
              ${order.priceBreakdown.total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Estimated Delivery:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {order.priceBreakdown.estimatedDelivery}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-800 dark:text-blue-200">
            What&apos;s Next?
          </h4>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          We&apos;ll send you a confirmation email with tracking details once your
          order is shipped.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={downloadInvoice}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Invoice</span>
        </Button>

        <Button
          onClick={() => (window.location.href = "/")}
          className="flex items-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        <p>
          Need help? Contact our customer support at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-600 hover:underline"
          >
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}

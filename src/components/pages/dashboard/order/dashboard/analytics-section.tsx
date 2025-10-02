'use client';

import { Users, Package, Truck, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { AnalyticsWidget } from './analytics-widget';

interface AnalyticsSectionProps {
  isLoading?: boolean;
}

export function AnalyticsSection({ isLoading }: AnalyticsSectionProps) {
  const topCustomers = {
    title: 'Top Customers',
    icon: Users,
    items: [
      { label: 'John Smith', value: '45 orders', progress: 90 },
      { label: 'Sarah Johnson', value: '38 orders', progress: 76 },
      { label: 'Mike Wilson', value: '32 orders', progress: 64 },
    ],
  };

  const topProducts = {
    title: 'Top Products',
    icon: Package,
    items: [
      { label: 'Wireless Headphones', value: '234 sold', progress: 85 },
      { label: 'Smart Watch', value: '189 sold', progress: 68 },
      { label: 'Phone Case', value: '156 sold', progress: 56 },
    ],
  };

  const deliveryStatus = {
    title: 'Delivery Status',
    icon: Truck,
    items: [
      { label: 'On-time Delivery', value: '892', progress: 88 },
      { label: 'Delayed', value: '45', progress: 12 },
      { label: 'Returned', value: '18', progress: 5 },
    ],
  };

  const revenueMetrics = {
    title: 'Revenue Insights',
    icon: DollarSign,
    items: [
      { label: 'Avg Order Value', value: '$127.50', progress: 75 },
      { label: 'This Month', value: '$45,890', progress: 82 },
      { label: 'Last Month', value: '$38,240', progress: 68 },
    ],
  };

  const pendingOrders = {
    title: 'Pending Orders',
    icon: Clock,
    items: [
      { label: '< 1 day', value: '25', progress: 40 },
      { label: '1-3 days', value: '42', progress: 68 },
      { label: '> 3 days', value: '20', progress: 32 },
    ],
  };

  const customerSegmentation = {
    title: 'Customer Segments',
    icon: TrendingUp,
    items: [
      { label: 'New Customers', value: '342', progress: 45 },
      { label: 'Returning', value: '892', progress: 88 },
      { label: 'VIP', value: '127', progress: 25 },
    ],
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnalyticsWidget {...topCustomers} isLoading={isLoading} />
      <AnalyticsWidget {...topProducts} isLoading={isLoading} />
      <AnalyticsWidget {...deliveryStatus} isLoading={isLoading} />
      <AnalyticsWidget {...revenueMetrics} isLoading={isLoading} />
      <AnalyticsWidget {...pendingOrders} isLoading={isLoading} />
      <AnalyticsWidget {...customerSegmentation} isLoading={isLoading} />
    </div>
  );
}

'use client';

import { BarChart } from './charts/bar-chart';
import { LineChart } from './charts/line-chart';
import { PieChart } from './charts/pie-chart';
import { StackedBarChart } from './charts/stacked-bar-chart';

interface ChartsSectionProps {
  isLoading?: boolean;
}

export function ChartsSection({ isLoading }: ChartsSectionProps) {
  const ordersByStatus = [
    { label: 'Pending', value: 87, color: '#f59e0b' },
    { label: 'Completed', value: 1089, color: '#10b981' },
    { label: 'Cancelled', value: 58, color: '#ef4444' },
  ];

  const ordersOverTime = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 48 },
    { label: 'Thu', value: 61 },
    { label: 'Fri', value: 55 },
    { label: 'Sat', value: 67 },
    { label: 'Sun', value: 58 },
  ];

  const paymentMethods = [
    { label: 'Cash on Delivery', value: 520, color: '#3b82f6' },
    { label: 'Online Payment', value: 450, color: '#8b5cf6' },
    { label: 'Wallet', value: 264, color: '#ec4899' },
  ];

  const ordersByCategory = [
    {
      label: 'Electronics',
      segments: [
        { value: 120, color: '#3b82f6', name: 'Completed' },
        { value: 25, color: '#f59e0b', name: 'Pending' },
        { value: 10, color: '#ef4444', name: 'Cancelled' },
      ],
    },
    {
      label: 'Fashion',
      segments: [
        { value: 200, color: '#3b82f6', name: 'Completed' },
        { value: 15, color: '#f59e0b', name: 'Pending' },
        { value: 8, color: '#ef4444', name: 'Cancelled' },
      ],
    },
    {
      label: 'Home & Kitchen',
      segments: [
        { value: 180, color: '#3b82f6', name: 'Completed' },
        { value: 20, color: '#f59e0b', name: 'Pending' },
        { value: 12, color: '#ef4444', name: 'Cancelled' },
      ],
    },
    {
      label: 'Books',
      segments: [
        { value: 150, color: '#3b82f6', name: 'Completed' },
        { value: 18, color: '#f59e0b', name: 'Pending' },
        { value: 5, color: '#ef4444', name: 'Cancelled' },
      ],
    },
  ];

  const revenueData = [
    { label: 'Week 1', value: 12000 },
    { label: 'Week 2', value: 15000 },
    { label: 'Week 3', value: 13500 },
    { label: 'Week 4', value: 18000 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <BarChart
        title="Orders by Status"
        description="Current order distribution"
        data={ordersByStatus}
        isLoading={isLoading}
      />
      <LineChart
        title="Orders Over Time"
        description="Daily order trends"
        data={ordersOverTime}
        color="#3b82f6"
        isLoading={isLoading}
      />
      <PieChart
        title="Orders by Payment Method"
        description="Payment preference breakdown"
        data={paymentMethods}
        isLoading={isLoading}
      />
      <StackedBarChart
        title="Orders by Category"
        description="Category-wise order status"
        data={ordersByCategory}
        isLoading={isLoading}
      />
      <div className="md:col-span-2">
        <LineChart
          title="Revenue Trend"
          description="Weekly revenue performance"
          data={revenueData}
          color="#10b981"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

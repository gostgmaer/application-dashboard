'use client';

import DataTable from '../DataTable';
import { useRecentOrders } from '@/hooks/useDashboardData';

export default function RecentOrdersTable() {
  const { orders, isLoading } = useRecentOrders();

  const columns = [
    { key: 'id', header: 'Order ID' },
    { key: 'customer', header: 'Customer' },
    { 
      key: 'total', 
      header: 'Total',
      render: (value) => `$${value}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Completed' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            : value === 'Processing' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
            : value === 'Shipped'
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
        }`}>
          {value}
        </span>
      )
    },
  ];

  return (
    <DataTable 
      title="Recent Orders" 
      columns={columns} 
      data={orders || []} 
      isLoading={isLoading}
    />
  );
}
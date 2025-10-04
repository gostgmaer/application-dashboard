'use client';

import DataTable from '../DataTable';
import { useLowStockProducts } from '@/hooks/useDashboardData';

export default function LowStockTable() {
  const { lowStockProducts, isLoading } = useLowStockProducts();

  const columns = [
    { key: 'name', header: 'Product Name' },
    { 
      key: 'stock', 
      header: 'Stock',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value <= 5 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
        }`}>
          {value} left
        </span>
      )
    },
    { key: 'category', header: 'Category' },
  ];

  return (
    <DataTable 
      title="Low Stock Alert" 
      columns={columns} 
      data={lowStockProducts || []} 
      isLoading={isLoading}
    />
  );
}
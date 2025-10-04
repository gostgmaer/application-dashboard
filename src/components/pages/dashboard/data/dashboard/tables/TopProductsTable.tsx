'use client';

import DataTable from '../DataTable';
import { useTopProducts } from '@/hooks/useDashboardData';

export default function TopProductsTable() {
  const { products, isLoading } = useTopProducts();

  const columns = [
    { key: 'name', header: 'Product Name' },
    { key: 'category', header: 'Category' },
    { 
      key: 'price', 
      header: 'Price',
      render: (value:any) => `$${value}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value:any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
        }`}>
          {value}
        </span>
      )
    },
  ];

  return (
    <DataTable 
      title="Top Products" 
      columns={columns} 
      data={products || []} 
      isLoading={isLoading}
    />
  );
}
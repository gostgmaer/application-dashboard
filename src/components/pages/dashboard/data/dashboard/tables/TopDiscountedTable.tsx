'use client';

import DataTable from '../DataTable';
import { useDiscountedProducts } from '@/hooks/useDashboardData';

export default function TopDiscountedTable() {
  const { discountedProducts, isLoading } = useDiscountedProducts();

  const columns = [
    { key: 'name', header: 'Product Name' },
    { 
      key: 'originalPrice', 
      header: 'Original Price',
      render: (value:any) => `$${value}`
    },
    { 
      key: 'discountedPrice', 
      header: 'Sale Price',
      render: (value:any) => `$${value}`
    },
    { 
      key: 'discount', 
      header: 'Discount',
      render: (value:any) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
          {value}% OFF
        </span>
      )
    },
  ];

  return (
    <DataTable 
      title="Top Discounted Products" 
      columns={columns} 
      data={discountedProducts || []} 
      isLoading={isLoading}
    />
  );
}
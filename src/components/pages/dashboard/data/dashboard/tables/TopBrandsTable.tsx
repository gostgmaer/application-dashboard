'use client';

import DataTable from '../DataTable';
import { useTopBrands } from '@/hooks/useDashboardData';

export default function TopBrandsTable() {
  const { brands, isLoading } = useTopBrands();

  const columns = [
    { key: 'brand', header: 'Brand Name' },
    { key: 'productsCount', header: 'Products' },
    { 
      key: 'revenue', 
      header: 'Revenue',
      render: (value) => `$${value.toLocaleString()}`
    },
  ];

  return (
    <DataTable 
      title="Top Brands" 
      columns={columns} 
      data={brands || []} 
      isLoading={isLoading}
    />
  );
}
'use client';

import DataTable from '../DataTable';
import { useTopCountries } from '@/hooks/useDashboardData';

export default function TopCountriesTable() {
  const { countriesData, isLoading } = useTopCountries();

  const columns = [
    { key: 'country', header: 'Country' },
    { 
      key: 'sales', 
      header: 'Sales',
      render: (value) => `$${value.toLocaleString()}`
    },
    { 
      key: 'orders', 
      header: 'Orders',
      render: (value) => value.toLocaleString()
    },
  ];

  return (
    <DataTable 
      title="Top Countries by Sales" 
      columns={columns} 
      data={countriesData || []} 
      isLoading={isLoading}
    />
  );
}
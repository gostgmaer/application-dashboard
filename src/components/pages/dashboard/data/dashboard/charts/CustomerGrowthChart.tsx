'use client';

import LineChart from '@/components/ui/charts/LineChart';
import ChartCard from '../ChartCard';
import { useCustomersData } from   '@/hooks/useDashboardData';

export default function CustomerGrowthChart() {
  const { customersData, isLoading } = useCustomersData();

  return (
    <ChartCard title="Customer Growth" isLoading={isLoading}>
      <LineChart
        data={customersData || []}
        lines={[
          {
            dataKey: 'customers',
            stroke: '#8b5cf6',
            strokeWidth: 3,
            name: 'New Customers'
          }
        ]}
        xAxisKey="month"
        height={320}
        tooltipFormatter={(value) => [`${value}`, 'New Customers']}
      />
    </ChartCard>
  );
}
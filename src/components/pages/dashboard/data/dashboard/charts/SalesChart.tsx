'use client';

import LineChart from '@/components/ui/charts/LineChart';
import ChartCard from '../ChartCard';
import { useSalesData } from '@/hooks/useDashboardData';

export default function SalesChart() {
  const { salesData, isLoading } = useSalesData();

  return (
    <ChartCard title="Sales Over Time" isLoading={isLoading}>
      <LineChart
        data={salesData || []}
        lines={[
          {
            dataKey: 'sales',
            stroke: '#3b82f6',
            strokeWidth: 3,
            name: 'Sales'
          }
        ]}
        xAxisKey="month"
        height={320}
        yAxisFormatter={(value) => `$${(value / 1000)}k`}
        tooltipFormatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
      />
    </ChartCard>
  );
}
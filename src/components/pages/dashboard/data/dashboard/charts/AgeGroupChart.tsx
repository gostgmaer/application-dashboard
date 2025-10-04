'use client';

import BarChart from '@/components/ui/charts/BarChart';
import ChartCard from '../ChartCard';
import { useAgeGroups } from '@/hooks/useDashboardData';

export default function AgeGroupChart() {
  const { ageData, isLoading } = useAgeGroups();

  return (
    <ChartCard title="Customer Age Distribution" isLoading={isLoading}>
      <BarChart
        data={Array.isArray(ageData) ? ageData : []}
        bars={[
          {
            dataKey: 'customers',
            fill: '#8b5cf6',
            name: 'Customers'
          }
        ]}
        xAxisKey="ageGroup"
        height={320}
        layout="vertical"
        tooltipFormatter={(value, name) => [
          `${value.toLocaleString()} (${(Array.isArray(ageData) ? ageData : []).find(d => d.customers === value)?.percentage ?? 0}%)`,
          'Customers'
        ]}
      />
    </ChartCard>
  );
}
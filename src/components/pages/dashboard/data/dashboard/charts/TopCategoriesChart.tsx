'use client';

import BarChart from '@/components/ui/charts/BarChart';
// import BarChart from '@/components/charts/BarChart';
import ChartCard from '../ChartCard';
import { useCategoriesData } from '@/hooks/useDashboardData';
// import { useCategoriesData } from '@/hooks/useDashboardData';

export default function TopCategoriesChart() {
  const { categoriesData, isLoading } = useCategoriesData();

  return (
    <ChartCard title="Top Categories by Sales" isLoading={isLoading}>
      <BarChart
        data={Array.isArray(categoriesData) ? categoriesData : []}
        bars={[
          {
            dataKey: 'sales',
            fill: '#06d6a0',
            name: 'Sales'
          }
        ]}
        xAxisKey="category"
        height={320}
        layout="vertical"
        yAxisFormatter={(value) => `$${(value / 1000)}k`}
        tooltipFormatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      />
    </ChartCard>
  );
}
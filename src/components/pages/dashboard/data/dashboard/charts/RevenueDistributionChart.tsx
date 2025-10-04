'use client';

import PieChart from '@/components/ui/charts/PieChart';
import ChartCard from '../ChartCard';
import { useRevenueDistribution } from '@/hooks/useDashboardData';

export default function RevenueDistributionChart() {
  const { revenueData, isLoading } = useRevenueDistribution();

  return (
    <ChartCard title="Revenue Distribution by Category" isLoading={isLoading}>
      <PieChart
        data={revenueData || []}
        dataKey="value"
        height={320}
        innerRadius={60}
        outerRadius={120}
        tooltipFormatter={(value) => [`${value}%`, 'Revenue']}
      />
    </ChartCard>
  );
}
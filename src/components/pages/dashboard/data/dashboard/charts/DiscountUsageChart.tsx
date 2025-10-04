'use client';

import PieChart from '@/components/ui/charts/PieChart';
import ChartCard from '../ChartCard';
import { useDiscountUsage } from '@/hooks/useDashboardData';

export default function DiscountUsageChart() {
  const { discountData, isLoading } = useDiscountUsage();

  return (
    <ChartCard title="Discount Usage" isLoading={isLoading}>
      <PieChart
        data={discountData || []}
        dataKey="value"
        height={320}
        innerRadius={60}
        outerRadius={120}
        tooltipFormatter={(value) => [`${value}%`, 'Orders']}
      />
    </ChartCard>
  );
}
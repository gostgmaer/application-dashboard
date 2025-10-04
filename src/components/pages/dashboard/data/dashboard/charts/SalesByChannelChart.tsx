'use client';

import PieChart from '@/components/ui/charts/PieChart';
import ChartCard from '../ChartCard';
import { useSalesByChannel } from '@/hooks/useDashboardData';


export default function SalesByChannelChart() {
  const { channelData, isLoading } = useSalesByChannel();

  return (
    <ChartCard title="Sales by Channel" isLoading={isLoading}>
      <PieChart
        data={channelData || []}
        dataKey="sales"
        nameKey="channel"
        height={320}
        innerRadius={60}
        outerRadius={120}
        colors={['#3b82f6', '#06d6a0', '#f59e0b', '#ef4444']}
        tooltipFormatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
      />
    </ChartCard>
  );
}
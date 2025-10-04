'use client';

import BarChart from '@/components/ui/charts/BarChart';
import ChartCard from '../ChartCard';
import { useConversionFunnel } from '@/hooks/useDashboardData';

const colors = ['#3b82f6', '#06d6a0', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ConversionFunnelChart() {
  const { funnelData, isLoading } = useConversionFunnel();

  return (
    <ChartCard title="Conversion Funnel" isLoading={isLoading}>
      <BarChart
        data={funnelData || []}
        bars={[
          {
            dataKey: 'count',
            fill: '#3b82f6',
            name: 'Count',
            radius: [0, 4, 4, 0]
          }
        ]}
        xAxisKey="stage"
        height={320}
        layout="horizontal"
        xAxisFormatter={(value) => `${(value / 1000)}k`}
        tooltipFormatter={(value, name) => [
          `${value.toLocaleString()} (${funnelData?.find(d => d.count === value)?.percentage}%)`,
          'Count'
        ]}
        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
        colors={colors}
      />
    </ChartCard>
  );
}
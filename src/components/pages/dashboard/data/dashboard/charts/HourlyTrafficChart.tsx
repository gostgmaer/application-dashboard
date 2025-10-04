'use client';

import LineChart from '@/components/ui/charts/LineChart';
import ChartCard from '../ChartCard';
import { useHourlyTraffic } from '@/hooks/useDashboardData';

export default function HourlyTrafficChart() {
  const { trafficData, isLoading } = useHourlyTraffic();

  return (
    <ChartCard title="Hourly Traffic Pattern" isLoading={isLoading}>
      <LineChart
        data={trafficData || []}
        lines={[
          {
            dataKey: 'visitors',
            stroke: '#06d6a0',
            strokeWidth: 3,
            name: 'Visitors',
            dot: { fill: '#06d6a0', strokeWidth: 2, r: 3 },
            activeDot: { r: 5, stroke: '#06d6a0', strokeWidth: 2 }
          }
        ]}
        xAxisKey="hour"
        height={320}
        tooltipFormatter={(value) => [`${value}`, 'Visitors']}
      />
    </ChartCard>
  );
}
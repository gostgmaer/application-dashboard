'use client';

import PieChart from '@/components/ui/charts/PieChart';
import ChartCard from '../ChartCard';
import { useDeviceTypes } from '@/hooks/useDashboardData';

export default function DeviceTypeChart() {
  const { deviceData, isLoading } = useDeviceTypes();

  return (
    <ChartCard title="Traffic by Device Type" isLoading={isLoading}>
      <PieChart
        data={deviceData || []}
        dataKey="sessions"
        nameKey="device"
        height={320}
        innerRadius={60}
        outerRadius={120}
        tooltipFormatter={(value, name, props) => [
          `${value.toLocaleString()} (${props.payload.percentage}%)`,
          'Sessions'
        ]}
      />
    </ChartCard>
  );
}
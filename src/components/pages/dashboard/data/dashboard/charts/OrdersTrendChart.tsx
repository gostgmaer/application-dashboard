'use client';

import AreaChart from '@/components/ui/charts/AreaChart';
import ChartCard from '../ChartCard';
import { useOrdersData } from '@/hooks/useDashboardData';

export default function OrdersTrendChart() {
  const { ordersData, isLoading } = useOrdersData();

  return (
    <ChartCard title="Orders Trend" isLoading={isLoading}>
      <AreaChart
        data={ordersData || []}
        areas={[
          {
            dataKey: 'orders',
            stroke: '#f59e0b',
            fill: 'url(#colorOrders)',
            strokeWidth: 2,
            name: 'Orders'
          }
        ]}
        xAxisKey="month"
        height={320}
        tooltipFormatter={(value) => [`${value}`, 'Orders']}
        gradients={[
          {
            id: 'colorOrders',
            colors: [
              { offset: '5%', stopColor: '#f59e0b', stopOpacity: 0.3 },
              { offset: '95%', stopColor: '#f59e0b', stopOpacity: 0.1 }
            ]
          }
        ]}
      />
    </ChartCard>
  );
}
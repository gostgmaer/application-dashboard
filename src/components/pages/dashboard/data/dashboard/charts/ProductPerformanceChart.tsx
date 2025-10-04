'use client';

import ComposedChart from '@/components/ui/charts/ComposedChart';
import ChartCard from '../ChartCard';
import { useProductPerformance } from '@/hooks/useDashboardData';

export default function ProductPerformanceChart() {
  const { performanceData, isLoading } = useProductPerformance();

  return (
    <ChartCard title="Product Performance: Views vs Sales" isLoading={isLoading}>
      <ComposedChart
        data={performanceData || []}
        bars={[
          { dataKey: 'views', fill: '#e5e7eb', name: 'views', yAxisId: 'left' },
          { dataKey: 'sales', fill: '#3b82f6', name: 'sales', yAxisId: 'left' }
        ]}
        lines={[
          { 
            dataKey: 'conversion', 
            stroke: '#ef4444', 
            strokeWidth: 3, 
            name: 'conversion', 
            yAxisId: 'right',
            dot: { fill: '#ef4444', strokeWidth: 2, r: 4 }
          }
        ]}
        xAxisKey="month"
        height={320}
        showRightYAxis={true}
        yAxisFormatter={(value) => `${(value / 1000)}k`}
        rightYAxisFormatter={(value) => `${value}%`}
        tooltipFormatter={(value, name) => {
          if (name === 'conversion') return [`${value}%`, 'Conversion Rate'];
          return [`${value.toLocaleString()}`, name === 'views' ? 'Views' : 'Sales'];
        }}
      />
    </ChartCard>
  );
}
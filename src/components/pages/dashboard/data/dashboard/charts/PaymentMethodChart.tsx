'use client';

import PieChart from '@/components/ui/charts/PieChart';
import ChartCard from '../ChartCard';
import { usePaymentMethods } from '@/hooks/useDashboardData';

export default function PaymentMethodChart() {
  const { paymentData, isLoading } = usePaymentMethods();

  return (
    <ChartCard title="Payment Methods Distribution" isLoading={isLoading}>
      <PieChart
        data={paymentData || []}
        dataKey="transactions"
        nameKey="method"
        height={320}
        innerRadius={60}
        outerRadius={120}
        tooltipFormatter={(value, name, props) => [
          `${value.toLocaleString()} (${props.payload.percentage}%)`,
          'Transactions'
        ]}
      />
    </ChartCard>
  );
}
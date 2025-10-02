'use client';

import { useState } from 'react';
import { Toolbar } from './dashboard/toolbar';
import { StatsSection } from './dashboard/stats-section';
import { ChartsSection } from './dashboard/charts-section';
import { AnalyticsSection } from './dashboard/analytics-section';
import { OrdersTablePlaceholder } from './dashboard/orders-table-placeholder';

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen">
      <div className=" mx-auto space-y-8">
        <Toolbar
          onAddOrder={() => console.log('Add Order')}
          onExport={() => console.log('Export')}
          onRefresh={handleRefresh}
          onClearFilters={() => console.log('Clear Filters')}
          onSearch={(query) => console.log('Search:', query)}
          onFilterChange={(filters) => console.log('Filters:', filters)}
        />

        <StatsSection isLoading={isLoading} />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <ChartsSection isLoading={isLoading} />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Reports & Performance</h2>
          <AnalyticsSection isLoading={isLoading} />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Orders</h2>
          <OrdersTablePlaceholder isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Award,
  CreditCard,
  Percent,
  Menu,
  X,
  Target,
  ShoppingBag,
  RotateCcw,
  Heart,
  Repeat,
  Zap,
  ChartBar as BarChart3,
  MousePointer,
} from "lucide-react";

import StatsCard from "@/components/pages/dashboard/data/dashboard/StatsCard";
import SelectFilter from "@/components/pages/dashboard/data/dashboard/SelectFilter";

// Charts
// import SalesChart from '@/components/pages/dashboard/data/dashboard/data/charts/SalesChart';
import TopCategoriesChart from "@/components/pages/dashboard/data/dashboard/charts/TopCategoriesChart";
import RevenueDistributionChart from "@/components/pages/dashboard/data/dashboard/charts/RevenueDistributionChart";
import OrdersTrendChart from "@/components/pages/dashboard/data/dashboard/charts/OrdersTrendChart";
import CustomerGrowthChart from "@/components/pages/dashboard/data/dashboard/charts/CustomerGrowthChart";
import DiscountUsageChart from "@/components/pages/dashboard/data/dashboard/charts/DiscountUsageChart";

import SalesByChannelChart from "@/components/pages/dashboard/data/dashboard/charts/SalesByChannelChart";
import ProductPerformanceChart from "@/components/pages/dashboard/data/dashboard/charts/ProductPerformanceChart";
import PaymentMethodChart from "@/components/pages/dashboard/data/dashboard/charts/PaymentMethodChart";

// Tables
import TopProductsTable from "@/components/pages/dashboard/data/dashboard/tables/TopProductsTable";
import TopBrandsTable from "@/components/pages/dashboard/data/dashboard/tables/TopBrandsTable";
import RecentOrdersTable from "@/components/pages/dashboard/data/dashboard/tables/RecentOrdersTable";
import TopDiscountedTable from "@/components/pages/dashboard/data/dashboard/tables/TopDiscountedTable";
import LowStockTable from "@/components/pages/dashboard/data/dashboard/tables/LowStockTable";
import RecentlyAddedList from "@/components/pages/dashboard/data/dashboard/tables/RecentlyAddedList";

import { useStats, useFilterOptions } from "@/hooks/useDashboardData";
import SalesChart from "@/components/pages/dashboard/data/dashboard/charts/SalesChart";
import PrivateLayout from "@/components/layout/dashboard";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: "Month",
    category: "All Categories",
    status: "All Status",
  });

  // SWR hook for stats data with filters
  const { stats, isLoading: statsLoading } = useStats(filters);
  const { filterOptions } = useFilterOptions();

  const defaultFilterOptions = {
    timeRange: ['Today', 'Week', 'Month', 'Quarter', 'Year'],
    category: ['All Categories'],
    status: ['All Status'],
  };
  const options = filterOptions || defaultFilterOptions;

  const getMetric = (key: string) => {
    const metric = (stats as Record<string, { value?: number | string; change?: number; trend?: 'up' | 'down' }> | undefined)?.[key];

    return {
      value: metric?.value ?? 0,
      change: metric?.change,
      trend: metric?.trend,
    };
  };

  const totalSales = getMetric("totalSales");
  const totalOrders = getMetric("totalOrders");
  const totalCustomers = getMetric("totalCustomers");
  const totalRevenue = getMetric("totalRevenue");
  const totalProducts = getMetric("totalProducts");
  const totalBrands = getMetric("totalBrands");
  const averageOrderValue = getMetric("averageOrderValue");
  const totalDiscounts = getMetric("totalDiscounts");
  const conversionRate = getMetric("conversionRate");
  const cartAbandonmentRate = getMetric("cartAbandonmentRate");
  const returnRate = getMetric("returnRate");
  const customerLifetimeValue = getMetric("customerLifetimeValue");
  const monthlyRecurringRevenue = getMetric("monthlyRecurringRevenue");
  const grossMargin = getMetric("grossMargin");
  const inventoryTurnover = getMetric("inventoryTurnover");
  const customerAcquisitionCost = getMetric("customerAcquisitionCost");

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // In production, this would trigger SWR revalidation with new filter params
    console.log(`Filter changed: ${key} = ${value}`);
  };

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
             {/* Global Filters */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Filters
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectFilter
                      label="Time Range"
                      options={options.timeRange}
                      value={filters.timeRange}
                      onChange={(value) =>
                        handleFilterChange("timeRange", value)
                      }
                    />
                    <SelectFilter
                      label="Category"
                      options={options.category}
                      value={filters.category}
                      onChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    />
                    <SelectFilter
                      label="Status"
                      options={options.status}
                      value={filters.status}
                      onChange={(value) => handleFilterChange("status", value)}
                    />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatsCard
                    title="Total Sales"
                    value={totalSales.value}
                    change={totalSales.change}
                    trend={totalSales.trend}
                    icon={<DollarSign className="w-6 h-6" />}
                    isLoading={statsLoading}
                    link="/dashboard/sales"
                  />
                  <StatsCard
                    title="Total Orders"
                    value={totalOrders.value}
                    change={totalOrders.change}
                    trend={totalOrders.trend}
                    icon={<ShoppingCart className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Customers"
                    value={totalCustomers.value}
                    change={totalCustomers.change}
                    trend={totalCustomers.trend}
                    icon={<Users className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Revenue"
                    value={totalRevenue.value}
                    change={totalRevenue.change}
                    trend={totalRevenue.trend}
                    icon={<TrendingUp className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Products"
                    value={totalProducts.value}
                    change={totalProducts.change}
                    trend={totalProducts.trend}
                    icon={<Package className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Brands"
                    value={totalBrands.value}
                    change={totalBrands.change}
                    trend={totalBrands.trend}
                    icon={<Award className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Avg Order Value"
                    value={`$${averageOrderValue.value}`}
                    change={averageOrderValue.change}
                    trend={averageOrderValue.trend}
                    icon={<CreditCard className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Discounts"
                    value={totalDiscounts.value}
                    change={totalDiscounts.change}
                    trend={totalDiscounts.trend}
                    icon={<Percent className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Conversion Rate"
                    value={`${conversionRate.value}%`}
                    change={conversionRate.change}
                    trend={conversionRate.trend}
                    icon={<Target className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Cart Abandonment"
                    value={`${cartAbandonmentRate.value}%`}
                    change={cartAbandonmentRate.change}
                    trend={cartAbandonmentRate.trend}
                    icon={<ShoppingBag className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Return Rate"
                    value={`${returnRate.value}%`}
                    change={returnRate.change}
                    trend={returnRate.trend}
                    icon={<RotateCcw className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Customer LTV"
                    value={`$${customerLifetimeValue.value}`}
                    change={customerLifetimeValue.change}
                    trend={customerLifetimeValue.trend}
                    icon={<Heart className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Monthly Recurring Revenue"
                    value={monthlyRecurringRevenue.value}
                    change={monthlyRecurringRevenue.change}
                    trend={monthlyRecurringRevenue.trend}
                    icon={<Repeat className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Gross Margin"
                    value={`${grossMargin.value}%`}
                    change={grossMargin.change}
                    trend={grossMargin.trend}
                    icon={<Zap className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Inventory Turnover"
                    value={`${inventoryTurnover.value}x`}
                    change={inventoryTurnover.change}
                    trend={inventoryTurnover.trend}
                    icon={<BarChart3 className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Customer Acquisition Cost"
                    value={`$${customerAcquisitionCost.value}`}
                    change={customerAcquisitionCost.change}
                    trend={customerAcquisitionCost.trend}
                    icon={<MousePointer className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <SalesChart />
                  <TopCategoriesChart />
                  <RevenueDistributionChart />
                  <OrdersTrendChart />
                  <CustomerGrowthChart />
                  <DiscountUsageChart />
                  <SalesByChannelChart />
                  <ProductPerformanceChart />
                  <PaymentMethodChart />
                </div>

                {/* Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <TopProductsTable />
                  <TopBrandsTable />
                  <RecentOrdersTable />
                  <TopDiscountedTable />
                  <LowStockTable />
                  <RecentlyAddedList />
                </div>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}

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

// New Charts
import ConversionFunnelChart from "@/components/pages/dashboard/data/dashboard/charts/ConversionFunnelChart";
import SalesByChannelChart from "@/components/pages/dashboard/data/dashboard/charts/SalesByChannelChart";
import HourlyTrafficChart from "@/components/pages/dashboard/data/dashboard/charts/HourlyTrafficChart";
import ProductPerformanceChart from "@/components/pages/dashboard/data/dashboard/charts/ProductPerformanceChart";
import AgeGroupChart from "@/components/pages/dashboard/data/dashboard/charts/AgeGroupChart";
import DeviceTypeChart from "@/components/pages/dashboard/data/dashboard/charts/DeviceTypeChart";
import PaymentMethodChart from "@/components/pages/dashboard/data/dashboard/charts/PaymentMethodChart";

// Tables
import TopProductsTable from "@/components/pages/dashboard/data/dashboard/tables/TopProductsTable";
import TopBrandsTable from "@/components/pages/dashboard/data/dashboard/tables/TopBrandsTable";
import RecentOrdersTable from "@/components/pages/dashboard/data/dashboard/tables/RecentOrdersTable";
import TopDiscountedTable from "@/components/pages/dashboard/data/dashboard/tables/TopDiscountedTable";
import LowStockTable from "@/components/pages/dashboard/data/dashboard/tables/LowStockTable";
import RecentlyAddedList from "@/components/pages/dashboard/data/dashboard/tables/RecentlyAddedList";

// New Tables
import TopCountriesTable from "@/components/pages/dashboard/data/dashboard/tables/TopCountriesTable";

import { useStats } from "@/hooks/useDashboardData";
import { filterOptions } from "@/lib/mockData";
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
                      options={filterOptions.timeRange}
                      value={filters.timeRange}
                      onChange={(value) =>
                        handleFilterChange("timeRange", value)
                      }
                    />
                    <SelectFilter
                      label="Category"
                      options={filterOptions.category}
                      value={filters.category}
                      onChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    />
                    <SelectFilter
                      label="Status"
                      options={filterOptions.status}
                      value={filters.status}
                      onChange={(value) => handleFilterChange("status", value)}
                    />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatsCard
                    title="Total Sales"
                    value={stats?.totalSales.value || 0}
                    change={stats?.totalSales.change}
                    trend={stats?.totalSales.trend}
                    icon={<DollarSign className="w-6 h-6" />}
                    isLoading={statsLoading}
                    link="/dashboard/sales"
                  />
                  <StatsCard
                    title="Total Orders"
                    value={stats?.totalOrders.value || 0}
                    change={stats?.totalOrders.change}
                    trend={stats?.totalOrders.trend}
                    icon={<ShoppingCart className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Customers"
                    value={stats?.totalCustomers.value || 0}
                    change={stats?.totalCustomers.change}
                    trend={stats?.totalCustomers.trend}
                    icon={<Users className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Revenue"
                    value={stats?.totalRevenue.value || 0}
                    change={stats?.totalRevenue.change}
                    trend={stats?.totalRevenue.trend}
                    icon={<TrendingUp className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Products"
                    value={stats?.totalProducts.value || 0}
                    change={stats?.totalProducts.change}
                    trend={stats?.totalProducts.trend}
                    icon={<Package className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Brands"
                    value={stats?.totalBrands.value || 0}
                    change={stats?.totalBrands.change}
                    trend={stats?.totalBrands.trend}
                    icon={<Award className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Avg Order Value"
                    value={`$${stats?.averageOrderValue.value || 0}`}
                    change={stats?.averageOrderValue.change}
                    trend={stats?.averageOrderValue.trend}
                    icon={<CreditCard className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Total Discounts"
                    value={stats?.totalDiscounts.value || 0}
                    change={stats?.totalDiscounts.change}
                    trend={stats?.totalDiscounts.trend}
                    icon={<Percent className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Conversion Rate"
                    value={`${stats?.conversionRate.value || 0}%`}
                    change={stats?.conversionRate.change}
                    trend={stats?.conversionRate.trend}
                    icon={<Target className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Cart Abandonment"
                    value={`${stats?.cartAbandonmentRate.value || 0}%`}
                    change={stats?.cartAbandonmentRate.change}
                    trend={stats?.cartAbandonmentRate.trend}
                    icon={<ShoppingBag className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Return Rate"
                    value={`${stats?.returnRate.value || 0}%`}
                    change={stats?.returnRate.change}
                    trend={stats?.returnRate.trend}
                    icon={<RotateCcw className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Customer LTV"
                    value={`$${stats?.customerLifetimeValue.value || 0}`}
                    change={stats?.customerLifetimeValue.change}
                    trend={stats?.customerLifetimeValue.trend}
                    icon={<Heart className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Monthly Recurring Revenue"
                    value={stats?.monthlyRecurringRevenue.value || 0}
                    change={stats?.monthlyRecurringRevenue.change}
                    trend={stats?.monthlyRecurringRevenue.trend}
                    icon={<Repeat className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Gross Margin"
                    value={`${stats?.grossMargin.value || 0}%`}
                    change={stats?.grossMargin.change}
                    trend={stats?.grossMargin.trend}
                    icon={<Zap className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Inventory Turnover"
                    value={`${stats?.inventoryTurnover.value || 0}x`}
                    change={stats?.inventoryTurnover.change}
                    trend={stats?.inventoryTurnover.trend}
                    icon={<BarChart3 className="w-6 h-6" />}
                    isLoading={statsLoading}
                  />
                  <StatsCard
                    title="Customer Acquisition Cost"
                    value={`$${stats?.customerAcquisitionCost.value || 0}`}
                    change={stats?.customerAcquisitionCost.change}
                    trend={stats?.customerAcquisitionCost.trend}
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
                  <ConversionFunnelChart />
                  <SalesByChannelChart />
                  <HourlyTrafficChart />
                  <ProductPerformanceChart />
                  <AgeGroupChart />
                  <DeviceTypeChart />
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
                  <TopCountriesTable />
                </div>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}

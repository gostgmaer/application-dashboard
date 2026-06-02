'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import dashboardService from '@/lib/http/dashboardService';

// SWR fetcher that calls dashboard service with auth token
const createFetcher = (serviceFn: Function, token?: string) => async () => {
  const response = await serviceFn(token);
  if (response?.success && response?.data) {
    return response.data;
  }
  throw new Error(response?.error || response?.message || 'Failed to fetch');
};

// Custom hooks for dashboard data
export const useStats = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/stats' : null,
    () => createFetcher(dashboardService.getStats, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { stats: data, isLoading, error };
};

export const useSalesData = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/sales' : null,
    () => createFetcher(dashboardService.getSalesTrend, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { salesData: data, isLoading, error };
};

export const useCategoriesData = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/top-categories' : null,
    () => createFetcher(dashboardService.getTopCategories, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { categoriesData: data, isLoading, error };
};

export const useRevenueDistribution = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/revenue-distribution' : null,
    () => createFetcher(dashboardService.getRevenueDistribution, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { revenueData: data, isLoading, error };
};

export const useOrdersData = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/orders-trend' : null,
    () => createFetcher(dashboardService.getOrdersTrend, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { ordersData: data, isLoading, error };
};

export const useCustomersData = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/customer-growth' : null,
    () => createFetcher(dashboardService.getCustomerGrowth, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { customersData: data, isLoading, error };
};

export const useDiscountUsage = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/discount-usage' : null,
    () => createFetcher(dashboardService.getDiscountUsage, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { discountData: data, isLoading, error };
};

export const useTopProducts = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/top-products' : null,
    () => createFetcher(dashboardService.getTopProducts, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { products: data, isLoading, error };
};

export const useTopBrands = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/top-brands' : null,
    () => createFetcher(dashboardService.getTopBrands, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { brands: data, isLoading, error };
};

export const useRecentOrders = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/recent-orders' : null,
    () => createFetcher(dashboardService.getRecentOrders, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { orders: data, isLoading, error };
};

export const useDiscountedProducts = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/discounted-products' : null,
    () => createFetcher(dashboardService.getDiscountedProducts, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { discountedProducts: data, isLoading, error };
};

export const useLowStockProducts = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/low-stock' : null,
    () => createFetcher(dashboardService.getLowStock, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { lowStockProducts: data, isLoading, error };
};

export const useRecentlyAdded = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/recently-added' : null,
    () => createFetcher(dashboardService.getRecentlyAdded, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { recentlyAdded: data, isLoading, error };
};

export const useConversionFunnel = (filters?: any) => {
  // Conversion funnel requires analytics tracking — not available from backend yet
  return { funnelData: null, isLoading: false, error: null };
};

export const useSalesByChannel = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/sales-by-channel' : null,
    () => createFetcher(dashboardService.getSalesByChannel, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { channelData: data, isLoading, error };
};

export const useTopCountries = (filters?: any) => {
  // Geographic data requires address aggregation — not available yet
  return { countriesData: null, isLoading: false, error: null };
};

export const useHourlyTraffic = (filters?: any) => {
  // Hourly traffic requires analytics tracking — not available from backend
  return { trafficData: null, isLoading: false, error: null };
};

export const useProductPerformance = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/product-performance' : null,
    () => createFetcher(dashboardService.getProductPerformance, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { performanceData: data, isLoading, error };
};

export const useAgeGroups = (filters?: any) => {
  // Age group data requires user demographics — not tracked in user model
  return { ageData: null, isLoading: false, error: null };
};

export const useDeviceTypes = (filters?: any) => {
  // Device type data requires session analytics — not available from backend
  return { deviceData: null, isLoading: false, error: null };
};

export const usePaymentMethods = (filters?: any) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/payment-methods' : null,
    () => createFetcher(dashboardService.getPaymentMethods, token)(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { paymentData: data, isLoading, error };
};

// Filter options
export const useFilterOptions = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const { data, error, isLoading } = useSWR(
    token ? '/api/admin/dashboard/filter-options' : null,
    () => createFetcher(dashboardService.getFilterOptions, token)(),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  return { filterOptions: data, isLoading, error };
};
'use client';

import useSWR from 'swr';
import {
  statsData,
  salesChartData,
  topCategoriesData,
  revenueDistributionData,
  ordersTrendData,
  customerGrowthData,
  discountUsageData,
  topProductsData,
  topBrandsData,
  recentOrdersData,
  topDiscountedData,
  lowStockData,
  recentlyAddedData,
  conversionFunnelData,
  salesByChannelData,
  topCountriesData,
  hourlyTrafficData,
  productPerformanceData,
  ageGroupData,
  deviceTypeData,
  paymentMethodData
} from '@/lib/mockData';

// Mock fetcher - in production, this would be a real API call
const fetcher = (url: string) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockData(url));
    }, 100);
  });
};

const getMockData = (url: string) => {
  switch (url) {
    case '/api/stats':
      return statsData;
    case '/api/sales':
      return salesChartData;
    case '/api/categories':
      return topCategoriesData;
    case '/api/revenue-distribution':
      return revenueDistributionData;
    case '/api/orders':
      return ordersTrendData;
    case '/api/customers':
      return customerGrowthData;
    case '/api/discount-usage':
      return discountUsageData;
    case '/api/products/top':
      return topProductsData;
    case '/api/brands/top':
      return topBrandsData;
    case '/api/orders/recent':
      return recentOrdersData;
    case '/api/products/discounted':
      return topDiscountedData;
    case '/api/products/low-stock':
      return lowStockData;
    case '/api/products/recently-added':
      return recentlyAddedData;
    case '/api/conversion-funnel':
      return conversionFunnelData;
    case '/api/sales-by-channel':
      return salesByChannelData;
    case '/api/top-countries':
      return topCountriesData;
    case '/api/hourly-traffic':
      return hourlyTrafficData;
    case '/api/product-performance':
      return productPerformanceData;
    case '/api/age-groups':
      return ageGroupData;
    case '/api/device-types':
      return deviceTypeData;
    case '/api/payment-methods':
      return paymentMethodData;
    default:
      return null;
  }
};

// Custom hooks for dashboard data
export const useStats: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/stats', fetcher);

  return {
    stats: data,
    isLoading,
    error,
  };
};

export const useSalesData: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/sales', fetcher);

  return {
    salesData: data,
    isLoading,
    error,
  };
};

export const useCategoriesData: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher);

  return {
    categoriesData: data,
    isLoading,
    error,
  };
};

export const useRevenueDistribution: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/revenue-distribution', fetcher);

  return {
    revenueData: data,
    isLoading,
    error,
  };
};

export const useOrdersData: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/orders', fetcher);

  return {
    ordersData: data,
    isLoading,
    error,
  };
};

export const useCustomersData: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/customers', fetcher);

  return {
    customersData: data,
    isLoading,
    error,
  };
};

export const useDiscountUsage: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/discount-usage', fetcher);

  return {
    discountData: data,
    isLoading,
    error,
  };
};

export const useTopProducts: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/products/top', fetcher);

  return {
    products: data,
    isLoading,
    error,
  };
};

export const useTopBrands: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/brands/top', fetcher);

  return {
    brands: data,
    isLoading,
    error,
  };
};

export const useRecentOrders: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/orders/recent', fetcher);

  return {
    orders: data,
    isLoading,
    error,
  };
};

export const useDiscountedProducts: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/products/discounted', fetcher);

  return {
    discountedProducts: data,
    isLoading,
    error,
  };
};

export const useLowStockProducts: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/products/low-stock', fetcher);

  return {
    lowStockProducts: data,
    isLoading,
    error,
  };
};

export const useRecentlyAdded: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/products/recently-added', fetcher);

  return {
    recentlyAdded: data,
    isLoading,
    error,
  };
};
export const useConversionFunnel: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/conversion-funnel', fetcher);

  return {
    funnelData: data,
    isLoading,
    error,
  };
};

export const useSalesByChannel: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/sales-by-channel', fetcher);

  return {
    channelData: data,
    isLoading,
    error,
  };
};

export const useTopCountries: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/top-countries', fetcher);

  return {
    countriesData: data,
    isLoading,
    error,
  };
};

export const useHourlyTraffic: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/hourly-traffic', fetcher);

  return {
    trafficData: data,
    isLoading,
    error,
  };
};

export const useProductPerformance: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/product-performance', fetcher);

  return {
    performanceData: data,
    isLoading,
    error,
  };
};

export const useAgeGroups: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/age-groups', fetcher);

  return {
    ageData: data,
    isLoading,
    error,
  };
};

export const useDeviceTypes: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/device-types', fetcher);

  return {
    deviceData: data,
    isLoading,
    error,
  };
};

export const usePaymentMethods: any = (filters?: any) => {
  const { data, error, isLoading } = useSWR('/api/payment-methods', fetcher);

  return {
    paymentData: data,
    isLoading,
    error,
  };
};
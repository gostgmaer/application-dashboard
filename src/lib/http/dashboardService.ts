import { safeApiCall } from "./apiUtils";
import requests from "./index";
import { ApiResponse } from "@/types/global";

const dashboardService = {
  getStats: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/stats", token, undefined, undefined, headers)),

  getSalesTrend: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/sales", token, undefined, undefined, headers)),

  getOrdersTrend: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/orders-trend", token, undefined, undefined, headers)),

  getCustomerGrowth: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/customer-growth", token, undefined, undefined, headers)),

  getTopCategories: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/top-categories", token, undefined, undefined, headers)),

  getRevenueDistribution: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/revenue-distribution", token, undefined, undefined, headers)),

  getDiscountUsage: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/discount-usage", token, undefined, undefined, headers)),

  getTopProducts: (token?: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/top-products", token, query, undefined, headers)),

  getTopBrands: (token?: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/top-brands", token, query, undefined, headers)),

  getRecentOrders: (token?: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/recent-orders", token, query, undefined, headers)),

  getDiscountedProducts: (token?: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/discounted-products", token, query, undefined, headers)),

  getLowStock: (token?: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/low-stock", token, query, undefined, headers)),

  getRecentlyAdded: (token?: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/recently-added", token, query, undefined, headers)),

  getSalesByChannel: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/sales-by-channel", token, undefined, undefined, headers)),

  getProductPerformance: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/product-performance", token, undefined, undefined, headers)),

  getPaymentMethods: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/payment-methods", token, undefined, undefined, headers)),

  getFilterOptions: (token?: string, headers?: Record<string, string>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/admin/dashboard/filter-options", token, undefined, undefined, headers)),
};

export default dashboardService;

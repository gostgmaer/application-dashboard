import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const productService = {
  // CRUD
  create: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products`, body, token, headers)),

  get: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}`, token, undefined, undefined, headers, 1)),

  list: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products`, token, query, undefined, headers, 1)),

  listAll: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/all`, token, query, undefined, headers, 1)),

  update: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}`, body, token, headers)),

  remove: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/products/${id}`, token, undefined, headers)),

  // Bulk Operations
  bulkDelete: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/products/bulk/delete`, body, token, headers)),


  bulkUpdateStatus: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/bulk/status`, body, token, headers)),

  bulkUpdateStock: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/bulk/stock`, body, token, headers)),

  bulkPriceUpdate: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/bulk/price-update`, body, token, headers)),

  // Search & Filters
  search: async (params: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    const { keyword, ...query } = params;
    return safeApiCall(() => requests.get(`/products/search/${keyword}`, token, query, undefined, headers, 1));
  },

  featured: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/featured`, token, query, undefined, headers, 1)),

  lowStock: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/low-stock`, token, undefined, undefined, headers, 1)),

  outOfStock: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/out-of-stock`, token, undefined, undefined, headers, 1)),

  byCategory: async (categoryId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/category/${categoryId}`, token, undefined, undefined, headers, 1)),

  byTags: async (tags: string, query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/tags/${tags}`, token, query, undefined, headers, 1)),

  newArrivals: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/new-arrivals`, token, query, undefined, headers, 1)),

  priceRange: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/price-range`, token, query, undefined, headers, 1)),

  topSelling: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/top-selling`, token, query, undefined, headers, 1)),

  mostViewed: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/most-viewed`, token, query, undefined, headers, 1)),

  discounted: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/discounted`, token, undefined, undefined, headers, 1)),

  // Instance methods
  getSimplifiedImages: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/images/simplified`, token, undefined, undefined, headers, 1)),

  getFinalPrice: async (id: string, quantity?: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/price/final`, token, quantity ? { quantity } : undefined, undefined, headers, 1)),

  getStockStatusData: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/stock/status`, token, undefined, undefined, headers, 1)),

  markAsOutOfStock: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/stock/mark-out`, token, undefined, headers)),

  incrementProductViews: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/views/increment`, token, undefined, headers)),

  incrementSold: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/sold/increment`, token, undefined, headers)),

  isDiscountActive: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/discount/active`, token, undefined, undefined, headers, 1)),

  getSEOData: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/seo`, token, undefined, undefined, headers, 1)),

  getBulkDiscountPrice: async (id: string, quantity?: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/price/bulk`, token, quantity ? { quantity } : undefined, undefined, headers, 1)),

  isPurchasable: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/purchasable`, token, undefined, undefined, headers, 1)),

  reduceStock: async (id: string, quantity: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/stock/reduce`, { quantity }, token, headers)),

  restockProduct: async (id: string, quantity: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/stock/restock`, { quantity }, token, headers)),

  toggleFeatured: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/featured/toggle`, token, undefined, headers)),

  getRelatedProducts: async (id: string, limit?: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/related`, token, limit ? { limit } : undefined, undefined, headers, 1)),

  isPartOfBundle: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/bundle/check`, token, undefined, undefined, headers, 1)),

  getDiscountPercent: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/discount/percent`, token, undefined, undefined, headers, 1)),

  addProductReview: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products/${id}/reviews/add`, body, token, headers)),

  applyPromotion: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/promotion/apply`, body, token, headers)),

  isPreOrderAvailable: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/preorder/check`, token, undefined, undefined, headers, 1)),

  getBundleTotalPrice: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/bundle/price`, token, undefined, undefined, headers, 1)),

  getRatingStatistics: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/ratings/statistics`, token, undefined, undefined, headers, 1)),

  getVirtualStockStatus: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/stock/virtual-status`, token, undefined, undefined, headers, 1)),

  getSchemaReport: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/analytics/schema-report`, token, undefined, undefined, headers, 1)),

  getDatabaseStatistics: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/analytics/database-stats`, token, undefined, undefined, headers, 1)),

  getProductsWithAnalytics: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/analytics/products`, token, undefined, undefined, headers, 1)),

  getAverageRatingByCategory: async (categoryId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/category/${categoryId}/rating`, token, undefined, undefined, headers, 1)),

  updateStock: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/stock/update`, body, token, headers)),

  archiveOldProducts: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products/archive/old`, body, token, headers)),

  addFavorite: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products/favorites/${id}`, {}, token, headers)),

  removeFavorite: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/products/favorites/${id}`, token, undefined, headers)),

  listFavorites: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/favorites`, token, undefined, undefined, headers, 1)),

  getRecommendations: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/recommendations/${id}`, token, undefined, undefined, headers, 1)),

  importCSV: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products/import`, body, token, headers)),

  exportCSV: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/export`, token, undefined, undefined, headers, 1)),

  approveReview: async (id: string, reviewId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/${id}/reviews/${reviewId}/approve`, {}, token, headers)),

  removeReview: async (id: string, reviewId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/products/${id}/reviews/${reviewId}`, token, undefined, headers)),

  lowStockAlerts: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/alerts/low-stock`, token, undefined, undefined, headers, 1)),

  sendLowStockEmails: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products/alerts/low-stock/email`, {}, token, headers)),

  scheduleFlashSale: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products/flash-sale`, body, token, headers)),

  salesMetrics: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/analytics/sales-metrics`, token, undefined, undefined, headers, 1)),

  popularity: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/analytics/popularity`, token, undefined, undefined, headers, 1)),

  upsertCategory: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/products/taxonomy/category`, body, token, headers)),

  updateCategory: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/products/taxonomy/category/${id}`, body, token, headers)),

  listCategories: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/taxonomy/categories`, token, query, undefined, headers, 1)),

  listDownloads: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/downloads`, token, undefined, undefined, headers, 1)),

  downloadFile: async (
    id: string,
    fileIndex: number,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/${id}/downloads/${fileIndex}`, token, undefined, undefined, headers, 1)),

  docs: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/products/docs/routes`, token, undefined, undefined, headers, 1)),
};

export default productService;

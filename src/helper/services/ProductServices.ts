import requests from "./index";
import { safeApiCall, ApiResponse } from "./apiUtils";

const productService = {
  // CRUD
  create: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product`, body, token, headers)),

  get: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}`, token, undefined, undefined, headers, 1)),

  list: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product`, token, query, undefined, headers, 1)),

  listAll: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/all`, token, query, undefined, headers, 1)),

  update: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}`, body, token, headers)),

  remove: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/product/${id}`, token, undefined, headers)),

  // Bulk Operations
  bulkDelete: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/product/bulk/delete`, body, token, headers)),
  
  bulkUpdateStatus: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/bulk/status`, body, token, headers)),

  bulkUpdateStock: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/bulk/stock`, body, token, headers)),

  bulkPriceUpdate: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/bulk/price-update`, body, token, headers)),

  // Search & Filters
  search: async (params: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    const { keyword, ...query } = params;
    return safeApiCall(() => requests.get(`/product/search/${keyword}`, token, query, undefined, headers, 1));
  },

  featured: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/featured`, token, query, undefined, headers, 1)),

  lowStock: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/low-stock`, token, undefined, undefined, headers, 1)),

  outOfStock: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/out-of-stock`, token, undefined, undefined, headers, 1)),

  byCategory: async (categoryId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/category/${categoryId}`, token, undefined, undefined, headers, 1)),

  byTags: async (tags: string, query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/tags/${tags}`, token, query, undefined, headers, 1)),

  newArrivals: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/new-arrivals`, token, query, undefined, headers, 1)),

  priceRange: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/price-range`, token, query, undefined, headers, 1)),

  topSelling: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/top-selling`, token, query, undefined, headers, 1)),

  mostViewed: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/most-viewed`, token, query, undefined, headers, 1)),

  discounted: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/discounted`, token, undefined, undefined, headers, 1)),

  // Instance methods
  getSimplifiedImages: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/images/simplified`, token, undefined, undefined, headers, 1)),

  getFinalPrice: async (id: string, quantity?: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/price/final`, token, quantity ? { quantity } : undefined, undefined, headers, 1)),

  getStockStatusData: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/stock/status`, token, undefined, undefined, headers, 1)),

  markAsOutOfStock: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/stock/mark-out`, token, undefined, headers)),

  incrementProductViews: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/views/increment`, token, undefined, headers)),

  incrementSold: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/sold/increment`, token, undefined, headers)),

  isDiscountActive: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/discount/active`, token, undefined, undefined, headers, 1)),

  getSEOData: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/seo`, token, undefined, undefined, headers, 1)),

  getBulkDiscountPrice: async (id: string, quantity?: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/price/bulk`, token, quantity ? { quantity } : undefined, undefined, headers, 1)),

  isPurchasable: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/purchasable`, token, undefined, undefined, headers, 1)),

  reduceStock: async (id: string, quantity: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/stock/reduce`, { quantity }, token, headers)),

  restockProduct: async (id: string, quantity: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/stock/restock`, { quantity }, token, headers)),

  toggleFeatured: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/featured/toggle`, token, undefined, headers)),

  getRelatedProducts: async (id: string, limit?: number, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/related`, token, limit ? { limit } : undefined, undefined, headers, 1)),

  isPartOfBundle: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/bundle/check`, token, undefined, undefined, headers, 1)),

  getDiscountPercent: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/discount/percent`, token, undefined, undefined, headers, 1)),

  addProductReview: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product/${id}/reviews/add`, body, token, headers)),

  applyPromotion: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/promotion/apply`, body, token, headers)),

  isPreOrderAvailable: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/preorder/check`, token, undefined, undefined, headers, 1)),

  getBundleTotalPrice: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/bundle/price`, token, undefined, undefined, headers, 1)),

  getRatingStatistics: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/ratings/statistics`, token, undefined, undefined, headers, 1)),

  getVirtualStockStatus: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/stock/virtual-status`, token, undefined, undefined, headers, 1)),

  getSchemaReport: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/analytics/schema-report`, token, undefined, undefined, headers, 1)),

  getDatabaseStatistics: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/analytics/database-stats`, token, undefined, undefined, headers, 1)),

  getProductsWithAnalytics: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/analytics/products`, token, undefined, undefined, headers, 1)),

  getAverageRatingByCategory: async (categoryId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/category/${categoryId}/rating`, token, undefined, undefined, headers, 1)),

  updateStock: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/stock/update`, body, token, headers)),

  archiveOldProducts: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product/archive/old`, body, token, headers)),

  addFavorite: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product/favorites/${id}`, {}, token, headers)),

  removeFavorite: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/product/favorites/${id}`, token, undefined, headers)),

  listFavorites: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/favorites`, token, undefined, undefined, headers, 1)),

  getRecommendations: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/recommendations/${id}`, token, undefined, undefined, headers, 1)),

  importCSV: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product/import`, body, token, headers)),

  exportCSV: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/export`, token, undefined, undefined, headers, 1)),

  approveReview: async (id: string, reviewId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/${id}/reviews/${reviewId}/approve`, {}, token, headers)),

  removeReview: async (id: string, reviewId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/product/${id}/reviews/${reviewId}`, token, undefined, headers)),

  lowStockAlerts: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/alerts/low-stock`, token, undefined, undefined, headers, 1)),

  sendLowStockEmails: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product/alerts/low-stock/email`, {}, token, headers)),

  scheduleFlashSale: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product/flash-sale`, body, token, headers)),

  salesMetrics: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/analytics/sales-metrics`, token, undefined, undefined, headers, 1)),

  popularity: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/analytics/popularity`, token, undefined, undefined, headers, 1)),

  upsertCategory: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/product/taxonomy/category`, body, token, headers)),

  updateCategory: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/product/taxonomy/category/${id}`, body, token, headers)),

  listCategories: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/taxonomy/categories`, token, query, undefined, headers, 1)),

  listDownloads: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/downloads`, token, undefined, undefined, headers, 1)),

  downloadFile: async (
    id: string,
    fileIndex: number,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/${id}/downloads/${fileIndex}`, token, undefined, undefined, headers, 1)),

  docs: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/product/docs/routes`, token, undefined, undefined, headers, 1)),
};

export default productService;

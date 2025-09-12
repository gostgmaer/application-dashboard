import requests from "./httpServices";

const productServices = {
  // ---------- STATIC / COLLECTION-LEVEL ----------
  createProduct: (body: any, headers: any) =>
    requests.post("/products", body, headers),

  getProducts: (query: any, headers: any) =>
    requests.get("/products", query, null, headers, 1),

  bulkDeleteProducts: (body: any, headers: any) =>
    requests.delete("/products/bulk", body, headers),

  bulkUpdateStatus: (body: any, headers: any) =>
    requests.put("/products/bulk/status", body, headers),

  bulkUpdateStock: (body: any, headers: any) =>
    requests.put("/products/bulk/stock", body, headers),

  searchProducts: (keyword: string, headers: any) =>
    requests.get(`/products/search/${keyword}`, null, null, headers, 1),

  getFeaturedProducts: (headers: any) =>
    requests.get("/products/featured", null, null, headers, 1),

  getLowStockProducts: (headers: any) =>
    requests.get("/products/stock/low", null, null, headers, 1),

  getOutOfStockProducts: (headers: any) =>
    requests.get("/products/stock/out", null, null, headers, 1),

  getProductsByCategory: (categoryId: string, headers: any) =>
    requests.get(`/products/category/${categoryId}`, null, null, headers, 1),

  getProductsByTag: (tags: string, headers: any) =>
    requests.get(`/products/tags/${tags}`, null, null, headers, 1),

  getNewArrivals: (headers: any) =>
    requests.get("/products/new-arrivals", null, null, headers, 1),

  getProductsByPriceRange: (query: any, headers: any) =>
    requests.get("/products/price-range", query, null, headers, 1),

  getTopSellingProducts: (headers: any) =>
    requests.get("/products/top-selling", null, null, headers, 1),

  getMostViewedProducts: (headers: any) =>
    requests.get("/products/most-viewed", null, null, headers, 1),

  getActiveDiscountProducts: (headers: any) =>
    requests.get("/products/discounts", null, null, headers, 1),

  getAverageRatingByCategory: (categoryId: string, headers: any) =>
    requests.get(`/products/category/${categoryId}/rating`, null, null, headers, 1),

  archiveOldProducts: (body: any, headers: any) =>
    requests.put("/products/archive", body, headers),

  getSchemaReport: (headers: any) =>
    requests.get("/products/report", null, null, headers, 1),

  getDatabaseStatistics: (headers: any) =>
    requests.get("/products/statistics", null, null, headers, 1),

  // ---------- DYNAMIC / SINGLE-PRODUCT ----------
  getProductByIdOrSlug: (identifier: string, headers: any) =>
    requests.get(`/products/${identifier}`, null, null, headers, 1),

  updateProduct: (id: string, body: any, headers: any) =>
    requests.put(`/products/${id}`, body, headers),

  deleteProduct: (id: string, headers: any) =>
    requests.delete(`/products/${id}`, null, headers),

  getSimplifiedImages: (id: string, headers: any) =>
    requests.get(`/products/${id}/images`, null, null, headers, 1),

  getFinalPrice: (id: string, headers: any) =>
    requests.get(`/products/${id}/price`, null, null, headers, 1),

  getStockStatus: (id: string, headers: any) =>
    requests.get(`/products/${id}/stock-status`, null, null, headers, 1),

  markAsOutOfStock: (id: string, body: any, headers: any) =>
    requests.put(`/products/${id}/out-of-stock`, body, headers),

  incrementProductViews: (id: string, body: any, headers: any) =>
    requests.post(`/products/${id}/views`, body, headers),

  incrementSold: (id: string, body: any, headers: any) =>
    requests.post(`/products/${id}/sold`, body, headers),

  isDiscountActive: (id: string, headers: any) =>
    requests.get(`/products/${id}/discount-active`, null, null, headers, 1),

  getSEOData: (id: string, headers: any) =>
    requests.get(`/products/${id}/seo`, null, null, headers, 1),

  getBulkDiscountPrice: (id: string, headers: any) =>
    requests.get(`/products/${id}/bulk-price`, null, null, headers, 1),

  isPurchasable: (id: string, headers: any) =>
    requests.get(`/products/${id}/purchasable`, null, null, headers, 1),

  reduceStock: (id: string, body: any, headers: any) =>
    requests.put(`/products/${id}/reduce-stock`, body, headers),

  restockProduct: (id: string, body: any, headers: any) =>
    requests.put(`/products/${id}/restock`, body, headers),

  toggleFeatured: (id: string, body: any, headers: any) =>
    requests.put(`/products/${id}/featured`, body, headers),

  getRelatedProducts: (id: string, headers: any) =>
    requests.get(`/products/${id}/related`, null, null, headers, 1),

  isPartOfBundle: (id: string, headers: any) =>
    requests.get(`/products/${id}/is-bundle`, null, null, headers, 1),

  getActiveDiscountPercent: (id: string, headers: any) =>
    requests.get(`/products/${id}/discount-percent`, null, null, headers, 1),

  addProductReview: (id: string, body: any, headers: any) =>
    requests.post(`/products/${id}/reviews`, body, headers),

  applyPromotion: (id: string, body: any, headers: any) =>
    requests.put(`/products/${id}/promotion`, body, headers),

  isPreOrderAvailable: (id: string, headers: any) =>
    requests.get(`/products/${id}/pre-order`, null, null, headers, 1),

  getBundleTotalPrice: (id: string, headers: any) =>
    requests.get(`/products/${id}/bundle-price`, null, null, headers, 1),

  getRatingStatistics: (id: string, headers: any) =>
    requests.get(`/products/${id}/rating-statistics`, null, null, headers, 1),

  getVirtualStockStatus: (id: string, headers: any) =>
    requests.get(`/products/${id}/virtual-stock-status`, null, null, headers, 1),
};

export default productServices;
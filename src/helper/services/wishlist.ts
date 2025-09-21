import requests from "./index";
import { ApiResponse, safeApiCall } from "./apiUtils";

const wishlistServices = {
  getUserWishlist: async (
    userId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/wishlist/${userId}`, token, query, undefined, headers, 1));
  },

  addToWishlist: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/wishlist", body, token, headers));
  },

  updateWishlistItem: async (
    userId: string,
    productId: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/wishlist/${userId}/${productId}`, body, token, headers));
  },

  removeFromWishlist: async (
    userId: string,
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/wishlist/${userId}/${productId}`, token, undefined, headers));
  },

  approveWishlistItem: async (
    userId: string,
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/wishlist/approve/${userId}/${productId}`, {}, token, headers));
  },

  restoreWishlistItem: async (
    userId: string,
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/wishlist/restore/${userId}/${productId}`, {}, token, headers));
  },

  archiveWishlistItem: async (
    userId: string,
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/wishlist/archive/${userId}/${productId}`, {}, token, headers));
  },

  isInWishlist: async (
    userId: string,
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/wishlist/check/${userId}/${productId}`, token, undefined, undefined, headers, 1));
  },

  clearWishlist: async (
    userId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/wishlist/clear/${userId}`, token, undefined, headers));
  },

  bulkAddToWishlist: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/wishlist/bulk/add`, body, token, headers));
  },

  bulkUpdateWishlist: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/wishlist/bulk/update`, body, token, headers));
  },

  getWishlistStats: async (
    userId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/wishlist/stats/${userId}`, token, undefined, undefined, headers, 1));
  },

  getAuditTrail: async (
    userId: string,
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/wishlist/audit/${userId}/${productId}`, token, undefined, undefined, headers, 1));
  },

  exportWishlist: async (
    userId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/wishlist/export/${userId}`, token, query, undefined, headers, 1));
  },

  exportFeaturedItems: async (
    userId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/wishlist/export/featured/${userId}`, token, query, undefined, headers, 1));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/wishlist/docs/routes`, token, undefined, undefined, headers, 1));
  },
};

export default wishlistServices;

import requests from "./index";
import { safeApiCall, ApiResponse } from "./apiUtils";

const categoryService = {
  createCategory: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/category", body, token, headers));
  },

  getAllCategories: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/category", token, query, undefined, headers, 1)
    );
  },

  getCategory: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(`/category/${id}`, token, undefined, undefined, headers, 1)
    );
  },

  updateCategory: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.put(`/category/${id}`, body, token, headers)
    );
  },

  deleteCategory: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.delete(`/category/${id}`, token, undefined, headers)
    );
  },

  getActiveCategories: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/category/active", token, undefined, undefined, headers, 1)
    );
  },

  getFeaturedCategories: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/category/featured",
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },

  searchCategories: async (
    query: { keyword: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/category/search", token, query, undefined, headers, 1)
    );
  },

  getCategoryTree: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/category/tree", token, undefined, undefined, headers, 1)
    );
  },

  getStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/category/stats", token, undefined, undefined, headers, 1)
    );
  },

  getFeaturedStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/category/featured-stats",
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },

  getAggregateStatus: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/category/aggregate-status",
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },

  bulkUpdateStatus: async (
    body: { ids: string[]; status: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch("/category/bulk-status", body, token, headers)
    );
  },

  importBulk: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.post("/category/import-bulk", body, token, headers)
    );
  },

  batchUpdateDisplayOrders: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(
        "/category/batch-update-display-orders",
        body,
        token,
        headers
      )
    );
  },

  softDeleteMany: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch("/category/soft-delete-many", body, token, headers)
    );
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/category/docs/routes",
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },
};

export default categoryService;

import requests from "./index";
import { ApiResponse, handleApiError, safeApiCall } from "./apiUtils";

const categoryServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/categories", body, headers, token));
  },

  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories", query, {}, headers, 1, token));
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/categories/${id}`, null, null, headers, 1, token));
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/categories/${id}`, body, null, headers, token));
  },

  updatePatch: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/categories/${id}`, body, null, headers, token));
  },

  remove: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/categories/${id}`, null, headers, token));
  },

  getActive: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/active", query, null, headers, 1, token));
  },

  getFeatured: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/featured", query, null, headers, 1, token));
  },

  search: async (
    searchParams: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/search", searchParams, null, headers, 1, token));
  },

  getTree: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/tree", query, null, headers, 1, token));
  },

  getStats: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/stats", query, null, headers, 1, token));
  },

  getProductCount: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/data/product-count", query, null, headers, 1, token));
  },

  getShowing: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/data/show", query, null, headers, 1, token));
  },

  bulkUpdateStatus: async (
    bulkData: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/categories/bulk-status", bulkData, null, headers, token));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/docs/routes", null, null, headers, 1, token));
  },
};

export default categoryServices;

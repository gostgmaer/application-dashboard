import requests from "./index";
import { ApiResponse, handleApiError, safeApiCall } from "./apiUtils";

const categoryServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/categories", body, token, headers));
  },

  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories", token, query, undefined, headers, 1));
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/categories/${id}`, token, undefined, undefined, headers, 1));
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/categories/${id}`, body, token, headers));
  },

  updatePatch: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/categories/${id}`, body, token, headers));
  },

  remove: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/categories/${id}`, token, undefined, headers));
  },

  getActive: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/active", token, query, undefined, headers, 1));
  },

  getFeatured: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/featured", token, query, undefined, headers, 1));
  },

  search: async (
    searchParams: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/search", token, searchParams, undefined, headers, 1));
  },

  getTree: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/tree", token, query, undefined, headers, 1));
  },

  getStats: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/stats", token, query, undefined, headers, 1));
  },

  getProductCount: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/data/product-count", token, query, undefined, headers, 1));
  },

  getShowing: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/data/show", token, query, undefined, headers, 1));
  },

  bulkUpdateStatus: async (
    bulkData: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/categories/bulk-status", bulkData, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/categories/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default categoryServices;

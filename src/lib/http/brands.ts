import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const brandService = {
  create: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/brands", body, token, headers)),

  get: async (idOrSlug: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/brand/${idOrSlug}`, token, undefined, undefined, headers, 1)),

  update: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/brand/${id}`, body, token, headers)),

  remove: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/brand/${id}`, token, undefined, headers)),

  getPaginated: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/brands", token, query, undefined, headers, 1)),

  getActive: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/brands/active", token, query, undefined, headers, 1)),

  getFeatured: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/brands/featured", token, query, undefined, headers, 1)),

  search: async (query: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/brands/search", token, query, undefined, headers, 1)),

  getTopRated: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/brands/top-rated", token, query, undefined, headers, 1)),

  getByCountry: async (country: string, query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/brand/country/${country}`, token, query, undefined, headers, 1)),

  getByYearRange: async (query: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/brands/year-range", token, query, undefined, headers, 1)),

  getWithSocialMedia: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/brands/social-media", token, query, undefined, headers, 1)),

  bulkUpdateStatus: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/brands/bulk-status", body, token, headers)),

  bulkFeatureToggle: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/brands/bulk-feature", body, token, headers)),

  softDelete: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/brands/soft-delete", body, token, headers)),

  restore: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/brands/restore", body, token, headers)),

  updateDisplayOrder: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/brands/display-order", body, token, headers)),

  refreshProductCounts: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/brands/refresh-products", body, token, headers)),

  addImage: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/brand/${id}/add-image`, body, token, headers)),

  removeImage: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/brand/${id}/remove-image`, {}, token, headers)),

  updateContact: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/brand/${id}/contact`, body, token, headers)),

  updateRating: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/brand/${id}/rating`, body, token, headers)),

  getRouteDocs: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/brand/docs/routes`, token, undefined, undefined, headers, 1)),
};

export default brandService;

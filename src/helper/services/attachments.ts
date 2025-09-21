import requests from "./index";
import { ApiResponse, safeApiCall } from "./apiUtils";

const attachmentService = {
  uploadFile: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/attachment", body, token, headers));
  },

  viewFile: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/attachment/${id}`, token, undefined, undefined, headers, 1));
  },

  updateFile: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/attachment/${id}`, body, token, headers));
  },

  renameFile: async (
    id: string,
    body: { newName: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/attachment/${id}/rename`, body, token, headers));
  },

  removeFile: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/attachment/${id}`, token, undefined, headers));
  },

  listByTag: async (
    tag: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/attachment/tag/${tag}`, token, undefined, undefined, headers, 1));
  },

  listByCategory: async (
    category: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/attachment/category/${category}`, token, undefined, undefined, headers, 1));
  },

  listPublic: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/attachment/public", token, undefined, undefined, headers, 1));
  },

  searchFiles: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/attachment/search", token, query, undefined, headers, 1));
  },

  listByUploadedBy: async (
    userId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/attachment/uploaded-by/${userId}`, token, undefined, undefined, headers, 1));
  },

  getLargestFiles: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/attachment/largest", token, undefined, undefined, headers, 1));
  },

  getRecentUploads: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/attachment/recent", token, undefined, undefined, headers, 1));
  },

  getOldestFiles: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/attachment/oldest", token, undefined, undefined, headers, 1));
  },

  getUntaggedFiles: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/attachment/untagged", token, undefined, undefined, headers, 1));
  },

  bulkUpdateTags: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/attachment/bulk-tags", body, token, headers));
  },

  bulkDeleteByTenant: async (
    tenantId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/attachment/tenant/${tenantId}`, token, undefined, headers));
  },

  getStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/attachment/stats", token, undefined, undefined, headers, 1));
  },
};

export default attachmentService;

import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const attachmentService = {
  uploadFile: async (
    FormData: FormData,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {

    return safeApiCall(() => requests.post("/files", FormData, token, headers));
  },

  viewFile: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/files/${id}`, token, undefined, undefined, headers, 1));
  },

  updateFile: async (
    id: string,
    FormData: FormData,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/files/${id}`, FormData, token, headers));
  },

  renameFile: async (
    id: string,
    body: { newName: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/files/${id}/rename`, body, token, headers));
  },

  removeFile: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/files/${id}`, token, undefined, headers));
  },

  listByTag: async (
    tag: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/files/tag/${tag}`, token, undefined, undefined, headers, 1));
  },

  listByCategory: async (
    category: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/files/category/${category}`, token, undefined, undefined, headers, 1));
  },

  listPublic: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/files/public", token, undefined, undefined, headers, 1));
  },

  searchFiles: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/files/search", token, query, undefined, headers, 1));
  },

  listByUploadedBy: async (
    userId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/files/uploaded-by/${userId}`, token, undefined, undefined, headers, 1));
  },

  getLargestFiles: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/files/largest", token, undefined, undefined, headers, 1));
  },

  getRecentUploads: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/files/recent", token, undefined, undefined, headers, 1));
  },

  getOldestFiles: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/files/oldest", token, undefined, undefined, headers, 1));
  },

  getUntaggedFiles: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/files/untagged", token, undefined, undefined, headers, 1));
  },

  bulkUpdateTags: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/files/bulk-tags", body, token, headers));
  },

  bulkDeleteByTenant: async (
    tenantId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/files/tenant/${tenantId}`, token, undefined, headers));
  },

  getStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/files/stats", token, undefined, undefined, headers, 1));
  },
};

export default attachmentService;

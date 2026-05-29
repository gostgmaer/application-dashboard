import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const permissionServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/permissions", body, token, headers));
  },

  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions", token, query, undefined, headers, 1));
  },

  getGrouped: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions/states", token, query, undefined, headers, 1));
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permissions/${id}`, token, undefined, undefined, headers, 1));
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/permissions/${id}`, body, token, headers));
  },

  updatePatch: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permissions/${id}`, body, token, headers));
  },

  delete: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/permissions/${id}`, undefined, token, undefined, headers));
  },

  getActive: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions/active", token, query, undefined, headers, 1));
  },

  getInactive: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions/inactive", token, query, undefined, headers, 1));
  },

  searchByName: async (
    query: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions/search/name", token, query, undefined, headers, 1));
  },

  search: async (
    query: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions/search", token, query, undefined, headers, 1));
  },

  getByCategory: async (
    category: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permissions/category/${category}`, token, query, undefined, headers, 1));
  },

  getPermissionsGrouped: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions/grouped", token, query, undefined, headers, 1));
  },

  bulkCreate: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/permissions/bulk", body, token, headers));
  },

  bulkEnable: async (
    body: { permissionIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/permissions/bulk-enable", body, token, headers));
  },

  bulkDisable: async (
    body: { permissionIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/permissions/bulk-disable", body, token, headers));
  },

  bulkDelete: async (
    body: { permissionIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete("/permissions/bulk",body, token,undefined , headers));
  },

  checkExists: async (
    name: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permissions/exists/${name}`, token, undefined, undefined, headers, 1));
  },

  createIfNotExists: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/permissions/create-if-not-exists", body, token, headers));
  },

  disablePermission: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permissions/${id}/disable`, token, undefined, headers));
  },

  enablePermission: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permissions/${id}/enable`, token, undefined, headers));
  },

  renamePermission: async (
    id: string,
    body: { name: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permissions/${id}/rename`, body, token, headers));
  },

  updateDescription: async (
    id: string,
    body: { description: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permissions/${id}/description`, body, token, headers));
  },

  changeCategory: async (
    id: string,
    body: { category: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permissions/${id}/category`, body, token, headers));
  },

  toggleActive: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permissions/${id}/toggle-active`, token, undefined, headers));
  },

  getPermissionAPIResponse: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permissions/${id}/api-response`, token, undefined, undefined, headers, 1));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permissions/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default permissionServices;

import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const permissionServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/permission", body, token, headers));
  },

  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission", token, query, undefined, headers, 1));
  },

  getGrouped: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission/states", token, query, undefined, headers, 1));
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permission/${id}`, token, undefined, undefined, headers, 1));
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/permission/${id}`, body, token, headers));
  },

  updatePatch: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permission/${id}`, body, token, headers));
  },

  delete: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/permission/${id}`, token, undefined, headers));
  },

  getActive: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission/active", token, query, undefined, headers, 1));
  },

  getInactive: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission/inactive", token, query, undefined, headers, 1));
  },

  searchByName: async (
    query: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission/search/name", token, query, undefined, headers, 1));
  },

  search: async (
    query: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission/search", token, query, undefined, headers, 1));
  },

  getByCategory: async (
    category: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permission/category/${category}`, token, query, undefined, headers, 1));
  },

  getPermissionsGrouped: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission/grouped", token, query, undefined, headers, 1));
  },

  bulkCreate: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/permission/bulk", body, token, headers));
  },

  bulkEnable: async (
    body: { permissionIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/permission/bulk-enable", body, token, headers));
  },

  bulkDisable: async (
    body: { permissionIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/permission/bulk-disable", body, token, headers));
  },

  bulkDelete: async (
    body: { permissionIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete("/permission/bulk",body, token,undefined , headers));
  },

  checkExists: async (
    name: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permission/exists/${name}`, token, undefined, undefined, headers, 1));
  },

  createIfNotExists: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/permission/create-if-not-exists", body, token, headers));
  },

  disablePermission: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permission/${id}/disable`, token, undefined, headers));
  },

  enablePermission: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permission/${id}/enable`, token, undefined, headers));
  },

  renamePermission: async (
    id: string,
    body: { name: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permission/${id}/rename`, body, token, headers));
  },

  updateDescription: async (
    id: string,
    body: { description: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permission/${id}/description`, body, token, headers));
  },

  changeCategory: async (
    id: string,
    body: { category: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permission/${id}/category`, body, token, headers));
  },

  toggleActive: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/permission/${id}/toggle-active`, token, undefined, headers));
  },

  getPermissionAPIResponse: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/permission/${id}/api-response`, token, undefined, undefined, headers, 1));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/permission/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default permissionServices;

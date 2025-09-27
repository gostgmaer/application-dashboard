import requests from "./index";
import { ApiResponse, handleApiError, safeApiCall } from "./apiUtils";

const roleServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/roles", body, token, headers));
  },

  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles", token, query, undefined, headers, 1));
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/roles/${id}`, token, undefined, undefined, headers, 1));
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/roles/${id}`, body, token, headers));
  },

  updatePatch: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/roles/${id}`, body, token, headers));
  },

  remove: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/roles/${id}`, token, undefined, headers));
  },

  getActive: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles/active", token, query, undefined, headers, 1));
  },

  setDefault: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/roles/default", { roleId: id }, token, headers));
  },

  getDefault: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles/default", token, undefined, undefined, headers, 1));
  },

  getDefaultRoleId: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles/default/id", token, undefined, undefined, headers, 1));
  },

  ensurePredefinedRoles: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/roles/ensure-predefined", {}, token, headers));
  },

  search: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles/search", token, query, undefined, headers, 1));
  },

  getRoleStatistics: async (
    token?: string,
    query?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles/statistics", token, query, undefined, undefined, 1));
  },

  bulkDeactivate: async (
    data: { roleIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/roles/bulk-deactivate", data, token, headers));
  },

  bulkActivate: async (
    data: { roleIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/roles/bulk-activate", data, token, headers));
  },

  getAllWithCounts: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles/all/counts", token, query, undefined, headers, 1));
  },

  clone: async (
    roleId: string,
    newName: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/roles/clone", { roleId, newName }, token, headers));
  },

  addPermission: async (
    id: string,
    permission: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/roles/${id}/permission`, { permission }, token, headers));
  },

  removePermission: async (
    id: string,
    permission: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/roles/${id}/permission`, token, permission, headers));
  },

  hasPermission: async (
    id: string,
    permissionName: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/roles/${id}/permission/${permissionName}`, token, undefined, undefined, headers, 1));
  },

  getRoleWithPermissions: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/roles/${id}/permissions`, token, undefined, undefined, headers, 1));
  },

  assignPermissions: async (
    id: string,
    permissions: any[],
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/roles/${id}/permissions`, { permissions }, token, headers));
  },


  syncPermissions: async (
    id: string,
    permissions: string[],
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/roles/${id}/sync-permissions`, { permissions }, token, headers));
  },

  bulkAssignPermissions: async (
    data: { roleIds: string[], permissions: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/roles/bulk-assign-permissions", data, token, headers));
  },

  getRoleAuditTrail: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/roles/${id}/audit-trail`, token, undefined, undefined, headers, 1));
  },

  isRoleInUse: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/roles/${id}/in-use`, token, undefined, undefined, headers, 1));
  },

  export: async (
    format: "csv" | "json",
    fields?: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    const params: any = { format };
    if (fields) params.fields = fields;
    return safeApiCall(() => requests.get("/roles/export", token, params, undefined, headers, 1));
  },

  import: async (
    roles: any[],
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/roles/import", { roles }, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/roles/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default roleServices;

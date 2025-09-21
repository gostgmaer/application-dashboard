import requests from "./index";
import { safeApiCall, ApiResponse } from "./apiUtils";

const attributeService = {
  add: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/attribute", body, token, headers)),

  addAll: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/attribute/bulk", body, token, headers)),

  getAll: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/attribute", token, query, undefined, headers, 1)),

  getVisible: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get("/attribute/visible", token, query, undefined, headers, 1)),

  getById: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/attribute/${id}`, token, undefined, undefined, headers, 1)),

  update: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/attribute/${id}`, body, token, headers)),

  remove: async (id: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/attribute/${id}`, token, undefined, headers)),

  addChildAttributes: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/attribute/${id}/children`, body, token, headers)),

  getChildById: async (id: string, childId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/attribute/${id}/children/${childId}`, token, undefined, undefined, headers, 1)),

  updateChildAttributes: async (attributeId: string, childId: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.put(`/attribute/${attributeId}/children/${childId}`, body, token, headers)),

  deleteChildAttribute: async (attributeId: string, childId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/attribute/${attributeId}/children/${childId}`, {}, token, headers)),

  updateStatus: async (id: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/attribute/${id}/status`, body, token, headers)),

  updateChildStatus: async (childId: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/attribute/children/${childId}/status`, body, token, headers)),

  updateManyAttribute: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/attribute/bulk/update`, body, token, headers)),

  updateManyChildAttribute: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/attribute/bulk/children/update`, body, token, headers)),

  deleteManyAttribute: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/attribute/bulk/delete`, body, token, headers)),

  deleteManyChildAttribute: async (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/attribute/bulk/children/delete`, body, token, headers)),

  getVisibleTest: async (query?: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/attribute/visible/test`, token, query, undefined, headers, 1)),

  getRouteDocs: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/attribute/docs/routes`, token, undefined, undefined, headers, 1)),
};

export default attributeService;

import requests from "./index";
import { ApiResponse, handleApiError, safeApiCall } from "./apiUtils";

const addressServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/addresses", body, token, headers));
  },

  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/addresses", token, query, undefined, headers, 1)
    );
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(`/addresses/${id}`, token, undefined, undefined, headers, 1)
    );
  },

  getUser: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(`/addresses/user`, token, undefined, undefined, headers, 1)
    );
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.put(`/addresses/${id}`, body, token, headers)
    );
  },

  updatePatch: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(`/addresses/${id}`, body, token, headers)
    );
  },

  remove: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.delete(`/addresses/${id}`, token, undefined, headers)
    );
  },

  setDefault: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(`/addresses/${id}/set-default`, {}, token, headers)
    );
  },

  removeUserAddresses: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.delete("/addresses", token, undefined, headers)
    );
  },

  findNearby: async (
    params: { latitude: number; longitude: number; radius?: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/addresses/nearby", token, params, undefined, headers, 1)
    );
  },

  search: async (
    searchParams: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/addresses/search",
        token,
        searchParams,
        undefined,
        headers,
        1
      )
    );
  },

  batchCreate: async (
    batchData: { addresses: any[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.post("/addresses/batch", batchData, token, headers)
    );
  },

  findDuplicates: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/addresses/duplicates",
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },

  getStatusCount: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/addresses/statuscount",
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },

  bulkUpdateStatus: async (
    bulkData: { ids: string[]; status: "active" | "inactive" | "archived" },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch("/addresses/bulkstatus", bulkData, token, headers)
    );
  },

  addTag: async (
    id: string,
    tag: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(`/addresses/${id}/add-tag`, { tag }, token, headers)
    );
  },

  removeTag: async (
    id: string,
    tag: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(`/addresses/${id}/remove-tag`, { tag }, token, headers)
    );
  },

  bulkAddTag: async (
    data: { ids: string[]; tag: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch("/addresses/bulkadd-tag", data, token, headers)
    );
  },

  merge: async (
    sourceAddressId: string,
    targetId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(
        `/addresses/${targetId}/merge`,
        { sourceAddressId },
        token,
        headers
      )
    );
  },

  archive: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(`/addresses/${id}/archive`, {}, token, headers)
    );
  },

  restore: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch(`/addresses/${id}/restore`, {}, token, headers)
    );
  },

  clone: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.post(`/addresses/${id}/clone`, {}, token, headers)
    );
  },

  getHistory: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        `/addresses/${id}/history`,
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },

  compare: async (
    addressId1: string,
    addressId2: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        `/addresses/${addressId1}/compare/${addressId2}`,
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },

  export: async (
    format: "csv" | "json",
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/addresses/export",
        token,
        { format },
        undefined,
        headers,
        1
      )
    );
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(
        "/addresses/docs/routes",
        token,
        undefined,
        undefined,
        headers,
        1
      )
    );
  },
};

export default addressServices;

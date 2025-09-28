import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const logServices = {
  createLog: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/logs", body, token, headers));
  },

  getLogs: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/logs", token, query, undefined, headers, 1));
  },

  getOperationStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/logs/stats/operations", token, undefined, undefined, headers, 1));
  },

  getUserActivityStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/logs/stats/users", token, undefined, undefined, headers, 1));
  },

  getTableStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/logs/stats/tables", token, undefined, undefined, headers, 1));
  },

  getDailyActivity: async (
    days?: number,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    const query = days ? { days } : {};
    return safeApiCall(() => requests.get("/logs/stats/daily", token, query, undefined, headers, 1));
  },

  getTopEndpoints: async (
    limit?: number,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    const query = limit ? { limit } : {};
    return safeApiCall(() => requests.get("/logs/stats/top-endpoints", token, query, undefined, headers, 1));
  },

  getActivity: async (
    table: string,
    recordId?: string,
    queryParams?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    const endpoint = recordId ? `/logs/activity/${table}/${recordId}` : `/logs/activity/${table}`;
    return safeApiCall(() => requests.get(endpoint, token, queryParams, undefined, headers, 1));
  },

  getFailedRequests: async (
    limit?: number,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    const query = limit ? { limit } : {};
    return safeApiCall(() => requests.get("/logs/failed", token, query, undefined, headers, 1));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/logs/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default logServices;

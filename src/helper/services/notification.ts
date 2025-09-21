import requests from "./index";
import { ApiResponse, safeApiCall } from "./apiUtils";

const notificationServices = {
  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/notification", token, query, undefined, headers, 1));
  },

  getUnreadCount: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/notification/unread-count", token, undefined, undefined, headers, 1));
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/notification/${id}`, token, undefined, undefined, headers, 1));
  },

  markAsRead: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/notification/${id}/read`, token, undefined, headers));
  },

  markAllAsRead: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch("/notification/read-all", token, undefined, headers));
  },

  remove: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/notification/${id}`, token, undefined, headers));
  },

  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/notification", body, token, headers));
  },

  createBulk: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/notification/bulk", body, token, headers));
  },
};

export default notificationServices;

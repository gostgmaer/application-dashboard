import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const inquiryService = {

  submitInquiry: async (
    body: any,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.post("/inquiry/submit", body, undefined, headers)
    );
  },

  getAllInquiries: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/inquiry", token, query, undefined, headers, 1)
    );
  },

  searchInquiries: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/inquiry/search", token, query, undefined, headers, 1)
    );
  },

  getInquiryById: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get(`/inquiry/${id}`, token, undefined, undefined, headers, 1)
    );
  },

  getDashboardStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/inquiry/stats", token, undefined, undefined, headers, 1)
    );
  },

  getHighPriority: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/inquiry/high-priority", token, query, undefined, headers, 1)
    );
  },

  updateInquiry: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.put(`/inquiry/${id}`, body, token, headers)
    );
  },

  bulkUpdateInquiries: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.put("/inquiry/bulk-update", body, token, headers)
    );
  },

  contactClient: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.post(`/inquiry/${id}/contact`, body, token, headers)
    );
  },

  archiveInquiry: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.delete(`/inquiry/${id}`, undefined, token, undefined, headers)
    );
  }

};

export default inquiryService;
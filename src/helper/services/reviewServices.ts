import requests from "./index";
import { ApiResponse, safeApiCall } from "./apiUtils";

const reviewServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/review", body, token, headers));
  },

  getById: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/${id}`, token, undefined, undefined, headers, 1));
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/review/${id}`, body, token, headers));
  },

  delete: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/review/${id}`, token, undefined, headers));
  },

  getByProduct: async (
    productId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/product/${productId}`, token, query, undefined, headers, 1));
  },

  getByUser: async (
    userId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/user/${userId}`, token, query, undefined, headers, 1));
  },

  getByRating: async (
    rating: number,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/rating/${rating}`, token, query, undefined, headers, 1));
  },

  getByDateRange: async (
    query: { startDate?: string; endDate?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/date-range`, token, query, undefined, headers, 1));
  },

  getReported: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/reported/all`, token, query, undefined, headers, 1));
  },

  reportReview: async (
    id: string,
    body: { reason: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/review/${id}/report`, body, token, headers));
  },

  unreportReview: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/review/${id}/unreport`, token, undefined, headers));
  },

  bulkApprove: async (
    body: { reviewIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/review/bulk-approve`, body, token, headers));
  },

  bulkDelete: async (
    body: { reviewIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/review/bulk-delete`, token, body, headers));
  },

  markHelpful: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/review/${id}/helpful`, token, undefined, headers));
  },

  clearImages: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/review/${id}/clear-images`, token, undefined, headers));
  },

  getAverageRating: async (
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/stats/average/${productId}`, token, undefined, undefined, headers, 1));
  },

  getRatingBreakdown: async (
    productId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/stats/breakdown/${productId}`, token, undefined, undefined, headers, 1));
  },

  getTopRatedReviews: async (
    productId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/stats/top-rated/${productId}`, token, query, undefined, headers, 1));
  },

  getMostHelpfulReviews: async (
    productId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/stats/most-helpful/${productId}`, token, query, undefined, headers, 1));
  },

  getMostActiveReviewers: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/most-active`, token, query, undefined, headers, 1));
  },

  getTopHelpfulReviews: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/top-helpful`, token, query, undefined, headers, 1));
  },

  searchReviews: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/search/query`, token, query, undefined, headers, 1));
  },

  replyToReview: async (
    id: string,
    body: { reply: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/review/${id}/reply`, body, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/review/docs/routes`, token, undefined, undefined, headers, 1));
  },
};

export default reviewServices;

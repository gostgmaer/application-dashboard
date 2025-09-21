import requests from "./index";
import { safeApiCall, ApiResponse } from "./apiUtils";

const cartService = {
  add: (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/cart/add`, body, token, headers)),

  remove: (productId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/cart/remove/${productId}`, token, undefined, headers)),

  update: (productId: string, body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/cart/update/${productId}`, body, token, headers)),

  clear: (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/cart/clear`, token, undefined, headers)),

  get: (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/cart`, token, undefined, undefined, headers)),

  applyDiscount: (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/cart/discount`, body, token, headers)),

  merge: (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/cart/merge`, body, token, headers)),

  setMetadata: (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.post(`/cart/metadata`, body, token, headers)),

  paginated: (query: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/cart/paginated`, token, query, undefined, headers)),

  abandoned: (query: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/cart/abandoned`, token, query, undefined, headers)),

  bulkUpdate: (body: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/cart/bulk-update`, body, token, headers)),

  analytics: (query: any, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/cart/analytics`, token, query, undefined, headers)),

  removeProduct: (productId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/cart/product/${productId}`, token, undefined, headers)),

  clearAll: (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.delete(`/cart/all`, token, undefined, headers)),

  docs: (token?: string, headers?: Record<string, any>): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/cart/docs`, token, undefined, undefined, headers)),
};

export default cartService;

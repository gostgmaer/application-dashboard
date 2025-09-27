import requests from "./index";
import { ApiResponse, safeApiCall } from "./apiUtils";

const paymentServices = {
  createPayment: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/payment", body, token, headers));
  },

  getPaymentById: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/${id}`, token, undefined, undefined, headers, 1));
  },

  updatePaymentStatus: async (
    id: string,
    body: { status: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/payment/${id}/status`, body, token, headers));
  },

  addRefund: async (
    id: string,
    body: { amount?: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/payment/${id}/refund`, body, token, headers));
  },

  addDispute: async (
    id: string,
    body: { reason: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/payment/${id}/dispute`, body, token, headers));
  },

  capturePayment: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/payment/${id}/capture`, {}, token, headers));
  },

  getTrackingHistory: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/${id}/history`, token, undefined, undefined, headers, 1));
  },

  incrementAttempts: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/payment/${id}/attempts`, {}, token, headers));
  },

  markAsPaid: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/payment/${id}/mark-paid`, {}, token, headers));
  },

  updateMetadata: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/payment/${id}/metadata`, body, token, headers));
  },

  addTag: async (
    id: string,
    body: { tags: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/payment/${id}/tags`, body, token, headers));
  },

  removeTag: async (
    id: string,
    body: { tags: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/payment/${id}/tags`,body, token, undefined, headers));
  },

  updateNotes: async (
    id: string,
    body: { notes: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/payment/${id}/notes`, body, token, headers));
  },

  listPayments: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment", token, query, undefined, headers, 1));
  },

  getAnalytics: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/analytics", token, query, undefined, headers, 1));
  },

  getSuspiciousPayments: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/suspicious", token, query, undefined, headers, 1));
  },

  getPaymentsRequiringAction: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/requiring-action", token, query, undefined, headers, 1));
  },

  bulkUpdateStatus: async (
    body: { paymentIds: string[]; status: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put("/payment/bulk-update-status", body, token, headers));
  },

  bulkCancelPayments: async (
    body: { paymentIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/payment/bulk-cancel", body, token, headers));
  },

  getPaymentSummary: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/summary", token, undefined, undefined, headers, 1));
  },

  getFailedAttemptsSummary: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/failed-attempts", token, undefined, undefined, headers, 1));
  },

  getRecentPayments: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/recent", token, query, undefined, headers, 1));
  },

  findByProviderTransactionId: async (
    providerTransactionId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/provider-transaction/${providerTransactionId}`, token, undefined, undefined, headers, 1));
  },

  findByOrder: async (
    orderId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/order/${orderId}`, token, undefined, undefined, headers, 1));
  },

  findByPaymentMethod: async (
    sourceId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/payment-method/${sourceId}`, token, undefined, undefined, headers, 1));
  },

  deletePayment: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/payment/${id}`, token, undefined, headers));
  },

  exportPayments: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/export", token, undefined, undefined, headers, 1));
  },

  resolveDispute: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/payment/${id}/dispute/resolve`, {}, token, headers));
  },

  updateDisputeStatus: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/payment/${id}/dispute/status`, body, token, headers));
  },

  getRecurringPayments: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/recurring", token, query, undefined, headers, 1));
  },

  calculateRiskScore: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/${id}/risk-score`, token, undefined, undefined, headers, 1));
  },

  getProcessingTimeStats: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/processing-time", token, undefined, undefined, headers, 1));
  },

  getRefundRates: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/refund-rates", token, undefined, undefined, headers, 1));
  },

  getSuccessRateByProvider: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/success-rate-provider", token, undefined, undefined, headers, 1));
  },

  getAverageAmountByMethod: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/average-amount-method", token, undefined, undefined, headers, 1));
  },

  getCurrencyBreakdown: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/currency-breakdown", token, undefined, undefined, headers, 1));
  },

  getFeeSummary: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/fee-summary", token, undefined, undefined, headers, 1));
  },

  getDisputeAnalytics: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/dispute-analytics", token, undefined, undefined, headers, 1));
  },

  getTimelineStats: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/${id}/timeline-stats`, token, undefined, undefined, headers, 1));
  },

  handleWebhook: async (
    body: any
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/payment/webhook", body));
  },

  addTimelineEntry: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/payment/${id}/timeline`, body, token, headers));
  },

  checkExpired: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/${id}/expired`, token, undefined, undefined, headers, 1));
  },

  getTagsUsage: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/tags-usage", token, undefined, undefined, headers, 1));
  },

  searchByNotes: async (
    query: { q: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/search/notes", token, query, undefined, headers, 1));
  },

  getPaymentsByTag: async (
    tag: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/tags/${tag}`, token, undefined, undefined, headers, 1));
  },

  bulkAddTags: async (
    body: { paymentIds: string[]; tags: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/payment/bulk-tags", body, token, headers));
  },

  getPaymentsByCountry: async (
    country: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/country/${country}`, token, undefined, undefined, headers, 1));
  },

  getPaymentsByCurrency: async (
    currency: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/currency/${currency}`, token, undefined, undefined, headers, 1));
  },

  getVolumeByPeriod: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/volume", token, query, undefined, headers, 1));
  },

  getTopCustomers: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/top-customers", token, undefined, undefined, headers, 1));
  },

  simulatePaymentFailure: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/payment/simulate-failure", {}, token, headers));
  },

  getMethodSuccessRatesOverTime: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/stats/success-rates-time", token, query, undefined, headers, 1));
  },

  getPaymentsByIP: async (
    ipAddress: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/payment/ip/${ipAddress}`, token, undefined, undefined, headers, 1));
  },

  bulkProcessRefunds: async (
    body: { paymentIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/payment/bulk-refunds", body, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/payment/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default paymentServices;

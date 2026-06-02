import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const orderServices = {
  createOrder: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/orders", body, token, headers));
  },

  getOrderById: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}`, token, undefined, undefined, headers, 1));
  },

  getOrders: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders", token, query, undefined, headers, 1));
  },

  updateOrder: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}`, body, token, headers));
  },

  deleteOrder: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/orders/${id}`, undefined, token, undefined, headers));
  },

  markAsPaid: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/pay`, {}, token, headers));
  },

  refundOrder: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/refund`, {}, token, headers));
  },

  bulkRefundOrders: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put("/orders/bulk-refund", body, token, headers));
  },

  redeemLoyaltyPoints: async (
    id: string,
    body: { points: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/redeem-points`, body, token, headers));
  },

  updateOrderStatus: async (
    id: string,
    body: { status: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/status`, body, token, headers));
  },

  bulkUpdateOrderStatus: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put("/orders/bulk-status", body, token, headers));
  },

  splitOrder: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/split`, body, token, headers));
  },

  addTrackingInfo: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/tracking`, body, token, headers));
  },

  markOrderAsDelivered: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/mark-delivered`, {}, token, headers));
  },

  setPriorityLevel: async (
    id: string,
    body: { priority: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/priority`, body, token, headers));
  },

  updateItemQuantity: async (
    id: string,
    itemIndex: number,
    body: { quantity: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/items/${itemIndex}/quantity`, body, token, headers));
  },

  addGiftMessage: async (
    id: string,
    body: { message?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/gift-message`, body, token, headers));
  },

  applyCoupon: async (
    id: string,
    body: { couponCode: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/apply-coupon`, body, token, headers));
  },

  requestReturn: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/request-return`, body, token, headers));
  },

  resolveReturnRequest: async (
    id: string,
    body: { status: string; reason?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/resolve-return`, body, token, headers));
  },

  getReturnRequests: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/return-requests", token, query, undefined, headers, 1));
  },

  getTopCustomers: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/top-customers", token, query, undefined, headers, 1));
  },

  getCustomerOrderHistory: async (
    userId: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/user/${userId}/history`, token, query, undefined, headers, 1));
  },

  getOrderStats: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/stats", token, query, undefined, headers, 1));
  },

  getOrderTrends: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/trends", token, query, undefined, headers, 1));
  },

  getRevenueBySource: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/revenue-by-source", token, query, undefined, headers, 1));
  },

  getProductPerformance: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/product-performance", token, query, undefined, headers, 1));
  },

  getOrderConversionFunnel: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/conversion-funnel", token, query, undefined, headers, 1));
  },

  getFeaturedOrders: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/featured", token, query, undefined, headers, 1));
  },

  getLowStockOrders: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/low-stock", token, query, undefined, headers, 1));
  },

  getAverageOrderValue: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/average-order-value", token, query, undefined, headers, 1));
  },

  searchOrdersByCustomerName: async (
    query: { customerName: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/search-by-customer", token, query, undefined, headers, 1));
  },

  getOrdersByPaymentMethod: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/by-payment-method", token, query, undefined, headers, 1));
  },

  getDelayedOrders: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/delayed-orders", token, query, undefined, headers, 1));
  },

  getLoyaltyPointsSummary: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/analytics/loyalty-points-summary", token, query, undefined, headers, 1));
  },

  estimateDelivery: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/estimate-delivery`, token, undefined, undefined, headers, 1));
  },

  getOrderSummary: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/summary`, token, undefined, undefined, headers, 1));
  },

  reorder: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/reorder`, {}, token, headers));
  },

  getFraudulentOrders: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/fraudulent", token, query, undefined, headers, 1));
  },

  checkOrderCompliance: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/compliance-check`, token, undefined, undefined, headers, 1));
  },

  flagOrder: async (
    id: string,
    body: { reason: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/flag`, body, token, headers));
  },

  validateStockBulk: async (
    body: { orderIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/orders/validate-stock", body, token, headers));
  },

  updateStockBulk: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/orders/update-stock", body, token, headers));
  },

  exportOrdersReport: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/export", token, query, undefined, headers, 1));
  },

  importOrdersBulk: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/orders/import", body, token, headers));
  },

  auditOrderChanges: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/audit`, token, undefined, undefined, headers, 1));
  },

  pushStatusNotification: async (
    body: { orderId: string; status: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/orders/status-notification", body, token, headers));
  },

  logOrderEvent: async (
    id: string,
    body: { eventType: string; data?: any },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/log-event`, body, token, headers));
  },

  restoreCanceledOrder: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/restore`, {}, token, headers));
  },

  archiveCompletedOrders: async (
    body: { beforeDate: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/orders/archive-completed", body, token, headers));
  },

  sendOrderInvoice: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/send-invoice`, {}, token, headers));
  },

  getHistoricalOrderData: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/historical-data", token, query, undefined, headers, 1));
  },

  getOrderGrowthStats: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/growth-stats", token, query, undefined, headers, 1));
  },

  rateOrderItems: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/rate-items`, body, token, headers));
  },

  reviewOrderExperience: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/review`, body, token, headers));
  },

  getOrderEventsTimeline: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/events-timeline`, token, undefined, undefined, headers, 1));
  },

  assignOrderToAgent: async (
    id: string,
    body: { agentId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/assign-agent`, body, token, headers));
  },

  trackOrderRoute: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/track-route`, token, undefined, undefined, headers, 1));
  },

  calculateOrderProfit: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/calculate-profit`, token, undefined, undefined, headers, 1));
  },

  checkOrderPaymentReconciliation: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/orders/${id}/payment-reconciliation`, token, undefined, undefined, headers, 1));
  },

  flagSuspectedReturnAbuse: async (
    id: string,
    body: { reason: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/flag-return-abuse`, body, token, headers));
  },

  handleOrderEscalation: async (
    id: string,
    body: { reason: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/escalate`, body, token, headers));
  },

  syncOrderWithERP: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/sync-erp`, {}, token, headers));
  },

  integrateOrderWithCRM: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/orders/${id}/integrate-crm`, {}, token, headers));
  },

  lockOrderForAudit: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/lock-audit`, {}, token, headers));
  },

  releaseOrderLock: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/release-lock`, {}, token, headers));
  },

  cancelOrderByAdmin: async (
    id: string,
    body: { reason: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/orders/${id}/cancel-admin`, body, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/orders/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default orderServices;

import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const discountServices = {
  // ========================================
  // 🧩 DISCOUNT RULES
  // ========================================

  createOrUpdateRule: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // POST /discounts/rules
    return safeApiCall(() => requests.post("/discounts/rules", body, token, headers));
  },

  updateRule: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // PUT /discounts/rules/:id
    return safeApiCall(() => requests.put(`/discounts/rules/${id}`, body, token, headers));
  },

  deleteRule: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // PUT /discounts/rules/:id
    return safeApiCall(() => requests.delete(`/discounts/rules/${id}`, undefined, token, headers));
  },

  listRules: async (
    query?: Record<string, any>,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // GET /discounts/rules
    return safeApiCall(() => requests.get("/discounts/rules", token, query, undefined, headers, 1));
  },

  toggleRuleActive: async (
    id: string,
    body: { isActive: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // PATCH /discounts/rules/:id/toggle
    return safeApiCall(() => requests.patch(`/discounts/rules/${id}/toggle`, body, token, headers));
  },

  applyDiscountRule: async (
    ruleId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // POST /discounts/rules/:ruleId/apply
    return safeApiCall(() => requests.post(`/discounts/rules/${ruleId}/apply`, undefined, token, headers));
  },

  removeDiscountRule: async (
    ruleId: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // POST /discounts/rules/:ruleId/remove
    return safeApiCall(() => requests.post(`/discounts/rules/${ruleId}/remove`, {}, token, headers));
  },

  // ========================================
  // 🎟️ PROMO CODES
  // ========================================

  createOrUpdatePromo: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // POST /discounts/promo
    return safeApiCall(() => requests.post("/discounts/promo", body, token, headers));
  },

  updatePromo: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // PUT /discounts/promo/:id
    return safeApiCall(() => requests.put(`/discounts/promo/${id}`, body, token, headers));
  },

  applyPromoToCart: async (
    body: { code: string; cartId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // POST /discounts/promo/apply
    return safeApiCall(() => requests.post("/discounts/promo/apply", body, token, headers));
  },

  // ========================================
  // 🛒 CHECKOUT & PREVIEW
  // ========================================

  previewRulesPricing: async (
    body: { cartId: string; ruleIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // POST /discounts/preview/rules
    return safeApiCall(() => requests.post("/discounts/preview/rules", body, token, headers));
  },

  checkoutWithDiscounts: async (
    body: { cartId: string; discounts?: any[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // POST /discounts/checkout/discounts
    return safeApiCall(() => requests.post("/discounts/checkout/discounts", body, token, headers));
  },

  // ========================================
  // 📚 DOCUMENTATION
  // ========================================

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // GET /discounts/docs/routes
    return safeApiCall(() => requests.get("/discounts/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default discountServices;

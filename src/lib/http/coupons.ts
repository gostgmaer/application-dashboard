import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const discountServices = {
  upsertDiscountRule: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    // create or update discount rule
    return safeApiCall(() => requests.post("/discount/rules", body, token, headers));
  },

  updateDiscountRule: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/discount/rules/${id}`, body, token, headers));
  },

  listDiscountRules: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/discount/rules", token, query, undefined, headers, 1));
  },

  toggleRuleActive: async (
    id: string,
    body: { isActive: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/discount/rules/${id}/toggle`, body, token, headers));
  },

  upsertPromoCode: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/discount/promo", body, token, headers));
  },

  updatePromoCode: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/discount/promo/${id}`, body, token, headers));
  },

  applyPromoToCart: async (
    body: { code: string; cartId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/discount/promo/apply", body, token, headers));
  },

  previewRulesPricing: async (
    body: { cartId: string; ruleIds: string[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/discount/preview/rules", body, token, headers));
  },

  checkoutWithDiscounts: async (
    body: { cartId: string; discounts?: any[] },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/discount/checkout/discounts", body, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/discount/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default discountServices;

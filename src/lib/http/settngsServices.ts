import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const settingServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/settings", body, token, headers));
  },

  listAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/settings", token, query, undefined, headers, 1));
  },

  getBySiteKey: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/settings/${siteKey}`, token, undefined, undefined, headers, 1));
  },

  updateBySiteKey: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/settings/${siteKey}`, body, token, headers));
  },

  removeBySiteKey: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/settings/${siteKey}`, token, undefined, headers));
  },

  updateSection: async (
    siteKey: string,
    sectionBody: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}`, sectionBody, token, headers));
  },

  updateBranding: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/branding`, body, token, headers));
  },

  updateBrandingField: async (
    siteKey: string,
    body: { field: string; value: any },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/branding/field`, body, token, headers));
  },

  updateSEO: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/seo`, body, token, headers));
  },

  updatePaymentMethods: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/payment-methods`, body, token, headers));
  },

  addPaymentMethod: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/settings/${siteKey}/payment-methods`, body, token, headers));
  },

  removePaymentMethod: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/settings/${siteKey}/payment-methods`, token, body, headers));
  },

  updateContactInfo: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/contact-info`, body, token, headers));
  },

  updateShippingOptions: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/shipping-options`, body, token, headers));
  },

  updateEmailTemplates: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/email-templates`, body, token, headers));
  },

  updateAnalytics: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/analytics`, body, token, headers));
  },

  updateCurrencyAndTax: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/currency-tax`, body, token, headers));
  },

  updateCurrency: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/currency`, body, token, headers));
  },

  updateLoyaltyProgram: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/loyalty`, body, token, headers));
  },

  incrementLoyaltyPoints: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/loyalty/increment`, body, token, headers));
  },

  updatePolicies: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/policies`, body, token, headers));
  },

  updatePolicy: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/policy`, body, token, headers));
  },

  updateFeaturedCategories: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/featured-categories`, body, token, headers));
  },

  updateOrderLimits: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/order-limits`, body, token, headers));
  },

  toggleMaintenanceMode: async (
    siteKey: string,
    body: { enabled: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/maintenance`, body, token, headers));
  },

  setMaintenanceMode: async (
    siteKey: string,
    body: { enabled: boolean; reason?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/maintenance-with-reason`, body, token, headers));
  },

  toggleLiveStatus: async (
    siteKey: string,
    body: { enabled: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/live`, body, token, headers));
  },

  toggleFeature: async (
    siteKey: string,
    body: { feature: string; enabled: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/feature`, body, token, headers));
  },

  getPublicSettings: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/settings/${siteKey}/public`, token, undefined, undefined, headers, 1));
  },

  getSection: async (
    siteKey: string,
    section: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/settings/${siteKey}/section/${section}`, token, undefined, undefined, headers, 1));
  },

  resetToDefaults: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/settings/${siteKey}/reset`, token, undefined, headers));
  },

  resetSection: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/settings/${siteKey}/reset-section`, token, undefined, headers));
  },

  updateWithAudit: async (
    siteKey: string,
    body: { changes: any; auditNote?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/settings/${siteKey}/audit-update`, body, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/settings/docs/routes`, token, undefined, undefined, headers, 1));
  }
};

export default settingServices;

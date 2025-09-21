import requests from "./index";
import { ApiResponse, safeApiCall } from "./apiUtils";

const settingServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/setting", body, token, headers));
  },

  listAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/setting", token, query, undefined, headers, 1));
  },

  getBySiteKey: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/setting/${siteKey}`, token, undefined, undefined, headers, 1));
  },

  updateBySiteKey: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/setting/${siteKey}`, body, token, headers));
  },

  removeBySiteKey: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/setting/${siteKey}`, token, undefined, headers));
  },

  updateSection: async (
    siteKey: string,
    sectionBody: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}`, sectionBody, token, headers));
  },

  updateBranding: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/branding`, body, token, headers));
  },

  updateBrandingField: async (
    siteKey: string,
    body: { field: string; value: any },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/branding/field`, body, token, headers));
  },

  updateSEO: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/seo`, body, token, headers));
  },

  updatePaymentMethods: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/payment-methods`, body, token, headers));
  },

  addPaymentMethod: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/setting/${siteKey}/payment-methods`, body, token, headers));
  },

  removePaymentMethod: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/setting/${siteKey}/payment-methods`, token, body, headers));
  },

  updateContactInfo: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/contact-info`, body, token, headers));
  },

  updateShippingOptions: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/shipping-options`, body, token, headers));
  },

  updateEmailTemplates: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/email-templates`, body, token, headers));
  },

  updateAnalytics: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/analytics`, body, token, headers));
  },

  updateCurrencyAndTax: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/currency-tax`, body, token, headers));
  },

  updateCurrency: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/currency`, body, token, headers));
  },

  updateLoyaltyProgram: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/loyalty`, body, token, headers));
  },

  incrementLoyaltyPoints: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/loyalty/increment`, body, token, headers));
  },

  updatePolicies: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/policies`, body, token, headers));
  },

  updatePolicy: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/policy`, body, token, headers));
  },

  updateFeaturedCategories: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/featured-categories`, body, token, headers));
  },

  updateOrderLimits: async (
    siteKey: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/order-limits`, body, token, headers));
  },

  toggleMaintenanceMode: async (
    siteKey: string,
    body: { enabled: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/maintenance`, body, token, headers));
  },

  setMaintenanceMode: async (
    siteKey: string,
    body: { enabled: boolean; reason?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/maintenance-with-reason`, body, token, headers));
  },

  toggleLiveStatus: async (
    siteKey: string,
    body: { enabled: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/live`, body, token, headers));
  },

  toggleFeature: async (
    siteKey: string,
    body: { feature: string; enabled: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/feature`, body, token, headers));
  },

  getPublicSettings: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/setting/${siteKey}/public`, token, undefined, undefined, headers, 1));
  },

  getSection: async (
    siteKey: string,
    section: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/setting/${siteKey}/section/${section}`, token, undefined, undefined, headers, 1));
  },

  resetToDefaults: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/setting/${siteKey}/reset`, token, undefined, headers));
  },

  resetSection: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/setting/${siteKey}/reset-section`, token, undefined, headers));
  },

  updateWithAudit: async (
    siteKey: string,
    body: { changes: any; auditNote?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/setting/${siteKey}/audit-update`, body, token, headers));
  },

  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/setting/docs/routes`, token, undefined, undefined, headers, 1));
  }
};

export default settingServices;

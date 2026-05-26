import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const settingServices = {
  // Get public settings for layout / context (Unauthenticated)
  getPublicSettings: async (
    siteKey: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/settings/public", undefined, undefined, undefined, {
        ...headers,
        "x-tenant": siteKey,
      }, 1)
    );
  },

  // Legacy layout fallback
  getBySiteKey: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/settings/public", token, undefined, undefined, {
        ...headers,
        "x-tenant": siteKey,
      }, 1)
    );
  },

  // Get complete settings (Authenticated)
  getPrivateSettings: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/settings/private", token, undefined, undefined, {
        ...headers,
        "x-tenant": siteKey,
      }, 1)
    );
  },

  // Get dynamic schema for settings form
  getDynamicSchema: async (
    siteKey: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/settings/dynamic-schema", token, undefined, undefined, {
        ...headers,
        "x-tenant": siteKey,
      }, 1)
    );
  },

  // List all available tenants
  listTenants: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.get("/settings/tenants", token, undefined, undefined, headers, 1)
    );
  },

  // Update a single setting field
  updateField: async (
    siteKey: string,
    body: { key: string; value: any },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() =>
      requests.patch("/settings/update-field", body, token, {
        ...headers,
        "x-tenant": siteKey,
      })
    );
  }
};

export default settingServices;

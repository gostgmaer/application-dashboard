// httpServices.ts
import { baseurl } from "@/config/setting";

// Types for fetchData options and response
export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any | FormData;
  token?: string;
  params?: Record<string, any>;
  query?: Record<string, any> | string;
  headers?: Record<string, string>;
  cacheTime?: number;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string; value: any }>;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  raw?: string;
}

/**
 * Robust fetchData function with error handling to prevent UI breaks.
 */
export async function fetchData<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const {
      method = "GET",
      body,
      token,
      params = {},
      query = {},
      headers = {},
      cacheTime = 60,
    } = options;

    // Validate endpoint
    if (!endpoint || typeof endpoint !== "string" || endpoint.trim() === "") {
      return {
        success: false,
        error: "Invalid or missing endpoint",
      };
    }

    // Decode query if it's a string
    const decoded = typeof query === "string" ? decodeURIComponent(query) : "";

    // Build the URL
    let url = `${baseurl}${endpoint}`;

    // Replace URL params
    if (params && Object.keys(params).length > 0) {
      try {
        Object.keys(params).forEach((key) => {
          const value = params[key];
          if (value === undefined || value === null || value === "") {
            throw new Error(`Invalid or missing URL parameter: ${key}`);
          }
          url = url.replace(`:${key}`, encodeURIComponent(value));
        });
      } catch (paramError) {
        return {
          success: false,
          error:
            paramError instanceof Error
              ? paramError.message
              : "URL parameter error",
        };
      }
    }

    // Append query parameters
    if (query && typeof query === "object" && !Array.isArray(query)) {
      try {
        const validQuery = Object.entries(query)
          .filter(([_, value]) => value !== undefined && value !== null && value !== "")
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {} as Record<string, any>);

        const queryString = new URLSearchParams(validQuery).toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      } catch (queryError) {
        return {
          success: false,
          error: "Failed to process query parameters",
        };
      }
    } else if (decoded) {
      url += `?${decoded}`;
    }



    const defaultHeaders: Record<string, string> = {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };


    const mergedHeaders = { ...defaultHeaders, ...headers };

    // Configure fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: mergedHeaders,
      ...(method === "GET" || !body
        ? {}
        : { body: body instanceof FormData ? body : JSON.stringify(body) }), // Handle FormData or JSON
      ...(typeof window === "undefined" ? { next: { revalidate: cacheTime } } : {}), // Next.js ISR cache control
    };

    // Execute fetch
    const res = await fetch(url, fetchOptions);

    // Handle non-OK responses
    if (!res.ok) {
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          return {
            success: false,
            error: errorData.message || errorData.error || `HTTP ${res.status}: ${res.statusText}`,
            ...errorData,
          };
        } catch {
          return {
            success: false,
            error: `HTTP ${res.status}: ${res.statusText}`,
          };
        }
      } else {
        try {
          const text = await res.text();
          return {
            success: false,
            error: text || `HTTP ${res.status}: ${res.statusText}`,
          };
        } catch {
          return {
            success: false,
            error: `HTTP ${res.status}: ${res.statusText}`,
          };
        }
      }
    }

    // Handle JSON response
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        const jsonData = await res.json();
        return {
          success: true,
          ...jsonData,
        };
      } catch {
        return {
          success: false,
          error: "Failed to parse JSON response",
        };
      }
    } else {

      // Non-JSON response fallback
      try {
        const raw = await res.text();
        console.warn("Non-JSON response received:", raw);
        return {
          success: true,
          data: raw as unknown as T,
          raw,
        };
      } catch {
        return {
          success: false,
          error: "Failed to read response",
        };
      }

    }
  } catch (error) {
    console.error("Fetch error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error: Please check your internet connection",
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || "Request failed",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Helper HTTP methods with type support
 */
const requests = {
  get: async <T = any>(
    endpoint: string,
    token?: string,
    query?: Record<string, any> | string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
    cacheTime: number = 3600
  ): Promise<ApiResponse<T>> =>
    await fetchData<T>(endpoint, {
      method: "GET",
      cacheTime,
      query,
      params,
      headers,
      token,
    }),

  post: async <T = any>(
    endpoint: string,
    body?: any | FormData,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    await fetchData<T>(endpoint, { method: "POST", body, headers, token }),

  put: async <T = any>(
    endpoint: string,
    body?: any | FormData,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    await fetchData<T>(endpoint, { method: "PUT", body, headers, token }),

  patch: async <T = any>(
    endpoint: string,
    body?: any | FormData,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    await fetchData<T>(endpoint, { method: "PATCH", body, headers, token }),

  delete: async <T = any>(
    endpoint: string,
    token?: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    await fetchData<T>(endpoint, { method: "DELETE", params, headers, token }),
};

export default requests;

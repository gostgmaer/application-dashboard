import { baseurl } from "@/config/setting";

type FetchOptions = {
  method?: string;
  body?: any;
  token?: string;
  params?: Record<string, string | number>;
  query?: Record<string, any> | string;
  headers?: Record<string, string>;
  cacheTime?: number;
  timeout?: number;
  retries?: number;
};

class FetchError extends Error {
  status?: number;
  raw?: any;
  constructor(message: string, status?: number, raw?: any) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.raw = raw;
  }
}

async function retryFetch<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(res => setTimeout(res, delay));
    return retryFetch(fn, retries - 1, delay * 2); // exponential backoff
  }
}

export async function fetchData<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    token,
    params = {},
    query = {},
    headers = {},
    cacheTime = 60,
    timeout = 10000,
    retries = 2,
  } = options;

  if (!endpoint || typeof endpoint !== "string" || endpoint.trim() === "") {
    throw new FetchError("Invalid or missing endpoint");
  }

  let url = `${baseurl}${endpoint}`;

  // Replace URL params
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      throw new FetchError(`Invalid or missing URL parameter: ${key}`);
    }
    url = url.replace(`:${key}`, encodeURIComponent(String(value)));
  });

  // Handle query string
  if (typeof query === "object" && query !== null) {
    const validQuery = Object.entries(query)
      .filter(([_, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);

    const queryString = new URLSearchParams(validQuery).toString();
    if (queryString) url += `?${queryString}`;
  } else if (typeof query === "string") {
    url += `?${decodeURIComponent(query)}`;
  } else {
    throw new FetchError("Invalid query format");
  }

  // Merge headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token && typeof token === "string" && token.trim() !== "") {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }
  const mergedHeaders = { ...defaultHeaders, ...headers };

  // Setup timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Log request metadata
  console.info("API Request:", {
    url,
    method,
    headers: mergedHeaders,
    body,
  });

  const fetchFn = async () => {
    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: method === "GET" ? undefined : body instanceof FormData ? body : JSON.stringify(body),
      signal: controller.signal,
      next: { revalidate: cacheTime },
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      if (contentType?.includes("application/json")) {
        const errorData = await res.json();
        throw new FetchError("Request failed", res.status, errorData);
      } else {
        const raw = await res.text();
        throw new FetchError("Non-JSON error response", res.status, raw);
      }
    }

    if (contentType?.includes("application/json")) {
      return await res.json();
    } else {
      const raw = await res.text();
      console.warn("Non-JSON response received:", raw);
      return { error: "Unexpected response format", raw } as any;
    }
  };

  return await retryFetch(fetchFn, retries);
}


type RequestHeaders = Record<string, string>;
type RequestParams = Record<string, string | number>;
type RequestQuery = Record<string, any> | string;

const DEFAULT_CACHE_TIME = 3600;

const requests = {
  get: async <T = any>(
    endpoint: string,
    query?: RequestQuery,
    params?: RequestParams,
    headers?: RequestHeaders,
    cacheTime: number = DEFAULT_CACHE_TIME,
    token?: string
  ): Promise<T> =>
    await fetchData<T>(endpoint, {
      method: "GET",
      query,
      params,
      headers,
      cacheTime,
      token,
    }),

  post: async <T = any>(
    endpoint: string,
    body?: any,
    headers?: RequestHeaders,
    token?: string
  ): Promise<T> =>
    await fetchData<T>(endpoint, {
      method: "POST",
      body,
      headers,
      token,
    }),

  put: async <T = any>(
    endpoint: string,
    body?: any,
    params?: RequestParams,
    headers?: RequestHeaders,
    token?: string
  ): Promise<T> =>
    await fetchData<T>(endpoint, {
      method: "PUT",
      body,
      params,
      headers,
      token,
    }),

  patch: async <T = any>(
    endpoint: string,
    body?: any,
    params?: RequestParams,
    headers?: RequestHeaders,
    token?: string
  ): Promise<T> =>
    await fetchData<T>(endpoint, {
      method: "PATCH",
      body,
      params,
      headers,
      token,
    }),

  delete: async <T = any>(
    endpoint: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    token?: string
  ): Promise<T> =>
    await fetchData<T>(endpoint, {
      method: "DELETE",
      params,
      headers,
      token,
    }),
};

export default requests;
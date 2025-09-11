
// utils/fetchData.js

import { baseurl } from "@/config/setting";
// import { getCookiesData } from "@/helper/functions";
export interface FetchOptions {
  method?: string;
  body?: any;
  params?: Record<string, string | number>;
  query?: Record<string, string | number>;
  headers?: Record<string, string>;
  cacheTime?: number;
}

export async function fetchData(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  try {
    const {
      method = "GET",
      body,
      params = {},
      query = {},
      headers = {},
      cacheTime = 60,
    } = options;

    // Validate endpoint
    if (!endpoint || typeof endpoint !== "string" || endpoint.trim() === "") {
      throw new Error("Invalid or missing endpoint");
    }

    // Build the URL
    let url = `${baseurl}${endpoint}`;

    // Replace URL params
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value === undefined || value === null || value === "") {
        throw new Error(`Invalid or missing URL parameter: ${key}`);
      }
      url = url.replace(`:${key}`, encodeURIComponent(String(value)));
    });

    // Append query parameters
    const validQuery = Object.entries(query).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);

    const queryString = new URLSearchParams(validQuery).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const mergedHeaders = { ...defaultHeaders, ...headers };

    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: method === "GET" ? undefined : JSON.stringify(body),
      next: { revalidate: cacheTime },
    });

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Data could not be fetched" };
  }
}



const requests = {
  get: async (endpoint: string, query: any, params: any, headers: any, cacheTime = 3600) =>
    await fetchData(endpoint, {
      method: 'GET',
      cacheTime: cacheTime,
      query, params, headers // Cache for 5 minutes
    }),
  post: async (endpoint: string, body: any, headers: any) =>
    await fetchData(endpoint, {
      method: 'POST',
      body, headers 
    }),
  put: async (endpoint: string, body: any, params: any, headers: any) =>
    await fetchData(endpoint, {
      method: 'PUT', body, params, headers 
    }),
  patch: async (endpoint: string, body: any, params: any, headers: any) =>
    await fetchData(endpoint, {
      method: 'PATCH', body, params, headers 
    }),
  delete: async (endpoint: string, params: any, headers: any) =>
    await fetchData(endpoint, {
      method: 'DELETE', params, headers
    }),


};



export default requests;

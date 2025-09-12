
// utils/fetchData.js

import { baseurl } from "@/config/setting";
// import { getCookiesData } from "@/helper/functions";
export async function fetchData(endpoint, options = {}) {
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

    // Decode query if it's a string
    const decoded = typeof query === "string" ? decodeURIComponent(query) : "";

    // Validate endpoint
    if (!endpoint || typeof endpoint !== "string" || endpoint.trim() === "") {
      throw new Error("Invalid or missing endpoint");
    }

    // Build the URL
    let url = `${baseurl}${endpoint}`;

    // Replace URL params
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value === undefined || value === null || value === "") {
          throw new Error(`Invalid or missing URL parameter: ${key}`);
        }
        url = url.replace(`:${key}`, value);
      });
    }

    // Append query parameters
    if (query && typeof query === "object" && !Array.isArray(query)) {
      const validQuery = Object.entries(query)
        .filter(([_, value]) => value !== undefined && value !== null && value !== "")
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      const queryString = new URLSearchParams(validQuery).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    } else if (decoded) {
      url += `?${decoded}`;
    }

    // Merge headers
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    };
    const mergedHeaders = { ...defaultHeaders, ...headers };

    // Fetch request
    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: method === "GET" ? undefined : JSON.stringify(body),
      next: { revalidate: cacheTime },
    });

    // Handle non-OK responses
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      } else {
        const text = await res.text();
        throw new Error(text);
      }
    }

    // Handle JSON vs non-JSON responses
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const raw = await res.text();
      console.warn("Non-JSON response received:", raw);
      return { error: "Unexpected response format", raw };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: error.message || "Data could not be fetched" };
  }
}


const requests = {
  get: async (endpoint, query, params, headers, cacheTime = 3600, token) =>
    
    await fetchData(endpoint, {
      method: 'GET',
      cacheTime: cacheTime,
      query, params, headers, token // Cache for 5 minutes
    }),
  post: async (endpoint, body, headers,token) =>
    await fetchData(endpoint, {
      method: 'POST',
      body, headers,token // Cache for 5 minutes
    }),
  put: async (endpoint, body, params, headers) =>
    await fetchData(endpoint, {
      method: 'PUT', body, params, headers // Cache for 5 minutes
    }),
  patch: async (endpoint, body, params, headers,token) =>
    await fetchData(endpoint, {
      method: 'PATCH', body, params, headers,token
    }),
  delete: async (endpoint, params, headers) =>
    await fetchData(endpoint, {
      method: 'DELETE', params, headers // Cache for 5 minutes
    }),


};



export default requests;

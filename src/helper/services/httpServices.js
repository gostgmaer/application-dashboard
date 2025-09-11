
// utils/fetchData.js

import { baseurl } from "@/config/setting";
// import { getCookiesData } from "@/helper/functions";
export async function fetchData(endpoint, options = {}) {
  try {
    const {
      method = "GET",
      body, token,
      params = {},
      query = {}, headers = {},
      cacheTime = 60,
    } = options;

    // const tokens = getCookiesData();

const decoded = decodeURIComponent(query);

    // Validate token and endpoint
    if (!endpoint || typeof endpoint !== "string" || endpoint.trim() === "") {
      throw new Error("Invalid or missing endpoint");
    }

    // if (!token || typeof token !== 'string' || token.trim() === '') {
    //   throw new Error('Invalid or missing authorization token');
    // }

    // Build the URL
    let url = `${baseurl}${endpoint}`;

    // Validate and replace URL params
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value === undefined || value === null || value === "") {
          throw new Error(`Invalid or missing URL parameter: ${key}`);
        }
        url = url.replace(`:${key}`, value);
      });
    }

    // Validate and append query parameters
    if (query && typeof query === "object") {
      const validQuery = Object.entries(query)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        ) // Filter out invalid values
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const queryString = new URLSearchParams(validQuery).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }else{
      url += `?${decoded}`;
    }
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: "Bearer " + token,

    };
    const mergedHeaders = { ...defaultHeaders, ...headers };


    // Make the fetch request
    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      body:
        method === "GET"
          ? undefined : JSON.stringify(body)
      ,
      next: { revalidate: cacheTime },
    });

    // if (!res.ok) {
    //   const errorData = await res.json();
    //   throw new Error(JSON.stringify(errorData));
    // }

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Data could not be fetched" };
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

// hooks/useApiSWR.ts
"use client";
import useSWR from "swr";
import request from "@/lib/http";
import { ApiResponse } from "@/types/global";
// import { request } from "https";

type SWROptions = {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
};

export function useApiSWR<T = any>(
  key: string | null, // null disables SWR
  token?: string,
  query?: Record<string, any>,
  params?: Record<string, any>,
  headers?: Record<string, any>,
  options?: SWROptions
) {
  const fetcher = async (url: string): Promise<T> => {
    const res: ApiResponse<T> = await request.get<T>(url, token, query, params, headers);
    if (!res.success) throw new Error(res.error || "Failed to fetch");
    return res.data as T;
  };

  return useSWR<T>(key, key ? fetcher : null, {
    refreshInterval: options?.refreshInterval ?? 0,
    revalidateOnFocus: options?.revalidateOnFocus ?? true,
  });
}

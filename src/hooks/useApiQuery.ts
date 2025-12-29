"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request from "@/lib/http";
import { ApiResponse } from "@/types/global";

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  raw?: unknown;
};

type QueryKey = (string | number | Record<string, any> | undefined)[];

export function useApiQuery<T = any>(
  key: string | null,
  token?: string,
  query?: Record<string, any>,
  params?: Record<string, any>,
  headers?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<T, ApiError, T, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  const queryKey: QueryKey | null = key
    ? [key, token, query, params]
    : null;

  return useQuery<T, ApiError, T, QueryKey>({
    queryKey: queryKey!,
    enabled: Boolean(queryKey) && (options?.enabled ?? true),

    queryFn: async () => {
      if (!key) {
        throw {
          message: "Query key is missing",
        } satisfies ApiError;
      }

      try {
        const res: ApiResponse<T> = await request.get<T>(
          key,
          token,
          query,
          params,
          headers
        );

        // API-level failure (success = false)
        if (!res.success) {
          throw {
            message: res.error || "Request failed",
            code: res.code,
            raw: res,
          } satisfies ApiError;
        }

        return res.data as T;
      } catch (err) {
        // Already formatted ApiError
        if (typeof err === "object" && err && "message" in err) {
          throw err as ApiError;
        }

        // Fetch/network error (DNS, offline, CORS, etc.)
        throw {
          message: "Network error. Please check your connection.",
          raw: err,
        } satisfies ApiError;
      }
    },

    staleTime: options?.staleTime ?? 0,
    gcTime: options?.gcTime ?? 5 * 60 * 1000,
    refetchInterval: options?.refetchInterval ?? false,
    retry: options?.retry ?? 1,

    ...options,
  });
}

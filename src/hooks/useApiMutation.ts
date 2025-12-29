"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import request from "@/lib/http";
import { ApiResponse } from "@/types/global";

type HttpMethod = "post" | "put" | "patch" | "delete";

export type ApiError = {
    message: string;
    status?: number;
    code?: string;
    raw?: unknown;
};

export function useApiMutation<T = any, V = any>(
    method: HttpMethod,
    url: string,
    token?: string,
    options?: UseMutationOptions<T, ApiError, V>
) {
    return useMutation<T, ApiError, V>({
        mutationFn: async (payload: V) => {
            try {
                const res: ApiResponse<T> = await request[method]<T>(
                    url,
                    payload,
                    token
                );

                if (!res.success) {
                    throw {
                        message: res.error || "Request failed",
                        code: res.code,
                        raw: res,
                    } satisfies ApiError;
                }

                return res.data as T;
            } catch (err) {
                if (typeof err === "object" && err && "message" in err) {
                    throw err as ApiError;
                }

                throw {
                    message: "Network error. Please try again.",
                    raw: err,
                } satisfies ApiError;
            }
        },

        retry: options?.retry ?? 1,
        ...options,
    });
}

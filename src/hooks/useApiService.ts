"use client";

import { useState, useCallback } from "react";
import type { ApiResponse } from "@/types/global";

/**
 * A universal API hook for all client calls.
 * It wraps any async service function and manages loading, error, and data states.
 *
 * Example:
 * const { callApi, loading, error, data } = useApiService();
 * await callApi(() => userService.getUser(id));
 */
export function useApiService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ApiResponse | null>(null);

    /**
     * Executes any async service call with proper state management
     */
    const callApi = useCallback(
        async <T>(fn: () => Promise<T>): Promise<T | null> => {
            try {
                setLoading(true);
                setError(null);
                setData(null);

                const response = await fn();
                setData(response as any);
                return response;
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong";
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        loading,
        error,
        data,
        callApi,
    };
}

export default useApiService;

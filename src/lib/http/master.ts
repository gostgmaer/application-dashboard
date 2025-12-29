import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const masterServices = {
    // List operations
    getAll: async (
        query?: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.get("/masters", token, query, undefined, headers, 1));
    },

    // Grouped by type
    getGrouped: async (
        query?: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.get("/masters/data", token, query, undefined, headers, 1));
    },
    // Single record by ID or code
    getSingle: async (
        idOrCode: string,
        query?: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.get(`/masters/${idOrCode}`, token, query, undefined, headers, 1));
    },



    // CRUD Operations
    create: async (
        body: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.post("/masters", body, token, headers));
    },

    update: async (
        idOrCode: string,
        body: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.put(`/masters/${idOrCode}`, body, token, headers));
    },

    // Bulk Operations
    bulkUpsert: async (
        body: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.post("/masters/bulk-upsert", body, token, headers));
    },

    bulkUpdate: async (
        type: string,
        body: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.patch(`/masters/type/${type}/bulk`, body, token, headers));
    },

    bulkDelete: async (
        body: any,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.delete("/masters/bulk", body, token, headers));
    },

    // Soft delete
    softDelete: async (
        idOrCode: string,
        token?: string,
        headers?: Record<string, any>
    ): Promise<ApiResponse> => {
        return safeApiCall(() => requests.delete(`/masters/${idOrCode}`, undefined, token, undefined, headers));
    },
};

export default masterServices;

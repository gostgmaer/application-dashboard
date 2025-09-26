// apiUtils.ts

export interface ApiResponse {
  success: boolean;
  status?: number;
  error_code?: string;
  data?: any;
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string; value: any }>;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}


export const handleApiError = (error: any): ApiResponse => {
  try {
    if (typeof error === 'object' && error !== null) {
      return {
        success: false,
        error: error.message || error.error || 'An unexpected error occurred',
        ...error,
      };
    }
    if (typeof error === 'string') {
      try {
        const parsedError = JSON.parse(error);
        return {
          success: false,
          error: parsedError.message || parsedError.error || 'An unexpected error occurred',
          ...parsedError,
        };
      } catch {
        return {
          success: false,
          error: error || 'An unexpected error occurred',
        };
      }
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  } catch {
    return {
      success: false,
      error: 'Failed to process error response',
    };
  }
};

export const safeApiCall = async <T = any>(apiCall: () => Promise<T>): Promise<ApiResponse> => {
  try {
    const response = await apiCall();

    if (response && typeof response === 'object' && 'error' in response) {
      return handleApiError(response);
    }

    if (response && typeof response === 'object') {
      return {
        success: true,
        ...response,
      };
    }
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return handleApiError(error);
  }
};

export interface ApiResponse<T = any> {
  success?: boolean;
  status?: number;
  code?: string;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string; value: any }>;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    nextPage?: number;
    prevPage?: number;
    lastPage?: number;
  }
  raw?: string;
}
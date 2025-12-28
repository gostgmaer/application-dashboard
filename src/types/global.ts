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
// Single Master Record
export interface Master {
  _id: string;
  type: string;
  code: string;
  label: string;
  altLabel?: string;
  description?: string;
  parentId?: string;
  tenantId?: {
    name?: string;
    id?: string;
    slug?: string;
  };
  domain?: string;
  sortOrder?: number;
  isActive?: boolean;
}
// Paginated List Response
export interface MasterList {
  data: Master[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Grouped by Type Response
export interface MasterGroup {
  type: string;
  values: Master[];
  count: number;      // returned records
}

export interface MasterGrouped {
  grouped: MasterGroup[];
  summary: {
    totalTypes: number;
    totalRecords: number;
  };
}
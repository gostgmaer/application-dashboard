

interface PaginationState {
  pageIndex: number;
  pageSize: number; // Note: pageSize, not limit
}
export interface TableState {
  pagination: PaginationState;
  sorting: Array<{
    id: string;
    desc: boolean;
  }>;
  columnFilters: Array<{
    id: string;
    value: unknown;
  }>;
  globalFilter: string;
}

export interface ServerResponse<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
}

export interface DataTableProps<T> {
  columns: any[];
  fetchData: (state: TableState) => Promise<ServerResponse<T>>;
  initiallimit?: number;
  searchPlaceholder?: string;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  limitOptions?: number[];
  defaultSorting?: Array<{ id: string; desc: boolean }>;
  defaultFilters?: Array<{ id: string; value: unknown }>;
  exportFileName?: string;
  enableExport?: boolean;
}

export interface PaginationProps {
  pageIndex: number;
  limit: number;
  totalCount: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPageChange: (pageIndex: number) => void;
  onlimitChange: (limit: number) => void;
  limitOptions: number[];
}
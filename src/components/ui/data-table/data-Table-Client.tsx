"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useApiSWR } from "@/hooks/useApiSWR";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Search,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader as Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

export interface DataTableFilter {
  id: string;
  label: string;
  type: "select" | "input";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  endpoint: string;
  token?: string;
  baseQueryParams?: Record<string, any>;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  paginationLimits?: number[];
  filters?: DataTableFilter[];
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  onRowSelect?: (rows: TData[]) => void;
  onDelete?: (rows: TData[]) => void;
  onExport?: (rows: TData[]) => void;
  initialPageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  searchKey?: string; // The key to use for search in backend
  enableServerSideOperations?: boolean;
}

export function DataTable<TData>({
  columns,
  endpoint,
  token,
  paginationLimits = [10, 20, 50, 100],
  baseQueryParams = {},
  params = {},
  headers,
  refreshInterval = 0,
  revalidateOnFocus = true,
  filters = [],
  enableRowSelection = true,
  enableMultiRowSelection = true,
  onRowSelect,
  onDelete,
  onExport,
  initialPageSize = 10,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  searchKey = "search",
  enableServerSideOperations = true,
}: DataTableProps<TData>) {
  // Client state for UI
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Server state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Build query parameters for server-side operations
  const serverQueryParams = useMemo(() => {
    if (!enableServerSideOperations) return baseQueryParams;

    const params: Record<string, any> = {
      ...baseQueryParams,
      page: currentPage,
      limit: pageSize,
    };

    // Add search
    if (searchQuery.trim()) {
      params[searchKey] = searchQuery.trim();
    }

    // Add sorting
    if (sortField) {
      params.sortBy = sortField;
      params.sortOrder = sortOrder;
    }

    // Add filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value.trim()) {
        params[key] = value.trim();
      }
    });

    return params;
  }, [
    enableServerSideOperations,
    baseQueryParams,
    currentPage,
    pageSize,
    searchQuery,
    searchKey,
    sortField,
    sortOrder,
    filterValues,
  ]);

  const { data, error, isLoading, mutate } = useApiSWR(
    endpoint,
    token,
    serverQueryParams,
    params,
    headers,
    { refreshInterval, revalidateOnFocus }
  );

  console.log(data);

  const tableData = useMemo(() => {
    if (!data?.result) return [];
    return Array.isArray(data.result) ? data.result : [];
  }, [data?.result]);

  const pagination = useMemo(() => {
    return (
      data?.pagination || {
        page: 1,
        totalPages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false,
        limit: pageSize,
      }
    );
  }, [data?.pagination, pageSize]);

  const appliedFilters = useMemo(() => {
    return data?.filters || { applied: 0, search: null };
  }, [data?.filters]);

  const tableColumns = useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectionColumn: ColumnDef<TData> = {
      id: "select",
      header: ({ table }) =>
        enableMultiRowSelection ? (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ) : null,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection, enableMultiRowSelection]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    enableMultiRowSelection,
    // Disable client-side operations when server-side is enabled
    manualPagination: enableServerSideOperations,
    manualSorting: enableServerSideOperations,
    manualFiltering: enableServerSideOperations,
    // Set page count from server response
    pageCount: enableServerSideOperations ? pagination.totalPages : undefined,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  // Handle server-side sorting
  const handleSort = useCallback(
    (columnId: string) => {
      if (!enableServerSideOperations) return;

      const currentSort = sorting.find((s) => s.id === columnId);
      const newOrder = currentSort?.desc ? "asc" : "desc";

      setSortField(columnId);
      setSortOrder(newOrder);
      setSorting([{ id: columnId, desc: newOrder === "desc" }]);
      setCurrentPage(1); // Reset to first page when sorting changes
    },
    [sorting, enableServerSideOperations]
  );

  // Handle server-side search with debounce
  useEffect(() => {
    if (!enableServerSideOperations) return;

    const debounceTimer = setTimeout(() => {
      setSearchQuery(globalFilter);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [globalFilter, enableServerSideOperations]);

  // Handle server-side filter changes
  const handleFilterChange = useCallback((filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }));
    setCurrentPage(1); // Reset to first page when filters change

    // Also update client-side filters for UI consistency
    if (value) {
      setColumnFilters((prev) => [
        ...prev.filter((f) => f.id !== filterId),
        { id: filterId, value },
      ]);
    } else {
      setColumnFilters((prev) => prev.filter((f) => f.id !== filterId));
    }
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  const handleExport = useCallback(() => {
    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : tableData;

    if (onExport) {
      onExport(dataToExport as TData[]);
      return;
    }

    const csv = convertToCSV(dataToExport);
    downloadCSV(csv, "export.csv");
  }, [selectedRows, tableData, onExport]);

  const handleDelete = useCallback(() => {
    if (onDelete && selectedRows.length > 0) {
      onDelete(selectedRows.map((row) => row.original) as TData[]);
      setRowSelection({});
    }
  }, [selectedRows, onDelete]);

  const handleResetFilters = useCallback(() => {
    setColumnFilters([]);
    setGlobalFilter("");
    setFilterValues({});
    setSearchQuery("");
    setSortField("");
    setSortOrder("asc");
    setSorting([]);
    setCurrentPage(1);
  }, []);

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-4">
          Error loading data: {error.message}
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2 overflow-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        {selectedRows.length > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
              {selectedRows.length} row(s) selected
            </span>
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
            <Button
              onClick={() => setRowSelection({})}
              variant="ghost"
              size="sm"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 pr-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
              />
              {globalFilter && (
                <Button
                  onClick={() => setGlobalFilter("")}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Export */}
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            {/* Refresh */}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </Button>

            {/* Filters */}
            {filters.length > 0 && (
              <div className="flex items-center space-x-2">
                {filters.map((filter) => (
                  <div key={filter.id}>
                    {filter.type === "select" ? (
                      <Select
                        value={filterValues[filter.id] || ""}
                        onValueChange={(value) =>
                          handleFilterChange(filter.id, value)
                        }
                      >
                        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                          <SelectValue
                            placeholder={filter.placeholder || filter.label}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                          <SelectItem value="NA">{`All ${filter.label}`}</SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder={filter.placeholder || filter.label}
                        value={filterValues[filter.id] || ""}
                        onChange={(e) =>
                          handleFilterChange(filter.id, e.target.value)
                        }
                        className="w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                      />
                    )}
                  </div>
                ))}
                {(Object.keys(filterValues).some((key) => filterValues[key]) ||
                  globalFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Info */}
      {appliedFilters.applied > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {appliedFilters.applied} filter(s) applied
          {appliedFilters.search &&
            ` • Searching for: "${appliedFilters.search}"`}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-gray-800"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center space-x-2",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none text-gray-900 dark:text-gray-100"
                        )}
                        onClick={() =>
                          header.column.getCanSort() && handleSort(header.id)
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="ml-2">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center text-gray-900 dark:text-gray-100"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : tableData.length ? (
              tableData.map((row: any, index: number) => {
                const tableRow = table.getRowModel().rows[index];
                if (!tableRow) return null;

                return (
                  <TableRow
                    key={`row-${index}`}
                    data-state={tableRow.getIsSelected() && "selected"}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {tableRow.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center text-gray-900 dark:text-gray-100"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 text-gray-900 dark:text-gray-100">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {paginationLimits.map((pageSizeOption) => (
                  <SelectItem key={pageSizeOption} value={`${pageSizeOption}`}>
                    {pageSizeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </div>

          <div className="text-sm text-muted-foreground">
            {pagination.total} total results
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={!pagination.hasPrev || isLoading}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev || isLoading}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext || isLoading}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={!pagination.hasNext || isLoading}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

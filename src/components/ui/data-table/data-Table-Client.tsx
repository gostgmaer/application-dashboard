"use client";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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

  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useApiQuery(
    endpoint,
    token,
    serverQueryParams,
    params,
    headers,
    {
      refetchInterval: refreshInterval || false,
      refetchOnWindowFocus: revalidateOnFocus,

      // ✅ React Query v5 replacement
      placeholderData: (previousData) => previousData,
    }
  );

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

    // ✅ ENABLE client models ONLY when server-side is OFF
    ...(enableServerSideOperations
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }),

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

    manualPagination: enableServerSideOperations,
    manualSorting: enableServerSideOperations,
    manualFiltering: enableServerSideOperations,

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
      setCurrentPage(1);
    },
    [sorting, enableServerSideOperations]
  );

  // Handle server-side search with debounce
  useEffect(() => {
    if (!enableServerSideOperations) return;

    const debounceTimer = setTimeout(() => {
      setSearchQuery(globalFilter);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [globalFilter, enableServerSideOperations]);

  // Handle server-side filter changes
  const handleFilterChange = useCallback(
    (filterId: string, value: string) => {
      const normalizedValue = value === "__all__" ? "" : value;

      // UI (always)
      setColumnFilters((prev) => {
        const next = prev.filter((f) => f.id !== filterId);
        if (normalizedValue) {
          next.push({ id: filterId, value: normalizedValue });
        }
        return next;
      });

      // Server-side state ONLY
      if (enableServerSideOperations) {
        setFilterValues((prev) => ({
          ...prev,
          [filterId]: normalizedValue,
        }));
        setCurrentPage(1);
      }
    },
    [enableServerSideOperations]
  );

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [endpoint],
    });
  }, [queryClient, endpoint]);

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
    <div className="space-y-5 p-4 overflow-auto">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {selectedRows.length > 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
            <span className="text-sm font-medium text-foreground">
              {selectedRows.length} selected
            </span>

            {onDelete && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 pr-9 h-9 rounded-md bg-background border-border focus:ring-2 focus:ring-primary/30"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setGlobalFilter("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Export */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            {/* Refresh */}
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </Button>

            {/* Filters */}
            {filters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => (
                  <div key={filter.id}>
                    {filter.type === "select" ? (
                      <Select
                        value={filterValues[filter.id] || "__all__"}
                        onValueChange={(value) =>
                          handleFilterChange(filter.id, value)
                        }
                      >
                        <SelectTrigger className="h-9 w-[180px] bg-background border-border">
                          <SelectValue
                            placeholder={filter.placeholder || filter.label}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">
                            All {filter.label}
                          </SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        className="h-9 w-[180px] bg-background border-border"
                        placeholder={filter.placeholder || filter.label}
                        value={filterValues[filter.id] || ""}
                        onChange={(e) =>
                          handleFilterChange(filter.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}

                {(Object.values(filterValues).some(Boolean) ||
                  globalFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Info */}
      {appliedFilters.applied > 0 && (
        <div className="text-xs text-muted-foreground">
          {appliedFilters.applied} filters applied
          {appliedFilters.search && ` • Searching “${appliedFilters.search}”`}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-background shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={() =>
                          header.column.getCanSort() && handleSort(header.id)
                        }
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none hover:text-primary"
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" && (
                              <ArrowUp className="h-4 w-4" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ArrowDown className="h-4 w-4" />
                            )}
                            {!header.column.getIsSorted() && (
                              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </>
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
                  className="h-28 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading data…
                  </div>
                </TableCell>
              </TableRow>
            ) : tableData.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-28 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows</span>
            <Select
              value={`${pageSize}`}
              onValueChange={(v) => handlePageSizeChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paginationLimits.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <span className="text-muted-foreground">
            {pagination.total} results
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handlePageChange(1)}
            disabled={!pagination.hasPrev || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={!pagination.hasNext || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  // ColumnDef,
  // ColumnFiltersState,
  // SortingState,
  // VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  // PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "./search-input";
import { TableToolbar } from './table-toolbar';
import { TablePagination } from "./table-pagination";
import { ExportColumn } from '@/lib/utils/export-utils';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { DataTableProps, TableState, ServerResponse } from "@/types/table";
import { getTableStateFromSearchParams, updateSearchParams, debounce } from "@/lib/utils/table-utils";

interface DataTableState<T> extends TableState {
  data: T[];
  totalCount: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
}

export function DataTable<T>({
  columns,
  fetchData,
  initiallimit = 10,
  searchPlaceholder = "Search...",
  enableGlobalFilter = true,
  enableColumnFilters = true,
  limitOptions = [10, 20, 50, 100],
  defaultSorting = [],
  defaultFilters = [],
  exportFileName = "table-export",
  enableExport = true,
}: DataTableProps<T>) {


  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL parameters
  const initialState = getTableStateFromSearchParams(searchParams);
  
  const [tableState, setTableState] = useState<TableState>({
    pagination: initialState.pagination || { pageIndex: 0, pageSize: initiallimit },
    sorting: initialState.sorting ?? [],
    columnFilters: initialState.columnFilters ?? [],
    globalFilter: initialState.globalFilter ?? '',
  });
  
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update URL when table state changes
  const updateURL = useCallback((newState: Partial<TableState>) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const updates: any = {};
    
    if (newState.pagination) {
      updates.page = newState.pagination.pageIndex + 1; // Convert to 1-based
      updates.limit = newState.pagination.pageSize;
    }
    
    if (newState.sorting !== undefined) {
      if (newState.sorting.length > 0) {
        updates.sortBy = newState.sorting[0].id;
        updates.sortDesc = newState.sorting[0].desc;
      } else {
        updates.sortBy = '';
      }
    }
    
    if (newState.globalFilter !== undefined) {
      updates.search = newState.globalFilter;
    }
    
    if (newState.columnFilters !== undefined) {
      const filters: Record<string, string> = {};
      newState.columnFilters.forEach(filter => {
        filters[filter.id] = String(filter.value);
      });
      updates.filters = filters;
    }
    
    const newURL = updateSearchParams(currentParams, updates);
    router.push(newURL, { scroll: false });
  }, [router, searchParams]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchData(tableState);
      setData(response.data);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, tableState]);

  const updateTableState = useCallback((updates: Partial<TableState>) => {
    const newState = { ...tableState, ...updates };
    setTableState(newState);
    updateURL(updates);
  }, [updateURL, tableState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGlobalFilterChange = useCallback((value: string) => {
    updateTableState({
      globalFilter: value,
      pagination: { ...tableState.pagination, pageIndex: 0 }, // Reset to first page
    });
  }, [updateTableState, tableState.pagination]);

  const handleColumnFilterChange = useCallback((columnId: string, value: string) => {
    const newFilters = [...tableState.columnFilters];
    const existingFilterIndex = newFilters.findIndex(f => f.id === columnId);
    
    if (value) {
      if (existingFilterIndex >= 0) {
        newFilters[existingFilterIndex] = { id: columnId, value };
      } else {
        newFilters.push({ id: columnId, value });
      }
    } else {
      if (existingFilterIndex >= 0) {
        newFilters.splice(existingFilterIndex, 1);
      }
    }
    
    updateTableState({
      columnFilters: newFilters,
      pagination: { ...tableState.pagination, pageIndex: 0 }, // Reset to first page
    });
  }, [updateTableState, tableState]);

  const handleSortingChange = useCallback((sorting: any[]) => {
    updateTableState({
      sorting,
      pagination: { ...tableState.pagination, pageIndex: 0 }, // Reset to first page
    });
  }, [updateTableState]);

  const handlePaginationChange = useCallback((pageIndex: number, limit?: number) => {
    updateTableState({
      pagination: {
        pageIndex,
        pageSize: limit ?? tableState.pagination.pageSize,
      },
    });
  }, [updateTableState, tableState.pagination.pageSize]);

  // Reset function
  const handleReset = useCallback(() => {
    const resetState = {
      pagination: { pageIndex: 0, pageSize: initiallimit },
      sorting: defaultSorting,
      columnFilters: defaultFilters,
      globalFilter: '',
    };
    
    setTableState(resetState);
    updateURL(resetState);
  }, [initiallimit, defaultSorting, defaultFilters, updateURL]);

  // Refresh function
  const handleRefresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Export columns configuration
  const exportColumns: ExportColumn[] = useMemo(() => {
    return columns
      .filter(col => col.accessorKey && col.accessorKey !== 'actions')
      .map(col => ({
        key: col.accessorKey as string,
        header: typeof col.header === 'string' 
          ? col.header 
          : (col.accessorKey as string).charAt(0).toUpperCase() + (col.accessorKey as string).slice(1),
        accessor: (row: any) => {
          const value = row[col.accessorKey as string];
          
          // Handle special formatting for common data types
          if (value instanceof Date) {
            return value.toLocaleDateString();
          }
          
          if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
          }
          
          if (typeof value === 'number' && col.accessorKey === 'price') {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value / 100);
          }
          
          return value || '';
        }
      }));
  }, [columns]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: tableState,
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater(tableState.pagination) 
        : updater;
      handlePaginationChange(newPagination.pageIndex, newPagination.pageSize);
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' 
        ? updater(tableState.sorting) 
        : updater;
      handleSortingChange(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' 
        ? updater(tableState.columnFilters) 
        : updater;
      
      const updates: Partial<TableState> = {
        columnFilters: newFilters,
        pagination: { ...tableState.pagination, pageIndex: 0 }
      };
      updateTableState(updates);
    },
    onGlobalFilterChange: handleGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error loading data: {error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <TableToolbar
        table={table}
        searchValue={tableState.globalFilter}
        onSearchChange={handleGlobalFilterChange}
        onRefresh={handleRefresh}
        onReset={handleReset}
        searchPlaceholder={searchPlaceholder}
        enableExport={enableExport}
        exportFileName={exportFileName}
        exportColumns={exportColumns}
      />

      {/* {enableGlobalFilter && (
        <div className="flex items-center justify-between">
          <SearchInput
            value={tableState.globalFilter}
            onChange={handleGlobalFilterChange}
            placeholder={searchPlaceholder}
            className="max-w-sm"
          />
        </div>
      )} */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: tableState.pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
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
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      

      <TablePagination
        pageIndex={tableState.pagination.pageIndex}
        limit={tableState.pagination.pageSize}
        totalCount={totalCount}
        pageCount={pageCount}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPageChange={(pageIndex) => handlePaginationChange(pageIndex)}
        onlimitChange={(limit) => handlePaginationChange(0, limit)}
        limitOptions={limitOptions}
      />
    </div>
  );
}
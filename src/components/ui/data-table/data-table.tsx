'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableToolbar } from './table-toolbar';
import { TablePagination } from './table-pagination';
import { SelectedItemsModal } from './selected-items-modal';
import { TableState, ServerResponse, DataTableProps } from '@/types/table';
import { debounce } from '@/lib/table-utils';

export function DataTable<T>({
  columns,
  fetchData,
  initialPageSize = 10,
  searchPlaceholder = "Search...",
  enableGlobalFilter = true,
  enableColumnFilters = true,
  pageSizeOptions = [10, 20, 50, 100],
  defaultSorting = [],
  defaultFilters = [],
  exportFileName = "export",
  enableExport = true,
  getItemDisplay,
  getItemKey,
  initialData,
  initialTableState,
  onTableStateChange,
}: DataTableProps<T>) {
  // State management
  const [data, setData] = useState<T[]>(initialData?.data || []);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount || 0);
  const [pageCount, setPageCount] = useState(initialData?.pageCount || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialTableState?.pagination.pageIndex || 0,
    pageSize: initialTableState?.pagination.pageSize || initialPageSize,
  });
  
  const [sorting, setSorting] = useState<SortingState>(
    initialTableState?.sorting || defaultSorting
  );
  
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialTableState?.columnFilters || defaultFilters
  );
  
  const [globalFilter, setGlobalFilter] = useState<string>(
    initialTableState?.globalFilter || ''
  );
  
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedItemsModalOpen, setSelectedItemsModalOpen] = useState(false);

  // Create table state object
  const tableState: TableState = useMemo(() => ({
    pagination,
    sorting,
    columnFilters,
    globalFilter,
  }), [pagination, sorting, columnFilters, globalFilter]);

  // Debounced fetch function
  const debouncedFetch = useMemo(
    () => debounce(async (state: TableState) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData(state);
        setData(response.data);
        setTotalCount(response.totalCount);
        setPageCount(response.pageCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData([]);
        setTotalCount(0);
        setPageCount(0);
      } finally {
        setLoading(false);
      }
    }, 300),
    [fetchData]
  );

  // Fetch data when table state changes
  useEffect(() => {
    debouncedFetch(tableState);
    onTableStateChange?.(tableState);
  }, [tableState, debouncedFetch, onTableStateChange]);

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedItems = selectedRows.map(row => row.original);

  return (
    <div className="space-y-4">
      <TableToolbar
        table={table}
        enableGlobalFilter={enableGlobalFilter}
        enableColumnFilters={enableColumnFilters}
        searchPlaceholder={searchPlaceholder}
        enableExport={enableExport}
        exportFileName={exportFileName}
        data={data}
        columns={columns}
        selectedCount={selectedRows.length}
        onViewSelected={() => setSelectedItemsModalOpen(true)}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {loading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-destructive">Error: {error}</div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalCount={totalCount}
        pageCount={pageCount}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPageChange={(pageIndex) => setPagination(prev => ({ ...prev, pageIndex }))}
        onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }))}
        pageSizeOptions={pageSizeOptions}
      />

      <SelectedItemsModal
        isOpen={selectedItemsModalOpen}
        onClose={() => setSelectedItemsModalOpen(false)}
        selectedItems={selectedItems}
        getItemDisplay={getItemDisplay}
        getItemKey={getItemKey}
        onClearSelection={() => {
          setRowSelection({});
          setSelectedItemsModalOpen(false);
        }}
      />
    </div>
  );
}
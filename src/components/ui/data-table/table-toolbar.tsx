'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Settings2, X, Share2, Eye } from 'lucide-react';
import { exportToCSV, exportToExcel, ExportColumn, formatCellValue } from '@/lib/export-utils';
import { toast } from 'sonner';

interface TableToolbarProps<T> {
  table: Table<T>;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  searchPlaceholder?: string;
  enableExport?: boolean;
  exportFileName?: string;
  data: T[];
  columns: any[];
  selectedCount: number;
  onViewSelected: () => void;
}

export function TableToolbar<T>({
  table,
  enableGlobalFilter = true,
  searchPlaceholder = "Search...",
  enableExport = true,
  exportFileName = "export",
  data,
  columns,
  selectedCount,
  onViewSelected,
}: TableToolbarProps<T>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  const handleExport = (format: 'csv' | 'excel') => {
    const exportColumns: ExportColumn[] = columns
      .filter(col => col.accessorKey && col.header)
      .map(col => ({
        key: col.accessorKey,
        header: typeof col.header === 'string' ? col.header : col.accessorKey,
        accessor: (row: any) => formatCellValue(row[col.accessorKey]),
      }));

    if (format === 'csv') {
      exportToCSV(data, exportColumns, exportFileName);
      toast.success('Data exported to CSV successfully');
    } else {
      exportToExcel(data, exportColumns, exportFileName);
      toast.success('Data exported to Excel successfully');
    }
  };

  const handleShareResults = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL copied to clipboard! Share this link to show the current filtered results.');
    }).catch(() => {
      toast.error('Failed to copy URL to clipboard');
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {enableGlobalFilter && (
          <Input
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(String(event.target.value))}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewSelected}
              className="h-8"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Selected
            </Button>
          </div>
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareResults}
          className="h-8"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>

        {enableExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
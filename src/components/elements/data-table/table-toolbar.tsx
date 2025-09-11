"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  RefreshCw,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Search,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportToCSV,
  exportToExcel,
  ExportColumn,
  formatCellValue,
} from "@/lib/utils/export-utils";
import { useState } from "react";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onReset: () => void;
  searchPlaceholder?: string;
  enableExport?: boolean;
  exportFileName?: string;
  exportColumns?: ExportColumn[];
}

export function TableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  onRefresh,
  onReset,
  searchPlaceholder = "Search...",
  enableExport = true,
  exportFileName = "table-export",
  exportColumns = [],
}: TableToolbarProps<TData>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting(true);

    try {
      const allRows = table.getPreFilteredRowModel().rows;
      const data = allRows.map((row) => row.original);

      // Use provided export columns or generate from table columns
      const columns =
        exportColumns.length > 0
          ? exportColumns
          : table
              .getAllColumns()
              .filter(
                (col) =>
                  col.getCanHide() && col.getIsVisible() && col.id !== "actions"
              )
              .map((col) => ({
                key: col.id,
                header:
                  typeof col.columnDef.header === "string"
                    ? col.columnDef.header
                    : col.id.charAt(0).toUpperCase() + col.id.slice(1),
                accessor: (row: any) => formatCellValue(row[col.id]),
              }));

      if (format === "csv") {
        exportToCSV(data, columns, exportFileName);
      } else {
        exportToExcel(data, columns, exportFileName);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter ||
    table.getState().sorting.length > 0;

  return (
    <div className="flex items-center justify-between space-x-4 ">
      <div className="flex items-center space-x-2 flex-1">
        <div className={`relative max-w-sm`}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="max-w-sm"
        /> */}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-8 px-2 lg:px-3"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>

        {enableExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isExporting}
                className="h-8"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

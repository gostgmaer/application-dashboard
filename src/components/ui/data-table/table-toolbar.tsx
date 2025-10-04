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
  Menu,
  Badge,
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
import { SelectedItemsModal } from "./selected-items-modal";
import { useModal } from "@/contexts/modal-context";

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
  const { showConfirm, showAlert, showCustom, closeModal } = useModal();
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const allRows = table.getFilteredRowModel().rows;
  const [showSelectedModal, setShowSelectedModal] = useState(false);

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
  const handleClearSelection = () => {
    table.resetRowSelection();
    closeModal();
  };
  const removeItem = (index: number) => {
    const row = selectedRows[index];
    if (row) {
      selectedRows.filter((i) => i.id !== row.id);
    }
  };

  const hanldeShow = (data: any) => {
    showCustom({
      title: `View Selection`,
      content: (
        <SelectedItemsModal
          isOpen={showSelectedModal}
          onClose={() => setShowSelectedModal(false)}
          selectedItems={selectedRows}
          onRemoveItem={(index: any) => {
            removeItem(index);
          }}
          onClearAll={handleClearSelection}
          getItemDisplay={(item: any) => {
            return item.original.email;
          }}
          getItemKey={(item: any) => item.original._id}
        />
      ),
    });
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
        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} of {table.getFilteredRowModel().rows.length}{" "}
              row(s) selected
            </span>
          </div>
        )}

        {selectedRows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Menu className="mr-2 h-4 w-4" />
                Actions
                <Badge className="ml-2 h-5 min-w-[20px] rounded-full px-1 text-xs">
                  {selectedRows.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => hanldeShow(true)}>
                View Selected ({selectedRows.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClearSelection}>
                Clear Selection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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

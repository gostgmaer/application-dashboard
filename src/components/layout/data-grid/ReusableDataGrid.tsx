'use client';

import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  GridReadyEvent, 
  SelectionChangedEvent, 
  SortChangedEvent,
  FilterChangedEvent,
  PaginationChangedEvent,
  ModuleRegistry, 
  AllCommunityModule,
  // IServerSideDatasource,
  // IServerSideGetRowsRequest
} from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Download, RefreshCw, Search, Filter, Grid3X3 } from 'lucide-react';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom cell renderer for status badges
const StatusCellRenderer = (params: any) => {
  const status = params.value;
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} text-white`}>
      {status}
    </Badge>
  );
};

// Custom cell renderer for actions
const ActionCellRenderer = (params: any) => {
  const onEdit = () => {
    console.log('Edit:', params.data);
  };

  const onDelete = () => {
    console.log('Delete:', params.data);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};

// Number formatter
const numberFormatter = (params: any) => {
  return new Intl.NumberFormat().format(params.value);
};

// Currency formatter
const currencyFormatter = (params: any) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(params.value);
};

// Date formatter
const dateFormatter = (params: any) => {
  return new Date(params.value).toLocaleDateString();
};

export interface DataGridProps {
  // Server-side data source
  serverSideUrl?: string;
  initialData?: any[];
  columnDefs: ColDef[];
  height?: string;
  theme?: string;
  enableRangeSelection?: boolean;
  enableCharts?: boolean;
  enableSorting?: boolean;
  enableFilter?: boolean;
  enableColResize?: boolean;
  enableRowSelection?: boolean;
  pagination?: boolean;
  paginationlimit?: number;
  onSelectionChanged?: (selectedRows: any[]) => void;
  onRowDoubleClicked?: (data: any) => void;
  suppressRowClickSelection?: boolean;
  rowMultiSelectWithClick?: boolean;
  enableExport?: boolean;
  defaultColDef?: ColDef;
  className?: string;
  // Server-side API endpoints
  apiEndpoints?: {
    getData?: string;
    updateRow?: string;
    deleteRow?: string;
    bulkAction?: string;
  };
  // Custom API handlers
  onApiCall?: (action: string, data: any) => Promise<any>;
}

export const ReusableDataGrid: React.FC<DataGridProps> = ({
  serverSideUrl,
  initialData = [],
  columnDefs,
  height = '600px',
  theme = 'ag-theme-alpine',
  enableRangeSelection = false,
  enableCharts = false,
  enableSorting = true,
  enableFilter = true,
  enableColResize = true,
  enableRowSelection = true,
  pagination = true,
  paginationlimit = 20,
  onSelectionChanged,
  onRowDoubleClicked,
  suppressRowClickSelection = false,
  rowMultiSelectWithClick = true,
  enableExport = true,
  defaultColDef,
  className = '',
  apiEndpoints = {},
  onApiCall,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Default column definition
  const defaultColumnDefs: ColDef = useMemo(() => ({
    sortable: enableSorting,
    filter: enableFilter,
    resizable: enableColResize,
    floatingFilter: enableFilter,
    ...defaultColDef,
  }), [enableSorting, enableFilter, enableColResize, defaultColDef]);

  // Server-side datasource
  // const serverSideDatasource: IServerSideDatasource = useMemo(() => ({
  //   getRows: async (params: IServerSideGetRowsRequest) => {
  //     setLoading(true);
  //     try {
  //       const { request } = params;
        
  //       // Build API request
  //       const apiRequest = {
  //         startRow: request.startRow,
  //         endRow: request.endRow,
  //         sortModel: request.sortModel,
  //         filterModel: request.filterModel,
  //         quickFilter: quickFilterText,
  //       };

  //       let response;
  //       if (onApiCall) {
  //         response = await onApiCall('getData', apiRequest);
  //       } else if (serverSideUrl || apiEndpoints.getData) {
  //         const url = serverSideUrl || apiEndpoints.getData!;
  //         const apiResponse = await fetch(url, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(apiRequest),
  //         });
  //         response = await apiResponse.json();
  //       } else {
  //         // Fallback to client-side filtering for demo purposes
  //         response = await simulateServerSideData(apiRequest, initialData);
  //       }

  //       setTotalRows(response.totalRows || 0);
  //       params.success({
  //         rowData: response.data || [],
  //         rowCount: response.totalRows || 0,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       params.fail();
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  // }), [serverSideUrl, apiEndpoints.getData, onApiCall, quickFilterText, initialData]);
  // Grid options
  const gridOptions = useMemo(() => ({
    enableRangeSelection,
    enableCharts,
    suppressRowClickSelection,
    rowMultiSelectWithClick,
    rowSelection: enableRowSelection ? 'multiple' : undefined,
    pagination: true,
    paginationlimit,
    animateRows: true,
    enableCellTextSelection: true,
    suppressMenuHide: true,
    getRowHeight: () => 50,
    theme: 'legacy',
    // Server-side model
    // rowModelType: 'serverSide',
    // serverSideDatasource,
    cacheBlockSize: paginationlimit,
    maxBlocksInCache: 10,
  }), [
    enableRangeSelection,
    enableCharts,
    suppressRowClickSelection,
    rowMultiSelectWithClick,
    enableRowSelection,
    paginationlimit,
    // serverSideDatasource,
  ]);

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
    // Set the server-side datasource
    // params.api.setGridOption('serverSideDatasource', serverSideDatasource);
  }, []);

  // Handle quick filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (gridRef.current?.api) {
        // Refresh the server-side data when quick filter changes
        // gridRef.current.api.refreshServerSide({ purge: true });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [quickFilterText]);

  // Handle sorting changes
  const onSortChanged = useCallback(async (event: SortChangedEvent) => {
    // Server-side sorting is handled automatically by the datasource
    console.log('Sort changed:', event.api.getSortModel());
  }, []);

  // Handle filter changes
  const onFilterChanged = useCallback(async (event: FilterChangedEvent) => {
    // Server-side filtering is handled automatically by the datasource
    console.log('Filter changed:', event.api.getFilterModel());
  }, []);

  // Handle pagination changes
  const onPaginationChanged = useCallback(async (event: PaginationChangedEvent) => {
    const currentPage = event.api.paginationGetCurrentPage();
    setCurrentPage(currentPage);
    console.log('Page changed:', currentPage);
  }, []);

  // Handle row updates (server-side)
  const handleRowUpdate = useCallback(async (data: any) => {
    setLoading(true);
    try {
      if (onApiCall) {
        await onApiCall('updateRow', data);
      } else if (apiEndpoints.updateRow) {
        await fetch(apiEndpoints.updateRow, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      
      // Refresh the grid data
    if (gridRef.current?.api) {
        // gridRef.current.api.refreshServerSide({ purge: false });
    }
    } catch (error) {
      console.error('Error updating row:', error);
    } finally {
      setLoading(false);
    }
  }, [onApiCall, apiEndpoints.updateRow]);

  // Handle row deletion (server-side)
  const handleRowDelete = useCallback(async (data: any) => {
    setLoading(true);
    try {
      if (onApiCall) {
        await onApiCall('deleteRow', data);
      } else if (apiEndpoints.deleteRow) {
        await fetch(apiEndpoints.deleteRow, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: data.id }),
        });
      }
      
      // Refresh the grid data
      if (gridRef.current?.api) {
        // gridRef.current.api.refreshServerSide({ purge: true });
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    } finally {
      setLoading(false);
    }
  }, [onApiCall, apiEndpoints.deleteRow]);

  // Handle bulk actions (server-side)
  const handleBulkAction = useCallback(async (action: string, selectedData: any[]) => {
    setLoading(true);
    try {
      if (onApiCall) {
        await onApiCall('bulkAction', { action, data: selectedData });
      } else if (apiEndpoints.bulkAction) {
        await fetch(apiEndpoints.bulkAction, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action, data: selectedData }),
        });
      }
      
      // Refresh the grid data
      if (gridRef.current?.api) {
        // gridRef.current.api.refreshServerSide({ purge: true });
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setLoading(false);
    }
  }, [onApiCall, apiEndpoints.bulkAction]);

  // Handle selection changed
  const onSelectionChangedHandler = useCallback((event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRows(selectedRows);
    onSelectionChanged?.(selectedRows);
  }, [onSelectionChanged]);

  // Handle row double click
  const onRowDoubleClickedHandler = useCallback((event: any) => {
    onRowDoubleClicked?.(event.data);
  }, [onRowDoubleClicked]);

  // Export to CSV
  const exportToCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `export-${new Date().toISOString().split('T')[0]}.csv`,
      });
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null);
      setQuickFilterText('');
    }
  }, []);

  // Refresh grid (server-side)
  const refreshGrid = useCallback(() => {
    if (gridRef.current?.api) {
      // gridRef.current.api.refreshServerSide({ purge: true });
    }
  }, []);

  // Auto-size all columns
  const autoSizeColumns = useCallback(() => {
    if (gridRef.current?.api) {
      const allColumnIds: string[] = [];
      gridRef.current.columnApi.getColumns()?.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      gridRef.current.columnApi.autoSizeColumns(allColumnIds);
    }
  }, []);

  return (
    <Card className={`p-6 ${className}`}>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Quick filter..."
              value={quickFilterText}
              onChange={(e) => {
                setQuickFilterText(e.target.value);
              }}
              className="pl-10 w-64"
              disabled={loading}
            />
          </div>
          {selectedRows.length > 0 && (
            <Badge variant="secondary">
              {selectedRows.length} row(s) selected
            </Badge>
          )}
          {loading && (
            <Badge variant="outline">
              Loading...
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters} disabled={loading}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button variant="outline" size="sm" onClick={refreshGrid} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={autoSizeColumns}>
            <Grid3X3 className="h-4 w-4 mr-2" />
            Auto Size
          </Button>
          {enableExport && (
            <Button variant="outline" size="sm" onClick={exportToCsv}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* AG Grid */}
      <div className={`${theme} border rounded-lg overflow-hidden`} style={{ height }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColumnDefs}
          // gridOptions={gridOptions}
          rowData={}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChangedHandler}
          onRowDoubleClicked={onRowDoubleClickedHandler}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
          onPaginationChanged={onPaginationChanged}
          suppressRowDeselection={true}
          animateRows={true}
          enableCellTextSelection={true}
          suppressMenuHide={true}
          // className={theme}
        />
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <span>Total: {totalRows} rows</span>
        {pagination && (
          <span>Page: {currentPage + 1} | Page Size: {paginationlimit}</span>
        )}
      </div>
    </Card>
  );
};

// Simulate server-side data processing for demo purposes
const simulateServerSideData = async (request: any, data: any[]) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let filteredData = [...data];
  
  // Apply quick filter
  if (request.quickFilter) {
    const filterText = request.quickFilter.toLowerCase();
    filteredData = filteredData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(filterText)
      )
    );
  }
  
  // Apply column filters
  if (request.filterModel) {
    Object.keys(request.filterModel).forEach(field => {
      const filter = request.filterModel[field];
      if (filter.type === 'contains') {
        filteredData = filteredData.filter(row =>
          String(row[field]).toLowerCase().includes(filter.filter.toLowerCase())
        );
      }
    });
  }
  
  // Apply sorting
  if (request.sortModel && request.sortModel.length > 0) {
    const sort = request.sortModel[0];
    filteredData.sort((a, b) => {
      const aVal = a[sort.colId];
      const bVal = b[sort.colId];
      if (sort.sort === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }
  
  // Apply pagination
  const startRow = request.startRow || 0;
  const endRow = request.endRow || filteredData.length;
  const paginatedData = filteredData.slice(startRow, endRow);
  
  return {
    data: paginatedData,
    totalRows: filteredData.length,
  };
};
// Export utility functions for column definitions
export const DataGridUtils = {
  StatusCellRenderer,
  ActionCellRenderer,
  numberFormatter,
  currencyFormatter,
  dateFormatter,
  // Server-side action handlers
  createServerSideActionRenderer: (onUpdate: (data: any) => void, onDelete: (data: any) => void) => {
    return (params: any) => {
      const onEdit = () => {
        onUpdate(params.data);
      };

      const onDeleteClick = () => {
        onDelete(params.data);
      };


      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDeleteClick}>
            Delete
          </Button>
        </div>
      );
    };
  }
};


export default ReusableDataGrid;
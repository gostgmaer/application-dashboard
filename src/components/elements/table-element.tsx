"use client";

import { AgGridReact } from "ag-grid-react";
import {
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  GridApi,
  SortModelItem,
  IServerSideGetRowsParams,
  GridReadyEvent,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridComponentProps<T = any> {
  apiUrl: (query: string) => Promise<{ results: T[]; total?: number }>;
  columns?: ColDef<T>[];
  height?: string | number;
  defaultsort?: string;
  defaultColDef?: ColDef<T>;
}

function GridComponent<T = any>({
  apiUrl,
  columns = [],
  height = "80vh",
  defaultsort,
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: false,
    flex: 1,
    minWidth: 100,
  },
}: GridComponentProps<T>) {
  const gridApiRef = useRef<GridApi<T> | null>(null);
  // Derive column API type from the event to stay compatible across versions
  const columnApiRef = useRef<GridReadyEvent<T>["columnApi"] | null>(null);

  const prevSortRef = useRef<string | undefined>(defaultsort);
  const prevFilterRef = useRef<string>("");
  const prevPageRef = useRef<number>(0);
  const prevlimitRef = useRef<number>(0);
  const prevTotalRef = useRef<number>(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rowData, setRowData] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);

  const getSafeSortModel = useCallback((): SortModelItem[] => {
    const api = gridApiRef.current;
    const state = api?.getColumnState() || [];
    return state
      .filter((s) => s.sort)
      .map((sd) => ({ colId: sd.colId, sort: sd.sort! }));
  }, []);

  const serializeSort = (sortModel: SortModelItem[]) =>
    sortModel.map((s) => `${s.colId}:${s.sort}`).join("|");

  const fetchData = useCallback(
    async (reason = "") => {
      const api = gridApiRef.current;
      if (!api || !apiUrl) return;

      const sortModel = getSafeSortModel();
      const sortKey = serializeSort(sortModel);
      const filterModel = api.getFilterModel?.() || {};
      const filterKey = JSON.stringify(filterModel);

      const currentPage = api.paginationGetCurrentPage?.() ?? 0;
      const currentlimit = api.paginationGetlimit?.() ?? 20;

      const changed =
        sortKey !== prevSortRef.current ||
        filterKey !== prevFilterRef.current ||
        currentPage !== prevPageRef.current ||
        currentlimit !== prevlimitRef.current;

      if (!changed && reason !== "gridReady") return;

      prevSortRef.current = sortKey;
      prevFilterRef.current = filterKey;
      prevPageRef.current = currentPage;
      prevlimitRef.current = currentlimit;

      const params = new URLSearchParams({
        page: String(currentPage + 1),
        limit: String(currentlimit),
        sort: sortKey || defaultsort || "",
        filter: filterKey,
        type: "ag-grid",
      });

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.search = params.toString();
        window.history.replaceState({}, "", url);
      }

      try {
        const res = await apiUrl(params.toString());
        setRowData(Array.isArray(res.results) ? res.results : []);
        setTotal(res.total ?? res.results.length);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    },
    [apiUrl, getSafeSortModel, defaultsort]
  );

  const getRowId = useCallback(
    (params: { data: T }) => (params.data as any)._id,
    []
  );

  const onGridReady = useCallback(
    (params: GridReadyEvent<T>) => {
      gridApiRef.current = params.api;
      columnApiRef.current = params.columnApi;
      fetchData("gridReady");
    },
    [fetchData]
  );

  const rowSelection = useMemo(() => {
    return { mode: "multiRow" as const };
  }, []);

  const onSortChanged = useCallback(() => {
    fetchData("sortChanged");
  }, [fetchData]);

  const onFilterChanged = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchData("filterChanged"), 300);
  }, [fetchData]);

  const onPaginationChanged = useCallback(() => {
    fetchData("paginationChanged");
  }, [fetchData]);


  return (
    <div style={{ height }} className="ag-theme-alpine">
      <AgGridReact<T>
        rowData={rowData}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        enableRowPinning={true}
        pagination={true}
        paginationlimit={20}
        enableCellTextSelection={true}
        paginationlimitSelector={true}
        rowSelection={rowSelection}
        getRowId={getRowId}
        onRowResizeStarted={onPaginationChanged}
        paginationAutolimit={false}
        onGridReady={onGridReady}
        onSortChanged={onSortChanged}
        onFilterChanged={onFilterChanged}
        onPaginationChanged={onPaginationChanged}
        animateRows={true}
      />
    </div>
  );
}

export default GridComponent;
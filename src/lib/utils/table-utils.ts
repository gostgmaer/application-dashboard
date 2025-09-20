import { TableState } from "@/types/table";

export function getTableStateFromSearchParams(searchParams: URLSearchParams): Partial<TableState> {
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sortBy = searchParams.get('sortBy');
  const sortDesc = searchParams.get('sortDesc') === 'true';
  const search = searchParams.get('search') || '';
  
  const filters: Array<{ id: string; value: unknown }> = [];
  
  // Parse filters from URL
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter_')) {
      const filterId = key.replace('filter_', '');
      filters.push({ id: filterId, value });
    }
  });

  return {
    pagination: {
      pageIndex: page - 1, // TanStack uses 0-based indexing
      pageSize: limit,
    },
    sorting: sortBy ? [{ id: sortBy, desc: sortDesc }] : [],
    columnFilters: filters,
    globalFilter: search,
  };
}

export function updateSearchParams(
  searchParams: URLSearchParams,
  updates: Partial<{
    page: number;
    limit: number;
    sortBy: string;
    sortDesc: boolean;
    search: string;
    filters: Record<string, string>;
  }>
): string {
  const newParams = new URLSearchParams(searchParams);
  
  if (updates.page !== undefined) {
    if (updates.page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', updates.page.toString());
    }
  }
  
  if (updates.limit !== undefined) {
    if (updates.limit === 10) {
      newParams.delete('limit');
    } else {
      newParams.set('limit', updates.limit.toString());
    }
  }
  
  if (updates.sortBy !== undefined) {
    if (updates.sortBy) {
      newParams.set('sortBy', updates.sortBy);
      newParams.set('sortDesc', (updates.sortDesc || false).toString());
    } else {
      newParams.delete('sortBy');
      newParams.delete('sortDesc');
    }
  }
  
  if (updates.search !== undefined) {
    if (updates.search) {
      newParams.set('search', updates.search);
    } else {
      newParams.delete('search');
    }
  }
  
  if (updates.filters) {
    // Clear existing filters
    Array.from(newParams.keys()).forEach(key => {
      if (key.startsWith('filter_')) {
        newParams.delete(key);
      }
    });
    
    // Add new filters
    Object.entries(updates.filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(`filter_${key}`, value);
      }
    });
  }
  
  return `?${newParams.toString()}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
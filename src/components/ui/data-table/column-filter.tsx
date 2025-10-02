'use client';

import React from 'react';
import { Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Filter } from 'lucide-react';

interface ColumnFilterProps<T> {
  column: Column<T, unknown>;
  title?: string;
}

export function ColumnFilter<T>({ column, title }: ColumnFilterProps<T>) {
  const filterValue = (column.getFilterValue() as string) ?? '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 data-[state=open]:bg-accent"
        >
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter {title}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3" align="start">
        <div className="space-y-2">
          <p className="text-sm font-medium">Filter {title}</p>
          <Input
            placeholder={`Filter ${title?.toLowerCase()}...`}
            value={filterValue}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8"
          />
          {filterValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => column.setFilterValue('')}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
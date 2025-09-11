'use client';

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface ColumnFilterProps {
  column: {
    id: string;
    getFilterValue: () => unknown;
    setFilterValue: (value: unknown) => void;
  };
  title?: string;
}

export function ColumnFilter({ column, title }: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterValue = column.getFilterValue() as string;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 data-[state=open]:bg-accent ${
            filterValue ? "text-primary" : ""
          }`}
        >
          <Filter className="h-4 w-4" />
          {filterValue && <div className="ml-2 h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">
              Filter {title || column.id}
            </p>
            <Input
              placeholder={`Filter ${title || column.id}...`}
              value={filterValue || ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="h-8"
            />
            {filterValue && (
              <Button
                variant="ghost"
                onClick={() => column.setFilterValue("")}
                className="h-8 px-2 lg:px-3"
              >
                Clear
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
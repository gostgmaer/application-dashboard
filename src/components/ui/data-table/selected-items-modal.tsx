'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, X } from 'lucide-react';

interface SelectedItemsModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: T[];
  getItemDisplay?: (item: T) => string;
  getItemKey?: (item: T) => string | number;
  onClearSelection: () => void;
  onBulkAction?: (action: string, items: T[]) => void;
}

export function SelectedItemsModal<T>({
  isOpen,
  onClose,
  selectedItems,
  getItemDisplay,
  getItemKey,
  onClearSelection,
  onBulkAction,
}: SelectedItemsModalProps<T>) {
  const handleBulkAction = (action: string) => {
    onBulkAction?.(action, selectedItems);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Selected Items ({selectedItems.length})
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Manage your selected items or perform bulk actions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] w-full">
          <div className="space-y-2">
            {selectedItems.map((item, index) => (
              <div key={getItemKey?.(item) || index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <span className="text-sm">
                  {getItemDisplay?.(item) || `Item ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
          <div className="flex flex-1 space-x-2">
            <Button
              variant="outline"
              onClick={onClearSelection}
              className="flex-1"
            >
              Clear Selection
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleBulkAction('delete')}
              className="flex-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
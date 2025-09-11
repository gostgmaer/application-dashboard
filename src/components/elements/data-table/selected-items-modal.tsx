'use client';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SelectedItemsModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: T[];
  onRemoveItem: (item: T) => void;
  onClearAll: () => void;
  getItemDisplay: (item: T) => string;
  getItemKey: (item: T) => string;
  title?: string;
}

export function SelectedItemsModal<T>({
  isOpen,
  onClose,
  selectedItems,
  onRemoveItem,
  onClearAll,
  getItemDisplay,
  getItemKey,
  title = "Selected Items"
}: SelectedItemsModalProps<T>) {
  return (
      <div className="space-y-4">
        {selectedItems.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Manage your selected items
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
            >
              Clear All
            </Button>
          </div>
        )}
        
        {selectedItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No items selected
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedItems.map((item) => (
              <div
                key={getItemKey(item)}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <span className="flex-1 text-sm">
                  {getItemDisplay(item)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item)}
                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {selectedItems.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {selectedItems.slice(0, 10).map((item) => (
                <Badge
                  key={getItemKey(item)}
                  variant="secondary"
                  className="text-xs"
                >
                  {getItemDisplay(item)}
                </Badge>
              ))}
              {selectedItems.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedItems.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
  );
}
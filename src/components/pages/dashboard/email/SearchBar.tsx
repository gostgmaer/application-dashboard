"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Archive,
  Trash2,
  Star,
  Mail,
  MailOpen,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "./NotificationCenter";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  emailCount: number;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  folderName: string;
  sortBy: "date" | "sender" | "subject";
  sortOrder: "asc" | "desc";
  onSortChange: (
    sortBy: "date" | "sender" | "subject",
    sortOrder: "asc" | "desc"
  ) => void;
  selectedCount: number;
  onBulkAction: (
    action: "delete" | "archive" | "markRead" | "markUnread" | "star"
  ) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  emailCount,
  notifications,
  setNotifications,
  folderName,
  sortBy,
  sortOrder,
  onSortChange,
  selectedCount,
  onBulkAction,
}: SearchBarProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {folderName} ({emailCount})
        </h2>
        <div className="flex items-center space-x-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSortChange("date", sortOrder)}>
                Sort by Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("sender", sortOrder)}
              >
                Sort by Sender
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("subject", sortOrder)}
              >
                Sort by Subject
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange(sortBy, "asc")}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange(sortBy, "desc")}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
          <NotificationCenter
            notifications={notifications}
            onClearNotification={(id) =>
              setNotifications((prev) => prev.filter((n) => n.id !== id))
            }
          />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{selectedCount} selected</Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction("markRead")}
            >
              <MailOpen className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction("markUnread")}
            >
              <Mail className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction("star")}
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction("archive")}
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction("delete")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
        />
      </div>
    </div>
  );
}

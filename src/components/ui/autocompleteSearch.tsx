"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Search, Loader as Loader2, X, Check } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils/utils";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  [key: string]: any;
}

interface AutocompleteSearchProps {
  data?: SearchResult[];
  apiEndpoint?: string;
  searchKey?: string;
  returnType?: "object" | "id";
  multiple?: boolean;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  maxResults?: number;

  value?: SearchResult | SearchResult[] | null;
  onSelect?: (value: any) => void;

  className?: string;
  disabled?: boolean;
  displayKey?: string;
  descriptionKey?: string;

  /** ✅ For Zod/React Hook Form */
  error?: string;
}

export function AutocompleteSearch({
  data,
  apiEndpoint,
  searchKey = "search",
  multiple = false,
  returnType = "id",
  placeholder = "Search...",
  minChars = 1,
  debounceMs = 300,
  maxResults = 20,
  value,
  onSelect,
  className,
  disabled = false,
  displayKey = "title",
  descriptionKey = "description",
  error,
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedItems, setSelectedItems] = useState<SearchResult[]>([]);

  const debouncedQuery = useDebounce(query, debounceMs);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Sync initial value */
  useEffect(() => {
    if (value) {
      if (multiple && Array.isArray(value)) {
        setSelectedItems(value);
      } else if (!multiple && !Array.isArray(value)) {
        setSelectedItems([value]);
        setQuery(value[displayKey] || "");
      }
    } else {
      setSelectedItems([]);
      if (!multiple) setQuery("");
    }
  }, [value, multiple, displayKey]);

  /** Handle outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Fetch / filter search results */
  useEffect(() => {
    const searchItems = async () => {
      if (debouncedQuery.length < minChars) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);

      try {
        let searchResults: SearchResult[] = [];

        if (data) {
          searchResults = data.filter((item) => {
            const searchText = item[displayKey]?.toLowerCase() || "";
            const descText = item[descriptionKey]?.toLowerCase() || "";
            const queryLower = debouncedQuery.toLowerCase();
            return (
              searchText.includes(queryLower) || descText.includes(queryLower)
            );
          });
        } else if (apiEndpoint) {
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [searchKey]: debouncedQuery }),
          });

          if (!response.ok) throw new Error("Search failed");
          const responseData = await response.json();
          searchResults = responseData.results || responseData.data || [];
        }

        if (multiple) {
          searchResults = searchResults.filter(
            (result) =>
              !selectedItems.some((selected) => selected.id === result.id)
          );
        }

        setResults(searchResults.slice(0, maxResults));
        setIsOpen(true);
      } catch {
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!disabled) searchItems();
  }, [
    debouncedQuery,
    minChars,
    data,
    apiEndpoint,
    searchKey,
    multiple,
    selectedItems,
    maxResults,
    displayKey,
    descriptionKey,
    disabled,
  ]);

  /** Handle keyboard navigation */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0 || disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) handleSelect(results[selectedIndex]);
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  /** Handle selecting a result */
  const handleSelect = (result: SearchResult) => {
    if (multiple) {
      const newSelectedItems = [...selectedItems, result];
      setSelectedItems(newSelectedItems);
      setQuery("");

      // return type handling
      if (returnType === "id") {
        onSelect?.(newSelectedItems.map((item) => item.id));
      } else {
        onSelect?.(newSelectedItems);
      }
    } else {
      setSelectedItems([result]);
      setQuery(result[displayKey] || "");

      if (returnType === "id") {
        onSelect?.(result.id);
      } else {
        onSelect?.(result);
      }
    }

    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const removeSelectedItem = (itemToRemove: SearchResult) => {
    const newSelectedItems = selectedItems.filter(
      (item) => item.id !== itemToRemove.id
    );
    setSelectedItems(newSelectedItems);

    if (multiple) {
      if (returnType === "id") {
        onSelect?.(newSelectedItems.map((item) => item.id));
      } else {
        onSelect?.(newSelectedItems);
      }
    } else {
      setQuery("");
      if (returnType === "id") {
        onSelect?.(newSelectedItems[0]?.id || null);
      } else {
        onSelect?.(newSelectedItems[0] || null);
      }
    }
  };

  const clearAll = () => {
    setSelectedItems([]);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect?.(multiple ? [] : null);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      {/* Selected items */}
      {multiple && selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
            >
              <span>{item[displayKey]}</span>
              <button
                onClick={() => removeSelectedItem(item)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-10 py-2 border border-input rounded-lg",
            "bg-background text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            error && "border-destructive focus:ring-destructive/50",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />

        {(query || selectedItems.length > 0) && !disabled && (
          <button
            onClick={clearAll}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Zod error message */}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <ul className="py-1">
            {results.map((r, i) => (
              <li
                key={r.id}
                onClick={() => handleSelect(r)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={cn(
                  "px-3 py-2 cursor-pointer flex justify-between items-center",
                  selectedIndex === i && "bg-accent text-accent-foreground",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {r[displayKey]}
                  </div>
                  {r[descriptionKey] && (
                    <div className="text-xs text-muted-foreground truncate">
                      {r[descriptionKey]}
                    </div>
                  )}
                </div>
                {multiple && selectedItems.some((s) => s.id === r.id) && (
                  <Check className="h-4 w-4 text-primary ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

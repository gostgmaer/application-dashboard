'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Search, Loader as Loader2, X, Check } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils/utils';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  [key: string]: any; // Allow additional properties
}

interface AutocompleteSearchProps {
  // Data source options
  data?: SearchResult[]; // Static data
  apiEndpoint?: string; // API endpoint for dynamic search
  searchKey?: string; // Key to send search query (default: 'search')
  
  // Behavior options
  multiple?: boolean; // Allow multiple selections
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  maxResults?: number;
  
  // Selection handling
  value?: SearchResult | SearchResult[]; // Current selection(s)
  onSelect?: (result: SearchResult | SearchResult[]) => void;
  
  // Styling
  className?: string;
  disabled?: boolean;
  
  // Display options
  displayKey?: string; // Key to display in results (default: 'title')
  descriptionKey?: string; // Key for description (default: 'description')
}

export function AutocompleteSearch({
  data,
  apiEndpoint,
  searchKey = 'search',
  multiple = false,
  placeholder = 'Search...',
  minChars = 2,
  debounceMs = 300,
  maxResults = 10,
  value,
  onSelect,
  className,
  disabled = false,
  displayKey = 'title',
  descriptionKey = 'description'
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<SearchResult[]>([]);

  const debouncedQuery = useDebounce(query, debounceMs);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize selected items from value prop
  useEffect(() => {
    if (value) {
      if (multiple && Array.isArray(value)) {
        setSelectedItems(value);
      } else if (!multiple && !Array.isArray(value)) {
        setSelectedItems([value]);
        setQuery(value[displayKey] || '');
      }
    } else {
      setSelectedItems([]);
      if (!multiple) setQuery('');
    }
  }, [value, multiple, displayKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedQuery.length < minChars) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let searchResults: SearchResult[] = [];

        if (data) {
          // Search static data
          searchResults = data.filter(item => {
            const searchText = item[displayKey]?.toLowerCase() || '';
            const descText = item[descriptionKey]?.toLowerCase() || '';
            const queryLower = debouncedQuery.toLowerCase();
            return searchText.includes(queryLower) || descText.includes(queryLower);
          });
        } else if (apiEndpoint) {
          // Search via API
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              [searchKey]: debouncedQuery,
            }),
          });

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const responseData = await response.json();
          searchResults = responseData.results || responseData.data || [];
        }

        // Filter out already selected items in multiple mode
        if (multiple) {
          searchResults = searchResults.filter(result => 
            !selectedItems.some(selected => selected.id === result.id)
          );
        }

        // Limit results
        searchResults = searchResults.slice(0, maxResults);

        setResults(searchResults);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        setError('Search failed. Please try again.');
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!disabled) {
      searchItems();
    }
  }, [debouncedQuery, minChars, data, apiEndpoint, searchKey, multiple, selectedItems, maxResults, displayKey, descriptionKey, disabled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0 || disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    if (multiple) {
      const newSelectedItems = [...selectedItems, result];
      setSelectedItems(newSelectedItems);
      setQuery('');
      onSelect?.(newSelectedItems);
    } else {
      setSelectedItems([result]);
      setQuery(result[displayKey] || '');
      onSelect?.(result);
    }
    
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const removeSelectedItem = (itemToRemove: SearchResult) => {
    const newSelectedItems = selectedItems.filter(item => item.id !== itemToRemove.id);
    setSelectedItems(newSelectedItems);
    
    if (multiple) {
      onSelect?.(newSelectedItems);
    } else {
      setQuery('');
      onSelect?.(newSelectedItems[0] || null);
    }
  };

  const clearAll = () => {
    setSelectedItems([]);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect?.(multiple ? [] : []);
    inputRef.current?.focus();
  };

  const isSelected = (result: SearchResult) => {
    return selectedItems.some(item => item.id === result.id);
  };

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      {/* Selected Items (Multiple Mode) */}
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

      {/* Search Input */}
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
          onFocus={() => {
            if (results.length > 0 && query.length >= minChars) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-10 pr-10 py-2 border border-input rounded-lg',
            'bg-background text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
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

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive z-50">
          {error}
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <ul role="listbox" className="py-1">
            {results.map((result, index) => (
              <li
                key={result.id}
                role="option"
                aria-selected={selectedIndex === index}
                className={cn(
                  'px-3 py-2 cursor-pointer transition-colors flex items-center justify-between',
                  'hover:bg-accent hover:text-accent-foreground',
                  selectedIndex === index && 'bg-accent text-accent-foreground'
                )}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {result[displayKey]}
                  </div>
                  {result[descriptionKey] && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {result[descriptionKey]}
                    </div>
                  )}
                </div>
                {multiple && isSelected(result) && (
                  <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && !isLoading && query.length >= minChars && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No results found
          </div>
        </div>
      )}
    </div>
  );
}
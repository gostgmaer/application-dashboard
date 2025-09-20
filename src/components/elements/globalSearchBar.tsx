



import { Search } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

// Define types for search results
interface SearchResult {
  id: number;
  name: string; // Changed from title to name
  url: string;
}

interface SearchResponse {
  results: SearchResult[];
  suggestions: string[];
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock API call - replace with your actual API endpoint
  const fetchSearchResults = async (searchQuery: string): Promise<SearchResponse> => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response logic - customize based on your API
    const mockResults: SearchResult[] = searchQuery.length > 2
      ? [
          { id: 1, name: `Item for "${searchQuery}" 1`, url: `https://example.com/result1?query=${searchQuery}` },
          { id: 2, name: `Item for "${searchQuery}" 2`, url: `https://example.com/result2?query=${searchQuery}` },
        ]
      : [];

    const mockSuggestions: string[] = searchQuery.length > 0 && mockResults.length === 0
      ? [
          `${searchQuery} option 1`,
          `${searchQuery} option 2`,
          `${searchQuery} option 3`,
        ]
      : [];

    setLoading(false);
    return { results: mockResults, suggestions: mockSuggestions };
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim() === '') {
      setShowPopover(false);
      setResults([]);
      setSuggestions([]);
      return;
    }

    const { results: apiResults, suggestions: apiSuggestions } = await fetchSearchResults(newQuery);
    setResults(apiResults);
    setSuggestions(apiSuggestions);
    setShowPopover(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowPopover(false);
    if (inputRef.current) {
      inputRef.current.focus();
      handleSearch({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    window.open(result.url, '_blank', 'noopener,noreferrer');
    setShowPopover(false);
    setQuery('');
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-[20vw] mx-auto">
         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-80 overflow-y-auto z-10"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map(result => (
                <li
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{result.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{result.url}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400">No results found</p>
              {suggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Suggestions:</p>
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
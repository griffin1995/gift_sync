import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  FireIcon,
  TagIcon,
  BuildingStorefrontIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useSearch, SearchSuggestion } from '@/hooks/useSearch';

interface SearchBarProps {
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  onSearchSubmit,
  placeholder = "Search for gifts, products, or categories...",
  className = '',
  showSuggestions = true,
  autoFocus = false,
}: SearchBarProps) {
  const {
    query,
    suggestions,
    isLoadingSuggestions,
    recentSearches,
    popularSearches,
    setQuery,
    search,
    addToRecentSearches,
    clearRecentSearches,
  } = useSearch({ autoSearch: false });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    const iconClass = "w-4 h-4 text-gray-400";
    
    switch (type) {
      case 'category':
        return <Squares2X2Icon className={iconClass} />;
      case 'brand':
        return <BuildingStorefrontIcon className={iconClass} />;
      case 'tag':
        return <TagIcon className={iconClass} />;
      default:
        return <MagnifyingGlassIcon className={iconClass} />;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(showSuggestions && value.length > 0);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (showSuggestions && (query.length > 0 || recentSearches.length > 0 || popularSearches.length > 0)) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const allSuggestions = [
      ...suggestions,
      ...recentSearches.map(s => ({ id: s, text: s, type: 'recent' as const })),
      ...popularSearches.map(s => ({ id: s, text: s, type: 'popular' as const })),
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          handleSuggestionSelect(allSuggestions[selectedIndex].text);
        } else if (query.trim()) {
          handleSubmit();
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      addToRecentSearches(query.trim());
      onSearchSubmit?.(query.trim());
      search(query.trim());
      setIsOpen(false);
    }
  };

  const handleSuggestionSelect = (suggestionText: string) => {
    setQuery(suggestionText);
    addToRecentSearches(suggestionText);
    onSearchSubmit?.(suggestionText);
    search(suggestionText);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClearQuery = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
        
        {query && (
          <button
            onClick={handleClearQuery}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
          >
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionSelect(suggestion.text)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                      selectedIndex === index
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <span className="flex-1">{suggestion.text}</span>
                    {suggestion.count && (
                      <span className="text-xs text-gray-400">
                        {suggestion.count.toLocaleString()} results
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {isLoadingSuggestions && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Loading suggestions...
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSuggestionSelect(search)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                      selectedIndex === suggestions.length + index
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && query.length === 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Popular Searches
                </div>
                {popularSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSuggestionSelect(search)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                      selectedIndex === suggestions.length + recentSearches.length + index
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FireIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoadingSuggestions && suggestions.length === 0 && query.length > 1 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions found</p>
                <button
                  onClick={handleSubmit}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium mt-1"
                >
                  Search for "{query}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
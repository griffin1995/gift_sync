import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { api } from '@/lib/api';
import { Product } from '@/types';

export interface SearchFilters {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  availability: 'all' | 'in_stock' | 'out_of_stock';
  brands: string[];
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popularity';
  tags: string[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'tag';
  count?: number;
}

interface UseSearchOptions {
  debounceMs?: number;
  maxSuggestions?: number;
  enableFilters?: boolean;
  autoSearch?: boolean;
}

interface UseSearchReturn {
  query: string;
  results: Product[];
  suggestions: SearchSuggestion[];
  filters: SearchFilters;
  isLoading: boolean;
  isLoadingSuggestions: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  recentSearches: string[];
  popularSearches: string[];
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  search: (query?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
  getSuggestions: (query: string) => Promise<SearchSuggestion[]>;
}

const defaultFilters: SearchFilters = {
  categories: [],
  priceRange: { min: 0, max: 1000 },
  rating: 0,
  availability: 'all',
  brands: [],
  sortBy: 'relevance',
  tags: [],
};

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 300,
    maxSuggestions = 10,
    enableFilters = true,
    autoSearch = true,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFiltersState] = useState<SearchFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, debounceMs);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('giftsync_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('giftsync_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Load popular searches
  useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        const response = await api.search.getPopularSearches();
        setPopularSearches(response.searches);
      } catch {
        // Silently fail for popular searches
      }
    };

    loadPopularSearches();
  }, []);

  // Auto-search when query or filters change
  useEffect(() => {
    if (autoSearch && (debouncedQuery || enableFilters)) {
      search(debouncedQuery);
    }
  }, [debouncedQuery, filters, autoSearch, enableFilters]);

  // Search function
  const search = useCallback(async (searchQuery?: string) => {
    const queryToSearch = searchQuery ?? query;
    
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const searchParams = {
        q: queryToSearch,
        page: 1,
        limit: 20,
        ...(enableFilters ? filters : {}),
      };

      const response = await api.products.search(searchParams);
      
      setResults(response.products);
      setTotalCount(response.total);
      setHasMore(response.hasMore);
      setCurrentPage(1);

      // Add to recent searches if it's a meaningful query
      if (queryToSearch.trim().length > 1) {
        addToRecentSearches(queryToSearch.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, enableFilters]);

  // Load more results
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = {
        q: query,
        page: currentPage + 1,
        limit: 20,
        ...(enableFilters ? filters : {}),
      };

      const response = await api.products.search(searchParams);
      
      setResults(prev => [...prev, ...response.products]);
      setHasMore(response.hasMore);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more results');
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, currentPage, hasMore, isLoading, enableFilters]);

  // Get search suggestions
  const getSuggestions = useCallback(async (searchQuery: string): Promise<SearchSuggestion[]> => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    setIsLoadingSuggestions(true);

    try {
      const response = await api.search.getSuggestions({
        q: searchQuery,
        limit: maxSuggestions,
      });

      const suggestions = response.suggestions;
      setSuggestions(suggestions);
      return suggestions;
    } catch {
      return [];
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [maxSuggestions]);

  // Auto-load suggestions when query changes
  useEffect(() => {
    if (query.length >= 2) {
      getSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query, getSuggestions]);

  // Update filters
  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  // Clear results
  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setHasMore(false);
    setCurrentPage(1);
    setError(null);
  }, []);

  // Add to recent searches
  const addToRecentSearches = useCallback((searchQuery: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== searchQuery.toLowerCase());
      return [searchQuery, ...filtered].slice(0, 10); // Keep max 10 recent searches
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('giftsync_recent_searches');
  }, []);

  return {
    query,
    results,
    suggestions,
    filters,
    isLoading,
    isLoadingSuggestions,
    error,
    hasMore,
    totalCount,
    recentSearches,
    popularSearches,
    setQuery,
    setFilters,
    resetFilters,
    search,
    loadMore,
    clearResults,
    addToRecentSearches,
    clearRecentSearches,
    getSuggestions,
  };
}
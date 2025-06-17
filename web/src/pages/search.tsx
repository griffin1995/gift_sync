import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SwipeCard } from '@/components/swipe/SwipeCard';
import { useSearch } from '@/hooks/useSearch';
import { formatPrice } from '@/utils/formatting';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  
  const {
    query,
    results,
    isLoading,
    error,
    totalCount,
    hasMore,
    setQuery,
    search,
    loadMore,
  } = useSearch({ autoSearch: true });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Set initial query from URL
  useEffect(() => {
    if (q && typeof q === 'string' && q !== query) {
      setQuery(q);
    }
  }, [q, query, setQuery]);

  // Update URL when query changes
  useEffect(() => {
    if (query && query !== q) {
      router.push(
        {
          pathname: '/search',
          query: { q: query },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [query, q, router]);

  const handleSearchSubmit = (searchQuery: string) => {
    setQuery(searchQuery);
    search(searchQuery);
  };

  const handleSwipe = (direction: 'left' | 'right', product: any) => {
    // Handle swipe for analytics or user preferences
    console.log('Swiped', direction, 'on', product.name);
  };

  const handleLike = (product: any) => {
    // Handle product like
    console.log('Liked product:', product.name);
  };

  const handlePass = (product: any) => {
    // Handle product pass
    console.log('Passed on product:', product.name);
  };

  return (
    <>
      <Head>
        <title>{query ? `Search: ${query} - GiftSync` : 'Search - GiftSync'}</title>
        <meta name="description" content="Search for the perfect gifts with AI-powered recommendations" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Search Gifts
            </h1>
            
            {/* Search Bar */}
            <SearchBar
              onSearchSubmit={handleSearchSubmit}
              className="max-w-2xl"
              autoFocus={!query}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <SearchFilters />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {query && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Search Results for "{query}"
                      </h2>
                      {totalCount > 0 && (
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {totalCount.toLocaleString()} products found
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                    Filters
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 ${
                        viewMode === 'grid'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } transition-colors`}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 ${
                        viewMode === 'list'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } transition-colors`}
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && results.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Searching for gifts...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Search Error
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                  <button
                    onClick={() => search(query)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* No Results */}
              {!isLoading && !error && results.length === 0 && query && (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We couldn't find any products matching "{query}".
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>Try:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Using different keywords</li>
                      <li>Checking your spelling</li>
                      <li>Using more general terms</li>
                      <li>Browsing our categories instead</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Results Grid/List */}
              {results.length > 0 && (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SwipeCard
                            product={product}
                            onSwipe={handleSwipe}
                            onLike={handleLike}
                            onPass={handlePass}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-6">
                            <img
                              src={product.imageUrl || '/images/placeholder-product.png'}
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {product.name}
                              </h3>
                              
                              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {product.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <span>{product.brand}</span>
                                <span>•</span>
                                <span>{product.category}</span>
                                {product.rating && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      ⭐ {product.rating} ({product.reviewCount} reviews)
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                  {formatPrice(product.price, product.currency)}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handlePass(product)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    Pass
                                  </button>
                                  <button
                                    onClick={() => handleLike(product)}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                  >
                                    Like
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Load More */}
                  {hasMore && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                            Loading...
                          </>
                        ) : (
                          'Load More Results'
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
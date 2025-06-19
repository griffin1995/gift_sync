import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  StarIcon,
  CurrencyDollarIcon,
  TagIcon,
  BuildingStorefrontIcon,
  Squares2X2Icon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useSearch, SearchFilters as SearchFiltersType } from '@/hooks/useSearch';

interface SearchFiltersProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  collapsible?: boolean;
}

interface FilterSection {
  id: keyof SearchFiltersType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'checkboxes' | 'range' | 'rating' | 'radio';
  options?: { value: string; label: string; count?: number }[];
}

const filterSections: FilterSection[] = [
  {
    id: 'categories',
    label: 'Categories',
    icon: Squares2X2Icon,
    type: 'checkboxes',
    options: [
      { value: 'electronics', label: 'Electronics', count: 1234 },
      { value: 'books', label: 'Books', count: 856 },
      { value: 'clothing', label: 'Clothing', count: 2341 },
      { value: 'home', label: 'Home & Garden', count: 987 },
      { value: 'toys', label: 'Toys & Games', count: 654 },
      { value: 'sports', label: 'Sports & Outdoors', count: 432 },
      { value: 'beauty', label: 'Beauty & Personal Care', count: 789 },
      { value: 'jewelry', label: 'Jewelry', count: 345 },
    ],
  },
  {
    id: 'brands',
    label: 'Brands',
    icon: BuildingStorefrontIcon,
    type: 'checkboxes',
    options: [
      { value: 'apple', label: 'Apple', count: 156 },
      { value: 'samsung', label: 'Samsung', count: 134 },
      { value: 'nike', label: 'Nike', count: 98 },
      { value: 'adidas', label: 'Adidas', count: 87 },
      { value: 'sony', label: 'Sony', count: 76 },
      { value: 'lego', label: 'LEGO', count: 65 },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    icon: TagIcon,
    type: 'checkboxes',
    options: [
      { value: 'bestseller', label: 'Bestseller', count: 234 },
      { value: 'new', label: 'New Arrivals', count: 187 },
      { value: 'sale', label: 'On Sale', count: 156 },
      { value: 'eco-friendly', label: 'Eco-Friendly', count: 89 },
      { value: 'handmade', label: 'Handmade', count: 67 },
      { value: 'premium', label: 'Premium', count: 45 },
    ],
  },
];

export function SearchFilters({ className = '', orientation = 'vertical', collapsible = true }: SearchFiltersProps) {
  const { filters, setFilters, resetFilters } = useSearch();
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: false,
    tags: false,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCheckboxChange = (filterId: keyof SearchFiltersType, value: string, checked: boolean) => {
    const currentValues = filters[filterId] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    setFilters({ [filterId]: newValues });
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
    setFilters({
      priceRange: {
        ...filters.priceRange,
        [field]: value,
      },
    });
  };

  const handleRatingChange = (rating: number) => {
    setFilters({ rating });
  };

  const handleAvailabilityChange = (availability: SearchFiltersType['availability']) => {
    setFilters({ availability });
  };

  const handleSortByChange = (sortBy: SearchFiltersType['sortBy']) => {
    setFilters({ sortBy });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.availability !== 'all') count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      {collapsible && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              Filters
            </span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortByChange(e.target.value as SearchFiltersType['sortBy'])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min || ''}
                      onChange={(e) => handlePriceRangeChange('min', Number(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max || ''}
                      onChange={(e) => handlePriceRangeChange('max', Number(e.target.value) || 1000)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>${filters.priceRange.min}</span>
                    <span>${filters.priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(star === filters.rating ? 0 : star)}
                      className="p-1 transition-colors"
                    >
                      {star <= filters.rating ? (
                        <StarIconSolid className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-yellow-400" />
                      )}
                    </button>
                  ))}
                  {filters.rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {filters.rating}+ stars
                    </span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Availability
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Items' },
                    { value: 'in_stock', label: 'In Stock Only' },
                    { value: 'out_of_stock', label: 'Out of Stock' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={filters.availability === option.value}
                        onChange={() => handleAvailabilityChange(option.value as SearchFiltersType['availability'])}
                        className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic Filter Sections */}
              {filterSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between text-left mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {section.label}
                      </span>
                      {(filters[section.id] as string[]).length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                          {(filters[section.id] as string[]).length}
                        </span>
                      )}
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedSections[section.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections[section.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {section.options?.map((option) => (
                            <label key={option.value} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={(filters[section.id] as string[]).includes(option.value)}
                                  onChange={(e) => handleCheckboxChange(section.id, option.value, e.target.checked)}
                                  className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {option.label}
                                </span>
                              </div>
                              {option.count && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.count.toLocaleString('en-GB')}
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Reset Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
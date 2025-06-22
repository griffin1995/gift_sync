import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Filter, 
  RefreshCw, 
  Star, 
  Heart, 
  ExternalLink,
  Share2,
  Gift,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Target,
  Clock
} from 'lucide-react';
import { api, tokenManager } from '@/lib/api';
import { Recommendation, RecommendationRequest } from '@/types';
import { generateAffiliateLink, trackAffiliateClick, isValidAmazonUrl, extractASIN } from '@/lib/affiliate';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FilterOptions {
  category?: string;
  budget_min?: number;
  budget_max?: number;
  occasion?: string;
  sort_by?: 'score' | 'price_asc' | 'price_desc' | 'newest';
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  // Check authentication
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      router.replace('/auth/login?redirect=/dashboard/recommendations');
      return;
    }
    
    loadRecommendations();
  }, [router]);

  // Load recommendations with filters
  const loadRecommendations = async (newFilters?: FilterOptions) => {
    try {
      setIsLoading(true);
      
      const requestFilters: RecommendationRequest = {
        ...filters,
        ...newFilters,
        limit: 50,
        exclude_seen: false,
      };

      const response = await api.generateRecommendations(requestFilters);
      setRecommendations(response.data.recommendations);
      
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast.error('Failed to load recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh recommendations
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await api.refreshRecommendations();
      await loadRecommendations();
      toast.success('Recommendations refreshed!');
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
      toast.error('Failed to refresh recommendations.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadRecommendations(updatedFilters);
  };

  // Handle recommendation click
  const handleRecommendationClick = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    
    // Track click
    api.trackEvent({
      event_name: 'recommendation_clicked',
      properties: {
        recommendation_id: recommendation.id,
        product_id: recommendation.product.id,
        score: recommendation.score,
        algorithm: recommendation.algorithm_used,
      }
    });
  };

  // Handle external link click
  const handleExternalClick = async (recommendation: Recommendation) => {
    const product = recommendation.product;
    
    // Generate affiliate link and track click if it's an Amazon product
    if (product.url && isValidAmazonUrl(product.url)) {
      const affiliateUrl = generateAffiliateLink(product.url, {
        campaign: 'gift_recommendation',
        medium: 'recommendations_page',
        source: 'view_product_button',
        content: 'recommendation_grid'
      });
      
      // Track the affiliate click
      await trackAffiliateClick({
        productId: product.id,
        asin: extractASIN(product.url),
        category: product.category?.name || 'Unknown',
        price: product.price,
        currency: product.currency || 'GBP',
        affiliateUrl,
        originalUrl: product.url,
        source: 'recommendation'
      });
      
      // Track for analytics
      api.trackEvent({
        event_name: 'affiliate_click',
        properties: {
          recommendation_id: recommendation.id,
          product_id: product.id,
          affiliate_source: 'amazon_associates',
          price: product.price,
          is_affiliate: true,
        }
      });
      
      // Open affiliate link in new tab
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Track regular click
      api.trackEvent({
        event_name: 'product_click',
        properties: {
          recommendation_id: recommendation.id,
          product_id: product.id,
          price: product.price,
          is_affiliate: false,
        }
      });
      
      // Open regular product link or affiliate URL
      const targetUrl = product.affiliate_url || product.url;
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Handle share recommendation
  const handleShare = async (recommendation: Recommendation) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recommendation.product.name,
          text: `Check out this gift recommendation from GiftSync!`,
          url: window.location.origin + `/products/${recommendation.product.id}`,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      const shareUrl = `${window.location.origin}/products/${recommendation.product.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  // Format price
  const formatPrice = (price: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const occasions = ['Birthday', 'Christmas', 'Anniversary', 'Wedding', 'Graduation', 'Baby Shower'];
  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Toys'];

  return (
    <>
      <Head>
        <title>Recommendations - GiftSync</title>
        <meta name="description" content="Your personalized gift recommendations powered by AI" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Link>
                
                <h1 className="text-xl font-semibold text-gray-900">
                  AI Recommendations
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    showFilters 
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-b border-gray-200"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.budget_min || ''}
                        onChange={(e) => handleFilterChange({ budget_min: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.budget_max || ''}
                        onChange={(e) => handleFilterChange({ budget_max: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Occasion Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select
                      value={filters.occasion || ''}
                      onChange={(e) => handleFilterChange({ occasion: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Any Occasion</option>
                      {occasions.map(occasion => (
                        <option key={occasion} value={occasion}>{occasion}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sort_by || 'score'}
                      onChange={(e) => handleFilterChange({ sort_by: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="score">Best Match</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {isLoading ? (
            // Loading State
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your recommendations...</p>
              </div>
            </div>
          ) : recommendations.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No recommendations yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start swiping on products to train our AI and get personalized recommendations.
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Start Discovering
              </Link>
            </div>
          ) : (
            // Recommendations Grid
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Recommendations
                  </h2>
                  <p className="text-gray-600">
                    {recommendations.length} personalized suggestions found
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => handleRecommendationClick(recommendation)}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={recommendation.product.image_url}
                        alt={recommendation.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Match Score Badge */}
                      <div className="absolute top-3 left-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getConfidenceColor(recommendation.confidence)}`}>
                          <Star className="w-3 h-3 fill-current" />
                          {Math.round(recommendation.score * 100)}% match
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(recommendation);
                            }}
                            className="p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExternalClick(recommendation);
                            }}
                            className="p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product Badges */}
                      <div className="absolute bottom-3 left-3">
                        {recommendation.product.is_featured && (
                          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-1">
                            Featured
                          </div>
                        )}
                        {recommendation.product.is_trending && (
                          <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            🔥 Trending
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                          {recommendation.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{recommendation.product.brand}</p>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(recommendation.product.price, recommendation.product.currency)}
                          </span>
                          {recommendation.product.original_price && recommendation.product.original_price > recommendation.product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(recommendation.product.original_price, recommendation.product.currency)}
                            </span>
                          )}
                        </div>
                        
                        {recommendation.product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {recommendation.product.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Algorithm Info */}
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span>Confidence:</span>
                          <span className="font-medium">{Math.round(recommendation.confidence * 100)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Algorithm:</span>
                          <span className="font-medium capitalize">{recommendation.algorithm_used.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {/* Reasoning */}
                      {recommendation.reasoning && recommendation.reasoning.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            <strong>Why we recommend:</strong> {recommendation.reasoning[0]}
                          </p>
                        </div>
                      )}

                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Recommendation Detail Modal */}
      <AnimatePresence>
        {selectedRecommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedRecommendation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <Image
                  src={selectedRecommendation.product.image_url}
                  alt={selectedRecommendation.product.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedRecommendation.product.name}
                    </h2>
                    <p className="text-gray-600">{selectedRecommendation.product.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatPrice(selectedRecommendation.product.price, selectedRecommendation.product.currency)}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getConfidenceColor(selectedRecommendation.confidence)}`}>
                      <Star className="w-4 h-4 fill-current" />
                      {Math.round(selectedRecommendation.score * 100)}% match
                    </div>
                  </div>
                </div>

                {selectedRecommendation.product.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedRecommendation.product.description}
                    </p>
                  </div>
                )}

                {selectedRecommendation.reasoning && selectedRecommendation.reasoning.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Why We Recommend This</h3>
                    <ul className="space-y-2">
                      {selectedRecommendation.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


                <div className="flex gap-3">
                  <button
                    onClick={() => handleExternalClick(selectedRecommendation)}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    title={selectedRecommendation.product.url && isValidAmazonUrl(selectedRecommendation.product.url) ? 'View on Amazon (affiliate link)' : 'View product'}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {selectedRecommendation.product.url && isValidAmazonUrl(selectedRecommendation.product.url) 
                      ? 'View on Amazon' 
                      : 'View Product'}
                  </button>
                  <button
                    onClick={() => handleShare(selectedRecommendation)}
                    className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
/**
 * QuizComplete - Quiz Completion & Recommendations Component
 * 
 * Displays quiz completion success and shows generated recommendations.
 * Provides options to view detailed recommendations, restart quiz, or continue shopping.
 * 
 * Features:
 * - Animated completion celebration
 * - Recommendation preview cards
 * - Action buttons for next steps
 * - Social sharing options
 * - Analytics tracking
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Gift, 
  ArrowRight, 
  RefreshCw, 
  Star,
  ExternalLink,
  Share2
} from 'lucide-react';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface QuizRecommendation {
  product_id: string;
  confidence_score: number;
  reasoning: string;
  quiz_factors: Record<string, any>;
  rank_position: number;
}

interface QuizCompleteProps {
  recommendations: QuizRecommendation[];
  onRestart?: () => void;
  onViewRecommendations?: () => void;
  className?: string;
}

// =============================================================================
// RECOMMENDATION COMPONENTS
// =============================================================================

const RecommendationCard: React.FC<{
  recommendation: QuizRecommendation;
  index: number;
}> = ({ recommendation, index }) => {
  // Mock product data - in production this would come from the products API
  const mockProducts = {
    "550e8400-e29b-41d4-a716-446655440001": {
      title: "Premium Bluetooth Wireless Headphones",
      price: 45.99,
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center",
      rating: 4.5,
      review_count: 1247
    },
    "550e8400-e29b-41d4-a716-446655440002": {
      title: "Artisan Coffee Gift Set",
      price: 32.50,
      image_url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=300&fit=crop&crop=center",
      rating: 4.8,
      review_count: 892
    }
  };

  const product = mockProducts[recommendation.product_id as keyof typeof mockProducts] || {
    title: "Recommended Gift Item",
    price: 29.99,
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center",
    rating: 4.0,
    review_count: 500
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="recommendation-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {product.title}
          </h4>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-blue-600">£{product.price}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">{product.rating}</span>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${recommendation.confidence_score * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">
              {Math.round(recommendation.confidence_score * 100)}% match
            </span>
          </div>

          {/* Reasoning */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {recommendation.reasoning}
          </p>
        </div>

        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {recommendation.rank_position}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const QuizComplete: React.FC<QuizCompleteProps> = ({
  recommendations,
  onRestart,
  onViewRecommendations,
  className = ''
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'GiftSync Quiz Results',
          text: `I just completed a gift quiz and got ${recommendations.length} personalised recommendations!`,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const topRecommendation = recommendations[0];
  const confidenceScore = topRecommendation ? topRecommendation.confidence_score : 0;

  return (
    <div className={`quiz-complete ${className}`}>
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          {/* Celebration animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 40,
                  y: Math.sin(i * 60 * Math.PI / 180) * 40
                }}
                transition={{ 
                  delay: 0.6 + i * 0.1,
                  duration: 1,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
              />
            ))}
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Quiz Complete! 🎉
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 max-w-md mx-auto"
        >
          We've found {recommendations.length} perfect gift{recommendations.length > 1 ? 's' : ''} based on your answers.
          {confidenceScore >= 0.9 && " We're very confident about these matches!"}
        </motion.p>
      </motion.div>

      {/* Recommendations Preview */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-500" />
            Your Personalised Recommendations
          </h3>
          
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec, index) => (
              <RecommendationCard
                key={rec.product_id}
                recommendation={rec}
                index={index}
              />
            ))}
          </div>

          {recommendations.length > 3 && (
            <p className="text-sm text-gray-600 text-center mt-4">
              + {recommendations.length - 3} more recommendations waiting for you
            </p>
          )}
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        {/* Primary Action */}
        <button
          onClick={onViewRecommendations}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          View All Recommendations
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Take Again
          </button>
          
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            {isSharing ? 'Sharing...' : 'Share'}
          </button>
        </div>
      </motion.div>

      {/* Confidence Summary */}
      {topRecommendation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg text-center"
        >
          <p className="text-sm text-gray-600">
            <strong>Best Match:</strong> {Math.round(confidenceScore * 100)}% confidence
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Based on your relationship, budget, and preferences
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuizComplete;
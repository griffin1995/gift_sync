import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Star, ExternalLink, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Product, SwipeGesture } from '@/types';
import { appConfig } from '@/config';
import { generateAffiliateLink, trackAffiliateClick, isValidAmazonUrl, extractASIN } from '@/lib/affiliate';

interface SwipeCardProps {
  product: Product;
  index: number;
  isActive: boolean;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down', gesture: SwipeGesture) => void;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  product,
  index,
  isActive,
  onSwipe,
  onProductClick,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [gestureStartTime, setGestureStartTime] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for drag tracking - enhanced for mobile
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-150, 0, 150], [0.95, 1, 0.95]);
  
  // Transform values for overlay indicators
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [0, -150], [0, 1]);
  const superlikeOpacity = useTransform(y, [0, -150], [0, 1]);

  // Format price with currency
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  // Calculate discount percentage
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Handle pan start - enhanced for mobile
  const handlePanStart = () => {
    setIsDragging(true);
    setGestureStartTime(Date.now());
    
    // Haptic feedback on touch start (mobile)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Prevent scroll on mobile during drag
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  // Handle pan end - enhanced for mobile
  const handlePanEnd = (_event: any, info: PanInfo) => {
    setIsDragging(false);
    
    // Re-enable scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
    
    const { offset, velocity } = info;
    const swipeThreshold = appConfig.swipe.distanceThreshold;
    const velocityThreshold = appConfig.swipe.velocityThreshold;
    
    const gestureEndTime = Date.now();
    const duration = gestureEndTime - gestureStartTime;
    
    const gesture: SwipeGesture = {
      direction: 'right', // Will be updated below
      velocity: Math.sqrt(velocity.x ** 2 + velocity.y ** 2),
      distance: Math.sqrt(offset.x ** 2 + offset.y ** 2),
      duration,
      startPosition: { x: 0, y: 0 }, // Relative to card center
      endPosition: { x: offset.x, y: offset.y },
    };

    // Determine swipe direction
    const isHorizontalSwipe = Math.abs(offset.x) > Math.abs(offset.y);
    const isVerticalSwipe = Math.abs(offset.y) > Math.abs(offset.x);
    
    let shouldSwipe = false;
    let direction: 'left' | 'right' | 'up' | 'down' = 'right';

    if (isHorizontalSwipe) {
      if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
        shouldSwipe = true;
        direction = offset.x > 0 ? 'right' : 'left';
      }
    } else if (isVerticalSwipe) {
      if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > velocityThreshold) {
        shouldSwipe = true;
        direction = offset.y > 0 ? 'down' : 'up';
      }
    }

    if (shouldSwipe) {
      gesture.direction = direction;
      
      // Enhanced haptic feedback for mobile
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        const vibrationPattern = {
          'right': 50,  // Like - short pleasant buzz
          'up': [30, 20, 30],  // Super like - double buzz
          'left': 100,  // Dislike - longer buzz
          'down': 75   // Down swipe
        }[direction] || 50;
        
        navigator.vibrate(vibrationPattern);
      }
      
      onSwipe(direction, gesture);
    } else {
      // Snap back to center
      x.set(0);
      y.set(0);
    }
  };

  // Handle button clicks
  const handleDislike = () => {
    const gesture: SwipeGesture = {
      direction: 'left',
      velocity: 1,
      distance: 200,
      duration: 300,
      startPosition: { x: 0, y: 0 },
      endPosition: { x: -200, y: 0 },
    };
    onSwipe('left', gesture);
  };

  const handleLike = () => {
    const gesture: SwipeGesture = {
      direction: 'right',
      velocity: 1,
      distance: 200,
      duration: 300,
      startPosition: { x: 0, y: 0 },
      endPosition: { x: 200, y: 0 },
    };
    onSwipe('right', gesture);
  };

  const handleSuperlike = () => {
    const gesture: SwipeGesture = {
      direction: 'up',
      velocity: 1,
      distance: 200,
      duration: 300,
      startPosition: { x: 0, y: 0 },
      endPosition: { x: 0, y: -200 },
    };
    onSwipe('up', gesture);
  };

  const handleProductClick = async () => {
    if (onProductClick) {
      onProductClick(product);
    }
    
    // Generate affiliate link and track click if it's an Amazon product
    if (product.url && isValidAmazonUrl(product.url)) {
      const affiliateUrl = generateAffiliateLink(product.url, {
        campaign: 'gift_recommendation',
        medium: 'swipe_interface',
        source: 'product_click',
        content: 'swipe_card'
      });
      
      // Track the affiliate click
      await trackAffiliateClick({
        productId: product.id,
        asin: extractASIN(product.url),
        category: product.category.name,
        price: product.price,
        currency: product.currency || 'GBP',
        affiliateUrl,
        originalUrl: product.url,
        source: 'recommendation'
      });
      
      // Open affiliate link in new tab
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    } else if (product.url) {
      // Open regular product link
      window.open(product.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Reset position when card becomes active
  useEffect(() => {
    if (isActive) {
      x.set(0);
      y.set(0);
    }
  }, [isActive, x, y]);

  return (
    <motion.div
      ref={cardRef}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing ${className}`}
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
        zIndex: isActive ? 20 : 10 - index,
      }}
      drag={isActive}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      dragMomentum={true}
      whileDrag={{ 
        scale: 1.05,
        cursor: 'grabbing',
        transition: { type: 'spring', stiffness: 400, damping: 30 }
      }}
      onPanStart={handlePanStart}
      onPanEnd={handlePanEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1 : 0.95 - (index * 0.05),
        opacity: isActive ? 1 : 0.7 - (index * 0.2),
        y: isActive ? 0 : index * 10,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Main Card */}
      <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Product Image */}
        <div className="relative w-full h-2/3">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2}
          />
          
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Product Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <div className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </div>
            )}
            {product.is_trending && (
              <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                🔥 Trending
              </div>
            )}
            {product.is_new && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✨ New
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* Product Rating */}
          {product.rating && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-medium">
                {product.rating.toFixed(1)}
              </span>
              {product.review_count && (
                <span className="text-white/70 text-xs">
                  ({product.review_count})
                </span>
              )}
            </div>
          )}

          {/* Swipe Indicators */}
          <motion.div
            className="absolute inset-0 bg-green-500/90 flex items-center justify-center"
            style={{ opacity: likeOpacity }}
          >
            <div className="bg-white rounded-full p-4">
              <Heart className="w-8 h-8 text-green-500 fill-green-500" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-red-500/90 flex items-center justify-center"
            style={{ opacity: dislikeOpacity }}
          >
            <div className="bg-white rounded-full p-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-blue-500/90 flex items-center justify-center"
            style={{ opacity: superlikeOpacity }}
          >
            <div className="bg-white rounded-full p-4">
              <Star className="w-8 h-8 text-blue-500 fill-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Product Information */}
        <div className="p-6 h-1/3 flex flex-col justify-between">
          {/* Product Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={handleProductClick}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
              </div>
              <button
                onClick={handleProductClick}
                className="ml-2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title={product.url && isValidAmazonUrl(product.url) ? 'View on Amazon (affiliate link)' : 'View product'}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.original_price, product.currency)}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {product.category.name}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {product.availability}
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          {isActive && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleDislike}
                className="w-12 h-12 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group"
                disabled={isDragging}
              >
                <X className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
              </button>

              <button
                onClick={handleSuperlike}
                className="w-12 h-12 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors group"
                disabled={isDragging}
              >
                <Star className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
              </button>

              <button
                onClick={handleLike}
                className="w-12 h-12 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors group"
                disabled={isDragging}
              >
                <Heart className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
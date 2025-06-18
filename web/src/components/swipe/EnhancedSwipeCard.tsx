import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Star, Zap, ShoppingBag, Share2 } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating?: number;
  category: string;
  brand?: string;
  features?: string[];
}

interface EnhancedSwipeCardProps {
  product: Product;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  style?: React.CSSProperties;
  className?: string;
}

export const EnhancedSwipeCard: React.FC<EnhancedSwipeCardProps> = ({
  product,
  onSwipe,
  style,
  className = '',
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for rotation and opacity based on drag
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-150, 0, 150], [0.9, 1, 0.9]);
  
  // Color overlays for swipe feedback
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      setIsExiting(true);
      
      if (info.offset.x > 0) {
        onSwipe('right'); // Like
      } else {
        onSwipe('left'); // Pass
      }
    } else if (info.offset.y < -threshold || info.velocity.y < -500) {
      setIsExiting(true);
      onSwipe('up'); // Super like
    }
  };

  const handleButtonAction = (action: 'left' | 'right' | 'up') => {
    setIsExiting(true);
    onSwipe(action);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto perspective-1000">
      <motion.div
        className={`swipe-card w-full h-[600px] ${className}`}
        style={{
          ...style,
          x,
          y,
          rotate,
          opacity,
          scale,
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{
          x: isExiting ? (x.get() > 0 ? 300 : -300) : 0,
          y: isExiting && y.get() < -50 ? -300 : 0,
          opacity: 0,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-glow overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
        {/* Swipe Feedback Overlays */}
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-3xl flex items-center justify-center z-10"
          style={{ opacity: likeOpacity }}
        >
          <div className="text-white text-4xl font-bold flex items-center gap-3">
            <Heart className="w-12 h-12 fill-current" />
            LOVE IT!
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-center z-10"
          style={{ opacity: passOpacity }}
        >
          <div className="text-white text-4xl font-bold flex items-center gap-3">
            <X className="w-12 h-12" />
            NOT FOR ME
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-blue-500 rounded-3xl flex items-center justify-center z-10"
          style={{ opacity: superLikeOpacity }}
        >
          <div className="text-white text-4xl font-bold flex items-center gap-3">
            <Zap className="w-12 h-12 fill-current" />
            SUPER LIKE!
          </div>
        </motion.div>

        {/* Product Image */}
        <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="glass-light px-3 py-1 rounded-full text-sm font-medium text-gray-800 backdrop-blur-md">
              {product.category}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ${product.price}
            </span>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="absolute bottom-4 left-4">
              <div className="glass-light px-3 py-1 rounded-full flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-800">{product.rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {product.title}
            </h3>
            {product.brand && (
              <p className="text-sm text-gray-600 font-medium mb-2">{product.brand}</p>
            )}
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4">
            {/* Pass Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonAction('left')}
              className="w-14 h-14 bg-white border-2 border-red-200 rounded-full flex items-center justify-center shadow-medium hover:border-red-300 hover:bg-red-50 transition-colors group"
            >
              <X className="w-6 h-6 text-red-500 group-hover:text-red-600" />
            </motion.button>

            {/* Super Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonAction('up')}
              className="w-12 h-12 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-medium hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Zap className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
            </motion.button>

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonAction('right')}
              className="w-14 h-14 bg-white border-2 border-green-200 rounded-full flex items-center justify-center shadow-medium hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <Heart className="w-6 h-6 text-green-500 group-hover:text-green-600" />
            </motion.button>
          </div>
        </div>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 w-10 h-10 glass-light rounded-full flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </motion.button>
      </motion.div>
    </div>
  );
};
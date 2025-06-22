import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedSwipeCard } from '@/components/swipe/EnhancedSwipeCard';
import { SwipeInterface } from '@/components/swipe/SwipeInterface';
import { LoadingCard, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Gift, ArrowLeft, Settings, Info, Sparkles, Heart, Zap } from 'lucide-react';
import { SwipeSession } from '@/types';
import { tokenManager } from '@/lib/api';
import { useMobileOptimizations, useHapticFeedback } from '@/hooks/useMobileOptimizations';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Sample product data for demo
const sampleProducts = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life and crystal-clear audio quality.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    rating: 4.8,
    category: 'Electronics',
    brand: 'AudioTech',
    features: ['Noise Cancelling', '30hr Battery', 'Wireless'],
  },
  {
    id: '2',
    title: 'Artisan Coffee Blend Gift Set',
    description: 'A curated collection of premium coffee beans from around the world, perfect for coffee enthusiasts.',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
    rating: 4.9,
    category: 'Food & Drink',
    brand: 'RoastMaster',
    features: ['Premium Beans', 'Gift Box', 'Fair Trade'],
  },
  {
    id: '3',
    title: 'Smart Fitness Watch',
    description: 'Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    rating: 4.6,
    category: 'Electronics',
    brand: 'FitTech',
    features: ['Heart Monitor', 'GPS', 'Waterproof'],
  },
  {
    id: '4',
    title: 'Luxury Skincare Set',
    description: 'Pamper yourself or a loved one with this premium skincare collection featuring natural ingredients.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
    rating: 4.7,
    category: 'Beauty',
    brand: 'GlowLux',
    features: ['Natural', 'Anti-Aging', 'Gift Set'],
  },
  {
    id: '5',
    title: 'Succulent Garden Kit',
    description: 'Everything you need to start your own beautiful succulent garden, including pots and soil.',
    price: 32.50,
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
    rating: 4.5,
    category: 'Home & Garden',
    brand: 'GreenThumb',
    features: ['Complete Kit', 'Easy Care', 'Decorative'],
  },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentProducts, setCurrentProducts] = useState(sampleProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  
  // Mobile optimizations
  const mobileOptimizations = useMobileOptimizations();
  const haptics = useHapticFeedback();

  // Check authentication status
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    setIsAuthenticated(!!token);
    
    // Auto-hide welcome after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle swipe action
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const currentProduct = currentProducts[currentIndex];
    setSwipeCount(prev => prev + 1);
    
    // Enhanced haptic feedback for mobile
    if (mobileOptimizations.isMobile) {
      if (direction === 'right') {
        haptics.mediumTap();
      } else if (direction === 'up') {
        haptics.doubleTap();
      } else {
        haptics.lightTap();
      }
    }
    
    // Show feedback based on swipe direction
    if (direction === 'right') {
      toast.success(`❤️ Added ${currentProduct.title} to your likes!`);
    } else if (direction === 'up') {
      toast.success(`⚡ Super liked ${currentProduct.title}!`);
    } else {
      toast(`👍 Thanks for the feedback!`);
    }
    
    // Move to next product
    setTimeout(() => {
      if (currentIndex < currentProducts.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Session complete
        handleSessionComplete();
      }
    }, 300);
  };

  // Handle session completion
  const handleSessionComplete = () => {
    toast.success('🎉 Great job! Your session is complete.');
    
    if (isAuthenticated) {
      // Redirect to recommendations page
      router.push('/dashboard/recommendations');
    } else {
      // Encourage sign up
      toast.success('Sign up to save your preferences and get personalized recommendations!');
      setTimeout(() => {
        router.push('/auth/register?redirect=/dashboard/recommendations');
      }, 2000);
    }
  };

  // Handle recommendations ready
  const handleRecommendationsReady = () => {
    if (isAuthenticated) {
      toast.success('New recommendations available! Check your dashboard.');
    } else {
      toast.success('Sign up to get personalized recommendations based on your swipes!');
    }
  };

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading GiftSync...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Discover Gifts - GiftSync</title>
        <meta
          name="description"
          content="Discover amazing gifts by swiping through our curated collection. Train our AI to understand your preferences and get personalized recommendations."
        />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Back */}
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">GiftSync</span>
                </div>
              </div>

              {/* Auth Actions */}
              <div className="flex items-center gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Overlay */}
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowWelcome(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 m-6 max-w-md text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-primary-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Gift Discovery!
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Swipe through products to help our AI learn your preferences. 
                Like what you see? Swipe right. Not your style? Swipe left.
              </p>

              <div className="space-y-3 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    →
                  </span>
                  <span>Swipe right to like</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    ←
                  </span>
                  <span>Swipe left to dislike</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    ↑
                  </span>
                  <span>Swipe up to super like</span>
                </div>
              </div>

              <button
                onClick={() => setShowWelcome(false)}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start Discovering
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Guest Notice */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border-b border-amber-200 px-6 py-3"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">
                    You're browsing as a guest. <Link href="/auth/register" className="font-medium underline">Sign up</Link> to save your preferences and get personalized recommendations.
                  </span>
                </div>
                <button
                  onClick={() => {
                    const element = document.querySelector('[data-guest-notice]');
                    if (element) element.remove();
                  }}
                  className="text-amber-600 hover:text-amber-800"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}

          {/* Swipe Interface */}
          <div className="flex-1">
            <SwipeInterface
              sessionType="discovery"
              onSessionComplete={handleSessionComplete}
              onRecommendationsReady={handleRecommendationsReady}
              className="h-full"
            />
          </div>
        </div>

        {/* Bottom Navigation Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4"
        >
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-gray-600">
              Use keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd> dislike, 
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs mx-1">→</kbd> like, 
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑</kbd> super like, 
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">space</kbd> view product
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Settings, Info, Zap, Gift } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import { Product, SwipeGesture, SwipeSession, SwipeState } from '@/types';
import { api } from '@/lib/api';
import { appConfig } from '@/config';
import toast from 'react-hot-toast';

interface SwipeInterfaceProps {
  sessionType?: 'onboarding' | 'discovery' | 'category_exploration' | 'gift_selection';
  categoryFocus?: string;
  targetRecipient?: string;
  onSessionComplete?: (session: SwipeSession) => void;
  onRecommendationsReady?: () => void;
  className?: string;
}

export const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
  sessionType = 'discovery',
  categoryFocus,
  targetRecipient,
  onSessionComplete,
  onRecommendationsReady,
  className = '',
}) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    cards: [],
    currentIndex: 0,
    isLoading: true,
    hasMore: true,
    sessionId: null,
    swipeCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  });

  const [session, setSession] = useState<SwipeSession | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const sessionStartTime = useRef<number>(Date.now());
  const lastSwipeTime = useRef<number>(Date.now());

  // Initialize swipe session
  const initializeSession = useCallback(async () => {
    try {
      setSwipeState(prev => ({ ...prev, isLoading: true }));

      const sessionData = {
        session_type: sessionType,
        category_focus: categoryFocus,
        target_recipient: targetRecipient,
        context: {
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          started_at: new Date().toISOString(),
        }
      };

      const response = await api.createSwipeSession(sessionData);
      const newSession = response.data;

      setSession(newSession);
      setSwipeState(prev => ({
        ...prev,
        sessionId: newSession.id,
      }));

      sessionStartTime.current = Date.now();
      await loadMoreProducts(newSession.id);
    } catch (error) {
      console.error('Failed to initialize swipe session:', error);
      toast.error('Failed to start swipe session. Please try again.');
    }
  }, [sessionType, categoryFocus, targetRecipient]);

  // Load more products for swiping
  const loadMoreProducts = useCallback(async (sessionId: string) => {
    try {
      const params = {
        limit: appConfig.swipe.cardPreloadCount,
        exclude_seen: true,
        session_id: sessionId,
      };

      if (categoryFocus) {
        params.category = categoryFocus;
      }

      const response = await api.getProducts(params);
      const products = response.data;

      if (products.length === 0) {
        setSwipeState(prev => ({ ...prev, hasMore: false, isLoading: false }));
        return;
      }

      const newCards = products.map((product: Product, index: number) => ({
        id: product.id,
        product,
        position: swipeState.cards.length + index,
        isVisible: true,
        isAnimating: false,
      }));

      setSwipeState(prev => ({
        ...prev,
        cards: [...prev.cards, ...newCards],
        isLoading: false,
        hasMore: products.length === appConfig.swipe.cardPreloadCount,
      }));
    } catch (error) {
      console.error('Failed to load products:', error);
      setSwipeState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to load products. Please try again.');
    }
  }, [categoryFocus, swipeState.cards.length]);

  // Handle swipe action
  const handleSwipe = useCallback(async (direction: 'left' | 'right' | 'up' | 'down', gesture: SwipeGesture) => {
    if (!session || swipeState.currentIndex >= swipeState.cards.length) {
      return;
    }

    const currentCard = swipeState.cards[swipeState.currentIndex];
    const currentTime = Date.now();
    const timeSinceLastSwipe = currentTime - lastSwipeTime.current;

    try {
      // Record the swipe interaction
      const swipeData = {
        product_id: currentCard.product.id,
        direction,
        content_type: 'product' as const,
        session_context: {
          gesture,
          timing_ms: timeSinceLastSwipe,
          card_position: swipeState.currentIndex,
          session_duration: currentTime - sessionStartTime.current,
        }
      };

      await api.recordSwipe(session.id, swipeData);

      // Update local state
      const newSwipeCount = swipeState.swipeCount + 1;
      const newLikeCount = swipeState.likeCount + (direction === 'right' || direction === 'up' ? 1 : 0);
      const newDislikeCount = swipeState.dislikeCount + (direction === 'left' || direction === 'down' ? 1 : 0);

      setSwipeState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        swipeCount: newSwipeCount,
        likeCount: newLikeCount,
        dislikeCount: newDislikeCount,
      }));

      lastSwipeTime.current = currentTime;

      // Show progress after 10 swipes
      if (newSwipeCount >= 10 && !showProgress) {
        setShowProgress(true);
      }

      // Check if we need to load more cards
      const remainingCards = swipeState.cards.length - swipeState.currentIndex - 1;
      if (remainingCards <= 2 && swipeState.hasMore && !swipeState.isLoading) {
        await loadMoreProducts(session.id);
      }

      // Check if session is complete
      if (newSwipeCount >= appConfig.swipe.maxSwipesPerSession || remainingCards === 0) {
        await completeSession(newSwipeCount, newLikeCount, newDislikeCount);
      }

      // Generate recommendations after sufficient swipes
      if (newSwipeCount >= 10 && newSwipeCount % 10 === 0) {
        if (onRecommendationsReady) {
          onRecommendationsReady();
        }
        toast.success('New recommendations are ready!');
      }

      // Provide haptic feedback (if supported)
      if ('vibrate' in navigator) {
        navigator.vibrate(direction === 'right' || direction === 'up' ? 50 : 100);
      }

    } catch (error) {
      console.error('Failed to record swipe:', error);
      toast.error('Failed to record swipe. Please try again.');
    }
  }, [session, swipeState, showProgress, onRecommendationsReady, loadMoreProducts]);

  // Complete the session
  const completeSession = useCallback(async (
    finalSwipeCount: number,
    finalLikeCount: number,
    finalDislikeCount: number
  ) => {
    if (!session) return;

    try {
      const sessionDuration = Date.now() - sessionStartTime.current;
      
      // The session completion is handled by the backend
      // We just need to notify our parent component
      const completedSession: SwipeSession = {
        ...session,
        is_completed: true,
        completed_at: new Date().toISOString(),
        swipe_count: finalSwipeCount,
        like_count: finalLikeCount,
        dislike_count: finalDislikeCount,
        session_duration: sessionDuration,
      };

      if (onSessionComplete) {
        onSessionComplete(completedSession);
      }

      toast.success('Swipe session completed! Generating your recommendations...');
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  }, [session, onSessionComplete]);

  // Handle product click (open product details)
  const handleProductClick = useCallback((product: Product) => {
    // Track product view
    api.trackEvent({
      event_name: 'product_viewed',
      properties: {
        product_id: product.id,
        product_name: product.name,
        source: 'swipe_interface',
        session_id: session?.id,
      }
    });

    // Open product in new tab
    window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
  }, [session]);

  // Reset session
  const resetSession = useCallback(async () => {
    setSwipeState({
      cards: [],
      currentIndex: 0,
      isLoading: true,
      hasMore: true,
      sessionId: null,
      swipeCount: 0,
      likeCount: 0,
      dislikeCount: 0,
    });
    setSession(null);
    setShowProgress(false);
    await initializeSession();
  }, [initializeSession]);

  // Initialize on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (swipeState.currentIndex >= swipeState.cards.length) return;

      const gesture: SwipeGesture = {
        direction: 'right',
        velocity: 1,
        distance: 200,
        duration: 100,
        startPosition: { x: 0, y: 0 },
        endPosition: { x: 0, y: 0 },
      };

      switch (event.key) {
        case 'ArrowLeft':
        case 'X':
        case 'x':
          event.preventDefault();
          handleSwipe('left', { ...gesture, direction: 'left', endPosition: { x: -200, y: 0 } });
          break;
        case 'ArrowRight':
        case 'L':
        case 'l':
          event.preventDefault();
          handleSwipe('right', { ...gesture, direction: 'right', endPosition: { x: 200, y: 0 } });
          break;
        case 'ArrowUp':
        case 'S':
        case 's':
          event.preventDefault();
          handleSwipe('up', { ...gesture, direction: 'up', endPosition: { x: 0, y: -200 } });
          break;
        case ' ':
          event.preventDefault();
          const currentCard = swipeState.cards[swipeState.currentIndex];
          if (currentCard) {
            handleProductClick(currentCard.product);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSwipe, handleProductClick, swipeState.currentIndex, swipeState.cards]);

  const currentCard = swipeState.cards[swipeState.currentIndex];
  const nextCards = swipeState.cards.slice(swipeState.currentIndex + 1, swipeState.currentIndex + 4);
  const progress = Math.min((swipeState.swipeCount / appConfig.swipe.maxSwipesPerSession) * 100, 100);

  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-primary-600" />
          <div>
            <h2 className="font-semibold text-gray-900">
              {sessionType === 'onboarding' && 'Tell us what you like'}
              {sessionType === 'discovery' && 'Discover products'}
              {sessionType === 'category_exploration' && `Explore ${categoryFocus}`}
              {sessionType === 'gift_selection' && `Gifts for ${targetRecipient}`}
            </h2>
            {showProgress && (
              <p className="text-sm text-gray-600">
                {swipeState.swipeCount} swipes • {swipeState.likeCount} likes
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetSession}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            title="Reset session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{swipeState.swipeCount} swipes</span>
            <span>{appConfig.swipe.maxSwipesPerSession} max</span>
          </div>
        </div>
      )}

      {/* Swipe Area */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        {swipeState.isLoading && swipeState.cards.length === 0 ? (
          // Loading state
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : currentCard ? (
          // Swipe cards
          <div className="absolute inset-4">
            {/* Background cards */}
            {nextCards.map((card, index) => (
              <SwipeCard
                key={card.id}
                product={card.product}
                index={index + 1}
                isActive={false}
                onSwipe={() => {}}
                onProductClick={handleProductClick}
                className="pointer-events-none"
              />
            ))}

            {/* Active card */}
            <SwipeCard
              key={currentCard.id}
              product={currentCard.product}
              index={0}
              isActive={true}
              onSwipe={handleSwipe}
              onProductClick={handleProductClick}
            />
          </div>
        ) : (
          // No more cards
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <Zap className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Session Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Great job! We've learned about your preferences. Your personalized recommendations are being generated.
              </p>
              <motion.button
                onClick={resetSession}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start New Session
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {swipeState.swipeCount < 5 && currentCard && (
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4" />
            <span className="font-medium">How to swipe</span>
          </div>
          <p>← Dislike • ↑ Super like • → Like</p>
          <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
        </motion.div>
      )}
    </div>
  );
};

export default SwipeInterface;
import React, { useState, useEffect } from 'react';
import { Gift, RotateCcw } from 'lucide-react';

interface WorkingSwipeInterfaceProps {
  sessionType?: string;
  onSessionComplete?: (session: any) => void;
  onRecommendationsReady?: () => void;
  className?: string;
}

export const WorkingSwipeInterface: React.FC<WorkingSwipeInterfaceProps> = ({
  sessionType = 'discovery',
  onSessionComplete,
  onRecommendationsReady,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock product data
  const mockProducts = [
    {
      id: '1',
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium noise-cancelling headphones with 30-hour battery life',
      price: 79.99,
      currency: 'GBP',
      image_url: 'https://picsum.photos/400/300?random=1',
      brand: 'AudioTech'
    },
    {
      id: '2',
      title: 'Smart Fitness Watch',
      description: 'Advanced smartwatch with health monitoring features',
      price: 199.99,
      currency: 'GBP',
      image_url: 'https://picsum.photos/400/300?random=2',
      brand: 'FitTech'
    },
    {
      id: '3',
      title: 'Coffee Bean Gift Set',
      description: 'Premium coffee beans from around the world',
      price: 45.00,
      currency: 'GBP',
      image_url: 'https://picsum.photos/400/300?random=3',
      brand: 'RoastMaster'
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentProduct = products[currentIndex];
    console.log(`Swiped ${direction} on:`, currentProduct?.title);
    
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete
      console.log('Session completed!');
      if (onSessionComplete) {
        onSessionComplete({ completed: true });
      }
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
  };

  const currentProduct = products[currentIndex];

  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-primary-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Discover Products</h2>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} of {products.length}
            </p>
          </div>
        </div>
        <button
          onClick={resetSession}
          className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
          title="Reset session"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 min-h-96">
        {isLoading ? (
          // Loading state
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : currentProduct ? (
          // Product card
          <div className="absolute inset-4">
            <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Product Image */}
              <div className="relative w-full h-2/3">
                <img
                  src={currentProduct.image_url}
                  alt={currentProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Product Information */}
              <div className="p-6 h-1/3 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {currentProduct.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{currentProduct.brand}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {currentProduct.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xl font-bold text-gray-900">
                      £{currentProduct.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="w-12 h-12 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <span className="text-2xl group-hover:text-red-500">✕</span>
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className="w-12 h-12 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <span className="text-2xl group-hover:text-green-500">♥</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Session complete
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Session Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Great job! We've learned about your preferences.
              </p>
              <button
                onClick={resetSession}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start New Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {currentProduct && currentIndex < 3 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs">
          <p>← Dislike • → Like</p>
          <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
        </div>
      )}
    </div>
  );
};

export default WorkingSwipeInterface;
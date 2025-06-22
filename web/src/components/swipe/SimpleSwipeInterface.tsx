import React from 'react';

interface SimpleSwipeInterfaceProps {
  className?: string;
}

export const SimpleSwipeInterface: React.FC<SimpleSwipeInterfaceProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Simple Swipe Test</h2>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="absolute inset-4">
          <div className="w-full h-96 bg-white rounded-xl shadow-lg p-4 border">
            <h3 className="text-lg font-bold">Test Product</h3>
            <p className="text-gray-600">This is a test product to verify the interface works</p>
            <p className="text-primary-600 font-bold">£25.00</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-red-500 text-white rounded">
                Pass
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                Like
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSwipeInterface;
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  white: 'text-white',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} ${variantClasses[variant]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Sparkles className="w-full h-full" />
      </motion.div>
      
      {text && (
        <motion.p
          className={`text-sm font-medium ${variantClasses[variant]} ${text.includes('...') ? 'loading-dots' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="swipe-card w-full max-w-sm mx-auto h-[600px] bg-white rounded-3xl shadow-large overflow-hidden">
      <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <div className="absolute inset-0 shimmer" />
        <div className="absolute top-4 left-4">
          <div className="w-16 h-6 bg-gray-300 rounded-full shimmer" />
        </div>
        <div className="absolute top-4 right-4">
          <div className="w-12 h-6 bg-gray-300 rounded-full shimmer" />
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded shimmer" />
          <div className="h-4 bg-gray-200 rounded shimmer w-3/4" />
          <div className="h-4 bg-gray-200 rounded shimmer w-1/2" />
        </div>
        
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-gray-200 rounded-lg shimmer" />
          <div className="w-20 h-6 bg-gray-200 rounded-lg shimmer" />
          <div className="w-14 h-6 bg-gray-200 rounded-lg shimmer" />
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full shimmer" />
          <div className="w-12 h-12 bg-gray-200 rounded-full shimmer" />
          <div className="w-14 h-14 bg-gray-200 rounded-full shimmer" />
        </div>
      </div>
    </div>
  );
};

export const LoadingOverlay: React.FC<{ isVisible: boolean; text?: string }> = ({
  isVisible,
  text = 'Loading...',
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <LoadingSpinner size="lg" text={text} />
      </motion.div>
    </motion.div>
  );
};
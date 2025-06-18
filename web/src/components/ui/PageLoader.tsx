import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

interface PageLoaderProps {
  text?: string;
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  text = 'Loading GiftSync...',
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          className="relative mb-8"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow-lg">
            <Gift className="w-10 h-10 text-white" />
          </div>
          
          {/* Orbiting sparkles */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-primary-400" />
            <Sparkles className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 text-secondary-400" />
            <Sparkles className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-primary-400" />
            <Sparkles className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 text-secondary-400" />
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">GiftSync</h2>
          <p className="text-gray-600 loading-dots">{text}</p>
        </motion.div>

        {/* Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-2 justify-center mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const MiniLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} border-2 border-primary-200 border-t-primary-600 rounded-full`}
    />
  );
};
/**
 * GiftSync Loading Spinner UI Components
 * 
 * Provides animated loading indicators for the GiftSync application with
 * consistent styling and multiple variants. Includes specialized loading
 * states for different UI contexts and components.
 * 
 * Key Features:
 *   - Multiple sizes and color variants for different contexts
 *   - Animated sparkles icon with smooth rotation
 *   - Optional loading text with fade-in animation
 *   - Skeleton loading cards for swipe interface
 *   - Full-screen loading overlay with backdrop blur
 * 
 * Performance Considerations:
 *   - Uses Framer Motion for hardware-accelerated animations
 *   - CSS transforms for smooth 60fps rotation
 *   - Shimmer effects implemented with pure CSS
 *   - Minimal re-renders with React.memo potential
 * 
 * Usage Examples:
 *   - <LoadingSpinner size="lg" text="Loading products..." />
 *   - <LoadingCard /> for swipe interface placeholder
 *   - <LoadingOverlay isVisible={loading} text="Saving..." />
 * 
 * Design System Integration:
 *   - Follows GiftSync color palette and spacing
 *   - Consistent with overall animation timing (1s rotation)
 *   - Responsive sizing with Tailwind CSS classes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Props interface for the main LoadingSpinner component.
 * 
 * Provides flexible configuration options for different loading contexts
 * throughout the application. Size and variant options match the design
 * system for consistent user experience.
 */
interface LoadingSpinnerProps {
  /** Size variant affecting icon dimensions */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Color variant for different backgrounds and contexts */
  variant?: 'primary' | 'secondary' | 'white';
  
  /** Optional text displayed below the spinner */
  text?: string;
  
  /** Additional CSS classes for custom styling */
  className?: string;
}

// Size mapping for consistent dimensions across the application
const sizeClasses = {
  sm: 'w-4 h-4',     // Small inline spinners
  md: 'w-6 h-6',     // Default size for most contexts
  lg: 'w-8 h-8',     // Larger loading states
  xl: 'w-12 h-12',   // Hero/modal loading indicators
};

// Color variants for different UI contexts and backgrounds
const variantClasses = {
  primary: 'text-primary-600',     // Default brand color
  secondary: 'text-secondary-600', // Secondary brand color
  white: 'text-white',             // For dark backgrounds
};

/**
 * Main loading spinner component with animated sparkles icon.
 * 
 * Provides a consistent loading indicator across the GiftSync application
 * with smooth rotation animation and optional loading text. Uses hardware-
 * accelerated CSS transforms for optimal performance.
 * 
 * Animation Details:
 *   - 360-degree rotation with linear easing
 *   - 1-second duration with infinite repeat
 *   - Text fades in after 200ms delay for polish
 * 
 * @param size - Icon size variant (sm, md, lg, xl)
 * @param variant - Color variant for different contexts
 * @param text - Optional descriptive text below spinner
 * @param className - Additional CSS classes for customization
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Animated sparkles icon with smooth rotation */}
      <motion.div
        className={`${sizeClasses[size]} ${variantClasses[variant]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,           // 1-second full rotation
          repeat: Infinity,      // Continuous animation
          ease: 'linear',        // Smooth constant speed
        }}
      >
        <Sparkles className="w-full h-full" />
      </motion.div>
      
      {/* Optional loading text with fade-in animation */}
      {text && (
        <motion.p
          className={`text-sm font-medium ${variantClasses[variant]} ${text.includes('...') ? 'loading-dots' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}  // Delay for polished appearance
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

/**
 * Skeleton loading card component for swipe interface.
 * 
 * Provides a realistic placeholder that matches the actual product card
 * layout while content is loading. Uses shimmer animations to indicate
 * active loading state and maintain user engagement.
 * 
 * Design Features:
 *   - Matches exact dimensions of real product cards (600px height)
 *   - Shimmer effect on all placeholder elements
 *   - Gradient background for visual interest
 *   - Skeleton elements for image, title, description, and actions
 * 
 * Performance Benefits:
 *   - Prevents layout shift when real content loads
 *   - Maintains user engagement during loading
 *   - Provides visual feedback of loading progress
 * 
 * Usage Context:
 *   - Swipe interface while fetching product data
 *   - First-time app load before API responses
 *   - Network retry scenarios with cached layout
 */
export const LoadingCard: React.FC = () => {
  return (
    <div className="swipe-card w-full max-w-sm mx-auto h-[600px] bg-white rounded-3xl shadow-large overflow-hidden">
      {/* Product image placeholder with gradient background */}
      <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {/* Shimmer overlay for animated loading effect */}
        <div className="absolute inset-0 shimmer" />
        
        {/* Price tag placeholder */}
        <div className="absolute top-4 left-4">
          <div className="w-16 h-6 bg-gray-300 rounded-full shimmer" />
        </div>
        
        {/* Rating placeholder */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-6 bg-gray-300 rounded-full shimmer" />
        </div>
      </div>
      
      {/* Product information section */}
      <div className="p-6 space-y-4">
        {/* Title and description placeholders */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded shimmer" />          {/* Product title */}
          <div className="h-4 bg-gray-200 rounded shimmer w-3/4" />    {/* Description line 1 */}
          <div className="h-4 bg-gray-200 rounded shimmer w-1/2" />    {/* Description line 2 */}
        </div>
        
        {/* Feature tags/categories placeholders */}
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-gray-200 rounded-lg shimmer" />
          <div className="w-20 h-6 bg-gray-200 rounded-lg shimmer" />
          <div className="w-14 h-6 bg-gray-200 rounded-lg shimmer" />
        </div>
      </div>
      
      {/* Swipe action buttons placeholder */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full shimmer" />  {/* Dislike button */}
          <div className="w-12 h-12 bg-gray-200 rounded-full shimmer" />  {/* Info button */}
          <div className="w-14 h-14 bg-gray-200 rounded-full shimmer" />  {/* Like button */}
        </div>
      </div>
    </div>
  );
};

/**
 * Full-screen loading overlay component with backdrop blur.
 * 
 * Provides a modal-style loading indicator that covers the entire viewport
 * during critical operations. Uses backdrop blur and smooth animations
 * for a polished user experience.
 * 
 * Design Features:
 *   - Semi-transparent black backdrop (50% opacity)
 *   - Backdrop blur effect for modern appearance
 *   - Centered white card with large spinner
 *   - Smooth scale and opacity animations
 * 
 * Animation Sequence:
 *   - Backdrop fades in from transparent
 *   - Card scales up from 90% to 100% with fade-in
 *   - Exit animations reverse the sequence
 * 
 * Usage Context:
 *   - Critical operations (user registration, data sync)
 *   - Modal forms with server submission
 *   - App-wide loading states
 * 
 * @param isVisible - Controls overlay visibility
 * @param text - Loading message displayed below spinner
 */
export const LoadingOverlay: React.FC<{ isVisible: boolean; text?: string }> = ({
  isVisible,
  text = 'Loading...',
}) => {
  // Early return if overlay not visible (prevents unnecessary rendering)
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Centered loading card with smooth scale animation */}
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
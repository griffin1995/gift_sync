/**
 * QuizProgress - Progress Indicator Component
 * 
 * Displays quiz completion progress with confidence level and visual indicators.
 * Provides users with clear feedback on their progress through the quiz.
 * 
 * Features:
 * - Animated progress bar
 * - Confidence level indicator
 * - Question counter
 * - Responsive design
 * - Loading states
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface QuizProgressData {
  session_id: string;
  questions_answered: number;
  estimated_total: number;
  confidence_level: number;
  completion_percentage: number;
}

interface QuizProgressProps {
  progress: QuizProgressData;
  isLoading?: boolean;
  showDetails?: boolean;
  className?: string;
}

// =============================================================================
// PROGRESS COMPONENTS
// =============================================================================

const ProgressBar: React.FC<{
  percentage: number;
  isLoading: boolean;
}> = ({ percentage, isLoading }) => {
  return (
    <div className="progress-bar-container">
      <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
        <motion.div
          className="bg-blue-500 h-2 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-blue-600 opacity-50 animate-pulse" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const ConfidenceIndicator: React.FC<{
  confidenceLevel: number;
  isLoading: boolean;
}> = ({ confidenceLevel, isLoading }) => {
  const getConfidenceColor = (level: number) => {
    if (level >= 0.8) return 'text-green-600 bg-green-100';
    if (level >= 0.6) return 'text-blue-600 bg-blue-100';
    if (level >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getConfidenceLabel = (level: number) => {
    if (level >= 0.8) return 'High Confidence';
    if (level >= 0.6) return 'Good Confidence';
    if (level >= 0.4) return 'Building Confidence';
    return 'Gathering Information';
  };

  return (
    <div className={`confidence-indicator px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidenceLevel)}`}>
      {isLoading ? (
        <div className="flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        getConfidenceLabel(confidenceLevel)
      )}
    </div>
  );
};

const QuestionCounter: React.FC<{
  answered: number;
  total: number;
  isLoading: boolean;
}> = ({ answered, total, isLoading }) => {
  return (
    <div className="question-counter flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, index) => {
          const isAnswered = index < answered;
          const isCurrent = index === answered && isLoading;
          
          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {isAnswered ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300" />
              )}
            </motion.div>
          );
        })}
      </div>
      
      <span className="text-sm text-gray-600 ml-2">
        {answered} of {total} questions
      </span>
    </div>
  );
};

// =============================================================================
// MAIN PROGRESS COMPONENT
// =============================================================================

export const QuizProgress: React.FC<QuizProgressProps> = ({
  progress,
  isLoading = false,
  showDetails = true,
  className = ''
}) => {
  const {
    questions_answered,
    estimated_total,
    confidence_level,
    completion_percentage
  } = progress;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`quiz-progress bg-white p-4 rounded-lg border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Quiz Progress</h3>
        <ConfidenceIndicator 
          confidenceLevel={confidence_level}
          isLoading={isLoading}
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {completion_percentage.toFixed(0)}% Complete
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(confidence_level * 100)}% confidence
          </span>
        </div>
        <ProgressBar 
          percentage={completion_percentage}
          isLoading={isLoading}
        />
      </div>

      {/* Question Counter */}
      {showDetails && (
        <QuestionCounter
          answered={questions_answered}
          total={estimated_total}
          isLoading={isLoading}
        />
      )}

      {/* Additional Info */}
      {showDetails && confidence_level >= 0.8 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800 font-medium">
              Ready for recommendations!
            </span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            We have enough information to generate excellent gift suggestions.
          </p>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-2 text-sm text-gray-600"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing your response...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizProgress;
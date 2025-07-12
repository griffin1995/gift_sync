/**
 * QuizFlow - Main Quiz Orchestration Component
 * 
 * Manages the complete quiz experience from start to completion.
 * Implements the adaptive questioning logic and recommendation generation
 * designed in the quiz system architecture.
 * 
 * Features:
 * - Progressive question presentation
 * - Real-time progress tracking
 * - Adaptive question selection
 * - Recommendation generation
 * - Anonymous and authenticated support
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { QuestionRenderer } from './QuestionRenderer';
import { QuizProgress } from './QuizProgress';
import { QuizComplete } from './QuizComplete';
import { useAPI } from '@/hooks/useAPI';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'range' | 'boolean' | 'scale' | 'text';
  category?: string;
  subcategory?: string;
  options?: any;
  min_value?: number;
  max_value?: number;
  weight: number;
  order_sequence: number;
}

interface QuizProgressData {
  session_id: string;
  questions_answered: number;
  estimated_total: number;
  confidence_level: number;
  completion_percentage: number;
  current_question?: QuizQuestion;
}

interface QuizRecommendation {
  product_id: string;
  confidence_score: number;
  reasoning: string;
  quiz_factors: Record<string, any>;
  rank_position: number;
}

interface QuizFlowProps {
  onComplete?: (recommendations: QuizRecommendation[]) => void;
  onProgress?: (progress: QuizProgressData) => void;
  className?: string;
  anonymous?: boolean;
}

// =============================================================================
// QUIZ FLOW COMPONENT
// =============================================================================

export const QuizFlow: React.FC<QuizFlowProps> = ({
  onComplete,
  onProgress,
  className = '',
  anonymous = true
}) => {
  // State management
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [progress, setProgress] = useState<QuizProgressData | null>(null);
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const api = useAPI();

  // =============================================================================
  // QUIZ SESSION MANAGEMENT
  // =============================================================================

  const startQuiz = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.startQuiz({
        user_context: { source: 'web_app' },
        anonymous
      });

      const session = response.data;
      setSessionId(session.session_id);
      setProgress(session.progress);
      setCurrentQuestion(session.progress.current_question);

      if (onProgress) {
        onProgress(session.progress);
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start quiz');
      console.error('Quiz start error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextQuestion = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/api/v1/quiz/questions/${sessionId}/next`);
      
      // Handle case where response is successful but data is null (quiz complete)
      if (!response || !response.data) {
        // Quiz complete - generate recommendations
        await completeQuiz();
        return;
      }
      
      const question = response.data;
      if (question) {
        setCurrentQuestion(question);
      } else {
        // Quiz complete - generate recommendations
        await completeQuiz();
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get next question');
      console.error('Next question error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async (answer: any) => {
    if (!sessionId || !currentQuestion) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.submitQuizResponse({
        session_id: sessionId,
        question_id: currentQuestion.id,
        response_value: typeof answer === 'object' ? JSON.stringify(answer) : String(answer),
        response_metadata: {
          timestamp: new Date().toISOString(),
          question_type: currentQuestion.question_type
        }
      });

      const result = response.data;
      setProgress(result.progress);

      if (onProgress) {
        onProgress(result.progress);
      }

      // Get next question
      await getNextQuestion();

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit response');
      console.error('Response submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const completeQuiz = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await api.completeQuiz({ session_id: sessionId });
      const quizRecommendations = response.data;
      
      setRecommendations(quizRecommendations);
      setIsComplete(true);
      setCurrentQuestion(null);

      if (onComplete) {
        onComplete(quizRecommendations);
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete quiz');
      console.error('Quiz completion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    startQuiz();
  }, []);

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  if (error) {
    return (
      <div className={`quiz-flow quiz-error ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 text-xl mb-4">⚠️ Quiz Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={startQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDER LOGIC
  // =============================================================================

  return (
    <div className={`quiz-flow ${className}`}>
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {isLoading && !currentQuestion && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="quiz-loading"
          >
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-4 w-8 h-8 text-blue-500" />
              <p className="text-gray-600">Preparing your personalised quiz...</p>
            </div>
          </motion.div>
        )}

        {/* Quiz Complete State */}
        {isComplete && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="quiz-complete"
          >
            <QuizComplete 
              recommendations={recommendations}
              onRestart={startQuiz}
            />
          </motion.div>
        )}

        {/* Active Quiz State */}
        {!isComplete && currentQuestion && progress && (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="quiz-active"
          >
            {/* Progress Header */}
            <div className="mb-6">
              <QuizProgress 
                progress={progress}
                isLoading={isLoading}
              />
            </div>

            {/* Question Content */}
            <div className="quiz-question-container">
              <QuestionRenderer
                question={currentQuestion}
                onAnswer={submitResponse}
                isLoading={isLoading}
                questionNumber={progress.questions_answered + 1}
                totalQuestions={progress.estimated_total}
              />
            </div>

            {/* Skip Option */}
            {currentQuestion.category !== 'essential' && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => submitResponse('skip')}
                  disabled={isLoading}
                  className="text-gray-500 hover:text-gray-700 text-sm underline disabled:opacity-50"
                >
                  Skip this question
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === 'development' && progress && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
          <div className="font-semibold mb-2">Debug Info:</div>
          <div>Session: {sessionId?.slice(0, 8)}...</div>
          <div>Questions: {progress.questions_answered}/{progress.estimated_total}</div>
          <div>Confidence: {(progress.confidence_level * 100).toFixed(1)}%</div>
          <div>Current Question: {currentQuestion?.id || 'None'}</div>
        </div>
      )}
    </div>
  );
};

export default QuizFlow;
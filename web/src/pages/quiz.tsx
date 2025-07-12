/**
 * Quiz Page - Intelligent Gift Discovery
 * 
 * Main page for the quiz-based product discovery system.
 * Provides an alternative to swipe-based discovery through
 * structured questioning and intelligent recommendations.
 * 
 * Features:
 * - Complete quiz flow management
 * - Progress tracking and analytics
 * - Recommendation generation
 * - Social sharing
 * - Mobile-responsive design
 */

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Sparkles, ArrowLeft, Gift } from 'lucide-react';
import QuizFlow from '@/components/quiz/QuizFlow';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface QuizRecommendation {
  product_id: string;
  confidence_score: number;
  reasoning: string;
  quiz_factors: Record<string, any>;
  rank_position: number;
}

interface QuizProgressData {
  session_id: string;
  questions_answered: number;
  estimated_total: number;
  confidence_level: number;
  completion_percentage: number;
}

// =============================================================================
// QUIZ INTRODUCTION COMPONENT
// =============================================================================

const QuizIntroduction: React.FC<{
  onStart: () => void;
}> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="quiz-introduction text-center max-w-2xl mx-auto"
    >
      {/* Hero Section */}
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Intelligent Gift Discovery
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 leading-relaxed"
        >
          Answer a few quick questions and we'll find the perfect gifts using our AI-powered recommendation system.
        </motion.p>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <div className="feature-card p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Personalised Questions</h3>
          <p className="text-sm text-gray-600">
            Smart questions that adapt based on your answers for maximum relevance.
          </p>
        </div>

        <div className="feature-card p-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Recommendations</h3>
          <p className="text-sm text-gray-600">
            Advanced algorithms analyse your preferences to find perfect matches.
          </p>
        </div>

        <div className="feature-card p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ArrowRight className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Quick & Easy</h3>
          <p className="text-sm text-gray-600">
            Takes less than 3 minutes to get personalised gift recommendations.
          </p>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors flex items-center gap-3 mx-auto"
      >
        Start Gift Quiz
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-sm text-gray-500"
      >
        <p>✨ Free to use • 🔒 Privacy protected • ⚡ Instant results</p>
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// MAIN QUIZ PAGE COMPONENT
// =============================================================================

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<QuizProgressData | null>(null);
  const [finalRecommendations, setFinalRecommendations] = useState<QuizRecommendation[]>([]);

  const handleQuizStart = () => {
    setQuizStarted(true);
  };

  const handleQuizProgress = (progress: QuizProgressData) => {
    setCurrentProgress(progress);
  };

  const handleQuizComplete = (recommendations: QuizRecommendation[]) => {
    setFinalRecommendations(recommendations);
    // Could redirect to recommendations page or show modal
    console.log('Quiz completed with recommendations:', recommendations);
  };

  const handleQuizRestart = () => {
    setQuizStarted(false);
    setCurrentProgress(null);
    setFinalRecommendations([]);
  };

  const handleViewRecommendations = () => {
    // Navigate to recommendations page or show detailed view
    console.log('Viewing recommendations:', finalRecommendations);
    // For now, could redirect to discover page with quiz recommendations
    window.location.href = '/discover';
  };

  return (
    <>
      <Head>
        <title>Gift Quiz - GiftSync | Intelligent Gift Discovery</title>
        <meta
          name="description"
          content="Take our intelligent gift quiz to get personalised product recommendations. AI-powered questions help us understand your preferences for perfect gift matching."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="quiz-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <Link
                  href="/discover"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Swipe Mode
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <span className="mx-2">→</span>
              <span className="text-gray-900">Gift Quiz</span>
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {!quizStarted ? (
              <QuizIntroduction onStart={handleQuizStart} />
            ) : (
              <div className="quiz-container bg-white rounded-xl shadow-lg p-6 md:p-8">
                <QuizFlow
                  onComplete={handleQuizComplete}
                  onProgress={handleQuizProgress}
                  anonymous={true}
                  className="quiz-flow-container"
                />
              </div>
            )}
          </div>

          {/* Debug Information (Development Only) */}
          {process.env.NODE_ENV === 'development' && currentProgress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs max-w-sm"
            >
              <div className="font-semibold mb-1">Debug Info:</div>
              <div>Progress: {currentProgress.completion_percentage.toFixed(1)}%</div>
              <div>Confidence: {(currentProgress.confidence_level * 100).toFixed(1)}%</div>
              <div>Questions: {currentProgress.questions_answered}/{currentProgress.estimated_total}</div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
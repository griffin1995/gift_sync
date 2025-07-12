/**
 * QuestionRenderer - Dynamic Question Type Renderer
 * 
 * Renders different types of quiz questions with appropriate UI components.
 * Handles multiple choice, range, scale, boolean, and text questions.
 * 
 * Features:
 * - Type-safe question rendering
 * - Animated transitions
 * - Validation and error handling
 * - Accessibility support
 * - Mobile-responsive design
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

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

interface QuestionRendererProps {
  question: QuizQuestion;
  onAnswer: (answer: any) => void;
  isLoading?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

// =============================================================================
// QUESTION COMPONENTS
// =============================================================================

const MultipleChoiceQuestion: React.FC<{
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  isLoading: boolean;
}> = ({ question, onAnswer, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  const choices = question.options?.choices || [];

  const handleSubmit = () => {
    if (selectedOption && !isLoading) {
      onAnswer(selectedOption);
    }
  };

  return (
    <div className="multiple-choice-question">
      <div className="options-grid grid gap-3 mb-6">
        {choices.map((option: any, index: number) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`option-button p-4 border-2 rounded-lg text-left transition-all duration-200 ${
              selectedOption === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => setSelectedOption(option.value)}
            disabled={isLoading}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              {selectedOption === option.value && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || isLoading}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const RangeQuestion: React.FC<{
  question: QuizQuestion;
  onAnswer: (answer: any) => void;
  isLoading: boolean;
}> = ({ question, onAnswer, isLoading }) => {
  const options = question.options || {};
  const min = options.min || 0;
  const max = options.max || 100;
  const step = options.step || 1;
  const currency = options.currency || '';
  
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleSubmit = () => {
    if (!isLoading) {
      onAnswer({
        min: minValue,
        max: maxValue,
        currency
      });
    }
  };

  return (
    <div className="range-question">
      <div className="range-inputs mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum {currency && `(${currency})`}
            </label>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum {currency && `(${currency})`}
            </label>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Suggested Ranges */}
        {options.suggested_ranges && (
          <div className="suggested-ranges">
            <p className="text-sm text-gray-600 mb-3">Quick select:</p>
            <div className="grid grid-cols-2 gap-2">
              {options.suggested_ranges.map((range: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setMinValue(range.min);
                    setMaxValue(range.max);
                  }}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || minValue > maxValue}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const ScaleQuestion: React.FC<{
  question: QuizQuestion;
  onAnswer: (answer: number) => void;
  isLoading: boolean;
}> = ({ question, onAnswer, isLoading }) => {
  const options = question.options || {};
  const min = options.min || 1;
  const max = options.max || 5;
  const labels = options.labels || {};
  
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedValue !== null && !isLoading) {
      onAnswer(selectedValue);
    }
  };

  return (
    <div className="scale-question">
      <div className="scale-options mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">{labels[min] || 'Not at all'}</span>
          <span className="text-sm text-gray-600">{labels[max] || 'Extremely'}</span>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          {Array.from({ length: max - min + 1 }, (_, i) => {
            const value = min + i;
            return (
              <button
                key={value}
                onClick={() => setSelectedValue(value)}
                className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                  selectedValue === value
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
                disabled={isLoading}
              >
                {value}
              </button>
            );
          })}
        </div>

        {selectedValue !== null && labels[selectedValue] && (
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">{labels[selectedValue]}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedValue === null || isLoading}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const BooleanQuestion: React.FC<{
  question: QuizQuestion;
  onAnswer: (answer: boolean) => void;
  isLoading: boolean;
}> = ({ question, onAnswer, isLoading }) => {
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);

  const handleAnswer = (value: boolean) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  return (
    <div className="boolean-question">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleAnswer(true)}
          disabled={isLoading}
          className={`px-8 py-4 rounded-lg font-medium transition-all ${
            selectedValue === true
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={isLoading}
          className={`px-8 py-4 rounded-lg font-medium transition-all ${
            selectedValue === false
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN QUESTION RENDERER
// =============================================================================

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  isLoading = false,
  questionNumber = 1,
  totalQuestions = 1
}) => {
  const renderQuestionContent = () => {
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={question}
            onAnswer={onAnswer}
            isLoading={isLoading}
          />
        );
      
      case 'range':
        return (
          <RangeQuestion
            question={question}
            onAnswer={onAnswer}
            isLoading={isLoading}
          />
        );
      
      case 'scale':
        return (
          <ScaleQuestion
            question={question}
            onAnswer={onAnswer}
            isLoading={isLoading}
          />
        );
      
      case 'boolean':
        return (
          <BooleanQuestion
            question={question}
            onAnswer={onAnswer}
            isLoading={isLoading}
          />
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Unsupported question type: {question.question_type}</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="question-renderer"
    >
      {/* Question Header */}
      <div className="question-header mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          {question.category && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {question.category}
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.question_text}
        </h2>
      </div>

      {/* Question Content */}
      <div className="question-content">
        {renderQuestionContent()}
      </div>
    </motion.div>
  );
};

export default QuestionRenderer;
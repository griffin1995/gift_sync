/**
 * QuizProgress Component Tests
 * 
 * Test suite for the QuizProgress component including:
 * - Progress bar rendering
 * - Confidence indicator display
 * - Question counter functionality
 * - Loading states
 * - High confidence notifications
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import QuizProgress from '../QuizProgress';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <span data-testid="check-circle">✓</span>,
  Circle: () => <span data-testid="circle">○</span>,
  Loader2: () => <span data-testid="loader">⏳</span>,
}));

describe('QuizProgress Component', () => {
  const baseProgress = {
    session_id: 'test-session-123',
    questions_answered: 2,
    estimated_total: 5,
    confidence_level: 0.6,
    completion_percentage: 40.0,
  };

  // =============================================================================
  // BASIC RENDERING TESTS
  // =============================================================================

  test('renders progress information correctly', () => {
    render(<QuizProgress progress={baseProgress} />);

    // Should display progress header
    expect(screen.getByText('Quiz Progress')).toBeInTheDocument();

    // Should display completion percentage
    expect(screen.getByText('40% Complete')).toBeInTheDocument();

    // Should display confidence percentage
    expect(screen.getByText('60% confidence')).toBeInTheDocument();

    // Should display question counter
    expect(screen.getByText('2 of 5 questions')).toBeInTheDocument();
  });

  test('renders without details when showDetails is false', () => {
    render(<QuizProgress progress={baseProgress} showDetails={false} />);

    // Should still show main progress info
    expect(screen.getByText('Quiz Progress')).toBeInTheDocument();
    expect(screen.getByText('40% Complete')).toBeInTheDocument();

    // Should not show question counter
    expect(screen.queryByText('2 of 5 questions')).not.toBeInTheDocument();
  });

  // =============================================================================
  // CONFIDENCE INDICATOR TESTS
  // =============================================================================

  describe('Confidence Indicator', () => {
    test('displays "High Confidence" for confidence >= 0.8', () => {
      const highConfidenceProgress = {
        ...baseProgress,
        confidence_level: 0.9,
      };

      render(<QuizProgress progress={highConfidenceProgress} />);

      expect(screen.getByText('High Confidence')).toBeInTheDocument();
    });

    test('displays "Good Confidence" for confidence >= 0.6', () => {
      const goodConfidenceProgress = {
        ...baseProgress,
        confidence_level: 0.7,
      };

      render(<QuizProgress progress={goodConfidenceProgress} />);

      expect(screen.getByText('Good Confidence')).toBeInTheDocument();
    });

    test('displays "Building Confidence" for confidence >= 0.4', () => {
      const buildingConfidenceProgress = {
        ...baseProgress,
        confidence_level: 0.5,
      };

      render(<QuizProgress progress={buildingConfidenceProgress} />);

      expect(screen.getByText('Building Confidence')).toBeInTheDocument();
    });

    test('displays "Gathering Information" for low confidence', () => {
      const lowConfidenceProgress = {
        ...baseProgress,
        confidence_level: 0.2,
      };

      render(<QuizProgress progress={lowConfidenceProgress} />);

      expect(screen.getByText('Gathering Information')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // LOADING STATE TESTS
  // =============================================================================

  test('displays loading state when isLoading is true', () => {
    render(<QuizProgress progress={baseProgress} isLoading={true} />);

    // Should show processing indicator
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Should show processing message
    expect(screen.getByText('Processing your response...')).toBeInTheDocument();
  });

  test('does not show loading indicators when not loading', () => {
    render(<QuizProgress progress={baseProgress} isLoading={false} />);

    // Should not show loading indicators
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  // =============================================================================
  // QUESTION COUNTER TESTS
  // =============================================================================

  describe('Question Counter', () => {
    test('displays correct number of answered and total questions', () => {
      render(<QuizProgress progress={baseProgress} />);

      // Should show 2 answered, 5 total
      expect(screen.getByText('2 of 5 questions')).toBeInTheDocument();

      // Should show 2 check circles (answered questions)
      const checkCircles = screen.getAllByTestId('check-circle');
      expect(checkCircles).toHaveLength(2);

      // Should show 3 empty circles (unanswered questions)
      const emptyCircles = screen.getAllByTestId('circle');
      expect(emptyCircles).toHaveLength(3);
    });

    test('shows loader for current question when loading', () => {
      render(<QuizProgress progress={baseProgress} isLoading={true} />);

      // Should show loader for the current question (position 3)
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('handles zero questions answered', () => {
      const zeroProgress = {
        ...baseProgress,
        questions_answered: 0,
      };

      render(<QuizProgress progress={zeroProgress} />);

      expect(screen.getByText('0 of 5 questions')).toBeInTheDocument();
      
      // All should be empty circles
      const emptyCircles = screen.getAllByTestId('circle');
      expect(emptyCircles).toHaveLength(5);
    });

    test('handles all questions answered', () => {
      const completeProgress = {
        ...baseProgress,
        questions_answered: 5,
        confidence_level: 1.0,
        completion_percentage: 100.0,
      };

      render(<QuizProgress progress={completeProgress} />);

      expect(screen.getByText('5 of 5 questions')).toBeInTheDocument();
      
      // All should be check circles
      const checkCircles = screen.getAllByTestId('check-circle');
      expect(checkCircles).toHaveLength(5);
    });
  });

  // =============================================================================
  // HIGH CONFIDENCE NOTIFICATION TESTS
  // =============================================================================

  test('displays ready notification for high confidence', () => {
    const highConfidenceProgress = {
      ...baseProgress,
      confidence_level: 0.85,
    };

    render(<QuizProgress progress={highConfidenceProgress} />);

    // Should show ready notification
    expect(screen.getByText('Ready for recommendations!')).toBeInTheDocument();
    expect(screen.getByText('We have enough information to generate excellent gift suggestions.')).toBeInTheDocument();
  });

  test('does not show ready notification for lower confidence', () => {
    const lowerConfidenceProgress = {
      ...baseProgress,
      confidence_level: 0.7,
    };

    render(<QuizProgress progress={lowerConfidenceProgress} />);

    // Should not show ready notification
    expect(screen.queryByText('Ready for recommendations!')).not.toBeInTheDocument();
  });

  // =============================================================================
  // PROGRESS BAR TESTS
  // =============================================================================

  describe('Progress Bar', () => {
    test('displays correct completion percentage', () => {
      render(<QuizProgress progress={baseProgress} />);

      // Progress bar should be set to 40% width
      const progressBar = screen.getByText('40% Complete').closest('div')?.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle('width: 40%');
    });

    test('handles 0% completion', () => {
      const zeroProgress = {
        ...baseProgress,
        questions_answered: 0,
        completion_percentage: 0.0,
      };

      render(<QuizProgress progress={zeroProgress} />);

      expect(screen.getByText('0% Complete')).toBeInTheDocument();
    });

    test('handles 100% completion', () => {
      const completeProgress = {
        ...baseProgress,
        questions_answered: 5,
        completion_percentage: 100.0,
      };

      render(<QuizProgress progress={completeProgress} />);

      expect(screen.getByText('100% Complete')).toBeInTheDocument();
    });

    test('shows pulse animation when loading', () => {
      render(<QuizProgress progress={baseProgress} isLoading={true} />);

      // Progress bar should have loading animation
      const progressBar = screen.getByText('40% Complete').closest('div')?.querySelector('[class*="animate-pulse"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  // =============================================================================
  // CUSTOM STYLING TESTS
  // =============================================================================

  test('applies custom className', () => {
    const { container } = render(
      <QuizProgress progress={baseProgress} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('Edge Cases', () => {
    test('handles fractional completion percentage', () => {
      const fractionalProgress = {
        ...baseProgress,
        completion_percentage: 33.3333,
      };

      render(<QuizProgress progress={fractionalProgress} />);

      expect(screen.getByText('33% Complete')).toBeInTheDocument();
    });

    test('handles fractional confidence level', () => {
      const fractionalProgress = {
        ...baseProgress,
        confidence_level: 0.666,
      };

      render(<QuizProgress progress={fractionalProgress} />);

      expect(screen.getByText('67% confidence')).toBeInTheDocument();
    });

    test('handles very large estimated_total', () => {
      const largeProgress = {
        ...baseProgress,
        estimated_total: 100,
        questions_answered: 10,
      };

      render(<QuizProgress progress={largeProgress} />);

      expect(screen.getByText('10 of 100 questions')).toBeInTheDocument();
    });
  });
});
/**
 * QuestionRenderer Component Tests
 * 
 * Test suite for the QuestionRenderer component including:
 * - Multiple choice question rendering
 * - Range question rendering
 * - Scale question rendering
 * - Boolean question rendering
 * - Answer submission handling
 * - Validation and error states
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import QuestionRenderer from '../QuestionRenderer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-icon">→</span>,
  CheckCircle: () => <span data-testid="check-icon">✓</span>,
}));

describe('QuestionRenderer Component', () => {
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // MULTIPLE CHOICE QUESTION TESTS
  // =============================================================================

  describe('Multiple Choice Questions', () => {
    const multipleChoiceQuestion = {
      id: 'relationship',
      question_text: "What's your relationship to the gift recipient?",
      question_type: 'multiple_choice' as const,
      category: 'essential',
      options: {
        choices: [
          { value: 'partner', label: 'Partner/Spouse' },
          { value: 'family', label: 'Family Member' },
          { value: 'friend', label: 'Close Friend' },
          { value: 'colleague', label: 'Colleague' }
        ]
      },
      weight: 2.0,
      order_sequence: 1
    };

    test('renders multiple choice question correctly', () => {
      render(
        <QuestionRenderer
          question={multipleChoiceQuestion}
          onAnswer={mockOnAnswer}
          questionNumber={1}
          totalQuestions={4}
        />
      );

      // Should display question text
      expect(screen.getByText("What's your relationship to the gift recipient?")).toBeInTheDocument();
      
      // Should display all options
      expect(screen.getByText('Partner/Spouse')).toBeInTheDocument();
      expect(screen.getByText('Family Member')).toBeInTheDocument();
      expect(screen.getByText('Close Friend')).toBeInTheDocument();
      expect(screen.getByText('Colleague')).toBeInTheDocument();

      // Should display question number
      expect(screen.getByText('Question 1 of 4')).toBeInTheDocument();

      // Should display category
      expect(screen.getByText('essential')).toBeInTheDocument();

      // Continue button should be disabled initially
      const continueButton = screen.getByText('Continue');
      expect(continueButton).toBeDisabled();
    });

    test('allows selecting an option and submitting', async () => {
      render(
        <QuestionRenderer
          question={multipleChoiceQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Select an option
      fireEvent.click(screen.getByText('Partner/Spouse'));

      // Continue button should now be enabled
      const continueButton = screen.getByText('Continue');
      expect(continueButton).not.toBeDisabled();

      // Check icon should appear for selected option
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();

      // Click continue to submit
      fireEvent.click(continueButton);

      expect(mockOnAnswer).toHaveBeenCalledWith('partner');
    });

    test('prevents submission when no option is selected', () => {
      render(
        <QuestionRenderer
          question={multipleChoiceQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      const continueButton = screen.getByText('Continue');
      
      // Try to click continue without selecting an option
      fireEvent.click(continueButton);

      // Should not call onAnswer
      expect(mockOnAnswer).not.toHaveBeenCalled();
    });

    test('allows changing selection', () => {
      render(
        <QuestionRenderer
          question={multipleChoiceQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Select first option
      fireEvent.click(screen.getByText('Partner/Spouse'));
      
      // Select different option
      fireEvent.click(screen.getByText('Family Member'));

      // Submit
      fireEvent.click(screen.getByText('Continue'));

      expect(mockOnAnswer).toHaveBeenCalledWith('family');
    });
  });

  // =============================================================================
  // RANGE QUESTION TESTS
  // =============================================================================

  describe('Range Questions', () => {
    const rangeQuestion = {
      id: 'budget',
      question_text: "What's your budget for this gift?",
      question_type: 'range' as const,
      category: 'essential',
      options: {
        min: 10,
        max: 200,
        step: 5,
        currency: 'GBP',
        suggested_ranges: [
          { min: 10, max: 25, label: 'Small token (£10-25)' },
          { min: 25, max: 50, label: 'Thoughtful gift (£25-50)' },
          { min: 50, max: 100, label: 'Special occasion (£50-100)' }
        ]
      },
      weight: 2.0,
      order_sequence: 2
    };

    test('renders range question correctly', () => {
      render(
        <QuestionRenderer
          question={rangeQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Should display question text
      expect(screen.getByText("What's your budget for this gift?")).toBeInTheDocument();

      // Should display min/max inputs with currency labels
      expect(screen.getByText('Minimum (GBP)')).toBeInTheDocument();
      expect(screen.getByText('Maximum (GBP)')).toBeInTheDocument();

      // Should display suggested ranges
      expect(screen.getByText('Quick select:')).toBeInTheDocument();
      expect(screen.getByText('Small token (£10-25)')).toBeInTheDocument();
      expect(screen.getByText('Thoughtful gift (£25-50)')).toBeInTheDocument();
    });

    test('allows setting min and max values', async () => {
      render(
        <QuestionRenderer
          question={rangeQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Find input fields
      const minInput = screen.getByDisplayValue('10'); // Default min value
      const maxInput = screen.getByDisplayValue('200'); // Default max value

      // Change values
      fireEvent.change(minInput, { target: { value: '25' } });
      fireEvent.change(maxInput, { target: { value: '75' } });

      // Submit
      fireEvent.click(screen.getByText('Continue'));

      expect(mockOnAnswer).toHaveBeenCalledWith({
        min: 25,
        max: 75,
        currency: 'GBP'
      });
    });

    test('uses suggested range shortcuts', () => {
      render(
        <QuestionRenderer
          question={rangeQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Click on a suggested range
      fireEvent.click(screen.getByText('Thoughtful gift (£25-50)'));

      // Values should update
      expect(screen.getByDisplayValue('25')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();

      // Submit
      fireEvent.click(screen.getByText('Continue'));

      expect(mockOnAnswer).toHaveBeenCalledWith({
        min: 25,
        max: 50,
        currency: 'GBP'
      });
    });

    test('prevents submission when min > max', () => {
      render(
        <QuestionRenderer
          question={rangeQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      const minInput = screen.getByDisplayValue('10');
      const maxInput = screen.getByDisplayValue('200');

      // Set min > max
      fireEvent.change(minInput, { target: { value: '100' } });
      fireEvent.change(maxInput, { target: { value: '50' } });

      const continueButton = screen.getByText('Continue');
      expect(continueButton).toBeDisabled();
    });
  });

  // =============================================================================
  // SCALE QUESTION TESTS
  // =============================================================================

  describe('Scale Questions', () => {
    const scaleQuestion = {
      id: 'tech_interest',
      question_text: 'How interested are they in technology?',
      question_type: 'scale' as const,
      category: 'preference',
      options: {
        min: 1,
        max: 5,
        labels: {
          1: 'Not at all',
          2: 'Slightly',
          3: 'Moderately',
          4: 'Very',
          5: 'Extremely'
        }
      },
      weight: 1.4,
      order_sequence: 3
    };

    test('renders scale question correctly', () => {
      render(
        <QuestionRenderer
          question={scaleQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Should display question text
      expect(screen.getByText('How interested are they in technology?')).toBeInTheDocument();

      // Should display scale labels
      expect(screen.getByText('Not at all')).toBeInTheDocument();
      expect(screen.getByText('Extremely')).toBeInTheDocument();

      // Should display scale buttons 1-5
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      // Continue button should be disabled initially
      expect(screen.getByText('Continue')).toBeDisabled();
    });

    test('allows selecting a scale value', () => {
      render(
        <QuestionRenderer
          question={scaleQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Click on scale value 4
      fireEvent.click(screen.getByText('4'));

      // Should show the label for selected value
      expect(screen.getByText('Very')).toBeInTheDocument();

      // Continue button should be enabled
      expect(screen.getByText('Continue')).not.toBeDisabled();

      // Submit
      fireEvent.click(screen.getByText('Continue'));

      expect(mockOnAnswer).toHaveBeenCalledWith(4);
    });
  });

  // =============================================================================
  // BOOLEAN QUESTION TESTS
  // =============================================================================

  describe('Boolean Questions', () => {
    const booleanQuestion = {
      id: 'likes_surprise',
      question_text: 'Do they like surprise gifts?',
      question_type: 'boolean' as const,
      category: 'preference',
      options: {},
      weight: 1.2,
      order_sequence: 4
    };

    test('renders boolean question correctly', () => {
      render(
        <QuestionRenderer
          question={booleanQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Should display question text
      expect(screen.getByText('Do they like surprise gifts?')).toBeInTheDocument();

      // Should display Yes/No buttons
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    test('submits immediately when option is selected', () => {
      render(
        <QuestionRenderer
          question={booleanQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      // Click Yes
      fireEvent.click(screen.getByText('Yes'));

      expect(mockOnAnswer).toHaveBeenCalledWith(true);

      // Reset mock
      mockOnAnswer.mockClear();

      // Click No
      fireEvent.click(screen.getByText('No'));

      expect(mockOnAnswer).toHaveBeenCalledWith(false);
    });
  });

  // =============================================================================
  // UNSUPPORTED QUESTION TYPE TESTS
  // =============================================================================

  describe('Unsupported Question Types', () => {
    test('displays error for unsupported question type', () => {
      const unsupportedQuestion = {
        id: 'test',
        question_text: 'Test question',
        question_type: 'unsupported_type' as any,
        category: 'test',
        options: {},
        weight: 1.0,
        order_sequence: 1
      };

      render(
        <QuestionRenderer
          question={unsupportedQuestion}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText('Unsupported question type: unsupported_type')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // LOADING STATE TESTS
  // =============================================================================

  describe('Loading States', () => {
    test('disables interactions when loading', () => {
      render(
        <QuestionRenderer
          question={{
            id: 'relationship',
            question_text: "What's your relationship to the gift recipient?",
            question_type: 'multiple_choice',
            category: 'essential',
            options: {
              choices: [
                { value: 'partner', label: 'Partner/Spouse' },
                { value: 'family', label: 'Family Member' }
              ]
            },
            weight: 2.0,
            order_sequence: 1
          }}
          onAnswer={mockOnAnswer}
          isLoading={true}
        />
      );

      // Options should be disabled
      const partnerOption = screen.getByText('Partner/Spouse').closest('button');
      expect(partnerOption).toBeDisabled();

      // Continue button should be disabled
      expect(screen.getByText('Continue')).toBeDisabled();
    });
  });
});
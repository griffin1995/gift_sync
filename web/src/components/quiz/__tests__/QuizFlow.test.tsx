/**
 * QuizFlow Component Tests
 * 
 * Test suite for the main QuizFlow component including:
 * - Quiz session initialization
 * - Question progression
 * - Response submission
 * - Progress tracking
 * - Completion handling
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import QuizFlow from '../QuizFlow';

// Mock the API hook
const mockAPI = {
  post: jest.fn(),
  get: jest.fn(),
};

jest.mock('@/hooks/useAPI', () => ({
  useAPI: () => mockAPI,
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader-icon">Loading...</div>,
  CheckCircle: () => <div data-testid="check-icon">✓</div>,
  ArrowRight: () => <div data-testid="arrow-icon">→</div>,
}));

describe('QuizFlow Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // INITIALIZATION TESTS
  // =============================================================================

  test('renders loading state initially', async () => {
    // Mock API response for quiz start
    mockAPI.post.mockResolvedValueOnce({
      data: {
        session_id: 'test-session-123',
        progress: {
          session_id: 'test-session-123',
          questions_answered: 0,
          estimated_total: 4,
          confidence_level: 0.0,
          completion_percentage: 0.0,
          current_question: {
            id: 'relationship',
            question_text: "What's your relationship to the gift recipient?",
            question_type: 'multiple_choice',
            options: {
              choices: [
                { value: 'partner', label: 'Partner/Spouse' },
                { value: 'family', label: 'Family Member' },
                { value: 'friend', label: 'Friend' }
              ]
            },
            weight: 2.0,
            order_sequence: 1
          }
        }
      }
    });

    render(<QuizFlow />);

    // Should show loading state initially
    expect(screen.getByText('Preparing your personalised quiz...')).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  test('starts quiz session on mount', async () => {
    const mockSessionData = {
      session_id: 'test-session-123',
      progress: {
        session_id: 'test-session-123',
        questions_answered: 0,
        estimated_total: 4,
        confidence_level: 0.0,
        completion_percentage: 0.0,
        current_question: {
          id: 'relationship',
          question_text: "What's your relationship to the gift recipient?",
          question_type: 'multiple_choice',
          options: {
            choices: [
              { value: 'partner', label: 'Partner/Spouse' },
              { value: 'family', label: 'Family Member' }
            ]
          },
          weight: 2.0,
          order_sequence: 1
        }
      }
    };

    mockAPI.post.mockResolvedValueOnce({ data: mockSessionData });

    render(<QuizFlow />);

    await waitFor(() => {
      expect(mockAPI.post).toHaveBeenCalledWith('/quiz/start', {
        user_context: { source: 'web_app' },
        anonymous: true
      });
    });
  });

  // =============================================================================
  // QUESTION DISPLAY TESTS
  // =============================================================================

  test('displays first question after initialization', async () => {
    const mockQuestion = {
      id: 'relationship',
      question_text: "What's your relationship to the gift recipient?",
      question_type: 'multiple_choice',
      options: {
        choices: [
          { value: 'partner', label: 'Partner/Spouse' },
          { value: 'family', label: 'Family Member' },
          { value: 'friend', label: 'Friend' }
        ]
      },
      weight: 2.0,
      order_sequence: 1
    };

    mockAPI.post.mockResolvedValueOnce({
      data: {
        session_id: 'test-session-123',
        progress: {
          session_id: 'test-session-123',
          questions_answered: 0,
          estimated_total: 4,
          confidence_level: 0.0,
          completion_percentage: 0.0,
          current_question: mockQuestion
        }
      }
    });

    render(<QuizFlow />);

    await waitFor(() => {
      expect(screen.getByText("What's your relationship to the gift recipient?")).toBeInTheDocument();
      expect(screen.getByText('Partner/Spouse')).toBeInTheDocument();
      expect(screen.getByText('Family Member')).toBeInTheDocument();
      expect(screen.getByText('Friend')).toBeInTheDocument();
    });
  });

  test('displays progress information', async () => {
    const mockSessionData = {
      session_id: 'test-session-123',
      progress: {
        session_id: 'test-session-123',
        questions_answered: 1,
        estimated_total: 4,
        confidence_level: 0.25,
        completion_percentage: 25.0,
        current_question: {
          id: 'budget',
          question_text: "What's your budget for this gift?",
          question_type: 'range',
          options: { min: 10, max: 200, currency: 'GBP' },
          weight: 2.0,
          order_sequence: 2
        }
      }
    };

    mockAPI.post.mockResolvedValueOnce({ data: mockSessionData });

    render(<QuizFlow />);

    await waitFor(() => {
      expect(screen.getByText('Quiz Progress')).toBeInTheDocument();
      expect(screen.getByText('25% Complete')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // RESPONSE SUBMISSION TESTS
  // =============================================================================

  test('submits response and gets next question', async () => {
    const mockInitialData = {
      session_id: 'test-session-123',
      progress: {
        session_id: 'test-session-123',
        questions_answered: 0,
        estimated_total: 4,
        confidence_level: 0.0,
        completion_percentage: 0.0,
        current_question: {
          id: 'relationship',
          question_text: "What's your relationship to the gift recipient?",
          question_type: 'multiple_choice',
          options: {
            choices: [
              { value: 'partner', label: 'Partner/Spouse' },
              { value: 'family', label: 'Family Member' }
            ]
          },
          weight: 2.0,
          order_sequence: 1
        }
      }
    };

    const mockResponseSubmission = {
      success: true,
      progress: {
        session_id: 'test-session-123',
        questions_answered: 1,
        estimated_total: 4,
        confidence_level: 0.25,
        completion_percentage: 25.0
      }
    };

    const mockNextQuestion = {
      id: 'budget',
      question_text: "What's your budget for this gift?",
      question_type: 'range',
      options: { min: 10, max: 200, currency: 'GBP' },
      weight: 2.0,
      order_sequence: 2
    };

    // Mock the sequence of API calls
    mockAPI.post
      .mockResolvedValueOnce({ data: mockInitialData })  // Start quiz
      .mockResolvedValueOnce({ data: mockResponseSubmission });  // Submit response
    
    mockAPI.get.mockResolvedValueOnce({ data: mockNextQuestion });  // Get next question

    render(<QuizFlow />);

    // Wait for initial question to load
    await waitFor(() => {
      expect(screen.getByText('Partner/Spouse')).toBeInTheDocument();
    });

    // Click on an answer
    fireEvent.click(screen.getByText('Partner/Spouse'));
    
    // Submit the answer (click Continue button)
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockAPI.post).toHaveBeenCalledWith('/quiz/responses', expect.objectContaining({
        session_id: 'test-session-123',
        question_id: 'relationship',
        response_value: 'partner'
      }));
    });

    await waitFor(() => {
      expect(mockAPI.get).toHaveBeenCalledWith('/quiz/questions/test-session-123/next');
    });
  });

  // =============================================================================
  // COMPLETION TESTS
  // =============================================================================

  test('displays completion screen when quiz is finished', async () => {
    const mockRecommendations = [
      {
        product_id: 'test-product-1',
        confidence_score: 0.92,
        reasoning: 'Perfect match for your preferences',
        quiz_factors: { budget_match: 'excellent' },
        rank_position: 1
      }
    ];

    // Mock quiz start
    mockAPI.post.mockResolvedValueOnce({
      data: {
        session_id: 'test-session-123',
        progress: {
          session_id: 'test-session-123',
          questions_answered: 0,
          estimated_total: 1,
          confidence_level: 0.0,
          completion_percentage: 0.0,
          current_question: {
            id: 'relationship',
            question_text: "What's your relationship to the gift recipient?",
            question_type: 'multiple_choice',
            options: {
              choices: [{ value: 'partner', label: 'Partner/Spouse' }]
            },
            weight: 2.0,
            order_sequence: 1
          }
        }
      }
    });

    // Mock response submission
    mockAPI.post.mockResolvedValueOnce({
      data: {
        success: true,
        progress: {
          session_id: 'test-session-123',
          questions_answered: 1,
          estimated_total: 1,
          confidence_level: 1.0,
          completion_percentage: 100.0
        }
      }
    });

    // Mock no next question (quiz complete)
    mockAPI.get.mockResolvedValueOnce({ data: null });

    // Mock quiz completion
    mockAPI.post.mockResolvedValueOnce({ data: mockRecommendations });

    const onCompleteMock = jest.fn();

    render(<QuizFlow onComplete={onCompleteMock} />);

    // Wait for question and answer it
    await waitFor(() => {
      expect(screen.getByText('Partner/Spouse')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Partner/Spouse'));
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(onCompleteMock).toHaveBeenCalledWith(mockRecommendations);
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  test('displays error state when quiz start fails', async () => {
    mockAPI.post.mockRejectedValueOnce(new Error('Network error'));

    render(<QuizFlow />);

    await waitFor(() => {
      expect(screen.getByText('⚠️ Quiz Error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  test('handles response submission failure gracefully', async () => {
    // Mock successful quiz start
    mockAPI.post.mockResolvedValueOnce({
      data: {
        session_id: 'test-session-123',
        progress: {
          session_id: 'test-session-123',
          questions_answered: 0,
          estimated_total: 4,
          confidence_level: 0.0,
          completion_percentage: 0.0,
          current_question: {
            id: 'relationship',
            question_text: "What's your relationship to the gift recipient?",
            question_type: 'multiple_choice',
            options: {
              choices: [{ value: 'partner', label: 'Partner/Spouse' }]
            },
            weight: 2.0,
            order_sequence: 1
          }
        }
      }
    });

    // Mock failed response submission
    mockAPI.post.mockRejectedValueOnce(new Error('Submission failed'));

    render(<QuizFlow />);

    await waitFor(() => {
      expect(screen.getByText('Partner/Spouse')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Partner/Spouse'));
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('⚠️ Quiz Error')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // CALLBACK TESTS
  // =============================================================================

  test('calls onProgress callback when progress updates', async () => {
    const onProgressMock = jest.fn();

    mockAPI.post.mockResolvedValueOnce({
      data: {
        session_id: 'test-session-123',
        progress: {
          session_id: 'test-session-123',
          questions_answered: 0,
          estimated_total: 4,
          confidence_level: 0.0,
          completion_percentage: 0.0,
          current_question: null
        }
      }
    });

    render(<QuizFlow onProgress={onProgressMock} />);

    await waitFor(() => {
      expect(onProgressMock).toHaveBeenCalledWith(expect.objectContaining({
        session_id: 'test-session-123',
        questions_answered: 0,
        estimated_total: 4
      }));
    });
  });

  test('supports anonymous and authenticated modes', async () => {
    mockAPI.post.mockResolvedValueOnce({
      data: {
        session_id: 'test-session-123',
        progress: {
          session_id: 'test-session-123',
          questions_answered: 0,
          estimated_total: 4,
          confidence_level: 0.0,
          completion_percentage: 0.0,
          current_question: null
        }
      }
    });

    render(<QuizFlow anonymous={false} />);

    await waitFor(() => {
      expect(mockAPI.post).toHaveBeenCalledWith('/quiz/start', {
        user_context: { source: 'web_app' },
        anonymous: false
      });
    });
  });
});
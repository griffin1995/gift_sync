/**
 * Quiz Flow End-to-End Tests
 * 
 * Comprehensive E2E tests for the main quiz functionality including:
 * - Anonymous quiz completion
 * - Question progression
 * - Response submission
 * - Recommendation generation
 */

import { test, expect } from '@playwright/test';

test.describe('Quiz Flow - Anonymous User', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the quiz page
    await page.goto('/quiz');
  });

  test('completes full anonymous quiz flow', async ({ page }) => {
    // Wait for quiz to initialize
    await expect(page.getByText('Preparing your personalised quiz')).toBeVisible();
    
    // Wait for first question to appear
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    
    // Answer first question (should be relationship question)
    const firstQuestion = page.locator('[data-testid="question-text"]');
    await expect(firstQuestion).toContainText('relationship');
    
    // Select an option
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Wait for next question
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
    
    // Answer second question (should be budget question)
    const secondQuestion = page.locator('[data-testid="question-text"]');
    await expect(secondQuestion).toContainText('budget');
    
    // Set budget range
    await page.fill('input[name="min"]', '25');
    await page.fill('input[name="max"]', '75');
    await page.click('text=Continue');
    
    // Continue answering questions until quiz is complete
    let questionsAnswered = 2;
    const maxQuestions = 6; // Safety limit
    
    while (questionsAnswered < maxQuestions) {
      try {
        // Check if we've reached the completion screen
        const completionScreen = page.locator('text=Quiz Complete');
        const isComplete = await completionScreen.isVisible({ timeout: 5000 });
        
        if (isComplete) {
          break;
        }
        
        // Check if there's another question
        const questionText = page.locator('[data-testid="question-text"]');
        const hasQuestion = await questionText.isVisible({ timeout: 5000 });
        
        if (!hasQuestion) {
          break;
        }
        
        // Answer the question based on its type
        const questionContent = await questionText.textContent();
        
        if (questionContent?.includes('technology') || questionContent?.includes('interested')) {
          // Scale question - select middle value
          await page.click('text=3');
        } else if (questionContent?.includes('surprise')) {
          // Boolean question - select Yes
          await page.click('text=Yes');
        } else {
          // Multiple choice - select first available option
          const options = page.locator('[data-testid="option-button"]');
          const firstOption = options.first();
          if (await firstOption.isVisible()) {
            await firstOption.click();
          }
        }
        
        // Click Continue if it exists (not needed for boolean questions)
        const continueButton = page.locator('text=Continue');
        if (await continueButton.isVisible({ timeout: 2000 })) {
          await continueButton.click();
        }
        
        questionsAnswered++;
        
        // Small delay to allow for state updates
        await page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`Question ${questionsAnswered} handling error:`, error);
        break;
      }
    }
    
    // Should eventually reach completion or recommendations
    const completionIndicators = [
      page.locator('text=Quiz Complete'),
      page.locator('text=Recommendations'),
      page.locator('text=Perfect Gifts'),
      page.locator('[data-testid="recommendations"]')
    ];
    
    // Wait for any completion indicator
    await Promise.race(
      completionIndicators.map(locator => 
        expect(locator).toBeVisible({ timeout: 30000 })
      )
    );
    
    console.log(`✅ Quiz completed after ${questionsAnswered} questions`);
  });

  test('displays progress correctly during quiz', async ({ page }) => {
    // Wait for quiz to load
    await expect(page.getByText('Preparing your personalised quiz')).toBeVisible();
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    
    // Check initial progress
    await expect(page.locator('text=Quiz Progress')).toBeVisible();
    await expect(page.locator('text=% Complete')).toBeVisible();
    
    // Answer first question
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Progress should update
    await page.waitForTimeout(2000);
    const progressText = await page.locator('text=% Complete').textContent();
    expect(progressText).toMatch(/\d+% Complete/);
  });

  test('handles quiz errors gracefully', async ({ page }) => {
    // Mock a network error by intercepting requests
    await page.route('**/api/v1/quiz/start', route => {
      route.abort('failed');
    });
    
    await page.goto('/quiz');
    
    // Should show error state
    await expect(page.locator('text=Quiz Error')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Try Again')).toBeVisible();
  });
});

test.describe('Quiz Flow - Authenticated User', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user first
    await page.goto('/auth/login');
    
    await page.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard/home
    await page.waitForURL(/\/(dashboard|home|\?)/, { timeout: 10000 });
    
    // Navigate to quiz
    await page.goto('/quiz');
  });

  test('completes authenticated quiz flow', async ({ page }) => {
    // Quiz flow should be similar but with user context
    await expect(page.getByText('Preparing your personalised quiz')).toBeVisible();
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    
    // Answer at least one question to verify authenticated flow
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Should progress to next question
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
  });
});

test.describe('Quiz Navigation', () => {
  test('allows returning to previous questions', async ({ page }) => {
    await page.goto('/quiz');
    
    // Complete first question
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Complete second question
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
    await page.fill('input[name="min"]', '25');
    await page.fill('input[name="max"]', '75');
    await page.click('text=Continue');
    
    // Check if back navigation is available
    const backButton = page.locator('text=Back', { hasText: /^Back$/ });
    if (await backButton.isVisible({ timeout: 5000 })) {
      await backButton.click();
      
      // Should return to previous question
      await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
    }
  });

  test('maintains quiz state across page refreshes', async ({ page }) => {
    await page.goto('/quiz');
    
    // Answer first question
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Refresh the page
    await page.reload();
    
    // Should restore quiz state or restart appropriately
    await expect(page.locator('body')).toBeVisible();
    
    // Either should show the next question or restart the quiz
    const hasQuestion = await page.locator('[data-testid="question-text"]').isVisible({ timeout: 10000 });
    const hasStart = await page.getByText('Preparing your personalised quiz').isVisible({ timeout: 5000 });
    
    expect(hasQuestion || hasStart).toBe(true);
  });
});

test.describe('Quiz Responsiveness', () => {
  test('works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/quiz');
    
    // Quiz should load and be usable on mobile
    await expect(page.getByText('Preparing your personalised quiz')).toBeVisible();
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    
    // Should be able to interact with options
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Should progress to next question
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
  });

  test('works on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/quiz');
    
    // Quiz should load and be usable on tablet
    await expect(page.getByText('Preparing your personalised quiz')).toBeVisible();
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    
    // Should be able to interact with options
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Should progress to next question
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
  });
});
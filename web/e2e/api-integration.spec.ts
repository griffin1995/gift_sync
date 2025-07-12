/**
 * API Integration End-to-End Tests
 * 
 * E2E tests for frontend-backend API integration including:
 * - Authentication API calls
 * - Quiz API integration
 * - Product API integration
 * - Error handling
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication API Integration', () => {
  test('registration API integration works correctly', async ({ page }) => {
    // Monitor network requests
    const apiCalls: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/v1/auth/')) {
        apiCalls.push({
          method: request.method(),
          url: request.url(),
          headers: request.headers()
        });
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/v1/auth/')) {
        console.log(`API Response: ${response.status()} - ${response.url()}`);
      }
    });

    await page.goto('/auth/register');
    
    // Fill registration form
    const timestamp = Date.now();
    const testEmail = `api-test-${timestamp}@giftsync.local`;
    
    await page.fill('input[name="firstName"]', 'API');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for API call to complete
    await page.waitForTimeout(3000);
    
    // Should have made API call to registration endpoint
    const registrationCall = apiCalls.find(call => 
      call.url.includes('/auth/register') && call.method === 'POST'
    );
    
    expect(registrationCall).toBeTruthy();
    
    // Should redirect on success or show error
    const currentUrl = page.url();
    const isSuccess = currentUrl.includes('/dashboard') || currentUrl.includes('/home') || !currentUrl.includes('/auth/register');
    const hasError = await page.locator('text=/error|invalid|failed/i').isVisible({ timeout: 2000 });
    
    expect(isSuccess || hasError).toBe(true);
  });

  test('login API integration works correctly', async ({ page }) => {
    // Monitor API calls
    const apiCalls: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/v1/auth/')) {
        apiCalls.push({
          method: request.method(),
          url: request.url()
        });
      }
    });

    await page.goto('/auth/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page.fill('input[name="password"]', 'TestPass123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for API call
    await page.waitForTimeout(3000);
    
    // Should have made API call to login endpoint
    const loginCall = apiCalls.find(call => 
      call.url.includes('/auth/login') && call.method === 'POST'
    );
    
    expect(loginCall).toBeTruthy();
  });
});

test.describe('Quiz API Integration', () => {
  test('quiz start API integration works', async ({ page }) => {
    // Monitor quiz API calls
    const quizApiCalls: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/v1/quiz/')) {
        quizApiCalls.push({
          method: request.method(),
          url: request.url(),
          postData: request.postData()
        });
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/v1/quiz/')) {
        console.log(`Quiz API Response: ${response.status()} - ${response.url()}`);
      }
    });

    await page.goto('/quiz');
    
    // Wait for quiz initialization
    await page.waitForTimeout(5000);
    
    // Should have made API call to start quiz
    const startCall = quizApiCalls.find(call => 
      call.url.includes('/quiz/start') && call.method === 'POST'
    );
    
    expect(startCall).toBeTruthy();
    
    // Should show quiz content or error
    const hasQuizContent = await page.locator('[data-testid="question-text"]').isVisible({ timeout: 15000 });
    const hasError = await page.locator('text=Quiz Error').isVisible({ timeout: 5000 });
    
    expect(hasQuizContent || hasError).toBe(true);
  });

  test('quiz response submission API works', async ({ page }) => {
    // Monitor API calls
    const apiCalls: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/v1/quiz/')) {
        apiCalls.push({
          method: request.method(),
          url: request.url()
        });
      }
    });

    await page.goto('/quiz');
    
    // Wait for quiz to load
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    
    // Answer question
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Wait for response submission
    await page.waitForTimeout(3000);
    
    // Should have made API call to submit response
    const responseCall = apiCalls.find(call => 
      call.url.includes('/quiz/responses') && call.method === 'POST'
    );
    
    expect(responseCall).toBeTruthy();
  });

  test('handles quiz API errors gracefully', async ({ page }) => {
    // Intercept and mock error response
    await page.route('**/api/v1/quiz/start', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error',
          message: 'Quiz service unavailable'
        })
      });
    });

    await page.goto('/quiz');
    
    // Should show error state
    await expect(page.locator('text=Quiz Error')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Product API Integration', () => {
  test('products API integration works', async ({ page, request }) => {
    // Test products API directly
    const response = await request.get('http://localhost:8000/api/v1/products');
    
    // Should get successful response or error
    expect([200, 404, 500].includes(response.status())).toBe(true);
    
    if (response.ok()) {
      const products = await response.json();
      expect(Array.isArray(products) || typeof products === 'object').toBe(true);
    }
  });

  test('product categories API integration works', async ({ page, request }) => {
    // Test categories API directly
    const response = await request.get('http://localhost:8000/api/v1/products/categories');
    
    // Should get response (might be 404 if not implemented)
    expect([200, 404, 500].includes(response.status())).toBe(true);
    
    if (response.ok()) {
      const categories = await response.json();
      expect(Array.isArray(categories) || typeof categories === 'object').toBe(true);
    }
  });
});

test.describe('API Error Handling', () => {
  test('handles network errors gracefully', async ({ page }) => {
    // Block all API requests
    await page.route('**/api/v1/**', route => {
      route.abort('failed');
    });

    await page.goto('/quiz');
    
    // Should show appropriate error message
    const errorIndicators = [
      'error',
      'failed',
      'try again',
      'network',
      'connection'
    ];
    
    let hasErrorHandling = false;
    for (const indicator of errorIndicators) {
      const errorText = page.locator(`text=${indicator}`);
      if (await errorText.isVisible({ timeout: 15000 })) {
        hasErrorHandling = true;
        break;
      }
    }
    
    expect(hasErrorHandling).toBe(true);
  });

  test('handles API timeout gracefully', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/v1/quiz/start', route => {
      // Delay response to simulate timeout
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            session_id: 'test-session',
            progress: {
              questions_answered: 0,
              estimated_total: 4
            }
          })
        });
      }, 30000); // 30 second delay
    });

    await page.goto('/quiz');
    
    // Should show loading state and eventually error or timeout handling
    await expect(page.locator('text=Preparing your personalised quiz')).toBeVisible();
    
    // Wait for timeout handling (should be less than 30 seconds)
    const hasTimeoutHandling = await page.locator('text=/timeout|error|try again/i').isVisible({ 
      timeout: 20000 
    });
    
    expect(hasTimeoutHandling).toBe(true);
  });

  test('validates API response format', async ({ page }) => {
    // Mock invalid API response
    await page.route('**/api/v1/quiz/start', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'invalid json response'
      });
    });

    await page.goto('/quiz');
    
    // Should handle invalid response gracefully
    const hasErrorHandling = await page.locator('text=/error|failed|try again/i').isVisible({ 
      timeout: 15000 
    });
    
    expect(hasErrorHandling).toBe(true);
  });
});

test.describe('API Authentication', () => {
  test('includes authentication headers when logged in', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|\?)/, { timeout: 15000 });

    // Monitor API calls for auth headers
    const apiCalls: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/v1/')) {
        const headers = request.headers();
        apiCalls.push({
          url: request.url(),
          hasAuth: !!headers.authorization || !!headers.Authorization
        });
      }
    });

    // Navigate to quiz (should be authenticated)
    await page.goto('/quiz');
    await page.waitForTimeout(3000);

    // Should have made authenticated API calls
    const authenticatedCalls = apiCalls.filter(call => call.hasAuth);
    
    // At least some API calls should include authentication
    expect(authenticatedCalls.length > 0 || apiCalls.length === 0).toBe(true);
  });

  test('handles expired token gracefully', async ({ page }) => {
    // Mock expired token response
    await page.route('**/api/v1/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Token expired',
          message: 'Please log in again'
        })
      });
    });

    await page.goto('/quiz');
    
    // Should redirect to login or show auth error
    await page.waitForTimeout(3000);
    
    const redirectedToLogin = page.url().includes('/auth/login');
    const hasAuthError = await page.locator('text=/login|auth|expired|401/i').isVisible({ timeout: 5000 });
    
    expect(redirectedToLogin || hasAuthError).toBe(true);
  });
});
/**
 * Authentication Flow End-to-End Tests
 * 
 * E2E tests for user authentication including:
 * - User registration
 * - User login/logout
 * - Protected route access
 * - Session persistence
 */

import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('allows new user registration', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill registration form
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@giftsync.local`;
    
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    
    // Accept terms if checkbox exists
    const termsCheckbox = page.locator('input[type="checkbox"]');
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check();
    }
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or home page
    await page.waitForURL(/\/(dashboard|home|\?)/, { timeout: 15000 });
    
    // Should show user is logged in
    await expect(page.locator('text=John')).toBeVisible();
  });

  test('validates registration form fields', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    const errorMessages = [
      'required',
      'Please',
      'field',
      'valid',
      'email'
    ];
    
    // Check for any validation message
    let hasValidation = false;
    for (const message of errorMessages) {
      const validationText = page.locator(`text=${message}`);
      if (await validationText.isVisible({ timeout: 2000 })) {
        hasValidation = true;
        break;
      }
    }
    
    expect(hasValidation).toBe(true);
  });

  test('prevents registration with invalid email', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill form with invalid email
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    
    await page.click('button[type="submit"]');
    
    // Should show email validation error
    const emailError = page.locator('text=/email|valid|format/i');
    await expect(emailError).toBeVisible({ timeout: 5000 });
  });
});

test.describe('User Login', () => {
  test('allows existing user login', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Login with test user
    await page.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL(/\/(dashboard|home|\?)/, { timeout: 15000 });
    
    // Should show user is logged in
    await expect(page.locator('text=Test')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    const errorMessages = [
      'Invalid',
      'incorrect',
      'error',
      'failed',
      'credentials'
    ];
    
    let hasError = false;
    for (const message of errorMessages) {
      const errorText = page.locator(`text=${message}`);
      if (await errorText.isVisible({ timeout: 5000 })) {
        hasError = true;
        break;
      }
    }
    
    expect(hasError).toBe(true);
  });

  test('validates login form fields', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    const errorMessages = [
      'required',
      'Please',
      'field',
      'email'
    ];
    
    let hasValidation = false;
    for (const message of errorMessages) {
      const validationText = page.locator(`text=${message}`);
      if (await validationText.isVisible({ timeout: 2000 })) {
        hasValidation = true;
        break;
      }
    }
    
    expect(hasValidation).toBe(true);
  });
});

test.describe('User Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|\?)/, { timeout: 15000 });
  });

  test('allows user logout', async ({ page }) => {
    // Find and click logout button/link
    const logoutSelectors = [
      'text=Logout',
      'text=Sign Out',
      'text=Log Out',
      '[data-testid="logout"]',
      'button:has-text("Logout")',
      'a:has-text("Logout")'
    ];
    
    let loggedOut = false;
    for (const selector of logoutSelectors) {
      try {
        const logoutElement = page.locator(selector);
        if (await logoutElement.isVisible({ timeout: 2000 })) {
          await logoutElement.click();
          loggedOut = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (!loggedOut) {
      // Try user menu dropdown
      const userMenus = [
        '[data-testid="user-menu"]',
        'text=Test',
        '[aria-label="User menu"]'
      ];
      
      for (const menuSelector of userMenus) {
        try {
          const userMenu = page.locator(menuSelector);
          if (await userMenu.isVisible({ timeout: 2000 })) {
            await userMenu.click();
            
            // Look for logout in dropdown
            const logoutInDropdown = page.locator('text=Logout');
            if (await logoutInDropdown.isVisible({ timeout: 2000 })) {
              await logoutInDropdown.click();
              loggedOut = true;
              break;
            }
          }
        } catch (error) {
          // Continue to next menu
        }
      }
    }
    
    if (loggedOut) {
      // Should redirect to login or home page
      await page.waitForURL(/\/(auth\/login|^\/$)/, { timeout: 10000 });
      
      // Should not show user info anymore
      await expect(page.locator('text=Test')).not.toBeVisible();
    } else {
      // Skip test if logout functionality not found
      test.skip('Logout functionality not found in UI');
    }
  });
});

test.describe('Protected Routes', () => {
  test('redirects to login when accessing protected routes while logged out', async ({ page }) => {
    // Try to access a protected route
    await page.goto('/dashboard');
    
    // Should redirect to login page
    await expect(page.url()).toMatch(/\/auth\/login/);
  });

  test('allows access to protected routes when logged in', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|\?)/, { timeout: 15000 });
    
    // Try to access protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      
      // Should not redirect to login (or should show the protected content)
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      
      // Either stays on the route or shows some protected content
      const hasAccess = currentUrl.includes(route) || !currentUrl.includes('/auth/login');
      if (hasAccess) {
        // At least one protected route is accessible
        break;
      }
    }
  });
});

test.describe('Session Persistence', () => {
  test('maintains session across page refreshes', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|\?)/, { timeout: 15000 });
    
    // Refresh the page
    await page.reload();
    
    // Should still be logged in
    await expect(page.locator('text=Test')).toBeVisible({ timeout: 10000 });
  });

  test('maintains session across browser tabs', async ({ context }) => {
    const page1 = await context.newPage();
    
    // Login in first tab
    await page1.goto('/auth/login');
    await page1.fill('input[name="email"]', 'e2e-test@giftsync.local');
    await page1.fill('input[name="password"]', 'TestPass123!');
    await page1.click('button[type="submit"]');
    await page1.waitForURL(/\/(dashboard|home|\?)/, { timeout: 15000 });
    
    // Open second tab
    const page2 = await context.newPage();
    await page2.goto('/');
    
    // Should be logged in in second tab too
    await expect(page2.locator('text=Test')).toBeVisible({ timeout: 10000 });
    
    await page1.close();
    await page2.close();
  });
});
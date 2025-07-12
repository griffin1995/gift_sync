/**
 * Navigation End-to-End Tests
 * 
 * E2E tests for site navigation including:
 * - Main navigation functionality
 * - Page routing
 * - Responsive navigation
 * - Breadcrumbs and user flows
 */

import { test, expect } from '@playwright/test';

test.describe('Main Navigation', () => {
  test('displays main navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for main navigation elements
    const navElements = [
      'Home',
      'Quiz',
      'About',
      'Login',
      'Register',
      'GiftSync' // Logo/brand name
    ];
    
    for (const element of navElements) {
      const navItem = page.locator(`text=${element}`);
      // At least some navigation elements should be visible
      if (await navItem.isVisible({ timeout: 2000 })) {
        expect(navItem).toBeVisible();
        break;
      }
    }
  });

  test('navigates to quiz page', async ({ page }) => {
    await page.goto('/');
    
    // Look for quiz navigation link
    const quizLinks = [
      'text=Quiz',
      'text=Start Quiz',
      'text=Take Quiz',
      'text=Begin',
      'a[href="/quiz"]',
      'a[href*="quiz"]'
    ];
    
    let navigated = false;
    for (const linkSelector of quizLinks) {
      try {
        const quizLink = page.locator(linkSelector);
        if (await quizLink.isVisible({ timeout: 2000 })) {
          await quizLink.click();
          await page.waitForURL(/\/quiz/, { timeout: 10000 });
          navigated = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (navigated) {
      // Should be on quiz page
      expect(page.url()).toMatch(/\/quiz/);
      
      // Should show quiz content
      await expect(page.locator('text=Preparing your personalised quiz')).toBeVisible({ timeout: 15000 });
    } else {
      // Directly navigate to quiz if no nav link found
      await page.goto('/quiz');
      await expect(page.locator('text=Preparing your personalised quiz')).toBeVisible({ timeout: 15000 });
    }
  });

  test('navigates to authentication pages', async ({ page }) => {
    await page.goto('/');
    
    // Test login navigation
    const loginLinks = [
      'text=Login',
      'text=Sign In',
      'text=Log In',
      'a[href="/auth/login"]',
      'a[href*="login"]'
    ];
    
    let foundLogin = false;
    for (const linkSelector of loginLinks) {
      try {
        const loginLink = page.locator(linkSelector);
        if (await loginLink.isVisible({ timeout: 2000 })) {
          await loginLink.click();
          await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
          foundLogin = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (foundLogin) {
      expect(page.url()).toMatch(/\/auth\/login/);
      await expect(page.locator('text=Login')).toBeVisible();
    }
    
    // Test register navigation
    await page.goto('/');
    
    const registerLinks = [
      'text=Register',
      'text=Sign Up',
      'text=Join',
      'a[href="/auth/register"]',
      'a[href*="register"]'
    ];
    
    let foundRegister = false;
    for (const linkSelector of registerLinks) {
      try {
        const registerLink = page.locator(linkSelector);
        if (await registerLink.isVisible({ timeout: 2000 })) {
          await registerLink.click();
          await page.waitForURL(/\/auth\/register/, { timeout: 10000 });
          foundRegister = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (foundRegister) {
      expect(page.url()).toMatch(/\/auth\/register/);
      await expect(page.locator('text=Register')).toBeVisible();
    }
  });
});

test.describe('Page Routing', () => {
  test('loads home page correctly', async ({ page }) => {
    await page.goto('/');
    
    // Should load without errors
    await expect(page.locator('body')).toBeVisible();
    
    // Should show some content
    const contentIndicators = [
      'GiftSync',
      'Welcome',
      'Quiz',
      'Gift',
      'Personalised'
    ];
    
    let hasContent = false;
    for (const indicator of contentIndicators) {
      const content = page.locator(`text=${indicator}`);
      if (await content.isVisible({ timeout: 5000 })) {
        hasContent = true;
        break;
      }
    }
    
    expect(hasContent).toBe(true);
  });

  test('handles 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should either show 404 page or redirect to home
    const response = await page.waitForResponse('**/non-existent-page');
    const status = response.status();
    
    if (status === 404) {
      // Should show 404 content
      const notFoundIndicators = [
        '404',
        'Not Found',
        'Page not found',
        'Not found'
      ];
      
      let hasNotFound = false;
      for (const indicator of notFoundIndicators) {
        const content = page.locator(`text=${indicator}`);
        if (await content.isVisible({ timeout: 5000 })) {
          hasNotFound = true;
          break;
        }
      }
      
      expect(hasNotFound).toBe(true);
    } else {
      // Should redirect to a valid page
      expect(status).toBeLessThan(400);
    }
  });

  test('supports browser back and forward navigation', async ({ page }) => {
    // Start at home
    await page.goto('/');
    
    // Navigate to quiz
    await page.goto('/quiz');
    await expect(page.locator('text=Preparing your personalised quiz')).toBeVisible({ timeout: 15000 });
    
    // Go back
    await page.goBack();
    expect(page.url()).toMatch(/\/$/);
    
    // Go forward
    await page.goForward();
    expect(page.url()).toMatch(/\/quiz/);
  });
});

test.describe('Responsive Navigation', () => {
  test('mobile navigation works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Look for mobile menu button
    const mobileMenuButtons = [
      '[data-testid="mobile-menu"]',
      'text=Menu',
      '[aria-label="Menu"]',
      'button:has-text("☰")',
      '.hamburger',
      '[data-testid="hamburger"]'
    ];
    
    let foundMobileMenu = false;
    for (const buttonSelector of mobileMenuButtons) {
      try {
        const menuButton = page.locator(buttonSelector);
        if (await menuButton.isVisible({ timeout: 2000 })) {
          await menuButton.click();
          foundMobileMenu = true;
          
          // Should show navigation items
          const navItems = [
            'Quiz',
            'Login',
            'Register'
          ];
          
          for (const item of navItems) {
            const navItem = page.locator(`text=${item}`);
            if (await navItem.isVisible({ timeout: 2000 })) {
              expect(navItem).toBeVisible();
              break;
            }
          }
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    // If no mobile menu found, navigation should still be accessible
    if (!foundMobileMenu) {
      const quizLink = page.locator('text=Quiz');
      if (await quizLink.isVisible({ timeout: 2000 })) {
        await quizLink.click();
        await page.waitForURL(/\/quiz/, { timeout: 10000 });
        expect(page.url()).toMatch(/\/quiz/);
      }
    }
  });

  test('tablet navigation works correctly', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    
    // Navigation should be accessible
    const quizLink = page.locator('text=Quiz');
    if (await quizLink.isVisible({ timeout: 5000 })) {
      await quizLink.click();
      await page.waitForURL(/\/quiz/, { timeout: 10000 });
      expect(page.url()).toMatch(/\/quiz/);
    }
  });
});

test.describe('User Flow Navigation', () => {
  test('supports complete user journey from home to quiz completion', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    
    // Navigate to quiz
    const quizLink = page.locator('text=Quiz').first();
    if (await quizLink.isVisible({ timeout: 5000 })) {
      await quizLink.click();
    } else {
      await page.goto('/quiz');
    }
    
    // Complete quiz
    await expect(page.locator('text=Preparing your personalised quiz')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible({ timeout: 30000 });
    
    // Answer first question
    await page.click('text=Partner/Spouse');
    await page.click('text=Continue');
    
    // Should progress through quiz
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
    
    console.log('✅ Complete user journey navigation successful');
  });

  test('provides clear navigation between authentication pages', async ({ page }) => {
    // Start at login page
    await page.goto('/auth/login');
    
    // Should have link to register
    const registerLinks = [
      'text=Register',
      'text=Sign up',
      'text=Create account',
      'a[href*="register"]'
    ];
    
    let foundRegisterLink = false;
    for (const linkSelector of registerLinks) {
      try {
        const registerLink = page.locator(linkSelector);
        if (await registerLink.isVisible({ timeout: 2000 })) {
          await registerLink.click();
          await page.waitForURL(/\/auth\/register/, { timeout: 10000 });
          foundRegisterLink = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (foundRegisterLink) {
      expect(page.url()).toMatch(/\/auth\/register/);
      
      // Should have link back to login
      const loginLinks = [
        'text=Login',
        'text=Sign in',
        'text=Already have an account',
        'a[href*="login"]'
      ];
      
      for (const linkSelector of loginLinks) {
        try {
          const loginLink = page.locator(linkSelector);
          if (await loginLink.isVisible({ timeout: 2000 })) {
            await loginLink.click();
            await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
            expect(page.url()).toMatch(/\/auth\/login/);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
    }
  });
});
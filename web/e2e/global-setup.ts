/**
 * Playwright Global Setup
 * 
 * Global setup for E2E tests including:
 * - Test user creation
 * - Database preparation
 * - Environment verification
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global E2E test setup...');

  // Wait for services to be ready
  console.log('⏳ Waiting for services to be ready...');
  
  // Create browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Check if backend is ready
    console.log('🔍 Checking backend health...');
    await page.goto('http://localhost:8000/docs');
    await page.waitForSelector('h1', { timeout: 30000 });
    console.log('✅ Backend is ready');

    // Check if frontend is ready  
    console.log('🔍 Checking frontend health...');
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 30000 });
    console.log('✅ Frontend is ready');

    // Create test user for authenticated tests
    console.log('👤 Creating test user...');
    try {
      const response = await page.request.post('http://localhost:8000/api/v1/auth/register', {
        data: {
          first_name: 'Test',
          last_name: 'User',
          email: 'e2e-test@giftsync.local',
          password: 'TestPass123!',
          marketing_consent: false
        }
      });

      if (response.ok()) {
        console.log('✅ Test user created successfully');
      } else {
        console.log('ℹ️ Test user may already exist (this is fine)');
      }
    } catch (error) {
      console.log('ℹ️ Test user creation skipped:', error);
    }

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global E2E setup complete');
}

export default globalSetup;
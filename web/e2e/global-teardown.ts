/**
 * Playwright Global Teardown
 * 
 * Global teardown for E2E tests including:
 * - Test data cleanup
 * - Service cleanup
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global E2E test teardown...');
  
  // Add any cleanup logic here
  // For now, we keep test data for debugging purposes
  
  console.log('✅ Global E2E teardown complete');
}

export default globalTeardown;
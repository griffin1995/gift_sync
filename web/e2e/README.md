# End-to-End Testing with Playwright

This directory contains comprehensive E2E tests for the GiftSync web application using Playwright.

## Test Structure

### Test Files

- **`quiz-flow.spec.ts`** - Tests the main quiz functionality including question progression, response submission, and completion
- **`auth-flow.spec.ts`** - Tests user authentication including registration, login, logout, and session management
- **`navigation.spec.ts`** - Tests site navigation, routing, and responsive behaviour
- **`api-integration.spec.ts`** - Tests frontend-backend API integration and error handling

### Configuration Files

- **`playwright.config.ts`** - Main Playwright configuration with browser settings and test options
- **`global-setup.ts`** - Global test setup including service verification and test user creation
- **`global-teardown.ts`** - Global test cleanup

## Running E2E Tests

### Prerequisites

1. **Backend running**: Ensure the FastAPI backend is running on `http://localhost:8000`
2. **Frontend running**: Ensure the Next.js frontend is running on `http://localhost:3000`
3. **Dependencies installed**: Run `npm install` to install Playwright and dependencies

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with browser UI (visual debugging)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode (step through)
npm run test:e2e:debug

# Run specific test file
npx playwright test quiz-flow.spec.ts

# Run specific test
npx playwright test --grep "completes full anonymous quiz flow"
```

### Browser Testing

Tests run on multiple browsers by default:
- Chromium (Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Test Coverage

### Quiz Flow Tests
- ✅ Anonymous quiz completion
- ✅ Authenticated quiz completion
- ✅ Question progression and navigation
- ✅ Response submission and validation
- ✅ Progress tracking
- ✅ Error handling
- ✅ Responsive design (mobile/tablet)

### Authentication Tests
- ✅ User registration
- ✅ User login/logout
- ✅ Form validation
- ✅ Protected route access
- ✅ Session persistence
- ✅ Error handling for invalid credentials

### Navigation Tests
- ✅ Main navigation functionality
- ✅ Page routing and browser navigation
- ✅ Responsive navigation (mobile menu)
- ✅ User flow navigation
- ✅ 404 page handling

### API Integration Tests
- ✅ Authentication API calls
- ✅ Quiz API integration
- ✅ Product API integration
- ✅ Network error handling
- ✅ API timeout handling
- ✅ Authentication header validation
- ✅ Response format validation

## Test Data

### Test User
- **Email**: `e2e-test@giftsync.local`
- **Password**: `TestPass123!`
- **Name**: Test User

This user is automatically created during global setup for authenticated test scenarios.

### Mock Data
Tests use realistic mock data for:
- Quiz questions and responses
- User registration data
- API responses
- Error scenarios

## Debugging Tests

### Visual Debugging
```bash
# Open Playwright Test Runner UI
npm run test:e2e:ui
```

### Step-by-Step Debugging
```bash
# Run in debug mode
npm run test:e2e:debug
```

### Screenshots and Videos
- Screenshots are captured on test failures
- Videos are recorded for failed tests
- Traces are captured for retry attempts

Files are saved to `test-results/` directory.

### Browser DevTools
```bash
# Run with browser visible
npm run test:e2e:headed
```

## CI/CD Integration

### GitHub Actions
E2E tests are configured to run in GitHub Actions with:
- Multiple browser testing
- Artifact collection for reports
- Integration with backend unit tests
- Database setup and teardown

### Configuration
See `.github/workflows/e2e-tests.yml` for complete CI configuration.

## Best Practices

### Test Writing
1. **Isolation**: Each test should be independent and not rely on others
2. **Cleanup**: Tests should clean up their own data
3. **Stability**: Use appropriate waits and timeouts for reliability
4. **Descriptive**: Test names should clearly describe the scenario

### Selectors
1. **Prefer data-testid**: Use `data-testid` attributes for reliable selection
2. **Fallback to text**: Use visible text as fallback for user-facing elements
3. **Avoid brittle selectors**: Don't rely on implementation details or styling classes

### Error Handling
1. **Graceful degradation**: Tests should handle missing elements gracefully
2. **Multiple strategies**: Try multiple approaches for robust interaction
3. **Clear assertions**: Use descriptive assertions with meaningful error messages

## Troubleshooting

### Common Issues

#### Tests Failing Due to Timing
- Increase timeouts in `playwright.config.ts`
- Add explicit waits for dynamic content
- Use `waitFor` methods for asynchronous operations

#### Services Not Available
- Ensure backend is running on port 8000
- Ensure frontend is running on port 3000
- Check global setup logs for service health

#### Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install

# Install system dependencies
sudo npx playwright install-deps
```

#### Test User Creation Fails
- Check backend authentication endpoints
- Verify database connectivity
- Review global setup logs

### Logs and Reports
- Test results: `test-results/`
- HTML report: `playwright-report/`
- Console logs: Available in test output
- Network logs: Captured in test traces

## Development Workflow

### Adding New Tests
1. Create test file in `e2e/` directory
2. Follow existing naming convention (`*.spec.ts`)
3. Use appropriate test groups with `describe` blocks
4. Include both happy path and error scenarios

### Updating Existing Tests
1. Ensure changes don't break existing functionality
2. Update selectors if UI changes
3. Adjust timeouts if performance characteristics change
4. Maintain cross-browser compatibility

### Test Maintenance
1. Regularly review and update test data
2. Remove or update obsolete tests
3. Keep configuration in sync with application changes
4. Monitor test execution times and optimise as needed
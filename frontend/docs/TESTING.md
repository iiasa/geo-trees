# Testing Guide

This document provides comprehensive information about the testing infrastructure and practices for the ABP React TanStack application.

## 📋 Overview

The project uses a multi-layered testing approach:

- **Unit Tests**: Test individual functions, utilities, and components in isolation
- **Integration Tests**: Test interactions between components and API calls
- **E2E Tests**: Test complete user workflows in a real browser environment

## 🛠️ Testing Stack

- **Vitest**: Fast unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing framework
- **MSW (Mock Service Worker)**: API mocking for tests
- **jsdom**: Browser environment simulation

## 📁 Project Structure

```
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
├── src/
│   ├── test-utils/              # Test utilities and mocks
│   │   ├── test-utils.tsx       # React Testing Library setup
│   │   ├── mock-data.ts         # Mock data for tests
│   │   ├── mock-handlers.ts     # MSW API handlers
│   │   └── setup.ts             # Global test setup
│   └── [feature]/               # Feature-specific tests
│       ├── components/
│       │   └── *.test.tsx       # Component tests
│       ├── hooks/
│       │   └── *.test.ts        # Hook tests
│       ├── stores/
│       │   └── *.test.ts        # Store tests
│       └── __tests__/           # Integration tests
│           └── *.test.tsx
├── e2e/                         # End-to-end tests
│   ├── auth.spec.ts
│   ├── users.spec.ts
│   ├── roles.spec.ts
│   ├── dashboard.spec.ts
│   ├── fixtures.ts
│   ├── global-setup.ts
│   └── global-teardown.ts
└── coverage/                    # Coverage reports (gitignored)
```

## 🚀 Running Tests

### Unit & Integration Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug
```

### All Tests

```bash
# Run all tests (unit + E2E)
pnpm test:all
```

## ✍️ Writing Tests

### Unit Tests

Unit tests focus on testing individual functions and utilities in isolation.

```typescript
// src/shared/utils/example.test.ts
import { describe, it, expect } from "vitest";
import { exampleFunction } from "./example";

describe("exampleFunction", () => {
  it("should return expected result", () => {
    const result = exampleFunction("input");
    expect(result).toBe("expected output");
  });
});
```

### Component Tests

Component tests use React Testing Library to test component behavior.

```typescript
// src/shared/components/ui/button.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button component", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

Integration tests test component interactions and API calls.

```typescript
// src/features/users/__tests__/user-management.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { userCreateMutation } from "@/infrastructure/api/@tanstack/react-query.gen";

describe("User Management Integration", () => {
  it("should create a new user", async () => {
    const queryClient = new QueryClient();

    const mutation = userCreateMutation();

    const result = await queryClient.executeMutation({
      ...mutation,
      variables: {
        body: {
          userName: "testuser",
          email: "test@example.com",
          password: "TestPass123!",
        },
      },
    });

    expect(result).toHaveProperty("id");
    expect(result.userName).toBe("testuser");
  });
});
```

### E2E Tests

E2E tests use Playwright to test complete user workflows.

```typescript
// e2e/auth.spec.ts
import { test, expect } from "./fixtures";

test("should allow user login", async ({ page }) => {
  await page.goto("/");

  // Navigate to login
  await page.click('[data-testid="login-btn"]');

  // Fill login form
  await page.fill('[data-testid="username"]', "testuser");
  await page.fill('[data-testid="password"]', "testpass");

  // Submit form
  await page.click('[data-testid="submit-login"]');

  // Verify login success
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});
```

## 🎭 Mocking

### API Mocking with MSW

The project uses MSW to mock API calls in tests:

```typescript
// src/test-utils/mock-handlers.ts
import { http, HttpResponse } from "msw";

export const apiHandlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "John Doe", email: "john@example.com" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const userData = await request.json();
    return HttpResponse.json({ id: 2, ...userData }, { status: 201 });
  }),
];
```

### Component Providers

Use the custom render function for components that need providers:

```typescript
import { renderWithProviders } from "@/test-utils/test-utils";

it("should render component with providers", () => {
  renderWithProviders(<MyComponent />);
});
```

## 📊 Coverage

### Coverage Requirements

- **Statements**: 70%
- **Branches**: 65%
- **Functions**: 70%
- **Lines**: 70%

### Coverage Configuration

Coverage is configured in `vitest.config.ts`:

```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "html", "lcov", "json"],
  thresholds: {
    global: {
      statements: 70,
      branches: 65,
      functions: 70,
      lines: 70,
    },
  },
  exclude: [
    "node_modules/",
    "dist/",
    "**/*.d.ts",
    "**/*.config.{ts,js}",
    "src/test-utils/",
    "e2e/",
  ],
},
```

### Viewing Coverage

After running `pnpm test:coverage`, view reports:

- **HTML Report**: `coverage/index.html`
- **LCOV Report**: `coverage/lcov-report/index.html`

## 🔧 Test Configuration

### Vitest Configuration

Key settings in `vitest.config.ts`:

- **Environment**: jsdom for DOM testing
- **Setup Files**: Global test setup with MSW
- **Path Aliases**: Matches TypeScript configuration
- **Coverage**: V8 provider with thresholds

### Playwright Configuration

Key settings in `playwright.config.ts`:

- **Browsers**: Chromium, Firefox, WebKit, Mobile
- **Base URL**: Configurable via environment
- **Global Setup/Teardown**: Test environment preparation
- **Video/Screenshots**: On failure only

## 🏷️ Naming Conventions

### Test Files

- **Unit Tests**: `*.test.ts` or `*.test.tsx`
- **Integration Tests**: `__tests__/*.test.tsx`
- **E2E Tests**: `*.spec.ts`

### Test Names

- **describe**: Feature or component name
- **it**: Specific behavior being tested
- Use descriptive names that explain the expected behavior

### Example

```typescript
describe("UserForm Component", () => {
  describe("when user submits valid data", () => {
    it("should create new user and show success message", async () => {
      // test implementation
    });
  });
});
```

## 🚨 Common Issues

### MSW Issues

If MSW handlers aren't working:

1. Ensure handlers are exported from `allHandlers`
2. Check that `setup.ts` imports and starts MSW server
3. Verify API URLs match between handlers and actual calls

### Component Testing Issues

If components aren't rendering properly:

1. Use `renderWithProviders` for components needing context
2. Mock external dependencies (API calls, hooks)
3. Check for missing providers (QueryClient, Router, etc.)

### E2E Test Flakiness

If E2E tests are flaky:

1. Add proper wait conditions
2. Use `data-testid` attributes for reliable element selection
3. Avoid timing-dependent assertions
4. Use Playwright's auto-waiting capabilities

## 📈 Best Practices

### General

- **Keep tests focused**: Each test should verify one behavior
- **Use descriptive names**: Test names should explain intent
- **Avoid implementation details**: Test behavior, not implementation
- **Clean up after tests**: Use `afterEach` for cleanup

### React Testing Library

- **Query by role**: Use `getByRole` when possible
- **Avoid data-testid**: Prefer semantic queries
- **Test user interactions**: Use `userEvent` instead of `fireEvent`
- **Wait for async operations**: Use `waitFor` or `findBy*`

### Playwright

- **Use page objects**: Abstract page interactions
- **Leverage fixtures**: Reuse authenticated sessions
- **Mobile testing**: Test responsive behavior
- **Visual testing**: Screenshot on failures

### Performance

- **Mock external services**: Don't rely on real APIs
- **Parallel execution**: Tests run in parallel by default
- **Selective running**: Use `.only` for focused development

## 🔄 CI/CD Integration

Tests run automatically on pull requests via GitHub Actions:

1. **Lint & Format**: Code quality checks
2. **Unit Tests**: With coverage reporting
3. **E2E Tests**: Full workflow testing
4. **Type Check**: TypeScript validation

### Coverage Reporting

Coverage reports are uploaded to Codecov for tracking and analysis.

### Failure Handling

- Tests must pass for PR merge
- Coverage thresholds enforced
- E2E failures block deployment

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Jest DOM](https://github.com/testing-library/jest-dom)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Follow existing patterns and conventions
3. Ensure all tests pass locally
4. Update this documentation if needed
5. Add E2E tests for critical user journeys

---

**Last Updated**: November 2025

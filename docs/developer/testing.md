# Testing

> For comprehensive detail, see [`frontend/docs/TESTING.md`](../../frontend/docs/TESTING.md).

## Testing Stack

| Tool | Purpose |
|------|---------|
| Vitest | Unit and integration testing |
| React Testing Library | Component testing |
| MSW (Mock Service Worker) | API mocking in tests |
| jsdom | Browser environment simulation |
| Playwright | End-to-end testing |

## Running Tests

```bash
# Unit tests (run from frontend/)
pnpm test                    # single run
pnpm test:watch              # watch mode
pnpm test:coverage           # with V8 coverage report
pnpm vitest run path/to/file.test.ts  # single file

# E2E tests
pnpm test:e2e

# Via Makefile (from project root)
make test                    # unit tests
make fe-test-coverage        # with coverage
make fe-test-e2e             # Playwright E2E
```

## Key Setup Details

- **`globals: true`** in `vitest.config.ts` — no need to import `describe`, `it`, or `expect` in test files.
- Use **`renderWithProviders()`** from `src/test-utils/test-utils.tsx` for components that require QueryClient or AuthProvider context.
- MSW handlers are defined in `src/test-utils/mock-handlers.ts` and started globally in `src/test-utils/setup.ts`.

## Coverage Thresholds

| Metric | Threshold |
|--------|-----------|
| Statements | 70% |
| Functions | 70% |
| Lines | 70% |
| Branches | 65% |

Coverage reports are generated in `coverage/` (gitignored). After running `pnpm test:coverage`, open `coverage/index.html` for the HTML report.

## Test File Naming

| Type | Convention | Location |
|------|-----------|----------|
| Unit tests | `*.test.ts` / `*.test.tsx` | Alongside source file |
| Integration tests | `*.test.tsx` | `__tests__/` subdirectory |
| E2E tests | `*.spec.ts` | `e2e/` |

## Writing Tests

### Unit and Component Tests

```typescript
// Globals are available — no imports needed for describe/it/expect
describe("MyComponent", () => {
  it("should render correctly", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

### Mocking APIs with MSW

Add handlers to `src/test-utils/mock-handlers.ts`:

```typescript
import { http, HttpResponse } from "msw";

export const apiHandlers = [
  http.get("/api/proxy/users", () => {
    return HttpResponse.json({ items: [], totalCount: 0 });
  }),
];
```

## Full Guide

See [`frontend/docs/TESTING.md`](../../frontend/docs/TESTING.md) for:

- Complete project structure
- Integration test examples
- E2E test examples with Playwright
- Common troubleshooting issues
- Best practices and CI/CD integration

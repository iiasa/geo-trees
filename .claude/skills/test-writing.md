---
name: test-writing
description: Write tests using the project's Vitest + MSW + Testing Library setup. Use when creating or fixing tests.
---

# Test Writing

Write frontend tests following GeoTrees testing conventions.

## Stack

- **Test runner**: Vitest (`globals: true` — no imports needed for `describe`/`it`/`expect`)
- **DOM testing**: `@testing-library/react` + `@testing-library/user-event`
- **Assertions**: `@testing-library/jest-dom` (`.toBeInTheDocument()`, etc.)
- **API mocking**: MSW (Mock Service Worker), globally configured in `src/test-utils/setup.ts`
- **Rendering**: `renderWithProviders()` from `@/test-utils/test-utils.tsx` (wraps with QueryClient + AuthProvider)

## Test File Conventions

- Location: `__tests__/` directory adjacent to the component being tested
- Naming: `<component-name>.test.tsx` (kebab-case)
- Max 500 lines per test file

## Basic Test Template

```typescript
import { renderWithProviders } from "@/test-utils/test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyComponent } from "../my-component";

describe("MyComponent", () => {
  it("renders correctly", async () => {
    renderWithProviders(<MyComponent />);
    expect(await screen.findByText("Expected text")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => {
      expect(screen.getByText("Success")).toBeInTheDocument();
    });
  });
});
```

## MSW Handler Pattern

```typescript
import { http, HttpResponse } from "msw";
import { server } from "@/test-utils/setup";

// Override default handlers for specific tests
beforeEach(() => {
  server.use(
    http.get("/api/proxy/api/app/my-endpoint", () => {
      return HttpResponse.json({
        items: [{ id: "1", name: "Test Item" }],
        totalCount: 1,
      });
    }),
  );
});
```

## Testing Patterns

### Testing with permissions
```typescript
// Mock the permissions hook if needed
vi.mock("@/shared/hooks/use-permissions", () => ({
  usePermissions: () => ({
    hasPermission: (p: string) => p === "Feature.Read",
  }),
}));
```

### Testing forms
```typescript
it("submits form data", async () => {
  const user = userEvent.setup();
  renderWithProviders(<MyForm />);

  await user.type(screen.getByLabelText("Name"), "Test Name");
  await user.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });
});
```

### Testing loading states
```typescript
it("shows loading state", () => {
  renderWithProviders(<MyList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

## Running Tests

- Single file: `cd frontend && pnpm vitest run src/features/<name>/components/__tests__/<file>.test.tsx`
- All tests: `make fe-test`
- With coverage: `make fe-test-coverage`
- Watch mode: `make fe-test-watch`

## Checklist

1. Create test file in `__tests__/` adjacent to the component
2. Use `renderWithProviders()` for all component renders
3. Set up MSW handlers for any API calls the component makes
4. Test happy path, error states, and user interactions
5. Use `findBy*` queries for async content, `getBy*` for synchronous
6. Run `make fe-test` to verify tests pass
7. Check coverage with `make fe-test-coverage` if needed

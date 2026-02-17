---
name: frontend-feature
description: Create a frontend feature following GeoTrees project conventions. Use when building a new feature with components, hooks, stores, and tests.
---

# Frontend Feature Development

Build features in `frontend/src/features/` following the project's established patterns.

## Project Conventions

- **File naming**: kebab-case for all files (enforced by `scripts/check-file-naming.js`)
- **File size**: 500 lines max per `.ts`/`.tsx` file (enforced by `scripts/check-file-size.js`)
- **Formatting**: Biome with tabs for indentation, double quotes
- **Path aliases**: `@/features/*`, `@/shared/*`, `@/infrastructure/*`
- **State**: Zustand for client state (form/modal stores), TanStack Query for server state
- **UI**: Shadcn/ui components from `@/shared/components/ui/`
- **Icons**: `@tabler/icons-react`
- **Forms**: `react-hook-form` with `@hookform/resolvers` + Zod validation
- **Tables**: `@tanstack/react-table`

## Feature Structure

```
frontend/src/features/<feature-name>/
  components/
    <feature-name>-list.tsx        # Main list/table component
    <feature-name>-form.tsx        # Create/edit form
    <feature-name>-modal.tsx       # Modal wrappers if needed
    __tests__/
      <feature-name>-list.test.tsx
  hooks/
    use-<feature-name>-data.ts     # TanStack Query hooks
    use-<feature-name>-store.ts    # Zustand store if needed
  stores/
    <feature-name>-store.ts        # Zustand store definition
  constants.ts                     # Feature-specific constants
```

## Checklist

1. Create feature directory with the structure above
2. Create components using Shadcn/ui primitives (`Card`, `Table`, `Dialog`, `Button`, etc.)
3. Create TanStack Query hooks using generated API options from `@/infrastructure/api/@tanstack/react-query.gen`
4. Create Zustand store for client-side state (modals, forms, filters) if needed
5. Add route file in `frontend/src/routes/` using `createFileRoute`
6. Write tests using `renderWithProviders()` from `@/test-utils/test-utils.tsx` with MSW handlers
7. Run `make fe-lint` and `make fe-typecheck` to verify conventions
8. Run `make fe-test` to verify tests pass

## Patterns to Follow

### TanStack Query Hook Usage
```typescript
import { someEndpointOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
const { data, isLoading } = useQuery(someEndpointOptions({ query: { ... } }));
```

### Zustand Store Pattern
```typescript
import { create } from "zustand";

interface FeatureStore {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const useFeatureStore = create<FeatureStore>((set) => ({
  isModalOpen: false,
  setModalOpen: (open) => set({ isModalOpen: open }),
}));
```

### Test Pattern
```typescript
import { renderWithProviders } from "@/test-utils/test-utils";
import { screen } from "@testing-library/react";

describe("FeatureList", () => {
  it("renders the list", async () => {
    renderWithProviders(<FeatureList />);
    expect(await screen.findByText("...")).toBeInTheDocument();
  });
});
```

### Permission Check
```typescript
import { usePermissions } from "@/shared/hooks/use-permissions";
const { hasPermission } = usePermissions();
if (hasPermission("Feature.SomeAction")) { ... }
```

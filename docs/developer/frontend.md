# Frontend Developer Guide

This guide covers the frontend architecture, conventions, and workflows for IIASA GeoTrees.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.0 | UI framework |
| TanStack Start | ^1.160.2 | SSR framework (Node server) |
| TanStack Router | ^1.160.2 | File-based routing |
| TanStack Query | ^5.90.11 | Server state management |
| Vite | ^7.1.7 | Build tool |
| Tailwind CSS | ^4.0.6 | Utility-first CSS styling |
| Shadcn/ui (Radix UI) | various | Accessible component library |
| MapLibre GL | ^5.18.0 | Map rendering |
| Zustand | ^5.0.8 | Client state management |
| Biome | 2.2.4 | Linting and formatting |
| Zod | ^4.1.13 | Schema validation |
| React Hook Form | ^7.66.1 | Form state and validation |
| openid-client | ^6.8.1 | OIDC/PKCE authentication |
| Vitest | ^4.0.14 | Unit testing |
| Playwright | ^1.57.0 | End-to-end testing |

All frontend code lives in `frontend/` and uses `pnpm` as the package manager.

## Folder Structure

```
frontend/src/
├── features/           # Feature-based modules (see below)
│   ├── auth/
│   ├── cms/
│   ├── dashboard/
│   ├── demo/
│   ├── feature-flags/
│   ├── map/
│   ├── map-layers/
│   ├── permission-admin/
│   ├── profile/
│   ├── roles/
│   ├── settings/
│   ├── tenants/
│   └── users/
├── infrastructure/
│   ├── api/            # Auto-generated TypeScript client (do NOT edit manually)
│   └── auth/           # OIDC authentication infrastructure
├── routes/             # TanStack Router file-based routes
├── shared/
│   ├── components/
│   │   └── ui/         # Shadcn/ui components
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   └── utils/
├── constants.ts
├── router.tsx
└── styles.css
```

## Feature Module Pattern

The application uses a feature-based architecture. Each feature is a self-contained module under `src/features/` with its own components, hooks, stores, and constants.

### Directory layout

```
feature-name/
├── components/         # kebab-case .tsx files
│   ├── [feature].tsx          # Main container
│   ├── [feature]-list.tsx     # List with data fetching
│   ├── [feature]-table.tsx    # Table display
│   ├── [feature]-header.tsx   # Header with actions
│   ├── [feature]-form.tsx     # Create/edit form
│   └── [feature]-modal.tsx    # Feature-specific modals
├── hooks/              # kebab-case .ts/.tsx files
├── stores/             # Zustand stores
│   ├── [feature]-form-store.ts   # Form state
│   └── [feature]-modal-store.ts  # Modal visibility
├── __tests__/          # Feature unit tests
└── constants.ts        # Feature-specific constants
```

### Store types

Each feature uses two Zustand store types, both extending shared base patterns:

- **Form store** (`[feature]-form-store.ts`): Manages create/edit form state — whether the form is open, which entity is being edited, and loading state. Exposes actions such as `openCreateForm`, `openEditForm`, and `setLoading`.
- **Modal store** (`[feature]-modal-store.ts`): Manages modal visibility and which record triggered the modal.

Using these two stores per feature keeps UI state predictable and colocated with the feature that owns it.

### Adding a new feature

1. Create `src/features/[feature-name]/` and add `components/`, `hooks/`, `stores/`, `constants.ts`.
2. Use the base store patterns (`BaseFormStore`, `BaseModalStore`) from shared stores to avoid boilerplate.
3. Add a route file in `src/routes/`.
4. Update navigation components to include the new entry.

## Routing

TanStack Router uses file-based routing — files under `src/routes/` map directly to URL paths.

Key conventions:
- `createFileRoute` from `@tanstack/react-router` is used in every route file.
- Dots in filenames become URL path separators: `auth.login.tsx` → `/auth/login`.
- `__root.tsx` is the root layout that wraps the entire application.
- `index.tsx` files define index routes for a path.
- `src/routeTree.gen.ts` is **auto-generated** by the TanStack Router Vite plugin — never edit it manually.

## State Management

The application uses a two-layer approach:

### Server state — TanStack Query

Data fetched from the API is managed by TanStack Query. Use the auto-generated hooks from `src/infrastructure/api/@tanstack/react-query.gen`:

```typescript
import { userGetListOptions } from "@/infrastructure/api/@tanstack/react-query.gen";

const { data } = useQuery(
  userGetListOptions({ query: { skipCount: 0, maxResultCount: 10 } })
);
```

These generated hooks automatically handle caching, background refetching, loading states, and cache invalidation. Do not hand-write `fetch` calls for API endpoints that exist in the generated client.

### Client state — Zustand

UI-only state (modal open/close, form draft data, selection state) is managed with Zustand. Each feature owns its own stores; no global store mixes concerns from multiple features.

## UI Components

Shadcn/ui components live in `src/shared/components/ui/`. These are Radix UI primitives styled with Tailwind CSS.

- Always check `src/shared/components/ui/` before building a custom component.
- Add new Shadcn components using the Shadcn CLI (e.g. `npx shadcn@latest add <component>`).
- Custom reusable components that are not feature-specific go in `src/shared/components/`.

## Path Aliases

Defined in `frontend/tsconfig.json`:

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@/shared/*` | `src/shared/*` |
| `@/features/*` | `src/features/*` |
| `@/infrastructure/*` | `src/infrastructure/*` |

Always use these aliases instead of deep relative paths like `../../../shared/`. Biome enforces import organisation automatically.

## Code Conventions

- **Indentation**: tabs
- **Quotes**: double quotes
- **File naming**: kebab-case enforced by `scripts/check-file-naming.js`. Route files may contain dots (e.g. `auth.login.tsx`).
- **File size**: 500-line maximum per `.ts`/`.tsx` file enforced by `scripts/check-file-size.js`. Large components should be split into list/table/header/form sub-components. Generated files under `infrastructure/api/` and `*.gen.ts` files are excluded.
- **TypeScript**: strict mode is enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).

## Key Commands

Run all commands from the `frontend/` directory:

```bash
pnpm dev              # Dev server on port 3000
pnpm build            # Production build
pnpm lint             # Biome lint + file-size check + file-naming check
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Biome format (write)
pnpm typecheck        # tsc --noEmit
pnpm test             # Unit tests (Vitest, single run)
pnpm test:coverage    # Tests with V8 coverage
pnpm test:e2e         # Playwright E2E tests
pnpm generate-api     # Regenerate API client from backend OpenAPI spec
```

To run a single test file:

```bash
pnpm vitest run src/features/users/__tests__/users.test.tsx
```

Alternatively, use the Makefile from the repository root:

```bash
make dev              # Start frontend dev server
make lint             # Lint frontend
make test             # Run unit tests
make fe-generate-api  # Regenerate API client
make fe-test-coverage # Run tests with coverage
make fe-test-e2e      # Run E2E tests
```

## API Client

The TypeScript API client in `src/infrastructure/api/` is **auto-generated** from the backend's OpenAPI spec. Never edit these files manually — changes will be overwritten.

Regenerate after backend API changes:

```bash
pnpm generate-api
```

This fetches the spec from `VITE_OPENAPI_SPEC_URL` (defaults to `http://localhost:44349/swagger/v1/swagger.json`) and writes types, the fetch SDK, Zod schemas, and TanStack Query hooks into `src/infrastructure/api/`.

See [api-client.md](./api-client.md) for full details on the generated client and the proxy pattern.

## Testing

- **Unit tests** use Vitest with `globals: true` (no need to import `describe`/`it`/`expect`).
- Use `renderWithProviders()` from `src/test-utils/test-utils.tsx` to wrap components with `QueryClient` and `AuthProvider`.
- MSW (Mock Service Worker) is configured globally in `src/test-utils/setup.ts` for API mocking.
- **E2E tests** use Playwright (Chromium only) and live in `e2e/`. The dev server starts automatically during local runs.

Coverage thresholds: 70% statements/functions/lines, 65% branches.

See [testing.md](./testing.md) for a full testing guide.

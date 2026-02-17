# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack web application (IIASA GeoTrees) with a React/TanStack SSR frontend and an ABP Framework (.NET) backend. The frontend proxies all API calls through its own `/api/proxy` route to the backend, avoiding CORS issues.

## Commands

### Frontend (run from `frontend/`, uses `pnpm`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests (Vitest, single run) |
| `pnpm test:watch` | Unit tests in watch mode |
| `pnpm test:coverage` | Unit tests with V8 coverage (thresholds: 70% stmt/fn/lines, 65% branches) |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm lint` | Biome lint + file-size check + file-naming check |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm format` | Biome format (write) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm generate-api` | Regenerate TypeScript API client from backend OpenAPI spec |

To run a single test file: `pnpm vitest run path/to/file.test.ts`

### Backend (run from `backend/IIASA.GeoTrees/`)

- `dotnet run` — Start the backend
- `dotnet run -- --migrate-database` — Run DB migrations
- `abp install-libs` — Required once after first clone for client-side libraries

## Architecture

### Frontend (`frontend/src/`)

**Stack**: React 19 + TanStack Start (SSR with Node server) + TanStack Router (file-based) + TanStack Query + Vite

**Feature-based modules** in `src/features/` — each feature (`auth`, `users`, `roles`, `tenants`, `dashboard`, `cms`, `settings`, `profile`, etc.) contains its own `components/`, `hooks/`, `stores/`, `constants.ts`.

**Key layers**:
- `src/routes/` — File-based routing. `routeTree.gen.ts` is auto-generated (gitignored). Routes use `createFileRoute` from `@tanstack/react-router`.
- `src/infrastructure/api/` — Auto-generated TypeScript client (types, SDK, Zod schemas, TanStack Query hooks) from the backend's OpenAPI spec. **Never edit these files manually.**
- `src/infrastructure/auth/` — OIDC/PKCE authentication via `openid-client` with server-side sessions
- `src/shared/` — Reusable components (Shadcn/ui in `components/ui/`), hooks, stores, utils, types

**State management**: Zustand for client state (form/modal stores per feature); TanStack Query for server state.

**API proxy pattern**: The frontend's hey-api client is configured to call `/api/proxy` (the frontend's own server route), which forwards requests to the actual backend (`VITE_API_BASE_URL`).

### Backend (`backend/IIASA.GeoTrees/`)

**Stack**: ASP.NET Core / .NET 10 + ABP Framework 10.0.2 (single-layer template) + PostgreSQL (EF Core) + OpenIddict (OIDC server)

The backend serves as both the API server and the identity/auth provider. Swagger at `/swagger/v1/swagger.json`.

## Conventions

**Formatting (Biome)**: Tabs for indentation, double quotes. Imports are auto-organized.

**File naming**: Enforced kebab-case (`scripts/check-file-naming.js`). Components: `kebab-case.tsx`. Hooks: `kebab-case.ts`. Stores: `kebab-case.ts`. Route files follow TanStack Router conventions (dots allowed, e.g. `auth.login.ts`).

**File size limit**: 500 lines max per `.ts`/`.tsx` file, enforced by `scripts/check-file-size.js`. Excludes generated files (`infrastructure/api/`, `*.gen.ts`).

**Path aliases** (tsconfig):
- `@/*` → `src/*`
- `@/shared/*` → `src/shared/*`
- `@/features/*` → `src/features/*`
- `@/infrastructure/*` → `src/infrastructure/*`

## Testing

**Vitest**: `globals: true` (no imports needed for `describe`/`it`/`expect`). Use `renderWithProviders()` from `src/test-utils/test-utils.tsx` which wraps components with QueryClient + AuthProvider. MSW is set up globally in `src/test-utils/setup.ts`.

**Playwright**: Tests in `e2e/`. Chromium only. Auto-starts dev server in local runs. Base URL configurable via `BASE_URL` env var.

## API Client Regeneration

Run `pnpm generate-api` after backend API changes. This fetches the OpenAPI spec from `VITE_OPENAPI_SPEC_URL` (defaults to `http://localhost:44349/swagger/v1/swagger.json`), generates types + SDK + Zod schemas + TanStack Query hooks into `src/infrastructure/api/`, then use the generated query options:

```typescript
import { userGetListOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
const { data } = useQuery(userGetListOptions({ query: { skipCount: 0, maxResultCount: 10 } }));
```

# Architecture

This document describes the full-stack architecture of IIASA GeoTrees.

## Table of Contents

- [System Overview](#system-overview)
- [API Proxy Pattern](#api-proxy-pattern)
- [Authentication Flow](#authentication-flow)
- [Frontend Layer Architecture](#frontend-layer-architecture)
- [Backend Layer Architecture](#backend-layer-architecture)
- [Full-Stack Request Lifecycle](#full-stack-request-lifecycle)

---

## System Overview

GeoTrees is a full-stack web application with three main runtime components:

- **Frontend** — A TanStack Start (React 19, SSR) app running on port 3000
- **Backend** — An ABP Framework (.NET 10) app running on port 44349 (dev default)
- **Database** — PostgreSQL, accessed by the backend via EF Core

The backend also acts as the **OIDC identity provider** (via OpenIddict), meaning it handles both application API requests and user authentication token issuance.

```
Browser
  │
  ▼
Frontend (TanStack Start, :3000)
  │  /api/proxy/** → forward
  ▼
Backend (ABP Framework, :44349)
  │
  ├── PostgreSQL (data)
  └── OpenIddict (OIDC identity provider)
```

All API traffic from the browser goes to the frontend's Node server first. The frontend then forwards requests to the backend, attaching the user's access token from the server-side session. The browser never communicates directly with the backend.

---

## API Proxy Pattern

### Why the proxy exists

The frontend and backend run on different ports (or different domains in production). Sending API requests directly from the browser to the backend would require CORS configuration and would expose authentication tokens to the browser. The proxy solves both problems:

1. **No CORS issues** — The browser only talks to the frontend's own origin.
2. **Secure token forwarding** — Access tokens are stored in a server-side session, not in browser storage. The proxy reads the token server-side and attaches it to outgoing requests.

### How it works

The hey-api client (`frontend/src/hey-api.ts`) is configured with a `baseUrl` of `/api/proxy` (the value of `API_CONSTANTS.PROXY_PATH`):

```typescript
export const createClientConfig = (config?: Config) => ({
  ...config,
  baseUrl: API_CONSTANTS.PROXY_PATH,
});
```

Every generated API function sends requests to `/api/proxy/<path>` on the frontend server. The TanStack Start server-side route at `src/routes/api/proxy.$.ts` handles all HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD) and:

1. Strips the `/api/proxy/` prefix from the incoming URL path
2. Retrieves the user's access token from the server-side session via `getUserSession()`
3. Attaches an `Authorization: Bearer <token>` header if a session exists
4. Forwards the request to `APP_CONSTANTS.API_BASE_URL/<path>` (the backend)
5. Returns the backend's response to the browser, including CORS headers

If no session is found, the proxy forwards the request without an authorization header, which will typically result in a 401 from the backend.

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `http://localhost:44349` | Backend base URL |
| `VITE_API_PROXY_PATH` | `/api/proxy` | Proxy path prefix on the frontend |
| `VITE_BASE_URL` | `http://localhost:3000` | Frontend base URL (used for absolute proxy URL in SSR) |

---

## Authentication Flow

GeoTrees uses OIDC/PKCE authentication. The backend's OpenIddict server issues tokens; the frontend stores them server-side. See [auth.md](./auth.md) for the full detail.

Brief summary:

1. User navigates to a protected route — the TanStack Start server checks for a valid session.
2. No session found — the server redirects the browser to the backend's OIDC `/connect/authorize` endpoint.
3. The user authenticates on the backend (login page).
4. The backend redirects to `/auth/callback` with an authorization code.
5. The frontend exchanges the code for tokens using PKCE, then stores the tokens in a server-side session (cookie-backed, not accessible to browser JavaScript).
6. Subsequent requests use the session cookie. The proxy route reads the access token from the session and forwards it to the backend.

Tokens are never stored in `localStorage` or exposed to the browser.

---

## Frontend Layer Architecture

```
src/
├── routes/          ← URL routing (TanStack Router, file-based)
├── features/        ← Business logic by domain (auth, map, users, ...)
├── shared/          ← Reusable components, hooks, utils, types
└── infrastructure/  ← API client (generated), auth (OIDC), config
```

### routes/

File-based routing via TanStack Router. Each `.ts` / `.tsx` file under `src/routes/` maps to a URL. `routeTree.gen.ts` is auto-generated and gitignored. Routes use `createFileRoute` from `@tanstack/react-router`.

The `src/routes/api/proxy.$.ts` file is a special server-only route that implements the API proxy (see above).

### features/

Feature-based modules. Each feature (`auth`, `users`, `roles`, `tenants`, `dashboard`, `cms`, `settings`, `profile`, etc.) is self-contained:

```
feature-name/
├── components/   ← Feature-specific React components
├── hooks/        ← Feature-specific hooks
├── stores/       ← Zustand stores (form state, modal state)
└── constants.ts  ← Feature-specific constants
```

### shared/

Code used across multiple features:

- `components/ui/` — Shadcn/ui component library
- `hooks/` — Shared React hooks
- `stores/` — Shared Zustand base store patterns (`BaseFormStore`, `BaseModalStore`)
- `utils/` — Utility functions
- `types/` — Shared TypeScript types
- `constants.ts` — Application-wide constants (API URLs, proxy path, query keys)

### infrastructure/

Low-level concerns that features consume but do not own:

- `api/` — Auto-generated TypeScript client from the backend's OpenAPI spec. Contains types, SDK functions, Zod schemas, and TanStack Query hooks. **Never edit these files manually.** Regenerate with `pnpm generate-api`.
- `auth/` — OIDC/PKCE session management via `openid-client`, server-side session helpers.

### State management

- **Server state** (remote data): TanStack Query. Generated query options (e.g. `userGetListOptions`) are used directly with `useQuery`.
- **Client state** (UI state): Zustand. Per-feature stores manage form open/close state, selected items, modal visibility.

---

## Backend Layer Architecture

```
backend/IIASA.GeoTrees/
├── Controllers/    ← HTTP endpoints (ABP application service auto-API controllers)
├── Services/       ← Application services / business logic
├── Entities/       ← Domain entities (EF Core mapped classes)
├── Data/           ← DbContext, seed data contributors
├── Migrations/     ← EF Core database migrations
├── GeoTreesModule.cs  ← ABP module definition and DI configuration
└── appsettings.json   ← Runtime configuration (connection strings, OIDC, etc.)
```

The backend uses the ABP Framework **single-layer template**, meaning application services, domain logic, and infrastructure are all in one project rather than separated into DDD layers.

ABP auto-generates HTTP API controllers from application service interfaces, so adding a method to a service interface automatically exposes it as a REST endpoint — no explicit controller code required for standard CRUD operations.

The backend exposes a Swagger UI at `/swagger` and an OpenAPI JSON spec at `/swagger/v1/swagger.json`, which is the source used by `pnpm generate-api` to regenerate the frontend API client.

---

## Full-Stack Request Lifecycle

The following traces a typical data-fetch from a React component through to the database and back.

**Example: loading the user list on the Users page**

1. **React component** calls a TanStack Query hook:
   ```typescript
   import { userGetListOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
   const { data } = useQuery(userGetListOptions({ query: { skipCount: 0, maxResultCount: 10 } }));
   ```

2. **TanStack Query** determines the data is not in cache and calls the underlying hey-api generated function.

3. **hey-api** sends `GET /api/proxy/api/identity/users?skipCount=0&maxResultCount=10` to the frontend's Node server (its own origin).

4. **TanStack Start proxy route** (`src/routes/api/proxy.$.ts`) receives the request:
   - Strips the `/api/proxy/` prefix → path becomes `api/identity/users`
   - Reads the access token from the server-side session via `getUserSession()`
   - Builds the target URL: `http://localhost:44349/api/identity/users?skipCount=0&maxResultCount=10`
   - Attaches `Authorization: Bearer <token>` header
   - Forwards the request to the backend

5. **ABP backend** receives the authenticated request:
   - The ABP auto-API controller routes it to the `IdentityUserAppService`
   - The service applies authorization checks (ABP permission system)
   - The service queries PostgreSQL via EF Core
   - Returns a paged result as JSON

6. **Response travels back**:
   - Backend → proxy route → browser
   - TanStack Query stores the response in its cache
   - React component re-renders with the user data

On subsequent renders, TanStack Query serves the response from cache until the cache entry becomes stale (based on `staleTime` configuration).

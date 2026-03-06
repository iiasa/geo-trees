# Documentation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a root-level `docs/` folder with comprehensive Markdown documentation for developers, DevOps/ops teams, and end users of IIASA GeoTrees.

**Architecture:** Audience-based folder structure under `docs/` — `getting-started/`, `developer/`, `deployment/`, `user-guide/`. Plain Markdown, readable on GitHub. Root `README.md` serves as the master hub/index. Existing `frontend/docs/` stays intact; the new `docs/` is the canonical hub.

**Tech Stack:** Markdown only. Source material: `CLAUDE.md`, `frontend/docs/`, `backend/README.md`, root `README.md`, `Makefile`, `frontend/.env.example`, codebase exploration.

---

## Key Reference Files

Before writing any doc, consult these sources:

| Source | What it covers |
|--------|---------------|
| `CLAUDE.md` | Commands, architecture, conventions |
| `frontend/docs/ARCHITECTURE.md` | Frontend feature-based architecture |
| `frontend/docs/OIDC_SETUP.md` | Full OIDC/PKCE auth flow |
| `frontend/docs/TESTING.md` | Testing infrastructure |
| `frontend/docs/FILE_NAMING_CONVENTIONS.md` | Naming conventions |
| `backend/README.md` | ABP setup, Docker, signing certs |
| `frontend/.env.example` | All environment variables |
| `Makefile` | All top-level commands |

---

### Task 1: Root index

**Files:**
- Create: `docs/README.md`

**Step 1: Write `docs/README.md`**

```markdown
# GeoTrees Documentation

IIASA GeoTrees is a full-stack web application for visualizing and managing global tree data.

## Documentation

### Getting Started
New here? Start with [Getting Started](./getting-started/README.md).

- [Prerequisites](./getting-started/prerequisites.md)
- [Local Setup](./getting-started/local-setup.md)
- [Environment Variables](./getting-started/environment-variables.md)

### Developer Guide
- [Developer Overview](./developer/README.md)
- [Architecture](./developer/architecture.md)
- [Frontend](./developer/frontend.md)
- [Backend](./developer/backend.md)
- [Authentication](./developer/auth.md)
- [API Client](./developer/api-client.md)
- [Testing](./developer/testing.md)
- [Conventions](./developer/conventions.md)
- [Contributing](./developer/contributing.md)

### Deployment
- [Deployment Overview](./deployment/README.md)
- [Docker](./deployment/docker.md)
- [Database Migrations](./deployment/database-migrations.md)
- [Production Configuration](./deployment/production-config.md)

### User Guide
- [What is GeoTrees?](./user-guide/README.md)
- [Map](./user-guide/map.md)
- [User Management](./user-guide/user-management.md)
- [CMS](./user-guide/cms.md)

## Tech Stack

**Frontend**: React 19, TanStack Start/Router/Query, MapLibre GL, Zustand, Shadcn/ui, Tailwind CSS, Vite

**Backend**: ASP.NET Core / .NET 10, ABP Framework 10, PostgreSQL, OpenIddict (OIDC)
```

**Step 2: Commit**

```bash
git add docs/README.md
git commit -m "docs: add root documentation index"
```

---

### Task 2: Getting started — prerequisites

**Files:**
- Create: `docs/getting-started/README.md`
- Create: `docs/getting-started/prerequisites.md`

**Step 1: Write `docs/getting-started/README.md`**

```markdown
# Getting Started

Follow these steps to get GeoTrees running locally:

1. [Check prerequisites](./prerequisites.md) — install required tools
2. [Local setup](./local-setup.md) — clone, configure, and run
3. [Environment variables](./environment-variables.md) — understand config options

**Quickstart (if you have all prerequisites):**

```bash
git clone <repo-url>
cd geo-trees
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
make install
make be-migrate   # first run only
make be-run       # in one terminal
make dev          # in another terminal
```

The frontend runs at http://localhost:3000.
The backend runs at https://localhost:44324.
```

**Step 2: Write `docs/getting-started/prerequisites.md`**

Cover each of these with version requirements and install links:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | v20+ | nodejs.org |
| pnpm | latest | `npm install -g pnpm` |
| .NET SDK | 10.0+ | dotnet.microsoft.com |
| PostgreSQL | 14+ | postgresql.org |
| ABP CLI | latest | `dotnet tool install -g Volo.Abp.Cli` |
| Docker (optional) | latest | docker.com |

Also cover: why each tool is needed, how to verify install (e.g. `node -v`, `dotnet --version`).

**Step 3: Commit**

```bash
git add docs/getting-started/
git commit -m "docs: add getting-started prerequisites"
```

---

### Task 3: Getting started — local setup and environment variables

**Files:**
- Create: `docs/getting-started/local-setup.md`
- Create: `docs/getting-started/environment-variables.md`

**Step 1: Write `docs/getting-started/local-setup.md`**

Cover these steps in order:

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd geo-trees
   ```

2. **Configure environment**
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env — at minimum set VITE_SESSION_SECRET
   ```

3. **Install dependencies**
   ```bash
   make install
   # Or individually:
   # cd frontend && pnpm install
   # cd backend/IIASA.GeoTrees && abp install-libs
   ```

4. **Configure the database** — edit `backend/IIASA.GeoTrees/appsettings.json`, set PostgreSQL connection string

5. **Run database migrations** (first run only)
   ```bash
   make be-migrate
   ```

6. **Run the backend** (terminal 1)
   ```bash
   make be-run
   # Backend runs at https://localhost:44324
   ```

7. **Run the frontend** (terminal 2)
   ```bash
   make dev
   # Frontend runs at http://localhost:3000
   ```

Also note: `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in `.env.example` to allow the frontend to call the backend's self-signed HTTPS cert in development.

**Step 2: Write `docs/getting-started/environment-variables.md`**

Document every variable from `frontend/.env.example`:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_OIDC_ISSUER` | `https://localhost:44324` | OIDC provider URL (the backend acts as the identity server) |
| `VITE_OIDC_CLIENT_ID` | `GeoTrees_React` | OIDC client ID registered in the backend |
| `VITE_BASE_URL` | `http://localhost:3000` | Frontend base URL |
| `VITE_OIDC_REDIRECT_URI` | `http://localhost:3000/auth/callback` | OIDC callback URL after login |
| `VITE_SESSION_SECRET` | — | Secret for server-side session encryption. **Must be changed in production.** |
| `VITE_API_BASE_URL` | `https://localhost:44324` | Backend API base URL |
| `VITE_API_PROXY_PATH` | `/api/proxy` | Frontend route that proxies backend requests |
| `VITE_OPENAPI_SPEC_URL` | `https://localhost:44324/swagger/v1/swagger.json` | URL used by `pnpm generate-api` to fetch the OpenAPI spec |
| `VITE_APP_NAME` | `geo-trees` | Application name |
| `VITE_APP_VERSION` | `v1` | Application version |
| `VITE_OIDC_SCOPES` | `openid profile email offline_access GeoTrees` | OIDC scopes requested on login |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` | Disable TLS verification in dev (self-signed cert). Set to `1` in production. |

**Step 3: Commit**

```bash
git add docs/getting-started/local-setup.md docs/getting-started/environment-variables.md
git commit -m "docs: add local setup and environment variables guides"
```

---

### Task 4: Developer — architecture

**Files:**
- Create: `docs/developer/README.md`
- Create: `docs/developer/architecture.md`

**Step 1: Write `docs/developer/README.md`**

Short index linking all developer docs. Similar structure to the root README developer section.

**Step 2: Write `docs/developer/architecture.md`**

Cover:

1. **Overview diagram** — describe (in text) the layered architecture:
   - Browser → Frontend (TanStack Start, port 3000)
   - Frontend → `/api/proxy` → Backend (ABP Framework, port 44324)
   - Backend → PostgreSQL
   - Backend also acts as OIDC provider (OpenIddict)

2. **API Proxy Pattern** — explain why: CORS avoidance. The frontend's `src/routes/api/proxy.$.ts` forwards all `/api/proxy/**` requests to the backend. The hey-api client is configured with `baseUrl: /api/proxy`.

3. **Authentication flow overview** — browser does OIDC Authorization Code + PKCE with the backend as the identity provider. Tokens stored server-side in TanStack Start sessions. (Link to `developer/auth.md` for full detail.)

4. **Frontend layers**: routes → features → shared → infrastructure

5. **Backend layers**: Controllers → Services → Entities → Data (EF Core) → PostgreSQL

6. **Full-stack request lifecycle**: user action → React component → TanStack Query → hey-api client → `/api/proxy` → backend controller → service → DB → response back up the chain

**Step 3: Commit**

```bash
git add docs/developer/README.md docs/developer/architecture.md
git commit -m "docs: add developer overview and architecture"
```

---

### Task 5: Developer — frontend

**Files:**
- Create: `docs/developer/frontend.md`

**Step 1: Write `docs/developer/frontend.md`**

Cover these sections:

1. **Tech stack** — React 19, TanStack Start (SSR), TanStack Router (file-based), TanStack Query, Vite, Tailwind CSS v4, Shadcn/ui, MapLibre GL, Zustand

2. **Folder structure** — expand what's in CLAUDE.md:
   ```
   frontend/src/
   ├── features/       # auth, users, roles, tenants, dashboard, map, map-layers,
   │                   # cms, profile, settings, feature-flags, permission-admin, demo
   ├── infrastructure/ # api/ (auto-generated), auth/ (OIDC)
   ├── routes/         # File-based routing (TanStack Router)
   └── shared/         # components/ui (Shadcn), hooks, stores, utils, types
   ```

3. **Feature module pattern** — each feature has:
   - `components/` — kebab-case `.tsx` files
   - `hooks/` — kebab-case `.ts`/`.tsx` files
   - `stores/` — Zustand stores (`[feature]-form-store.ts`, `[feature]-modal-store.ts`)
   - `constants.ts`

4. **Routing** — TanStack Router file-based routing. `src/routes/` maps to URL paths. `routeTree.gen.ts` is auto-generated (gitignored, do not edit). Route files use `createFileRoute`.

5. **State management**:
   - **Server state**: TanStack Query (auto-generated hooks from API client)
   - **Client state**: Zustand stores per feature

6. **UI components** — Shadcn/ui components live in `src/shared/components/ui/`. Use these before creating custom components.

7. **Path aliases** — `@/*`, `@/shared/*`, `@/features/*`, `@/infrastructure/*`

8. **Key commands** — `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`

**Step 2: Commit**

```bash
git add docs/developer/frontend.md
git commit -m "docs: add frontend developer guide"
```

---

### Task 6: Developer — backend

**Files:**
- Create: `docs/developer/backend.md`

**Step 1: Write `docs/developer/backend.md`**

Cover:

1. **Tech stack** — ASP.NET Core / .NET 10, ABP Framework 10.0.2 (single-layer template), EF Core, PostgreSQL, OpenIddict

2. **What ABP provides** — multi-tenancy, identity/user management, permission system, localization, audit logging, OpenIddict OIDC server, Swagger

3. **Folder structure**:
   ```
   backend/IIASA.GeoTrees/
   ├── Controllers/      # API endpoints (extend ABP base controllers)
   ├── Services/         # Application services / business logic
   ├── Entities/         # EF Core domain entities
   ├── Data/             # DbContext, seed data
   ├── Migrations/       # EF Core migrations (auto-generated)
   ├── Permissions/      # Permission definitions
   ├── Settings/         # Application settings definitions
   ├── ObjectMapping/    # AutoMapper profiles
   ├── Localization/     # JSON localization files
   ├── Extensions/       # Extension methods
   ├── GeoTreesModule.cs # Main ABP module class (DI, middleware, config)
   └── Program.cs        # Entry point
   ```

4. **Adding a new API endpoint** — create entity → add to DbContext → create migration → create service → create controller → run `pnpm generate-api` in frontend

5. **Key commands** — `dotnet run`, `dotnet run -- --migrate-database`, `dotnet build`, `abp install-libs`

6. **Swagger** — available at `https://localhost:44324/swagger` when running locally

**Step 2: Commit**

```bash
git add docs/developer/backend.md
git commit -m "docs: add backend developer guide"
```

---

### Task 7: Developer — authentication

**Files:**
- Create: `docs/developer/auth.md`

**Step 1: Write `docs/developer/auth.md`**

This is a summary doc — for full detail, refer to `frontend/docs/OIDC_SETUP.md`.

Cover:

1. **Overview** — The backend (ABP + OpenIddict) serves as both the API server and OIDC identity provider. The frontend authenticates using Authorization Code Flow + PKCE.

2. **Auth flow**:
   - User visits protected route → TanStack Start server checks session
   - No session → redirect to backend OIDC `/connect/authorize`
   - User logs in → backend redirects to `VITE_OIDC_REDIRECT_URI` with auth code
   - Frontend exchanges code for tokens (PKCE) → stores tokens in server-side session
   - Subsequent requests use session cookie

3. **Key files**:
   - `frontend/src/infrastructure/auth/` — OIDC client setup, token refresh, session handling
   - `frontend/src/routes/auth.callback.ts` — handles OIDC redirect
   - `frontend/src/routes/auth.login.ts` — initiates login
   - `frontend/src/routes/auth.logout.ts` — handles logout

4. **Session management** — tokens stored server-side via TanStack Start's session API. The `VITE_SESSION_SECRET` env var encrypts the session.

5. **Token refresh** — handled automatically by the auth infrastructure before expiry.

6. **Adding auth to a route** — show how to use the auth loader in a route file to protect it.

7. **Link to full guide**: `frontend/docs/OIDC_SETUP.md`

**Step 2: Commit**

```bash
git add docs/developer/auth.md
git commit -m "docs: add authentication developer guide"
```

---

### Task 8: Developer — API client

**Files:**
- Create: `docs/developer/api-client.md`

**Step 1: Write `docs/developer/api-client.md`**

Cover:

1. **Overview** — The TypeScript API client in `frontend/src/infrastructure/api/` is **auto-generated** from the backend's OpenAPI spec. Never edit these files manually.

2. **What's generated**:
   - Type definitions (request/response shapes)
   - hey-api SDK functions
   - Zod schemas for validation
   - TanStack Query hooks (`*Options`, `*Mutation`)

3. **How to use**:
   ```typescript
   import { userGetListOptions } from "@/infrastructure/api/@tanstack/react-query.gen";

   // In a component:
   const { data } = useQuery(
     userGetListOptions({ query: { skipCount: 0, maxResultCount: 10 } })
   );
   ```

4. **Regenerating after backend changes**:
   ```bash
   # Backend must be running at VITE_OPENAPI_SPEC_URL
   cd frontend
   pnpm generate-api
   # Or from root:
   make fe-generate-api
   ```

5. **Proxy configuration** — the hey-api client sends all requests to `/api/proxy` (the frontend's own server route), which forwards to `VITE_API_BASE_URL`. This avoids CORS issues.

6. **hey-api config** — see `frontend/hey-api.config.ts` for generator configuration.

**Step 2: Commit**

```bash
git add docs/developer/api-client.md
git commit -m "docs: add API client developer guide"
```

---

### Task 9: Developer — testing, conventions, contributing

**Files:**
- Create: `docs/developer/testing.md`
- Create: `docs/developer/conventions.md`
- Create: `docs/developer/contributing.md`

**Step 1: Write `docs/developer/testing.md`**

This is a summary that points to `frontend/docs/TESTING.md` for full detail. Cover:

1. **Testing stack**: Vitest (unit/integration), React Testing Library, MSW (API mocking), Playwright (E2E)
2. **Running tests**:
   ```bash
   make test                  # unit tests
   make fe-test-coverage      # with coverage
   make fe-test-e2e           # Playwright E2E
   pnpm vitest run path/to/file.test.ts  # single file
   ```
3. **Coverage thresholds**: 70% statements/functions/lines, 65% branches
4. **`renderWithProviders()`** — use this helper from `src/test-utils/test-utils.tsx` for components that need QueryClient + AuthProvider
5. **`globals: true`** in Vitest config — no need to import `describe`/`it`/`expect`
6. **MSW handlers** in `src/test-utils/mock-handlers.ts`
7. **Link**: full guide at `frontend/docs/TESTING.md`

**Step 2: Write `docs/developer/conventions.md`**

This is a summary pointing to `frontend/docs/FILE_NAMING_CONVENTIONS.md`. Cover:

1. **File naming** — kebab-case for all `.ts`/`.tsx` files. Components: `user-form.tsx`. Hooks: `use-auth.ts`. Stores: `user-form-store.ts`. Routes allow dots: `auth.login.ts`.
2. **File size limit** — 500 lines max for `.ts`/`.tsx` (enforced by CI). Split large components.
3. **Formatting** — Biome: tabs for indentation, double quotes. Run `pnpm lint:fix` to auto-fix.
4. **Import aliases** — use `@/shared/*`, `@/features/*`, `@/infrastructure/*` (not relative paths).
5. **Constants** — always named `constants.ts`, never `app-constants.ts`.
6. **Generated files** — `src/infrastructure/api/` and `src/routeTree.gen.ts` are auto-generated. Never edit manually.

**Step 3: Write `docs/developer/contributing.md`**

Cover:

1. **Branch workflow** — create a feature branch from `main`, work there, open a PR
2. **Before opening a PR** — run `make lint`, `make test`, `make typecheck` and ensure they all pass
3. **Commit style** — conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
4. **PR checklist**:
   - Tests added/updated
   - `pnpm lint` passes
   - `pnpm typecheck` passes
   - `pnpm test` passes
   - If backend changed: `pnpm generate-api` run and changes committed
5. **Code review** — PRs require review before merge
6. **Adding a new feature** — follow the feature module pattern (see `developer/frontend.md`)

**Step 4: Commit**

```bash
git add docs/developer/testing.md docs/developer/conventions.md docs/developer/contributing.md
git commit -m "docs: add testing, conventions, and contributing guides"
```

---

### Task 10: Deployment docs

**Files:**
- Create: `docs/deployment/README.md`
- Create: `docs/deployment/docker.md`
- Create: `docs/deployment/database-migrations.md`
- Create: `docs/deployment/production-config.md`

**Step 1: Write `docs/deployment/README.md`**

Short index of deployment options:
- Local development (see Getting Started)
- Docker Compose — recommended for staging/production
- Manual deployment — deploy frontend Node server + backend ASP.NET Core app separately

**Step 2: Write `docs/deployment/docker.md`**

Cover:

1. **Full-stack Docker Compose**:
   ```bash
   make docker-up    # start everything
   make docker-down  # stop everything
   ```

2. **Frontend only**:
   ```bash
   make docker-fe-up
   make docker-fe-down
   ```

3. **Backend only** (includes Postgres):
   ```bash
   make docker-be-up
   make docker-be-down
   ```

4. **Building backend images manually**:
   - Navigate to `backend/etc/build/`
   - Run `build-images-locally.ps1` (PowerShell)
   - Default image tag: `latest`

5. **Running backend via Docker Compose script**:
   - Navigate to `backend/etc/docker/`
   - Run `run-docker.ps1` — generates dev certs and starts containers in detached mode
   - Stop with `stop-docker.ps1`

6. **Dockerfiles**:
   - `frontend/Dockerfile`
   - `backend/IIASA.GeoTrees/Dockerfile`
   - `backend/IIASA.GeoTrees/Dockerfile.local`

**Step 3: Write `docs/deployment/database-migrations.md`**

Cover:

1. **Running migrations**:
   ```bash
   make be-migrate
   # Equivalent to:
   cd backend/IIASA.GeoTrees && dotnet run -- --migrate-database
   ```

2. **When to run**: first-time setup, after pulling changes that include new migrations, before deploying a new version

3. **Creating new migrations** (for developers adding entities):
   ```bash
   cd backend/IIASA.GeoTrees
   dotnet ef migrations add MigrationName
   ```

4. **Migration files** live in `backend/IIASA.GeoTrees/Migrations/`

**Step 4: Write `docs/deployment/production-config.md`**

Cover:

1. **OpenIddict signing certificate** — production requires a real certificate:
   ```bash
   dotnet dev-certs https -v -ep openiddict.pfx -p <your-password>
   ```
   Recommend using two RSA certificates (one for signing, one for encryption). See ABP docs for details.

2. **Environment variables to set in production**:
   - `VITE_SESSION_SECRET` — strong random string (never use the default)
   - `VITE_BASE_URL` — your production frontend URL
   - `VITE_OIDC_REDIRECT_URI` — your production callback URL
   - `VITE_API_BASE_URL` — your production backend URL
   - `VITE_OIDC_ISSUER` — your production backend URL
   - `NODE_TLS_REJECT_UNAUTHORIZED=1` — enable TLS verification in production

3. **Database connection string** — set in `backend/IIASA.GeoTrees/appsettings.json` or via environment variable (`ConnectionStrings__Default`)

4. **HTTPS** — use a real TLS cert (Let's Encrypt or similar) for production domains

**Step 5: Commit**

```bash
git add docs/deployment/
git commit -m "docs: add deployment guides"
```

---

### Task 11: User guide

**Files:**
- Create: `docs/user-guide/README.md`
- Create: `docs/user-guide/map.md`
- Create: `docs/user-guide/user-management.md`
- Create: `docs/user-guide/cms.md`

**Step 1: Explore feature code before writing**

Read these files to understand what each feature does:
- `frontend/src/features/map/` — components, hooks, constants
- `frontend/src/features/map-layers/` — components, hooks
- `frontend/src/features/users/` — components
- `frontend/src/features/roles/` — components
- `frontend/src/features/cms/` — components
- `frontend/src/features/dashboard/` — components

**Step 2: Write `docs/user-guide/README.md`**

Cover:
- What is GeoTrees: a web application for visualizing and managing global tree/geospatial data
- Who it's for: researchers, data managers, administrators
- Key features: interactive map, layer management, user/role administration, CMS, dashboard
- How to log in (navigate to the app, click Login, authenticate with your credentials)

**Step 3: Write `docs/user-guide/map.md`**

Based on code exploration, cover:
- How to open the map
- Navigating the map (pan, zoom)
- 3D view toggle (if available)
- Map layers panel — adding/removing layers
- Any layer configuration options

**Step 4: Write `docs/user-guide/user-management.md`**

Cover:
- Accessing user management (requires admin role)
- Listing users
- Creating a new user
- Editing a user
- Assigning roles to users
- Managing roles — creating and editing roles
- Permissions — what permissions control access to

**Step 5: Write `docs/user-guide/cms.md`**

Based on `frontend/src/features/cms/` and `frontend/docs/CMS_IMPROVEMENTS_SUMMARY.md`, cover:
- What the CMS does
- Navigating CMS content
- Creating/editing content
- Publishing content

**Step 6: Commit**

```bash
git add docs/user-guide/
git commit -m "docs: add user guide"
```

---

## Implementation Notes

- **Do not edit** `frontend/docs/` — those remain frontend-specific docs; the new `docs/` is the project-wide hub
- **Cross-link** docs: e.g. `developer/auth.md` links to `frontend/docs/OIDC_SETUP.md` for full detail
- **Explore code** before writing user-facing docs (especially map and CMS) — don't guess at feature behavior
- For user-guide docs, explore the relevant `frontend/src/features/` folder first (Task 11 Step 1)

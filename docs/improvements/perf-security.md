# Performance & Security Hardening

Bundle size, SSR, runtime performance, auth/session, headers, and dependency hygiene.

### PS-01 — Bundle size audit & route-level code splitting
- **Stack:** frontend
- **Effort:** M
- **Why:** Dependencies include ~25 Radix packages plus Puck, Tabler icons, MapLibre GL, dnd-kit, TanStack Table. No bundle budget is enforced.
- **Pointers:** `package.json` deps list. Run `vite build` and inspect `dist/` chunk sizes; consider `rollup-plugin-visualizer`.
- **Approach:** Generate a bundle report, set a budget (e.g. <500KB initial JS), lazy-load admin routes (`features/users`, `features/roles`, `features/tenants`, `features/cms/*`) and the Puck editor.

### PS-02 — SSR cold-start measurement
- **Stack:** frontend
- **Effort:** S
- **Why:** TanStack Start runs an SSR Node server (`node .output/server/index.mjs`). No baseline TTFB exists; modules pulled into SSR but unused there cost cold-start time.
- **Pointers:** `vite.config.ts`, `src/router.tsx`, the Node start command in `package.json`.
- **Approach:** Capture TTFB on a cold container (5 measurements, p50/p95). Use Node `--cpu-prof` to spot expensive module-init. File follow-ups per finding.

### PS-03 — Map tile/source caching
- **Stack:** frontend
- **Effort:** M
- **Why:** BRM and ALS layers fetch tiles/data on every map load. No client-side caching of tile responses today.
- **Pointers:** `features/map/components/`, `features/map-layers/`, browser DevTools network tab on a map session.
- **Approach:** Verify HTTP cache headers on tile responses (check the proxy and backend). If acceptable, consider a service worker to retain tiles offline.

### PS-04 — CSP & security headers
- **Stack:** frontend
- **Effort:** M
- **Why:** No CSP / HSTS / Referrer-Policy / Permissions-Policy on the Node frontend server. Recent proxy hardening (`3afd1ac`) didn't include headers.
- **Pointers:** `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/api/proxy.$.ts` (the proxy route).
- **Approach:** Add headers middleware setting CSP (script-src 'self', style-src 'self' 'unsafe-inline' for now, connect-src to backend), HSTS in prod, Referrer-Policy `strict-origin-when-cross-origin`. Document in `docs/deployment/production-config.md`.

### PS-05 — Cookie/session test matrix
- **Stack:** frontend
- **Effort:** S
- **Why:** No tests assert cookie flags on the auth set-cookie paths, so a regression in `SameSite` / `Secure` / `HttpOnly` could land silently.
- **Pointers:** `src/infrastructure/auth/session.ts`, `src/infrastructure/auth/auth-server.ts` (311 lines).
- **Approach:** Add unit tests asserting `SameSite=Lax|Strict`, `Secure` (in prod), `HttpOnly` on every set-cookie path. Run against `auth-server.ts` directly.

### PS-06 — Dependency audit in CI
- **Stack:** infra
- **Effort:** S
- **Why:** Recent chores cleared frontend and backend vulnerabilities. Without CI gating, the next vuln slips in unnoticed.
- **Pointers:** `.github/workflows/frontend-ci.yml`, `.github/workflows/backend-ci.yml`, `package.json`, `backend/IIASA.GeoTrees/*.csproj`.
- **Approach:** Add a job that runs `pnpm audit --prod --audit-level high` and `dotnet list package --vulnerable --include-transitive`. Fail the build on high/critical. Allow scheduled-only run if it's too noisy on PRs.

### PS-07 — Rate-limit `/api/proxy` and auth endpoints
- **Stack:** frontend
- **Effort:** M
- **Why:** The Node server forwards all `/api/proxy/*` requests without throttling. Auth endpoints (`/auth/*`) are similarly unprotected at the edge — backend handles its own rate-limiting, but the frontend can shed load earlier.
- **Pointers:** `src/routes/api/proxy.*`, `src/routes/auth/*`.
- **Approach:** Add a per-IP token-bucket middleware (e.g. `@upstash/ratelimit` if Redis is available, or in-memory for single-instance). Higher limits on `/api/proxy/*`, tighter on `/auth/login`.

### PS-08 — ABP authorization policy audit
- **Stack:** backend
- **Effort:** M
- **Why:** ABP application services default to authenticated-only, but explicit permission attributes per action are easy to forget. A single anonymous endpoint is a security incident.
- **Pointers:** `backend/IIASA.GeoTrees/**/*AppService.cs`, ABP `Authorize` and `PermissionDefinitionProvider` classes.
- **Approach:** Grep all `[AllowAnonymous]` / missing `[Authorize]`. Document each intentionally-public endpoint. Consider a Roslyn analyzer to enforce.

### PS-09 — PostgreSQL connection pool config
- **Stack:** backend
- **Effort:** S
- **Why:** Default Npgsql pool size may not fit production load. No documented value exists.
- **Pointers:** Backend connection-string configuration (`appsettings.json`, env override).
- **Approach:** Document chosen `Maximum Pool Size` and `Connection Idle Lifetime`. Validate against expected concurrency. Surface via env so prod can override.

### PS-10 — OpenIddict signing cert rotation runbook
- **Stack:** infra
- **Effort:** S
- **Why:** `docs/deployment/production-config.md` already documents auto-generation behaviour (§ "Certificate Auto-Generation in Docker"), but has no rotation runbook — what persists across pod restarts, how to rotate, what tokens it invalidates.
- **Pointers:** `docs/deployment/production-config.md:16-18`, `backend/IIASA.GeoTrees/Dockerfile` entrypoint, commit `8d9d7f4`.
- **Approach:** Extend the existing section with: persistence (volume mount expectations), rotation procedure, token-invalidation impact, and recovery if the cert is lost.

### PS-11 — Health & readiness probe docs
- **Stack:** infra
- **Effort:** S
- **Why:** `docs/deployment/docker.md` names the frontend probe (`GET /api/health` every 30s) but the backend probe is undocumented and the recent `ASPNETCORE_URLS` work (`016ef98`, `8a6e862`) shows it was in flux.
- **Pointers:** `docs/deployment/docker.md:23,67`, backend health check registrations, commits `016ef98` and `8a6e862`.
- **Approach:** Add backend probe URL, expected status codes, and what each check verifies (DB, OpenIddict, etc.) — alongside the existing frontend probe doc in `docs/deployment/docker.md`.

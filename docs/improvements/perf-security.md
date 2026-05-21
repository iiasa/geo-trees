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
- **Why:** BRM and ALS layers fetch tiles/data on every map load. Recent commit `e086a3d feat: refactor map layers and add new BRM and ALS data handling` is the right area.
- **Pointers:** `features/map/components/`, `features/map-layers/`, browser DevTools network tab on a map session.
- **Approach:** Verify HTTP cache headers on tile responses (check the proxy and backend). If acceptable, consider a service worker to retain tiles offline.

### PS-04 — CSP & security headers
- **Stack:** frontend
- **Effort:** M
- **Why:** No documented CSP / HSTS / Referrer-Policy / Permissions-Policy on the Node frontend server. Recent proxy hardening (`3afd1ac chore(frontend): clear advisories and harden proxy/session`) didn't include headers.
- **Pointers:** Wherever the Node start handler is wired (TanStack Start middleware), and `src/routes/api/proxy.*` for proxied responses.
- **Approach:** Add headers middleware setting CSP (script-src 'self', style-src 'self' 'unsafe-inline' for now, connect-src to backend), HSTS in prod, Referrer-Policy `strict-origin-when-cross-origin`. Document in `docs/deployment/production-config.md`.

### PS-05 — Cookie/session test matrix
- **Stack:** frontend
- **Effort:** S
- **Why:** Recent hardening fixed proxy/session issues. Without tests asserting cookie flags, regressions could land silently.
- **Pointers:** `src/infrastructure/auth/session.ts`, `src/infrastructure/auth/auth-server.ts` (311 lines).
- **Approach:** Add unit tests asserting `SameSite=Lax|Strict`, `Secure` (in prod), `HttpOnly` on every set-cookie path. Run against `auth-server.ts` directly.

### PS-06 — Dependency audit in CI
- **Stack:** infra
- **Effort:** S
- **Why:** Recent chores cleared frontend and backend vulnerabilities. Without CI gating, the next vuln slips in unnoticed.
- **Pointers:** `.github/workflows/` (or wherever CI is configured), `package.json`, `backend/IIASA.GeoTrees/*.csproj`.
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
- **Why:** Container entrypoint generates the OpenIddict signing certificate on first run (`backend/IIASA.GeoTrees/Dockerfile` entrypoint script). Behavior on cert change or pod restart isn't documented.
- **Pointers:** `backend/IIASA.GeoTrees/Dockerfile`, recent commit `8d9d7f4 feat: add custom entrypoint script for OpenIddict certificate generation`.
- **Approach:** Document: where the cert lives, what persists it across restarts, how to rotate, what client tokens it invalidates. Add to `docs/deployment/production-config.md`.

### PS-11 — Health & readiness probe docs
- **Stack:** infra
- **Effort:** S
- **Why:** Recent `ASPNETCORE_URLS`-based health-check work shows this is in flux. Operators don't know which URL to probe or what counts as healthy.
- **Pointers:** Backend health check registrations, commits `016ef98` and `8a6e862`.
- **Approach:** Document the probe URL, expected status codes, and what each check verifies (DB, OpenIddict, etc.) in `docs/deployment/`.

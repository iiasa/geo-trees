# Code Quality & Tech Debt

Refactors, dead code removal, test gaps, and consistency cleanups.

### CQ-01 — Split oversized form components
- **Stack:** frontend
- **Effort:** M
- **Why:** Four `*-form.tsx` files are within 5-130 lines of the enforced 500-line cap. One more field added and a build breaks.
- **Pointers:** `features/cms/menu-items/components/menu-item-form.tsx` (495), `features/map-layers/components/map-layer-form.tsx` (471), `features/users/components/user-form.tsx` (463), `features/auth/components/register-form.tsx` (370).
- **Approach:** Extract field groups into co-located sub-components (e.g. `menu-item-form/general-fields.tsx`). Keep schema + submit logic in the parent. Pair with CQ-07.

### CQ-02 — Remove starter-template dead code
- **Stack:** frontend
- **Effort:** S
- **Why:** Leftover from the TanStack Start scaffold — adds bundle weight, confuses new contributors, and `server-funcs.tsx` writes a `todos.json` file at runtime.
- **Pointers:** `src/routes/demo/` (incl. `client.tsx` 376 lines, `start/server-funcs.tsx`), `src/features/demo/` (only contains `constants.ts`), `src/shared/data/demo.punk-songs.ts`.
- **Approach:** Delete the three locations. Check `routeTree.gen.ts` regenerates clean. Verify no production route links to demo paths.

### CQ-03 — Close test coverage gaps
- **Stack:** frontend
- **Effort:** L
- **Why:** 21 test files for 303 source files. Vitest thresholds are configured at 70% statements / 65% branches — verify they're actually met and identify the weakest features.
- **Pointers:** `vitest.config.ts` (thresholds), run `pnpm test:coverage` and inspect the V8 report. `features/map/` has only 2 tests (store + util) and no component tests; `features/cms/`, `features/dashboard/`, `features/settings/` likewise need a coverage audit.
- **Approach:** Generate a baseline coverage report, list features below threshold, file one follow-up item per feature. Start with map components (no test files exist for any `*.tsx` in `features/map/components/`).

### CQ-04 — Expand E2E coverage
- **Stack:** frontend
- **Effort:** M
- **Why:** `e2e/` covers auth, dashboard, roles, users. The map and CMS — the two largest features — have no E2E coverage. CMS permission gating (PB-10) needs an E2E test too.
- **Pointers:** `e2e/auth-flows.spec.ts`, `e2e/auth.spec.ts`, `e2e/dashboard.spec.ts`, `e2e/roles.spec.ts`, `e2e/users.spec.ts`.
- **Approach:** Add `map.spec.ts` (layer toggle, 3D toggle, feature popup, download panel), `cms-pages.spec.ts` (Puck save/publish round-trip + non-admin gate per PB-10), `tenants.spec.ts`, `settings.spec.ts`.

### CQ-05 — Centralize error / toast pipeline
- **Stack:** frontend
- **Effort:** M
- **Why:** ~10 sites call `console.error("X failed:", error)` in auth, profile, and CMS forms — errors disappear silently from the user's perspective. A `<Toaster>` is already mounted (`src/routes/__root.tsx:118`) but no helper wraps it.
- **Pointers:** `features/auth/hooks/use-auth.tsx:141,166`, `features/auth/components/forgot-password-form.tsx:46`, `features/auth/components/reset-password-form.tsx:66`, `features/auth/components/register-form.tsx:68`, `features/profile/hooks/use-profile-data.ts:39,55`, `features/tenants/components/tenant-connection-string-modal.tsx:90`.
- **Approach:** Add `shared/utils/notify.ts` with `notifyError(error, fallback)` and `notifySuccess(msg)` backed by Sonner. Replace each `console.error` site. Pair with UX-07.

### CQ-06 — Audit type escape hatches
- **Stack:** frontend
- **Effort:** S
- **Why:** Type safety is otherwise clean — only 4 files use `as any` / `@ts-expect-error`. Document each or eliminate, before the pattern spreads.
- **Pointers:** `shared/hooks/use-permissions.ts`, `shared/components/permission-guard.tsx`, `features/cms/pages/config/components/table-block.tsx`, `features/tenants/stores/__tests__/tenant-connection-store.test.ts`.
- **Approach:** Inspect each, add a comment explaining why if it must stay (e.g. generic constraint a library can't express), otherwise fix with narrower types.

### CQ-07 — Shared form abstraction
- **Stack:** frontend
- **Effort:** M
- **Why:** Every feature with a form (users, roles, tenants, menu-items, pages, map-layers, auth) repeats the same react-hook-form + zod + Radix-field plumbing. Drives file-size pressure (see CQ-01).
- **Pointers:** Compare `features/users/components/user-form.tsx`, `features/map-layers/components/map-layer-form.tsx`, `features/cms/menu-items/components/menu-item-form.tsx`.
- **Approach:** Extract `shared/components/form/` primitives — `<FormShell>` (handles submit + error toast), `<FormField>` (label + input + error). Migrate one form first as a proof.

### CQ-08 — Refactor `map-view.tsx`
- **Stack:** frontend
- **Effort:** M
- **Why:** 443-line component mixes layer setup, event handler wiring, viewport state, and rendering. Hard to test, easy to break when adding layers.
- **Pointers:** `features/map/components/map-view.tsx`.
- **Approach:** Extract `useMapLayers(map, layers)` and `useMapEvents(map, callbacks)` hooks. Move source/layer definitions to `features/map/constants/`.

### CQ-09 — Backend: review largest app service
- **Stack:** backend
- **Effort:** M
- **Why:** `Services/Plots/PlotAppService.cs` is 442 lines — by far the largest service (next-largest is 145 lines). No explicit sizing guideline for `.cs` files exists.
- **Pointers:** `backend/IIASA.GeoTrees/Services/Plots/PlotAppService.cs`, `docs/developer/backend.md`.
- **Approach:** Refactor `PlotAppService` into focused services (CRUD vs query vs status transitions). Add a "split when >400 lines" guideline section to `docs/developer/backend.md`. A Roslyn analyzer to enforce is a separate follow-up.

### CQ-10 — Document store conventions
- **Stack:** frontend
- **Effort:** S
- **Why:** `shared/stores/base-store.ts` + `base-modal-store.ts` provide a good pattern, but new contributors won't find it without reading source.
- **Pointers:** `src/shared/stores/base-store.ts`, `src/shared/stores/base-modal-store.ts`, `src/shared/stores/base-store.test.ts`.
- **Approach:** Add `docs/developer/state.md` covering: Zustand for client state, TanStack Query for server state, when to use base-store vs base-modal-store, naming conventions.

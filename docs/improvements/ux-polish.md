# UX & UI Polish

Accessibility, responsive design, loading and error states, design-system consistency.

### UX-01 — Map a11y baseline
- **Stack:** frontend
- **Effort:** M
- **Why:** Zero `aria-label` / `role` occurrences across all 10 tsx files in `features/map/`. Screen-reader users can't operate the map. Pair with UX-05 (keyboard).
- **Pointers:** `features/map/components/` (map-view, map-controls, map-header, map-legend, layer-panel, download-panel, basemap-switcher, map-page, map-control-container) and `features/map/components/controls/` (incl. scale-bar).
- **Approach:** Add `aria-label` to every control (zoom, pan, 3D toggle, layer toggles, legend toggle, download button). Provide an accessible text description of the map canvas. Verify with axe-core or Lighthouse a11y.

### UX-02 — Loading state audit
- **Stack:** frontend
- **Effort:** S
- **Why:** TanStack Query exposes `isPending` everywhere — coverage is uneven. Some routes show empty space during load.
- **Pointers:** All `useQuery` call sites across `features/*`.
- **Approach:** Sweep features and confirm each `isPending` path renders a skeleton or spinner. Standardize on `<TableSkeleton>`, `<FormSkeleton>`, `<CardSkeleton>` in `shared/components/`.

### UX-03 — ErrorBoundary placement
- **Stack:** frontend
- **Effort:** S
- **Why:** `shared/components/error-boundary.tsx` exists but is not imported anywhere under `src/routes/` or in `router.tsx` — a thrown render error currently crashes the whole app.
- **Pointers:** `src/shared/components/error-boundary.tsx`, `src/routes/__root.tsx`, `src/routes/_authed.tsx`, `src/router.tsx`.
- **Approach:** Wrap `__root.tsx` children in `<ErrorBoundary>`. Add local boundaries around the map and Puck editor (their errors should not blank the page chrome).

### UX-04 — Mobile responsiveness pass
- **Stack:** frontend
- **Effort:** M
- **Why:** `shared/hooks/use-mobile.ts` exists but isn't a guarantee that every route works at 375px. Map, dashboard tables, and the Puck editor are highest risk.
- **Pointers:** All route components; Chrome DevTools responsive mode at 375px.
- **Approach:** Walk every route at 375x667 and 768x1024. Catalog breaks. Fix systemic issues first (sidebar collapse, table horizontal scroll), then route-specific.

### UX-05 — Keyboard navigation
- **Stack:** frontend
- **Effort:** M
- **Why:** Mouse-only operation is an a11y and power-user gap. Map controls and the Puck editor are the weakest spots. Pair with UX-01 (map a11y labels).
- **Pointers:** `features/map/components/`, `features/cms/pages/components/puck-editor.tsx`.
- **Approach:** Verify Tab order is logical, Esc closes popovers/dialogs, arrow keys pan the map, Enter/Space activate controls. Document keyboard shortcuts in user guide.

### UX-06 — Focus management on dialogs and popovers
- **Stack:** frontend
- **Effort:** S
- **Why:** Radix Dialog handles return-focus correctly. Custom popovers (download panel, map legend, layer panel) need verification.
- **Pointers:** `features/map/components/download-panel.tsx`, `features/map/components/map-legend.tsx`, `features/map/components/layer-panel.tsx`.
- **Approach:** Test each popover: open it, close it, confirm focus returns to the trigger. Fix with `useRef` + explicit `.focus()` on close where needed.

### UX-07 — Toast/notification UI
- **Stack:** frontend
- **Effort:** S
- **Why:** Pairs with CQ-05. The `<Toaster>` is already mounted (`src/routes/__root.tsx:118`, Sonner) but no helper wraps it and no rule says when to use it.
- **Pointers:** `src/routes/__root.tsx:118`, `src/shared/components/ui/sonner.tsx`.
- **Approach:** Define `notifySuccess`, `notifyError`, `notifyInfo` in `shared/utils/notify.ts`. Document the rule: surface every catch-block error to the user unless it's expected (e.g. 401 redirect).

### UX-08 — i18n decision
- **Stack:** frontend
- **Effort:** M
- **Why:** Strings are inline across the frontend. Backend (ABP) supports localization. No documented decision either way — locks future options or accrues hidden cost.
- **Pointers:** Any user-facing string in `features/`, `shared/components/`.
- **Approach:** Decide: adopt `react-i18next` now, defer to backend localization, or formally accept English-only. Record the decision in `docs/developer/conventions.md`.

### UX-09 — Dark mode coverage
- **Stack:** frontend
- **Effort:** S
- **Why:** Tailwind 4 + Shadcn primitives support dark mode, but no `dark:` utilities are used in `features/map/` or `features/cms/pages/config/components/`. Both surfaces need a dark-mode pass.
- **Pointers:** Map components, `features/cms/pages/config/components/*-block.tsx`.
- **Approach:** Toggle dark mode, walk every route, screenshot weak spots. Fix with `dark:` Tailwind utilities or explicit map style switching.

### UX-10 — Empty states
- **Stack:** frontend
- **Effort:** S
- **Why:** Of the five major lists (users, roles, pages, comments, menu-items), only `menu-items-list.tsx` has empty-state handling; the other four render a blank table on first load. Bad first impression.
- **Pointers:** `features/users/components/users-list.tsx`, `features/roles/components/*`, `features/cms/pages/components/pages-list.tsx`, `features/cms/comments/components/comments-list.tsx`, `features/cms/menu-items/components/menu-items-list.tsx`.
- **Approach:** Add an `<EmptyState>` primitive (icon + message + primary CTA). Wire each list. Pair with the related "Create X" flow.

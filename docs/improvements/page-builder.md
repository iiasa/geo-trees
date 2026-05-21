# Page Builder (Puck/CMS Editor)

Improvements to the existing `@measured/puck`-based page editor in `features/cms/pages/`.

### PB-01 — User-facing block catalog
- **Stack:** frontend
- **Effort:** S
- **Why:** 24 `*-block.tsx` files exist. A 445-line developer README at `frontend/src/features/cms/pages/config/components/README.md` documents them, but there is no user-facing catalog for CMS editors.
- **Pointers:** `frontend/src/features/cms/pages/config/components/README.md`, `frontend/src/features/cms/pages/config/components/*-block.tsx`.
- **Approach:** Adapt the developer README into a user-facing `docs/user-guide/cms-blocks.md` (one section per block — purpose, fields, screenshot). Link from `docs/user-guide/cms.md`.

### PB-02 — Unit tests for blocks
- **Stack:** frontend
- **Effort:** M
- **Why:** 24 block files exist with zero `*.test.tsx` siblings. Largest are gallery-block (331) and carousel-block (315). Refactors are risky.
- **Pointers:** `features/cms/pages/config/components/*.tsx`, no `*.test.tsx` siblings.
- **Approach:** Add render + prop-validation tests per block. Use the existing `renderWithProviders()` from `src/test-utils/`. Mock images and external links.

### PB-03 — Trim block component sizes
- **Stack:** frontend
- **Effort:** M
- **Why:** `gallery-block.tsx` (331) and `carousel-block.tsx` (315) mix rendering with their Puck config UI. Extracting config makes both halves clearer.
- **Pointers:** `features/cms/pages/config/components/gallery-block.tsx`, `features/cms/pages/config/components/carousel-block.tsx`.
- **Approach:** Extract `gallery-block-config.tsx` (the editor-side fields UI) alongside `gallery-block.tsx` (the render). Same for carousel.

### PB-04 — Media library integration
- **Stack:** frontend
- **Effort:** L
- **Why:** Gallery and hero blocks need image URLs. Pasting URLs manually is fragile and doesn't reuse uploaded assets. ABP has BLOB storage primitives.
- **Pointers:** `gallery-block.tsx`, `hero-block.tsx`, ABP `IBlobContainer` on the backend.
- **Approach:** Add a `MediaPicker` modal (browse / upload / search) backed by an ABP `MediaAppService`. Replace URL inputs in image-consuming blocks.

### PB-05 — Draft vs publish flow
- **Stack:** frontend
- **Effort:** L
- **Why:** No draft state. `puck-editor.tsx` wires Puck's `onPublish` to a `handleSave` that commits directly, then renames the Publish button to "Save" — collapsing both concepts. Editors need a separate draft → publish flow.
- **Pointers:** `features/cms/pages/components/puck-editor.tsx:71,83-94,124`, `features/cms/pages/components/page-form.tsx` (322), backend page entity (via Volo.CmsKit assembly, not in-repo).
- **Approach:** Add `Status: Draft | Published` and a draft-content column. Editor saves draft; explicit Publish action promotes draft to live. Show a "Draft" badge.

### PB-06 — Editor/render parity
- **Stack:** frontend
- **Effort:** M
- **Why:** `puck-editor.tsx` (WYSIWYG) and `puck-render.tsx` (server output) can diverge silently. A block can look right in the editor and wrong on the live page.
- **Pointers:** `features/cms/pages/components/puck-editor.tsx`, `features/cms/pages/components/puck-render.tsx`.
- **Approach:** Audit divergences. Where possible, share the block render component between both. Add a visual-diff test for each block (snapshot or Playwright screenshot).

### PB-07 — Block schema validation at save
- **Stack:** frontend
- **Effort:** S
- **Why:** Invalid props (missing image URL, empty heading) currently render broken pages. Validation at save catches it before publish.
- **Pointers:** `features/cms/pages/config/puck-config.tsx`, each block's prop interface.
- **Approach:** Define a Zod schema per block. Validate in `page-form-store.ts` on save. Show field-level errors in the editor's right panel.

### PB-08 — Saved block templates / presets
- **Stack:** frontend
- **Effort:** M
- **Why:** Editors style a hero once, then re-create it on every page. Reusable presets cut that work.
- **Pointers:** Backend needs a `BlockTemplate { name, blockType, props }` entity. Frontend needs a "Save as template" action and a "Templates" picker.
- **Approach:** Add the entity + AppService backend-side. Frontend: action menu on each block, "Save as template"; templates appear in a sidebar drawer alongside default blocks.

### PB-09 — Single source of truth for block registry
- **Stack:** frontend
- **Effort:** S
- **Why:** `puck-config.tsx` enumerates available blocks. Without enforcing it as the only enumeration, parallel lists can drift.
- **Pointers:** `features/cms/pages/config/puck-config.tsx`. Find other importers with `rg -l 'config/components/.*-block' frontend/src/`.
- **Approach:** Confirm `puck-config.tsx` is imported by both editor and render. Block components export only via this registry (no direct route-level imports).

### PB-10 — Editor permission gating
- **Stack:** frontend
- **Effort:** S
- **Why:** `src/routes/_authed.tsx` only checks `if (!user) redirect`; it does not enforce any permission. CMS routes are therefore reachable by every signed-in user. Pair with CQ-04 for the E2E.
- **Pointers:** `src/routes/_authed.tsx`, CMS route files under `src/routes/`, `shared/components/permission-guard.tsx`, `shared/hooks/use-permissions.ts`.
- **Approach:** Gate CMS routes with a `CmsEditor` (or equivalent) permission via `<PermissionGuard>` or a `beforeLoad` check. Add an E2E test asserting a non-admin signed-in user gets 403/redirect.

# Contributing

## Branch Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout main && git pull
   git checkout -b feat/my-feature
   ```
2. Work on the branch and commit frequently (see [Commit Style](#commit-style-conventional-commits) below).
3. Open a pull request against `main`.
4. Ensure all CI checks pass.
5. Address review feedback.
6. Merge when approved.

Do not commit directly to `main`.

## Before Opening a PR

Run this checklist locally and confirm everything passes:

```bash
make lint             # Biome lint + file-size check + file-naming check
make typecheck        # TypeScript type checking
make test             # Unit tests

# If the backend API changed:
make fe-generate-api  # Regenerate TypeScript client from OpenAPI spec
```

All checks must pass before requesting review.

## Commit Style (Conventional Commits)

Format: `type: description`

| Type | When to use |
|------|------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `refactor:` | Code refactoring (no behavior change) |
| `test:` | Adding or updating tests |
| `chore:` | Build tools, dependencies, config |
| `style:` | Formatting, whitespace |

Examples:

```
feat: add map layer toggle
fix: handle empty user list in users table
docs: add API client guide
refactor: extract permission check into shared hook
test: add coverage for role assignment form
chore: update biome to 2.2.4
```

Keep the subject line concise (under 72 characters). Add a body if additional context is needed.

## Adding a New Feature

Follow the feature module pattern (see [Frontend Guide](./frontend.md)):

1. Create `src/features/[feature-name]/` with `components/`, `hooks/`, and `stores/` subdirectories as needed.
2. Add files following the [naming conventions](./conventions.md) (kebab-case, 500-line limit).
3. Create a route file in `src/routes/` — the route tree is auto-generated on next dev server start.
4. Run `pnpm lint` and `pnpm typecheck` to validate before committing.
5. Add tests for new components and hooks.
6. Update navigation in the appropriate layout component if the feature needs a menu entry.

## Code Style

- **Formatting**: Biome — run `pnpm format` to auto-apply. Tabs, double quotes.
- **TypeScript**: Use strict types; avoid `any`. Prefer explicit return types on exported functions.
- **File size**: Keep files under 500 lines. Split large components into smaller ones.
- **Imports**: Use path aliases (`@/features/`, `@/shared/`) not relative paths.
- **UI components**: Use existing [Shadcn/ui](https://ui.shadcn.com/) components from `src/shared/components/ui/` before creating custom ones.
- **State**: Use Zustand for client/UI state (modal open, form draft). Use TanStack Query for server state (data fetching, mutations).
- **Generated code**: Never edit `src/infrastructure/api/` or `src/routeTree.gen.ts` directly.

## Related Guides

- [Conventions](./conventions.md) — file naming, size limits, formatting, path aliases
- [Testing](./testing.md) — how to write and run tests
- [Frontend Guide](./frontend.md) — feature module structure, routing, state management
- [API Client](./api-client.md) — how to use and regenerate the TypeScript API client

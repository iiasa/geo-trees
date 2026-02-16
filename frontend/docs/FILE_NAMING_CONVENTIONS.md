# File Naming Conventions

This document outlines the file naming conventions enforced in this project. These conventions are automatically checked by the `check-file-naming` script, which runs as part of the `lint` and `check` commands.

## Overview

All files in the project must follow consistent naming conventions based on their type and location. The naming convention checker runs automatically during linting and will fail the build if violations are found.

## Conventions by File Type

### React Components
- **Format**: `kebab-case.tsx`
- **Location**: `src/features/*/components/`, `src/shared/components/`
- **Examples**:
  - ✅ `user-form.tsx`
  - ✅ `users-table.tsx`
  - ✅ `dashboard-metrics.tsx`
  - ❌ `UserForm.tsx` (PascalCase)
  - ❌ `usersTable.tsx` (camelCase)

### React Hooks
- **Format**: `kebab-case.ts` or `kebab-case.tsx`
- **Location**: `src/features/*/hooks/`, `src/shared/hooks/`
- **Extension**: Use `.ts` for plain hooks, `.tsx` for hooks that contain JSX components
- **Examples**:
  - ✅ `use-auth.tsx` (contains JSX components)
  - ✅ `use-mobile.ts` (plain hook)
  - ✅ `use-auth.ts` (plain hook)
  - ❌ `useAuth.ts` (camelCase)

### Zustand Stores
- **Format**: `kebab-case.ts`
- **Location**: `src/features/*/stores/`, `src/shared/stores/`
- **Examples**:
  - ✅ `user-form-store.ts`
  - ✅ `permission-store.ts`
  - ✅ `base-modal-store.ts`
  - ❌ `userFormStore.ts` (camelCase)

### Utility Functions
- **Format**: `kebab-case.ts`
- **Location**: `src/features/*/hooks/` (for utility hooks), `src/shared/utils/`
- **Examples**:
  - ✅ `permission-utils.ts`
  - ✅ `format-date.ts`
  - ❌ `permissionUtils.ts` (camelCase)

### Constants Files
- **Format**: Always named `constants.ts`
- **Location**: Anywhere in the project
- **Examples**:
  - ✅ `constants.ts`
  - ❌ `Constants.ts`
  - ❌ `app-constants.ts`

### Route Files (TanStack Router)
- **Format**: `kebab-case` with dots allowed, or special names
- **Location**: `src/routes/`
- **Special Cases**:
  - `__root.tsx` or `__root.ts` - Root route (special name)
  - `index.tsx` or `index.ts` - Index route (special name)
  - Files with dots are allowed (e.g., `auth.login.ts`, `api.health.ts`)
- **Examples**:
  - ✅ `users.tsx`
  - ✅ `auth.login.ts`
  - ✅ `api.proxy.$.ts`
  - ✅ `__root.tsx`
  - ✅ `index.tsx`
  - ❌ `Users.tsx` (PascalCase - not allowed for routes)

## Running the Check

The file naming convention check runs automatically as part of:

```bash
# Full lint check (includes naming check)
pnpm lint

# Full check (includes naming check)
pnpm check

# Naming check only
pnpm check-file-naming
```

## Violations

If the check finds violations, it will:
1. List all files that violate the naming conventions
2. Show what the issue is (e.g., "PascalCase (should be kebab-case)")
3. Show what the expected format is
4. Exit with a non-zero code (failing the build/CI)

## CI/CD Integration

The naming check is automatically run in CI/CD pipelines when:
- Running `pnpm lint`
- Running `pnpm check`
- Running `pnpm check-file-naming`

## Pre-commit Hooks (Optional)

To enforce naming conventions before commits, you can add a pre-commit hook:

```bash
# Install husky (if not already installed)
pnpm add -D husky

# Add pre-commit hook
echo "pnpm check-file-naming" > .husky/pre-commit
chmod +x .husky/pre-commit
```

## Migration

When renaming files to follow conventions:
1. Rename the file using git: `git mv OldName.tsx new-name.tsx`
2. Update all import statements that reference the old file name
3. Run `pnpm check-file-naming` to verify
4. Run `pnpm lint` to ensure everything passes

## Excluded Files

The following files are automatically excluded from naming checks:
- Generated API client files (`src/infrastructure/api/**/*`)
- Generated route tree (`src/routeTree.gen.ts`)
- All `.gen.ts` and `.gen.tsx` files

## Questions?

If you're unsure about a file name, run `pnpm check-file-naming` to see if it passes validation.


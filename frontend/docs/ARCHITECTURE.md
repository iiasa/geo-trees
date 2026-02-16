# Project Architecture

This document describes the architectural decisions and patterns used in the ABP React TanStack application.

## Feature-Based Architecture

The application is organized around features rather than technical layers. Each feature contains its own components, hooks, stores, and constants. This approach improves:

1. **Developer Experience**: Developers can focus on a specific feature without navigating unrelated code
2. **Maintainability**: Changes to one feature are less likely to affect others
3. **Scalability**: New features can be added without disrupting existing code

## Directory Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   ├── users/                 # User management feature
│   ├── roles/                 # Role management feature
│   ├── tenants/               # Tenant management feature
│   └── dashboard/             # Dashboard feature
├── shared/                    # Shared code across features
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Shared hooks
│   ├── stores/                # Shared stores
│   ├── utils/                 # Utility functions
│   └── types/                 # Shared types
├── infrastructure/            # Infrastructure concerns
│   ├── api/                   # API client configuration
│   ├── auth/                  # Authentication infrastructure
│   └── config/                # Configuration files
├── routes/                    # Route definitions (TanStack Router file-based routing)
├── router.tsx                # Router configuration
├── routeTree.gen.ts          # Auto-generated route tree (gitignored)
├── constants.ts              # Application constants
├── styles.css                # Global styles
└── logo.svg                  # Application logo
```

## Patterns

### Component Structure

Each feature follows this pattern:

```
feature-name/
├── components/        # Feature-specific components
│   ├── [Feature]List.tsx     # Main list component
│   ├── [Feature]Form.tsx     # Create/edit form
│   ├── [Feature]Modal.tsx    # Feature-specific modals
│   ├── [Feature]Table.tsx    # Table component (split from list)
│   └── [Feature]Header.tsx   # Header component (split from list)
├── hooks/             # Feature-specific hooks
├── stores/            # Feature-specific stores
│   ├── [feature]-form-store.ts    # Form state management
│   └── [feature]-modal-store.ts   # Modal state management
└── constants.ts        # Feature-specific constants
```

### Store Patterns

We use Zustand for state management with these patterns:

1. **Base Store Pattern**: Common store interfaces and actions extracted to base stores
   - `BaseFormStore`: For create/edit forms
   - `BaseModalStore`: For modal components
   - Reusable actions: `setLoading`, `openCreateForm`, `openEditForm`, etc.

2. **Feature Stores**: Extend base patterns with feature-specific state
   - Form stores for managing create/edit state
   - Modal stores for managing modal state
   - Consistent naming: `[feature]-form-store`, `[feature]-modal-store`

### Import Path Aliases

We use path aliases to simplify imports:

- `@/shared/*`: Points to shared code
- `@/features/*`: Points to feature-specific code
- `@/infrastructure/*`: Points to infrastructure code

### Component Refactoring

Large components (500+ lines) are split into smaller components:

1. **List Components**: Main container with data fetching
2. **Table Components**: Table display and pagination
3. **Header Components**: Header with actions
4. **Form Components**: Create/edit forms
5. **Modal Components**: Feature-specific modals

## Benefits

1. **Scalability**: New developers can quickly understand and work on specific features
2. **Maintainability**: Reduced coupling between features makes maintenance easier
3. **Testability**: Feature-specific tests are more focused and easier to write
4. **Code Reuse**: Shared components reduce duplication
5. **Performance**: Smaller components are easier to optimize and lazy load

## Guidelines

### Adding New Features

1. Create a new directory under `src/features/[feature-name]/`
2. Follow the established patterns for components, hooks, and stores
3. Use base store patterns to reduce boilerplate
4. Add feature-specific constants if needed
5. Create a route file in `src/routes/[feature].tsx`
6. Update navigation components to include the new feature

### Code Organization

1. Keep files under 500 lines (enforced by `check-file-size` script)
2. Use TypeScript for type safety
3. Follow existing naming conventions
4. Add tests for new functionality
5. Update documentation when adding features

### Import Best Practices

1. Use the defined path aliases for imports
2. Import from feature-specific locations when possible
3. Use shared components for common UI patterns
4. Keep component dependencies explicit and minimal

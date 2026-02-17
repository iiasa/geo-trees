# Geo Trees

IIASA GeoTrees - A modern full-stack web application built with React, TanStack Router, and an ABP Framework (.NET) backend.

## 🚀 Features

- 🔐 **OIDC Authentication**: Secure authentication via OpenID Connect with PKCE
- 🛠️ **API Client Generation**: Auto-generated TypeScript clients from OpenAPI specs
- 🎨 **Modern UI**: Shadcn/ui components with Tailwind CSS
- 🚀 **SSR Support**: Server-side rendering with TanStack Start
- 🐳 **Docker Ready**: Containerized deployment
- 👥 **Identity Management**: Complete user, role, and tenant management system
- 🔒 **Permission System**: Granular permission management with visual tree interface
- 📝 **CMS System**: Full content management with pages, navigation, and comments
- 👤 **User Profile**: Profile management and security settings
- ⚙️ **Settings**: Application settings including email, timezone, and comments
- 🚩 **Feature Flags**: Feature flag management system
- 📊 **Dashboard**: Project management dashboard with metrics and analytics

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Access to the backend API
- OIDC provider (for authentication)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd geo-trees

# Install dependencies
pnpm install

# Generate API client from OpenAPI spec
pnpm generate-api

# Start development server
pnpm dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:44349
VITE_OPENAPI_SPEC_URL=http://localhost:44349/swagger/v1/swagger.json
VITE_API_PROXY_PATH=/api/proxy

# OIDC Configuration
VITE_OIDC_ISSUER=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_CLIENT_SECRET=your-client-secret
VITE_BASE_URL=http://localhost:3000
VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback

# Session Configuration
VITE_SESSION_SECRET=your-super-secret-key-change-this-in-production

# Application Configuration
VITE_APP_NAME=geo-trees
VITE_APP_VERSION=v1
```

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 19.2.0 with TanStack Router
- **Full-stack Framework**: TanStack Start for SSR and server functions
- **State Management**: TanStack Query for data fetching, Zustand for feature stores
- **UI Framework**: Tailwind CSS with Shadcn/ui components
- **Authentication**: OpenID Connect with PKCE
- **API Integration**: Auto-generated TypeScript client from OpenAPI specs
- **Build Tool**: Vite
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: Biome for linting and formatting

### Project Structure

```text
src/
├── features/                            # Feature-based modules
│   ├── auth/                           # Authentication feature
│   │   ├── components/                 # Auth-specific components
│   │   ├── hooks/                      # Auth-specific hooks
│   │   └── constants.ts                # Auth-specific constants
│   ├── users/                          # User management feature
│   │   ├── components/                 # User-related components
│   │   ├── hooks/                      # User-specific hooks
│   │   ├── stores/                     # User state management
│   │   └── constants.ts                # User-specific constants
│   ├── roles/                          # Role management feature
│   │   ├── components/                 # Role-related components
│   │   ├── hooks/                      # Role-specific hooks
│   │   ├── stores/                     # Role state management
│   │   └── constants.ts                # Role-specific constants
│   ├── tenants/                        # Tenant management feature
│   │   ├── components/                 # Tenant-related components
│   │   ├── stores/                     # Tenant state management
│   │   └── constants.ts                # Tenant-specific constants
│   ├── dashboard/                      # Dashboard feature
│   │   ├── components/                 # Dashboard components
│   │   └── constants.ts                # Dashboard constants
│   ├── cms/                            # Content Management System
│   │   ├── pages/                      # Page management
│   │   ├── menu-items/                 # Navigation management
│   │   └── comments/                   # Comment system
│   ├── profile/                        # User profile feature
│   │   ├── components/                 # Profile components
│   │   ├── hooks/                      # Profile hooks
│   │   ├── stores/                     # Profile state management
│   │   └── constants.ts                # Profile constants
│   ├── settings/                       # Application settings
│   │   ├── components/                 # Settings components
│   │   ├── hooks/                      # Settings hooks
│   │   ├── stores/                     # Settings state management
│   │   └── constants.ts                # Settings constants
│   ├── feature-flags/                  # Feature flags management
│   │   ├── components/                 # Feature flag components
│   │   ├── stores/                     # Feature flag state
│   │   └── constants.ts                # Feature flag constants
│   └── permission-admin/               # Permission administration
│       ├── components/                 # Permission admin components
│       ├── stores/                     # Permission admin state
│       └── constants.ts                # Permission admin constants
├── shared/                             # Shared code across features
│   ├── components/                     # Reusable UI components
│   │   ├── ui/                         # Shadcn/ui components
│   │   ├── app-sidebar.tsx             # Application sidebar
│   │   ├── header.tsx                  # Application header
│   │   ├── page-header.tsx             # Page header component
│   │   ├── page-layout.tsx             # Page layout wrapper
│   │   ├── sidebar-layout.tsx          # Sidebar layout wrapper
│   │   └── nav-*.tsx                   # Navigation components
│   ├── hooks/                          # Shared hooks
│   ├── stores/                         # Shared stores
│   ├── utils/                          # Utility functions
│   └── constants/                      # Shared constants
├── infrastructure/                     # Infrastructure concerns
│   ├── api/                            # API client configuration
│   │   ├── @tanstack/                  # TanStack Query hooks
│   │   ├── client/                     # Fetch client utilities
│   │   ├── core/                       # Core API utilities
│   │   ├── index.ts                    # Main API exports
│   │   ├── sdk.gen.ts                  # Generated SDK
│   │   └── types.gen.ts                # Generated TypeScript types
│   ├── auth/                           # Authentication infrastructure
│   │   ├── auth-server.ts              # Server-side auth utilities
│   │   ├── oidc.ts                     # OIDC client utilities
│   │   └── session.ts                  # Session management
│   └── constants.ts                    # Infrastructure constants
├── routes/                             # Route definitions (TanStack Router)
│   ├── __root.tsx                      # Root route with providers
│   ├── index.tsx                       # Landing page
│   ├── dashboard.tsx                   # Dashboard route
│   ├── auth/                           # Authentication routes
│   ├── admin/                          # Admin routes
│   │   ├── users.tsx                   # Users management
│   │   ├── roles.tsx                   # Roles management
│   │   ├── tenants.tsx                 # Tenants management
│   │   └── cms.*.tsx                   # CMS routes
│   ├── profile/                        # Profile routes
│   ├── settings.tsx                    # Settings route
│   ├── api.*.ts                        # API routes
│   └── demo/                           # Demo feature routes
├── router.tsx                          # Router configuration
├── routeTree.gen.ts                    # Auto-generated route tree (gitignored)
├── constants.ts                        # Application constants
├── styles.css                          # Global styles
└── hey-api.ts                          # API client configuration
```

## 🔐 Authentication

### OIDC Setup

1. Configure your OIDC provider with the following settings:
   - Client ID: Your application's client identifier
   - Client Secret: Your application's client secret
   - Redirect URI: `http://localhost:3000/auth/callback`
   - Scopes: `openid profile email offline_access AbpTemplate`
   - Grant Types: `authorization_code refresh_token`

2. Update the environment variables in your `.env` file

3. The application will handle the OIDC flow automatically

### Protecting Routes

Use the `ProtectedRoute` component to protect routes that require authentication:

```tsx
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/protected")({
  component: () => (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  ),
});
```

### Using Authentication

```tsx
import { useAuth } from "@/features/auth/hooks/use-auth";

function MyComponent() {
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

## 👥 Identity Management

### Users Management

- View, create, edit, and delete users
- Assign roles to users
- Manage user permissions
- Filter and search users
- User permission modal for granular control

### Roles Management

- View, create, edit, and delete roles
- Assign permissions to roles
- Manage role hierarchy
- Filter and search roles
- Role permissions modal with visual tree

### Tenants Management

- Multi-tenant support
- View, create, edit, and delete tenants
- Manage tenant connection strings
- Configure tenant-specific features
- Tenant feature flags management

### Permission System

- Granular permission management
- Group permissions by category
- Assign permissions to roles and users
- Visual permission tree interface
- Permission administration panel

## 📝 Content Management System (CMS)

### Pages Management

- Create, edit, and delete pages
- Visual page editor using Puck
- Page templates and components
- Page preview and publishing
- SEO-friendly page management

### Navigation Management

- Hierarchical menu structure
- Drag-and-drop menu organization
- Menu item configuration
- Dynamic navigation rendering

### Comments System

- Comment moderation
- Threaded comments
- Inline comment forms
- Comment settings configuration
- Comment approval workflow

## 👤 User Profile & Settings

### Profile Management

- View and edit user profile
- Change password functionality
- Profile information management
- Security settings

### Application Settings

- Email settings configuration
- Timezone settings
- Comment settings
- Feature flags management
- Test email functionality

## 🔌 API Integration

### Generated API Client

The project uses Hey API to generate a TypeScript client from the ABP backend OpenAPI specification:

```bash
# Regenerate API client
pnpm generate-api
```

### Using the API Client

```typescript
import { userGetListOptions, roleCreateMutation } from '@/infrastructure/api/@tanstack/react-query.gen';
import { useQuery, useMutation } from '@tanstack/react-query';

// Query example
const { data: users, isLoading } = useQuery(userGetListOptions({
  query: {
    skipCount: 0,
    maxResultCount: 10
  }
}));

// Mutation example
const createRoleMutation = useMutation(roleCreateMutation());

const handleCreateRole = () => {
  createRoleMutation.mutate({
    body: {
      name: 'New Role',
      displayName: 'New Role Display',
      isActive: true
    }
  });
};
```

## 🎨 UI Components

The project uses Shadcn/ui components with Tailwind CSS for styling:

- Modern, accessible components
- Dark mode support
- Responsive design
- Consistent design system

### Adding New Components

```bash
# Add a new Shadcn/ui component
pnpx shadcn@latest add button
```

## 🚀 Deployment

### Docker

```bash
# Build Docker image
pnpm docker:build

# Run Docker container
pnpm docker:run

# Build and run in one command
pnpm docker:up

# Use Docker Compose
pnpm docker:compose:up
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🧪 Testing

The project includes comprehensive testing infrastructure with unit tests, integration tests, and end-to-end tests.

### Test Scripts

```bash
# Unit & Integration Tests
pnpm test              # Run all tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:ui           # Run tests with UI
pnpm test:coverage     # Run tests with coverage report

# E2E Tests
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Run E2E tests with UI
pnpm test:e2e:debug    # Run E2E tests in debug mode

# All Tests
pnpm test:all          # Run unit + E2E tests
```

### Testing Stack

- **Vitest**: Fast unit and integration testing
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing across browsers
- **MSW**: API mocking for reliable tests
- **Coverage**: Enforced minimum thresholds (70% statements, 65% branches)

### Coverage Requirements

- **Statements**: 70%
- **Branches**: 65%
- **Functions**: 70%
- **Lines**: 70%

Coverage reports are generated in `coverage/` directory and uploaded to CI.

### Writing Tests

- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components with Testing Library
- **Integration Tests**: Test component interactions and API calls
- **E2E Tests**: Test complete user workflows in real browsers

See [`docs/TESTING.md`](docs/TESTING.md) for detailed testing guidelines.

### CI/CD Integration

Tests run automatically on pull requests:

- Lint and format checks
- Unit tests with coverage reporting
- E2E tests across multiple browsers
- TypeScript type checking

## 🔧 Development

### Code Quality

```bash
# Lint code (includes file size and naming checks)
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Check code quality (lint + format + file checks)
pnpm check

# Type check
pnpm typecheck

# Check file sizes (max 500 lines)
pnpm check-file-size

# Check file naming conventions
pnpm check-file-naming

# Find unused files
pnpm find-unused-files
```

### Adding New Routes

1. Create a new file in `src/routes/` following the file-based routing pattern
2. TanStack Router will automatically generate the route configuration
3. Use `createFileRoute()` for route definition
4. Import and use `Link` component from `@tanstack/react-router` for navigation

Example:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { MyComponent } from "@/features/my-feature/components/my-component";

export const Route = createFileRoute("/my-feature")({
  component: MyComponent,
});
```

### Adding New Features

1. Create feature directory structure under `src/features/[feature-name]/`
2. Follow the established patterns:
   - `components/` - Feature-specific components
   - `hooks/` - Feature-specific hooks
   - `stores/` - Feature state management (using Zustand)
   - `constants.ts` - Feature-specific constants
3. Create route file in `src/routes/[feature].tsx`
4. Update navigation in `src/shared/constants/navigation.ts`
5. Keep files under 500 lines (enforced by lint script)

### API Client Updates

When the backend API changes:

1. Update the OpenAPI spec URL in `hey-api.config.ts` if needed
2. Run `pnpm generate-api` to regenerate the client
3. Update your code to use any new endpoints or types

## 📚 Documentation

### External Documentation

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Hey API Documentation](https://heyapi.dev/)
- [ABP Framework Documentation](https://abp.io/)

### Project Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - Project architecture and patterns
- [`docs/TESTING.md`](docs/TESTING.md) - Testing guidelines and best practices
- [`docs/OIDC_SETUP.md`](docs/OIDC_SETUP.md) - OIDC authentication setup guide
- [`docs/FILE_NAMING_CONVENTIONS.md`](docs/FILE_NAMING_CONVENTIONS.md) - File naming conventions
- [`AGENTS.md`](AGENTS.md) - AI agent documentation and guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project conventions:
   - Keep files under 500 lines
   - Follow file naming conventions
   - Use TypeScript for type safety
   - Add tests for new functionality
   - Use Zustand for state management when needed
   - Avoid hardcoded strings (use constants)
4. Run quality checks:

   ```bash
   pnpm lint
   pnpm format
   pnpm typecheck
   pnpm test
   ```

5. Commit with conventional commit messages
6. Submit a pull request

### Code Style Guidelines

- **File Size**: Maximum 500 lines per file (enforced)
- **State Management**: Prefer Zustand over useEffect for state
- **Constants**: Never hardcode strings, always use constants
- **Naming**: Follow file naming conventions (see `docs/FILE_NAMING_CONVENTIONS.md`)
- **Testing**: Add tests for new features
- **TypeScript**: Use strict typing throughout

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **API Client Generation Fails**
   - Check backend OpenAPI spec URL availability
   - Verify network connectivity
   - Check Hey API configuration

2. **Authentication Issues**
   - Verify OIDC provider configuration
   - Check environment variables
   - Validate redirect URIs
   - Check session secret strength

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify Vite configuration
   - Check dependency versions

4. **Runtime Errors**
   - Check browser console for errors
   - Verify environment variables loaded
   - Check API endpoints accessibility
   - Validate session storage

### Debug Mode

```bash
# Enable debug logging
DEBUG=oidc:* pnpm dev

# Check build output
pnpm build --debug

# Run tests in watch mode
pnpm test --watch
```

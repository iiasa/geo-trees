# AGENTS.md - Geo Trees Application

## 🤖 AI Agent Documentation

This document serves as a comprehensive guide for AI agents working with the Geo Trees application. It provides context, architecture details, and operational guidance for maintaining and extending this full-stack project.

## 📋 Project Overview

**Project Name**: `geo-trees`
**Purpose**: IIASA GeoTrees - A modern full-stack web application built with React, TanStack Router, and an ABP Framework (.NET) backend.

**Key Features**:
- 🔐 **OIDC Authentication**: Secure authentication via OpenID Connect
- 📊 **Project Management Dashboard**: Task tracking, metrics, and analytics
- 🛠️ **API Client Generation**: Auto-generated TypeScript clients from OpenAPI specs
- 🎨 **Modern UI**: Shadcn/ui components with Tailwind CSS
- 🚀 **SSR Support**: Server-side rendering with TanStack Start
- 🐳 **Docker Ready**: Containerized deployment

## 🏗️ Architecture & Tech Stack

### Frontend Framework
- **React 19.2.0**: Latest React with concurrent features
- **TanStack Router**: File-based routing with type-safe navigation
- **TanStack Start**: Full-stack framework with server functions and SSR
- **Vite**: Fast development build tool

### State Management & Data Fetching
- **TanStack Query**: Powerful data fetching and caching
- **TanStack Store**: Reactive state management (optional)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library

### Authentication & Security
- **OpenID Connect**: Industry-standard authentication
- **PKCE**: Enhanced security for public clients
- **Session Management**: Server-side session handling

### Backend Integration
- **ABP Framework**: ASP.NET Boilerplate Platform backend
- **Hey API**: Automated API client generation from OpenAPI specs
- **Zod**: Runtime type validation for API responses

### Development Tools
- **TypeScript**: Full type safety throughout
- **Biome**: Fast linting and formatting
- **Vitest**: Unit testing framework
- **Docker**: Containerization for deployment

## 📁 Project Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/        # Auth-specific components
│   │   ├── hooks/             # Auth-specific hooks
│   │   ├── stores/            # Auth state management
│   │   └── constants.ts       # Auth-specific constants
│   ├── users/                 # User management feature
│   │   ├── components/        # User-related components
│   │   ├── hooks/             # User-specific hooks
│   │   ├── stores/            # User state management
│   │   └── constants.ts       # User-specific constants
│   ├── roles/                 # Role management feature
│   │   ├── components/        # Role-related components
│   │   ├── hooks/             # Role-specific hooks
│   │   ├── stores/            # Role state management
│   │   └── constants.ts       # Role-specific constants
│   ├── tenants/               # Tenant management feature
│   │   ├── components/        # Tenant-related components
│   │   ├── hooks/             # Tenant-specific hooks
│   │   ├── stores/            # Tenant state management
│   │   └── constants.ts       # Tenant-specific constants
│   └── dashboard/             # Dashboard feature
│       ├── components/        # Dashboard components
│       ├── hooks/             # Dashboard hooks
│       ├── data/              # Dashboard data
│       └── types/             # Dashboard types
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
│   ├── __root.tsx            # Root route (always rendered)
│   ├── index.tsx             # Home page route
│   ├── dashboard.tsx         # Dashboard route
│   ├── users.tsx             # Users route
│   ├── roles.tsx             # Roles route
│   ├── tenants.tsx           # Tenants route
│   ├── auth.*.ts             # Authentication routes (login, logout, callback, me)
│   └── demo/                 # Demo routes
├── router.tsx                # Router configuration (TanStack Router setup)
├── routeTree.gen.ts          # Auto-generated route tree (gitignored)
├── constants.ts              # Application constants (API endpoints, base URLs)
├── styles.css                # Global styles
└── logo.svg                  # Application logo
```

## 🔧 Key Configuration Files

### `hey-api.config.ts`
- **Purpose**: Configures automated API client generation
- **Input**: OpenAPI spec from ABP backend (`http://localhost:44349/swagger/v1/swagger.json`)
- **Output**: TypeScript client in `src/infrastructure/api/`
- **Plugins**:
  - `@hey-api/client-fetch`: HTTP client
  - `zod`: Runtime validation schemas
  - `@tanstack/react-query`: Query hooks

### `vite.config.ts`
- **Purpose**: Vite configuration for development and build
- **Plugins**:
  - `tanstackStart()`: Full-stack framework integration
    - `router.entry`: `router.tsx` (router configuration file)
    - `router.routesDirectory`: `routes` (file-based routing directory)
  - `viteReact()`: React plugin
  - `tailwindcss()`: CSS framework
  - `viteTsConfigPaths()`: Path alias resolution

### `router.tsx`
- **Purpose**: TanStack Router configuration
- **Location**: `src/router.tsx`
- **Exports**: `getRouter()` function that returns a router instance
- **Configuration**:
  - Route tree imported from auto-generated `routeTree.gen.ts`
  - Scroll restoration enabled
  - Preload stale time configuration

### `package.json`
- **Scripts**:
  - `pnpm generate-api`: Regenerate API client from OpenAPI spec
  - `pnpm dev`: Start development server
  - `pnpm build`: Production build
  - `pnpm test`: Run tests with Vitest
  - `pnpm lint`: Code linting with Biome
  - `pnpm format`: Code formatting with Biome
  - `check-file-size`: Verify file size limits (500 lines max)

### `tsconfig.json`
- **Path Aliases**:
  - `@/*`: Points to `./src/*`
  - `@/shared/*`: Points to `./src/shared/*`
  - `@/features/*`: Points to `./src/features/*`
  - `@/infrastructure/*`: Points to `./src/infrastructure/*`

## 🔐 Authentication System

### OIDC Configuration
```typescript
// Environment variables needed:
VITE_OIDC_ISSUER=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_CLIENT_SECRET=your-client-secret
VITE_BASE_URL=http://localhost:3000
VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_SESSION_SECRET=your-super-secret-key
```

### Authentication Flow
1. **Login Initiation**: User clicks login → redirect to OIDC provider
2. **Callback Handling**: `/auth/callback` processes authorization code
3. **Token Storage**: Access/ID tokens stored server-side in session
4. **Route Protection**: `ProtectedRoute` component wraps authenticated routes
5. **Token Refresh**: Automatic refresh when tokens expire

### Key Components
- **`useAuth()`**: Authentication hooks for login/logout
- **`ProtectedRoute`**: Route guard component
- **`AuthProvider`**: Context provider for auth state
- **Session Management**: Server-side session storage

## 📊 Dashboard Features

### Project Management Dashboard
- **Data Source**: `src/features/dashboard/data/` (615 sample tasks)
- **Features**:
  - Task status tracking (Done/In Process)
  - Metrics calculation (completion rates, reviewer stats)
  - Interactive charts (pie/bar charts using Recharts)
  - Data table with sorting/filtering
  - Recent activity timeline
  - Team member avatars and stats

### Dashboard Components
- **Metrics Cards**: Total tasks, completed, in-progress, completion rate
- **Charts**: Status distribution (pie), type distribution (bar)
- **Activity Feed**: Recent task updates with user avatars
- **Data Table**: Comprehensive task overview with filtering

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Generate API client (after backend changes)
pnpm generate-api

# Run tests
pnpm test

# Lint and format code
pnpm lint
pnpm format
```

### API Client Generation
1. **Trigger**: Run `pnpm generate-api`
2. **Process**:
   - Fetches OpenAPI spec from ABP backend
   - Generates TypeScript types and functions
   - Creates TanStack Query hooks
   - Adds Zod validation schemas
3. **Output**: Updated files in `src/infrastructure/api/`

### Adding New Features
1. Create feature directory in `src/features/[feature-name]/`
2. Add components, hooks, stores, and constants as needed
3. Create route file in `src/routes/[feature].tsx` (or `src/routes/[feature]/index.tsx` for nested routes)
4. Use `createFileRoute` to define the route:
   ```typescript
   import { createFileRoute } from "@tanstack/react-router";
   import { FeatureComponent } from "@/features/[feature-name]/components/FeatureComponent";
   
   export const Route = createFileRoute("/[feature-path]")({
     component: FeatureComponent,
   });
   ```
5. The route tree will be auto-generated on next dev server start or build

### Component Development
- Use Shadcn/ui components from `src/shared/components/ui/`
- Follow existing patterns for consistency
- Implement responsive design with Tailwind
- Use TypeScript for type safety
- Keep files under 500 lines (enforced by check-file-size script)

## 🐳 Deployment & Docker

### Docker Configuration
```dockerfile
# Multi-stage build
FROM node:24-alpine AS builder
# Build stage with dependencies

FROM node:24-alpine AS production
# Production stage with optimized runtime
```

### Build & Run
```bash
# Build Docker image
pnpm docker:build

# Run locally
pnpm docker:run

# Docker Compose (full stack)
pnpm docker:compose:up
```

### Production Considerations
- **Security**: Use strong session secrets in production
- **HTTPS**: Required for OIDC in production
- **Environment**: Configure production OIDC provider URLs
- **Health Checks**: Built-in health check endpoint at `/api/health`

## 🧪 Demo Features

### Available Demo Routes
- `/demo/api-client`: Generated API client demonstration
- `/demo/start/api-request`: API request examples
- `/demo/start/server-funcs`: Server functions showcase
- `/demo/start/ssr/*`: SSR mode demonstrations

### Demo Data
- **Project Tasks**: 615 sample tasks in JSON format
- **Punk Songs**: Demo data for music-related features
- **Mock API Responses**: Simulated backend responses

## 🛣️ Routing System

### File-Based Routing
TanStack Start uses file-based routing following TanStack Router conventions:
- **Routes Directory**: `src/routes/`
- **Router Config**: `src/router.tsx`
- **Route Tree**: `src/routeTree.gen.ts` (auto-generated, gitignored)

### Route File Naming
| URL Path | File Path | Type |
|----------|-----------|------|
| `/` | `routes/index.tsx` | Index Route |
| `/about` | `routes/about.tsx` | Static Route |
| `/posts` | `routes/posts.tsx` | Layout Route |
| `/posts/:id` | `routes/posts/$id.tsx` | Dynamic Route |
| `/api/*` | `routes/api/$.tsx` | Wildcard Route |

### Creating Routes
```typescript
// src/routes/feature.tsx
import { createFileRoute } from "@tanstack/react-router";
import { FeatureComponent } from "@/features/feature/components/FeatureComponent";

export const Route = createFileRoute("/feature")({
  component: FeatureComponent,
  // Optional: loader, beforeLoad, etc.
});
```

### Root Route
The `__root.tsx` file is always rendered and contains:
- Document shell (`<html>`, `<body>`)
- Global providers (QueryClient, AuthProvider)
- Layout logic
- HeadContent and Scripts components

### Route Tree Generation
The route tree is automatically generated when:
- Running `pnpm dev`
- Running `pnpm build`
- The TanStack Router plugin detects route file changes

**Reference**: [TanStack Start Routing Guide](https://tanstack.com/start/latest/docs/framework/react/guide/routing)

## 🔍 Common Tasks for AI Agents

### 1. Adding New Features
- Create feature directory structure under `src/features/`
- Implement components with TypeScript
- Create route file in `src/routes/[feature].tsx`
- Use `createFileRoute` to define the route
- Add API integration if needed
- Update navigation components
- Add tests for new functionality

### 2. API Integration
- Run `pnpm generate-api` after backend changes
- Use generated hooks: `useQuery`, `useMutation`
- Apply Zod schemas for validation
- Handle loading/error states

### 3. UI Component Development
- Use existing Shadcn/ui components
- Follow design system patterns
- Implement responsive design
- Add proper TypeScript types

### 4. Authentication Updates
- Modify OIDC configuration in `src/infrastructure/auth/`
- Update route protection logic
- Handle token refresh scenarios
- Update error handling

### 5. Performance Optimization
- Implement proper loading states
- Use TanStack Query caching effectively
- Optimize bundle size
- Implement code splitting

### 6. Testing
- Write unit tests with Vitest
- Test authentication flows
- Test API integration
- Test component interactions

## 🚨 Troubleshooting Guide

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

## 📚 Resources & Documentation

- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query
- **TanStack Start**: https://tanstack.com/start
- **ABP Framework**: https://abp.io/
- **Shadcn/ui**: https://ui.shadcn.com/
- **Hey API**: https://heyapi.dev/
- **OIDC Setup**: See `OIDC_SETUP.md`

## 🤝 Contributing Guidelines

1. **Code Style**: Follow Biome configuration
2. **TypeScript**: Use strict typing throughout
3. **Testing**: Add tests for new features
4. **Commits**: Use conventional commit messages
5. **PR Reviews**: Required for all changes

---

**Last Updated**: November 2025
**Version**: 0.0.6
**Maintainer**: AI Development Team

# OpenID Connect (OIDC) Setup Guide for TanStack Start

This comprehensive guide provides detailed instructions for setting up and using OpenID Connect authentication in your TanStack Start application. This implementation provides secure, industry-standard authentication with PKCE (Proof Key for Code Exchange), automatic token refresh, and server-side session management.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [OIDC Provider Setup](#oidc-provider-setup)
5. [Installation & Setup](#installation--setup)
6. [Authentication Flow](#authentication-flow)
7. [Usage Guide](#usage-guide)
8. [API Reference](#api-reference)
9. [Security Features](#security-features)
10. [Session Management](#session-management)
11. [Error Handling](#error-handling)
12. [Production Deployment](#production-deployment)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)
15. [Advanced Configuration](#advanced-configuration)
16. [File Structure](#file-structure)

---

## Overview

### What is OpenID Connect?

OpenID Connect (OIDC) is an authentication layer built on top of OAuth 2.0. It provides a standardized way for applications to verify user identity and obtain basic profile information. This implementation uses the **Authorization Code Flow with PKCE**, which is the recommended flow for public clients (like single-page applications).

### Key Features

- ✅ **PKCE (Proof Key for Code Exchange)**: Enhanced security for public clients
- ✅ **Automatic Token Refresh**: Tokens are refreshed proactively before expiration
- ✅ **Server-Side Session Management**: Secure session storage using TanStack Start's built-in session handling
- ✅ **State Parameter Validation**: CSRF protection through state parameter verification
- ✅ **RP-Initiated Logout**: Proper logout flow with token revocation
- ✅ **Type-Safe Implementation**: Full TypeScript support throughout
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Test Mode Support**: Built-in test mode for development and E2E testing

### Supported OIDC Providers

This implementation works with any OIDC-compliant provider, including:

- **Auth0**
- **Keycloak**
- **Azure AD / Microsoft Entra ID**
- **Google Identity Platform**
- **Okta**
- **AWS Cognito**
- **IdentityServer**
- **ABP Framework** (with OpenIddict)
- Any other OIDC-compliant provider

---

## Architecture

### System Components

```text
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ AuthProvider │  │ ProtectedRoute│  │ useAuth Hook │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼─────────────────┼─────────────────┼─────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
          ┌─────────────────▼─────────────────┐
          │      TanStack Start Server         │
          │  ┌─────────────────────────────┐  │
          │  │   Auth Routes (API)          │  │
          │  │  - /auth/login               │  │
          │  │  - /auth/callback            │  │
          │  │  - /auth/logout              │  │
          │  │  - /auth/me                  │  │
          │  └──────────┬──────────────────┘  │
          │             │                      │
          │  ┌──────────▼──────────────────┐  │
          │  │   Auth Infrastructure        │  │
          │  │  - oidc.ts (OIDC client)     │  │
          │  │  - auth-server.ts (session)  │  │
          │  │  - session.ts (session mgmt) │  │
          │  └──────────┬──────────────────┘  │
          └─────────────┼──────────────────────┘
                        │
          ┌─────────────▼──────────────┐
          │   OIDC Provider            │
          │  (Auth0, Keycloak, etc.)   │
          └────────────────────────────┘
```

### Authentication Flow Diagram

```text
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │                    │  OIDC    │
│          │                    │          │                    │ Provider │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  1. GET /auth/login           │                               │
     ├──────────────────────────────>│                               │
     │                               │  2. Generate PKCE verifier   │
     │                               │     & state                   │
     │                               │                               │
     │  3. Return auth URL           │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
     │  4. Redirect to OIDC          │                               │
     ├───────────────────────────────────────────────────────────────>│
     │                               │                               │
     │                               │  5. User authenticates        │
     │                               │                               │
     │  6. Redirect with code        │                               │
     │<───────────────────────────────────────────────────────────────┤
     │                               │                               │
     │  7. GET /auth/callback?code=  │                               │
     ├──────────────────────────────>│                               │
     │                               │  8. Exchange code for tokens  │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │  9. Return tokens             │
     │                               │<──────────────────────────────┤
     │                               │                               │
     │                               │ 10. Create session            │
     │                               │                               │
     │ 11. Redirect to /dashboard    │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
```

### Token Refresh Flow

```text
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │                    │  OIDC    │
│          │                    │          │                    │ Provider │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  1. GET /auth/me              │                               │
     ├──────────────────────────────>│                               │
     │                               │  2. Check token expiration    │
     │                               │     (15 min before expiry)    │
     │                               │                               │
     │                               │  3. Refresh token needed?     │
     │                               │     Yes ───────────────────┐  │
     │                               │                            │  │
     │                               │  4. Refresh access token   │  │
     │                               ├───────────────────────────>│  │
     │                               │                            │  │
     │                               │  5. Return new tokens      │  │
     │                               │<───────────────────────────┤  │
     │                               │                            │  │
     │                               │  6. Update session          │  │
     │                               │<───────────────────────────┘  │
     │                               │                               │
     │  7. Return user data          │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root of your project with the following variables:

```bash
# ============================================
# OIDC Provider Configuration
# ============================================

# OIDC Provider Issuer URL
# This is the base URL of your OIDC provider's discovery endpoint
# Examples:
#   - Auth0: https://your-tenant.auth0.com
#   - Keycloak: https://keycloak.example.com/realms/your-realm
#   - Azure AD: https://login.microsoftonline.com/your-tenant-id
#   - ABP: https://your-abp-backend.com
VITE_OIDC_ISSUER=https://your-oidc-provider.com

# OIDC Client ID
# The client identifier registered with your OIDC provider
VITE_OIDC_CLIENT_ID=your-client-id

# OIDC Client Secret (Optional for public clients)
# Required for confidential clients, optional for public clients
# If using PKCE (which this implementation does), this can be omitted for public clients
VITE_OIDC_CLIENT_SECRET=your-client-secret

# ============================================
# Application URLs
# ============================================

# Base URL of your application
# Development: http://localhost:3000
# Production: https://your-domain.com
VITE_BASE_URL=http://localhost:3000

# OIDC Redirect URI
# Must match exactly what's configured in your OIDC provider
# This is where users are redirected after authentication
VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback

# ============================================
# Session Configuration
# ============================================

# Session Secret
# IMPORTANT: Use a strong, randomly generated secret in production
# Generate with: openssl rand -base64 32
# This is used to encrypt session cookies
VITE_SESSION_SECRET=your-super-secret-key-change-this-in-production

# ============================================
# Optional Configuration
# ============================================

# OIDC Scopes (comma-separated)
# Default: openid,profile,email,offline_access,AbpTemplate
# Customize based on your provider's requirements
VITE_OIDC_SCOPES=openid,profile,email,offline_access,AbpTemplate
```

### Configuration Constants

The application uses constants defined in `src/infrastructure/constants.ts`. These constants are automatically loaded from environment variables with sensible defaults:

```typescript
export const OIDC_CONSTANTS = {
  ISSUER: import.meta.env.VITE_OIDC_ISSUER || "https://your-oidc-provider.com",
  CLIENT_ID: import.meta.env.VITE_OIDC_CLIENT_ID || "your-client-id",
  CLIENT_SECRET: import.meta.env.VITE_OIDC_CLIENT_SECRET || "your-client-secret",
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  REDIRECT_URI: import.meta.env.VITE_OIDC_REDIRECT_URI || "http://localhost:3000/auth/callback",
  SESSION_SECRET: import.meta.env.VITE_SESSION_SECRET || "your-super-secret-key-change-this-in-production",
  SESSION_COOKIE_NAME: "tanstack-oidc-session",
  SCOPES: ["openid", "profile", "email", "offline_access", "AbpTemplate"],
  RESPONSE_TYPE: "code",
  GRANT_TYPE: "authorization_code",
} as const;
```

### Configuration Validation

The application validates OIDC configuration on startup. If required values are missing or contain placeholder values, you'll see clear error messages:

- **Missing Issuer**: "OIDC configuration not properly set. Please configure VITE_OIDC_ISSUER"
- **Missing Client ID**: "OIDC configuration not properly set. Please configure VITE_OIDC_CLIENT_ID"
- **Placeholder Client Secret**: Warning (not an error, as it's optional for public clients)

---

## OIDC Provider Setup

### General OIDC Provider Configuration

Regardless of which OIDC provider you use, you need to configure the following:

#### 1. Create an OIDC Client/Application

In your OIDC provider's admin console:

1. Navigate to Applications/Clients section
2. Create a new application/client
3. Note the **Client ID** and **Client Secret** (if required)

#### 2. Configure Redirect URIs

Add the following redirect URI(s):

- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://your-domain.com/auth/callback`

**Important**: The redirect URI must match **exactly** (including protocol, domain, port, and path).

#### 3. Configure Grant Types

Enable the following grant types:

- ✅ **Authorization Code**
- ✅ **Refresh Token** (for automatic token refresh)

#### 4. Configure Scopes

Ensure these scopes are available:

- `openid` (required)
- `profile` (for user profile information)
- `email` (for user email)
- `offline_access` (for refresh tokens)

#### 5. Configure PKCE (if supported)

Enable PKCE (Proof Key for Code Exchange) for enhanced security. Most modern OIDC providers support this.

### Provider-Specific Setup

#### Auth0

1. **Create Application**:
   - Go to Applications → Create Application
   - Choose "Single Page Web Applications"
   - Note the **Domain**, **Client ID**, and **Client Secret**

2. **Configure URLs**:
   - Allowed Callback URLs: `http://localhost:3000/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

3. **Advanced Settings**:
   - OAuth → Grant Types: Enable "Authorization Code" and "Refresh Token"
   - OAuth → OIDC Conformant: Enable
   - OAuth → PKCE: Enable

4. **Environment Variables**:
   ```bash
   VITE_OIDC_ISSUER=https://your-tenant.auth0.com
   VITE_OIDC_CLIENT_ID=your-auth0-client-id
   VITE_OIDC_CLIENT_SECRET=your-auth0-client-secret
   ```

#### Keycloak

1. **Create Client**:
   - Go to Clients → Create
   - Client ID: `your-client-id`
   - Client Protocol: `openid-connect`
   - Access Type: `public` (for PKCE) or `confidential`

2. **Configure URLs**:
   - Valid Redirect URIs: `http://localhost:3000/auth/callback`
   - Web Origins: `http://localhost:3000`
   - Base URL: `http://localhost:3000`

3. **Configure Capabilities**:
   - Standard Flow Enabled: ✅
   - Direct Access Grants Enabled: ✅ (optional)
   - PKCE Code Challenge Method: `S256`

4. **Environment Variables**:
   ```bash
   VITE_OIDC_ISSUER=https://keycloak.example.com/realms/your-realm
   VITE_OIDC_CLIENT_ID=your-client-id
   VITE_OIDC_CLIENT_SECRET=your-client-secret  # Only if confidential client
   ```

#### Azure AD / Microsoft Entra ID

1. **Register Application**:
   - Go to Azure Portal → Azure Active Directory → App registrations
   - New registration
   - Name: Your app name
   - Supported account types: Choose appropriate
   - Redirect URI: `http://localhost:3000/auth/callback` (SPA platform)

2. **Configure Authentication**:
   - Platform configurations → Single-page application
   - Redirect URIs: `http://localhost:3000/auth/callback`
   - Implicit grant and hybrid flows: Enable "ID tokens" and "Access tokens"

3. **API Permissions**:
   - Microsoft Graph → Delegated permissions:
     - `openid`
     - `profile`
     - `email`
     - `offline_access`

4. **Environment Variables**:
   ```bash
   VITE_OIDC_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0
   VITE_OIDC_CLIENT_ID=your-azure-app-id
   # Client secret not needed for SPA apps with PKCE
   ```

#### ABP Framework (with OpenIddict)

1. **Configure OpenIddict**:
   - In your ABP backend, configure OpenIddict application
   - Client Type: `Public` (for PKCE)
   - Consent Type: `Implicit`
   - Permissions: Enable `GrantTypes.AuthorizationCode` and `GrantTypes.RefreshToken`

2. **Configure Redirect URIs**:
   - Redirect URIs: `http://localhost:3000/auth/callback`
   - Post Logout Redirect URIs: `http://localhost:3000`

3. **Scopes**:
   - Ensure scopes include: `openid`, `profile`, `email`, `offline_access`, `AbpTemplate`

4. **Environment Variables**:
   ```bash
   VITE_OIDC_ISSUER=https://your-abp-backend.com
   VITE_OIDC_CLIENT_ID=your-abp-client-id
   # No client secret needed for public clients
   ```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- TanStack Start application
- OIDC provider account and configuration

### Step 1: Install Dependencies

The required dependencies should already be installed. If not, ensure these are in your `package.json`:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-router": "^1.x",
    "@tanstack/react-start": "^1.x",
    "openid-client": "^5.x"
  }
}
```

### Step 2: Configure Environment Variables

1. Copy the example environment variables (see [Configuration](#configuration) section)
2. Update values with your OIDC provider details
3. Generate a strong session secret:
   ```bash
   openssl rand -base64 32
   ```

### Step 3: Verify Configuration

Start the development server:

```bash
pnpm dev
```

Check the console for any configuration errors. The application will validate OIDC configuration on first use.

### Step 4: Test Authentication

1. Navigate to `http://localhost:3000`
2. Click login or navigate to a protected route
3. You should be redirected to your OIDC provider
4. After authentication, you'll be redirected back to `/dashboard`

---

## Authentication Flow

### Detailed Flow Explanation

#### 1. Login Initiation

When a user clicks login or accesses a protected route:

```typescript
// Client-side: useAuth hook
const { login } = useAuth();
await login(); // Calls GET /auth/login
```

**Server-side (`/auth/login` route)**:
- Generates PKCE code verifier and challenge
- Generates random state parameter (CSRF protection)
- Stores state and code verifier in session
- Builds authorization URL with:
  - `client_id`: Your OIDC client ID
  - `redirect_uri`: Your callback URL
  - `response_type`: `code` (Authorization Code flow)
  - `scope`: Requested scopes
  - `state`: Random state for CSRF protection
  - `code_challenge`: PKCE code challenge
  - `code_challenge_method`: `S256`
- Returns authorization URL to client

#### 2. User Authentication

- Client redirects browser to OIDC provider
- User authenticates (login, MFA, etc.)
- OIDC provider validates credentials
- OIDC provider generates authorization code

#### 3. Callback Handling

After authentication, OIDC provider redirects to:

```http
GET /auth/callback?code=AUTHORIZATION_CODE&state=STATE_PARAMETER
```

**Server-side (`/auth/callback` route)**:
- Extracts `code` and `state` from URL parameters
- Retrieves stored `state` and `codeVerifier` from session
- Validates `state` parameter (CSRF protection)
- Exchanges authorization code for tokens:
  - Sends `code`, `code_verifier`, `redirect_uri` to token endpoint
  - Receives `access_token`, `id_token`, `refresh_token`
- Creates user session:
  - Extracts user claims from ID token
  - Optionally fetches additional user info
  - Stores tokens securely in server-side session
- Clears temporary OIDC session data
- Redirects to `/dashboard` (or original destination)

#### 4. Session Management

- Session stored server-side using encrypted cookies
- Contains: `user`, `accessToken`, `refreshToken`, `idToken`, `expiresAt`
- Tokens never exposed to client-side JavaScript
- Automatic token refresh (15 minutes before expiration)

#### 5. Token Refresh

When accessing protected routes or calling `/auth/me`:

- Server checks token expiration
- If token expires within 15 minutes:
  - Uses refresh token to get new access token
  - Updates session with new tokens
  - Returns fresh user data

#### 6. Logout

When user clicks logout:

```typescript
// Client-side
const { logout } = useAuth();
await logout(); // Calls GET /auth/logout
```

**Server-side (`/auth/logout` route)**:
- Revokes access and refresh tokens (if supported)
- Builds end session URL (RP-initiated logout)
- Clears server-side session
- Redirects to OIDC provider's end session endpoint
- OIDC provider clears its session
- Redirects back to application home page

---

## Usage Guide

### Protecting Routes

Use the `ProtectedRoute` component to wrap routes that require authentication:

```typescript
// src/routes/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import Dashboard from "@/features/dashboard/components/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});
```

**Custom Loading State**:

```typescript
<ProtectedRoute
  loading={
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
      <p>Authenticating...</p>
    </div>
  }
>
  <Dashboard />
</ProtectedRoute>
```

**Custom Fallback (Not Authenticated)**:

```typescript
<ProtectedRoute
  fallback={
    <div>
      <h2>Please log in</h2>
      <button onClick={login}>Login</button>
    </div>
  }
>
  <Dashboard />
</ProtectedRoute>
```

### Using Authentication Hooks

#### `useAuth()` Hook

Provides login, logout, and error management:

```typescript
import { useAuth } from "@/features/auth/hooks/use-auth";

function MyComponent() {
  const { login, logout, clearError, authState } = useAuth();
  const { user, isAuthenticated, isLoading, error } = authState;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <p>Email: {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

#### `useAuthState()` Hook

Lightweight hook for reading authentication state:

```typescript
import { useAuthState } from "@/features/auth/hooks/use-auth";

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuthState();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <p>Roles: {user?.roles?.join(", ")}</p>
    </div>
  );
}
```

#### `useAuthCombined()` Hook

Combines auth state and functions in a single hook:

```typescript
import { useAuthCombined } from "@/features/auth/hooks/use-auth";

function AuthButton() {
  const { user, isAuthenticated, login, logout } = useAuthCombined();

  return isAuthenticated ? (
    <div>
      <span>Hello, {user?.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <button onClick={login}>Login</button>
  );
}
```

### Accessing User Information

User information is available through the auth hooks:

```typescript
const { user } = useAuthState();

// Available user properties:
user?.sub              // Subject (unique user identifier)
user?.name             // Full name
user?.email            // Email address
user?.email_verified    // Email verification status
user?.picture          // Profile picture URL
user?.preferred_username // Preferred username
user?.given_name       // First name
user?.family_name      // Last name
user?.roles            // Array of user roles
user?.updated_at       // Last update timestamp
```

### Role-Based Access Control

Check user roles for conditional rendering:

```typescript
import { useAuthState } from "@/features/auth/hooks/use-auth";

function AdminPanel() {
  const { user } = useAuthState();
  const isAdmin = user?.roles?.includes("admin");

  if (!isAdmin) {
    return <div>Access denied. Admin role required.</div>;
  }

  return <div>Admin content here</div>;
}
```

### Conditional Rendering Based on Auth State

```typescript
function Navigation() {
  const { isAuthenticated, user } = useAuthState();

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <span>Welcome, {user?.name}</span>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </nav>
  );
}
```

### Programmatic Navigation After Login

```typescript
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/use-auth";

function LoginButton() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      // User will be redirected to OIDC provider
      // After callback, they'll be redirected to /dashboard
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

---

## API Reference

### Client-Side API Routes

#### `GET /auth/login`

Initiates the OIDC login flow.

**Response**:
```json
{
  "authUrl": "https://oidc-provider.com/authorize?..."
}
```

**Usage**:
```typescript
const response = await fetch("/auth/login");
const { authUrl } = await response.json();
window.location.href = authUrl;
```

#### `GET /auth/callback?code=...&state=...`

Handles the OIDC callback after authentication. This is called automatically by the OIDC provider.

**Query Parameters**:
- `code`: Authorization code from OIDC provider
- `state`: State parameter for CSRF protection
- `error`: Error code (if authentication failed)

**Response**: HTTP 302 redirect to `/dashboard` (or error page)

#### `GET /auth/logout`

Logs out the user and initiates RP-initiated logout.

**Response**: HTTP 302 redirect to OIDC provider's end session endpoint, then back to home page

**Usage**:
```typescript
window.location.href = "/auth/logout";
```

#### `GET /auth/me`

Returns the current user's information and session status.

**Response**:
```json
{
  "user": {
    "sub": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified": true,
    "roles": ["user", "admin"]
  },
  "expiresAt": 1234567890000
}
```

**Error Response** (401/403):
```json
{
  "user": null
}
```

**Usage**:
```typescript
const response = await fetch("/auth/me");
const { user, expiresAt } = await response.json();
```

### Server-Side Functions

#### `getOIDCConfig()`

Retrieves OIDC configuration through discovery.

```typescript
import { getOIDCConfig } from "@/infrastructure/auth/oidc";

const config = await getOIDCConfig();
```

#### `getAuthUrl()`

Generates authorization URL for login.

```typescript
import { getAuthUrl } from "@/infrastructure/auth/oidc";

const { url, state, codeVerifier } = await getAuthUrl();
```

#### `exchangeCodeForTokens(callbackUrl, codeVerifier, state)`

Exchanges authorization code for tokens.

```typescript
import { exchangeCodeForTokens } from "@/infrastructure/auth/oidc";

const tokenSet = await exchangeCodeForTokens(
  new URL(request.url),
  codeVerifier,
  state
);
```

#### `refreshToken(refreshToken)`

Refreshes an access token using a refresh token.

```typescript
import { refreshToken } from "@/infrastructure/auth/oidc";

const newTokenSet = await refreshToken(refreshToken);
```

#### `getUserSession()`

Retrieves the current user session (with automatic token refresh).

```typescript
import { getUserSession } from "@/infrastructure/auth/auth-server";

const session = await getUserSession();
if (session) {
  console.log(session.user);
  console.log(session.accessToken);
}
```

#### `createSession(tokenResponse)`

Creates a new user session from token response.

```typescript
import { createSession } from "@/infrastructure/auth/auth-server";

const session = await createSession(tokenSet);
```

#### `performLogout()`

Performs complete logout including token revocation.

```typescript
import { performLogout } from "@/infrastructure/auth/auth-server";

const { endSessionUrl } = await performLogout();
```

---

## Security Features

### PKCE (Proof Key for Code Exchange)

PKCE enhances security for public clients by:

1. **Code Verifier**: Random cryptographically random string generated by client
2. **Code Challenge**: SHA256 hash of code verifier
3. **Code Challenge Method**: `S256` (SHA256)

**Flow**:
- Client generates code verifier and challenge
- Sends challenge in authorization request
- Sends verifier in token exchange
- Server validates challenge matches verifier

This prevents authorization code interception attacks.

### State Parameter Validation

The state parameter prevents CSRF attacks:

1. **Generation**: Random state generated on login
2. **Storage**: Stored in server-side session
3. **Validation**: State from callback must match stored state
4. **One-time Use**: State is cleared after validation

### Secure Session Management

- **Server-Side Storage**: Tokens stored in encrypted server-side sessions
- **HttpOnly Cookies**: Session cookies are HttpOnly (not accessible to JavaScript)
- **Secure Cookies**: Cookies marked as Secure in production (HTTPS only)
- **SameSite**: Cookies use `Lax` SameSite policy
- **Encryption**: Session data encrypted with strong secret

### Token Security

- **No Client Exposure**: Access tokens never exposed to client-side JavaScript
- **Automatic Refresh**: Tokens refreshed proactively before expiration
- **Token Revocation**: Tokens revoked on logout (if supported by provider)
- **Expiration Handling**: Expired tokens trigger automatic refresh or logout

### Error Handling

- **No Information Leakage**: Error messages don't expose sensitive information
- **User-Friendly Messages**: Errors translated to user-friendly messages
- **Logging**: Server-side errors logged for debugging (not exposed to client)

---

## Session Management

### Session Structure

Sessions are stored server-side with the following structure:

```typescript
interface SessionData {
  user: User;              // User information from ID token
  accessToken: string;      // JWT access token
  refreshToken?: string;    // Refresh token (if available)
  idToken?: string;         // ID token
  expiresAt: number;        // Token expiration timestamp (ms)
}
```

### Session Lifecycle

1. **Creation**: Session created after successful token exchange
2. **Access**: Session retrieved on each authenticated request
3. **Refresh**: Tokens refreshed automatically 15 minutes before expiration
4. **Expiration**: Session cleared if refresh fails or tokens expire
5. **Logout**: Session cleared on explicit logout

### Token Refresh Strategy

Tokens are refreshed proactively:

- **Threshold**: 15 minutes before expiration (`TOKEN_REFRESH_THRESHOLD`)
- **Automatic**: Happens transparently on session access
- **Locking**: Refresh lock prevents concurrent refresh attempts
- **Fallback**: If refresh fails, session is cleared

### Session Storage

Sessions use TanStack Start's built-in session management:

- **Cookie-Based**: Sessions stored in encrypted cookies
- **Server-Side**: Cookie contains encrypted session data
- **Configuration**: Configurable cookie options (secure, httpOnly, sameSite)

---

## Error Handling

### Error Types

#### Configuration Errors

**Error**: "OIDC configuration not properly set"
- **Cause**: Missing or invalid OIDC configuration
- **Solution**: Check environment variables

**Error**: "OIDC configuration discovery failed"
- **Cause**: Cannot reach OIDC provider or invalid issuer URL
- **Solution**: Verify `VITE_OIDC_ISSUER` is correct and accessible

#### Authentication Errors

**Error**: "Invalid client credentials"
- **Cause**: Wrong client ID or secret
- **Solution**: Verify `VITE_OIDC_CLIENT_ID` and `VITE_OIDC_CLIENT_SECRET`

**Error**: "Invalid authorization code or PKCE verifier"
- **Cause**: Code expired, already used, or verifier mismatch
- **Solution**: Retry login (new code will be generated)

**Error**: "Redirect URI mismatch"
- **Cause**: Redirect URI doesn't match provider configuration
- **Solution**: Verify `VITE_OIDC_REDIRECT_URI` matches provider settings

**Error**: "State mismatch"
- **Cause**: CSRF protection detected invalid state
- **Solution**: Retry login (new state will be generated)

#### Network Errors

**Error**: "Network error connecting to OIDC provider"
- **Cause**: Cannot reach OIDC provider
- **Solution**: Check network connectivity and provider URL

#### Token Errors

**Error**: "Token refresh failed"
- **Cause**: Refresh token invalid or expired
- **Solution**: User needs to login again

**Error**: "Failed to retrieve user information"
- **Cause**: Cannot fetch user info from provider
- **Solution**: Check provider's user info endpoint

### Error Handling in Components

```typescript
function MyComponent() {
  const { authState, clearError } = useAuth();
  const { error } = authState;

  if (error) {
    return (
      <div className="error-container">
        <p>Authentication Error: {error}</p>
        <button onClick={clearError}>Dismiss</button>
        <button onClick={login}>Retry Login</button>
      </div>
    );
  }

  return <div>Content</div>;
}
```

### Error Query Parameters

After failed authentication, users are redirected with error query parameters:

- `?error=auth_failed`: General authentication failure
- `?error=config_error`: Configuration error
- `?error=invalid_client`: Invalid client credentials
- `?error=invalid_code`: Invalid authorization code
- `?error=network_error`: Network connectivity issue
- `?error=missing_params`: Missing required parameters
- `?error=invalid_session`: Invalid session data
- `?error=state_mismatch`: State validation failed

Handle these in your components:

```typescript
import { useSearch } from "@tanstack/react-router";

function HomePage() {
  const { error } = useSearch({ from: "/" });

  useEffect(() => {
    if (error) {
      // Handle error
      console.error("Auth error:", error);
    }
  }, [error]);

  return <div>Home</div>;
}
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update all environment variables for production
- [ ] Generate strong session secret (`openssl rand -base64 32`)
- [ ] Configure production OIDC provider
- [ ] Update redirect URIs in OIDC provider
- [ ] Enable HTTPS
- [ ] Configure secure cookies
- [ ] Test authentication flow
- [ ] Test token refresh
- [ ] Test logout flow
- [ ] Review error handling
- [ ] Set up monitoring and logging

### Environment Variables for Production

```bash
# Production OIDC Provider
VITE_OIDC_ISSUER=https://your-production-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-production-client-id
VITE_OIDC_CLIENT_SECRET=your-production-client-secret

# Production Application URLs
VITE_BASE_URL=https://your-domain.com
VITE_OIDC_REDIRECT_URI=https://your-domain.com/auth/callback

# Strong Session Secret (generate new one)
VITE_SESSION_SECRET=<generated-strong-secret>
```

### OIDC Provider Configuration

Update your OIDC provider with production URLs:

1. **Redirect URIs**: `https://your-domain.com/auth/callback`
2. **Post Logout Redirect URIs**: `https://your-domain.com`
3. **Allowed Origins**: `https://your-domain.com`
4. **CORS**: Configure CORS for your domain

### HTTPS Configuration

HTTPS is required for OIDC in production:

1. **SSL Certificate**: Obtain SSL certificate (Let's Encrypt, etc.)
2. **Secure Cookies**: Cookies automatically marked as Secure in production
3. **HSTS**: Consider enabling HSTS headers

### Session Security

In production, sessions are automatically configured with:

- **Secure**: Cookies only sent over HTTPS
- **HttpOnly**: Cookies not accessible to JavaScript
- **SameSite**: `Lax` policy (CSRF protection)

### Monitoring

Set up monitoring for:

- Authentication success/failure rates
- Token refresh failures
- Session expiration events
- Error rates by type

### Logging

Configure logging for:

- Authentication events (login, logout)
- Token refresh events
- Error events (with sanitized data)
- Security events (state mismatches, etc.)

**Important**: Never log sensitive data (tokens, secrets, etc.)

---

## Testing

### Test Mode

The application includes a test mode for development and E2E testing:

**Enable Test Mode**:
```typescript
// In browser console or test setup
localStorage.setItem("test-mode", "true");
// or
sessionStorage.setItem("test-mode", "true");
```

**Test Mode Behavior**:
- `/auth/me` returns mock user data
- No actual OIDC provider calls
- Useful for E2E tests and development

### Unit Testing

Test authentication hooks:

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/features/auth/hooks/use-auth";

test("useAuth provides login function", async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.login).toBeDefined();
  expect(typeof result.current.login).toBe("function");
});
```

### E2E Testing

Example Playwright test:

```typescript
import { test, expect } from "@playwright/test";

test("user can login and access protected route", async ({ page }) => {
  // Enable test mode
  await page.addInitScript(() => {
    localStorage.setItem("test-mode", "true");
  });

  await page.goto("/");
  
  // Login
  await page.click("text=Login");
  // In test mode, this should work without actual OIDC provider
  
  // Check protected route
  await page.goto("/dashboard");
  await expect(page.locator("text=Dashboard")).toBeVisible();
});
```

### Mocking OIDC Provider

For testing without a real OIDC provider:

```typescript
// Mock OIDC discovery
vi.mock("@/infrastructure/auth/oidc", () => ({
  getOIDCConfig: vi.fn().mockResolvedValue({
    authorization_endpoint: "https://mock-oidc.com/authorize",
    token_endpoint: "https://mock-oidc.com/token",
  }),
}));
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "OIDC client initialization failed"

**Symptoms**:
- Error in console: "OIDC configuration discovery failed"
- Login button doesn't work

**Causes**:
- Invalid issuer URL
- Network connectivity issues
- OIDC provider not accessible

**Solutions**:
1. Verify `VITE_OIDC_ISSUER` is correct and accessible
2. Test issuer URL in browser: `https://your-issuer/.well-known/openid-configuration`
3. Check network connectivity and firewall rules
4. Verify OIDC provider is running and accessible

#### 2. "State mismatch" Error

**Symptoms**:
- Redirected to home page with `?error=state_mismatch`
- Authentication fails after OIDC provider redirect

**Causes**:
- Session expired between login and callback
- Multiple login attempts
- Browser blocking cookies

**Solutions**:
1. Clear browser cookies and retry
2. Ensure cookies are enabled
3. Check session cookie configuration
4. Verify session secret is consistent

#### 3. "Redirect URI mismatch"

**Symptoms**:
- OIDC provider shows error: "redirect_uri_mismatch"
- Authentication fails at provider

**Causes**:
- Redirect URI doesn't match provider configuration
- Protocol mismatch (http vs https)
- Port mismatch
- Path mismatch

**Solutions**:
1. Verify `VITE_OIDC_REDIRECT_URI` matches exactly (including protocol, port, path)
2. Check OIDC provider configuration
3. Ensure redirect URI is registered in provider
4. For development, use `http://localhost:3000/auth/callback` exactly

#### 4. Token Refresh Fails

**Symptoms**:
- User logged out unexpectedly
- "Token refresh failed" in logs

**Causes**:
- Refresh token expired
- Refresh token revoked
- Provider doesn't support refresh tokens

**Solutions**:
1. Check if provider supports refresh tokens
2. Verify `offline_access` scope is requested
3. Check token expiration times
4. Implement proper error handling for refresh failures

#### 5. Session Not Persisting

**Symptoms**:
- User logged out on page refresh
- Session data not available

**Causes**:
- Session cookie not set
- Cookie domain/path issues
- Session secret changed

**Solutions**:
1. Check browser cookies (DevTools → Application → Cookies)
2. Verify session cookie is present
3. Check cookie domain and path settings
4. Ensure session secret is consistent
5. Check SameSite cookie policy

#### 6. CORS Errors

**Symptoms**:
- Browser console shows CORS errors
- API calls fail

**Causes**:
- OIDC provider not configured for your domain
- Missing CORS headers

**Solutions**:
1. Configure CORS in OIDC provider
2. Add your domain to allowed origins
3. Check CORS headers in network tab

#### 7. "Invalid client credentials"

**Symptoms**:
- Error: "Invalid client credentials"
- Token exchange fails

**Causes**:
- Wrong client ID
- Wrong client secret
- Client not found in provider

**Solutions**:
1. Verify `VITE_OIDC_CLIENT_ID` is correct
2. Verify `VITE_OIDC_CLIENT_SECRET` is correct (if required)
3. Check client configuration in OIDC provider
4. For public clients, ensure client secret is optional

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
DEBUG=oidc:*

# Or in code
console.log("OIDC Config:", await getOIDCConfig());
```

### Network Debugging

Use browser DevTools to debug:

1. **Network Tab**: Check all OIDC-related requests
2. **Application Tab**: Check cookies and session storage
3. **Console Tab**: Check for JavaScript errors

### Provider-Specific Issues

#### Auth0 Provider

- **Issue**: "Invalid audience"
  - **Solution**: Configure audience in Auth0 application settings

#### Keycloak Provider

- **Issue**: "Invalid client"
  - **Solution**: Ensure client access type matches (public vs confidential)

#### Azure AD Provider

- **Issue**: "Invalid scope"
  - **Solution**: Verify API permissions are granted and admin consent given

---

## Advanced Configuration

### Custom Scopes

Configure custom scopes:

```bash
VITE_OIDC_SCOPES=openid,profile,email,offline_access,custom_scope
```

### Custom Token Refresh Threshold

Modify token refresh threshold in `src/infrastructure/constants.ts`:

```typescript
// Refresh 30 minutes before expiration (instead of 15)
export const TOKEN_REFRESH_THRESHOLD = 30 * 60 * 1000;
```

### Custom Session Cookie Name

Modify session cookie name in `src/infrastructure/constants.ts`:

```typescript
SESSION_COOKIE_NAME: "my-custom-session-name",
```

### Custom User Info Mapping

Modify user info extraction in `src/infrastructure/auth/auth-server.ts`:

```typescript
// Custom role extraction
function extractRoles(userInfo: Record<string, unknown>): string[] {
  // Your custom logic here
  const roles = userInfo.custom_roles_field;
  return Array.isArray(roles) ? roles : [];
}
```

### Multiple OIDC Providers

To support multiple OIDC providers, you can:

1. Create provider-specific configuration
2. Use environment variables to select provider
3. Implement provider abstraction layer

---

## File Structure

```text
src/
├── infrastructure/
│   ├── auth/
│   │   ├── oidc.ts              # OIDC client functions
│   │   ├── auth-server.ts       # Server-side auth utilities
│   │   └── session.ts           # Session management
│   └── constants.ts             # OIDC configuration constants
├── features/
│   └── auth/
│       ├── components/
│       │   └── protected-route.tsx  # Route protection component
│       └── hooks/
│           └── use-auth.tsx     # Authentication hooks and context
└── routes/
    ├── __root.tsx               # Root route with AuthProvider
    └── auth/
        ├── login.ts             # Login API route
        ├── callback.ts          # Callback handler route
        ├── logout.ts            # Logout API route
        └── me.ts                # User info API route
```

### Key Files Explained

#### `src/infrastructure/auth/oidc.ts`

Contains OIDC client functions:
- `getOIDCConfig()`: OIDC configuration discovery
- `getAuthUrl()`: Generate authorization URL
- `exchangeCodeForTokens()`: Exchange code for tokens
- `refreshToken()`: Refresh access token
- `getUserInfo()`: Fetch user information
- `revokeToken()`: Revoke tokens
- `getEndSessionUrl()`: Build logout URL

#### `src/infrastructure/auth/auth-server.ts`

Server-side authentication utilities:
- `getUserSession()`: Get current session (with auto-refresh)
- `createSession()`: Create new session
- `performLogout()`: Complete logout flow

#### `src/infrastructure/auth/session.ts`

Session management:
- `SessionData` interface
- `sessionUtils`: Session CRUD operations
- `useAppSession()`: React hook for session access

#### `src/features/auth/hooks/use-auth.tsx`

Client-side authentication:
- `AuthProvider`: Context provider
- `useAuth()`: Main auth hook
- `useAuthState()`: Auth state hook
- `useAuthCombined()`: Combined hook

#### `src/features/auth/components/protected-route.tsx`

Route protection component:
- Wraps routes requiring authentication
- Shows loading state
- Shows login prompt if not authenticated

---

## Additional Resources

### Documentation

- [OpenID Connect Specification](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0 with PKCE](https://oauth.net/2/pkce/)
- [TanStack Start Documentation](https://tanstack.com/start)
- [openid-client Library](https://github.com/panva/node-openid-client)

### OIDC Provider Documentation

- [Auth0 Documentation](https://auth0.com/docs)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- [ABP Framework Documentation](https://docs.abp.io/)

### Security Best Practices

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

## Support

For issues, questions, or contributions:

1. Check this documentation first
2. Review troubleshooting section
3. Check GitHub issues
4. Review OIDC provider documentation
5. Consult TanStack Start documentation

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team

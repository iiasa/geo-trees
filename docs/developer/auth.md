# Authentication

This document provides a developer overview of how authentication works in IIASA GeoTrees. For complete configuration instructions, troubleshooting, and advanced options, see the [full OIDC setup guide](../../frontend/docs/OIDC_SETUP.md).

---

## 1. Overview

The backend (ABP Framework + OpenIddict) acts as **both** the REST API server and the OIDC identity provider. It exposes standard OIDC endpoints (e.g. `/connect/authorize`, `/connect/token`, `/connect/endsession`) in addition to the application API.

The frontend authenticates using **Authorization Code Flow with PKCE** (Proof Key for Code Exchange). Tokens are stored **server-side** in encrypted TanStack Start sessions and are never exposed to the browser. The browser only holds an `HttpOnly` session cookie.

---

## 2. Authentication Flow

1. User visits a protected route — the TanStack Start server checks the session cookie via `getUserSession()`.
2. No valid session found — the server redirects the user to `/auth/login`, which generates a PKCE code verifier/challenge and state, stores them in a temporary session, and returns the backend's OIDC authorize URL (`/connect/authorize`).
3. User enters credentials on the backend's hosted login page.
4. Backend redirects to `VITE_OIDC_REDIRECT_URI` (e.g. `http://localhost:3000/auth/callback`) with an authorization code and state parameter.
5. The frontend callback route (`/auth/callback`) retrieves the stored PKCE verifier and state from the temporary session, validates the state, then calls `exchangeCodeForTokens()` to exchange the code for tokens.
6. `createSession()` stores the access token, refresh token, ID token, and user claims in an encrypted server-side session (keyed by `VITE_SESSION_SECRET`).
7. Subsequent requests include the session cookie. The API proxy route (`/api/proxy`) reads the session, retrieves the access token, and attaches it as a `Bearer` header when forwarding requests to the backend.

---

## 3. Key Files

### `frontend/src/infrastructure/auth/`

| File | Description |
|------|-------------|
| `oidc.ts` | Wraps `openid-client`: OIDC discovery, authorization URL generation, code-for-token exchange, token refresh, token revocation, and end-session URL construction. |
| `auth-server.ts` | Higher-level server functions: `getUserSession()` (with automatic proactive token refresh 15 minutes before expiry), `createSession()` (builds and stores session data after login), and `performLogout()` (revokes tokens, clears session, returns end-session URL). |
| `session.ts` | TanStack Start session utilities (`sessionUtils.get/update/clear`) and type definitions (`User`, `SessionData`). Configures the `HttpOnly`, `SameSite=lax` session cookie encrypted with `VITE_SESSION_SECRET`. |

### `frontend/src/routes/` (auth-related)

| File | Description |
|------|-------------|
| `auth/login.ts` | Server GET handler — generates the PKCE code verifier/challenge and state, stores them in a temporary session, and returns the OIDC authorization URL to the client. |
| `auth/callback.ts` | Server GET handler — validates state, exchanges the authorization code for tokens using the stored PKCE verifier, creates the user session, and redirects to `/dashboard`. |
| `auth/logout.ts` | Server GET handler — calls `performLogout()` to revoke tokens and clear the session, then redirects to the OIDC end-session endpoint for RP-initiated logout. |
| `auth/me.ts` | Server route that returns the current user's session data for client-side consumption. |
| `_authed.tsx` | Layout route that guards all routes under `/_authed`. Uses `beforeLoad` to check the session and redirect unauthenticated users to `/`. |

---

## 4. Session Management

- Sessions are stored server-side using TanStack Start's session API (`getSession`, `updateSession`, `clearSession` from `@tanstack/react-start/server`).
- The session cookie is encrypted with `VITE_SESSION_SECRET` and is `HttpOnly` and `SameSite=lax`. In production it is also `Secure`.
- Access tokens are refreshed proactively when they are within 15 minutes of expiry. The expiry is read from the JWT `exp` claim when available, falling back to the `expiresIn` value from the token response.
- Concurrent refresh attempts are deduplicated — a lock prevents multiple simultaneous refresh calls.
- On logout, `performLogout()` revokes both the access token and the refresh token, clears the local session, and redirects to the backend's `/connect/endsession` endpoint (RP-initiated logout).

---

## 5. Protecting Routes

All routes placed under the `_authed` layout are automatically protected. The layout route at `frontend/src/routes/_authed.tsx` uses `beforeLoad` to verify the session on every navigation:

```typescript
// frontend/src/routes/_authed.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getUserSession } from "@/infrastructure/auth/session";

const getAuthUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getUserSession();
  return session?.user ?? null;
});

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const user = await getAuthUser();
    if (!user) {
      throw redirect({ to: "/" });
    }
    return { user };
  },
  component: () => <Outlet />,
});
```

To protect a new route, place it under the `_authed` directory (e.g. `frontend/src/routes/_authed/my-page.tsx`). The `user` object returned by `beforeLoad` is available via `Route.useRouteContext()` in any child route.

---

## 6. Full Reference

For complete details including environment variable configuration, OIDC provider setup (ABP/OpenIddict), security features, error handling, production deployment, and advanced options, see:

[`frontend/docs/OIDC_SETUP.md`](../../frontend/docs/OIDC_SETUP.md)

# Environment Variables

All frontend environment variables live in `frontend/.env`. Copy `frontend/.env.example` to `frontend/.env` to get started. Variables prefixed with `VITE_` are available to the Vite build; `NODE_TLS_REJECT_UNAUTHORIZED` is a Node.js runtime variable consumed by the SSR server.

## Variable Reference

| Variable | Example Value | Description | Change for Production? |
|---|---|---|---|
| `VITE_OIDC_ISSUER` | `https://localhost:44324` | Base URL of the OIDC provider. The backend (ABP + OpenIddict) acts as the identity server, so this points at the backend. | **Yes** — set to the backend's public URL. |
| `VITE_OIDC_CLIENT_ID` | `GeoTrees_React` | OIDC client ID registered in the backend's OpenIddict configuration. Must match exactly. | Only if you rename the client registration. |
| `VITE_BASE_URL` | `http://localhost:3000` | Public base URL of the frontend application. Used to construct absolute URLs (e.g. redirect URIs). | **Yes** — set to the frontend's public URL. |
| `VITE_OIDC_REDIRECT_URI` | `http://localhost:3000/auth/callback` | URL the OIDC provider redirects to after a successful login. Must be registered as an allowed redirect URI in the backend. | **Yes** — must match `VITE_BASE_URL`. |
| `VITE_SESSION_SECRET` | `your-super-secret-key-change-this-in-production` | Secret used to encrypt the server-side session cookie. Must be a long, random string. **Never use the default value in production.** | **Yes — required.** |
| `VITE_API_BASE_URL` | `https://localhost:44324` | Base URL of the backend REST API. The frontend's SSR server uses this to forward proxied requests. | **Yes** — set to the backend's internal or public URL. |
| `VITE_API_PROXY_PATH` | `/api/proxy` | Frontend route that proxies all backend API requests. Client-side code calls this path; the SSR server forwards it to `VITE_API_BASE_URL`. | No — leave as `/api/proxy` unless you change the proxy route file. |
| `VITE_OPENAPI_SPEC_URL` | `https://localhost:44324/swagger/v1/swagger.json` | URL from which `pnpm generate-api` fetches the OpenAPI spec to regenerate the TypeScript client. Only needed during development. | No — development-only tooling variable. |
| `VITE_APP_NAME` | `geo-trees` | Application name, available for use in the UI. | Optional. |
| `VITE_APP_VERSION` | `v1` | Application version string, available for use in the UI. | Optional. |
| `VITE_OIDC_SCOPES` | `openid profile email offline_access GeoTrees` | Space-separated list of OIDC scopes requested at login. `GeoTrees` is a custom scope defined in the backend. | Only if you add or remove custom scopes. |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` | When set to `0`, disables TLS certificate verification in Node.js. Allows the frontend SSR server to call the backend's self-signed dev certificate. **Set to `1` (or remove entirely) in production.** | **Yes — must be `1` in production.** |

## Production Checklist

The following variables **must** be changed before deploying to any non-local environment:

1. **`VITE_SESSION_SECRET`** — Generate a cryptographically random string (e.g. `openssl rand -hex 32`). The example value is public and must never be used in production.
2. **`VITE_BASE_URL`** — Set to the frontend's public HTTPS URL (e.g. `https://geotrees.example.com`).
3. **`VITE_OIDC_REDIRECT_URI`** — Update to match `VITE_BASE_URL` (e.g. `https://geotrees.example.com/auth/callback`). Register this URI in the backend's OpenIddict client configuration.
4. **`VITE_OIDC_ISSUER`** — Set to the backend's public HTTPS URL.
5. **`VITE_API_BASE_URL`** — Set to the backend's reachable URL from the frontend SSR server (can be an internal network address).
6. **`NODE_TLS_REJECT_UNAUTHORIZED`** — Set to `1` or remove the variable entirely. Setting it to `0` in production is a security risk.

# Production Configuration

## OpenIddict Signing Certificate

Production requires a real signing certificate (not the dev cert). ABP expects an `openiddict.pfx` file.

Generate a self-signed certificate for testing:
```bash
dotnet dev-certs https -v -ep openiddict.pfx -p your-certificate-password
```

For production, use two separate RSA certificates (one for signing, one for encryption). See:
- [OpenIddict Certificate Configuration](https://documentation.openiddict.com/configuration/encryption-and-signing-credentials.html)
- [ABP OpenIddict Deployment Guide](https://abp.io/docs/latest/Deployment/Configuring-OpenIddict#production-environment)

### Certificate Auto-Generation in Docker

When using the backend Docker image, the entrypoint script automatically generates a self-signed OpenIddict certificate if `openiddict.pfx` does not already exist. The certificate passphrase is read from the `AuthServer__CertificatePassPhrase` environment variable. For production, mount a proper certificate instead of relying on this fallback.

## Required Environment Variable Changes

All of these must be updated from their development defaults:

| Variable | Dev Value | Production Requirement |
|----------|-----------|----------------------|
| `VITE_SESSION_SECRET` | `your-super-secret-key-...` | Strong random string (32+ chars) |
| `VITE_BASE_URL` | `http://localhost:3000` | Your production frontend URL |
| `VITE_OIDC_REDIRECT_URI` | `http://localhost:3000/auth/callback` | Your production callback URL |
| `VITE_OIDC_ISSUER` | `https://localhost:44324` | Your production backend URL |
| `VITE_API_BASE_URL` | `https://localhost:44324` | Your production backend URL |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` | **Must be `1`** (or remove entirely) |

## Database Connection

Set the PostgreSQL connection string in `backend/IIASA.GeoTrees/appsettings.json` or via the environment variable `ConnectionStrings__Default`:

```
Host=your-db-host;Port=5432;Database=GeoTrees;Username=your-user;Password=your-password
```

## HTTPS / TLS

- Use a real TLS certificate from Let's Encrypt or your CA for production domains
- The backend's self-signed dev cert is NOT suitable for production
- Configure your reverse proxy (nginx, Caddy, etc.) to terminate TLS
- The dev Docker Compose for the backend (`backend/etc/docker/`) uses `dotnet dev-certs` to generate a localhost certificate — this is only valid for `localhost` and must not be used for real deployments

## OIDC Client Registration

The OIDC client (`GeoTrees_React`) must be registered in the backend with the production redirect URI. This is configured via ABP's OpenIddict client management — ensure `VITE_OIDC_REDIRECT_URI` matches the registered redirect URI.

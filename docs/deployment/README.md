# Deployment

GeoTrees can be deployed in two ways:

## Options

### Docker Compose (Recommended)
Run the full stack via Docker Compose with a single command. See [Docker](./docker.md).

### Manual Deployment
Deploy the frontend Node.js server and backend ASP.NET Core app separately to your infrastructure of choice.

- The frontend is a Node.js server (TanStack Start SSR) — deploy like any Node app
- The backend is an ASP.NET Core app — deploy like any .NET app
- Both need environment variables configured (see [Production Configuration](./production-config.md))
- Run [database migrations](./database-migrations.md) before first deployment and after updates

## Pre-Deployment Checklist

- [ ] PostgreSQL database provisioned and accessible
- [ ] [Environment variables](../getting-started/environment-variables.md) configured for production
- [ ] Production TLS certificate obtained
- [ ] OpenIddict signing certificate generated (see [Production Configuration](./production-config.md))
- [ ] Database migrations run

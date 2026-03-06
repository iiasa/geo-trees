# Backend Developer Guide

The backend is an ASP.NET Core / .NET 10 application built on the ABP Framework using the single-layer application template. It serves as both the REST API and the OpenID Connect identity provider for the frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | .NET 10 / ASP.NET Core |
| Application framework | ABP Framework 10.0.2 (single-layer template) |
| ORM | Entity Framework Core 10 |
| Database | PostgreSQL (via Npgsql) |
| Identity / OIDC server | OpenIddict (embedded in ABP) |
| API documentation | Swagger / Swashbuckle (auto-configured by ABP) |
| Logging | Serilog |
| Dependency injection | Autofac (via ABP) |
| Object mapping | Mapperly (via ABP) |
| Email | MailKit (via ABP) |
| CMS | ABP CMS Kit |
| Data exports | EPPlus (Excel), CsvHelper |
| Health checks | AspNetCore.HealthChecks.UI |

## What ABP Framework Provides

ABP handles a large amount of infrastructure so application code can focus on domain logic:

- **Multi-tenancy** — tenant resolution, data isolation, and the `/api/multi-tenancy/` endpoints are wired up automatically. The flag `GeoTreesModule.IsMultiTenant = true` controls whether multi-tenancy is active.
- **Identity management** — ready-made REST endpoints under `/api/identity/` for users, roles, claims, and organizational units. No custom controller code required.
- **OIDC server (OpenIddict)** — token issuance and validation at `/connect/token`, `/connect/authorize`, etc. The frontend uses PKCE against these endpoints.
- **Permission management** — endpoints at `/api/permission-management/` backed by a permission store. Custom permissions are defined in `Permissions/`.
- **Audit logging** — every API call is logged automatically to the database.
- **Localization** — JSON-based resources under `Localization/`. The active language list is configured in `GeoTreesModule.cs`.
- **Swagger UI** — available at `/swagger` with the OpenAPI spec at `/swagger/v1/swagger.json`. ABP's `AddAbpSwaggerGen` integration handles authentication headers automatically.
- **Auto API controllers** — any public method on an Application Service class is automatically exposed as a REST endpoint. No controller boilerplate is needed. This is configured in `ConfigureAutoApiControllers()` in `GeoTreesModule.cs`.
- **Background jobs** — persisted job queue backed by EF Core.
- **Blob storage** — database-backed blob store for file uploads.
- **Settings management** — endpoints at `/api/setting-management/` for runtime configuration values.

## Folder Structure

```
backend/IIASA.GeoTrees/
├── Controllers/              # Explicit HTTP controllers (e.g. PlotController.cs)
├── Components/               # Razor view components
├── Data/                     # DbContext (GeoTreesDbContext) and seed data
├── Emailing/                 # Scriban email templates (.tpl)
├── Entities/                 # Domain entities (EF Core models)
├── Extensions/               # Extension methods
├── HealthChecks/             # Health check registrations and endpoints
├── Localization/             # JSON localization resources (GeoTrees/)
├── Menus/                    # ABP menu/toolbar contributors
├── Migrations/               # EF Core migrations (auto-generated, do not edit)
├── ObjectMapping/            # Mapperly object-mapping profiles
├── Pages/                    # Razor Pages (ABP admin UI)
├── Permissions/              # Permission group and definition classes
├── Properties/               # Launch settings
├── Services/                 # Application services (business logic)
│   ├── Plots/                # Plot-related services and DTOs
│   ├── MapLayers/            # Map layer services and DTOs
│   ├── ExternalData/         # External data integration services
│   └── Dtos/                 # Shared DTO types
├── Settings/                 # Application setting definitions
├── Source/                   # Static source data files (Excel, PDF)
├── Themes/                   # LeptonX Lite theme customisations
├── GeoTreesModule.cs         # Root ABP module — service registration and middleware pipeline
├── GeoTreesBrandingProvider.cs
├── GeoTreesGlobalFeatureConfigurator.cs
├── GeoTreesModuleExtensionConfigurator.cs
├── Program.cs                # Application entry point
├── appsettings.json          # Configuration (DB connection string, OIDC, URLs)
└── Dockerfile                # Container build definition
```

## How to Add a New API Endpoint

ABP's auto-API-controller convention means you rarely need to write a controller. Follow these steps:

1. **Create an entity** in `Entities/` inheriting from `AuditedEntity<Guid>` (includes `CreationTime`, `CreatorId`, `LastModificationTime`, `LastModifierId`) or `Entity<Guid>` for a simpler model.

2. **Register the entity** — add a `DbSet<YourEntity>` property to `Data/GeoTreesDbContext.cs` and configure the table/column mapping in `OnModelCreating`.

3. **Create a migration:**
   ```bash
   cd backend/IIASA.GeoTrees
   dotnet ef migrations add AddYourEntity
   ```

4. **Create an Application Service** in `Services/` — implement a class that extends `GeoTreesAppService` (the project's base class). ABP will automatically generate REST endpoints from the public methods on this service. Standard CRUD can be inherited from ABP's `CrudAppService<>` base.

5. **Regenerate the frontend TypeScript client** — once the backend is running with the new endpoints, run from the `frontend/` directory:
   ```bash
   pnpm generate-api
   ```
   This fetches the updated OpenAPI spec and regenerates all types, SDK methods, Zod schemas, and TanStack Query hooks in `src/infrastructure/api/`.

6. **Use the generated hooks** in your frontend feature:
   ```typescript
   import { yourEntityGetListOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
   const { data } = useQuery(yourEntityGetListOptions({ query: { skipCount: 0, maxResultCount: 10 } }));
   ```

## Key Configuration

### Database connection

`appsettings.json` → `ConnectionStrings.Default`

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=GeoTrees;Username=postgres;Password=..."
  }
}
```

### OIDC / Auth server settings

Configured in `GeoTreesModule.cs` via `PreConfigure<OpenIddictBuilder>` and `PreConfigure<OpenIddictServerBuilder>`. The passphrase for the production signing certificate is read from `AuthServer:CertificatePassPhrase` in configuration.

Password reset and email confirmation redirect URLs are set in `ConfigureUrls()` and point to the frontend (`App:FrontendUrl`, defaulting to `http://localhost:3000`).

### Permissions

Defined in `Permissions/GeoTreesPermissions.cs`. Add new permission constants there and register them in the corresponding `PermissionDefinitionProvider`.

### Settings

Defined in `Settings/GeoTreesSettings.cs`. Settings can be read at runtime via ABP's `ISettingProvider`.

### Forwarded headers

The middleware pipeline in `OnApplicationInitialization` applies `UseForwardedHeaders` before all other middleware so that `X-Forwarded-For` and `X-Forwarded-Proto` headers from a reverse proxy (e.g. nginx, Kubernetes ingress) are trusted.

## Key Commands

```bash
# Run from backend/IIASA.GeoTrees/

dotnet run                                       # Start the backend (https://localhost:44324)
dotnet run -- --migrate-database                 # Apply pending EF Core migrations then exit
dotnet build                                     # Build without running
dotnet ef migrations add MigrationName           # Create a new EF Core migration

# Once after first clone — installs client-side libs for Razor Pages
abp install-libs

# Or via Makefile from the repo root:
make be-run       # Start backend
make be-migrate   # Run migrations
make be-build     # Build backend
```

## Swagger / API Documentation

Swagger UI is available locally at:

```
https://localhost:44324/swagger
```

The raw OpenAPI spec (used by `pnpm generate-api` in the frontend) is at:

```
https://localhost:44324/swagger/v1/swagger.json
```

The spec URL is configurable via the `VITE_OPENAPI_SPEC_URL` environment variable in the frontend (see `frontend/.env`).

## Production Certificates

In non-development environments, OpenIddict requires an RSA certificate (`openiddict.pfx`) for signing and encrypting tokens. Generate one with:

```bash
dotnet dev-certs https -v -ep openiddict.pfx -p <your-passphrase>
```

Store the passphrase in `AuthServer:CertificatePassPhrase` in your production configuration (environment variable or secrets manager). See [OpenIddict certificate configuration](https://documentation.openiddict.com/configuration/encryption-and-signing-credentials.html) for production recommendations.

## Docker

The backend ships with a `Dockerfile` and `Dockerfile.local`. Docker Compose files and build/run scripts are in `backend/etc/`:

- `etc/build/build-images-locally.ps1` — builds Docker images
- `etc/docker/run-docker.ps1` — starts the stack (PostgreSQL + migrations + app)
- `etc/docker/stop-docker.ps1` — stops and removes containers

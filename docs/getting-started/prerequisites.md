# Prerequisites

Before running GeoTrees locally, ensure these tools are installed.

## Required Tools

### Node.js (v20+)

The frontend requires Node.js v20 or later.

Verify: `node -v`
Install: [nodejs.org](https://nodejs.org/)

### pnpm

The frontend uses pnpm as its package manager.

Verify: `pnpm -v`
Install: `npm install -g pnpm` (or see [pnpm.io](https://pnpm.io/installation))

### .NET 10 SDK

The backend requires .NET 10 SDK.

Verify: `dotnet --version` (should be 10.x.x)
Install: [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet)

### PostgreSQL (v14+)

The backend uses PostgreSQL as its database.

Verify: `psql --version`
Install: [postgresql.org](https://www.postgresql.org/download/)

After installing, create a database and note the connection string — you'll need it when configuring the backend.

### ABP CLI

The backend uses ABP Framework and requires the ABP CLI for client-side library installation.

Verify: `abp --version`
Install: `dotnet tool install -g Volo.Abp.Cli`

## Optional Tools

### Docker

Required only if you want to run the application via Docker Compose (see [Deployment — Docker](../deployment/docker.md)).

Install: [docker.com](https://www.docker.com/)

### make

The root `Makefile` provides convenient shortcut commands. On Windows, install via [Chocolatey](https://chocolatey.org/): `choco install make`, or use the underlying commands directly.

## Verify All Prerequisites

```bash
node -v       # v20.x.x or higher
pnpm -v       # any version
dotnet --version  # 10.x.x
psql --version    # 14.x or higher
abp --version     # any version
```

# IIASA GeoTrees

Full-stack web application for IIASA GeoTrees with a React/TanStack SSR frontend and an ABP Framework (.NET) backend.

## Tech Stack

**Frontend**: React 19, TanStack Start/Router/Query, Vite, Tailwind CSS, Shadcn/ui, MapLibre GL, Zustand

**Backend**: ASP.NET Core / .NET 10, ABP Framework 10, PostgreSQL (EF Core), OpenIddict (OIDC)

## Prerequisites

- **Node.js** (v20+) and **pnpm**
- **.NET 10 SDK**
- **PostgreSQL**

## Getting Started

### Install dependencies

```bash
make install
```

Or individually:

```bash
# Frontend
cd frontend && pnpm install

# Backend (ABP client-side libraries)
cd backend/IIASA.GeoTrees && abp install-libs
```

### Run the development servers

```bash
# Frontend (port 3000)
make dev

# Backend
make be-run
```

### Run with Docker

```bash
# Full stack
make docker-up

# Stop
make docker-down
```

## Available Commands

Run `make help` for the full list. Key commands:

| Command | Description |
|---|---|
| `make install` | Install all dependencies |
| `make dev` | Start frontend dev server |
| `make build` | Build frontend and backend |
| `make test` | Run frontend unit tests |
| `make lint` | Lint frontend |
| `make format` | Format frontend |
| `make typecheck` | Type-check frontend |
| `make fe-test-coverage` | Run tests with coverage |
| `make fe-test-e2e` | Run Playwright E2E tests |
| `make fe-generate-api` | Regenerate API client from OpenAPI spec |
| `make be-run` | Run backend dev server |
| `make be-migrate` | Run database migrations |

## Project Structure

```
├── frontend/                  # React/TanStack SSR frontend
│   └── src/
│       ├── features/          # Feature modules (auth, dashboard, map, cms, ...)
│       ├── infrastructure/    # API client (auto-generated), auth (OIDC)
│       ├── routes/            # File-based routing (TanStack Router)
│       └── shared/            # Reusable components, hooks, utils
├── backend/
│   └── IIASA.GeoTrees/        # ABP Framework .NET backend
└── Makefile                   # Top-level task runner
```

## License

[Apache License 2.0](LICENSE)

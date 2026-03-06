# Documentation Design — GeoTrees Project Docs

**Date**: 2026-03-06
**Status**: Approved

## Goal

Create a root-level `docs/` folder with comprehensive Markdown documentation covering all three audiences: developers, DevOps/ops, and end users.

## Audience

- **Developers**: Engineers setting up, contributing, or extending the codebase
- **DevOps/Ops**: Teams deploying and operating the application
- **End users**: People using the GeoTrees application (map, CMS, user management)

## Format

Plain Markdown files organized in audience-based folders, readable directly on GitHub. No doc-site tooling required.

## Structure

```
docs/
├── README.md                          # Master index / doc hub
├── plans/                             # Design docs (this file)
├── getting-started/
│   ├── README.md                      # Quickstart overview
│   ├── prerequisites.md               # Node.js, .NET 10, PostgreSQL, pnpm
│   ├── local-setup.md                 # Clone → install → configure → run
│   └── environment-variables.md       # All .env variables explained
├── developer/
│   ├── README.md                      # Developer docs index
│   ├── architecture.md                # Full-stack overview, data flow, proxy pattern
│   ├── frontend.md                    # React/TanStack stack, feature modules, patterns
│   ├── backend.md                     # ABP Framework structure, entities, services
│   ├── auth.md                        # OIDC/PKCE flow, session management
│   ├── api-client.md                  # Auto-generated client, hey-api, regeneration
│   ├── testing.md                     # Unit, integration, E2E, coverage thresholds
│   ├── conventions.md                 # File naming, formatting (Biome), file size limits
│   └── contributing.md               # PR workflow, commit style, code review
├── deployment/
│   ├── README.md                      # Deployment options index
│   ├── docker.md                      # Docker Compose, building images, scripts
│   ├── database-migrations.md         # Running migrations, EF Core
│   └── production-config.md           # Signing certs, OpenIddict, env setup
└── user-guide/
    ├── README.md                      # What is GeoTrees?
    ├── map.md                         # Map feature, layers, 3D view
    ├── user-management.md             # Managing users, roles, permissions
    └── cms.md                         # CMS features
```

## Content Sources

Each document draws from:

- `CLAUDE.md` — commands, architecture overview, conventions
- `frontend/docs/` — existing ARCHITECTURE, TESTING, OIDC_SETUP, FILE_NAMING_CONVENTIONS docs
- `backend/README.md` — ABP setup, Docker, signing certs
- `frontend/README.md` and root `README.md` — getting started, commands
- `frontend/.env.example` — environment variables
- Codebase exploration — features, entities, routes, services

## Key Decisions

- Root-level `docs/` (not inside `frontend/`) so it covers the full stack
- Existing `frontend/docs/` stays as-is; new docs at root level are the canonical hub
- Audience-based folder structure for navigability
- Plain Markdown only — no Docusaurus or VitePress

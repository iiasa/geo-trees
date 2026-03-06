# Getting Started

Follow these steps to get GeoTrees running locally.

## Quickstart

If you already have all [prerequisites](./prerequisites.md) installed:

```bash
git clone <repo-url>
cd geo-trees
cp frontend/.env.example frontend/.env
# Edit frontend/.env — at minimum set VITE_SESSION_SECRET to a strong random string
make install
make be-migrate   # first run only — seeds the database
make be-run       # terminal 1: starts the backend
make dev          # terminal 2: starts the frontend
```

The frontend runs at **http://localhost:3000**.
The backend runs at **https://localhost:44324**.
Swagger UI is available at **https://localhost:44324/swagger**.

## Step-by-Step

1. [Check prerequisites](./prerequisites.md) — install required tools
2. [Local setup](./local-setup.md) — full setup walkthrough
3. [Environment variables](./environment-variables.md) — understand all config options

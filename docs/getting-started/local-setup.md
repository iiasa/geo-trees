# Local Setup

This guide walks you through running IIASA GeoTrees on your local machine. Before starting, ensure you have completed the [prerequisites](./prerequisites.md).

## 1. Clone the Repository

```bash
git clone https://github.com/iiasa/geo-trees.git
cd geo-trees
```

## 2. Configure Environment

Copy the example environment file and open it for editing:

```bash
cp frontend/.env.example frontend/.env
```

Open `frontend/.env` and update the values as needed. At minimum, **you must change `VITE_SESSION_SECRET`** to a unique, random string before running the application.

> **Note:** `NODE_TLS_REJECT_UNAUTHORIZED=0` is already set in `.env.example`. This allows the frontend's Node.js server to call the backend's self-signed HTTPS certificate in development without errors. **Do not use this setting in production.**

## 3. Install Dependencies

Install all frontend and backend dependencies with a single command:

```bash
make install
```

This is equivalent to running:

```bash
# Frontend (from repo root)
cd frontend && pnpm install

# Backend ABP client-side libraries (from repo root)
cd backend/IIASA.GeoTrees && abp install-libs
```

## 4. Configure the Database

Edit `backend/IIASA.GeoTrees/appsettings.json` and set the `ConnectionStrings.Default` value to point to your PostgreSQL instance:

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=GeoTrees;Username=postgres;Password=yourpassword"
  }
}
```

The database (`GeoTrees` in the example above) does not need to exist yet — migrations will create it in the next step.

## 5. Run Database Migrations

Run this once on the first setup, and again after any backend schema changes:

```bash
make be-migrate
```

Equivalent to:

```bash
cd backend/IIASA.GeoTrees && dotnet run -- --migrate-database
```

## 6. Start the Backend

In a dedicated terminal, start the backend dev server:

```bash
make be-run
```

Equivalent to:

```bash
cd backend/IIASA.GeoTrees && dotnet run
```

The backend will be available at **https://localhost:44324**. It serves both the REST API and acts as the OpenIddict OIDC identity server.

## 7. Start the Frontend

In a second terminal, start the frontend dev server:

```bash
make dev
```

Equivalent to:

```bash
cd frontend && pnpm dev
```

The frontend will be available at **http://localhost:3000**.

---

Both servers must be running simultaneously during development. API calls from the frontend are proxied through `/api/proxy` to the backend, so the backend must be reachable for login and data fetching to work.

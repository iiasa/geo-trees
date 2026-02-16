# Makefile for geo-trees (full-stack)

FRONTEND_DIR := frontend
BACKEND_DIR := backend/IIASA.GeoTrees
BACKEND_DOCKER_DIR := backend/etc/docker

.PHONY: help install dev build test lint format typecheck clean \
        fe-install fe-dev fe-build fe-test fe-test-watch fe-test-coverage fe-test-e2e \
        fe-lint fe-lint-fix fe-format fe-check fe-typecheck fe-generate-api fe-clean fe-kill \
        be-run be-build be-migrate be-install-libs \
        docker-fe-up docker-fe-down docker-be-up docker-be-down docker-up docker-down

# ─── Default ────────────────────────────────────────────────────────────────────

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Top-level shortcuts ────────────────────────────────────────────────────────

install: fe-install be-install-libs ## Install all dependencies

dev: fe-dev ## Start frontend dev server

build: fe-build be-build ## Build frontend and backend

test: fe-test ## Run frontend unit tests

lint: fe-lint ## Lint frontend

format: fe-format ## Format frontend

typecheck: fe-typecheck ## Type-check frontend

clean: fe-clean ## Clean frontend build artifacts

# ─── Frontend ───────────────────────────────────────────────────────────────────

fe-install: ## Install frontend dependencies
	cd $(FRONTEND_DIR) && pnpm install

fe-dev: ## Start frontend dev server (port 3000)
	cd $(FRONTEND_DIR) && pnpm dev

fe-build: ## Build frontend for production
	cd $(FRONTEND_DIR) && pnpm build

fe-test: ## Run frontend unit tests
	cd $(FRONTEND_DIR) && pnpm test

fe-test-watch: ## Run frontend tests in watch mode
	cd $(FRONTEND_DIR) && pnpm test:watch

fe-test-coverage: ## Run frontend tests with coverage
	cd $(FRONTEND_DIR) && pnpm test:coverage

fe-test-e2e: ## Run frontend E2E tests (Playwright)
	cd $(FRONTEND_DIR) && pnpm test:e2e

fe-lint: ## Lint frontend (Biome + file-size + file-naming)
	cd $(FRONTEND_DIR) && pnpm lint

fe-lint-fix: ## Lint frontend and auto-fix
	cd $(FRONTEND_DIR) && pnpm lint:fix

fe-format: ## Format frontend (Biome)
	cd $(FRONTEND_DIR) && pnpm format

fe-check: ## Full frontend check (lint + format)
	cd $(FRONTEND_DIR) && pnpm check

fe-typecheck: ## Type-check frontend (tsc --noEmit)
	cd $(FRONTEND_DIR) && pnpm typecheck

fe-generate-api: ## Regenerate API client from backend OpenAPI spec
	cd $(FRONTEND_DIR) && pnpm generate-api

fe-clean: ## Clean frontend build artifacts
	rm -rf $(FRONTEND_DIR)/dist $(FRONTEND_DIR)/.output $(FRONTEND_DIR)/.tanstack

fe-kill: ## Kill Vite dev server
	pkill -f vite || true

# ─── Backend ────────────────────────────────────────────────────────────────────

be-run: ## Run backend dev server
	cd $(BACKEND_DIR) && dotnet run

be-build: ## Build backend
	cd $(BACKEND_DIR) && dotnet build

be-migrate: ## Run backend database migrations
	cd $(BACKEND_DIR) && dotnet run -- --migrate-database

be-install-libs: ## Install ABP client-side libraries
	cd $(BACKEND_DIR) && abp install-libs

# ─── Docker ─────────────────────────────────────────────────────────────────────

docker-fe-up: ## Start frontend via Docker Compose
	cd $(FRONTEND_DIR) && docker-compose up --build -d

docker-fe-down: ## Stop frontend Docker Compose
	cd $(FRONTEND_DIR) && docker-compose down

docker-be-up: ## Start backend + Postgres via Docker Compose
	cd $(BACKEND_DOCKER_DIR) && docker-compose up --build -d

docker-be-down: ## Stop backend Docker Compose
	cd $(BACKEND_DOCKER_DIR) && docker-compose down

docker-up: docker-be-up docker-fe-up ## Start full stack via Docker Compose

docker-down: docker-fe-down docker-be-down ## Stop full stack Docker Compose

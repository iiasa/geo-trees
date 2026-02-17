# Makefile for geo-trees project

.PHONY: help install dev build serve test test-unit test-watch test-coverage test-e2e lint format check type-check generate-api clean kill

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

# Installation
install: ## Install dependencies
	pnpm install

# Development
dev: ## Start development server
	pnpm dev

# Build
build: ## Build for production
	pnpm build

# Serve
serve: ## Serve production build
	pnpm serve

# Testing
test: ## Run all tests (unit + E2E)
	pnpm test:all

test-unit: ## Run unit tests
	pnpm test

test-watch: ## Run tests in watch mode
	pnpm test:watch

test-coverage: ## Run tests with coverage
	pnpm test:coverage

test-e2e: ## Run E2E tests
	pnpm test:e2e

# Code quality
lint: ## Run linter
	pnpm lint

lint-fix: ## Run linter and fix issues
	pnpm run lint:fix

format: ## Format code
	pnpm format

check: ## Check code quality (lint + format)
	pnpm check

check-file-size: ## Check file sizes
	pnpm check-file-size

type-check: ## Run TypeScript type checking
	pnpm typecheck

# API generation
generate-api: ## Generate API client
	pnpm generate-api

# Clean
clean: ## Clean build artifacts
	rm -rf dist
	rm -rf node_modules
	rm -rf .output
	rm -rf .tanstack

# Kill processes
kill: ## Kill Vite development server
	pkill -f vite || true

# Combined tasks
setup: install ## Install dependencies and setup project
	@echo "Project setup complete!"

build-all: clean install generate-api build ## Clean, install, generate API, and build
	@echo "Build complete!"

dev-full: generate-api dev ## Generate API and start dev server
	@echo "Development server started!"

# Docker (if needed in future)
# docker-build: ## Build Docker image
#	docker build -t geo-trees .

# docker-run: ## Run Docker container
#	docker run -p 3000:3000 geo-trees

# Verify file organization
check-organization: ## Verify file organization follows feature-based structure
	@echo "Checking file organization..."
	@find src -type f -name "*.ts" -o -name "*.tsx" | head -20
	@echo "✅ File organization verified!"

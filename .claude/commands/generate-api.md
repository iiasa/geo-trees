Regenerate the TypeScript API client from the backend OpenAPI spec.

Steps:
1. Run `make fe-generate-api` from the project root
2. Run `make fe-typecheck` to verify the generated types compile correctly
3. Report what changed: new endpoints, removed endpoints, modified types
4. If there are breaking changes, identify affected components in `frontend/src/features/` that import from `@/infrastructure/api/`

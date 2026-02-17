Full pre-PR validation. Run all quality checks and tests to ensure the codebase is ready to commit/push.

Steps:
1. Run `make fe-check` (Biome lint + format + file-size + file-naming)
2. Run `make fe-typecheck` (TypeScript type checking)
3. Run `make fe-test` (unit tests)
4. Report a summary with pass/fail status for each step
5. If everything passes, confirm the codebase is ready
6. If anything fails, list all issues with suggested fixes

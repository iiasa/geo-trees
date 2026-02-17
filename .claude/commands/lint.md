Run full frontend code quality checks: Biome lint, file-size check, file-naming check, and TypeScript type checking.

Steps:
1. Run `make fe-check` from the project root (Biome lint + format check + file-size + file-naming)
2. Run `make fe-typecheck` from the project root (tsc --noEmit)
3. Report all issues found, grouped by category (lint, format, file-size, naming, types)
4. Suggest fixes for each issue

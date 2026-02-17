Auto-fix lint and formatting issues in the frontend.

Steps:
1. Run `make fe-lint-fix` from the project root (Biome auto-fix)
2. Run `make fe-format` from the project root (Biome format --write)
3. Run `make fe-check` to verify all issues are resolved
4. If any issues remain that can't be auto-fixed, report them with suggested manual fixes

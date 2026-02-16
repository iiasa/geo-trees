Run frontend unit tests.

If a file path or feature name is provided as $ARGUMENTS, run tests only for that target. Otherwise run all unit tests.

Steps:
1. If $ARGUMENTS is provided, find matching test files using glob patterns in `frontend/src/`
2. Run `pnpm vitest run <path>` from the `frontend/` directory for specific files, or `make test` from project root for all tests
3. If tests fail, analyze the output and suggest fixes
4. Report a summary of pass/fail counts

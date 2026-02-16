Scaffold a new frontend feature module following project conventions.

The feature name is provided as $ARGUMENTS (e.g., "maps", "notifications").

Steps:
1. Convert the feature name to kebab-case
2. Create the feature directory structure at `frontend/src/features/<name>/`:
   - `components/` — React components
   - `hooks/` — Custom hooks
   - `stores/` — Zustand stores (if needed)
   - `constants.ts` — Feature constants
3. Create an index barrel file if the feature needs public exports
4. All files must use kebab-case naming
5. Each file must stay under 500 lines
6. Use Biome formatting conventions (tabs, double quotes)
7. Report what was created and suggest next steps

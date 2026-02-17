---
name: api-integration
description: End-to-end API integration workflow. Use when connecting frontend to new or changed backend endpoints.
---

# API Integration

Integrate frontend with backend API endpoints, from spec regeneration to wired-up components.

## Workflow

1. **Regenerate API client** — Run `make fe-generate-api` to fetch the latest OpenAPI spec and generate types, SDK, Zod schemas, and TanStack Query hooks into `frontend/src/infrastructure/api/`
2. **Verify generation** — Run `make fe-typecheck` to confirm generated code compiles
3. **Identify new/changed endpoints** — Check the generated files for new query options and types
4. **Create feature hooks** — Wrap generated query options in feature-specific hooks if additional logic is needed
5. **Wire up components** — Use the hooks in components with proper loading/error states
6. **Test** — Write tests with MSW handlers that mock the new endpoints

## Key Files (Auto-Generated — Never Edit)

- `frontend/src/infrastructure/api/types.gen.ts` — TypeScript types from OpenAPI schemas
- `frontend/src/infrastructure/api/sdk.gen.ts` — Fetch-based SDK functions
- `frontend/src/infrastructure/api/zod.gen.ts` — Zod validation schemas
- `frontend/src/infrastructure/api/@tanstack/react-query.gen.ts` — TanStack Query options

## API Proxy Pattern

The frontend calls `/api/proxy` (its own server route), which forwards to the backend. The hey-api client is pre-configured for this. No CORS configuration needed.

## Using Generated Query Options

```typescript
// Direct usage — preferred for simple cases
import { userGetListOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
const { data } = useQuery(userGetListOptions({ query: { skipCount: 0, maxResultCount: 10 } }));

// Mutations
import { userCreateMutation } from "@/infrastructure/api/@tanstack/react-query.gen";
const mutation = useMutation(userCreateMutation());
```

## MSW Handler Pattern for Tests

```typescript
import { http, HttpResponse } from "msw";

const handlers = [
  http.get("/api/proxy/api/app/endpoint", () => {
    return HttpResponse.json({ items: [...], totalCount: 1 });
  }),
];
```

## Checklist

1. Run `make fe-generate-api`
2. Run `make fe-typecheck` to verify
3. Identify new types and query options in generated files
4. Create/update feature hooks using generated options
5. Wire hooks into components with loading/error handling
6. Add MSW handlers and write tests
7. Run `make fe-test` to verify

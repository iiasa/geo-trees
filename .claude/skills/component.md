---
name: component
description: Create a new React component following GeoTrees conventions. Use for building UI components with Shadcn/ui patterns.
---

# Component Creation

Create React components following the project's Shadcn/ui-based design system.

## Conventions

- **File naming**: kebab-case (e.g., `user-profile-card.tsx`)
- **File size**: Max 500 lines — split into sub-components if larger
- **Formatting**: Tabs, double quotes (Biome)
- **Styling**: Tailwind CSS v4 utility classes
- **UI primitives**: Import from `@/shared/components/ui/` (Shadcn/ui)
- **Icons**: `@tabler/icons-react` (prefer over lucide for new components)
- **Class merging**: Use `cn()` from `@/shared/lib/utils` for conditional classes

## Available UI Primitives

From `frontend/src/shared/components/ui/`:
- Layout: `Card`, `Separator`, `ScrollArea`, `Tabs`, `Accordion`, `Collapsible`
- Forms: `Button`, `Input`, `Label`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`
- Feedback: `Dialog`, `AlertDialog`, `Popover`, `Tooltip`, `HoverCard`
- Data: `Table` (with `@tanstack/react-table`), `Badge`, `Avatar`, `Progress`
- Navigation: `DropdownMenu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Command`

## Component Template

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface MyComponentProps {
  title: string;
  className?: string;
}

export function MyComponent({ title, className }: MyComponentProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* content */}
      </CardContent>
    </Card>
  );
}
```

## Shared vs Feature Components

- **Shared** (`@/shared/components/`): Reusable across features. Generic, no feature-specific logic.
- **Feature** (`@/features/<name>/components/`): Specific to a feature. May use feature stores/hooks.

## Form Components

Use `react-hook-form` with Zod schemas from `@/infrastructure/api/zod.gen.ts`:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zMySchema } from "@/infrastructure/api/zod.gen";

const form = useForm({
  resolver: zodResolver(zMySchema),
  defaultValues: { ... },
});
```

## Checklist

1. Choose correct location: `@/shared/components/` or `@/features/<name>/components/`
2. Use kebab-case filename
3. Import UI primitives from `@/shared/components/ui/`
4. Keep under 500 lines
5. Add props interface with explicit types
6. Write test in adjacent `__tests__/` directory
7. Run `make fe-lint` and `make fe-typecheck`

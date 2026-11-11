# Architecture Details

## Routing (TanStack Router)

File-based routing with auto-generated route tree.

- Route files: `src/routes/`
- Layout routes use double-underscore prefix: `__main/` (authenticated shell), `__auth/` (public auth)
- `__root.tsx` — root layout (Toaster + devtools)
- `__main/route.tsx` — authenticated shell with sidebar, breadcrumbs, header
- Auto code-splitting enabled — each route is a separate chunk

### Route file structure

```typescript
import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
    filters: z.string().catch('[]').optional(),
})

export const Route = createFileRoute('/__main/{page-name}')({
    validateSearch: searchSchema,
    component: RouteComponent,
})

function RouteComponent() {
    // Data fetching, mutations, state — then render feature UI
    return <FeatureUI {...props} />
}
```

## Module Registry

`src/lib/module.ts` is the single source of truth. Sidebar, breadcrumbs, and permission matrix all derive from it.

```typescript
export const MODULES = {
    dashboard: { path: '/', description: '...' },
    'user-management': { path: '/user-management', description: '...' },
    // ...
} as const
```

Consumers (never duplicate the list):
- `src/components/layout/app-sidebar.tsx` → sidebar links
- `src/routes/__main/route.tsx` → breadcrumb labels
- `src/components/features/settings/form-module-map.tsx` → role permission matrix
- `src/lib/permission.tsx` → hasRoutePermission

## Component Structure

```
src/components/
├── ui/              # shadcn/ui primitives (29 components) — NEVER edit directly, use CLI
├── features/        # Feature-specific UI per module
│   └── {module}/
│       ├── index.ts          # barrel export
│       └── {module}-ui.tsx   # presentation component
├── layout/          # App shell (AppSidebar, NavMain, NavUser, ModeToggle)
└── shared/          # Reusable components organized by function
    ├── overview/    # PageHeader, PageTransition, Stagger*
    ├── cards/       # StatCard, StatCardsGrid
    ├── charts/      # AnalyticsGrowthChart
    ├── datatables/  # DataTable (has built-in horizontal scroll — ADR-0006)
    ├── searching/   # SearchInput, FilterBuilder
    ├── feedback/    # Spinner, PendingComp, ErrorComp, NotFoundComp
    ├── forms/       # Field, FormInput, FormSelect, FormInputGroup, ButtonGroup, etc.
    └── dialogs/     # StatusConfirm, TrashConfirm
```

## Container/Presenter Pattern (ADR-0008)

Route files = data containers (fetching, mutations, state).
Feature components = pure presentation (receives everything via props).

This makes UI components reusable across projects. The route file handles:
- TanStack Query hooks (useQuery, useMutation)
- Search params and URL state
- Filter/pagination logic (via `applyFilters`, `applySearch`, `paginate` from `src/lib/apply-filters.ts`)
- Event handlers that call mutations

The feature component handles:
- Rendering the UI
- Calling prop callbacks for user actions

## Forms

TanStack Form via custom `useAppForm` hook from `src/components/shared/forms/form-context.ts`.

Pre-built field components:
`FormInput`, `FormSelect`, `FormSearchableSelect`, `FormTextarea`, `FormSwitch`, `FormRadio`, `FormImage`, `FormAvatar`, `FormInputOtp`, `FormSubmit`, `FormModuleMap`, `FormInputGroup`, `ButtonGroup`

## Motion System

Centralized in `src/lib/`:
- `motionTokens.ts` — duration, easing, distance constants
- `motion-primitives.ts` — reusable animation variants
- `animation-presets.ts` — pre-configured motion props

Use `PageTransition`, `StaggerContainer`, `StaggerItem` for page animations.
Never use ad-hoc motion values — always reference the tokens.

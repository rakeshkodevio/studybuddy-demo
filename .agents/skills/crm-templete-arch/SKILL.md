---
name: crm-templete-arch
description: Architecture guide for the CCW Connect App Dashboard — a React 19 + TanStack Router + Tailwind CSS v4 admin panel. Use when adding pages, features, API domains, components, or modifying routes. Enforces Container/Presenter pattern, Module Registry, mock API conventions, shadcn/ui usage, and design token rules. Trigger on "add page", "new feature", "new route", "add module", "dashboard architecture", "CRM template", or "CCW conventions".
---

# CRM Template Architecture

This skill encodes the architectural rules for this project. Follow these rules exactly — they prevent common mistakes and keep the codebase consistent. Every rule here is derived from the actual codebase, not aspirational.

## Critical Rules (violations will be rejected)

### 1. Design Tokens Only — Never Custom CSS for Colors

**NEVER** write custom CSS or inline styles for colors, backgrounds, border-radius, or text colors. **ALWAYS** use the design tokens defined in `src/styles.css`.

```tsx
// WRONG — hardcoded colors
<span style={{ color: '#3b82f6' }}>Text</span>
<div className="bg-[#1e293b]">

// WRONG — Tailwind raw colors instead of tokens
<span className="text-blue-500">
<div className="bg-slate-800">

// CORRECT — design tokens
<span className="text-primary">
<div className="bg-card text-card-foreground">
<span className="text-success">Active</span>
<span className="text-destructive">Delete</span>
<div className="bg-warning/10 text-warning">
```

Available tokens (use these, not raw Tailwind colors):
- **Text**: `text-foreground`, `text-muted-foreground`, `text-card-foreground`, `text-primary`, `text-success`, `text-destructive`, `text-warning`, `text-info`, `text-brand`
- **Backgrounds**: `bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `bg-destructive`, `bg-success`, `bg-warning`, `bg-info`, `bg-surface`, `bg-primary`, `bg-brand`
- **Borders**: `border-border`, `border-input`, `border-ring`
- **Card variants**: `bg-card-mint`, `bg-card-blue`, `bg-card-pink`, `bg-card-peach` (with matching `-foreground` text tokens)
- **Shadows**: `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`
- **Glow**: `glow-primary`, `glow-destructive`, `glow-success`
- **Dark mode**: handled automatically via `.dark` class — never write `dark:` overrides for token-based colors

### 2. Use Existing Components — Don't Build from Scratch

Before writing any UI, check if a component already exists:

**Default ShadCN components** (`src/components/ui/`):
`AlertDialog`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Card`, `Chart`, `Checkbox`, `Collapsible`, `Dialog`, `DropdownMenu`, `InputOTP`, `Input`, `Label`, `Pagination`, `Popover`, `Progress`, `RadioGroup`, `Select`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Sonner`, `Switch`, `Table`, `Tabs`, `Textarea`, `Tooltip`

**Custom shared components** (`src/components/shared/`):
- `PageHeader`, `PageTransition`, `StaggerContainer`, `StaggerItem` — page layout
- `StatCard`, `StatCardsGrid` — KPI stat displays (ADR-0003, use for ALL stats)
- `DataTable` — tables with built-in horizontal scroll (ADR-0006, no wrapper needed)
- `SearchInput`, `FilterBuilder` — search and filter UI
- `Spinner`, `PendingComp`, `ErrorComp`, `NotFoundComp` — loading and error states
- `useAppForm`, `FormInput`, `FormSelect`, `FormSearchableSelect`, `FormTextarea`, `FormSwitch`, `FormRadio`, `FormImage`, `FormAvatar`, `FormInputOtp`, `FormSubmit`, `FormModuleMap`, `FormInputGroup`, `ButtonGroup` — form system

**Adding new ShadCN components**:
```bash
npx shadcn@latest add <component>
```

### 3. Container/Presenter Pattern (ADR-0008)

Every page follows this split. No exceptions.

**Route file** (`src/routes/__main/{page}.tsx`) = data container:
- TanStack Query hooks (`useQuery`, `useMutation`)
- Search params and URL state
- Filter/pagination logic via `applyFilters`, `applySearch`, `paginate` from `@/lib/apply-filters.ts`
- Event handlers that call mutations
- Renders the feature UI component, passing everything as props

**Feature component** (`src/components/features/{page}/`) = presentation:
- Pure UI — receives ALL data via props
- No data fetching, no mutation logic, no query client access
- Uses shared components and ShadCN primitives
- Exports the UI component + any schemas (e.g., `userSchema`)

### 4. Mock Data Lives in API Files — Never Inline

**NEVER** put mock data as `const` inside route files or UI components. Mock data belongs in `src/api/{domain}.ts`.

```typescript
// src/api/prayer.ts — THIS is the correct pattern
import type { Prayer } from '@/types/prayer'

const mockPrayers: Prayer[] = [
    { id: 1, title: 'Morning Prayer', category: 'Daily Devotion', ... },
    { id: 2, title: 'Prayer for Healing', category: 'Healing', ... },
]

export const prayerApi = {
    list: async (_params?) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockPrayers,
            meta: { page: 1, limit: 10, total: mockPrayers.length, totalPages: 1 },
        }
    },
}

// Synchronous exports for direct access (used by routes)
export const PRAYERS = mockPrayers
```

**Why this pattern**: When the backend is ready, you only replace the mock functions inside `prayerApi` with real `fetch` calls via `request()` from `@/api/base.ts`. The route files and UI components don't change at all — they already consume data through the API layer.

**API file structure** (every domain file follows this):
1. Import the domain type from `@/types/{domain}`
2. Define `mock{Domain}` array with realistic sample data
3. Export `domainApi` object with async methods (`list`, `create`, `update`, `delete`)
4. Export sync helpers (`{DOMAINS}`, `getDomainById`, `createDomain`, etc.)

### 5. Never Edit routeTree.gen.ts

Auto-generated by TanStack Router. Excluded from VSCode watcher, search, and marked readonly. Edit route files in `src/routes/` and restart dev to regenerate.

### 6. Use @/ Import Alias

Maps to `./src/*`. Never use relative imports for cross-directory access.

## Architecture Overview

React 19 SPA deployed to Vercel. Key technologies:
- **Routing**: TanStack Router (file-based, auto code-splitting)
- **Data**: TanStack Query + mocked API layer (mock first, real API later)
- **Forms**: TanStack Form via custom `useAppForm` hook from `@/components/shared/forms/form-context.ts`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin, NOT PostCSS) + shadcn/ui (radix-nova style)
- **Motion**: Centralized in `src/lib/motionTokens.ts`

## When Adding a New Page

1. **Register the module**: Add entry to `MODULES` in `src/lib/module.ts` (single source of truth for sidebar order, route paths, module keys).
2. **Create the route file**: `src/routes/__main/{page-name}.tsx` — data logic only. Import mock data from `@/api/{domain}`.
3. **Create the feature UI**: `src/components/features/{page-name}/index.ts` + `{page-name}-ui.tsx` — presentation only. Use existing ShadCN and shared components.
4. **Add an icon**: `src/lib/module-icons.tsx`.
5. **Restart dev** — route tree regenerates automatically.

## When Adding a New API Domain

1. Create types: `src/types/{domain}.ts`
2. Create API: `src/api/{domain}.ts` — mock data array + async API object + sync helpers
3. Add to barrel: `src/api/index.ts`
4. Create hooks: `src/hooks/use-{domain}.ts` with query key factory
5. Update route imports to use `@/api/{domain}` and `@/types/{domain}` (not `@/lib/{domain}`)

## When Adding a New shadcn/ui Component

```bash
npx shadcn@latest add <component>
```

Components are configured via `components.json` (radix-nova style, CSS variables, aliases pre-set).

## Code Style (non-negotiable)

- **Prettier**: no semicolons, single quotes, trailing commas, 4-space indent, 140 char print width
- **ESLint**: `@tanstack/eslint-config` base (import/order, sort-imports, no-unnecessary-condition, require-await are OFF)
- **TypeScript**: strict mode, `verbatimModuleSyntax: true`, `noUnusedLocals`, `noUnusedParameters`
- Prefer editing existing files over creating new ones

## Import Conventions

```typescript
import type { X } from '@/types/{domain}'           // Types
import { X } from '@/api/{domain}'                   // API + mock data
import { X } from '@/components/shared/{category}'   // Shared components
import { X } from '@/components/features/{feature}'   // Feature components
import { X } from '@/components/ui/{component}'       // ShadCN primitives
import { X } from '@/lib/utils'                       // Only for cn, applyFilters
```

Never import from `@/lib/` for domain logic.

## Detailed References

- **Architecture deep-dive**: Read `references/architecture.md` for routing details, component structure, form system, and motion system.
- **Code patterns**: Read `references/patterns.md` for API patterns, data fetching patterns, and styling conventions.
- **Gotchas**: Read `references/gotchas.md` for critical things that will break your code if ignored.

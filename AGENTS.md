# AGENTS.md

## Quick Start

```bash
npm install
npm run dev        # starts on http://localhost:3000
```

## Commands

| Action           | Command                                    |
| ---------------- | ------------------------------------------ |
| Dev server       | `npm run dev` (port 3000)                  |
| Build            | `npm run build`                            |
| Lint             | `npm run lint`                             |
| Format           | `npm run format` (prettier + eslint --fix) |
| Check formatting | `npm run check` (prettier --check)         |

No test suite exists. No CI workflows in-repo. No typecheck script (run `npx tsc --noEmit` if needed).

## Architecture

React 19 admin dashboard for a newspaper/subscription service. Single-page app deployed to Vercel.

### Routing (TanStack Router — file-based, auto-generated)

- Route files live in `src/routes/`. The plugin generates `src/routeTree.gen.ts` — **never edit it manually**.
- `__root.tsx` — root layout (Toaster + devtools).
- `__main/` — authenticated shell with sidebar, breadcrumbs, header. All admin pages live here.
- `__auth/` — public auth shell (signin, forgot/reset password, verification).
- Layout routes use double-underscore prefix (`__main`, `__auth`) per TanStack Router convention.
- When adding a page: create the route file, then run `npm run dev` — the route tree regenerates on startup.

### Module Registry

`src/lib/module.ts` is the **single source of truth** for module identifiers, sidebar order, and route paths. The sidebar and breadcrumbs derive from it. When adding a new module:

1. Add an entry to `MODULES` in `src/lib/module.ts`.
2. Create the route file at the matching path under `src/routes/__main/`.
3. Add an icon in `src/lib/module-icons.tsx`.

### Path Aliases

Both `#/*` and `@/*` resolve to `./src/*`. Use `@/` consistently — it's the more common convention in this codebase.

### Component Structure

```
src/components/
├── ui/              # shadcn/ui primitives (29 components)
├── features/        # Feature-specific UI per module (Container/Presenter pattern)
│   ├── community/   # community-ui.tsx
│   ├── daily-content/
│   ├── dashboard/   # dashboard-ui.tsx
│   ├── inbox/
│   ├── notifications/ # notifications-ui.tsx
│   ├── payments/    # payments-ui.tsx
│   ├── prayer-management/
│   ├── settings/    # general-tab, profile-tab, security-tab, static-content-tab
│   ├── subscriptions/ # subscriptions-ui.tsx
│   ├── support/
│   └── user-management/ # user-management-ui.tsx
├── layout/          # App shell (AppSidebar, NavMain, NavUser, ModeToggle)
├── shared/          # Shared components organized by function
│   ├── overview/    # Page layout (PageHeader, PageTransition, Stagger*)
│   ├── cards/       # Card components (StatCard, StatCardsGrid)
│   ├── charts/      # Chart components (AnalyticsGrowthChart)
│   ├── datatables/  # Table components (DataTable)
│   ├── searching/   # Search & filter (SearchInput, FilterBuilder)
│   ├── feedback/    # Loading & error states (Spinner, PendingComp, ErrorComp, NotFoundComp)
│   ├── forms/       # Form primitives (Field, FormInput, FormSelect, FormInputGroup, ButtonGroup, etc.)
│   └── dialogs/     # Confirmation dialogs (StatusConfirm, TrashConfirm)
```

### Forms

Uses TanStack Form via a custom `useAppForm` hook from `src/components/shared/forms/form-context.ts`. Pre-built field components: `FormInput`, `FormSelect`, `FormSearchableSelect`, `FormTextarea`, `FormSwitch`, `FormRadio`, `FormImage`, `FormAvatar`, `FormInputOtp`, `FormSubmit`, `FormModuleMap`.

### Data Fetching

TanStack Query is installed but the API layer (`src/api/base.ts`) is **currently mocked** — `request()` returns hardcoded data. Individual domain files (e.g., `src/api/users.ts`) use in-memory mock stores. Don't assume a real backend is running.

### Styling

- Tailwind CSS v4 with `@tailwindcss/vite` plugin (not PostCSS).
- shadcn/ui with `radix-nova` style, CSS variables for theming.
- Theme: `src/styles.css` defines all color tokens. Dark mode via `.dark` class.
- Animation tokens in `src/lib/motionTokens.ts` — use these instead of ad-hoc values.
- **Never use hardcoded colors** — always use design tokens (`text-success`, `bg-destructive`, etc.).

### Motion System

Centralized motion architecture in `src/lib/`:

- `motionTokens.ts` — duration, easing, distance constants
- `motion-primitives.ts` — reusable animation variants
- `animation-presets.ts` — pre-configured motion props

Use `PageTransition`, `StaggerContainer`, `StaggerItem` for page animations.

## Code Style

- **Prettier**: no semicolons, single quotes, trailing commas, 4-space indent, 140 char print width.
- **ESLint**: `@tanstack/eslint-config` base. Several rules are disabled (import/order, sort-imports, no-unnecessary-condition, require-await).
- **TypeScript**: strict mode, `verbatimModuleSyntax: true`, `noUnusedLocals`, `noUnusedParameters`.
- Prefer editing existing files over creating new ones.
- Route components follow a container pattern: data logic in the route file, presentation in a separate UI component under `src/components/features/`.

## Conventions

- **Container/Presenter pattern** (ADR-0008): Route files act as data containers; complex UI lives in presentational components under `src/components/features/`. This makes UI reusable across projects.
- **DataTable** has built-in horizontal scroll wrapper (ADR-0006) — no need to add scroll wrappers per page.
- **StatCard** (`src/components/shared/cards/stat-card.tsx`) is the standard for all KPI stat displays (ADR-0003). Use it instead of ad-hoc Card components.
- **Shared filter logic** lives in `src/lib/apply-filters.ts` — never duplicate filter evaluation code.
- **ADRs** in `docs/adr/` document architectural decisions — check them before making breaking changes.

## Gotchas

- The `.env` file defines `VITE_APP_CLIENT` and `VITE_APP_SERVER` but the mock API layer (`src/api/base.ts`) ignores them — `request()` logs the call and returns hardcoded empty data. It never hits a real server.
- `routeTree.gen.ts` is excluded from VSCode file watcher, search, and marked readonly. If routes break, restart dev to regenerate.
- TanStack Router auto code-splitting is enabled — each route is a separate chunk.
- `vercel.json` has SPA catch-all rewrites — all routes serve `index.html`.
- Heavy components (JoditEditor, Recharts) are lazy-loaded — wrap in `Suspense` if importing.
- shadcn/ui components are managed via `components.json` config. To add new ones: `npx shadcn@latest add <component>`.

## API Pattern

Each domain file exports an async API object AND synchronous helpers:

```typescript
// src/api/users.ts
export const userApi = {
    list: async (params?) => { ... },
    create: async (payload) => { ... },
    update: async (id, data) => { ... },
    delete: async (id) => { ... },
}

// Sync exports for routes that access data directly
export const USERS = mockUsers
export function getUserById(id: number) { ... }
```

Types live in `src/types/{domain}.ts` — separate from API logic.

## Import Rules

- Use `@/` alias (maps to `./src/*`)
- Types: `import type { X } from '@/types/{domain}'`
- API: `import { X } from '@/api/{domain}'`
- Shared components: `import { X } from '@/components/shared/{category}'`
- Feature components: `import { X } from '@/components/features/{feature}'`
- UI primitives: `import { X } from '@/components/ui/{component}'`
- Never import from `@/lib/` for domain logic (only for utils like `cn`, `applyFilters`)

## Adding a New Page

1. Create route: `src/routes/__main/{page-name}.tsx`
2. Create feature UI: `src/components/features/{page-name}/index.ts`
3. Add to module registry: `src/lib/module.ts`
4. Add icon: `src/lib/module-icons.tsx`
5. Route tree regenerates on `npm run dev`

## Adding a New API Domain

1. Create types: `src/types/{domain}.ts`
2. Create API: `src/api/{domain}.ts` (with both async API object and sync exports)
3. Add to barrel: `src/api/index.ts`
4. Create hooks: `src/hooks/use-{domain}.ts` (with query key factory)
5. Update route imports from old `@/lib/{domain}` to `@/api/{domain}` and `@/types/{domain}`

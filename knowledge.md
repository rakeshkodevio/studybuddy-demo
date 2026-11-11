# Project knowledge

This file gives Freebuff context about your project: goals, commands, conventions, and gotchas.

## Quickstart
- Setup: `npm install`
- Dev: `npm run dev` (port 3000)
- Build: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format` (prettier + eslint --fix)
- Check formatting: `npm run check`
- Add UI components: `npx shadcn@latest add <component>`
- No test suite exists. Run `npx tsc --noEmit` for type checking.

## Tech Stack
React 19, TanStack Router (file-based), TanStack Query, TanStack Table, Tailwind CSS v4, shadcn/ui (radix-nova style), Vite 8, TypeScript 6.

### shadcn/ui Configuration
- Style: `radix-nova`
- CSS Variables: enabled
- Base color: neutral
- Icon library: lucide
- Path aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`


## Architecture
React 19 admin dashboard for a newspaper/subscription service. Single-page app deployed to Vercel.

### Build Configuration
- Vite 8 with React plugin
- TanStack Router plugin with auto code-splitting
- TanStack DevTools plugin
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not PostCSS)
- TypeScript paths resolved via `tsconfigPaths: true`

### Root Route
- `src/routes/__root.tsx` — Root layout with Outlet, Toaster, and TanStack DevTools
- `index.html` — Entry point with Geist font preloading
- `src/main.tsx` — App entry with QueryClient, RouterProvider, ThemeProvider

### Key directories:
- `src/routes/` — File-based routing (TanStack Router). `__main/` for auth pages, `__auth/` for public auth. **Never edit `routeTree.gen.ts` manually**.
- `src/components/ui/` — shadcn/ui primitives (29 components).
- `src/components/features/` — Feature-specific UI per module (Container/Presenter pattern).
- `src/components/shared/` — Shared components by function (overview, cards, charts, datatables, searching, feedback, forms, dialogs).
- `src/api/` — Mock API layer (hardcoded data, no real backend).
- `src/types/` — Type definitions per domain.
- `src/lib/` — Utilities (module registry, motion tokens, animations).
- `src/hooks/` — Custom React hooks.
- `docs/adr/` — Architectural Decision Records.
- `.agents/skills/` — Installed skills (shadcn, motion-ui, tanstack-router, etc.).

### Data flow:
Data flows: Route → API (`src/api/`) → TanStack Query hooks → UI components. API layer is mocked — `request()` returns hardcoded data. Don't assume a real backend is running.

## Conventions
- **Prettier**: no semicolons, single quotes, trailing commas, 4-space indent, 140 char print width.
- **ESLint**: `@tanstack/eslint-config` base with several disabled rules (import/no-cycle, import/order, sort-imports, @typescript-eslint/array-type, @typescript-eslint/require-await, pnpm/json-enforce-catalog, @typescript-eslint/no-unnecessary-condition, no-shadow, @typescript-eslint/ban-ts-comment).
- **TypeScript**: strict mode, `verbatimModuleSyntax: true`, `noUnusedLocals`, `noUnusedParameters`.
- **Path aliases**: Both `#/*` and `@/*` resolve to `./src/*`. Prefer `@/`.
- **Target**: ES2022, JSX react-jsx, ESNext modules, bundler module resolution
- **CSS themes**: `src/styles.css` defines light/dark themes using CSS custom properties. Brand color: `--brand: #c62828` (red)
- **Dark mode**: Uses `.dark` class on HTML element
- **Typography**: Geist font family loaded from Google Fonts
- **Container/Presenter pattern** (ADR-0008): Route files act as data containers; complex UI lives in `src/components/features/`.
- **Module registry** (`src/lib/module.ts`): Single source of truth for module identifiers, sidebar order, and route paths.
- **StatCard** (`src/components/shared/cards/stat-card.tsx`): Standard for all KPI stat displays (ADR-0003).
- **DataTable** has built-in horizontal scroll wrapper (ADR-0006).
- **Shared filter logic** in `src/lib/apply-filters.ts`.

## Patterns to follow
- Use `@/` alias for imports.
- Import types: `import type { X } from '@/types/{domain}'`.
- Import API: `import { X } from '@/api/{domain}'`.
- Import shared components: `import { X } from '@/components/shared/{category}'`.
- Import feature components: `import { X } from '@/components/features/{feature}'`.
- Import UI primitives: `import { X } from '@/components/ui/{component}'`.
- Route components follow container pattern: data logic in route file, presentation in `src/components/features/`.

## Things to avoid
- Never edit `routeTree.gen.ts` manually.
- Never use hardcoded colors — always use design tokens (`text-success`, `bg-destructive`, etc.).
- Never duplicate filter evaluation code — use `src/lib/apply-filters.ts`.
- Don't assume a real backend is running — API layer is mocked.
- Don't import from `@/lib/` for domain logic (only for utils like `cn`, `applyFilters`).

## Gotchas
- `.env` defines `VITE_APP_CLIENT` and `VITE_APP_SERVER` but mock API ignores them.
- `routeTree.gen.ts` is excluded from VSCode file watcher/search and marked readonly.
- TanStack Router auto code-splitting is enabled.
- `vercel.json` has SPA catch-all rewrites.
- Heavy components (JoditEditor, Recharts) are lazy-loaded — wrap in `Suspense` if importing.
- shadcn/ui components managed via `components.json`. Add new ones: `npx shadcn@latest add <component>`.

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

## API Pattern
Each domain file exports an async API object AND synchronous helpers. Types live in `src/types/{domain}.ts` — separate from API logic.

## Design Tokens
`src/styles.css` defines comprehensive CSS custom properties for both light and dark modes:

### Color System
- **Semantic colors**: `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--success`, `--warning`, `--info`, `--purple`, `--surface`
- **Card colors**: `--card-mint`, `--card-blue`, `--card-pink`, `--card-peach` (for StatCard variants)
- **Sidebar colors**: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`
- **Chart colors**: `--chart-1` through `--chart-5`

### Shadow & Glow System
- **Shadows**: `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- **Glow effects**: `--glow-primary`, `--glow-destructive`, `--glow-success`

### Typography Scale
- `--text-xs` (0.75rem) through `--text-4xl` (2.25rem)

### Usage
- Use Tailwind classes: `text-success`, `bg-warning/10`, `shadow-md`, `glow-primary`
- Never use hardcoded colors — always reference design tokens

## Motion System
- `src/lib/motionTokens.ts` — Animation duration, easing, and distance tokens
- `src/lib/motion-primitives.ts` — Reusable animation variants (page entrance, stagger, card hover, fade-in, slide-up, scale-in)
- `src/lib/animation-presets.ts` — Pre-configured animation presets for common patterns
- `src/components/shared/overview/page-transition.tsx` — Page transition wrapper
- `src/components/shared/overview/stagger-container.tsx` — Stagger animation container
- `src/components/shared/overview/stagger-item.tsx` — Individual stagger item wrapper

## Component Patterns
### Container/Presenter Pattern
- Route files act as data containers (fetching, state management, mutations)
- Complex UI lives in `src/components/features/{module}/` as presenter components
- Presenter components receive data and callbacks as props

### Form Components
- `src/components/shared/forms/` — Comprehensive form system with TanStack Form integration
- Components: FormInput, FormSelect, FormSearchableSelect, FormTextarea, FormSwitch, FormRadio, FormImage, FormAvatar, FormInputOtp, FormSubmit, FormModuleMap
- Uses `useAppForm` hook from `form-context.ts`

### Data Table
- `src/components/shared/datatables/` — DataTable with horizontal scroll, pagination, and selection modes
- Supports `selectionMode="multiple"` for multi-row selection
- Built-in empty state handling with custom icons

### Status Badges
- `src/components/shared/feedback/status-badge.tsx` — Reusable status badge component
- Supports different statuses with appropriate colors

### Search & Filtering
- `src/components/shared/searching/search-input.tsx` — Search input component
- `src/components/shared/searching/filter-builder.tsx` — Dynamic filter builder with multiple filter types
- `src/lib/apply-filters.ts` — Shared filter evaluation logic

## StatCard Component
`src/components/shared/cards/stat-card.tsx` provides:
- `StatCard` — Individual stat card with icon, label, value, and optional trend
- `StatCardsGrid` — Grid layout with stagger animation
- Color variants: `blue`, `emerald`, `orange`, `amber`, `pink`, `rose`, `slate`
- Built-in hover/tap animations using motion tokens
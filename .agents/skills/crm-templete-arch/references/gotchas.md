# Gotchas & Anti-patterns

## Critical — Will Break Things

### Mock data must live in API files, not inline

- **NEVER** put mock data as `const` inside route files or UI components
- Mock data belongs in `src/api/{domain}.ts` — this is how the project is built
- When the backend is ready, only the API file changes — routes and UI stay untouched
- If you see `const mockData = [...]` in a route file, that's wrong — move it to the API file

### Design tokens only — no custom CSS for colors

- **NEVER** use hardcoded colors (`text-blue-500`, `bg-red-100`, `#3b82f6`, `style={{ color: ... }}`)
- **ALWAYS** use design tokens from `src/styles.css` (`text-success`, `bg-destructive`, `text-muted-foreground`)
- Dark mode is handled automatically via `.dark` class — never write `dark:` overrides for token colors
- This is not optional — it's how the project maintains consistent theming

### routeTree.gen.ts is auto-generated

- Never edit `src/routeTree.gen.ts` manually
- It is excluded from VSCode file watcher, search, and marked readonly
- Has `eslint-disable` comments — linting won't catch manual edits
- If routes break, restart `npm run dev` to regenerate

### API layer is mocked

- `src/api/base.ts` `request()` logs the call and returns hardcoded empty data
- It never hits a real server — `.env` values (`VITE_APP_CLIENT`, `VITE_APP_SERVER`) are ignored
- Individual domain files use in-memory mock stores
- Don't add real HTTP calls to the mock layer

### Permission checks are disabled

- `src/lib/permission.tsx` `hasRoutePermission()` always returns `true`
- `checkRoutePermission()` is a no-op
- Don't add permission-gated logic that depends on these functions

## Important — Will Cause Confusion

### shadcn/ui components

- Never edit files in `src/components/ui/` directly
- Add new components via CLI: `npx shadcn@latest add <component>`
- Config is in `components.json` (radix-nova style, CSS variables, pre-configured aliases)

### Lazy-loaded heavy components

- JoditEditor and Recharts are lazy-loaded
- If importing them, wrap in `Suspense` with a fallback

### SPA routing

- `vercel.json` has catch-all rewrites: all routes serve `index.html`
- This is a single-page app — no server-side rendering

### TanStack Router code-splitting

- Auto code-splitting is enabled in `vite.config.ts`
- Each route is a separate chunk
- Don't manually code-split routes — the plugin handles it

## Code Style Traps

### Prettier config

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- 4-space indent (`tabWidth: 4`)
- 140 char print width (`printWidth: 140`)
- Run `npm run format` to fix, `npm run check` to verify

### TypeScript strictness

- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `noUnusedLocals: true` — remove unused variables
- `noUnusedParameters: true` — prefix unused params with `_`
- No `tsconfig.json` typecheck script — run `npx tsc --noEmit` manually if needed

### ESLint disabled rules

These rules are OFF in this project — don't re-enable them:
- `import/order` and `sort-imports` — import ordering is not enforced
- `@typescript-eslint/no-unnecessary-condition` — loose condition checks allowed
- `@typescript-eslint/require-await` — async functions without await allowed
- `import/no-cycle` — circular imports not blocked

## Directory Gotchas

- `src/lib/` is for utilities only (`cn`, `applyFilters`, `module.ts`, motion tokens) — never put domain logic here
- `src/api/` barrel (`index.ts`) re-exports all domain APIs — add new domains there
- `src/hooks/` contains shared hooks — feature-specific hooks go in the route file
- `.gitignore` excludes `.tanstack/`, `.vercel/`, `dist/`, `dist-ssr/` — don't look for these

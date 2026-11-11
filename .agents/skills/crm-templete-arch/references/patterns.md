# Code Patterns

## Mock Data → Real API Workflow

This is the core development pattern for this project. Follow it exactly.

### Phase 1: Frontend-Only Development

1. Define domain types in `src/types/{domain}.ts`
2. Create mock data + API functions in `src/api/{domain}.ts`
3. Route files import mock data from `@/api/{domain}` (never inline `const` data)
4. UI components receive data via props — they don't know about the mock

### Phase 2: Backend Integration

When the real API is ready, only `src/api/{domain}.ts` changes:
- Replace mock functions with real `fetch` calls via `request()` from `@/api/base.ts`
- Route files and UI components stay untouched — they already consume data through the API layer

### Mock Data File Structure

Every domain API file follows this exact structure:

```typescript
// src/api/prayer.ts
import type { Prayer } from '@/types/prayer'

// 1. Mock data array — realistic sample data
const mockPrayers: Prayer[] = [
    { id: 1, title: 'Morning Prayer', category: 'Daily Devotion', ... },
    { id: 2, title: 'Prayer for Healing', category: 'Healing', ... },
]

// 2. Async API object — will be replaced with real fetch calls later
export const prayerApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockPrayers,
            meta: { page: 1, limit: 10, total: mockPrayers.length, totalPages: 1 },
        }
    },
}

// 3. Synchronous exports — used by routes for direct data access
export const PRAYERS = mockPrayers
```

### How Routes Consume Mock Data

```typescript
// src/routes/__main/prayer-management.tsx
import { PRAYERS } from '@/api/prayer'

const { data: prayers = [] } = useQuery({
    queryKey: ['prayers'],
    queryFn: async () => [...PRAYERS],
})
```

For mutations, use the sync helpers:
```typescript
import { createUser, updateUser, deleteUser } from '@/api/users'

const saveMutation = useMutation({
    mutationFn: async ({ id, values }) => {
        if (id) updateUser(id, values)
        else createUser(values)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
})
```

## Design Token Usage

### Available Tokens

Reference `src/styles.css` for the full list. Common ones:

| Purpose | Token | Example |
|---------|-------|---------|
| Primary text | `text-foreground` | `<span className="text-foreground">` |
| Secondary text | `text-muted-foreground` | `<span className="text-muted-foreground">` |
| Card text | `text-card-foreground` | `<div className="text-card-foreground">` |
| Brand text | `text-brand` | `<span className="text-brand">` |
| Success state | `text-success` / `bg-success` | `<span className="text-success">Active</span>` |
| Danger state | `text-destructive` / `bg-destructive` | `<span className="text-destructive">Delete</span>` |
| Warning state | `text-warning` / `bg-warning` | `<div className="bg-warning/10 text-warning">` |
| Info state | `text-info` / `bg-info` | `<Badge className="text-info">` |
| Card background | `bg-card` | `<Card className="bg-card">` |
| Muted background | `bg-muted` | `<div className="bg-muted">` |
| Brand background | `bg-brand` | `<div className="bg-brand">` |
| Card variants | `bg-card-mint`, `bg-card-blue`, `bg-card-pink`, `bg-card-peach` | colored card backgrounds |
| Borders | `border-border` | `<div className="border-border">` |
| Input borders | `border-input` | `<Input className="border-input">` |
| Shadows | `shadow-sm`, `shadow-md`, `shadow-lg` | elevation levels |
| Glow effects | `glow-primary`, `glow-destructive`, `glow-success` | button/icon glow |

### What NOT to Do

```tsx
// WRONG — raw Tailwind colors
<span className="text-blue-500">
<div className="bg-red-100">
<span className="text-gray-600">

// WRONG — inline styles
<span style={{ color: '#22c55e' }}>
<div style={{ backgroundColor: '#fef2f2' }}>

// WRONG — arbitrary values
<span className="text-[#16a34a]">
<div className="bg-[#fef2f2]">

// CORRECT — design tokens
<span className="text-primary">
<div className="bg-destructive/10 text-destructive">
<span className="text-success">
```

### Dark Mode

Dark mode is handled automatically via the `.dark` class and CSS variables. Never write `dark:` overrides for token-based colors — the tokens already handle it.

```tsx
// WRONG — manual dark mode overrides
<span className="text-green-600 dark:text-green-400">

// CORRECT — token handles dark mode automatically
<span className="text-success">
```

## Component Reuse Patterns

### StatCard for KPIs (ADR-0003)

Never build ad-hoc stat cards. Use `StatCard` from `@/components/shared/cards`:

```tsx
import { StatCard, StatCardsGrid } from '@/components/shared/cards'

<StatCardsGrid
    cards={[
        { label: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
        { label: 'Active', value: '890', icon: Activity, color: 'emerald' },
    ]}
/>
```

### DataTable for Tables (ADR-0006)

`DataTable` has built-in horizontal scroll — never add scroll wrappers:

```tsx
import { DataTable } from '@/components/shared/datatables'
import type { DataTableColumn } from '@/components/shared/datatables'

const columns: DataTableColumn<User>[] = [
    { key: 'name', header: 'NAME', render: (user) => <span>{user.name}</span> },
]

<DataTable columns={columns} data={users} total={totalUsers} page={page} limit={limit} noun="users" />
```

### SearchInput + FilterBuilder

```tsx
import { SearchInput, FilterBuilder } from '@/components/shared/searching'
import type { FilterState, FilterOption } from '@/components/shared/searching'

<SearchInput value={query} onValueChange={setQuery} placeholder="Search..." />
<FilterBuilder options={filterOptions} filters={filters} onFiltersChange={setFilters} />
```

### Form System

Use `useAppForm` from `@/components/shared/forms/form-context`:

```tsx
import { useAppForm } from '@/components/shared/forms/form-context'

const form = useAppForm({
    defaultValues: { name: '', email: '' },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => handleSubmit(value),
})

// Use field components: FormInput, FormSelect, FormSwitch, FormRadio, FormImage, FormInputGroup, ButtonGroup, FormSubmit
<form.AppField name="name">{(field) => <field.FormInput label="Name" />}</form.AppField>
<form.AppForm><form.FormSubmit label="Save" /></form.AppForm>
```

## API Pattern

Each domain file exports an async API object AND synchronous helpers:

```typescript
export const userApi = {
    list: async (params?) => { ... },
    create: async (payload) => { ... },
    update: async (id, data) => { ... },
    delete: async (id) => { ... },
}

export const USERS = mockUsers
export function getUserById(id: number) { ... }
```

Types live in `src/types/{domain}.ts` — separate from API logic.

## Filter & Pagination Pattern

Shared logic in `src/lib/apply-filters.ts` — never duplicate:

```typescript
import { applyFilters, applySearch, paginate } from '@/lib/apply-filters'

const filtered = useMemo(() => {
    let result = applySearch(data, searchQuery, ['name', 'email'])
    result = applyFilters(result, filters, (item, fieldId) => item[fieldId as keyof typeof item])
    return result
}, [data, searchQuery, filters])

const paginated = useMemo(() => paginate(filtered, page, limit), [filtered, page, limit])
```

## Path Aliases

Both resolve to `./src/*`. Always use `@/`:

```typescript
import { X } from '@/components/ui/button'    // Correct
import { X } from '../../../components/ui/button'  // Wrong
```

## ADRs

Architectural decisions documented in `docs/adr/`:
- ADR-0003: StatCard reuse for stats
- ADR-0006: DataTable overflow scroll (built-in — no wrapper needed)
- ADR-0008: Decouple data fetching from UI (Container/Presenter)

Check ADRs before making breaking changes.

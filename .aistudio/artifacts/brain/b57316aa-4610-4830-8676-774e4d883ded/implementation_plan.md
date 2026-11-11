# Universal Table Column Customization & Multi-Row Bulk Operations

Enable interactive column visibility toggling (allowing users to show/hide columns such as Image, Category, SKU, Status) and multi-row selection with an animated bulk actions bar (bulk delete and status changes) across all AZ Sports administrative data tables.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during interactive clarification in Phase 1 and guide this plan:

- **Confirmed Decision 1 (Scope & Feature Set)**: Deliver **both** column visibility toggling and multi-row selection checkboxes.
- **Confirmed Decision 2 (Application Reach)**: Implement universally across all administrative tables in the application: **Products**, **Categories**, **Orders**, **User Management**, **Inventory**, and **Payments**.
- **Confirmed Decision 3 (Bulk Actions)**: Provide a floating batch actions bar equipped with **Bulk Delete** (with confirmation dialog) and **Bulk Status Change** (e.g. Active, Inactive, Low Stock, Fulfilled, etc., adapted to each entity).

---

## 1. Overview & Core Concept

### What It Does
- **Column Customizer**: A "View Columns" dropdown trigger positioned alongside search and filters in each table toolbar. Users can check or uncheck individual columns (e.g. Image, Category, SKU, Pricing, Timestamps) to personalize their viewport density and focus on pertinent data.
- **Multi-Row Checkbox Selection**: Select all (with indeterminate tri-state header checkbox), individual row toggles, and live selection counters.
- **Floating Batch Action Bar**: When one or more rows are selected, a smooth floating contextual action bar slides up from the bottom of the viewport with row count indicator, bulk status selector, batch delete with safety confirmation, and a "Deselect All" escape hatch.

### Target Audience & Persona
Store administrators, fulfillment specialists, and catalog managers handling high-volume sports apparel, inventory adjustments, and bulk customer orders.

### Key Value
Eliminates tedious single-item modifications by accelerating catalog maintenance and order batch processing, while giving users control over table visual density on screens of any size.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Customizing Visible Columns**:
   - The user opens the Products, Categories, or Orders page.
   - Beside the search bar, a `Columns` dropdown button (`SlidersHorizontal` icon) lists all hideable columns with checkboxes.
   - Unchecking "Image" or "Category" immediately updates the table without re-fetching data; column preferences persist in the table state.
2. **Selecting Rows & Triggering Actions**:
   - Clicking the header checkbox selects all visible rows on the current page; clicking again deselects all.
   - Selecting any row activates the floating bottom action bar with subtle slide-and-fade animation.
   - The user selects "Change Status" to batch transition items (e.g., mark 5 orders as "Shipped" or 4 products as "Active"), or clicks "Delete Selected" to launch a batch confirmation modal.

### Visual Identity & Theme
- **Theme Consistency**: Uses semantic Tailwind tokens (`--primary`, `--muted`, `--border`, `--card`, `--destructive`).
- **Floating Bar Aesthetic**: Pill-shaped or dock-styled dark/light floating surface (`bg-card/95 backdrop-blur border border-border shadow-xl`) elevated at bottom center (`z-40 fixed bottom-6`).
- **Typography & Alignment**: Compact tabular alignment (`tabular-nums`) on counts; high-density 38px table row height.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Centralized Reusable DataTable Architecture**:
  - *Chosen Approach*: Enhance the shared `DataTable` primitive (`src/components/shared/datatables/data-table.tsx`) and add a dedicated `TableToolbar` and `BulkActionBar` component rather than duplicating column/selection logic across 6 separate page files.
  - *Why*: Guarantees consistent UX, zero duplication, and instant coverage across Products, Categories, Orders, Inventory, Payments, and User Management.
- **Decision 2: In-Memory Bulk Handler Integration**:
  - *Chosen Approach*: Connect batch delete and batch status mutations directly into each module's existing in-memory store API layer (`src/api/*`) with instant optimistic updates and toast notifications.
  - *Why*: Maintains authentic interactive feedback and data integrity across subsequent page loads and navigation.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Administrative Page View                  │
│          (Products, Categories, Orders, Users, etc.)         │
└──────────────────────────────┬───────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────┐
│     Table Controls Bar        │   │    Shared DataTable       │
│  - SearchInput                │   │  - Header (Tri-state box) │
│  - FilterBuilder              │   │  - Row Checkboxes         │
│  - ColumnVisibilityDropdown   │   │  - ColumnDefs Rendering   │
└───────────────────────────────┘   └─────────────┬─────────────┘
                                                  │
                                                  ▼
                                    ┌───────────────────────────┐
                                    │   Floating BulkActionBar  │
                                    │  - Count of Selected Rows │
                                    │  - Batch Status Dropdown  │
                                    │  - Bulk Delete + Modal    │
                                    │  - Clear Selection Button │
                                    └─────────────┬─────────────┘
                                                  │
                                                  ▼
                                    ┌───────────────────────────┐
                                    │   Domain API Mock Stores  │
                                    │  - bulkUpdate(ids, data)  │
                                    │  - bulkDelete(ids)        │
                                    └───────────────────────────┘
```

### Component & State Mapping
1. **`DataTable` Core Enhancements**:
   - Built-in `ColumnVisibilityDropdown` popover for checking/unchecking columns.
   - Synchronized `rowSelection` state tracked via TanStack Table `useReactTable`.
   - `renderBulkActions` or built-in `BulkActionBar` support that passes selected IDs.
2. **Batch API Methods**:
   - `productApi.bulkDelete(ids)`, `productApi.bulkUpdateStatus(ids, status)`
   - `categoryApi.bulkDelete(ids)`
   - `orderApi.bulkDelete(ids)`, `orderApi.bulkUpdateStatus(ids, status)`
   - `userApi.bulkDelete(ids)`, `userApi.bulkUpdateStatus(ids, status)`
3. **Optimistic UI Feedback**:
   - Successful actions clear selected rows and trigger Sonner confirmation toasts.

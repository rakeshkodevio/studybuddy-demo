# ADR-0006: Horizontal Scroll Wrapper for All DataTable Instances

**Date**: 2026-07-13
**Status**: accepted
**Deciders**: Developer, AI assistant

## Context

The shared `DataTable` component renders a `<Table>` with no scroll container. On mobile, any table with more columns than can fit (Payments: 7 cols, Users: 7+ cols, Notifications: 5 cols) causes body-level overflow scroll — a UX anti-pattern. Each page was also having to add its own scroll wrappers inconsistently.

## Decision

Add `overflow-x-auto rounded-lg border border-border` wrapper directly inside the `DataTable` component around its `<Table>`. This is a single fix that applies universally to every page using `DataTable`. Also remove the redundant border from `Roles` page wrapper since it's now handled by the component.

## Alternatives Considered

### Alternative 1: Add overflow-x-auto wrapper on each page

- **Pros**: Per-page control
- **Cons**: Already done inconsistently; requires updates on every page; easy to forget
- **Why not**: DRY principle violated; centralized fix is strictly better

### Alternative 2: CSS `display: block; overflow-x: auto` on the Table element itself

- **Pros**: No wrapper div
- **Cons**: Breaks table layout model; `<table>` elements don't behave well as block-scroll containers across browsers
- **Why not**: Cross-browser reliability issues

## Consequences

### Positive

- All tables universally mobile-safe from a single change
- Border visually unified — table always has rounded border from DataTable
- New pages using DataTable get mobile scroll for free

### Negative

- Tables now always have a border — pages that wanted a borderless table lose that option without a `noBorder` prop
- Roles page now has double border (its own + DataTable's) — Roles uses raw `<Table>` not `DataTable`, so no conflict

### Risks

- Pages using raw `<Table>` (not `DataTable`) still need individual scroll wrappers — Roles page was already fixed separately (ADR-0005)

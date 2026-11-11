# ADR-0005: Horizontal Scroll Wrapper for Roles Permissions Table

**Date**: 2026-07-13
**Status**: accepted
**Deciders**: Developer, AI assistant

## Context

Roles page renders a permissions matrix: 9 permissions × 4 roles = 5 columns. On mobile, table overflowed the viewport causing body-level horizontal scroll — a UX anti-pattern that scrolls the entire page rather than just the table region.

## Decision

Wrap `<Table>` in `<div className="overflow-x-auto rounded-lg border border-border">`. Set `min-w` on column headers and `whitespace-nowrap` on permission name cells.

## Alternatives Considered

### Alternative 1: Accordion per permission on mobile

- **Pros**: No horizontal scroll
- **Cons**: Destroys the matrix view that lets users compare roles side-by-side — the core value of the page
- **Why not**: Ruins UX for the primary use case

### Alternative 2: Hide role columns, show on tap

- **Pros**: Fits mobile
- **Cons**: Complex state; no side-by-side comparison
- **Why not**: Over-engineered; horizontal table scroll is a universal established pattern

## Consequences

### Positive

- Table usable on all screen sizes
- No desktop layout change
- Border moved to wrapper = cleaner visual (no double borders)

### Negative

- Scrollable region not visually indicated without scrollbar

### Risks

- None; horizontal table scroll is standard web UX

# ADR-0004: Scrollable Pill Tabs for Support Status Filter

**Date**: 2026-07-13
**Status**: accepted
**Deciders**: Developer, AI assistant

## Context

Support page status filter (All Status / Open / Pending / Resolved) used `flex-1 min-w-[120px]` buttons. Four buttons × 120px minimum = 480px minimum width. On mobile screens <480px this caused overflow or ugly two-row wrapping with `flex-wrap`.

## Decision

Replace stretching flex tabs with compact `rounded-full` pill buttons in `overflow-x-auto no-scrollbar` container. Tabs are `shrink-0` so they don't collapse; row scrolls horizontally on narrow screens.

## Alternatives Considered

### Alternative 1: `flex-wrap` multi-row tabs

- **Pros**: All tabs always visible
- **Cons**: Two-row layout wastes vertical space, looks broken
- **Why not**: Poor mobile UX

### Alternative 2: Dropdown select on mobile, tabs on desktop

- **Pros**: Space efficient
- **Cons**: Conditional rendering adds complexity; loses discoverability for 4 simple options
- **Why not**: Over-engineered

## Consequences

### Positive

- Tabs always single-row; clean on all screens
- Pattern reusable for other filter tab bars

### Negative

- Horizontal scroll not always discoverable (no visible scrollbar)

### Risks

- `no-scrollbar` utility must be in global CSS — added to `src/styles.css`

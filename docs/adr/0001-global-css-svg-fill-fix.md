# ADR-0001: Global CSS Rule for SVG Icon Fill in Sidebar

**Date**: 2026-07-13
**Status**: accepted
**Deciders**: Developer, AI assistant

## Context

Lucide icons in active sidebar navigation items rendered as solid filled blobs instead of clean outlines. When `data-active:text-sidebar-primary-foreground` changes text color on the button, CSS cascade causes SVG elements to inherit `fill: currentColor`, overriding Lucide's inline SVG attribute `fill="none"`. Affected all nav items (Users, Checklist, Dashboard, etc.) when active.

## Decision

Add a scoped global CSS rule in `src/styles.css` targeting `[data-sidebar] svg` elements that forces `fill: none !important`. Scoped to sidebar data attributes only.

## Alternatives Considered

### Alternative 1: Tailwind utility on SidebarMenuButton variants (`[&_svg]:fill-none`)

- **Pros**: Co-located with component
- **Cons**: Loses to cascade from ancestor text-color; adding `stroke-current stroke-2` broke icon click behavior in testing
- **Why not**: Failed to fix issue, introduced nav regression

### Alternative 2: Replace icons with filled variants (e.g., `UsersRound`)

- **Pros**: Quick fix for one icon
- **Cons**: Symptom fix only — all icons have same problem on active state
- **Why not**: Doesn't scale; each icon needs individual attention

## Consequences

### Positive

- All sidebar Lucide icons stay outline in every state
- Single rule, zero ongoing maintenance

### Negative

- Uses `!important` — justified here to override cascade, but a code smell

### Risks

- If a future SVG inside the sidebar needs fill (e.g., a filled logo), it needs an explicit override

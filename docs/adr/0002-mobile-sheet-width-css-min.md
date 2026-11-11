# ADR-0002: Mobile Sidebar Sheet Width via CSS min()

**Date**: 2026-07-13
**Status**: accepted
**Deciders**: Developer, AI assistant

## Context

Mobile sidebar Sheet used `w-3/4` (75vw) with `sm:max-w-sm` cap. On phones ≥380px wide, 75% exceeded 16rem (the intended sidebar width), leaving little content visible behind overlay. The `--sidebar-width` CSS variable was not reliably resolved by Tailwind 4 JIT inside SheetContent className.

## Decision

Replace `w-3/4 data-[side=left]:sm:max-w-sm` with `w-[min(75vw,16rem)]` using CSS native `min()`. Caps sidebar at exactly 16rem on all screen sizes.

## Alternatives Considered

### Alternative 1: Keep `w-3/4 sm:max-w-sm`

- **Pros**: Pure Tailwind classes
- **Cons**: No cap below `sm` breakpoint (640px); sidebar oversized on 380–640px phones
- **Why not**: Fails the visual problem seen in screenshots

### Alternative 2: `w-(--sidebar-width)` CSS variable

- **Pros**: Respects design token
- **Cons**: Tailwind 4 does not consistently resolve CSS variables in `w-()` shorthand inside className overrides
- **Why not**: Unreliable across environments

## Consequences

### Positive

- Sidebar exactly 16rem on all screen sizes ≥213px
- Pure CSS, no JS

### Negative

- Hardcodes `16rem` — must stay in sync with `SIDEBAR_WIDTH_MOBILE` constant in `sidebar.tsx`

### Risks

- Minimal; value matches existing constant

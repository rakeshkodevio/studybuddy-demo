# ADR-0008: Decouple Data Fetching from UI Components

**Date**: 2026-07-13
**Status**: accepted
**Deciders**: AI Agent, User

## Context

The current dashboard has highly polished UI styles (checklists, tips, tables) that we want to reuse for a different project. However, the current route components tightly couple API data fetching (via TanStack Query) with the UI rendering.

## Decision

We will refactor complex UI pages to use the Container/Presenter pattern. The beautiful UI styles will be extracted into pure presentational components that accept data via props. The route files will act strictly as data containers.

## Consequences

### Positive

- The highly polished UI styles can be reused anywhere in the app or in a cloned project without dragging along Mercy-Daily-specific API calls.
- Easier to build a "Kitchen Sink" or style guide.

### Negative

- Requires a one-time refactoring effort to split the components.

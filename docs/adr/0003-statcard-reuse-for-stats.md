# ADR-0003: Reuse StatCard Component for All KPI Stat Displays

**Date**: 2026-07-13
**Status**: accepted
**Deciders**: Developer, AI assistant

## Context

Notifications page had three ad-hoc `Card` components showing KPI stats with raw Bell icons and bold numbers. Dashboard already had polished `StatCard` component with color-coded icon badges, decorative blobs, trend indicators, hover animations. Two visual patterns for same concept = inconsistency.

## Decision

Replace ad-hoc Card stats in Notifications with `StatCard` from `src/components/shared/stat-card.tsx`. Use `MailOpen` and `Megaphone` Lucide icons for semantic differentiation.

## Alternatives Considered

### Alternative 1: Style existing Cards to visually match StatCard

- **Pros**: No import changes
- **Cons**: Duplicates logic; future StatCard changes need applying in two places
- **Why not**: Violates DRY

### Alternative 2: New lightweight "SimpleStatCard" variant

- **Pros**: Lighter weight
- **Cons**: StatCard's `trend` prop is already optional; adds a component for no reason
- **Why not**: Over-engineering

## Consequences

### Positive

- Visual consistency across all pages with KPI metrics
- Trend indicators appear on Notifications (open rate, campaign growth)
- Single source of truth for stat card appearance

### Negative

- Minor import dependency added to notifications.tsx

### Risks

- None

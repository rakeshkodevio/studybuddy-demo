# 7. Fix Mobile Sidebar Navigation and Flex Blowout

Date: 2026-07-13

## Status

Accepted

## Context

Users reported two critical UI bugs:

1. "when clicked on users nav option, it breaks the nav icon" - On mobile devices, clicking a navigation link inside the sidebar Sheet changed the route, but did not close the Sheet. This trapped the user, giving the illusion that the nav was broken.
2. "User one takes a lot space... in users management page, I cant use or open nav." - Wide data tables inside the `user-management.tsx` flex layout caused the parent container to expand horizontally beyond `100vw`. This pushed the mobile sidebar trigger (hamburger icon) off-screen, preventing users from opening the navigation.

## Decision

1. **Close Sidebar on Navigation**: In `src/components/main/nav-main.tsx`, we imported `useSidebar` and attached `onClick={() => setOpenMobile(false)}` to the `SidebarMenuButton`. This guarantees the mobile Sheet closes immediately when a route is selected.
2. **Constrain Flex Children**: In `src/routes/__main/route.tsx`, we added `min-w-0 w-full` to the `motion.div` that wraps the `<Outlet />`. The `min-w-0` CSS utility allows flex items to shrink smaller than their content, which is required to prevent horizontally scrolling tables from blowing out the entire page width.

## Consequences

- Mobile users can now navigate seamlessly without the sidebar getting stuck open.
- The global layout remains constrained to the viewport width, and components like `<DataTable />` correctly handle horizontal scrolling internally via their own `overflow-x-auto` wrappers.
- We must ensure any future global flex wrappers also maintain `min-w-0` to avoid regressing on this behavior.

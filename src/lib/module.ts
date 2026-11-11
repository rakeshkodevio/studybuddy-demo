/**
 * Single source of truth for module identifiers, paths, and permissions.
 *
 * Each entry owns:
 *  - key:         kebab-case key (used for i18n namespaces, API payloads, permission map)
 *  - path:        the URL the module lives at
 *  - permissions: the set of permission keys valid for this module
 *
 * Order in MODULES = order in the sidebar / role matrix / form-module-map.
 *
 * To add a module:
 *   1. Add an entry here (key, path, permissions).
 *   2. Create a route file at the matching `path` under `src/routes/__main/`.
 *   3. Add an icon for it in `src/lib/module-icons.tsx`.
 *
 * Consumers (all derived — never duplicate the list elsewhere):
 *   - `app-sidebar.tsx`           → sidebar links
 *   - `__main/route.tsx`          → breadcrumb labels
 *   - `form-module-map.tsx`       → role permission matrix
 *   - `permission.tsx`            → hasRoutePermission
 */

// ---------- 1. Canonical permission keys (kebab-case, API-friendly) ----------
export const COMMON_PERMISSIONS = ['create', 'read', 'update', 'delete'] as const
export type PermissionKey = (typeof COMMON_PERMISSIONS)[number]

// ---------- 2. Module registry ----------
export const MODULES = {
    dashboard: {
        title: 'StudyBuddy Hub',
        path: '/',
        description: 'Exam preparation pulse, live model tests, daily practice streak, and subject mastery.',
        permissions: ['read'] as const,
    },
    products: {
        title: 'Question Bank',
        path: '/products',
        description: 'Comprehensive 1M+ MCQ database with chapter-wise questions and solutions.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    categories: {
        title: 'Subjects & Streams',
        path: '/categories',
        description: 'Academic streams (HSC, BUET, Medical, BCS) and subject syllabuses.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    orders: {
        title: 'Exam Submissions',
        path: '/orders',
        description: 'Live model test results, student submissions, and national merit ranking.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    'user-management': {
        title: 'Learners',
        path: '/user-management',
        description: 'Registered students, study streaks, institution data, and leaderboard standing.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    inventory: {
        title: 'Routines & Tests',
        path: '/inventory',
        description: 'Model test calendar, upcoming national exam schedules, and test papers.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    'dynamic-pricing': {
        title: 'Plans & Coupons',
        path: '/dynamic-pricing',
        description: 'Subscription passes, admission model test packages, and promo codes.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    reports: {
        title: 'Performance Analytics',
        path: '/reports',
        description: 'Student diagnostic reports, accuracy trends, and weak topic heatmaps.',
        permissions: ['read'] as const,
    },
    payments: {
        title: 'Billing & MFS',
        path: '/payments',
        description: 'bKash, Nagad, Rocket, and Card subscription transactions.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    notifications: {
        title: 'Exam Alerts',
        path: '/notifications',
        description: 'Live test reminders, streak warnings, and study notifications.',
        permissions: ['read', 'create', 'update', 'delete'] as const,
    },
    settings: {
        title: 'Settings',
        path: '/settings',
        description: 'Academic target, syllabus version, and notification preferences.',
        permissions: ['read', 'update'] as const,
    },
} as const

// ---------- 3. Types ----------
export type ModuleKey = keyof typeof MODULES
export type ModuleConfig<TModule extends ModuleKey = ModuleKey> = (typeof MODULES)[TModule]
export type ModulePath<TModule extends ModuleKey = ModuleKey> = (typeof MODULES)[TModule]['path']
export type ModulePermission<TModule extends ModuleKey = ModuleKey> = (typeof MODULES)[TModule]['permissions'][number]

// ---------- 4. Iteration / lookup helpers ----------
export const MODULE_KEYS = Object.keys(MODULES) as ModuleKey[]

export const getModule = <TModule extends ModuleKey>(key: TModule): (typeof MODULES)[TModule] => MODULES[key]

export const getModuleByPath = (path: string): ModuleKey | undefined => MODULE_KEYS.find((key) => MODULES[key].path === path)

import {
    LayoutDashboard,
    UsersRound,
    Settings,
    CreditCard,
    Bell,
    BookOpen,
    GraduationCap,
    FileCheck,
    CalendarCheck,
    Tag,
    BarChart3,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ModuleKey } from './module'

/**
 * Icon mapping for each module. Keyed by ModuleKey so the type system enforces
 * that every module has an icon. Add a new entry here when you add a module.
 */
export const MODULE_ICONS: Record<ModuleKey, LucideIcon> = {
    dashboard: LayoutDashboard,
    products: BookOpen,
    categories: GraduationCap,
    orders: FileCheck,
    'user-management': UsersRound,
    inventory: CalendarCheck,
    'dynamic-pricing': Tag,
    reports: BarChart3,
    payments: CreditCard,
    notifications: Bell,
    settings: Settings,
}

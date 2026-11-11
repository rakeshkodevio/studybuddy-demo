import type { PermissionKey } from '@/lib/module'

/** Roles for the StudyBuddy / Chorcha learning platform */
export type AdminRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'student' | string

/** Permissions for a specific module */
export type ModulePermissions = Record<string, PermissionKey[]>

/** User account for StudyBuddy / Chorcha dashboard */
export interface AdminUser {
    id: string
    name: string
    email: string
    role: AdminRole
    permissions: ModulePermissions
    image: string
    phone: string
    emailVerified?: boolean
    studentProfile?: Record<string, unknown> | null
}

/** Session type returned by auth API */
export interface AuthSession {
    user: AdminUser
    token?: string
    expiresAt?: string
}

/** Regular user type (for user management / learner roster module) */
export type User = {
    id: number
    name: string
    image: string
    email: string
    phone: string
    orders: number // Tests completed
    college?: string
    targetStream?: string
    streakDays?: number
    xpPoints?: number
    meritRank?: number
    role: 'User' | 'Moderator'
    verification: 'Verified' | 'Unverified'
    status: 'Active' | 'Suspended'
}


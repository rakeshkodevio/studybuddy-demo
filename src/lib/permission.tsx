import type { ModuleKey, PermissionKey } from './module'
import { getModuleByPath } from './module'
import type { AdminUser } from '@/types/user'

/** 'stat-cards' -> 'Stat Cards'. Used for permission checkbox labels. */
export const formatPermission = (key: string): string =>
    key
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

/** Resolves the ModuleKey associated with a given path, handling segments. */
export const getModuleKeyFromPath = (path: string): ModuleKey | undefined => {
    const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/'

    // Segment-based matching for standard modules
    const segments = cleanPath.split('/').filter(Boolean)
    for (let i = segments.length; i > 0; i--) {
        const prefixPath = '/' + segments.slice(0, i).join('/')
        const key = getModuleByPath(prefixPath)
        if (key) {
            return key
        }
    }

    // Only match dashboard if path is exactly '/'
    if (cleanPath === '/') {
        return 'dashboard'
    }

    return undefined
}

/** Check if the user has a specific permission for a module */
export const hasModulePermission = (
    user: AdminUser | null | undefined,
    moduleKey: ModuleKey,
    permission: PermissionKey,
): boolean => {
    if (!user) return false
    // ADMIN role has all permissions
    if (user.role === 'ADMIN') return true
    // Check module-specific permissions
    const userPermissions = user.permissions[moduleKey]
    if (!userPermissions) return false
    return userPermissions.includes(permission)
}

/** Check if the user has access to a specific route based on their module permissions. */
export const hasRoutePermission = (user: AdminUser | null | undefined, path: string): boolean => {
    if (!user) return false
    // ADMIN can access everything
    if (user.role === 'ADMIN') return true
    const moduleKey = getModuleKeyFromPath(path)
    if (!moduleKey) return true // Unknown routes are allowed (fallback)
    // User needs at least 'read' permission to access a module
    return hasModulePermission(user, moduleKey, 'read')
}

/** Enforces route permission constraints, returning the path to redirect to if unauthorized. */
export const checkRoutePermission = (
    user: AdminUser | null | undefined,
    path: string,
): string | null => {
    if (hasRoutePermission(user, path)) return null
    return '/' // Redirect to dashboard if unauthorized
}

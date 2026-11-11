import type { PermissionPayload } from '@/components/shared/forms/form-module-map'

export interface Role {
    id: string
    adminId: string
    name: string
    description: string | null
    permissions: PermissionPayload
    createdAt: string
    updatedAt: string
    employees?: {
        id: string
        user: {
            id: string
            name: string
        }
    }[]
}

export interface CreateRolePayload {
    name: string
    description?: string
    permissions: PermissionPayload
}

export interface UpdateRolePayload {
    name?: string
    description?: string
    permissions?: PermissionPayload
}

// In-memory mock store
const mockRoles: Role[] = [
    {
        id: 'role1',
        adminId: 'admin1',
        name: 'Manager',
        description: 'Full access to manage staff and users',
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'role2',
        adminId: 'admin1',
        name: 'Staff',
        description: 'Limited access',
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]

export const roleApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockRoles,
            meta: { page: 1, limit: 10, total: mockRoles.length, totalPages: 1 },
        }
    },
    create: async (payload: CreateRolePayload) => {
        await new Promise((r) => setTimeout(r, 500))
        const newRole: Role = {
            id: Math.random().toString(36).substring(7),
            adminId: 'admin1',
            name: payload.name,
            description: payload.description || '',
            permissions: payload.permissions,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        mockRoles.push(newRole)
        return { data: newRole }
    },
    update: async (id: string, payload: UpdateRolePayload) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockRoles.findIndex((r) => r.id === id)
        if (index > -1) {
            mockRoles[index] = { ...mockRoles[index], ...payload }
        }
        return { data: mockRoles[index] }
    },
    delete: async (id: string) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockRoles.findIndex((r) => r.id === id)
        if (index > -1) mockRoles.splice(index, 1)
    },
}

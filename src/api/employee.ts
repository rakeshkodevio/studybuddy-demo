export interface Employee {
    id: string
    adminId: string
    userId: string
    roleId: string
    invitedById: string | null
    invitedAt: string
    acceptedAt: string | null
    createdAt: string
    updatedAt: string
    user: {
        id: string
        name: string
        email: string
        image: string | null
        phone: string | null
        banned: boolean
    }
    role: {
        id: string
        name: string
        permissions: Record<string, string[]>
    }
}

export interface CreateEmployeePayload {
    name: string
    email: string
    image: string
    phone: string
    roleId: string
    password: string
}

export interface UpdateEmployeePayload {
    name?: string
    image?: string
    phone?: string
    roleId?: string
    status?: 'active' | 'banned'
}

// In-memory mock store
let mockEmployees: Employee[] = [
    {
        id: '1',
        adminId: 'admin1',
        userId: 'user1',
        roleId: 'role1',
        invitedById: null,
        invitedAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
            id: 'user1',
            name: 'Jane Cooper',
            email: 'jane.cooper@example.com',
            image: null,
            phone: '+1 416 555 0192',
            banned: false,
        },
        role: {
            id: 'role1',
            name: 'Manager',
            permissions: {},
        },
    },
]

export const employeeApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockEmployees,
            meta: { page: 1, limit: 10, total: mockEmployees.length, totalPages: 1 },
        }
    },
    create: async (payload: CreateEmployeePayload) => {
        await new Promise((r) => setTimeout(r, 500))
        const newEmployee: Employee = {
            id: Math.random().toString(36).substring(7),
            adminId: 'admin1',
            userId: 'new-user',
            roleId: payload.roleId,
            invitedById: null,
            invitedAt: new Date().toISOString(),
            acceptedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
                id: 'new-user',
                name: payload.name,
                email: payload.email,
                image: payload.image || null,
                phone: payload.phone,
                banned: false,
            },
            role: {
                id: payload.roleId,
                name: payload.roleId === 'role1' ? 'Manager' : 'Staff',
                permissions: {},
            },
        }
        mockEmployees.push(newEmployee)
        return { data: newEmployee }
    },
    update: async (id: string, payload: UpdateEmployeePayload) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockEmployees.findIndex((e) => e.id === id)
        if (index > -1) {
            mockEmployees[index] = {
                ...mockEmployees[index],
                user: {
                    ...mockEmployees[index].user,
                    ...(payload.name && { name: payload.name }),
                    ...(payload.image && { image: payload.image }),
                    ...(payload.phone && { phone: payload.phone }),
                    ...(payload.status && { banned: payload.status === 'banned' }),
                },
                ...(payload.roleId && { roleId: payload.roleId }),
            }
        }
        return { data: mockEmployees[index] }
    },
    delete: async (id: string) => {
        await new Promise((r) => setTimeout(r, 500))
        mockEmployees = mockEmployees.filter((e) => e.id !== id)
    },
}

// Keep a backward compatible alias just in case
export const employee = employeeApi

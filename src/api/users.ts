import type { User } from '@/types/user'
import { studyBuddyApi } from './studybuddy'

let mockUsers: User[] = [
    {
        id: 1,
        name: 'Tanvir Ahmed',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Tanvir',
        email: 'tanvir.ndc@gmail.com',
        phone: '+880 1711-234567',
        college: 'Notre Dame College, Dhaka',
        targetStream: 'BUET & Engineering',
        streakDays: 28,
        xpPoints: 6420,
        meritRank: 1,
        orders: 45,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Nusrat Jahan',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Nusrat',
        email: 'nusrat.vnsc@gmail.com',
        phone: '+880 1819-345678',
        college: 'Viqarunnisa Noon School & College',
        targetStream: 'Medical Admission',
        streakDays: 35,
        xpPoints: 6180,
        meritRank: 2,
        orders: 52,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
    {
        id: 3,
        name: 'Fariha Anjum',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Fariha',
        email: 'fariha.hc@gmail.com',
        phone: '+880 1912-890123',
        college: 'Holy Cross College, Dhaka',
        targetStream: 'Dhaka University (Ka)',
        streakDays: 21,
        xpPoints: 5890,
        meritRank: 3,
        orders: 38,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
    {
        id: 4,
        name: 'Sabbir Hossain',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sabbir',
        email: 'sabbir.dc@gmail.com',
        phone: '+880 1515-456789',
        college: 'Dhaka College',
        targetStream: 'BUET & Engineering',
        streakDays: 19,
        xpPoints: 5410,
        meritRank: 7,
        orders: 34,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
    {
        id: 5,
        name: 'Mehnaz Tabassum',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mehnaz',
        email: 'mehnaz.rumc@gmail.com',
        phone: '+880 1618-678901',
        college: 'Rajuk Uttara Model College',
        targetStream: 'HSC 2026 (Science)',
        streakDays: 14,
        xpPoints: 4950,
        meritRank: 14,
        orders: 29,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
    {
        id: 6,
        name: 'Arif Rayhan',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arif',
        email: 'arif.ctg@gmail.com',
        phone: '+880 1713-789012',
        college: 'Chittagong College',
        targetStream: 'BUET & Engineering',
        streakDays: 12,
        xpPoints: 4320,
        meritRank: 28,
        orders: 26,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
    {
        id: 7,
        name: 'Zarin Subah',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zarin',
        email: 'zarin.adamjee@gmail.com',
        phone: '+880 1812-901234',
        college: 'Adamjee Cantonment College',
        targetStream: 'Medical Admission',
        streakDays: 16,
        xpPoints: 4680,
        meritRank: 19,
        orders: 31,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
    {
        id: 8,
        name: 'Sakib Al Hasan',
        image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sakib',
        email: 'sakib.mgc@gmail.com',
        phone: '+880 1914-123456',
        college: 'Mirzapur Cadet College',
        targetStream: 'HSC 2026 (Science)',
        streakDays: 9,
        xpPoints: 3750,
        meritRank: 42,
        orders: 20,
        role: 'User',
        verification: 'Verified',
        status: 'Active',
    },
]

export const userApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        try {
            const leaderboard = await studyBuddyApi.leaderboard.list(1, 20)
            const list = Array.isArray(leaderboard?.data)
                ? leaderboard.data
                : Array.isArray(leaderboard)
                  ? leaderboard
                  : []
            if (list.length > 0) {
                const mapped: User[] = list.map((item: any, idx: number) => ({
                    id: idx + 1,
                    name: item.name || `Scholar ${idx + 1}`,
                    image: item.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(item.name || `User${idx}`)}`,
                    email: item.email || `learner${idx + 1}@chorcha.net`,
                    phone: item.phone || '+880 1711-000000',
                    college: item.college || (idx % 2 === 0 ? 'Notre Dame College, Dhaka' : 'Viqarunnisa Noon School & College'),
                    targetStream: item.targetStream || (idx % 3 === 0 ? 'BUET & Engineering' : idx % 3 === 1 ? 'Medical Admission' : 'HSC 2026'),
                    streakDays: item.streakDays || (30 - idx),
                    xpPoints: item.xpPoints || item.score || (6500 - idx * 250),
                    meritRank: item.rank || idx + 1,
                    orders: item.totalTests || (45 - idx),
                    role: 'User' as const,
                    verification: 'Verified' as const,
                    status: 'Active' as const,
                }))
                return {
                    data: mapped,
                    meta: { page: 1, limit: mapped.length, total: mapped.length, totalPages: 1 },
                }
            }
        } catch (err) {
            console.warn('Using offline mock for learners:', err)
        }

        return {
            data: mockUsers,
            meta: { page: 1, limit: 10, total: mockUsers.length, totalPages: 1 },
        }
    },
    create: async (payload: Omit<User, 'id'>) => {
        await new Promise((r) => setTimeout(r, 500))
        const newUser: User = { id: Date.now(), ...payload }
        mockUsers = [...mockUsers, newUser]
        return { data: newUser }
    },
    update: async (id: number, payload: Partial<User>) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockUsers.findIndex((u) => u.id === id)
        if (index !== -1) {
            mockUsers[index] = { ...mockUsers[index], ...payload }
        }
        return { data: mockUsers[index] }
    },
    toggleStatus: async (id: number) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockUsers.findIndex((u) => u.id === id)
        if (index !== -1) {
            mockUsers[index] = {
                ...mockUsers[index],
                status: mockUsers[index].status === 'Active' ? 'Suspended' : 'Active',
            }
        }
        return { data: mockUsers[index] }
    },
    delete: async (id: number) => {
        await new Promise((r) => setTimeout(r, 500))
        mockUsers = mockUsers.filter((u) => u.id !== id)
    },
    bulkDelete: async (ids: number[]) => {
        await new Promise((r) => setTimeout(r, 400))
        mockUsers = mockUsers.filter((u) => !ids.includes(u.id))
    },
    bulkUpdateStatus: async (ids: number[], status: User['status']) => {
        await new Promise((r) => setTimeout(r, 400))
        mockUsers = mockUsers.map((u) => (ids.includes(u.id) ? { ...u, status } : u))
    },
}

// Synchronous exports for direct access (used by routes)
export const USERS = mockUsers

export function getUserById(id: number): User | undefined {
    return mockUsers.find((u) => u.id === id)
}

export function createUser(data: Omit<User, 'id'>): User {
    const newUser = { id: Date.now(), ...data }
    mockUsers = [...mockUsers, newUser]
    return newUser
}

export function updateUser(id: number, data: Partial<User>): User | undefined {
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data }
        return mockUsers[index]
    }
    return undefined
}

export function toggleUserStatus(id: number): User | undefined {
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index !== -1) {
        mockUsers[index] = {
            ...mockUsers[index],
            status: mockUsers[index].status === 'Active' ? 'Suspended' : 'Active',
        }
        return mockUsers[index]
    }
    return undefined
}

export function deleteUser(id: number): boolean {
    const initialLength = mockUsers.length
    mockUsers = mockUsers.filter((u) => u.id !== id)
    return mockUsers.length !== initialLength
}

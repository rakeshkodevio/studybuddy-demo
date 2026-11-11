import type { Order } from '@/types/order'
import { studyBuddyApi } from './studybuddy'

let mockOrders: Order[] = [
    {
        id: 8401,
        userName: 'Tanvir Ahmed',
        email: 'tanvir.ndc@gmail.com',
        college: 'Notre Dame College, Dhaka',
        examName: 'HSC Physics Mock #08 (ভেক্টর ও গতিবিদ্যা)',
        orderDate: 'Today, 10:45 AM',
        price: 24.5,
        meritRank: 1,
        accuracy: 98,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
    {
        id: 8402,
        userName: 'Nusrat Jahan',
        email: 'nusrat.vnsc@gmail.com',
        college: 'Viqarunnisa Noon School & College',
        examName: 'BUET Engineering Math Blitz 04',
        orderDate: 'Today, 09:30 AM',
        price: 23.75,
        meritRank: 2,
        accuracy: 95,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
    {
        id: 8403,
        userName: 'Sabbir Hossain',
        email: 'sabbir.dc@gmail.com',
        college: 'Dhaka College',
        examName: 'Medical Admission Marathon 12',
        orderDate: 'Yesterday, 08:15 PM',
        price: 22.5,
        meritRank: 7,
        accuracy: 90,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
    {
        id: 8404,
        userName: 'Mehnaz Tabassum',
        email: 'mehnaz.rumc@gmail.com',
        college: 'Rajuk Uttara Model College',
        examName: 'HSC Chemistry Mock #06 (গুণগত রসায়ন)',
        orderDate: 'Yesterday, 04:20 PM',
        price: 21.25,
        meritRank: 14,
        accuracy: 85,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
    {
        id: 8405,
        userName: 'Arif Rayhan',
        email: 'arif.ctg@gmail.com',
        college: 'Chittagong College',
        examName: 'DU Ka-Unit Comprehensive Mock',
        orderDate: '2026-08-03',
        price: 19.5,
        meritRank: 28,
        accuracy: 78,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
    {
        id: 8406,
        userName: 'Fariha Anjum',
        email: 'fariha.hc@gmail.com',
        college: 'Holy Cross College',
        examName: 'ICT Board Standard Practice #03',
        orderDate: '2026-08-03',
        price: 24.0,
        meritRank: 3,
        accuracy: 96,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
    {
        id: 8407,
        userName: 'Sakib Al Hasan',
        email: 'sakib.mgc@gmail.com',
        college: 'Mirzapur Cadet College',
        examName: 'HSC Higher Math Paper 1 Mock',
        orderDate: '2026-08-02',
        price: 18.0,
        meritRank: 42,
        accuracy: 72,
        paymentStatus: 'Unpaid',
        status: 'Pending',
    },
    {
        id: 8408,
        userName: 'Zarin Subah',
        email: 'zarin.adamjee@gmail.com',
        college: 'Adamjee Cantonment College',
        examName: 'Medical Biology Blitz #09',
        orderDate: '2026-08-02',
        price: 23.0,
        meritRank: 5,
        accuracy: 92,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
    {
        id: 8409,
        userName: 'Mahmudul Hasan',
        email: 'mahmud.ndc@gmail.com',
        college: 'Notre Dame College',
        examName: 'HSC Physics Mock #08 (ভেক্টর ও গতিবিদ্যা)',
        orderDate: '2026-08-01',
        price: 14.5,
        meritRank: 110,
        accuracy: 58,
        paymentStatus: 'Unpaid',
        status: 'Canceled',
    },
    {
        id: 8410,
        userName: 'Anika Bushra',
        email: 'anika.baf@gmail.com',
        college: 'BAF Shaheen College',
        examName: 'BCS Preliminary General Science Mock',
        orderDate: '2026-08-01',
        price: 22.0,
        meritRank: 9,
        accuracy: 88,
        paymentStatus: 'Passed',
        status: 'Delivered',
    },
]

export const orderApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        try {
            const leaderboard = await studyBuddyApi.leaderboard.list(1, 20)
            const list = Array.isArray(leaderboard?.data)
                ? leaderboard.data
                : Array.isArray(leaderboard)
                  ? leaderboard
                  : []

            if (list.length > 0) {
                const liveSubmissions: Order[] = list.map((student: any, idx: number) => ({
                    id: 9000 + idx + 1,
                    userName: student.name || `Student ${idx + 1}`,
                    email: student.email || `${(student.name || 'student').toLowerCase().replace(/\s+/g, '.')}@chorcha.net`,
                    college: student.college || (idx % 2 === 0 ? 'Notre Dame College' : 'Viqarunnisa Noon College'),
                    examName: student.latestExam || (idx % 3 === 0 ? 'DU Unit-A Model Test 2026' : idx % 3 === 1 ? 'BUET Math Blitz' : 'Medical Biology Mega Mock'),
                    orderDate: 'Recent',
                    price: 25.0,
                    meritRank: student.rank || idx + 1,
                    accuracy: Math.min(99, Math.max(70, Math.round(98 - idx * 1.5))),
                    paymentStatus: 'Passed',
                    status: 'Delivered',
                }))
                const combined = [...liveSubmissions, ...mockOrders]
                return {
                    data: combined,
                    meta: { page: 1, limit: combined.length, total: combined.length, totalPages: 1 },
                }
            }
        } catch (err) {
            console.warn('Using offline mock for exam submissions:', err)
        }

        return {
            data: mockOrders,
            meta: { page: 1, limit: 10, total: mockOrders.length, totalPages: 1 },
        }
    },
    create: async (payload: Omit<Order, 'id'>) => {
        await new Promise((r) => setTimeout(r, 500))
        const newOrder: Order = { id: Date.now(), ...payload }
        mockOrders = [...mockOrders, newOrder]
        return { data: newOrder }
    },
    update: async (id: number, payload: Partial<Order>) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockOrders.findIndex((o) => o.id === id)
        if (index !== -1) {
            mockOrders[index] = { ...mockOrders[index], ...payload }
        }
        return { data: mockOrders[index] }
    },
    delete: async (id: number) => {
        await new Promise((r) => setTimeout(r, 500))
        mockOrders = mockOrders.filter((o) => o.id !== id)
    },
    bulkDelete: async (ids: number[]) => {
        await new Promise((r) => setTimeout(r, 400))
        mockOrders = mockOrders.filter((o) => !ids.includes(o.id))
    },
    bulkUpdateStatus: async (ids: number[], status: Order['status']) => {
        await new Promise((r) => setTimeout(r, 400))
        mockOrders = mockOrders.map((o) => (ids.includes(o.id) ? { ...o, status } : o))
    },
}

// Synchronous exports for direct access (used by routes)
export const ORDERS = mockOrders

export function getOrderById(id: number): Order | undefined {
    return mockOrders.find((o) => o.id === id)
}

export function createOrder(data: Omit<Order, 'id'>): Order {
    const newOrder = { id: Date.now(), ...data }
    mockOrders = [...mockOrders, newOrder]
    return newOrder
}

export function updateOrder(id: number, data: Partial<Order>): Order | undefined {
    const index = mockOrders.findIndex((o) => o.id === id)
    if (index !== -1) {
        mockOrders[index] = { ...mockOrders[index], ...data }
        return mockOrders[index]
    }
    return undefined
}

export function deleteOrder(id: number): boolean {
    const initialLength = mockOrders.length
    mockOrders = mockOrders.filter((o) => o.id !== id)
    return mockOrders.length !== initialLength
}

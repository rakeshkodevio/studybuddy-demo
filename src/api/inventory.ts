import type { Inventory } from '@/types/inventory'
import { studyBuddyApi } from './studybuddy'

let mockInventory: Inventory[] = [
    {
        id: 1,
        name: 'HSC 2026 Physics Paper 1: Vector & Dynamics Mock #08',
        sku: 'MT-PHY-08',
        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=120&auto=format&fit=crop&q=80',
        category: 'HSC Science',
        unitPrice: 25,
        availableStock: 3840,
        processing: 180,
        shipped: 3660,
        totalStock: 5000,
        status: 'In stock',
    },
    {
        id: 2,
        name: 'BUET Engineering Math Blitz: Calculus & Conics 04',
        sku: 'BUET-MTH-04',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=120&auto=format&fit=crop&q=80',
        category: 'Engineering',
        unitPrice: 20,
        availableStock: 2150,
        processing: 120,
        shipped: 2030,
        totalStock: 3000,
        status: 'In stock',
    },
    {
        id: 3,
        name: 'Medical Admission Marathon: Zoology & Botany 12',
        sku: 'MED-BIO-12',
        image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=120&auto=format&fit=crop&q=80',
        category: 'Medical',
        unitPrice: 100,
        availableStock: 4890,
        processing: 240,
        shipped: 4650,
        totalStock: 5000,
        status: 'Low Stock',
    },
    {
        id: 4,
        name: 'HSC Chemistry Paper 2: Organic Chemistry Mastery #05',
        sku: 'HSC-CHM-05',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=120&auto=format&fit=crop&q=80',
        category: 'HSC Science',
        unitPrice: 25,
        availableStock: 2980,
        processing: 90,
        shipped: 2890,
        totalStock: 4000,
        status: 'In stock',
    },
    {
        id: 5,
        name: 'Dhaka University Ka-Unit Comprehensive Mock #01',
        sku: 'DU-KA-01',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=120&auto=format&fit=crop&q=80',
        category: 'Varsity A-Unit',
        unitPrice: 60,
        availableStock: 3410,
        processing: 150,
        shipped: 3260,
        totalStock: 4000,
        status: 'In stock',
    },
    {
        id: 6,
        name: 'ICT Board Standard Full Length Practice Test #02',
        sku: 'ICT-STD-02',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
        category: 'HSC Science',
        unitPrice: 25,
        availableStock: 1850,
        processing: 60,
        shipped: 1790,
        totalStock: 2500,
        status: 'In stock',
    },
]

export const inventoryApi = {
    list: async (params?: Record<string, string | number | boolean | undefined>) => {
        try {
            const liveExams = await studyBuddyApi.exams.list({
                search: typeof params?.search === 'string' ? params.search : undefined,
                limit: 50,
            })
            if (Array.isArray(liveExams) && liveExams.length > 0) {
                const mapped: Inventory[] = liveExams.map((e: any, idx: number) => ({
                    id: idx + 1,
                    name: e.title,
                    sku: e.unitId ? String(e.unitId).toUpperCase() : `EXAM-${e.examYear || 2026}`,
                    image: e.unitId?.includes('a')
                        ? 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=120&auto=format&fit=crop&q=80'
                        : e.unitId?.includes('b')
                          ? 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=120&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=120&auto=format&fit=crop&q=80',
                    category: e.institutionName || 'Dhaka University',
                    unitPrice: e.totalQuestionsCount || 90,
                    availableStock: 2500 + (e.examYear || 2026),
                    processing: 120,
                    shipped: 2380,
                    totalStock: 3000,
                    status: e.isPublished ? 'In stock' : 'Low Stock',
                }))
                return {
                    data: mapped,
                    meta: { page: 1, limit: mapped.length, total: mapped.length, totalPages: 1 },
                }
            }
        } catch (err) {
            console.warn('Using offline mock for exams:', err)
        }

        return {
            data: mockInventory,
            meta: { page: 1, limit: 10, total: mockInventory.length, totalPages: 1 },
        }
    },
    create: async (payload: Omit<Inventory, 'id'>) => {
        const newInventory: Inventory = { id: Date.now(), ...payload }
        mockInventory = [...mockInventory, newInventory]
        return { data: newInventory }
    },
    update: async (id: number, payload: Partial<Inventory>) => {
        const index = mockInventory.findIndex((i) => i.id === id)
        if (index !== -1) {
            mockInventory[index] = { ...mockInventory[index], ...payload }
        }
        return { data: mockInventory[index] }
    },
    delete: async (id: number) => {
        mockInventory = mockInventory.filter((i) => i.id !== id)
    },
}

// Synchronous exports for direct access (used by routes)
export const INVENTORY = mockInventory

export function getInventoryById(id: number): Inventory | undefined {
    return mockInventory.find((i) => i.id === id)
}

export function createInventory(data: Omit<Inventory, 'id'>): Inventory {
    const newInventory = { id: Date.now(), ...data }
    mockInventory = [...mockInventory, newInventory]
    return newInventory
}

export function updateInventory(id: number, data: Partial<Inventory>): Inventory | undefined {
    const index = mockInventory.findIndex((i) => i.id === id)
    if (index !== -1) {
        mockInventory[index] = { ...mockInventory[index], ...data }
        return mockInventory[index]
    }
    return undefined
}

export function deleteInventory(id: number): boolean {
    const initialLength = mockInventory.length
    mockInventory = mockInventory.filter((i) => i.id !== id)
    return mockInventory.length !== initialLength
}

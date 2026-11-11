import type { Category } from '@/types/category'
import { studyBuddyApi } from './studybuddy'

let mockCategories: Category[] = [
    { id: 1, name: 'Physics (পদার্থবিজ্ঞান 1st & 2nd)', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=120&auto=format&fit=crop&q=80', productCount: 24500, status: 'Active' },
    { id: 2, name: 'Chemistry (রসায়ন 1st & 2nd)', image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=120&auto=format&fit=crop&q=80', productCount: 21800, status: 'Active' },
    { id: 3, name: 'Higher Math (উচ্চতর গণিত)', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=120&auto=format&fit=crop&q=80', productCount: 19200, status: 'Active' },
    { id: 4, name: 'Biology (জীববিজ্ঞান 1st & 2nd)', image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=120&auto=format&fit=crop&q=80', productCount: 26000, status: 'Active' },
    { id: 5, name: 'ICT (তথ্য ও যোগাযোগ প্রযুক্তি)', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80', productCount: 8500, status: 'Active' },
    { id: 6, name: 'Bangla & English (বাংলা ও ইংরেজি)', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=120&auto=format&fit=crop&q=80', productCount: 16400, status: 'Active' },
    { id: 7, name: 'BCS & General Knowledge (বিসিএস প্রস্তুতি)', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=120&auto=format&fit=crop&q=80', productCount: 32000, status: 'Active' },
]

export const categoryApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        try {
            const [institutions, gradesData] = await Promise.allSettled([
                studyBuddyApi.exams.institutions(),
                studyBuddyApi.grades.list(),
            ])

            const liveCategories: Category[] = []

            // 1. Process Grades (Class 9, 10, 11, 12)
            if (gradesData.status === 'fulfilled') {
                const grades = Array.isArray(gradesData.value?.data)
                    ? gradesData.value.data
                    : Array.isArray(gradesData.value)
                      ? gradesData.value
                      : []

                grades.forEach((g: any, idx: number) => {
                    liveCategories.push({
                        id: 50 + idx + 1,
                        name: `${g.name} (${g.code}) - ${g.description || 'Academic Syllabus'}`,
                        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=120&auto=format&fit=crop&q=80',
                        productCount: (g.order || 9) * 2200,
                        status: g.isActive ? 'Active' : 'Inactive',
                    })
                })
            }

            // 2. Process University Units (Dhaka University, etc.)
            if (institutions.status === 'fulfilled') {
                const du = Array.isArray(institutions.value) ? institutions.value.find((i: any) => i.id === 'du') : null
                if (du && Array.isArray(du.units)) {
                    du.units.forEach((u: any, idx: number) => {
                        liveCategories.push({
                            id: 10 + idx + 1,
                            name: `${du.shortName} ${u.title}`,
                            image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=120&auto=format&fit=crop&q=80',
                            productCount: 15000 + idx * 3000,
                            status: 'Active' as const,
                        })
                    })
                }
            }

            if (liveCategories.length > 0) {
                const combined = [...mockCategories, ...liveCategories]
                return {
                    data: combined,
                    meta: { page: 1, limit: combined.length, total: combined.length, totalPages: 1 },
                }
            }
        } catch (err) {
            console.warn('Using offline mock for categories:', err)
        }

        return {
            data: mockCategories,
            meta: { page: 1, limit: 10, total: mockCategories.length, totalPages: 1 },
        }
    },
    create: async (payload: Omit<Category, 'id'>) => {
        await new Promise((r) => setTimeout(r, 500))
        const newCategory: Category = { id: Date.now(), ...payload }
        mockCategories = [...mockCategories, newCategory]
        return { data: newCategory }
    },
    update: async (id: number, payload: Partial<Category>) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockCategories.findIndex((c) => c.id === id)
        if (index !== -1) {
            mockCategories[index] = { ...mockCategories[index], ...payload }
        }
        return { data: mockCategories[index] }
    },
    delete: async (id: number) => {
        await new Promise((r) => setTimeout(r, 500))
        mockCategories = mockCategories.filter((c) => c.id !== id)
    },
    bulkDelete: async (ids: number[]) => {
        await new Promise((r) => setTimeout(r, 400))
        mockCategories = mockCategories.filter((c) => !ids.includes(c.id))
    },
    bulkUpdateStatus: async (ids: number[], status: Category['status']) => {
        await new Promise((r) => setTimeout(r, 400))
        mockCategories = mockCategories.map((c) => (ids.includes(c.id) ? { ...c, status } : c))
    },
}

// Synchronous exports for direct access (used by routes)
export const CATEGORIES = mockCategories

export function getCategoryById(id: number): Category | undefined {
    return mockCategories.find((c) => c.id === id)
}

export function createCategory(data: Omit<Category, 'id'>): Category {
    const newCategory = { id: Date.now(), ...data }
    mockCategories = [...mockCategories, newCategory]
    return newCategory
}

export function updateCategory(id: number, data: Partial<Category>): Category | undefined {
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...data }
        return mockCategories[index]
    }
    return undefined
}

export function deleteCategory(id: number): boolean {
    const initialLength = mockCategories.length
    mockCategories = mockCategories.filter((c) => c.id !== id)
    return mockCategories.length !== initialLength
}

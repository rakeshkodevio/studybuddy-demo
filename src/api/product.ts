import type { Product } from '@/types/product'
import { studyBuddyApi } from './studybuddy'

let mockProducts: Product[] = [
    {
        id: 1,
        title: 'যদি দুটি ভেক্টর A = 2i + 2j এবং B = -i + j হয়, তবে তাদের মধ্যবর্তী কোণ কত?',
        image: 'https://placehold.co/80x80/007a48/ffffff?text=PHY',
        sku: 'PHY-VEC-01',
        category: 'Physics',
        price: 1,
        status: 'Active',
    },
    {
        id: 2,
        title: 'নিচের কোন মৌলটির প্রথম আয়নীকরণ শক্তি (First Ionization Energy) সর্বাধিক?',
        image: 'https://placehold.co/80x80/0d9488/ffffff?text=CHE',
        sku: 'CHE-PER-05',
        category: 'Chemistry',
        price: 1,
        status: 'Active',
    },
    {
        id: 3,
        title: 'lim (x → 0) [sin(3x) / x] এর মান নিচের কোনটি?',
        image: 'https://placehold.co/80x80/0284c7/ffffff?text=MTH',
        sku: 'MTH-CAL-09',
        category: 'Higher Math',
        price: 1,
        status: 'Active',
    },
    {
        id: 4,
        title: 'প্রোটিন সংশ্লেষণের প্রধান স্থান (Protein Factory) কোষের কোন অঙ্গাণু?',
        image: 'https://placehold.co/80x80/16a34a/ffffff?text=BIO',
        sku: 'BIO-CEL-12',
        category: 'Biology',
        price: 1,
        status: 'Active',
    },
    {
        id: 5,
        title: 'ঘূর্ণন গতিশীল বস্তুর জড়তার ভ্রামক I এবং কৌণিক বেগ ω হলে গতিশক্তি কত?',
        image: 'https://placehold.co/80x80/007a48/ffffff?text=PHY',
        sku: 'PHY-ROT-07',
        category: 'Physics',
        price: 1,
        status: 'Active',
    },
    {
        id: 6,
        title: 'নিচের কোন যৌগটি ফেলিং দ্রবণ ও টলেন বিকারকের সাথে বিজারণ বিক্রিয়া দেয়?',
        image: 'https://placehold.co/80x80/0d9488/ffffff?text=CHE',
        sku: 'CHE-ORG-14',
        category: 'Chemistry',
        price: 1,
        status: 'Active',
    },
    {
        id: 7,
        title: 'অষ্টক সংখ্যা পদ্ধতি (Octal System) এর ভিত্তি বা বেস কত?',
        image: 'https://placehold.co/80x80/d97706/ffffff?text=ICT',
        sku: 'ICT-NUM-03',
        category: 'ICT',
        price: 1,
        status: 'Active',
    },
    {
        id: 8,
        title: 'y = e^(3x) বক্ররেখার x = 0 বিন্দুতে স্পর্শকের ঢাল কত?',
        image: 'https://placehold.co/80x80/0284c7/ffffff?text=MTH',
        sku: 'MTH-CAL-18',
        category: 'Higher Math',
        price: 1,
        status: 'Low Stock',
    },
    {
        id: 9,
        title: 'মানুষের রক্তে প্রধান বাফার সিস্টেম কোনটি?',
        image: 'https://placehold.co/80x80/16a34a/ffffff?text=BIO',
        sku: 'BIO-CIR-04',
        category: 'Biology',
        price: 1,
        status: 'Active',
    },
    {
        id: 10,
        title: 'একটি প্রক্ষেপকের সর্বোচ্চ পাল্লা R_max = v² / g কোন নিক্ষেপণ কোণে ঘটে?',
        image: 'https://placehold.co/80x80/007a48/ffffff?text=PHY',
        sku: 'PHY-PRO-11',
        category: 'Physics',
        price: 1,
        status: 'Active',
    },
]

export const productApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        try {
            const liveQuestions = await studyBuddyApi.exams.questions({ examId: 'HKtUZhw2DU1cm3xV' })
            if (Array.isArray(liveQuestions) && liveQuestions.length > 0) {
                const mapped: Product[] = liveQuestions.map((q: any, idx: number) => ({
                    id: idx + 1,
                    title: q.text,
                    image:
                        q.sectionName === 'Chemistry'
                            ? 'https://placehold.co/80x80/0d9488/ffffff?text=CHE'
                            : q.sectionName === 'Higher Mathematics'
                              ? 'https://placehold.co/80x80/0284c7/ffffff?text=MTH'
                              : q.sectionName === 'Biology'
                                ? 'https://placehold.co/80x80/16a34a/ffffff?text=BIO'
                                : q.sectionName === 'Bangla'
                                  ? 'https://placehold.co/80x80/8b5cf6/ffffff?text=BAN'
                                  : q.sectionName === 'English'
                                    ? 'https://placehold.co/80x80/ec4899/ffffff?text=ENG'
                                    : 'https://placehold.co/80x80/007a48/ffffff?text=PHY',
                    sku: q.id || `Q-${idx + 1}`,
                    category: q.sectionName || 'Physics',
                    price: q.points || 1,
                    status: 'Active',
                }))
                return {
                    data: mapped,
                    meta: { page: 1, limit: mapped.length, total: mapped.length, totalPages: 1 },
                }
            }
        } catch (err) {
            console.warn('Using offline mock for questions:', err)
        }

        return {
            data: mockProducts,
            meta: { page: 1, limit: 10, total: mockProducts.length, totalPages: 1 },
        }
    },
    create: async (payload: Omit<Product, 'id'>) => {
        await new Promise((r) => setTimeout(r, 500))
        const newProduct: Product = { id: Date.now(), ...payload }
        mockProducts = [...mockProducts, newProduct]
        return { data: newProduct }
    },
    update: async (id: number, payload: Partial<Product>) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockProducts.findIndex((p) => p.id === id)
        if (index !== -1) {
            mockProducts[index] = { ...mockProducts[index], ...payload }
        }
        return { data: mockProducts[index] }
    },
    delete: async (id: number) => {
        await new Promise((r) => setTimeout(r, 500))
        mockProducts = mockProducts.filter((p) => p.id !== id)
    },
    bulkDelete: async (ids: number[]) => {
        await new Promise((r) => setTimeout(r, 400))
        mockProducts = mockProducts.filter((p) => !ids.includes(p.id))
    },
    bulkUpdateStatus: async (ids: number[], status: Product['status']) => {
        await new Promise((r) => setTimeout(r, 400))
        mockProducts = mockProducts.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
    },
}

// Synchronous exports for direct access (used by routes)
export const PRODUCTS = mockProducts

export function getProductById(id: number): Product | undefined {
    return mockProducts.find((p) => p.id === id)
}

export function createProduct(data: Omit<Product, 'id'>): Product {
    const newProduct = { id: Date.now(), ...data }
    mockProducts = [...mockProducts, newProduct]
    return newProduct
}

export function updateProduct(id: number, data: Partial<Product>): Product | undefined {
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...data }
        return mockProducts[index]
    }
    return undefined
}

export function deleteProduct(id: number): boolean {
    const initialLength = mockProducts.length
    mockProducts = mockProducts.filter((p) => p.id !== id)
    return mockProducts.length !== initialLength
}

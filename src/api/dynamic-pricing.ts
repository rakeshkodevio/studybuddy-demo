import type { DynamicPricing } from '@/types/dynamic-pricing'

let mockDynamicPricing: DynamicPricing[] = [
    {
        id: 1,
        productName: 'Classic White t-shirt',
        sku: 'TS001',
        image: 'https://placehold.co/80x80/f3f4f6/666666?text=TS',
        dynamicName: 'Flash Discount',
        startDate: '2026-07-24',
        basePrice: 200,
        adjustment: 50,
        calculatedPrice: 100,
        status: 'Active',
    },
    {
        id: 2,
        productName: 'Classic White t-shirt',
        sku: 'TS001',
        image: 'https://placehold.co/80x80/f3f4f6/666666?text=TS',
        dynamicName: 'Clearance Sale',
        startDate: '2026-07-24',
        basePrice: 200,
        adjustment: 50,
        calculatedPrice: 100,
        status: 'Active',
    },
    {
        id: 3,
        productName: 'Classic White t-shirt',
        sku: 'TS001',
        image: 'https://placehold.co/80x80/f3f4f6/666666?text=TS',
        dynamicName: 'Flash Discount',
        startDate: '2026-07-24',
        basePrice: 200,
        adjustment: 50,
        calculatedPrice: 100,
        status: 'Active',
    },
    {
        id: 4,
        productName: 'Classic White t-shirt',
        sku: 'TS001',
        image: 'https://placehold.co/80x80/f3f4f6/666666?text=TS',
        dynamicName: 'Clearance Sale',
        startDate: '2026-07-24',
        basePrice: 200,
        adjustment: 50,
        calculatedPrice: 100,
        status: 'Inactive',
    },
    {
        id: 5,
        productName: 'Classic White t-shirt',
        sku: 'TS001',
        image: 'https://placehold.co/80x80/f3f4f6/666666?text=TS',
        dynamicName: 'Flash Discount',
        startDate: '2026-07-24',
        basePrice: 200,
        adjustment: 50,
        calculatedPrice: 100,
        status: 'Active',
    },
    {
        id: 6,
        productName: 'Classic White t-shirt',
        sku: 'TS001',
        image: 'https://placehold.co/80x80/f3f4f6/666666?text=TS',
        dynamicName: 'Clearance Sale',
        startDate: '2026-07-24',
        basePrice: 200,
        adjustment: 50,
        calculatedPrice: 100,
        status: 'Active',
    },
]

export const dynamicPricingApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockDynamicPricing,
            meta: { page: 1, limit: 10, total: mockDynamicPricing.length, totalPages: 1 },
        }
    },
    create: async (payload: Omit<DynamicPricing, 'id'>) => {
        await new Promise((r) => setTimeout(r, 500))
        const newDynamicPricing: DynamicPricing = { id: Date.now(), ...payload }
        mockDynamicPricing = [...mockDynamicPricing, newDynamicPricing]
        return { data: newDynamicPricing }
    },
    update: async (id: number, payload: Partial<DynamicPricing>) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockDynamicPricing.findIndex((d) => d.id === id)
        if (index !== -1) {
            mockDynamicPricing[index] = { ...mockDynamicPricing[index], ...payload }
        }
        return { data: mockDynamicPricing[index] }
    },
    delete: async (id: number) => {
        await new Promise((r) => setTimeout(r, 500))
        mockDynamicPricing = mockDynamicPricing.filter((d) => d.id !== id)
    },
}

// Synchronous exports for direct access (used by routes)
export const DYNAMIC_PRICING = mockDynamicPricing

export function getDynamicPricingById(id: number): DynamicPricing | undefined {
    return mockDynamicPricing.find((d) => d.id === id)
}

export function createDynamicPricing(data: Omit<DynamicPricing, 'id'>): DynamicPricing {
    const newDynamicPricing = { id: Date.now(), ...data }
    mockDynamicPricing = [...mockDynamicPricing, newDynamicPricing]
    return newDynamicPricing
}

export function updateDynamicPricing(id: number, data: Partial<DynamicPricing>): DynamicPricing | undefined {
    const index = mockDynamicPricing.findIndex((d) => d.id === id)
    if (index !== -1) {
        mockDynamicPricing[index] = { ...mockDynamicPricing[index], ...data }
        return mockDynamicPricing[index]
    }
    return undefined
}

export function deleteDynamicPricing(id: number): boolean {
    const initialLength = mockDynamicPricing.length
    mockDynamicPricing = mockDynamicPricing.filter((d) => d.id !== id)
    return mockDynamicPricing.length !== initialLength
}

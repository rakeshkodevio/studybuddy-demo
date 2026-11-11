export type DynamicPricingStatus = 'Active' | 'Inactive'

export type DynamicPricing = {
    id: number
    productName: string
    sku: string
    image: string
    dynamicName: string
    startDate: string
    basePrice: number
    adjustment: number
    calculatedPrice: number
    status: DynamicPricingStatus
}

export type RevenueMetric = {
    month: string
    revenue: number
}

export type ProductSalesMetric = {
    product: string
    sold: number
    revenue: number
}

export type ReportOverview = {
    revenue: RevenueMetric[]
    productSales: ProductSalesMetric[]
    customers: {
        newCustomers: number
        returningCustomers: number
        repeatPurchaseRate: number
        averageOrderValue: number
    }
    inventory: {
        available: number
        lowStock: number
        outOfStock: number
    }
}

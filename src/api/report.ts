import type { ReportOverview } from '@/types/report'

const reportOverview: ReportOverview = {
    revenue: [
        { month: 'Jan', revenue: 18_000 },
        { month: 'Feb', revenue: 22_500 },
        { month: 'Mar', revenue: 28_000 },
        { month: 'Apr', revenue: 34_200 },
        { month: 'May', revenue: 39_500 },
        { month: 'Jun', revenue: 44_250 },
        { month: 'Jul', revenue: 50_000 },
    ],
    productSales: [
        { product: 'Classic White T-shirt', sold: 420, revenue: 12_600 },
        { product: 'Performance Training Top', sold: 318, revenue: 10_176 },
        { product: 'AZ Sports Hoodie', sold: 246, revenue: 14_760 },
        { product: 'Running Shorts', sold: 221, revenue: 7_735 },
    ],
    customers: {
        newCustomers: 450,
        returningCustomers: 1_240,
        repeatPurchaseRate: 68.4,
        averageOrderValue: 87.5,
    },
    inventory: {
        available: 580,
        lowStock: 18,
        outOfStock: 6,
    },
}

export const reportApi = {
    overview: async (): Promise<ReportOverview> => {
        await new Promise((resolve) => setTimeout(resolve, 350))
        return reportOverview
    },
}

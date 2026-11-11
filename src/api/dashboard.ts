import { ORDERS } from '@/api/order'
import type { DashboardOverview } from '@/types/dashboard'

const dashboardOverview: DashboardOverview = {
    summary: {
        totalUsers: 12_543,
        totalSales: 50_000,
        totalRevenue: 50_000,
        totalOrders: 10_000,
    },
    recentOrders: ORDERS.slice(0, 4),
    orderStatuses: [
        { status: 'Delivered', value: 34 },
        { status: 'Pending', value: 18 },
        { status: 'Processing', value: 24 },
        { status: 'Returned', value: 17 },
        { status: 'Canceled', value: 7 },
    ],
    sales: [
        { month: 'Jan', value: 0 },
        { month: 'Feb', value: 3_000 },
        { month: 'Mar', value: 8_000 },
        { month: 'Apr', value: 13_000 },
        { month: 'May', value: 17_000 },
        { month: 'Jun', value: 21_000 },
        { month: 'Jul', value: 25_000 },
    ],
}

export const dashboardApi = {
    overview: async (): Promise<DashboardOverview> => {
        await new Promise((resolve) => setTimeout(resolve, 350))
        return dashboardOverview
    },
}

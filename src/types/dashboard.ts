import type { Order } from '@/types/order'

export type DashboardSummary = {
    totalUsers: number
    totalSales: number
    totalRevenue: number
    totalOrders: number
}

export type OrderStatusMetric = {
    status: 'Delivered' | 'Pending' | 'Processing' | 'Returned' | 'Canceled'
    value: number
}

export type SalesMetric = {
    month: string
    value: number
}

export type DashboardOverview = {
    summary: DashboardSummary
    recentOrders: Order[]
    orderStatuses: OrderStatusMetric[]
    sales: SalesMetric[]
}

import type { NotificationCampaign } from '@/types/notification'

const mockNotifications: NotificationCampaign[] = [
    { id: '1', title: 'Your order has shipped', audience: 'Recent Customers', date: '2026-08-04', delivered: '2,840', opened: '2,316' },
    { id: '2', title: 'Weekend sportswear sale', audience: 'All Customers', date: '2026-08-03', delivered: '8,456', opened: '5,962' },
    { id: '3', title: 'Back-in-stock alert', audience: 'Waitlist Customers', date: '2026-08-02', delivered: '1,248', opened: '986' },
    { id: '4', title: 'New training collection', audience: 'Active Customers', date: '2026-08-01', delivered: '6,320', opened: '4,108' },
    { id: '5', title: 'Welcome to AZ Sports', audience: 'New Customers', date: '2026-07-31', delivered: '542', opened: '438' },
    { id: '6', title: 'Complete your checkout', audience: 'Abandoned Carts', date: '2026-07-30', delivered: '784', opened: '503' },
]

export const notificationApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockNotifications,
            meta: { page: 1, limit: 10, total: mockNotifications.length, totalPages: 1 },
        }
    },
}

// Synchronous exports for direct access (used by routes)
export function getNotifications(): NotificationCampaign[] {
    return mockNotifications
}

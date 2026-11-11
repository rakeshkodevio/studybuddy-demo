import type { SupportTicket } from '@/types/support'

const mockTickets: SupportTicket[] = [
    {
        id: '#1024',
        user: 'Sarah Johnson',
        issue: 'Timer not working correctly',
        date: '2024-03-15',
        status: 'Open',
    },
    {
        id: '#1025',
        user: 'Emma Wilson',
        issue: 'Premium purchase not activating',
        date: '2024-03-15',
        status: 'Pending',
    },
    {
        id: '#1026',
        user: 'Olivia Brown',
        issue: 'App crashed during session',
        date: '2024-03-15',
        status: 'Resolved',
    },
    {
        id: '#1027',
        user: 'Ava Martinez',
        issue: 'Cannot export session data',
        date: '2024-03-15',
        status: 'Open',
    },
    {
        id: '#1028',
        user: 'Sophia Davis',
        issue: 'Notification settings not saving',
        date: '2024-03-15',
        status: 'Resolved',
    },
    {
        id: '#1029',
        user: 'Mia Rodriguez',
        issue: 'Order payment failed',
        date: '2024-03-15',
        status: 'Pending',
    },
]

export const supportApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockTickets,
            meta: { page: 1, limit: 10, total: mockTickets.length, totalPages: 1 },
        }
    },
}

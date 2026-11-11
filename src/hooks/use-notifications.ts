import { useQuery } from '@tanstack/react-query'
import { notificationApi } from '@/api/notifications'

const QUERY_KEY = ['notifications']

/**
 * Hook to fetch all notifications
 */
export function useNotifications() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => notificationApi.list(),
    })
}

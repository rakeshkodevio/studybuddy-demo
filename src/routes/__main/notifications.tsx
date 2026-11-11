import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { notificationApi } from '@/api/notifications'
import { NotificationsUI } from '@/components/features/notifications'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/__main/notifications')({
    component: RouteComponent,
})

function RouteComponent() {
    const [searchQuery, setSearchQuery] = useState('')

    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => notificationApi.list(),
    })
    const data = response?.data ?? []

    const notifications = useMemo(() => {
        if (!searchQuery.trim()) return data
        const query = searchQuery.toLowerCase()
        return data.filter((item) => item.title.toLowerCase().includes(query) || item.audience.toLowerCase().includes(query))
    }, [data, searchQuery])

    return (
        <NotificationsUI
            notifications={notifications}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isLoading={isLoading || isFetching}
        />
    )
}

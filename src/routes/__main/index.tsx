import { createFileRoute } from '@tanstack/react-router'
import { dashboardApi } from '@/api/dashboard'
import { DashboardUI } from '@/components/features/dashboard'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/__main/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: overview, isLoading, isFetching } = useQuery({
        queryKey: ['dashboard', 'overview'],
        queryFn: () => dashboardApi.overview(),
    })

    return <DashboardUI overview={overview} isLoading={isLoading || isFetching} />
}

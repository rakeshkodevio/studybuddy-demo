import { createFileRoute } from '@tanstack/react-router'
import { reportApi } from '@/api/report'
import { ReportsUI } from '@/components/features/reports'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/__main/reports')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: overview, isLoading, isFetching } = useQuery({
        queryKey: ['reports', 'overview'],
        queryFn: () => reportApi.overview(),
    })

    return <ReportsUI overview={overview} isLoading={isLoading || isFetching} />
}

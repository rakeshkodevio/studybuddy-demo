import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { orderApi } from '@/api/order'
import { OrdersUI } from '@/components/features/orders'
import type { orderSchema } from '@/components/features/orders'
import { useSearchParams } from '@/hooks/use-search-params'
import { applyFilters, applySearch, paginate } from '@/lib/apply-filters'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { FilterState } from '@/components/shared/searching'
import * as z from 'zod'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
    filters: z.string().catch('[]').optional(),
})

export const Route = createFileRoute('/__main/orders')({
    component: RouteComponent,
    validateSearch: searchSchema,
})

function RouteComponent() {
    const queryClient = useQueryClient()

    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['orders'],
        queryFn: () => orderApi.list(),
    })
    const orders = response?.data ?? []

    const search = Route.useSearch()
    const mergeSearch = useSearchParams()

    const page = search.page ?? 1
    const limit = search.limit ?? 10
    const searchQuery = search.q ?? ''
    const filters: FilterState[] = useMemo(() => {
        try {
            return JSON.parse(search.filters ?? '[]')
        } catch {
            return []
        }
    }, [search.filters])

    const setQuery = (q: string) => mergeSearch({ q, page: 1 })
    const setFilters = (newFilters: FilterState[]) => mergeSearch({ filters: JSON.stringify(newFilters), page: 1 })
    const resetSearch = () => mergeSearch({ q: '', filters: '[]', page: 1 })

    const saveMutation = useMutation({
        mutationFn: async ({ id, values }: { id: number | null; values: z.infer<typeof orderSchema> }) => {
            return id === null ? orderApi.create(values) : orderApi.update(id, values)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => orderApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => orderApi.bulkDelete(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })

    const bulkStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: z.infer<typeof orderSchema>['status'] }) =>
            orderApi.bulkUpdateStatus(ids, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })

    const handleSaveOrder = (id: number | null, values: z.infer<typeof orderSchema>) => {
        saveMutation.mutate({ id, values })
    }

    const handleDeleteOrder = (id: number) => {
        deleteMutation.mutate(id)
    }

    const handleBulkDelete = (ids: string[]) => {
        bulkDeleteMutation.mutate(ids.map(Number))
    }

    const handleBulkStatusChange = (ids: string[], status: string) => {
        bulkStatusMutation.mutate({ ids: ids.map(Number), status: status as z.infer<typeof orderSchema>['status'] })
    }

    const filteredOrders = useMemo(() => {
        let result = applySearch(orders, searchQuery, ['userName', 'email', 'orderDate', 'status', 'paymentStatus'])
        result = applyFilters(result, filters, (order, fieldId) => order[fieldId as keyof typeof order])
        return result
    }, [orders, searchQuery, filters])

    const paginatedOrders = useMemo(() => paginate(filteredOrders, page, limit), [filteredOrders, page, limit])

    return (
        <OrdersUI
            orders={paginatedOrders}
            totalOrders={filteredOrders.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onResetSearch={resetSearch}
            onSaveOrder={handleSaveOrder}
            onDeleteOrder={handleDeleteOrder}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
            isLoading={isLoading || isFetching}
        />
    )
}

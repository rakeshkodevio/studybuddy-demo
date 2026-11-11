import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { inventoryApi } from '@/api/inventory'
import { InventoryUI } from '@/components/features/inventory'
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

export const Route = createFileRoute('/__main/inventory')({
    component: RouteComponent,
    validateSearch: searchSchema,
})

function RouteComponent() {
    const queryClient = useQueryClient()

    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['inventory'],
        queryFn: () => inventoryApi.list(),
    })
    const inventory = response?.data ?? []

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

    const restockMutation = useMutation({
        mutationFn: (id: number) => inventoryApi.update(id, { availableStock: 200 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] })
        },
    })

    const handleRestock = (id: number) => {
        restockMutation.mutate(id)
    }

    const handleExport = () => {
        // In a real app, this would export the data
        console.log('Exporting inventory data...')
    }

    const filteredInventory = useMemo(() => {
        let result = applySearch(inventory, searchQuery, ['name', 'sku', 'category', 'status'])
        result = applyFilters(result, filters, (item, fieldId) => item[fieldId as keyof typeof item])
        return result
    }, [inventory, searchQuery, filters])

    const paginatedInventory = useMemo(() => paginate(filteredInventory, page, limit), [filteredInventory, page, limit])

    return (
        <InventoryUI
            inventory={paginatedInventory}
            totalInventory={filteredInventory.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onResetSearch={resetSearch}
            onRestock={handleRestock}
            onExport={handleExport}
            isLoading={isLoading || isFetching}
        />
    )
}

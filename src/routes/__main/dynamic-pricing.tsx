import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as z from 'zod'
import { dynamicPricingApi } from '@/api/dynamic-pricing'
import { DynamicPricingUI } from '@/components/features/dynamic-pricing'
import type { dynamicPricingSchema } from '@/components/features/dynamic-pricing'
import type { FilterState } from '@/components/shared/searching'
import { useSearchParams } from '@/hooks/use-search-params'
import { applyFilters, applySearch, paginate } from '@/lib/apply-filters'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
    filters: z.string().catch('[]').optional(),
})

export const Route = createFileRoute('/__main/dynamic-pricing')({
    validateSearch: searchSchema,
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const search = Route.useSearch()
    const mergeSearch = useSearchParams()

    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['dynamic-pricing'],
        queryFn: () => dynamicPricingApi.list(),
    })

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
        mutationFn: ({ id, values }: { id: number | null; values: z.infer<typeof dynamicPricingSchema> }) =>
            id === null ? dynamicPricingApi.create(values) : dynamicPricingApi.update(id, values),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dynamic-pricing'] }),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => dynamicPricingApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dynamic-pricing'] }),
    })

    const filteredDynamicPricing = useMemo(() => {
        const list = response?.data ?? []
        let result = applySearch(list, searchQuery, ['productName', 'sku', 'dynamicName', 'status'])
        result = applyFilters(result, filters, (item, fieldId) => item[fieldId as keyof typeof item])
        return result
    }, [response?.data, searchQuery, filters])

    const paginatedDynamicPricing = useMemo(() => paginate(filteredDynamicPricing, page, limit), [filteredDynamicPricing, page, limit])

    return (
        <DynamicPricingUI
            dynamicPricing={paginatedDynamicPricing}
            totalDynamicPricing={filteredDynamicPricing.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onResetSearch={resetSearch}
            onSaveDynamicPricing={(id, values) => saveMutation.mutate({ id, values })}
            onDeleteDynamicPricing={(id) => deleteMutation.mutate(id)}
            isLoading={isLoading || isFetching}
        />
    )
}

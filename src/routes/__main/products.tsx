import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { productApi } from '@/api/product'
import { ProductsUI } from '@/components/features/products'
import type { productSchema } from '@/components/features/products'
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

export const Route = createFileRoute('/__main/products')({
    component: RouteComponent,
    validateSearch: searchSchema,
})

function RouteComponent() {
    const queryClient = useQueryClient()

    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['products'],
        queryFn: () => productApi.list(),
    })
    const products = response?.data ?? []

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
        mutationFn: async ({ id, values }: { id: number | null; values: z.infer<typeof productSchema> }) => {
            return id === null ? productApi.create(values) : productApi.update(id, values)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => productApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => productApi.bulkDelete(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const bulkStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: z.infer<typeof productSchema>['status'] }) =>
            productApi.bulkUpdateStatus(ids, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const handleSaveProduct = (id: number | null, values: z.infer<typeof productSchema>) => {
        saveMutation.mutate({ id, values })
    }

    const handleDeleteProduct = (id: number) => {
        deleteMutation.mutate(id)
    }

    const handleBulkDelete = (ids: string[]) => {
        bulkDeleteMutation.mutate(ids.map(Number))
    }

    const handleBulkStatusChange = (ids: string[], status: string) => {
        bulkStatusMutation.mutate({ ids: ids.map(Number), status: status as z.infer<typeof productSchema>['status'] })
    }

    const filteredProducts = useMemo(() => {
        let result = applySearch(products, searchQuery, ['title', 'sku', 'category', 'status'])
        result = applyFilters(result, filters, (product, fieldId) => product[fieldId as keyof typeof product])
        return result
    }, [products, searchQuery, filters])

    const paginatedProducts = useMemo(() => paginate(filteredProducts, page, limit), [filteredProducts, page, limit])

    return (
        <ProductsUI
            products={paginatedProducts}
            totalProducts={filteredProducts.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onResetSearch={resetSearch}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
            isLoading={isLoading || isFetching}
        />
    )
}

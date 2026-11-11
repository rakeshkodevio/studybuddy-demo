import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { categoryApi } from '@/api/category'
import { CategoriesUI } from '@/components/features/categories'
import type { categorySchema } from '@/components/features/categories'
import { useSearchParams } from '@/hooks/use-search-params'
import { applySearch, paginate } from '@/lib/apply-filters'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as z from 'zod'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
})

export const Route = createFileRoute('/__main/categories')({
    component: RouteComponent,
    validateSearch: searchSchema,
})

function RouteComponent() {
    const queryClient = useQueryClient()

    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.list(),
    })
    const categories = response?.data ?? []

    const search = Route.useSearch()
    const mergeSearch = useSearchParams()

    const page = search.page ?? 1
    const limit = search.limit ?? 10
    const searchQuery = search.q ?? ''

    const setQuery = (q: string) => mergeSearch({ q, page: 1 })
    const resetSearch = () => mergeSearch({ q: '', page: 1 })

    const saveMutation = useMutation({
        mutationFn: async ({ id, values }: { id: number | null; values: z.infer<typeof categorySchema> }) => {
            return id === null ? categoryApi.create(values) : categoryApi.update(id, values)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => categoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => categoryApi.bulkDelete(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })

    const bulkStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: z.infer<typeof categorySchema>['status'] }) =>
            categoryApi.bulkUpdateStatus(ids, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })

    const handleSaveCategory = (id: number | null, values: z.infer<typeof categorySchema>) => {
        saveMutation.mutate({ id, values })
    }

    const handleDeleteCategory = (id: number) => {
        deleteMutation.mutate(id)
    }

    const handleBulkDelete = (ids: string[]) => {
        bulkDeleteMutation.mutate(ids.map(Number))
    }

    const handleBulkStatusChange = (ids: string[], status: string) => {
        bulkStatusMutation.mutate({ ids: ids.map(Number), status: status as z.infer<typeof categorySchema>['status'] })
    }

    const filteredCategories = useMemo(() => {
        return applySearch(categories, searchQuery, ['name'])
    }, [categories, searchQuery])

    const paginatedCategories = useMemo(() => paginate(filteredCategories, page, limit), [filteredCategories, page, limit])

    return (
        <CategoriesUI
            categories={paginatedCategories}
            totalCategories={filteredCategories.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            onResetSearch={resetSearch}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
            isLoading={isLoading || isFetching}
        />
    )
}

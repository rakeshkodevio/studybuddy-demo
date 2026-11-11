import { useSearchParams } from '@/hooks/use-search-params'
import { createFileRoute } from '@tanstack/react-router'
import type { FilterState } from '@/components/shared/searching'
import { useMemo } from 'react'
import * as z from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/api/users'
import { UserManagementUI } from '@/components/features/user-management'
import { applyFilters, applySearch, paginate } from '@/lib/apply-filters'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
    filters: z.string().catch('[]').optional(),
})

export const Route = createFileRoute('/__main/user-management')({
    validateSearch: searchSchema,
    component: RouteComponent,
})

function RouteComponent() {
    // ----------------------------------------------------------------------
    // 1. DATA FETCHING & STATE MANAGEMENT (The "Container" responsibilities)
    // ----------------------------------------------------------------------
    const queryClient = useQueryClient()

    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['users'],
        queryFn: () => userApi.list(),
    })
    const users = response?.data ?? []
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

    // ----------------------------------------------------------------------
    // 2. DATA MUTATIONS (The "Container" responsibilities)
    // ----------------------------------------------------------------------
    const toggleStatusMutation = useMutation({
        mutationFn: (id: number) => userApi.toggleStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => userApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => userApi.bulkDelete(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const bulkStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 'Active' | 'Suspended' }) =>
            userApi.bulkUpdateStatus(ids, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const handleToggleStatus = (id: number) => {
        toggleStatusMutation.mutate(id)
    }

    const handleDeleteUser = (id: number) => {
        deleteMutation.mutate(id)
    }

    const handleBulkDelete = (ids: string[]) => {
        bulkDeleteMutation.mutate(ids.map(Number))
    }

    const handleBulkStatusChange = (ids: string[], status: string) => {
        bulkStatusMutation.mutate({ ids: ids.map(Number), status: status as 'Active' | 'Suspended' })
    }

    // ----------------------------------------------------------------------
    // 3. DATA PROCESSING (Filtering & Pagination)
    // ----------------------------------------------------------------------
    const filteredUsers = useMemo(() => {
        let result = applySearch(users, searchQuery, ['name', 'email', 'phone'])
        result = applyFilters(result, filters, (user, fieldId) => user[fieldId as keyof typeof user])
        return result
    }, [users, searchQuery, filters])

    const paginatedUsers = useMemo(() => paginate(filteredUsers, page, limit), [filteredUsers, page, limit])

    // ----------------------------------------------------------------------
    // 4. PRESENTATION (Rendering the extracted UI Component)
    // ----------------------------------------------------------------------
    return (
        <UserManagementUI
            users={paginatedUsers}
            totalUsers={filteredUsers.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onResetSearch={resetSearch}
            onToggleStatus={handleToggleStatus}
            onDeleteUser={handleDeleteUser}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
            isLoading={isLoading || isFetching}
        />
    )
}

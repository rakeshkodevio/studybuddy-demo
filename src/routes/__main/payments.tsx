import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { paymentApi } from '@/api/payments'
import { PaymentsUI } from '@/components/features/payments'
import { useSearchParams } from '@/hooks/use-search-params'
import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
})

export const Route = createFileRoute('/__main/payments')({
    component: RouteComponent,
    validateSearch: searchSchema,
})

function RouteComponent() {
    const { data: response, isLoading, isFetching } = useQuery({
        queryKey: ['payments'],
        queryFn: () => paymentApi.list(),
    })
    const payments = response?.data ?? []

    const search = Route.useSearch()
    const mergeSearch = useSearchParams()

    const page = search.page ?? 1
    const limit = search.limit ?? 10
    const searchQuery = search.q ?? ''

    const setQuery = (q: string) => mergeSearch({ q, page: 1 })
    const resetSearch = () => mergeSearch({ q: '', page: 1 })

    const filteredPayments = useMemo(() => {
        if (!searchQuery.trim()) return payments
        const query = searchQuery.toLowerCase()
        return payments.filter(
            (p) =>
                p.userName.toLowerCase().includes(query) ||
                p.item.toLowerCase().includes(query) ||
                String(p.orderId).includes(query) ||
                p.amount.toLowerCase().includes(query) ||
                p.method.toLowerCase().includes(query) ||
                p.date.toLowerCase().includes(query) ||
                p.status.toLowerCase().includes(query),
        )
    }, [payments, searchQuery])

    const paginatedPayments = useMemo(() => {
        const from = (page - 1) * limit
        const to = page * limit
        return filteredPayments.slice(from, to)
    }, [filteredPayments, page, limit])

    return (
        <PaymentsUI
            payments={paginatedPayments}
            totalPayments={filteredPayments.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            onResetSearch={resetSearch}
            isLoading={isLoading || isFetching}
        />
    )
}

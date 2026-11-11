import { useState, useCallback } from 'react'

interface UsePaginationOptions {
    initialPage?: number
    initialLimit?: number
}

interface UsePaginationReturn {
    page: number
    limit: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    nextPage: () => void
    prevPage: () => void
    reset: () => void
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: UsePaginationOptions = {}): UsePaginationReturn {
    const [page, setPage] = useState(initialPage)
    const [limit, setLimit] = useState(initialLimit)

    const nextPage = useCallback(() => setPage((p) => p + 1), [])
    const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])
    const reset = useCallback(() => {
        setPage(initialPage)
        setLimit(initialLimit)
    }, [initialPage, initialLimit])

    return { page, limit, setPage, setLimit, nextPage, prevPage, reset }
}

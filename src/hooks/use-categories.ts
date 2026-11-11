import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '@/api/category'

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.list(),
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: { name: string; image: string; productCount: number; status: 'Active' | 'Inactive' }) =>
            categoryApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number
            data: Partial<{
                name: string
                image: string
                productCount: number
                status: 'Active' | 'Inactive'
            }>
        }) => categoryApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => categoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

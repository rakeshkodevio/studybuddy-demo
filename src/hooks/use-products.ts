import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '@/api/product'

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => productApi.list(),
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: {
            title: string
            image: string
            sku: string
            category: string
            price: number
            status: 'Active' | 'Low Stock' | 'Out of Stock'
        }) => productApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number
            data: Partial<{
                title: string
                image: string
                sku: string
                category: string
                price: number
                status: 'Active' | 'Low Stock' | 'Out of Stock'
            }>
        }) => productApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => productApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

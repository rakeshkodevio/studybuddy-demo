import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/api/users'

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => userApi.list(),
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: {
            name: string
            email: string
            image: string
            phone: string
            orders: number
            role: 'User' | 'Moderator'
            verification: 'Verified' | 'Unverified'
            status: 'Active' | 'Suspended'
        }) => userApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number
            data: Partial<{
                name: string
                email: string
                image: string
                phone: string
                orders: number
                role: 'User' | 'Moderator'
                verification: 'Verified' | 'Unverified'
                status: 'Active' | 'Suspended'
            }>
        }) => userApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

export function useToggleUserStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => userApi.toggleStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => userApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

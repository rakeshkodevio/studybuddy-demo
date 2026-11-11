import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import type { AuthSession } from '@/types/user'

const QUERY_KEY = ['auth', 'session']

/**
 * Hook to get the current auth session
 */
export function useSession() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => authApi.getSession(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    })
}

/**
 * Hook to sign in
 */
export function useSignIn() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authApi.signIn(email, password),
        onSuccess: (session: AuthSession) => {
            queryClient.setQueryData(QUERY_KEY, session)
        },
    })
}

/**
 * Hook to sign out
 */
export function useSignOut() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => authApi.signOut(),
        onSuccess: () => {
            queryClient.setQueryData(QUERY_KEY, null)
        },
    })
}

/**
 * Hook to get current user from session
 */
export function useCurrentUser() {
    const { data: session, ...rest } = useSession()
    return {
        user: session?.user ?? null,
        ...rest,
    }
}

import { useQuery } from '@tanstack/react-query'
import { paymentApi } from '@/api/payments'

export function usePayments() {
    return useQuery({
        queryKey: ['payments'],
        queryFn: () => paymentApi.list(),
    })
}

export function usePaymentById(id: number) {
    return useQuery({
        queryKey: ['payments', id],
        queryFn: () => paymentApi.getById(id),
        enabled: !!id,
    })
}

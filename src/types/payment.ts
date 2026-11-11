export type Payment = {
    id: number
    orderId: number
    userName: string
    item: string
    amount: string
    method: string
    date: string
    status: 'Paid' | 'Pending' | 'Failed'
}

export type OrderPaymentStatus = 'Paid' | 'Unpaid' | 'Merit List' | 'Passed'

export type OrderStatus = 'Delivered' | 'Pending' | 'Canceled' | 'Evaluated'

export type Order = {
    id: number
    userName: string
    email: string
    orderDate: string
    price: number // Marks scored out of total
    examName?: string
    meritRank?: number
    accuracy?: number
    college?: string
    paymentStatus: OrderPaymentStatus
    status: OrderStatus
}


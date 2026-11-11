import type { Payment } from '@/types/payment'

const mockPayments: Payment[] = [
    {
        id: 1,
        orderId: 10401,
        userName: 'Tanvir Ahmed',
        item: 'Chorcha Pro: BUET Engineering Sprint 2026',
        amount: '৳1,850',
        method: 'bKash MFS',
        date: '2026-08-04',
        status: 'Paid',
    },
    {
        id: 2,
        orderId: 10402,
        userName: 'Nusrat Jahan',
        item: 'Medical Admission Marathon & Question Bank',
        amount: '৳1,650',
        method: 'Nagad MFS',
        date: '2026-08-04',
        status: 'Paid',
    },
    {
        id: 3,
        orderId: 10403,
        userName: 'Sabbir Hossain',
        item: 'HSC 2026 Science All Subjects Yearly Pass',
        amount: '৳2,450',
        method: 'bKash MFS',
        date: '2026-08-03',
        status: 'Paid',
    },
    {
        id: 4,
        orderId: 10404,
        userName: 'Mehnaz Tabassum',
        item: 'Chorcha AI Doubt Solver 6-Month Booster',
        amount: '৳750',
        method: 'Rocket MFS',
        date: '2026-08-03',
        status: 'Paid',
    },
    {
        id: 5,
        orderId: 10405,
        userName: 'Fariha Anjum',
        item: 'Dhaka University Ka-Unit Complete Mock Series',
        amount: '৳1,200',
        method: 'bKash MFS',
        date: '2026-08-02',
        status: 'Paid',
    },
    {
        id: 6,
        orderId: 10406,
        userName: 'Arif Rayhan',
        item: 'Chorcha Pro: BUET Engineering Sprint 2026',
        amount: '৳1,850',
        method: 'Card (Visa/Mastercard)',
        date: '2026-08-02',
        status: 'Failed',
    },
    {
        id: 7,
        orderId: 10407,
        userName: 'Zarin Subah',
        item: 'Medical Admission Marathon & Question Bank',
        amount: '৳1,650',
        method: 'bKash MFS',
        date: '2026-08-01',
        status: 'Paid',
    },
    {
        id: 8,
        orderId: 10408,
        userName: 'Sakib Al Hasan',
        item: 'HSC 2026 Physics & Math Exam Pass',
        amount: '৳950',
        method: 'Nagad MFS',
        date: '2026-08-01',
        status: 'Pending',
    },
]

export const paymentApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((resolve) => setTimeout(resolve, 350))
        return {
            data: mockPayments,
            meta: { page: 1, limit: 10, total: mockPayments.length, totalPages: 1 },
        }
    },
    getById: async (id: number) => {
        await new Promise((resolve) => setTimeout(resolve, 350))
        return { data: mockPayments.find((payment) => payment.id === id) }
    },
}

export const PAYMENTS = mockPayments

export function getPaymentById(id: number): Payment | undefined {
    return mockPayments.find((payment) => payment.id === id)
}

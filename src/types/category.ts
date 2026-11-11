export type CategoryStatus = 'Active' | 'Inactive'

export type Category = {
    id: number
    name: string
    image: string
    productCount: number
    status: CategoryStatus
}

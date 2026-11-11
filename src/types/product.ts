export type ProductStatus = 'Active' | 'Low Stock' | 'Out of Stock'

export type Product = {
    id: number
    title: string
    image: string
    sku: string
    category: string
    price: number
    status: ProductStatus
}

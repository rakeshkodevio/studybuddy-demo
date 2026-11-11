export type InventoryStatus = 'In stock' | 'Low Stock'

export type Inventory = {
    id: number
    name: string
    sku: string
    image: string
    category: string
    unitPrice: number
    availableStock: number
    processing: number
    shipped: number
    totalStock: number
    status: InventoryStatus
}

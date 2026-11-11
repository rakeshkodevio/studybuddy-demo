import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Boxes, PackageCheck, PackageX, ReceiptText, Repeat2, ShoppingCart, UserPlus } from 'lucide-react'
import { StatCardsGrid } from '@/components/shared/cards'
import { Skeleton, SkeletonBox } from '@/components/ui/skeleton'
import type { ReportOverview } from '@/types/report'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const number = new Intl.NumberFormat('en-US')

const fallbackOverview: ReportOverview = {
    revenue: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18000 },
        { month: 'Apr', revenue: 22000 },
        { month: 'May', revenue: 26000 },
        { month: 'Jun', revenue: 31000 },
        { month: 'Jul', revenue: 35000 },
    ],
    productSales: [
        { product: 'Classic White T-shirt', sold: 420, revenue: 12600 },
        { product: 'Performance Training Top', sold: 318, revenue: 10176 },
        { product: 'AZ Sports Hoodie', sold: 246, revenue: 14760 },
        { product: 'Running Shorts', sold: 221, revenue: 7735 },
    ],
    customers: {
        newCustomers: 450,
        returningCustomers: 1240,
        repeatPurchaseRate: 68.4,
        averageOrderValue: 87.5,
    },
    inventory: {
        available: 8450,
        lowStock: 124,
        outOfStock: 15,
    },
}

export function ReportsUI({ overview, isLoading = false }: { overview?: ReportOverview; isLoading?: boolean }) {
    const data = overview ?? fallbackOverview
    const { revenue, productSales, customers, inventory } = data
    const isBusy = isLoading || !overview

    return (
        <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
            {/* Revenue Report Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-foreground">Revenue Report</CardTitle>
                        <Select defaultValue="7days">
                            <SelectTrigger className="w-[140px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                                <SelectItem value="30days">Last 30 days</SelectItem>
                                <SelectItem value="90days">Last 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {isBusy ? (
                                <div className="h-full w-full flex flex-col justify-end gap-3 p-4">
                                    <div className="flex items-end justify-between h-52 gap-4">
                                        <SkeletonBox className="w-full h-1/4 rounded-md" />
                                        <SkeletonBox className="w-full h-2/5 rounded-md" />
                                        <SkeletonBox className="w-full h-3/5 rounded-md" />
                                        <SkeletonBox className="w-full h-4/5 rounded-md" />
                                        <SkeletonBox className="w-full h-full rounded-md" />
                                    </div>
                                    <div className="flex justify-between">
                                        <SkeletonBox className="h-4 w-8 rounded" />
                                        <SkeletonBox className="h-4 w-8 rounded" />
                                        <SkeletonBox className="h-4 w-8 rounded" />
                                        <SkeletonBox className="h-4 w-8 rounded" />
                                        <SkeletonBox className="h-4 w-8 rounded" />
                                    </div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenue}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--card)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, 'Revenue']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Revenue Table */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-foreground">Month</CardTitle>
                            <CardTitle className="text-lg font-bold text-foreground">Revenue</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton loading={isBusy}>
                            <div className="space-y-3">
                                {revenue.slice(-6).map((item) => (
                                    <div
                                        key={item.month}
                                        className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                                    >
                                        <span className="text-muted-foreground">{item.month}</span>
                                        <span className="font-medium text-foreground">{currency.format(item.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        </Skeleton>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Report & Customer Report Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Report */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-foreground">Sales Report</CardTitle>
                        <Select defaultValue="7days">
                            <SelectTrigger className="w-[140px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                                <SelectItem value="30days">Last 30 days</SelectItem>
                                <SelectItem value="90days">Last 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <Skeleton loading={isBusy}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/50">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-foreground bg-destructive/10 rounded-l-lg">
                                                Product
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-foreground bg-destructive/10">
                                                Sold
                                            </th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-foreground bg-destructive/10 rounded-r-lg">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productSales.map((item) => (
                                            <tr key={item.product} className="border-b border-border/30 last:border-0">
                                                <td className="py-3 px-2 text-muted-foreground">{item.product}</td>
                                                <td className="py-3 px-2 text-muted-foreground">{item.sold}</td>
                                                <td className="py-3 px-2 text-muted-foreground">{currency.format(item.revenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Skeleton>
                    </CardContent>
                </Card>

                {/* Customer Report */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold text-foreground">Customer Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatCardsGrid
                            loading={isBusy}
                            className="lg:grid-cols-2"
                            cards={[
                                { label: 'New Customers', value: number.format(customers.newCustomers), icon: UserPlus, color: 'blue' },
                                {
                                    label: 'Returning Customers',
                                    value: number.format(customers.returningCustomers),
                                    icon: Repeat2,
                                    color: 'emerald',
                                },
                                {
                                    label: 'Repeat Purchase Rate',
                                    value: `${customers.repeatPurchaseRate}%`,
                                    icon: ShoppingCart,
                                    color: 'rose',
                                },
                                {
                                    label: 'Average Order Value',
                                    value: currency.format(customers.averageOrderValue),
                                    icon: ReceiptText,
                                    color: 'amber',
                                },
                            ]}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Report Section */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-foreground">Inventory Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <StatCardsGrid
                        loading={isBusy}
                        className="lg:grid-cols-3"
                        cards={[
                            {
                                label: 'Available Stock',
                                value: `${number.format(inventory.available)} items`,
                                icon: PackageCheck,
                                color: 'emerald',
                            },
                            { label: 'Low Stock', value: `${number.format(inventory.lowStock)} items`, icon: Boxes, color: 'amber' },
                            { label: 'Out of Stock', value: `${number.format(inventory.outOfStock)} items`, icon: PackageX, color: 'rose' },
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

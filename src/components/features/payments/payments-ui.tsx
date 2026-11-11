import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { DataTable } from '@/components/shared/datatables'
import type { DataTableColumn } from '@/components/shared/datatables'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SearchInput } from '@/components/shared/searching'
import { StatusBadge } from '@/components/shared/feedback'
import { Eye, CreditCard } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import type { Payment } from '@/types/payment'

export interface PaymentsUIProps {
    payments: Payment[]
    totalPayments: number
    page: number
    limit: number
    searchQuery: string
    onSearchChange: (q: string) => void
    onResetSearch: () => void
    isLoading?: boolean
}

export function PaymentsUI({
    payments,
    totalPayments,
    page,
    limit,
    searchQuery,
    onSearchChange,
    onResetSearch,
    isLoading = false,
}: PaymentsUIProps) {
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const openDetails = useCallback((payment: Payment) => {
        setSelectedPayment(payment)
        setIsDetailsOpen(true)
    }, [])

    const columns: DataTableColumn<Payment>[] = useMemo(
        () => [
            {
                key: 'userName',
                header: 'User Name',
                className: 'font-medium',
                render: (p) => <span className="text-muted-foreground">{p.userName}</span>,
            },
            { key: 'orderId', header: 'Order', render: (p) => <span className="text-muted-foreground">#{p.orderId}</span> },
            { key: 'item', header: 'Item', render: (p) => <span className="text-muted-foreground">{p.item}</span> },
            { key: 'amount', header: 'Amount', render: (p) => <span className="text-muted-foreground">{p.amount}</span> },
            { key: 'method', header: 'Method', render: (p) => <span className="text-muted-foreground">{p.method}</span> },
            { key: 'date', header: 'Date', render: (p) => <span className="text-muted-foreground">{p.date}</span> },
            {
                key: 'status',
                header: 'Status',
                render: (p) => <StatusBadge status={p.status} />,
            },
            {
                key: 'action',
                header: 'Action',
                render: (p) => (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDetails(p)}
                        className="size-8 rounded-full bg-info/10 text-info hover:bg-info/20"
                        aria-label="View payment details"
                    >
                        <Eye className="size-4" />
                    </Button>
                ),
            },
        ],
        [openDetails],
    )

    return (
        <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* <PageHeader title="Payments" description="Manage your payments" /> */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <SearchInput value={searchQuery} onValueChange={onSearchChange} placeholder="Search" className="w-full sm:max-w-xs" />
                </div>
            </div>

            <DataTable
                loading={isLoading}
                columns={columns}
                data={payments}
                total={totalPayments}
                page={page}
                limit={limit}
                noun="payments"
                emptyIcon={<CreditCard className="h-6 w-6" />}
                onReset={onResetSearch}
                selectionMode="multiple"
            />

            <PaymentDetailsDialog payment={selectedPayment} isOpen={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
        </div>
    )
}

function PaymentDetailsDialog({
    payment,
    isOpen,
    onOpenChange,
}: {
    payment: Payment | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}) {
    if (!payment) return null

    const rawNum = parseInt(payment.amount.replace(/[^0-9]/g, '')) || 0
    const base = Math.floor(rawNum * 0.95)
    const vat = rawNum - base

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <span>💳</span>
                        <span>MFS Subscription Receipt</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-2">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground font-mono">#TXN-88{payment.id}02</h3>
                        <div className="mt-2">
                            <StatusBadge status={payment.status} size="md" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-xl border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Student Candidate</div>
                            <div className="font-semibold text-base text-foreground">{payment.userName}</div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-xl border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Subscribed Pass / Feature</div>
                            <div className="font-semibold text-base text-foreground">{payment.item}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <div className="text-sm text-muted-foreground mb-1">Payment Channel</div>
                                <div className="font-semibold text-base text-emerald-700 dark:text-emerald-400">{payment.method}</div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <div className="text-sm text-muted-foreground mb-1">Date</div>
                                <div className="font-semibold text-base text-foreground">{payment.date}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg text-foreground mb-3">Subscription Breakdown</h3>
                        <div className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Base Package Price</span>
                                <span className="text-foreground">৳{base}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Govt VAT (5%)</span>
                                <span className="text-foreground">৳{vat}</span>
                            </div>
                            <div className="border-t border-dashed border-border pt-3 flex justify-between font-bold text-sm">
                                <span className="text-foreground">Total Paid (BDT)</span>
                                <span className="text-emerald-700 dark:text-emerald-400 text-base">{payment.amount}</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="default"
                        onClick={() => toast.success('Invoice downloaded!')}
                        className="w-full h-12 mt-2 text-base font-medium shadow-sm"
                    >
                        Download Invoice
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

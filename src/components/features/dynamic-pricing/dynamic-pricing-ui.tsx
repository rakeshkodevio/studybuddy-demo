import { useState, useMemo } from 'react'
import {
    Award,
    Check,
    CreditCard,
    DollarSign,
    GraduationCap,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Zap,
    ShieldCheck,
    BookOpen,
} from 'lucide-react'
import * as z from 'zod'
import { useAppForm } from '@/components/shared/forms/form-context'
import type { DynamicPricing } from '@/types/dynamic-pricing'
import type { FilterState } from '@/components/shared/searching'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const dynamicPricingSchema = z.object({
    productName: z.string().min(1, 'Package name is required'),
    sku: z.string().min(1, 'Pass code is required'),
    image: z.string(),
    dynamicName: z.string().min(1, 'Stream tag is required'),
    startDate: z.string().min(1, 'Validity is required'),
    basePrice: z.number().min(0, 'Regular fee must be positive'),
    adjustment: z.number().min(0, 'Scholarship discount must be positive'),
    calculatedPrice: z.number().min(0, 'Student fee must be positive'),
    status: z.enum(['Active', 'Inactive']),
})

export interface DynamicPricingUIProps {
    dynamicPricing: DynamicPricing[]
    totalDynamicPricing: number
    page: number
    limit: number
    searchQuery: string
    onSearchChange: (q: string) => void
    filters: FilterState[]
    onFiltersChange: (filters: FilterState[]) => void
    onResetSearch: () => void
    onSaveDynamicPricing: (id: number | null, values: z.infer<typeof dynamicPricingSchema>) => void
    onDeleteDynamicPricing: (id: number) => void
    isLoading?: boolean
}

export function DynamicPricingUI({
    dynamicPricing,
    totalDynamicPricing,
    page: _page,
    limit: _limit,
    searchQuery,
    onSearchChange,
    filters: _filters,
    onFiltersChange: _onFiltersChange,
    onResetSearch: _onResetSearch,
    onSaveDynamicPricing,
    onDeleteDynamicPricing,
    isLoading = false,
}: DynamicPricingUIProps) {
    const [selectedStream, setSelectedStream] = useState<string>('all')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<DynamicPricing | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const streams = [
        { id: 'all', label: 'All Passes' },
        { id: 'hsc', label: 'HSC Science' },
        { id: 'engineering', label: 'BUET & Engineering' },
        { id: 'medical', label: 'Medical Admission' },
        { id: 'ai', label: 'AI Doubt Solver' },
    ]

    const filteredList = useMemo(() => {
        let list = dynamicPricing
        if (selectedStream === 'hsc') {
            list = list.filter((p) => p.productName.toLowerCase().includes('hsc') || p.dynamicName.toLowerCase().includes('hsc'))
        } else if (selectedStream === 'engineering') {
            list = list.filter((p) => p.productName.toLowerCase().includes('buet') || p.dynamicName.toLowerCase().includes('eng'))
        } else if (selectedStream === 'medical') {
            list = list.filter((p) => p.productName.toLowerCase().includes('medical'))
        } else if (selectedStream === 'ai') {
            list = list.filter((p) => p.productName.toLowerCase().includes('ai') || p.dynamicName.toLowerCase().includes('solver'))
        }
        return list
    }, [dynamicPricing, selectedStream])

    const handleDelete = (item: DynamicPricing) => {
        if (confirm(`Remove study pass "${item.productName}"?`)) {
            onDeleteDynamicPricing(item.id)
            toast.success('Study pass removed')
        }
    }

    const openEdit = (item: DynamicPricing) => {
        setEditingItem(item)
        setIsEditOpen(true)
    }

    const handleEnroll = (item: DynamicPricing) => {
        toast.success(`bKash/Nagad checkout initialized for ${item.productName}`, {
            description: `৳ ${item.calculatedPrice} student rate applied.`,
        })
    }

    const addForm = useAppForm({
        defaultValues: {
            productName: '',
            sku: `PASS-${Date.now().toString().slice(-4)}`,
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
            dynamicName: 'Admission Blitz 2026',
            startDate: 'Valid 6 Months',
            basePrice: 1000,
            adjustment: 20,
            calculatedPrice: 800,
            status: 'Active' as const,
        },
        validators: { onChange: dynamicPricingSchema },
        onSubmit: async ({ value }) => {
            onSaveDynamicPricing(null, value)
            setIsAddOpen(false)
            toast.success('New StudyBuddy Pass created successfully!')
        },
    })

    const editForm = useAppForm({
        defaultValues: {
            productName: editingItem?.productName ?? '',
            sku: editingItem?.sku ?? '',
            image: editingItem?.image ?? '',
            dynamicName: editingItem?.dynamicName ?? '',
            startDate: editingItem?.startDate ?? '',
            basePrice: editingItem?.basePrice ?? 1000,
            adjustment: editingItem?.adjustment ?? 20,
            calculatedPrice: editingItem?.calculatedPrice ?? 800,
            status: editingItem?.status ?? 'Active',
        },
        validators: { onChange: dynamicPricingSchema },
        onSubmit: async ({ value }) => {
            if (editingItem) {
                onSaveDynamicPricing(editingItem.id, value)
                setIsEditOpen(false)
                setEditingItem(null)
                toast.success('Study pass updated')
            }
        },
    })

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header & KPI Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                        <Zap className="size-3.5" />
                        <span>StudyBuddy Pro Passes · Transparent Admission Prep Packages</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Plans & Passes
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Subscription passes, admission model test packages, AI Doubt Solver boosters, and early-bird coupons.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        size="sm"
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs"
                    >
                        <Plus className="size-4" />
                        <span>Create Study Pass</span>
                    </Button>
                </div>
            </div>

            {/* Metric Clusters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <GraduationCap className="size-4 text-emerald-600" />
                        <span>Active Subscribers</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">14,800+</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Enrolled for HSC & Varsity 2026</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <DollarSign className="size-4 text-primary" />
                        <span>Student Fee Range</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">৳ 250 - ৳ 950</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Subsidized student pricing</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <CreditCard className="size-4 text-purple-600" />
                        <span>Instant MFS Gateway</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">bKash & Nagad</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Zero extra transaction fee</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <ShieldCheck className="size-4 text-sky-600" />
                        <span>Scholarship Guarantee</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">Top 100 Free</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Merit rank based waiver</div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
                {/* Segmented Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {streams.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedStream(s.id)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                                selectedStream === s.id
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search packages or passes..."
                        className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Passes Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-72 rounded-xl border border-border bg-card animate-pulse p-5" />
                    ))}
                </div>
            ) : filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
                    <BookOpen className="size-10 text-muted-foreground mb-3" />
                    <h3 className="font-bold text-base text-foreground">No Passes Found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Try clearing your search query or selecting another filter tab.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredList.map((plan) => {
                        const isPopular = plan.productName.toLowerCase().includes('buet') || plan.productName.toLowerCase().includes('hsc')
                        const discount = Math.round(((plan.basePrice - plan.calculatedPrice) / plan.basePrice) * 100)

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    'group flex flex-col justify-between rounded-2xl border bg-card p-6 transition-all hover:shadow-md',
                                    isPopular ? 'border-primary shadow-2xs ring-1 ring-primary/30' : 'border-border/80',
                                )}
                            >
                                <div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                        <span className="font-bold text-primary">{plan.dynamicName || 'StudyBuddy Pass'}</span>
                                        <span className="font-mono text-[11px]">{plan.sku}</span>
                                    </div>

                                    <h3 className="font-extrabold text-lg text-foreground leading-snug">
                                        {plan.productName}
                                    </h3>

                                    <div className="text-xs text-muted-foreground mt-1">
                                        {plan.startDate || 'Valid for 2026 Academic Season'}
                                    </div>

                                    {/* Pricing Display in BDT */}
                                    <div className="mt-4 pt-4 border-t border-border/60 flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-foreground">
                                            ৳ {plan.calculatedPrice}
                                        </span>
                                        {plan.basePrice > plan.calculatedPrice && (
                                            <>
                                                <span className="text-sm text-muted-foreground line-through">
                                                    ৳ {plan.basePrice}
                                                </span>
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                    {discount > 0 ? `${discount}% OFF` : 'Scholarship Rate'}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Features Checklist */}
                                    <ul className="mt-5 flex flex-col gap-2.5 text-xs text-foreground/90">
                                        <li className="flex items-center gap-2">
                                            <Check className="size-4 text-primary shrink-0" />
                                            <span>Unlimited Timed Model Tests & National Ranking</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="size-4 text-primary shrink-0" />
                                            <span>1,00,000+ Question Bank with Step-by-Step Solutions</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="size-4 text-primary shrink-0" />
                                            <span>24/7 StudyBuddy AI Doubt Solver Credits</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="size-4 text-primary shrink-0" />
                                            <span>Diagnostic Mistake Notebook (ভুল খাতা) Sync</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                                    <Button
                                        onClick={() => handleEnroll(plan)}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs"
                                    >
                                        Enroll with bKash / Nagad
                                    </Button>

                                    <Button
                                        onClick={() => openEdit(plan)}
                                        size="sm"
                                        variant="ghost"
                                        className="size-8 p-0 text-muted-foreground hover:text-foreground"
                                        title="Edit Pass"
                                    >
                                        <Pencil className="size-3.5" />
                                    </Button>

                                    <Button
                                        onClick={() => handleDelete(plan)}
                                        size="sm"
                                        variant="ghost"
                                        className="size-8 p-0 text-destructive/70 hover:text-destructive"
                                        title="Delete Pass"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ADD PASS MODAL */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">Create New Study Pass</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Add a subscription pass or admission test package for students.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            addForm.handleSubmit()
                        }}
                        className="flex flex-col gap-4 mt-2"
                    >
                        <addForm.AppField name="productName">
                            {(field) => (
                                <field.FormInput
                                    label="Package Title"
                                    placeholder="e.g. DU Ka-Unit Mega Mock Test Series 2026"
                                />
                            )}
                        </addForm.AppField>

                        <div className="grid grid-cols-2 gap-3">
                            <addForm.AppField name="dynamicName">
                                {(field) => (
                                    <field.FormInput
                                        label="Target Stream"
                                        placeholder="Admission Blitz 2026"
                                    />
                                )}
                            </addForm.AppField>

                            <addForm.AppField name="calculatedPrice">
                                {(field) => (
                                    <field.FormInput
                                        type="number"
                                        label="Student Fee (৳)"
                                        placeholder="750"
                                    />
                                )}
                            </addForm.AppField>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                                Create Pass
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT PASS MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">Edit Study Pass</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Update pricing or package title.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            editForm.handleSubmit()
                        }}
                        className="flex flex-col gap-4 mt-2"
                    >
                        <editForm.AppField name="productName">
                            {(field) => <field.FormInput label="Package Title" placeholder="Package Title" />}
                        </editForm.AppField>

                        <div className="grid grid-cols-2 gap-3">
                            <editForm.AppField name="dynamicName">
                                {(field) => <field.FormInput label="Target Stream" placeholder="Target Stream" />}
                            </editForm.AppField>

                            <editForm.AppField name="calculatedPrice">
                                {(field) => (
                                    <field.FormInput
                                        type="number"
                                        label="Student Fee (৳)"
                                        placeholder="750"
                                    />
                                )}
                            </editForm.AppField>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

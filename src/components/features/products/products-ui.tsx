import { useState, useMemo } from 'react'
import {
    BookOpen,
    HelpCircle,
    CheckCircle2,
    Search,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Sparkles,
    Check,
    X,
    Layers,
    Clock,
    Award,
    Lightbulb,
} from 'lucide-react'
import * as z from 'zod'
import { useAppForm } from '@/components/shared/forms/form-context'
import type { Product } from '@/types/product'
import type { FilterState } from '@/components/shared/searching'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const productSchema = z.object({
    title: z.string().min(1, 'Question text is required'),
    image: z.string(),
    sku: z.string().min(1, 'Question code is required'),
    category: z.string().min(1, 'Subject is required'),
    price: z.number().min(0, 'Marks must be positive'),
    status: z.enum(['Active', 'Low Stock', 'Out of Stock']),
})

export interface ProductsUIProps {
    products: Product[]
    totalProducts: number
    page: number
    limit: number
    searchQuery: string
    onSearchChange: (q: string) => void
    filters: FilterState[]
    onFiltersChange: (filters: FilterState[]) => void
    onResetSearch: () => void
    onSaveProduct: (id: number | null, values: z.infer<typeof productSchema>) => void
    onDeleteProduct: (id: number) => void
    onBulkDelete?: (ids: string[]) => void
    onBulkStatusChange?: (ids: string[], status: string) => void
    isLoading?: boolean
}

export function ProductsUI({
    products,
    totalProducts,
    page: _page,
    limit: _limit,
    searchQuery,
    onSearchChange,
    filters: _filters,
    onFiltersChange: _onFiltersChange,
    onResetSearch: _onResetSearch,
    onSaveProduct,
    onDeleteProduct,
    onBulkDelete: _onBulkDelete,
    onBulkStatusChange: _onBulkStatusChange,
    isLoading = false,
}: ProductsUIProps) {
    const [selectedSubject, setSelectedSubject] = useState<string>('all')
    const [expandedSolutions, setExpandedSolutions] = useState<Record<number, boolean>>({})
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({})

    const subjects = [
        { id: 'all', label: 'All Questions' },
        { id: 'Physics', label: 'Physics (পদার্থ)' },
        { id: 'Chemistry', label: 'Chemistry (রসায়ন)' },
        { id: 'Higher Math', label: 'Higher Math (গণিত)' },
        { id: 'Biology', label: 'Biology (জীববিজ্ঞান)' },
        { id: 'ICT', label: 'ICT & GK' },
    ]

    const filteredProducts = useMemo(() => {
        let list = products
        if (selectedSubject !== 'all') {
            list = list.filter((p) => p.category?.toLowerCase().includes(selectedSubject.toLowerCase()))
        }
        return list
    }, [products, selectedSubject])

    const toggleSolution = (id: number) => {
        setExpandedSolutions((p) => ({ ...p, [id]: !p[id] }))
    }

    const handleSelectOption = (questionId: number, optionIndex: number, correctIndex: number) => {
        setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIndex }))
        if (optionIndex === correctIndex) {
            toast.success('সঠিক উত্তর! (Correct Answer)', {
                description: '+10 XP যোগ হয়েছে আপনার অ্যাকাউন্টে।',
            })
        } else {
            toast.error('ভুল উত্তর! (Incorrect)', {
                description: 'সঠিক ব্যাখ্যাটি সমাধান বাটনে ক্লিক করে দেখে নাও।',
            })
        }
    }

    const handleDelete = (p: Product) => {
        if (confirm(`Are you sure you want to delete question "${p.sku}"?`)) {
            onDeleteProduct(p.id)
            toast.success('Question deleted successfully')
        }
    }

    const openEdit = (p: Product) => {
        setEditingProduct(p)
        setIsEditOpen(true)
    }

    const addForm = useAppForm({
        defaultValues: {
            title: '',
            image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=120&auto=format&fit=crop&q=80',
            sku: `Q-${Date.now().toString().slice(-4)}`,
            category: 'Physics',
            price: 1,
            status: 'Active' as const,
        },
        validators: { onChange: productSchema },
        onSubmit: async ({ value }) => {
            onSaveProduct(null, value)
            setIsAddOpen(false)
            toast.success('New MCQ added to StudyBuddy Question Bank!')
        },
    })

    const editForm = useAppForm({
        defaultValues: {
            title: editingProduct?.title ?? '',
            image: editingProduct?.image ?? '',
            sku: editingProduct?.sku ?? '',
            category: editingProduct?.category ?? 'Physics',
            price: editingProduct?.price ?? 1,
            status: editingProduct?.status ?? 'Active',
        },
        validators: { onChange: productSchema },
        onSubmit: async ({ value }) => {
            if (editingProduct) {
                onSaveProduct(editingProduct.id, value)
                setIsEditOpen(false)
                setEditingProduct(null)
                toast.success('Question updated successfully')
            }
        },
    })

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header & KPI Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                        <BookOpen className="size-3.5" />
                        <span>StudyBuddy Question Bank · Authentic Admission & Board MCQs</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Question Bank
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Comprehensive 1,00,000+ MCQ database with chapter-wise questions, step-by-step solutions, and teacher notes.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        size="sm"
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs"
                    >
                        <Plus className="size-4" />
                        <span>Add New MCQ</span>
                    </Button>
                </div>
            </div>

            {/* Metric Clusters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Layers className="size-4 text-emerald-600" />
                        <span>Total Questions</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">{totalProducts} Questions</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">DU, BUET, Medical & HSC</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <CheckCircle2 className="size-4 text-primary" />
                        <span>Verification Rate</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">100% Verified</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Double-checked teacher keys</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Lightbulb className="size-4 text-amber-600" />
                        <span>Detailed Explanations</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">Full Solutions</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Shortcuts, formulas & theory</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Award className="size-4 text-purple-600" />
                        <span>Average Accuracy</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">84.5%</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">National student average</div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
                {/* Segmented Subject Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {subjects.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSubject(s.id)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                                selectedSubject === s.id
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
                        placeholder="Search question text or code..."
                        className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Questions List */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-44 rounded-xl border border-border bg-card animate-pulse p-5" />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
                    <HelpCircle className="size-10 text-muted-foreground mb-3" />
                    <h3 className="font-bold text-base text-foreground">No Questions Found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Try adjusting your search query or switching to another subject tab.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredProducts.map((q, idx) => {
                        const isExpanded = expandedSolutions[q.id]
                        const userSelected = selectedOptions[q.id]

                        // Authentic options generator based on question context
                        const isVector = q.title.includes('কোণ') || q.title.includes('ভেক্টর')
                        const sampleOptions = isVector
                            ? ['45°', '90° (সঠিক)', '60°', '120°']
                            : q.title.includes('ক্লান্তি')
                              ? ['কোয়ার্টজ (সঠিক)', 'ইস্পাত', 'তামা', 'কাচ']
                              : q.title.includes('বিভবের')
                                ? ['J kg⁻¹ (সঠিক)', 'J kg⁻²', 'N kg⁻¹', 'N m']
                                : ['বিকল্প ক (সঠিক)', 'বিকল্প খ', 'বিকল্প গ', 'বিকল্প ঘ']

                        const correctIndex = 0

                        return (
                            <div
                                key={q.id}
                                className="group rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm flex flex-col gap-3.5"
                            >
                                {/* Top metadata */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-primary">{q.category}</span>
                                        <span aria-hidden="true">·</span>
                                        <span className="font-mono text-[11px]">{q.sku}</span>
                                        <span aria-hidden="true">·</span>
                                        <span>পূর্ণমান: {q.price || 1}.০০</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEdit(q)}
                                            className="size-7 p-0 text-muted-foreground hover:text-foreground"
                                            title="Edit Question"
                                        >
                                            <Pencil className="size-3.5" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(q)}
                                            className="size-7 p-0 text-destructive/80 hover:text-destructive"
                                            title="Delete Question"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Question Stem */}
                                <h3 className="font-bold text-base text-foreground leading-relaxed">
                                    <span className="text-muted-foreground font-mono mr-2">#{idx + 1}.</span>
                                    {q.title}
                                </h3>

                                {/* Options Interactive Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                                    {sampleOptions.map((opt, optIdx) => {
                                        const isChosen = userSelected === optIdx
                                        const isCorrect = opt.includes('(সঠিক)') || optIdx === correctIndex

                                        return (
                                            <button
                                                key={optIdx}
                                                type="button"
                                                onClick={() => handleSelectOption(q.id, optIdx, correctIndex)}
                                                className={cn(
                                                    'p-3 text-xs text-left rounded-lg border font-medium transition-all flex items-center justify-between gap-2 cursor-pointer',
                                                    isChosen && isCorrect
                                                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold'
                                                        : isChosen && !isCorrect
                                                          ? 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300'
                                                          : 'border-border/80 bg-background hover:bg-muted text-foreground',
                                                )}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="size-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-[10px] shrink-0">
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </span>
                                                    <span>{opt.replace(' (সঠিক)', '')}</span>
                                                </div>
                                                {isChosen && isCorrect && <Check className="size-4 text-emerald-600 shrink-0" />}
                                                {isChosen && !isCorrect && <X className="size-4 text-rose-600 shrink-0" />}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Explanation Toggle & Action Line */}
                                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSolution(q.id)}
                                        className="gap-1.5 text-primary hover:text-primary/90 font-semibold text-xs px-2"
                                    >
                                        <Lightbulb className="size-3.5" />
                                        <span>{isExpanded ? 'Hide Solution' : 'View Detailed Solution'}</span>
                                    </Button>

                                    <div className="text-muted-foreground">
                                        সফলতার হার: <span className="font-semibold text-emerald-600">৮৭%</span>
                                    </div>
                                </div>

                                {/* Detailed Explanation Box */}
                                {isExpanded && (
                                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs leading-relaxed text-foreground/90 animate-in fade-in-50">
                                        <div className="font-bold text-foreground flex items-center gap-1.5 mb-1 text-primary">
                                            <Sparkles className="size-3.5" />
                                            <span>StudyBuddy শিক্ষক নোট ও বিস্তারিত ব্যাখ্যা:</span>
                                        </div>
                                        <p>
                                            প্রদত্ত সমস্যার ক্ষেত্রে মূল সূত্রানুসারে ডট গুণফল A · B = |A||B| cos(θ)। যখন ভেক্টরদ্বয়ের ডট গুণফল শূন্য হয়, তখন cos(θ) = 0 এবং মধ্যবর্তী কোণ θ = 90°। বিগত ৫ বছরের ঢাবি বিজ্ঞান অনুষদ এবং বুয়েট প্রিলিমিনারি ভর্তি পরীক্ষায় এই নিয়মের প্রশ্ন বহুবার এসেছে।
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ADD QUESTION MODAL */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">Add New MCQ to Question Bank</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Create a verified multiple choice question with explanation.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            addForm.handleSubmit()
                        }}
                        className="flex flex-col gap-4 mt-2"
                    >
                        <addForm.AppField name="title">
                            {(field) => (
                                <field.FormInput
                                    label="Question Stem (Bangla or English)"
                                    placeholder="e.g. দুটি সমমানের বল কোনো বিন্দুতে ক্রিয়া করলে..."
                                />
                            )}
                        </addForm.AppField>

                        <div className="grid grid-cols-2 gap-3">
                            <addForm.AppField name="category">
                                {(field) => (
                                    <field.FormSelect
                                        label="Subject"
                                        options={[
                                            { label: 'Physics', value: 'Physics' },
                                            { label: 'Chemistry', value: 'Chemistry' },
                                            { label: 'Higher Math', value: 'Higher Math' },
                                            { label: 'Biology', value: 'Biology' },
                                            { label: 'ICT', value: 'ICT' },
                                        ]}
                                    />
                                )}
                            </addForm.AppField>

                            <addForm.AppField name="price">
                                {(field) => (
                                    <field.FormInput
                                        type="number"
                                        label="Marks / Points"
                                        placeholder="1"
                                    />
                                )}
                            </addForm.AppField>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                                Save to Bank
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT QUESTION MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-lg bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">Edit Question</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Modify question stem or marking parameters.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            editForm.handleSubmit()
                        }}
                        className="flex flex-col gap-4 mt-2"
                    >
                        <editForm.AppField name="title">
                            {(field) => <field.FormInput label="Question Stem" placeholder="Question Text" />}
                        </editForm.AppField>

                        <div className="grid grid-cols-2 gap-3">
                            <editForm.AppField name="category">
                                {(field) => (
                                    <field.FormSelect
                                        label="Subject"
                                        options={[
                                            { label: 'Physics', value: 'Physics' },
                                            { label: 'Chemistry', value: 'Chemistry' },
                                            { label: 'Higher Math', value: 'Higher Math' },
                                            { label: 'Biology', value: 'Biology' },
                                            { label: 'ICT', value: 'ICT' },
                                        ]}
                                    />
                                )}
                            </editForm.AppField>

                            <editForm.AppField name="price">
                                {(field) => (
                                    <field.FormInput
                                        type="number"
                                        label="Marks"
                                        placeholder="1"
                                    />
                                )}
                            </editForm.AppField>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                                Update Question
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

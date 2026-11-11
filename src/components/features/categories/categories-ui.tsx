import { useState, useMemo } from 'react'
import {
    BookOpen,
    GraduationCap,
    Layers,
    Plus,
    Search,
    ChevronRight,
    Sparkles,
    Trash2,
    Pencil,
    Eye,
    CheckCircle2,
    FileText,
} from 'lucide-react'
import * as z from 'zod'
import { useAppForm } from '@/components/shared/forms/form-context'
import type { Category } from '@/types/category'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const categorySchema = z.object({
    name: z.string().min(1, 'Subject name is required'),
    image: z.string(),
    productCount: z.number().min(0, 'MCQ count must be positive'),
    status: z.enum(['Active', 'Inactive']),
})

export interface CategoriesUIProps {
    categories: Category[]
    totalCategories: number
    page: number
    limit: number
    searchQuery: string
    onSearchChange: (q: string) => void
    onResetSearch: () => void
    onSaveCategory: (id: number | null, values: z.infer<typeof categorySchema>) => void
    onDeleteCategory: (id: number) => void
    onBulkDelete?: (ids: string[]) => void
    onBulkStatusChange?: (ids: string[], status: string) => void
    isLoading?: boolean
}

export function CategoriesUI({
    categories,
    totalCategories,
    page: _page,
    limit: _limit,
    searchQuery,
    onSearchChange,
    onResetSearch: _onResetSearch,
    onSaveCategory,
    onDeleteCategory,
    onBulkDelete: _onBulkDelete,
    onBulkStatusChange: _onBulkStatusChange,
    isLoading = false,
}: CategoriesUIProps) {
    const [selectedStream, setSelectedStream] = useState<string>('all')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [viewingCategory, setViewingCategory] = useState<Category | null>(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const streams = [
        { id: 'all', label: 'All Subjects' },
        { id: 'academic', label: 'Academic (Class 9-12)' },
        { id: 'du', label: 'Dhaka University (DU)' },
        { id: 'science', label: 'Science & Math' },
        { id: 'admission', label: 'Admission Blitz' },
    ]

    const filteredCategories = useMemo(() => {
        let list = categories
        if (selectedStream === 'academic') {
            list = list.filter((c) => c.name.includes('Class') || c.name.includes('HSC') || c.name.includes('1st & 2nd'))
        } else if (selectedStream === 'du') {
            list = list.filter((c) => c.name.toLowerCase().includes('du') || c.name.toLowerCase().includes('dhaka university'))
        } else if (selectedStream === 'science') {
            list = list.filter(
                (c) =>
                    c.name.includes('Physics') ||
                    c.name.includes('Chemistry') ||
                    c.name.includes('Higher Math') ||
                    c.name.includes('Biology'),
            )
        } else if (selectedStream === 'admission') {
            list = list.filter((c) => c.name.includes('Unit') || c.name.includes('BCS') || c.name.includes('Admission'))
        }
        return list
    }, [categories, selectedStream])

    const openView = (cat: Category) => {
        setViewingCategory(cat)
        setIsViewOpen(true)
    }

    const openEdit = (cat: Category) => {
        setEditingCategory(cat)
        setIsEditOpen(true)
    }

    const handleDelete = (cat: Category) => {
        if (confirm(`Are you sure you want to delete "${cat.name}"?`)) {
            onDeleteCategory(cat.id)
            toast.success('Subject deleted successfully')
        }
    }

    const addForm = useAppForm({
        defaultValues: {
            name: '',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=120&auto=format&fit=crop&q=80',
            productCount: 15000,
            status: 'Active' as const,
        },
        validators: { onChange: categorySchema },
        onSubmit: async ({ value }) => {
            onSaveCategory(null, value)
            setIsAddOpen(false)
            toast.success('New subject added to StudyBuddy curriculum!')
        },
    })

    const editForm = useAppForm({
        defaultValues: {
            name: editingCategory?.name ?? '',
            image: editingCategory?.image ?? '',
            productCount: editingCategory?.productCount ?? 10000,
            status: editingCategory?.status ?? 'Active',
        },
        validators: { onChange: categorySchema },
        onSubmit: async ({ value }) => {
            if (editingCategory) {
                onSaveCategory(editingCategory.id, value)
                setIsEditOpen(false)
                setEditingCategory(null)
                toast.success('Subject updated successfully')
            }
        },
    })

    // Sample Chapter breakdown data for academic syllabus
    const sampleChapters = [
        { no: '০১', name: 'ভেক্টর (Vectors)', mcqs: 2450, accuracy: 88 },
        { no: '০২', name: 'গতিবিদ্যা (Dynamics)', mcqs: 3100, accuracy: 82 },
        { no: '০৩', name: 'নিউটনীয় বলবিদ্যা (Newtonian Mechanics)', mcqs: 2890, accuracy: 79 },
        { no: '০৪', name: 'কাজ, শক্তি ও ক্ষমতা (Work, Energy & Power)', mcqs: 1950, accuracy: 91 },
        { no: '০৫', name: 'মহাকর্ষ ও অভিকর্ষ (Gravitation)', mcqs: 2200, accuracy: 85 },
        { no: '০৬', name: 'পদার্থের গাঠনিক ধর্ম (Structural Properties)', mcqs: 1800, accuracy: 84 },
    ]

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header & KPI Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                        <GraduationCap className="size-3.5" />
                        <span>Curriculum Architecture · Subjects & Admission Streams</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Subjects & Syllabuses
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Organized academic disciplines (Class 9-12), university admission units, and chapter-wise question banks.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        size="sm"
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs"
                    >
                        <Plus className="size-4" />
                        <span>Add Subject / Stream</span>
                    </Button>
                </div>
            </div>

            {/* Metric Clusters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <BookOpen className="size-4 text-emerald-600" />
                        <span>Total Disciplines</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">{totalCategories} Disciplines</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Academic & Admission</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Layers className="size-4 text-primary" />
                        <span>MCQ Question Bank</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">1,40,000+</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Verified solutions & hints</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Sparkles className="size-4 text-purple-600" />
                        <span>Class Levels</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">Class 9 - 12</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">NCTB & Varsity standards</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <CheckCircle2 className="size-4 text-sky-600" />
                        <span>Curriculum Status</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">100% Up to Date</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">2026 admission cycle</div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
                {/* Segmented Stream Filter Tabs */}
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
                        placeholder="Search subjects or syllabus code..."
                        className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Subject Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-56 rounded-xl border border-border bg-card animate-pulse p-5" />
                    ))}
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
                    <BookOpen className="size-10 text-muted-foreground mb-3" />
                    <h3 className="font-bold text-base text-foreground">No Subjects Found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Try clearing your search query or switching to another filter stream.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCategories.map((cat) => {
                        const count = cat.productCount || 12000
                        const isActive = cat.status === 'Active'

                        return (
                            <div
                                key={cat.id}
                                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div>
                                    <div className="flex items-start gap-3.5">
                                        <div className="size-12 rounded-xl overflow-hidden shrink-0 bg-muted ring-1 ring-border group-hover:scale-105 transition-transform">
                                            <img src={cat.image} alt={cat.name} className="size-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground mb-1">
                                                <span>Subject Syllabus</span>
                                                {isActive ? (
                                                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-muted-foreground font-medium">Inactive</span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                                {cat.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Stats Line */}
                                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="size-3.5 text-primary" />
                                            <span className="font-semibold text-foreground">{count.toLocaleString()}</span>
                                            <span>MCQs</span>
                                        </div>
                                        <span aria-hidden="true">·</span>
                                        <div>14 Chapters</div>
                                        <span aria-hidden="true">·</span>
                                        <div className="text-emerald-600 font-semibold">100% Covered</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                                    <Button
                                        onClick={() => openView(cat)}
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 gap-1 text-xs font-semibold"
                                    >
                                        <Eye className="size-3.5" />
                                        <span>Chapters</span>
                                    </Button>

                                    <Button
                                        onClick={() => openEdit(cat)}
                                        size="sm"
                                        variant="ghost"
                                        className="size-8 p-0 text-muted-foreground hover:text-foreground"
                                        title="Edit Subject"
                                    >
                                        <Pencil className="size-3.5" />
                                    </Button>

                                    <Button
                                        onClick={() => handleDelete(cat)}
                                        size="sm"
                                        variant="ghost"
                                        className="size-8 p-0 text-destructive/80 hover:text-destructive"
                                        title="Delete Subject"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* CHAPTER BREAKDOWN DRAWER / MODAL */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-2xl bg-background border-border max-h-[85vh] overflow-y-auto">
                    {viewingCategory && (
                        <div>
                            <DialogHeader>
                                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                                    Curriculum Syllabus & Chapter Blueprint
                                </div>
                                <DialogTitle className="text-xl font-bold text-foreground">
                                    {viewingCategory.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    {viewingCategory.productCount.toLocaleString()} MCQs mapped across official NCTB chapters.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 flex flex-col gap-2.5">
                                {sampleChapters.map((ch) => (
                                    <div
                                        key={ch.no}
                                        className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="size-7 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                                                {ch.no}
                                            </span>
                                            <div>
                                                <h4 className="font-bold text-sm text-foreground">{ch.name}</h4>
                                                <div className="text-muted-foreground mt-0.5">
                                                    {ch.mcqs.toLocaleString()} MCQs · গড় নির্ভুলতা: {ch.accuracy}%
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => toast.success(`চর্চা শুরু হচ্ছে: ${ch.name}`)}
                                            className="text-xs font-semibold shrink-0"
                                        >
                                            Practice Chapter
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ADD SUBJECT MODAL */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">Add New Subject / Stream</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Register a new discipline in the StudyBuddy curriculum.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            addForm.handleSubmit()
                        }}
                        className="flex flex-col gap-4 mt-2"
                    >
                        <addForm.AppField name="name">
                            {(field) => (
                                <field.FormInput
                                    label="Subject Title"
                                    placeholder="e.g. Higher Math (উচ্চতর গণিত 1st & 2nd)"
                                />
                            )}
                        </addForm.AppField>

                        <addForm.AppField name="productCount">
                            {(field) => (
                                <field.FormInput
                                    type="number"
                                    label="Target MCQ Volume"
                                    placeholder="e.g. 25000"
                                />
                            )}
                        </addForm.AppField>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                                Save Subject
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT SUBJECT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">Edit Subject / Stream</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Update curriculum title or question bank targets.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            editForm.handleSubmit()
                        }}
                        className="flex flex-col gap-4 mt-2"
                    >
                        <editForm.AppField name="name">
                            {(field) => <field.FormInput label="Subject Title" placeholder="Subject Title" />}
                        </editForm.AppField>

                        <editForm.AppField name="productCount">
                            {(field) => (
                                <field.FormInput
                                    type="number"
                                    label="Target MCQ Volume"
                                    placeholder="e.g. 25000"
                                />
                            )}
                        </editForm.AppField>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                                Update
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

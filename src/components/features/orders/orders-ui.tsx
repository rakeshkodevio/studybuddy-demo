import { useState, useMemo } from 'react'
import {
    Award,
    CheckCircle2,
    Clock,
    FileText,
    Search,
    TrendingUp,
    Trophy,
    User,
    XCircle,
    Eye,
    Trash2,
    Sparkles,
    GraduationCap,
} from 'lucide-react'
import * as z from 'zod'
import { useAppForm } from '@/components/shared/forms/form-context'
import type { Order } from '@/types/order'
import type { FilterState } from '@/components/shared/searching'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const orderSchema = z.object({
    userName: z.string().min(1, 'User name is required'),
    email: z.string().email('Please enter a valid email address'),
    orderDate: z.string().min(1, 'Submission date is required'),
    price: z.number().min(0, 'Score must be positive'),
    paymentStatus: z.enum(['Passed', 'Paid', 'Unpaid']),
    status: z.enum(['Delivered', 'Pending', 'Canceled']),
})

export interface OrdersUIProps {
    orders: Order[]
    totalOrders: number
    page: number
    limit: number
    searchQuery: string
    onSearchChange: (q: string) => void
    filters: FilterState[]
    onFiltersChange: (filters: FilterState[]) => void
    onResetSearch: () => void
    onSaveOrder: (id: number | null, values: z.infer<typeof orderSchema>) => void
    onDeleteOrder: (id: number) => void
    onBulkDelete?: (ids: string[]) => void
    onBulkStatusChange?: (ids: string[], status: string) => void
    isLoading?: boolean
}

export function OrdersUI({
    orders,
    totalOrders,
    page: _page,
    limit: _limit,
    searchQuery,
    onSearchChange,
    filters: _filters,
    onFiltersChange: _onFiltersChange,
    onResetSearch: _onResetSearch,
    onSaveOrder: _onSaveOrder,
    onDeleteOrder,
    onBulkDelete: _onBulkDelete,
    onBulkStatusChange: _onBulkStatusChange,
    isLoading = false,
}: OrdersUIProps) {
    const [selectedStream, setSelectedStream] = useState<string>('all')
    const [viewingSubmission, setViewingSubmission] = useState<Order | null>(null)
    const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false)

    const streams = [
        { id: 'all', label: 'All Submissions' },
        { id: 'hsc', label: 'HSC Science' },
        { id: 'buet', label: 'BUET Math Blitz' },
        { id: 'medical', label: 'Medical Marathon' },
        { id: 'du', label: 'Dhaka University (DU)' },
    ]

    const filteredOrders = useMemo(() => {
        let list = orders
        if (selectedStream === 'hsc') {
            list = list.filter((o) => (o.examName || '').toLowerCase().includes('hsc') || (o.college || '').toLowerCase().includes('notre dame'))
        } else if (selectedStream === 'buet') {
            list = list.filter((o) => (o.examName || '').toLowerCase().includes('buet'))
        } else if (selectedStream === 'medical') {
            list = list.filter((o) => (o.examName || '').toLowerCase().includes('medical'))
        } else if (selectedStream === 'du') {
            list = list.filter((o) => (o.examName || '').toLowerCase().includes('du') || (o.examName || '').toLowerCase().includes('dhaka'))
        }
        return list
    }, [orders, selectedStream])

    const openDiagnostic = (order: Order) => {
        setViewingSubmission(order)
        setIsDiagnosticOpen(true)
    }

    const handleDelete = (order: Order) => {
        if (confirm(`Delete submission record for ${order.userName}?`)) {
            onDeleteOrder(order.id)
            toast.success('Submission record deleted')
        }
    }

    // Diagnostic question breakdowns for student answer sheet
    const diagnosticBreakdown = [
        { subject: 'পদার্থবিজ্ঞান (Physics)', correct: 24, total: 25, accuracy: 96, status: 'Strong' },
        { subject: 'রসায়ন (Chemistry)', correct: 22, total: 25, accuracy: 88, status: 'Good' },
        { subject: 'উচ্চতর গণিত (Higher Math)', correct: 25, total: 25, accuracy: 100, status: 'Mastered' },
        { subject: 'ইংরেজি ও সাধারণ জ্ঞান (English & GK)', correct: 21, total: 25, accuracy: 84, status: 'Needs Review' },
    ]

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header & KPI Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                        <Trophy className="size-3.5" />
                        <span>Live Exam Results · National Merit List & Diagnostics</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Exam Submissions
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track live student model test submissions, national merit standings, accuracy percentiles, and answer sheets.
                    </p>
                </div>
            </div>

            {/* Metric Clusters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <FileText className="size-4 text-emerald-600" />
                        <span>Submissions Today</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">{totalOrders.toLocaleString()} Solved</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Top Bangladeshi colleges</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Trophy className="size-4 text-amber-500" />
                        <span>Highest Merit Score</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">98.5 / 100</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Notre Dame College, Dhaka</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <CheckCircle2 className="size-4 text-sky-600" />
                        <span>Average Accuracy</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">87.4%</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Across all live test papers</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Clock className="size-4 text-purple-600" />
                        <span>Average Time</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">16.5 Mins</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Per 25-minute test paper</div>
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
                        placeholder="Search student or exam name..."
                        className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Submissions Roster */}
            {isLoading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 rounded-xl border border-border bg-card animate-pulse p-4" />
                    ))}
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
                    <Trophy className="size-10 text-muted-foreground mb-3" />
                    <h3 className="font-bold text-base text-foreground">No Submissions Found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Try clearing your search filter or selecting another stream.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-2xs">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                            <tr>
                                <th className="p-3.5 pl-4">মেধাস্থান (Rank)</th>
                                <th className="p-3.5">শিক্ষার্থী ও কলেজ</th>
                                <th className="p-3.5">পরীক্ষার নাম (Model Test)</th>
                                <th className="p-3.5">প্রাপ্ত নম্বর (Score)</th>
                                <th className="p-3.5">নির্ভুলতা (Accuracy)</th>
                                <th className="p-3.5">জমা দেওয়ার সময়</th>
                                <th className="p-3.5 pr-4 text-right">কার্যক্রম</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredOrders.map((submission, idx) => {
                                const rank = submission.meritRank || idx + 1
                                const accuracy = submission.accuracy || Math.min(99, Math.round(98 - idx * 1.5))
                                const score = submission.price || 24.5

                                return (
                                    <tr key={submission.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-3.5 pl-4">
                                            <span className="font-extrabold text-foreground text-sm">
                                                {rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-8 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                                                    {submission.userName.slice(0, 1)}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-foreground text-xs block truncate">
                                                        {submission.userName}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground block truncate">
                                                        {submission.college || 'Notre Dame College, Dhaka'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="font-medium text-foreground text-xs block max-w-xs truncate">
                                                {submission.examName || 'HSC Physics Paper 1: Vector & Dynamics Mock #08'}
                                            </span>
                                            <span className="text-[10px] text-primary font-semibold">StudyBuddy Verified</span>
                                        </td>
                                        <td className="p-3.5 font-bold text-foreground text-xs">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                                                {score}
                                            </span>{' '}
                                            / 25.0
                                        </td>
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-foreground">{accuracy}%</span>
                                                <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden hidden sm:block">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full',
                                                            accuracy >= 90
                                                                ? 'bg-emerald-500'
                                                                : accuracy >= 75
                                                                  ? 'bg-primary'
                                                                  : 'bg-amber-500',
                                                        )}
                                                        style={{ width: `${accuracy}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                            {submission.orderDate}
                                        </td>
                                        <td className="p-3.5 pr-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    onClick={() => openDiagnostic(submission)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 gap-1 text-xs font-semibold"
                                                >
                                                    <Eye className="size-3.5" />
                                                    <span>Diagnostic</span>
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(submission)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="size-8 p-0 text-destructive/70 hover:text-destructive"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* DETAILED DIAGNOSTIC & ANSWER SHEET MODAL */}
            <Dialog open={isDiagnosticOpen} onOpenChange={setIsDiagnosticOpen}>
                <DialogContent className="sm:max-w-xl bg-background border-border max-h-[85vh] overflow-y-auto">
                    {viewingSubmission && (
                        <div>
                            <DialogHeader>
                                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                                    Student Answer Sheet & Academic Diagnostic
                                </div>
                                <DialogTitle className="text-xl font-bold text-foreground">
                                    {viewingSubmission.userName} · {viewingSubmission.college || 'Notre Dame College'}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    {viewingSubmission.examName || 'HSC Physics National Mock #08'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 flex flex-col gap-4 text-sm">
                                {/* Scorecard Highlight */}
                                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border text-center">
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">National Rank</div>
                                        <div className="text-lg font-black text-primary mt-0.5">
                                            #{viewingSubmission.meritRank || 1}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">Final Score</div>
                                        <div className="text-lg font-black text-emerald-600 mt-0.5">
                                            {viewingSubmission.price || 24.5} / 25
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">Accuracy</div>
                                        <div className="text-lg font-black text-foreground mt-0.5">
                                            {viewingSubmission.accuracy || 98}%
                                        </div>
                                    </div>
                                </div>

                                {/* Subject Breakdown */}
                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                                        Subject-Wise Accuracy Breakdown
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {diagnosticBreakdown.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3 rounded-lg border border-border bg-card flex items-center justify-between text-xs"
                                            >
                                                <div>
                                                    <span className="font-bold text-foreground block">{item.subject}</span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {item.correct} / {item.total} MCQs Correct
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-emerald-600">{item.accuracy}%</span>
                                                    <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* StudyBuddy AI Diagnostic Recommendation */}
                                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                                    <div className="font-bold text-foreground flex items-center gap-1.5 text-primary mb-1">
                                        <Sparkles className="size-3.5" />
                                        <span>StudyBuddy AI Diagnostic Note:</span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        ভেক্টর ও গতিবিদ্যা চ্যাপ্টারে শিক্ষার্থী শতভাগ পারফর্ম করেছে। তবে কাজ-শক্তি-ক্ষমতার স্প্রিং রিলেটেড সমস্যা সমাধান করতে আরও ২ মিনিট বেশি সময় লেগেছে। পুনরাবৃত্তির জন্য ভুল খাতায় ১টি প্রশ্ন যুক্ত করা হয়েছে।
                                    </p>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        onClick={() => setIsDiagnosticOpen(false)}
                                        className="bg-primary text-primary-foreground text-xs font-semibold"
                                    >
                                        Close Diagnostic
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

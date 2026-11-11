import { useState, useMemo } from 'react'
import {
    Calendar,
    Clock,
    FileText,
    Download,
    Play,
    Search,
    BookOpen,
    CheckCircle2,
    Layers,
    Filter,
    Plus,
    X,
    Sparkles,
} from 'lucide-react'
import type { Inventory } from '@/types/inventory'
import type { FilterState } from '@/components/shared/searching'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface InventoryUIProps {
    inventory: Inventory[]
    totalInventory: number
    page: number
    limit: number
    searchQuery: string
    onSearchChange: (q: string) => void
    filters: FilterState[]
    onFiltersChange: (filters: FilterState[]) => void
    onResetSearch: () => void
    onRestock: (id: number) => void
    onExport: () => void
    isLoading?: boolean
}

export function InventoryUI({
    inventory,
    totalInventory,
    page: _page,
    limit: _limit,
    searchQuery,
    onSearchChange,
    filters: _filters,
    onFiltersChange: _onFiltersChange,
    onResetSearch: _onResetSearch,
    onRestock,
    onExport,
    isLoading = false,
}: InventoryUIProps) {
    const [selectedStream, setSelectedStream] = useState<string>('all')
    const [selectedExam, setSelectedExam] = useState<Inventory | null>(null)
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false)
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const [simulatorTime, setSimulatorTime] = useState(25 * 60)
    const [isExamSubmitted, setIsExamSubmitted] = useState(false)
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})

    const streams = [
        { id: 'all', label: 'All Routines & Tests' },
        { id: 'HSC Science', label: 'HSC 2026 Science' },
        { id: 'Engineering', label: 'BUET & Engineering' },
        { id: 'Medical', label: 'Medical Admission' },
        { id: 'Varsity A-Unit', label: 'Dhaka University (DU)' },
    ]

    const filteredList = useMemo(() => {
        let list = inventory
        if (selectedStream !== 'all') {
            list = list.filter((item) => item.category?.toLowerCase().includes(selectedStream.toLowerCase()))
        }
        return list
    }, [inventory, selectedStream])

    const handleViewRoutine = (exam: Inventory) => {
        setSelectedExam(exam)
        setIsRoutineModalOpen(true)
    }

    const handleStartExam = (exam: Inventory) => {
        setSelectedExam(exam)
        setSimulatorTime(25 * 60)
        setUserAnswers({})
        setIsExamSubmitted(false)
        setIsSimulatorOpen(true)
    }

    const handleDownloadSyllabus = (exam: Inventory) => {
        onRestock(exam.id)
        toast.success(`Exam routine & syllabus PDF downloaded for ${exam.name}`, {
            description: 'Saved to your offline StudyBuddy notes folder.',
        })
    }

    const sampleExamQuestions = [
        {
            id: 1,
            q: 'ভেক্টর A = 2i + 2j এবং B = -i + j এর মধ্যবর্তী কোণ কত?',
            options: ['45°', '90°', '60°', '120°'],
            correct: 1,
            explanation: 'A · B = (2)(-1) + (2)(1) = 0। ডট গুণফল শূন্য হওয়ায় কোণ ৯০°।',
        },
        {
            id: 2,
            q: 'নিচের কোনটির স্থিতিস্থাপক ক্লান্তি ঘটে না?',
            options: ['কোয়ার্টজ', 'ইস্পাত', 'তামা', 'কাচ'],
            correct: 0,
            explanation: 'কোয়ার্টজের ক্ষেত্রে কোনো স্থিতিস্থাপক ক্লান্তি পরিলক্ষিত হয় না।',
        },
        {
            id: 3,
            q: 'মহাকর্ষীয় বিভবের একক কোনটি?',
            options: ['J kg⁻¹', 'J kg⁻²', 'N kg⁻¹', 'N m'],
            correct: 0,
            explanation: 'V = W/m, সুতরাং একক জুল প্রতি কিলোগ্রাম (J kg⁻¹)।',
        },
        {
            id: 4,
            q: 'একটি সরল ছন্দিত স্পন্দনের বিস্তার A হলে, সাম্যাবস্থায় এর গতিশক্তি কত?',
            options: ['শূন্য', 'সর্বোচ্চ (½kA²)', '½kA', '¼kA²'],
            correct: 1,
            explanation: 'সাম্যাবস্থায় বিভব শক্তি শূন্য এবং সমস্ত শক্তি গতিশক্তিতে রূপান্তরিত হয় (½kA²)।',
        },
    ]

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header & KPI Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                        <Calendar className="size-3.5" />
                        <span>Academic Calendar · Model Tests & Admission Schedules</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Routines & Test Papers
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upcoming national model tests, university admission unit routines, and authentic past question papers.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Button variant="outline" size="sm" onClick={onExport} className="gap-2 text-xs font-semibold">
                        <Download className="size-4" />
                        <span>Export Routine PDF</span>
                    </Button>
                </div>
            </div>

            {/* Metric Clusters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Layers className="size-4 text-emerald-600" />
                        <span>Active Test Papers</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">{totalInventory} Papers</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">17 Live DU Admission Mocks</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Clock className="size-4 text-primary" />
                        <span>Duration Standard</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">25 - 90 Min</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Standard Negative 0.25</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <BookOpen className="size-4 text-purple-600" />
                        <span>Questions Per Test</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">50 - 100 MCQs</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Full syllabus & chapter-wise</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <CheckCircle2 className="size-4 text-sky-600" />
                        <span>National Ranking</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">Live Merit List</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Instant percentile & scorecard</div>
                </div>
            </div>

            {/* Search & Stream Filter Bar */}
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
                        placeholder="Search routines or test paper code..."
                        className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Test Papers Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 rounded-xl border border-border bg-card animate-pulse p-5" />
                    ))}
                </div>
            ) : filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
                    <FileText className="size-10 text-muted-foreground mb-3" />
                    <h3 className="font-bold text-base text-foreground">No Test Papers Found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Try clearing your search query or switching to another academic stream.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredList.map((exam) => {
                        const candidates = exam.availableStock || 2500
                        const isLive = exam.status === 'In stock'

                        return (
                            <div
                                key={exam.id}
                                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div>
                                    {/* Top Metadata */}
                                    <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-primary">{exam.category}</span>
                                            <span aria-hidden="true">·</span>
                                            <span className="font-mono text-[11px]">{exam.sku}</span>
                                        </div>
                                        {isLive ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Live Test
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                                Scheduled
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                        {exam.name}
                                    </h3>

                                    {/* Exam details line */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3 py-2 border-y border-border/60">
                                        <div className="flex items-center gap-1">
                                            <Clock className="size-3.5 text-muted-foreground" />
                                            <span>25 Mins</span>
                                        </div>
                                        <span aria-hidden="true">·</span>
                                        <div className="flex items-center gap-1">
                                            <FileText className="size-3.5 text-muted-foreground" />
                                            <span>50 MCQs</span>
                                        </div>
                                        <span aria-hidden="true">·</span>
                                        <span>Full Marks: {exam.unitPrice || 50}</span>
                                    </div>

                                    {/* Candidate Registration Progress */}
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                                            <span>Enrolled Examinees</span>
                                            <span className="font-semibold text-foreground">{candidates.toLocaleString()} Students</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${Math.min(100, Math.round((candidates / 5000) * 100))}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-2">
                                    <Button
                                        onClick={() => handleStartExam(exam)}
                                        size="sm"
                                        className="flex-1 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs"
                                    >
                                        <Play className="size-3.5 fill-current" />
                                        <span>Take Test</span>
                                    </Button>

                                    <Button
                                        onClick={() => handleViewRoutine(exam)}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs font-medium"
                                    >
                                        Syllabus
                                    </Button>

                                    <Button
                                        onClick={() => handleDownloadSyllabus(exam)}
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-muted-foreground hover:text-foreground"
                                        title="Download PDF"
                                    >
                                        <Download className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ROUTINE & SYLLABUS DETAIL MODAL */}
            <Dialog open={isRoutineModalOpen} onOpenChange={setIsRoutineModalOpen}>
                <DialogContent className="sm:max-w-xl bg-background border-border">
                    {selectedExam && (
                        <div>
                            <DialogHeader>
                                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                                    {selectedExam.category} · {selectedExam.sku}
                                </div>
                                <DialogTitle className="text-xl font-bold text-foreground">
                                    {selectedExam.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    Official StudyBuddy Academic Routine & Question Distribution Matrix
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 flex flex-col gap-4 text-sm">
                                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">Exam Date & Window</div>
                                        <div className="font-bold text-foreground text-xs mt-0.5">Live Every Saturday & Tuesday</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">Marking Scheme</div>
                                        <div className="font-bold text-foreground text-xs mt-0.5">+1.00 Correct, -0.25 Negative</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                                        Included Chapters & Syllabus Coverage
                                    </h4>
                                    <ul className="flex flex-col gap-2 text-xs text-foreground/90">
                                        <li className="flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-primary" />
                                            <span>ভেক্টর ও দ্বিমাত্রিক গতি (Vector & 2D Motion) - 15 MCQs</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-primary" />
                                            <span>নিউটনীয় বলবিদ্যা ও কাজ-শক্তি-ক্ষমতা (Newtonian Mechanics) - 15 MCQs</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-primary" />
                                            <span>মহাকর্ষ ও অভিকর্ষ (Gravitation) - 10 MCQs</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-primary" />
                                            <span>পদার্থের গাঠনিক ধর্ম (Structural Properties of Matter) - 10 MCQs</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-3 border-t border-border flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadSyllabus(selectedExam)}
                                        className="gap-2 text-xs"
                                    >
                                        <Download className="size-3.5" />
                                        <span>Download Full PDF</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setIsRoutineModalOpen(false)
                                            handleStartExam(selectedExam)
                                        }}
                                        className="gap-1.5 bg-primary text-primary-foreground font-semibold text-xs"
                                    >
                                        <Play className="size-3.5 fill-current" />
                                        <span>Start Exam Now</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* LIVE EXAM SIMULATOR MODAL */}
            <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
                <DialogContent className="sm:max-w-2xl bg-background border-border max-h-[90vh] overflow-y-auto">
                    {selectedExam && (
                        <div>
                            <DialogHeader className="border-b border-border pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <DialogTitle className="text-lg font-bold text-foreground">
                                            {selectedExam.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                            Official StudyBuddy Timed Simulation · +1.00 Correct, -0.25 Negative
                                        </DialogDescription>
                                    </div>
                                    {!isExamSubmitted && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card border border-primary/30 text-primary font-mono font-bold text-xs">
                                            <Clock className="size-3.5" />
                                            <span>24:50</span>
                                        </div>
                                    )}
                                </div>
                            </DialogHeader>

                            {!isExamSubmitted ? (
                                <div className="mt-4 flex flex-col gap-5">
                                    {sampleExamQuestions.map((qItem, idx) => (
                                        <div key={qItem.id} className="p-4 rounded-xl border border-border bg-card/60">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                                <span className="font-semibold text-foreground">প্রশ্ন {idx + 1} / 4</span>
                                                <span>১.০০ নম্বর</span>
                                            </div>
                                            <h4 className="font-bold text-sm text-foreground mb-3">{qItem.q}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {qItem.options.map((opt, optIdx) => {
                                                    const isChecked = userAnswers[idx] === optIdx
                                                    return (
                                                        <button
                                                            key={optIdx}
                                                            type="button"
                                                            onClick={() => setUserAnswers((p) => ({ ...p, [idx]: optIdx }))}
                                                            className={cn(
                                                                'p-2.5 text-xs text-left rounded-lg border font-medium transition-all flex items-center gap-2 cursor-pointer',
                                                                isChecked
                                                                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                                    : 'border-border bg-card hover:bg-muted text-foreground',
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    'size-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0',
                                                                    isChecked
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted text-muted-foreground',
                                                                )}
                                                            >
                                                                {String.fromCharCode(65 + optIdx)}
                                                            </span>
                                                            <span>{opt}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-3 border-t border-border flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            {Object.keys(userAnswers).length} of 4 questions answered
                                        </span>
                                        <Button
                                            onClick={() => {
                                                setIsExamSubmitted(true)
                                                toast.success('পরীক্ষা সফলভাবে জমা হয়েছে! ফলাফল দেখুন।')
                                            }}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                                        >
                                            Submit Paper
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 flex flex-col gap-4 text-center p-4">
                                    <div className="size-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground">Score: 3.75 / 4.00</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            জাতীয় মেধাতালিকা র‍্যাঙ্ক: <span className="font-bold text-primary">#১ (Top 0.5%)</span> · নির্ভুলতা: ৯২%
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setIsSimulatorOpen(false)}
                                        className="bg-primary text-primary-foreground text-xs font-semibold w-full sm:w-auto mx-auto mt-2"
                                    >
                                        Close & Return to Dashboard
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

import { useState, useEffect, useMemo } from 'react'
import {
    Activity,
    AlertCircle,
    ArrowRight,
    Award,
    BookOpen,
    Bot,
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    Flame,
    GraduationCap,
    HelpCircle,
    Layers,
    Play,
    RefreshCw,
    RotateCcw,
    Sparkles,
    Timer,
    TrendingUp,
    Trophy,
    X,
    XCircle,
    Zap,
} from 'lucide-react'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { studyBuddyApi } from '@/api/studybuddy'

export interface DashboardUIProps {
    overview?: unknown
    isLoading?: boolean
}

// -----------------------------------------------------------------------------
// Sample Practice & Exam Dataset
// -----------------------------------------------------------------------------
interface MCQQuestion {
    id: number
    subject: string
    chapter: string
    question: string
    options: string[]
    correctIndex: number
    explanation: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
}

const SAMPLE_MCQS: MCQQuestion[] = [
    {
        id: 1,
        subject: 'Physics',
        chapter: 'Vectors (ভেক্টর)',
        question: 'যদি দুটি ভেক্টর A = 2i + 2j এবং B = -i + j হয়, তবে তাদের মধ্যবর্তী কোণ কত?',
        options: ['45°', '90°', '60°', '120°'],
        correctIndex: 1,
        explanation:
            'A · B = (2)(-1) + (2)(1) = -2 + 2 = 0। যেহেতু দুটি ভেক্টরের ডট গুণফল শূন্য, তাই ভেক্টরদ্বয় পরস্পরের ওপর লম্ব অর্থাৎ মধ্যবর্তী কোণ 90°।',
        difficulty: 'Medium',
    },
    {
        id: 2,
        subject: 'Chemistry',
        chapter: 'Periodic Table (পর্যায় সারণি)',
        question: 'নিচের কোন মৌলটির প্রথম আয়নীকরণ শক্তি (First Ionization Energy) সর্বাধিক?',
        options: ['নাইট্রোজেন (N)', 'অক্সিজেন (O)', 'কার্বন (C)', 'বোরন (B)'],
        correctIndex: 0,
        explanation:
            'নাইট্রোজেনের ইলেকট্রন বিন্যাস 1s² 2s² 2p³। এর 2p অরবিটাল অর্ধপূর্ণ (Half-filled) হওয়ায় এটি অতিরিক্ত সুস্থিতি লাভ করে, ফলে অক্সিজেন অপেক্ষা নাইট্রোজেনের প্রথম আয়নীকরণ শক্তি বেশি।',
        difficulty: 'Hard',
    },
    {
        id: 3,
        subject: 'Higher Math',
        chapter: 'Calculus (অন্তরীকরণ)',
        question: 'lim (x → 0) [sin(3x) / x] এর মান কত?',
        options: ['0', '1', '3', 'অসীম (∞)'],
        correctIndex: 2,
        explanation:
            'আমরা জানি, lim (θ → 0) [sin(θ) / θ] = 1। সুতরাং lim (x → 0) [sin(3x) / (3x)] × 3 = 1 × 3 = 3।',
        difficulty: 'Easy',
    },
    {
        id: 4,
        subject: 'Biology',
        chapter: 'Cell & Its Structure (কোষ ও এর গঠন)',
        question: 'প্রোটিন সংশ্লেষণের প্রধান স্থান (Protein Factory) কোনটি?',
        options: ['মাইটোকন্ড্রিয়া', 'রাইবোজোম', 'গলগি বস্তু', 'লাইসোজোম'],
        correctIndex: 1,
        explanation:
            'রাইবোজোম এম-আরএনএ (mRNA) এর সংকেত অনুযায়ী অ্যামিনো এসিড যুক্ত করে পলিপেপটাইড বা প্রোটিন তৈরি করে, তাই একে কোষের প্রোটিন ফ্যাক্টরি বলা হয়।',
        difficulty: 'Easy',
    },
]

const LIVE_MODEL_TESTS = [
    {
        id: 'mock-101',
        title: 'HSC Physics 1st Paper: Mechanics & Vectors',
        subtitle: 'জাতীয় লাইভ মডেল টেস্ট #০৮',
        subject: 'Physics',
        durationMins: 30,
        questionCount: 25,
        marks: 25,
        negativeMark: 0.25,
        status: 'live' as const,
        enrolledCount: 3840,
        startsIn: 'চলমান (LIVE NOW)',
        syllabus: 'ভেক্টর, নিউটনিয়ান বলবিদ্যা, কাজ শক্তি ও ক্ষমতা',
    },
    {
        id: 'mock-102',
        title: 'BUET Admission Special: Higher Math Blitz 04',
        subtitle: 'ইঞ্জিনিয়ারিং স্পেশাল মডেল টেস্ট',
        subject: 'Higher Math',
        durationMins: 45,
        questionCount: 20,
        marks: 100,
        negativeMark: 1.0,
        status: 'upcoming' as const,
        enrolledCount: 2150,
        startsIn: 'শুরু হবে আজ বিকাল ৪:০০ টায়',
        syllabus: 'অন্তরীকরণ, যোগজীকরণ, কণিক ও স্থানাঙ্ক জ্যামিতি',
    },
    {
        id: 'mock-103',
        title: 'Medical Admission Marathon: Biology & Chem 100',
        subtitle: 'মেডিকেল স্পেশাল পূর্ণাঙ্গ মডেল টেস্ট',
        subject: 'Biology & Chemistry',
        durationMins: 60,
        questionCount: 100,
        marks: 100,
        negativeMark: 0.25,
        status: 'upcoming' as const,
        enrolledCount: 4320,
        startsIn: 'আগামীকাল রাত ৮:০০ টায়',
        syllabus: 'মানব শারীরতত্ত্ব, কোষরসায়ন, গুণগত রসায়ন ও পরিবেশ রসায়ন',
    },
]

const SUBJECTS_DATA = [
    {
        id: 'phy',
        name: 'পদার্থবিজ্ঞান (Physics)',
        code: 'PHY 101/102',
        icon: '⚛️',
        progress: 78,
        chaptersCompleted: 14,
        totalChapters: 18,
        mcqsSolved: 640,
        accuracy: 88,
        color: 'emerald',
    },
    {
        id: 'chem',
        name: 'রসায়ন (Chemistry)',
        code: 'CHE 101/102',
        icon: '🧪',
        progress: 69,
        chaptersCompleted: 11,
        totalChapters: 16,
        mcqsSolved: 520,
        accuracy: 82,
        color: 'teal',
    },
    {
        id: 'math',
        name: 'উচ্চতর গণিত (Higher Math)',
        code: 'MTH 101/102',
        icon: '📐',
        progress: 64,
        chaptersCompleted: 9,
        totalChapters: 14,
        mcqsSolved: 480,
        accuracy: 76,
        color: 'sky',
    },
    {
        id: 'bio',
        name: 'জীববিজ্ঞান (Biology)',
        code: 'BIO 101/102',
        icon: '🧬',
        progress: 81,
        chaptersCompleted: 13,
        totalChapters: 16,
        mcqsSolved: 710,
        accuracy: 91,
        color: 'emerald',
    },
    {
        id: 'ict',
        name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
        code: 'ICT 101',
        icon: '💻',
        progress: 75,
        chaptersCompleted: 6,
        totalChapters: 8,
        mcqsSolved: 240,
        accuracy: 85,
        color: 'amber',
    },
    {
        id: 'eng',
        name: 'বাংলা ও ইংরেজি (Bangla & English)',
        code: 'LANG 101',
        icon: '📖',
        progress: 86,
        chaptersCompleted: 12,
        totalChapters: 14,
        mcqsSolved: 390,
        accuracy: 89,
        color: 'purple',
    },
]

const LEADERBOARD_USERS = [
    { rank: 1, name: 'Anik Hasan', college: 'Notre Dame College, Dhaka', score: 98.5, streak: 28, xp: 4820, avatar: '👨‍🎓' },
    { rank: 2, name: 'Sumaiya Rahman', college: 'Viqarunnisa Noon College', score: 96.0, streak: 24, xp: 4650, avatar: '👩‍🎓' },
    { rank: 3, name: 'Rafiqul Islam', college: 'Rajuk Uttara Model College', score: 95.0, streak: 21, xp: 4490, avatar: '👨‍🎓' },
    { rank: 4, name: 'Sadia Afrin', college: 'Holy Cross College', score: 94.5, streak: 19, xp: 4210, avatar: '👩‍🎓' },
    { rank: 5, name: 'Tahmid Chowdhury', college: 'Dhaka College', score: 93.0, streak: 16, xp: 4050, avatar: '👨‍🎓' },
]

const WEEKLY_PRACTICE_DATA = [
    { day: 'শনিবার', solved: 45, accuracy: 84 },
    { day: 'রবিবার', solved: 60, accuracy: 88 },
    { day: 'সোমবার', solved: 35, accuracy: 80 },
    { day: 'মঙ্গলবার', solved: 55, accuracy: 86 },
    { day: 'বুধবার', solved: 70, accuracy: 91 },
    { day: 'বৃহস্পতিবার', solved: 50, accuracy: 85 },
    { day: 'শুক্রবার', solved: 80, accuracy: 92 },
]

export function DashboardUI({ isLoading = false }: DashboardUIProps) {
    // Quick Practice Interactive State
    const [quickQuestionIndex, setQuickQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)

    // Live Exam Simulator State
    const [isExamModalOpen, setIsExamModalOpen] = useState(false)
    const [examTimeLeft, setExamTimeLeft] = useState(25 * 60) // 25 minutes
    const [currentExamQuestion, setCurrentExamQuestion] = useState(0)
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
    const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({})
    const [isExamSubmitted, setIsExamSubmitted] = useState(false)

    // Mistake Notebook Modal State
    const [isMistakesModalOpen, setIsMistakesModalOpen] = useState(false)
    // AI Doubt Solver Modal State
    const [isAiSolverOpen, setIsAiSolverOpen] = useState(false)
    const [aiQuery, setAiQuery] = useState('')
    const [aiAnswer, setAiAnswer] = useState<string | null>(null)
    const [isAiLoading, setIsAiLoading] = useState(false)

    // Dynamic StudyBuddy Live Data
    const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>(SAMPLE_MCQS)
    const [leaderboardList, setLeaderboardList] = useState(LEADERBOARD_USERS)
    const [activeStreakCount, setActiveStreakCount] = useState<number>(7)

    const activeQuestion = mcqQuestions[quickQuestionIndex % mcqQuestions.length] || SAMPLE_MCQS[0]

    useEffect(() => {
        let isMounted = true

        // 1. Fetch authentic admission exam questions
        studyBuddyApi.exams
            .questions({ examId: 'HKtUZhw2DU1cm3xV' })
            .then((data: any) => {
                if (!isMounted) return
                const questions = Array.isArray(data?.questions)
                    ? data.questions
                    : Array.isArray(data)
                      ? data
                      : []
                if (questions.length > 0) {
                    const mapped: MCQQuestion[] = questions.map((q: any, idx: number) => {
                        const options = Array.isArray(q.options)
                            ? q.options.map((o: any) => (typeof o === 'string' ? o : o.text || o.optionText || ''))
                            : ['বিকল্প ১', 'বিকল্প ২', 'বিকল্প ৩', 'বিকল্প ৪']
                        const correctIdx = Array.isArray(q.options)
                            ? q.options.findIndex((o: any) => o.isCorrect || o.correct)
                            : 0
                        return {
                            id: idx + 1,
                            subject: q.subject || 'ঢাবি বিজ্ঞান অনুষদ (DU Unit A)',
                            chapter: q.topic || 'পদার্থবিজ্ঞান ও রসায়ন মডেল টেস্ট',
                            question: q.text || q.questionText || `প্রশ্ন ${idx + 1}`,
                            options,
                            correctIndex: correctIdx >= 0 ? correctIdx : 0,
                            explanation:
                                q.explanation || 'সঠিক উত্তরটি মূল পাঠ্যবই এবং বিগত বছরের ঢাবি ভর্তি পরীক্ষার প্রশ্নের সমাধান থেকে নেওয়া।',
                            difficulty: 'Medium' as const,
                        }
                    })
                    setMcqQuestions(mapped)
                }
            })
            .catch(() => {})

        // 2. Fetch live leaderboard
        studyBuddyApi.leaderboard
            .list(1, 8)
            .then((res: any) => {
                if (!isMounted) return
                const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
                if (list.length > 0) {
                    const mapped = list.map((item: any, idx: number) => ({
                        rank: item.rank || idx + 1,
                        name: item.name || `Scholar ${idx + 1}`,
                        college: item.college || (idx % 2 === 0 ? 'Notre Dame College' : 'Viqarunnisa Noon College'),
                        score: item.score || Math.max(75, Math.round(98 - idx * 2.5)),
                        streak: item.streakDays || Math.max(3, 28 - idx * 2),
                        xp: item.xpPoints || 5000 - idx * 350,
                        avatar: idx % 2 === 0 ? '👨‍🎓' : '👩‍🎓',
                    }))
                    setLeaderboardList(mapped)
                }
            })
            .catch(() => {})

        // 3. Fetch active user streak
        studyBuddyApi.streaks
            .getMyStreak()
            .then((res: any) => {
                if (!isMounted) return
                if (res?.currentStreak !== undefined && res.currentStreak > 0) {
                    setActiveStreakCount(res.currentStreak)
                }
            })
            .catch(() => {})

        return () => {
            isMounted = false
        }
    }, [])

    // Timer countdown for exam simulator
    useEffect(() => {
        if (!isExamModalOpen || isExamSubmitted) return
        const timer = setInterval(() => {
            setExamTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [isExamModalOpen, isExamSubmitted])

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleQuickOptionClick = (index: number) => {
        if (selectedOption !== null) return
        setSelectedOption(index)
        setShowExplanation(true)
        if (index === activeQuestion.correctIndex) {
            toast.success('সঠিক উত্তর! (Correct Answer)', {
                description: '+10 XP যোগ হয়েছে',
            })
        } else {
            toast.error('ভুল উত্তর! (Incorrect Answer)', {
                description: 'সঠিক ব্যাখ্যাটি নিচে দেখে নাও',
            })
        }
    }

    const handleNextQuickQuestion = () => {
        setSelectedOption(null)
        setShowExplanation(false)
        setQuickQuestionIndex((prev) => (prev + 1) % mcqQuestions.length)
    }

    const startExamSimulation = () => {
        setIsExamModalOpen(true)
        setExamTimeLeft(25 * 60)
        setCurrentExamQuestion(0)
        setUserAnswers({})
        setMarkedForReview({})
        setIsExamSubmitted(false)
    }

    const submitExamSimulation = () => {
        setIsExamSubmitted(true)
        toast.success('মডেল টেস্ট সফলভাবে জমা হয়েছে!', {
            description: 'আপনার জাতীয় মেধাতালিকা ও বিস্তারিত ফলাফল নিচে দেখুন',
        })
    }

    const handleAskAi = async (presetQuestion?: string) => {
        const query = presetQuestion ?? aiQuery
        if (!query.trim()) return
        setIsAiLoading(true)
        setAiAnswer(null)

        try {
            const res = await studyBuddyApi.chat.send({ message: query })
            const reply = res?.data?.reply || res?.reply || res?.message || res?.data?.message
            if (reply) {
                setAiAnswer(`💡 StudyBuddy AI Solver:\n\n${reply}`)
                setIsAiLoading(false)
                return
            }
        } catch (e) {
            console.warn('AI chat API fallback:', e)
        }

        setTimeout(() => {
            setIsAiLoading(false)
            setAiAnswer(
                `💡 StudyBuddy AI বিশ্লেষণ:\n\nপ্রশ্নটি ${query.includes('ভেক্টর') ? 'ভেক্টর ও গতিবিদ্যা' : 'পদার্থবিজ্ঞান ও রসায়ন'} বিষয়ের গুরুত্বপূর্ণ ধারণার ওপর ভিত্তি করে তৈরি।\n\n১. মূল সূত্র: কোনো ভেক্টরের ডট গুণফল A · B = |A||B| cos(θ)। যখন ডট গুণফল শূন্য হয়, তখন cos(θ) = 0 এবং θ = 90°।\n২. শর্টকাট টিপস: i ও j এর সহগগুলোর গুণফলের সমষ্টি শূন্য হলেই বুঝতে হবে ভেক্টরদ্বয় লম্ব।\n৩. বোর্ড পরীক্ষায় এটি বহুবার এসেছে। রিভিশন তালিকায় যোগ করা হলো!`,
            )
        }, 600)
    }

    // Exam score calculation
    const examScore = useMemo(() => {
        let correct = 0
        let wrong = 0
        mcqQuestions.forEach((q, idx) => {
            if (userAnswers[idx] !== undefined) {
                if (userAnswers[idx] === q.correctIndex) {
                    correct += 1
                } else {
                    wrong += 1
                }
            }
        })
        const totalMarks = correct * 1 - wrong * 0.25
        return { correct, wrong, totalMarks, answered: Object.keys(userAnswers).length }
    }, [userAnswers])

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 w-full animate-pulse">
                <div className="h-44 rounded-2xl bg-muted/60" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="h-28 rounded-xl bg-muted/60" />
                    <div className="h-28 rounded-xl bg-muted/60" />
                    <div className="h-28 rounded-xl bg-muted/60" />
                    <div className="h-28 rounded-xl bg-muted/60" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-full pb-14 text-foreground">
            {/* 1. HERO PREPARATION PULSE (Chorcha Signature Banner) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-background to-muted/40 border border-primary/25 p-5 sm:p-7 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2 max-w-xl">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                            <span className="size-2 rounded-full bg-primary animate-ping" />
                            <span>HSC 2026 · বিজ্ঞান বিভাগ (Science Stream)</span>
                            <span className="text-muted-foreground/60">·</span>
                            <span className="text-muted-foreground font-normal">বোর্ড পরীক্ষা বাকি ১৪২ দিন</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            স্বাগতম, তানভীর আহমেদ! 👋
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            আজকের লক্ষ্য ৪০টি MCQ সমাধান করা। তুমি ইতিমধ্যে ২৮টি সম্পন্ন করেছ! ধারাবাহিকতা বজায় রাখো।
                        </p>

                        {/* Daily Target Progress */}
                        <div className="mt-2 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-foreground font-semibold">আজকের অগ্রগতি (Daily Goal)</span>
                                <span className="text-primary font-bold">২৮ / ৪০ সম্পন্ন (৭০%)</span>
                            </div>
                            <Progress value={70} className="h-2.5 bg-primary/15" />
                        </div>
                    </div>

                    {/* Stats Metric Clusters & Quick Launcher */}
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                        <div className="flex items-center gap-3 bg-card/90 border border-border/80 rounded-xl p-3.5 shadow-2xs">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                <Flame className="size-5" />
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground font-medium">ধারাবাহিকতা (Streak)</div>
                                <div className="text-lg font-bold text-foreground flex items-center gap-1">
                                    <span>{activeStreakCount} দিন</span>
                                    <span className="text-[10px] text-amber-600 font-semibold bg-amber-500/10 px-1 rounded">সক্রিয়</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-card/90 border border-border/80 rounded-xl p-3.5 shadow-2xs">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                <Trophy className="size-5" />
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground font-medium">জাতীয় র‍্যাঙ্ক (Merit Rank)</div>
                                <div className="text-lg font-bold text-foreground">#১৪ <span className="text-xs text-muted-foreground font-normal">(Top 0.8%)</span></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-card/90 border border-border/80 rounded-xl p-3.5 shadow-2xs">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground font-medium">গড় নির্ভুলতা (Accuracy)</div>
                                <div className="text-lg font-bold text-foreground">৮৭.৫%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center gap-3">
                    <Button onClick={startExamSimulation} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
                        <Play className="size-4 fill-current" />
                        <span>লাইভ পরীক্ষা দাও (Live Exam)</span>
                    </Button>
                    <Button onClick={() => setIsMistakesModalOpen(true)} variant="outline" className="gap-2 border-border bg-card hover:bg-muted font-medium">
                        <BookOpen className="size-4 text-primary" />
                        <span>ভুল খাতা (১৪টি প্রশ্ন)</span>
                    </Button>
                    <Button onClick={() => setIsAiSolverOpen(true)} variant="secondary" className="gap-2 font-medium">
                        <Bot className="size-4 text-primary" />
                        <span>StudyBuddy AI ডাউট সলভার</span>
                    </Button>
                </div>
            </div>

            {/* 2. STUDYBUDDY 4 PILLARS (Interactive Quick Launchers) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    onClick={() => toast.info('অধ্যায়ভিত্তিক প্রশ্ন তালিকা লোড হচ্ছে...')}
                    className="group cursor-pointer rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                            <Layers className="size-5" />
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                            চর্চা শুরু <ChevronRight className="size-3.5 ml-0.5" />
                        </span>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-bold text-base text-foreground">অধ্যায়ভিত্তিক চর্চা</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">টপিক অনুযায়ী ১ লক্ষ+ MCQ অনুশীলন</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/60 text-xs text-muted-foreground font-medium flex items-center justify-between">
                        <span>১,৪২০ প্রশ্ন সমাধান</span>
                        <span className="text-primary font-semibold">৮৪% সঠিক</span>
                    </div>
                </div>

                <div
                    onClick={startExamSimulation}
                    className="group cursor-pointer rounded-xl border border-primary/30 bg-primary/5 p-4 transition-all hover:border-primary/60 hover:shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            <Timer className="size-5" />
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <span className="size-1.5 rounded-full bg-primary animate-ping" />
                            লাইভ চলছে
                        </span>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-bold text-base text-foreground">লাইভ মডেল টেস্ট</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">টাইমড এক্সাম ও জাতীয় মেধাতালিকা</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-primary/20 text-xs text-muted-foreground font-medium flex items-center justify-between">
                        <span>১২টি পরীক্ষা সম্পন্ন</span>
                        <span className="text-primary font-semibold">গড় ৮৬.৪</span>
                    </div>
                </div>

                <div
                    onClick={() => setIsMistakesModalOpen(true)}
                    className="group cursor-pointer rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-destructive/40 hover:shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                            <AlertCircle className="size-5" />
                        </div>
                        <span className="text-xs text-rose-600 font-semibold group-hover:underline flex items-center">
                            রিভিশন <ChevronRight className="size-3.5 ml-0.5" />
                        </span>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-bold text-base text-foreground">ভুল খাতা (Mistake Bank)</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">পূর্বে ভুল হওয়া প্রশ্নগুলো পুনরায় চর্চা</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/60 text-xs text-muted-foreground font-medium flex items-center justify-between">
                        <span className="text-rose-600 font-semibold">১৪টি প্রশ্ন বাকি</span>
                        <span>৪টি রিভিশন সম্পন্ন</span>
                    </div>
                </div>

                <div
                    onClick={() => setIsAiSolverOpen(true)}
                    className="group cursor-pointer rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-sky-500/40 hover:shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                            <Sparkles className="size-5" />
                        </div>
                        <span className="text-xs text-sky-600 font-semibold group-hover:underline flex items-center">
                            জিজ্ঞাসা করো <ChevronRight className="size-3.5 ml-0.5" />
                        </span>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-bold text-base text-foreground">StudyBuddy AI সলভার</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">গণিত ও বিজ্ঞানের যেকোনো ডাউট সমাধান</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/60 text-xs text-muted-foreground font-medium flex items-center justify-between">
                        <span>২৪/৭ সক্রিয় সহকারী</span>
                        <span className="text-sky-600 font-semibold">ইনস্ট্যান্ট স্টেপস</span>
                    </div>
                </div>
            </div>

            {/* 3. LIVE & UPCOMING MODEL TESTS (চলমান ও আসন্ন মডেল টেস্ট) */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <span>চলমান ও আসন্ন মডেল টেস্ট</span>
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                ৩টি পরীক্ষা উপলব্ধ
                            </span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            আসল বোর্ড এবং এডমিশন পরীক্ষার অনুরূপ পরিবেশে অংশ নিয়ে নিজের অবস্থান যাচাই করো
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.info('সকল রুটিন দেখানো হচ্ছে...')} className="text-xs text-primary font-semibold">
                        সবগুলো রুটিন দেখুন <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {LIVE_MODEL_TESTS.map((test) => (
                        <div
                            key={test.id}
                            className={cn(
                                'flex flex-col justify-between rounded-xl border p-4.5 transition-all bg-card shadow-2xs',
                                test.status === 'live' ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border/80',
                            )}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        {test.subject}
                                    </span>
                                    {test.status === 'live' ? (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            <span className="size-1.5 rounded-full bg-primary animate-ping" />
                                            {test.startsIn}
                                        </span>
                                    ) : (
                                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {test.startsIn}
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-bold text-base text-foreground leading-snug">{test.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{test.subtitle}</p>

                                <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>প্রশ্ন: <strong className="text-foreground">{test.questionCount}টি</strong></span>
                                    <span>সময়: <strong className="text-foreground">{test.durationMins} মিনিট</strong></span>
                                    <span>নেগেটিভ: <strong className="text-destructive font-semibold">-{test.negativeMark}</strong></span>
                                </div>

                                <div className="mt-2 text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg">
                                    <strong>সিলেবাস:</strong> {test.syllabus}
                                </div>
                            </div>

                            <div className="mt-4 pt-2">
                                {test.status === 'live' ? (
                                    <Button onClick={startExamSimulation} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5">
                                        <Play className="size-3.5 fill-current" />
                                        <span>পরীক্ষায় অংশ নিন (Join Now)</span>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => toast.success('রিমাইন্ডার সেট করা হয়েছে! পরীক্ষার ১০ মিনিট পূর্বে নোটিফিকেশন দেওয়া হবে।')}
                                        className="w-full font-medium"
                                    >
                                        রিমাইন্ডার সেট করুন (Set Alert)
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. INTERACTIVE INSTANT MCQ PRACTICE WIDGET & PERFORMANCE CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Instant MCQ Practice Card (Directly Playable on Dashboard!) */}
                <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary" />
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                    ইনস্ট্যান্ট প্র্যাকটিস (Instant MCQ)
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                                প্রশ্ন {quickQuestionIndex + 1} / {mcqQuestions.length}
                            </span>
                        </div>

                        <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-2">
                            <span>{activeQuestion.subject}</span>
                            <span>·</span>
                            <span>{activeQuestion.chapter}</span>
                            <span>·</span>
                            <span className={activeQuestion.difficulty === 'Easy' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                                {activeQuestion.difficulty}
                            </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-foreground leading-relaxed mt-1">
                            {activeQuestion.question}
                        </h3>

                        {/* Options */}
                        <div className="mt-4 flex flex-col gap-2.5">
                            {activeQuestion.options.map((option, idx) => {
                                const isSelected = selectedOption === idx
                                const isCorrect = idx === activeQuestion.correctIndex
                                const isSubmitted = selectedOption !== null

                                let optionStyle = 'border-border/80 bg-muted/20 hover:bg-muted/60 text-foreground'
                                if (isSubmitted) {
                                    if (isCorrect) {
                                        optionStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-semibold'
                                    } else if (isSelected && !isCorrect) {
                                        optionStyle = 'border-destructive bg-destructive/15 text-destructive font-semibold'
                                    } else {
                                        optionStyle = 'opacity-50 border-border/50'
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={isSubmitted}
                                        onClick={() => handleQuickOptionClick(idx)}
                                        className={cn(
                                            'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer select-none',
                                            optionStyle,
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-xs text-foreground">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span>{option}</span>
                                        </div>
                                        {isSubmitted && isCorrect && <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />}
                                        {isSubmitted && isSelected && !isCorrect && <XCircle className="size-5 text-destructive shrink-0" />}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Explanation Box */}
                        {showExplanation && (
                            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-foreground animate-in fade-in duration-200">
                                <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                                    <Check className="size-3.5" />
                                    <span>সঠিক উত্তর ও বিশদ সমাধান (Explanation)</span>
                                </div>
                                <p className="leading-relaxed text-muted-foreground">{activeQuestion.explanation}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsAiSolverOpen(true)
                                handleAskAi(activeQuestion.question)
                            }}
                            className="text-xs text-primary font-medium gap-1"
                        >
                            <Bot className="size-3.5" />
                            <span>AI সলভারে দেখুন</span>
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleNextQuickQuestion}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5"
                        >
                            <span>পরবর্তী প্রশ্ন</span>
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Weekly Analytics & Weak Chapters Diagnostic */}
                <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-base text-foreground">সাপ্তাহিক চর্চা ও নির্ভুলতা (Weekly Trend)</h3>
                                <p className="text-xs text-muted-foreground">বিগত ৭ দিনের সমাধানকৃত MCQ সংখ্যা ও নির্ভুলতার হার</p>
                            </div>
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                মোট ৩৯৫টি প্রশ্ন
                            </span>
                        </div>

                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={WEEKLY_PRACTICE_DATA}>
                                    <defs>
                                        <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            borderColor: 'var(--border)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Area type="monotone" dataKey="solved" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolved)" name="সমাধানকৃত MCQ" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Weak Chapters Diagnostic Alert (Chorcha Smart Feature) */}
                        <div className="mt-4 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
                            <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <div className="font-bold text-foreground">দুর্বল অধ্যায় সতর্কতা (Weak Chapters Alert)</div>
                                <p className="text-muted-foreground mt-0.5">
                                    রসায়নের <strong>জৈব যৌগ (Organic Chemistry)</strong> অধ্যায়ে তোমার নির্ভুলতা ৫২%। বোর্ড ও এডমিশন পরীক্ষায় ভালো করতে এই অধ্যায়ের ভুল প্রশ্নগুলো রিভিশন দাও।
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">লক্ষ্যমাত্রা: প্রতিদিন ৪০টি MCQ</span>
                        <Button variant="ghost" size="xs" onClick={() => setIsMistakesModalOpen(true)} className="text-primary font-semibold">
                            ভুলগুলো রিভিশন দিন →
                        </Button>
                    </div>
                </div>
            </div>

            {/* 5. SUBJECT MASTERY & SYLLABUS PROGRESS (বিষয়ভিত্তিক প্রস্তুতি) */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">বিষয়ভিত্তিক প্রস্তুতি ও অগ্রগতি (Subject Mastery)</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">প্রতিটি বিষয়ের সিলেবাস কভারেজ, নির্ভুলতা ও সম্পন্নকৃত অধ্যায়ের তালিকা</p>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">সিলেবাস সম্পন্ন: ৭৪%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SUBJECTS_DATA.map((sub) => (
                        <div
                            key={sub.id}
                            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4.5 shadow-2xs transition-all hover:border-primary/40"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-2xl">{sub.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-sm text-foreground">{sub.name}</h3>
                                            <span className="text-[10px] text-muted-foreground font-medium">{sub.code}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                        {sub.progress}%
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-col gap-1.5">
                                    <Progress value={sub.progress} className="h-2 bg-muted" />
                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>অধ্যায়: {sub.chaptersCompleted} / {sub.totalChapters} সম্পন্ন</span>
                                        <span className="font-medium text-foreground">{sub.mcqsSolved}টি MCQ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    নির্ভুলতা: <strong className="text-foreground">{sub.accuracy}%</strong>
                                </span>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => toast.success(`${sub.name} এর অধ্যায় তালিকা প্রস্তুত হচ্ছে`)}
                                    className="h-7 text-xs font-semibold border-border/80 hover:border-primary text-foreground hover:text-primary"
                                >
                                    অধ্যায় চর্চা
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. WEEKLY LEADING LEARNERS (সাপ্তাহিক লিডারবোর্ড) */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <span>সাপ্তাহিক লিডারবোর্ড (Leading Learners)</span>
                            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Award className="size-3" />
                                টপ পারফর্মার
                            </span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            সারাদেশের শিক্ষার্থীদের সাথে তোমার পয়েন্ট ও মেধা স্কোর তুলনা করো
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-2xs">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                            <tr>
                                <th className="p-3.5 pl-4">মেধাস্থান (Rank)</th>
                                <th className="p-3.5">শিক্ষার্থীর নাম</th>
                                <th className="p-3.5">কলেজ / শিক্ষাপ্রতিষ্ঠান</th>
                                <th className="p-3.5">ধারাবাহিকতা (Streak)</th>
                                <th className="p-3.5">নির্ভুলতা</th>
                                <th className="p-3.5 pr-4 text-right">পয়েন্ট (XP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {leaderboardList.map((student) => (
                                <tr key={student.rank} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-3.5 pl-4 font-bold text-foreground">
                                        {student.rank === 1 ? '🥇 #1' : student.rank === 2 ? '🥈 #2' : student.rank === 3 ? '🥉 #3' : `#${student.rank}`}
                                    </td>
                                    <td className="p-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">{student.avatar}</span>
                                            <span className="font-bold text-foreground">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3.5 text-xs text-muted-foreground">{student.college}</td>
                                    <td className="p-3.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                        🔥 {student.streak} দিন
                                    </td>
                                    <td className="p-3.5 text-xs font-semibold text-emerald-600">
                                        {student.score}%
                                    </td>
                                    <td className="p-3.5 pr-4 text-right font-bold text-primary">
                                        {student.xp.toLocaleString()} XP
                                    </td>
                                </tr>
                            ))}

                            {/* Active User Rank Highlight */}
                            <tr className="bg-primary/10 font-medium border-t-2 border-primary/40">
                                <td className="p-3.5 pl-4 font-extrabold text-primary">#14</td>
                                <td className="p-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-lg">🎯</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-extrabold text-foreground">তানভীর আহমেদ (তুমি)</span>
                                            <span className="text-[10px] bg-primary text-primary-foreground font-bold px-1.5 py-0.2 rounded">তুমি</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3.5 text-xs text-foreground/80">ঢাকা সিটি কলেজ</td>
                                <td className="p-3.5 text-xs font-bold text-amber-600 dark:text-amber-400">🔥 {activeStreakCount} দিন</td>
                                <td className="p-3.5 text-xs font-bold text-emerald-600">৮৭.৫%</td>
                                <td className="p-3.5 pr-4 text-right font-extrabold text-primary">২,৪৫০ XP</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================================================================= */}
            {/* LIVE EXAM SIMULATOR MODAL (Authentic Chorcha Exam Experience) */}
            {/* ================================================================= */}
            <Dialog open={isExamModalOpen} onOpenChange={setIsExamModalOpen}>
                <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-background border-border max-h-[92vh] flex flex-col">
                    {/* Header */}
                    <DialogHeader className="px-6 py-4 border-b border-border bg-muted/40 m-0 flex flex-row items-center justify-between shrink-0">
                        <div>
                            <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
                                <span>HSC Physics 1st Paper - National Mock Test #08</span>
                                <span className="text-xs font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                                    লাইভ পরীক্ষা
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                প্রতিটি সঠিক উত্তরে +১, ভুল উত্তরে -০.২৫ নম্বর কর্তন হবে।
                            </DialogDescription>
                        </div>
                        {/* Countdown Timer */}
                        {!isExamSubmitted && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-primary/30 text-primary font-mono font-bold text-sm">
                                <Clock className="size-4 animate-spin" />
                                <span>{formatTimer(examTimeLeft)}</span>
                            </div>
                        )}
                    </DialogHeader>

                    {/* Body */}
                    {!isExamSubmitted ? (
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Question Section */}
                            <div className="md:col-span-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-2 border-b border-border">
                                        <span className="font-semibold text-foreground">
                                            প্রশ্ন {currentExamQuestion + 1} / {mcqQuestions.length}
                                        </span>
                                        <span>পূর্ণমান: ১.০০ · নেগেটিভ: ০.২৫</span>
                                    </div>

                                    <h3 className="text-base font-bold text-foreground leading-relaxed">
                                        {mcqQuestions[currentExamQuestion % mcqQuestions.length]?.question}
                                    </h3>

                                    {/* Options */}
                                    <div className="mt-5 flex flex-col gap-2.5">
                                        {mcqQuestions[currentExamQuestion % mcqQuestions.length]?.options.map((opt, optIdx) => {
                                            const isChecked = userAnswers[currentExamQuestion] === optIdx
                                            return (
                                                <button
                                                    key={optIdx}
                                                    type="button"
                                                    onClick={() =>
                                                        setUserAnswers((prev) => ({
                                                            ...prev,
                                                            [currentExamQuestion]: optIdx,
                                                        }))
                                                    }
                                                    className={cn(
                                                        'w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 cursor-pointer select-none',
                                                        isChecked
                                                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                            : 'border-border/80 bg-card hover:bg-muted/50 text-foreground',
                                                    )}
                                                >
                                                    <span className={cn(
                                                        'flex size-6 shrink-0 items-center justify-center rounded-full font-bold text-xs',
                                                        isChecked ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                                                    )}>
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </span>
                                                    <span>{opt}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setMarkedForReview((prev) => ({
                                                    ...prev,
                                                    [currentExamQuestion]: !prev[currentExamQuestion],
                                                }))
                                            }
                                            className={cn(
                                                'text-xs',
                                                markedForReview[currentExamQuestion] ? 'bg-purple-500/10 text-purple-600 border-purple-500/30' : '',
                                            )}
                                        >
                                            {markedForReview[currentExamQuestion] ? 'রিভিউ মার্ক করা' : 'রিভিউ রাখুন'}
                                        </Button>
                                        {userAnswers[currentExamQuestion] !== undefined && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const copy = { ...userAnswers }
                                                    delete copy[currentExamQuestion]
                                                    setUserAnswers(copy)
                                                }}
                                                className="text-xs text-muted-foreground hover:text-destructive"
                                            >
                                                উত্তর মুছুন
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentExamQuestion === 0}
                                            onClick={() => setCurrentExamQuestion((p) => Math.max(p - 1, 0))}
                                            className="text-xs"
                                        >
                                            পূর্ববর্তী
                                        </Button>
                                        {currentExamQuestion < mcqQuestions.length - 1 ? (
                                            <Button
                                                size="sm"
                                                onClick={() => setCurrentExamQuestion((p) => p + 1)}
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                                            >
                                                পরবর্তী
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={submitExamSimulation}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                            >
                                                পরীক্ষা জমা দিন (Submit)
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Question Palette Sidebar */}
                            <div className="md:col-span-4 border-l border-border pl-6 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-muted-foreground mb-3">
                                        প্রশ্ন প্যালেট (Question Palette)
                                    </h4>
                                    <div className="grid grid-cols-5 gap-2">
                                        {mcqQuestions.map((_, idx) => {
                                            const isAnswered = userAnswers[idx] !== undefined
                                            const isReview = markedForReview[idx]
                                            const isCurrent = currentExamQuestion === idx

                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setCurrentExamQuestion(idx)}
                                                    className={cn(
                                                        'h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer border',
                                                        isCurrent ? 'ring-2 ring-primary border-primary' : '',
                                                        isAnswered
                                                            ? 'bg-emerald-500 text-white border-emerald-600'
                                                            : isReview
                                                              ? 'bg-purple-500 text-white border-purple-600'
                                                              : 'bg-muted/60 text-muted-foreground border-border hover:bg-muted',
                                                    )}
                                                >
                                                    {idx + 1}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-6 flex flex-col gap-2 text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <span className="size-3 rounded-full bg-emerald-500" />
                                            <span>উত্তর প্রদানকৃত ({Object.keys(userAnswers).length})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="size-3 rounded-full bg-purple-500" />
                                            <span>রিভিউ এর জন্য চিহ্নিত ({Object.keys(markedForReview).filter((k) => markedForReview[Number(k)]).length})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="size-3 rounded-full bg-muted border border-border" />
                                            <span>উত্তরহীন ({mcqQuestions.length - Object.keys(userAnswers).length})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border">
                                    <Button
                                        onClick={submitExamSimulation}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    >
                                        পরীক্ষা জমা দিন (Submit Exam)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Exam Results Card */
                        <div className="p-6 overflow-y-auto">
                            <div className="text-center max-w-md mx-auto py-4">
                                <div className="size-16 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                                    <Award className="size-8" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground">ফলাফল ও জাতীয় মেধা স্কোর</h3>
                                <p className="text-xs text-muted-foreground mt-1">HSC Physics 1st Paper - National Mock Test #08</p>

                                <div className="grid grid-cols-3 gap-3 my-5">
                                    <div className="bg-card p-3 rounded-xl border border-border">
                                        <div className="text-[11px] text-muted-foreground">প্রাপ্ত নম্বর</div>
                                        <div className="text-xl font-black text-primary">{examScore.totalMarks.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-card p-3 rounded-xl border border-border">
                                        <div className="text-[11px] text-muted-foreground">সঠিক উত্তর</div>
                                        <div className="text-xl font-black text-emerald-600">{examScore.correct}টি</div>
                                    </div>
                                    <div className="bg-card p-3 rounded-xl border border-border">
                                        <div className="text-[11px] text-muted-foreground">ভুল উত্তর</div>
                                        <div className="text-xl font-black text-destructive">{examScore.wrong}টি</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs text-foreground mb-6">
                                    <strong>জাতীয় র‍্যাঙ্ক অনুমান:</strong> তুমি <strong>৩,৮৪০ জন</strong> শিক্ষার্থীর মধ্যে শীর্ষ <strong>১.২%</strong> এ অবস্থান করছ!
                                </div>

                                <Button onClick={() => setIsExamModalOpen(false)} className="bg-primary text-primary-foreground font-semibold px-6">
                                    ড্যাশবোর্ডে ফিরে যান
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ================================================================= */}
            {/* MISTAKE NOTEBOOK MODAL (ভুল খাতা) */}
            {/* ================================================================= */}
            <Dialog open={isMistakesModalOpen} onOpenChange={setIsMistakesModalOpen}>
                <DialogContent className="sm:max-w-2xl bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <BookOpen className="size-5 text-rose-600" />
                            <span>ভুল খাতা (Mistake Notebook)</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            তোমার বিভিন্ন মডেল টেস্টে ভুল হওয়া প্রশ্নগুলোর স্বয়ংক্রিয় সংরক্ষণাগার। এগুলো বারবার চর্চা করে কনসেপ্ট ক্লিয়ার করো।
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 my-2 max-h-[60vh] overflow-y-auto pr-1">
                        {mcqQuestions.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-rose-500/25 bg-rose-500/5 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="font-semibold text-rose-600">{item.subject} · {item.chapter}</span>
                                    <span>ভুল হয়েছিল: ২ দিন পূর্বে</span>
                                </div>
                                <h4 className="font-bold text-sm text-foreground">{item.question}</h4>
                                <div className="text-xs text-muted-foreground bg-card p-2.5 rounded-lg border border-border">
                                    <strong className="text-emerald-600">সঠিক সমাধান:</strong> {item.explanation}
                                </div>
                                <div className="flex justify-end pt-1">
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => toast.success('প্রশ্নটি রিভিশন সম্পন্ন হিসেবে চিহ্নিত করা হলো!')}
                                        className="text-xs text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/10"
                                    >
                                        <Check className="size-3 mr-1" />
                                        ক্লিয়ার হিসেবে মার্ক করো
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================================================================= */}
            {/* CHORCHA AI DOUBT SOLVER MODAL */}
            {/* ================================================================= */}
            <Dialog open={isAiSolverOpen} onOpenChange={setIsAiSolverOpen}>
                <DialogContent className="sm:max-w-xl bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Bot className="size-5 text-primary" />
                            <span>StudyBuddy AI ডাউট সলভার</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            NCTB সিলেবাসের পদার্থ, রসায়ন বা গণিতের যেকোনো সূত্র বা প্রশ্নের ব্যাখ্যা মুহূর্তেই জেনে নাও।
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                placeholder="যেমন: কার্নো চক্রের দক্ষতা সূত্র কী? অথবা কোনো গাণিতিক সমস্যা..."
                                className="flex-1 rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                            />
                            <Button onClick={() => handleAskAi()} disabled={isAiLoading} className="bg-primary text-primary-foreground font-semibold">
                                {isAiLoading ? 'খোঁজা হচ্ছে...' : 'সমাধান নাও'}
                            </Button>
                        </div>

                        {/* Quick Concept Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-muted-foreground">জনপ্রিয় প্রশ্ন:</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setAiQuery('ভেক্টরের ডট গুণফল ও কোণ নির্ণয়')
                                    handleAskAi('ভেক্টরের ডট গুণফল ও কোণ নির্ণয়')
                                }}
                                className="px-2 py-1 rounded-md bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                            >
                                ভেক্টরের কোণ নির্ণয়
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAiQuery('আয়নন বিভব পর্যায়বৃত্ত পরিবর্তন')
                                    handleAskAi('আয়নন বিভব পর্যায়বৃত্ত পরিবর্তন')
                                }}
                                className="px-2 py-1 rounded-md bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                            >
                                আয়নন বিভব
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAiQuery('ক্যালকুলাস সীমা লিমিট শর্টকাট')
                                    handleAskAi('ক্যালকুলাস সীমা লিমিট শর্টকাট')
                                }}
                                className="px-2 py-1 rounded-md bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                            >
                                লিমিট শর্টকাট
                            </button>
                        </div>

                        {/* AI Response Display */}
                        {aiAnswer && (
                            <div className="mt-2 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground whitespace-pre-wrap leading-relaxed animate-in fade-in duration-200">
                                {aiAnswer}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

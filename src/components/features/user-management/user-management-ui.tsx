import { useState, useMemo } from 'react'
import {
    Award,
    Calendar,
    CheckCircle2,
    Flame,
    GraduationCap,
    Search,
    Shield,
    Trash2,
    UserCheck,
    Users,
    Eye,
    Ban,
    Sparkles,
    TrendingUp,
} from 'lucide-react'
import type { User } from '@/types/user'
import type { FilterState } from '@/components/shared/searching'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface UserManagementUIProps {
    users: User[]
    totalUsers: number
    page: number
    limit: number
    searchQuery: string
    onSearchChange: (q: string) => void
    filters: FilterState[]
    onFiltersChange: (filters: FilterState[]) => void
    onResetSearch: () => void
    onToggleStatus: (id: number) => void
    onDeleteUser: (id: number) => void
    onBulkDelete?: (ids: string[]) => void
    onBulkStatusChange?: (ids: string[], status: string) => void
    isLoading?: boolean
}

export function UserManagementUI({
    users,
    totalUsers,
    page: _page,
    limit: _limit,
    searchQuery,
    onSearchChange,
    filters: _filters,
    onFiltersChange: _onFiltersChange,
    onResetSearch: _onResetSearch,
    onToggleStatus,
    onDeleteUser,
    onBulkDelete: _onBulkDelete,
    onBulkStatusChange: _onBulkStatusChange,
    isLoading = false,
}: UserManagementUIProps) {
    const [selectedStream, setSelectedStream] = useState<string>('all')
    const [viewingUser, setViewingUser] = useState<User | null>(null)
    const [isDossierOpen, setIsDossierOpen] = useState(false)

    const streams = [
        { id: 'all', label: 'All Scholars' },
        { id: 'engineering', label: 'BUET & Engineering' },
        { id: 'medical', label: 'Medical Admission' },
        { id: 'varsity', label: 'Dhaka University (DU)' },
        { id: 'hsc', label: 'HSC 2026 Science' },
    ]

    const filteredUsers = useMemo(() => {
        let list = users
        if (selectedStream === 'engineering') {
            list = list.filter((u) => (u.targetStream || '').toLowerCase().includes('buet') || (u.targetStream || '').toLowerCase().includes('engineering'))
        } else if (selectedStream === 'medical') {
            list = list.filter((u) => (u.targetStream || '').toLowerCase().includes('medical'))
        } else if (selectedStream === 'varsity') {
            list = list.filter((u) => (u.targetStream || '').toLowerCase().includes('varsity') || (u.targetStream || '').toLowerCase().includes('du'))
        } else if (selectedStream === 'hsc') {
            list = list.filter((u) => (u.targetStream || '').toLowerCase().includes('hsc') || (u.college || '').toLowerCase().includes('college'))
        }
        return list
    }, [users, selectedStream])

    const openDossier = (user: User) => {
        setViewingUser(user)
        setIsDossierOpen(true)
    }

    const handleDelete = (user: User) => {
        if (confirm(`Remove student account for ${user.name}?`)) {
            onDeleteUser(user.id)
            toast.success('Scholar account removed')
        }
    }

    const handleToggle = (user: User) => {
        onToggleStatus(user.id)
        toast.success(`Account status changed for ${user.name}`)
    }

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header & KPI Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                        <Users className="size-3.5" />
                        <span>StudyBuddy Scholars · Active Student Roster & Streaks</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Learners & Scholars
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Registered students, college affiliations, active daily study streaks, and national merit points.
                    </p>
                </div>
            </div>

            {/* Metric Clusters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <GraduationCap className="size-4 text-emerald-600" />
                        <span>Enrolled Scholars</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">1,40,000+</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Top colleges in Bangladesh</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Flame className="size-4 text-amber-500" />
                        <span>Active Streaks</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">42,500+</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Continuous daily learners</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Trophy className="size-4 text-primary" />
                        <span>Leaderboard Leaders</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">Top 1% Club</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">6,000+ XP achievers</div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Shield className="size-4 text-sky-600" />
                        <span>Verified Profiles</span>
                    </div>
                    <div className="text-2xl font-black text-foreground mt-1">98.2%</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Official student email verified</div>
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
                        placeholder="Search student, college or email..."
                        className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Scholars Roster Table */}
            {isLoading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 rounded-xl border border-border bg-card animate-pulse p-4" />
                    ))}
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
                    <Users className="size-10 text-muted-foreground mb-3" />
                    <h3 className="font-bold text-base text-foreground">No Scholars Found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Try adjusting your search query or selecting a different academic stream.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-2xs">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                            <tr>
                                <th className="p-3.5 pl-4">শিক্ষার্থী (Scholar)</th>
                                <th className="p-3.5">কলেজ ও শিক্ষাপ্রতিষ্ঠান</th>
                                <th className="p-3.5">লক্ষ্য (Target Goal)</th>
                                <th className="p-3.5">ধারাবাহিকতা (Streak)</th>
                                <th className="p-3.5">পয়েন্ট (XP)</th>
                                <th className="p-3.5">অবস্থা (Status)</th>
                                <th className="p-3.5 pr-4 text-right">কার্যক্রম</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredUsers.map((student, idx) => {
                                const streak = student.streakDays || Math.max(3, 28 - idx * 2)
                                const xp = student.xpPoints || 5000 - idx * 350
                                const isActive = student.status === 'Active'

                                return (
                                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-3.5 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 shrink-0 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/70 ring-1 ring-border">
                                                    <img
                                                        src={student.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`}
                                                        alt={student.name}
                                                        className="size-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-foreground text-xs block truncate">
                                                        {student.name}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground block truncate">
                                                        {student.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3.5 text-xs text-foreground/90 font-medium">
                                            {student.college || (idx % 2 === 0 ? 'Notre Dame College, Dhaka' : 'Viqarunnisa Noon College')}
                                        </td>
                                        <td className="p-3.5">
                                            <span className="text-xs font-semibold text-primary block">
                                                {student.targetStream || (idx % 3 === 0 ? 'BUET & Engineering' : idx % 3 === 1 ? 'Medical MBBS' : 'DU Ka-Unit')}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Class 12 / HSC 2026</span>
                                        </td>
                                        <td className="p-3.5 text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                            🔥 {streak} দিন
                                        </td>
                                        <td className="p-3.5 text-xs font-extrabold text-foreground">
                                            {xp.toLocaleString()} XP
                                        </td>
                                        <td className="p-3.5">
                                            {isActive ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-xs font-medium text-muted-foreground">Suspended</span>
                                            )}
                                        </td>
                                        <td className="p-3.5 pr-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    onClick={() => openDossier(student)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 gap-1 text-xs font-semibold"
                                                >
                                                    <Eye className="size-3.5" />
                                                    <span>Dossier</span>
                                                </Button>
                                                <Button
                                                    onClick={() => handleToggle(student)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="size-8 p-0 text-muted-foreground hover:text-foreground"
                                                    title="Toggle Status"
                                                >
                                                    <Ban className="size-3.5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(student)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="size-8 p-0 text-destructive/70 hover:text-destructive"
                                                    title="Delete Student"
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

            {/* SCHOLAR DOSSIER & PROFILE MODAL */}
            <Dialog open={isDossierOpen} onOpenChange={setIsDossierOpen}>
                <DialogContent className="sm:max-w-xl bg-background border-border max-h-[85vh] overflow-y-auto">
                    {viewingUser && (
                        <div>
                            <DialogHeader>
                                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                                    StudyBuddy Scholar Academic Dossier
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="size-12 rounded-full overflow-hidden bg-muted ring-2 ring-primary/30">
                                        <img
                                            src={viewingUser.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${viewingUser.name}`}
                                            alt={viewingUser.name}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold text-foreground">
                                            {viewingUser.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground">
                                            {viewingUser.email} · {viewingUser.college || 'Notre Dame College, Dhaka'}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="mt-4 flex flex-col gap-4 text-sm">
                                {/* Academic Targets */}
                                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border text-center">
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">Daily Streak</div>
                                        <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                                            🔥 {viewingUser.streakDays || 28} Days
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">XP Points</div>
                                        <div className="text-lg font-black text-primary mt-0.5">
                                            {(viewingUser.xpPoints || 6420).toLocaleString()} XP
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-muted-foreground font-medium">National Merit</div>
                                        <div className="text-lg font-black text-emerald-600 mt-0.5">
                                            #{viewingUser.meritRank || 1}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                                        Academic Milestones & Preparation Pulse
                                    </h4>
                                    <ul className="flex flex-col gap-2 text-xs text-foreground/90">
                                        <li className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card">
                                            <div className="flex items-center gap-2">
                                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                                <span>Total Model Tests Completed</span>
                                            </div>
                                            <span className="font-bold text-foreground">45 Papers</span>
                                        </li>
                                        <li className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card">
                                            <div className="flex items-center gap-2">
                                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                                <span>Overall Solution Accuracy</span>
                                            </div>
                                            <span className="font-bold text-emerald-600">92.4%</span>
                                        </li>
                                        <li className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card">
                                            <div className="flex items-center gap-2">
                                                <span className="size-1.5 rounded-full bg-primary" />
                                                <span>AI Solver Doubts Cleared</span>
                                            </div>
                                            <span className="font-bold text-primary">128 Concepts</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        onClick={() => setIsDossierOpen(false)}
                                        className="bg-primary text-primary-foreground text-xs font-semibold"
                                    >
                                        Close Dossier
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

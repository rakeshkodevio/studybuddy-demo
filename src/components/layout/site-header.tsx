import { SearchForm } from '@/components/layout/search-form'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { getModuleByPath, MODULES } from '@/lib/module'
import { Link, useRouterState } from '@tanstack/react-router'
import { PanelLeftIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { studyBuddyApi } from '@/api/studybuddy'

export function SiteHeader() {
    const { toggleSidebar } = useSidebar()
    const pathname = useRouterState({ select: (s) => s.location.pathname })

    const { data: streakData } = useQuery({
        queryKey: ['my-streak'],
        queryFn: async () => {
            try {
                return await studyBuddyApi.streaks.getMyStreak(7)
            } catch {
                return null
            }
        },
        retry: false,
        staleTime: 60000,
    })

    const streakDays = streakData?.currentStreak ?? 7

    const moduleKey = getModuleByPath(pathname)
    const formattedModule = moduleKey
        ? MODULES[moduleKey].title
        : pathname
              .split('/')
              .filter(Boolean)
              .pop()
              ?.split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ') || 'Dashboard'

    return (
        <header className="sticky top-0 z-50 flex w-full items-center border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-(--header-height) w-full items-center justify-between gap-3 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Button
                        className="h-8 w-8 text-foreground hover:bg-accent"
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <PanelLeftIcon className="size-4" />
                    </Button>
                    <Separator
                        orientation="vertical"
                        className="mr-1 data-vertical:h-4 data-vertical:self-auto hidden sm:block"
                    />
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground font-extrabold text-sm shadow-xs transition-transform group-hover:scale-105">
                                <span>SB</span>
                            </div>
                            <div className="flex flex-col hidden sm:flex">
                                <span className="font-extrabold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                                    <span>StudyBuddy</span>
                                    <span className="text-[10px] font-semibold text-primary/90 bg-primary/10 px-1.5 py-0.2 rounded">
                                        v1.0
                                    </span>
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                                    Practice & Learn
                                </span>
                            </div>
                        </Link>
                        <Separator
                            orientation="vertical"
                            className="mr-1 data-vertical:h-4 data-vertical:self-auto hidden md:block"
                        />
                        <Breadcrumb className="hidden lg:block">
                            <BreadcrumbList className="text-xs">
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/">StudyBuddy Hub</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {moduleKey !== 'dashboard' && pathname !== '/' && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="font-semibold text-foreground">
                                                {formattedModule}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Academic Stream Switcher */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs bg-muted/60 border border-border/80 px-2.5 py-1 rounded-full text-foreground font-medium">
                        <span className="size-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-semibold text-primary">HSC 2026</span>
                        <span className="text-muted-foreground">· Science</span>
                    </div>

                    {/* Streak & XP */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold"
                            title={`${streakDays}-Day Continuous Study Streak`}
                        >
                            <span>🔥</span>
                            <span>{streakDays}d</span>
                        </div>
                        <div
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold"
                            title="Practice Points"
                        >
                            <span>⚡</span>
                            <span>2,450 XP</span>
                        </div>
                    </div>

                    <SearchForm className="w-32 sm:w-44 md:w-56" />
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}

import { cn } from '@/lib/utils'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { motionTokens } from '@/lib/motionTokens'

import { Skeleton } from '@/components/ui/skeleton'

const COLOR_MAP = {
    blue: {
        blob: 'bg-info/5',
        badge: 'bg-card-blue text-card-blue-foreground',
    },
    emerald: {
        blob: 'bg-success/5',
        badge: 'bg-card-mint text-card-mint-foreground',
    },
    orange: {
        blob: 'bg-warning/5',
        badge: 'bg-card-peach text-card-peach-foreground',
    },
    amber: {
        blob: 'bg-warning/5',
        badge: 'bg-card-peach text-card-peach-foreground',
    },
    pink: {
        blob: 'bg-destructive/5',
        badge: 'bg-card-pink text-card-pink-foreground',
    },
    rose: {
        blob: 'bg-destructive/5',
        badge: 'bg-card-pink text-card-pink-foreground',
    },
    slate: {
        blob: 'bg-muted/5',
        badge: 'bg-muted text-muted-foreground',
    },
} as const

export type StatCardColor = keyof typeof COLOR_MAP

export interface StatCardTrend {
    value: string
    direction: 'up' | 'down'
    label?: string
}

export interface StatCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    color: StatCardColor
    trend?: StatCardTrend
    className?: string
    variant?: 'default' | 'stacked'
    loading?: boolean
}

export function StatCard({ label, value, icon: Icon, color, trend, className, variant = 'default', loading = false }: StatCardProps) {
    const colors = COLOR_MAP[color]

    if (variant === 'stacked') {
        return (
            <Skeleton loading={loading} className="w-full h-full">
                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }}
                    className={cn(
                        'flex min-h-44 flex-col justify-between rounded-2xl border border-border/40 bg-card p-6 shadow-lg',
                        className,
                    )}
                >
                    <div className={cn('flex size-12 items-center justify-center rounded-xl', colors.badge)}>
                        <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <div className="mt-6">
                        <div className="text-3xl font-bold tracking-tight text-card-foreground">{value}</div>
                        <div className="mt-2 text-base font-medium text-muted-foreground">{label}</div>
                    </div>
                </motion.div>
            </Skeleton>
        )
    }

    return (
        <Skeleton loading={loading} className="w-full h-full">
            <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }}
                className={cn(
                    'group relative flex flex-col border border-border/50 rounded-xl gap-2 p-4 overflow-hidden transition-colors duration-200 hover:border-border cursor-pointer bg-card text-card-foreground shadow-sm',
                    className,
                )}
            >
                {/* Decorative corner blob */}
                <div className={cn('absolute top-0 right-0 w-22 h-22 rounded-bl-full pointer-events-none', colors.blob)} />

                {/* Header: label + icon */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <div className={cn('p-2 rounded-xl transition-transform duration-300 group-hover:scale-110', colors.badge)}>
                        <Icon className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Value + optional trend */}
                <div>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                    {trend && (
                        <div
                            className={cn(
                                'flex items-center gap-1 mt-1.5 text-xs font-medium',
                                trend.direction === 'up' ? 'text-success' : 'text-destructive',
                            )}
                        >
                            {trend.direction === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                            <span>{trend.value}</span>
                            {trend.label && <span className="text-muted-foreground font-normal ml-0.5">{trend.label}</span>}
                        </div>
                    )}
                </div>
            </motion.div>
        </Skeleton>
    )
}

export function StatCardsGrid({ cards, className, loading = false }: { cards: StatCardProps[]; className?: string; loading?: boolean }) {
    return (
        <motion.div
            className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.08 },
                },
            }}
        >
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    variants={{
                        hidden: { opacity: 0, y: motionTokens.distance.md },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth },
                        },
                    }}
                >
                    <StatCard {...card} loading={card.loading ?? loading} />
                </motion.div>
            ))}
        </motion.div>
    )
}

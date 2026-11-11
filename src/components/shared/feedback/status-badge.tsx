import { cn } from '@/lib/utils'

type StatusVariant = 'success' | 'warning' | 'destructive' | 'info'

const STATUS_CONFIG: Record<string, { variant: StatusVariant; label: string }> = {
    Paid: { variant: 'success', label: 'Paid' },
    Active: { variant: 'success', label: 'Active' },
    Published: { variant: 'success', label: 'Published' },
    Enabled: { variant: 'success', label: 'Enabled' },
    Pending: { variant: 'warning', label: 'Pending' },
    Scheduled: { variant: 'info', label: 'Scheduled' },
    Draft: { variant: 'warning', label: 'Draft' },
    Failed: { variant: 'destructive', label: 'Failed' },
    Inactive: { variant: 'destructive', label: 'Inactive' },
    Disabled: { variant: 'destructive', label: 'Disabled' },
}

const VARIANT_CLASSES: Record<StatusVariant, string> = {
    success: 'bg-success/10 text-success ring-success/20',
    warning: 'bg-warning/10 text-warning ring-warning/20',
    destructive: 'bg-destructive/10 text-destructive ring-destructive/20',
    info: 'bg-info/10 text-info ring-info/20',
}

export interface StatusBadgeProps {
    status: string
    variant?: StatusVariant
    className?: string
    size?: 'sm' | 'md'
}

export function StatusBadge({ status, variant, className, size = 'sm' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? { variant: variant ?? 'info', label: status }
    const finalVariant = variant ?? config.variant
    const label = config.label || status

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-md ring-1 ring-inset font-medium',
                VARIANT_CLASSES[finalVariant],
                size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm',
                className,
            )}
        >
            {label}
        </span>
    )
}

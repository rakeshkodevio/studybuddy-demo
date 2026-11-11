import * as React from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, { bg: string; bar: string }> = {
    Available: { bg: 'bg-success/20', bar: 'bg-success' },
    Reserved: { bg: 'bg-warning/20', bar: 'bg-warning' },
    Shipped: { bg: 'bg-info/20', bar: 'bg-info' },
    Cleaning: { bg: 'bg-purple/20', bar: 'bg-purple' },
    Repair: { bg: 'bg-destructive/20', bar: 'bg-destructive' },
    Default: { bg: 'bg-info/20', bar: 'bg-info' },
}

function Progress({ className, value, status, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & { status?: string }) {
    const statusStyle = STATUS_STYLES[status ?? ''] ?? STATUS_STYLES.Default

    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn('relative flex h-4 w-full items-center overflow-x-hidden rounded-full', statusStyle.bg, className)}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn('size-full flex-1 transition-all', statusStyle.bar)}
                style={{
                    transform: `translateX(-${100 - (value || 0)}%)`,
                }}
            />
        </ProgressPrimitive.Root>
    )
}

export { Progress }

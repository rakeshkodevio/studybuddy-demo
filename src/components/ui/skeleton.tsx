import { cn } from '@/lib/utils'
import {
    Skeleton as SkulletBaseSkeleton,
    SkeletonBox,
    SkeletonSuspense,
    SkulletProvider,
    useReveal,
    useSkullet,
} from 'skullet/react'
import * as React from 'react'

export interface SkeletonProps<T = unknown> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    loading?: boolean
    data?: T | null
    sample?: T
    empty?: boolean
    emptyMessage?: React.ReactNode
    error?: React.ReactNode
    onReveal?: () => void
    height?: string | number
    width?: string | number
    radius?: string | number
    children?: React.ReactNode | ((data: T) => React.ReactNode)
}

function Skeleton<T = unknown>({
    className,
    style,
    children,
    loading,
    data,
    sample,
    height,
    width,
    radius,
    ...props
}: SkeletonProps<T>) {
    // If children are supplied or data/sample are present, use Skullet smart automatic layout skeleton
    if (children !== undefined || data !== undefined || sample !== undefined) {
        if (typeof children === 'function') {
            return (
                <SkulletBaseSkeleton
                    loading={loading}
                    data={data}
                    sample={sample}
                    className={className}
                    style={style}
                >
                    {children}
                </SkulletBaseSkeleton>
            )
        }

        return (
            <SkulletBaseSkeleton
                loading={loading}
                className={className}
                style={style}
            >
                {children}
            </SkulletBaseSkeleton>
        )
    }

    // Otherwise render a standalone Skullet box with matching shimmer and styling
    return (
        <SkeletonBox
            className={cn('animate-pulse rounded-md bg-muted', className)}
            style={style}
            height={height}
            width={width}
            radius={radius}
            {...props}
        />
    )
}

export { Skeleton, SkeletonBox, SkeletonSuspense, SkulletProvider, useSkullet, useReveal }

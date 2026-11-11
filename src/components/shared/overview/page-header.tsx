import { cn } from '@/lib/utils'

export function PageHeader({ title, description, className }: { title: string; description?: string; className?: string }) {
    return (
        <div className={cn('flex flex-col gap-0.5', className)}>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    )
}

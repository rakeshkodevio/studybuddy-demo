
export function PendingComp() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-full p-4 sm:p-6 animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-muted/60" />
            <div className="h-10 w-full max-w-md rounded-lg bg-muted/50" />
            <div className="h-80 w-full rounded-2xl border border-border/40 bg-card/50" />
        </div>
    )
}

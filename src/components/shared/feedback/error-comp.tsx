import { Button } from '@/components/ui/button'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { RotateCw, ShieldAlert } from 'lucide-react'

export function ErrorComp(props: ErrorComponentProps) {
    const errorMessage =
        props.error instanceof Error
            ? props.error.message
            : typeof props.error === 'string'
              ? props.error
              : typeof props.error === 'object' && props.error !== null && 'message' in props.error
                ? String(props.error.message)
                : null

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/5 text-destructive">
                    <ShieldAlert size={48} />
                </div>
                <div className="text-center grid gap-2 max-w-lg">
                    <h4 className="text-lg font-bold text-foreground">Something went wrong</h4>
                    <p className="text-sm text-muted-foreground">An unexpected error occurred while loading this page</p>
                    {errorMessage && (
                        <pre className="text-xs text-destructive bg-destructive/10 p-3 rounded-md text-left overflow-auto max-h-40 whitespace-pre-wrap font-mono">
                            {errorMessage}
                        </pre>
                    )}
                </div>
                <Button variant="destructive" onClick={props.reset}>
                    <RotateCw />
                    Try Again
                </Button>
            </div>
        </div>
    )
}

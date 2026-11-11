import { useSearchParams } from '@/hooks/use-search-params'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import * as React from 'react'

const DEFAULT_DEBOUNCE_MS = 300

export type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value'> & {
    /** Controlled value driven by the URL search param. */
    value?: string
    /** Callback fired when the input value changes */
    onValueChange?: (value: string) => void
    /** How long to wait after the last keystroke before writing to the URL. Defaults to 300ms. */
    debounceMs?: number
}

/**
 * URL-driven search input.
 *
 * The input is controlled by local state so the user sees every keystroke immediately,
 * and a trailing-edge debounce writes the value to the URL after `debounceMs` of
 * inactivity. This keeps the URL as the source of truth (deep-linkable, browser
 * back/forward works) without firing a server request on every character.
 *
 * The clear button bypasses the debounce — clearing is a discrete user action and
 * should reflect in the URL (and the table) immediately.
 */
export function SearchInput({
    className,
    placeholder = 'Search...',
    value,
    onValueChange,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    ...props
}: SearchInputProps) {
    const mergeSearch = useSearchParams()

    // What the user sees in the input — updated on every keystroke.
    const [localValue, setLocalValue] = React.useState(value ?? '')

    // Sync external (URL) changes back into local state. Handles initial mount,
    // browser back/forward, and external resets (e.g. DataTable's "Reset Filters").
    React.useEffect(() => {
        setLocalValue(value ?? '')
    }, [value])

    // Trailing-edge debounce: write the local value to the URL only after the user
    // has stopped typing for `debounceMs`. We compare against the current `value`
    // to avoid a no-op navigation when the local state is already in sync with the URL.
    React.useEffect(() => {
        const id = window.setTimeout(() => {
            if (localValue !== (value ?? '')) {
                mergeSearch({ search: localValue })
            }
        }, debounceMs)
        return () => window.clearTimeout(id)
    }, [localValue, value, debounceMs, mergeSearch])

    const handleClear = () => {
        setLocalValue('')
        onValueChange?.('')
        mergeSearch({ search: '' })
    }

    return (
        <div
            className={cn(
                'relative flex items-center w-full h-10 rounded-lg border border-input bg-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
                className,
            )}
        >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground/75 pointer-events-none" />
            <input
                type="text"
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => {
                    setLocalValue(e.target.value)
                    onValueChange?.(e.target.value)
                }}
                className="w-full h-full bg-transparent px-9 pr-10 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            />
            {localValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="absolute right-3 flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}

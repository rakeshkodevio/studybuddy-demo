import { Label } from '@/components/ui/label'
import { SidebarInput } from '@/components/ui/sidebar'
import { SearchIcon } from 'lucide-react'
import * as React from 'react'

export function SearchForm({ className, ...props }: React.ComponentProps<'form'>) {
    return (
        <form className={className} {...props}>
            <div className="relative">
                <Label htmlFor="search" className="sr-only">
                    Search
                </Label>
                <SidebarInput
                    id="search"
                    placeholder="Search dashboard..."
                    className="h-8 pl-7 pr-12 text-xs bg-muted/40 focus-visible:bg-background"
                />
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 opacity-50 select-none" />
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex h-4 select-none items-center gap-0.5 rounded border border-border/60 bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground opacity-70">
                    ⌘K
                </kbd>
            </div>
        </form>
    )
}

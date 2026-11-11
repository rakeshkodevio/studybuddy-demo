import type { ReactNode, ElementType } from 'react'
import { PlusCircle, FilterX, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

export type FilterCondition = string

export type FilterType = 'text' | 'select' | 'number' | 'date' | 'boolean'

export const FILTER_CONDITIONS: Record<FilterType, string[]> = {
    text: ['contains', 'does not contain', 'starts with', 'ends with', 'is exactly', 'is not exactly', 'is empty', 'is not empty'],
    number: ['=', '!=', '>', '>=', '<', '<=', 'is empty', 'is not empty'],
    select: ['is', 'is not', 'is any of', 'is none of', 'is empty', 'is not empty'],
    date: ['is', 'is before', 'is after', 'is between', 'is empty', 'is not empty'],
    boolean: ['is', 'is not'],
}

export interface FilterOption {
    id: string
    label: string
    icon?: ElementType
    type?: FilterType
    options?: { label: string; value: string }[]
}

export interface FilterState {
    id: string
    fieldId: string
    condition: FilterCondition
    value: string | string[]
    valueIcon?: string | ReactNode
}

export interface FilterBuilderProps {
    options: FilterOption[]
    filters: FilterState[]
    onFiltersChange: (filters: FilterState[]) => void
}

export function FilterBuilder({ options, filters, onFiltersChange }: FilterBuilderProps) {
    // -----------------------------------------------------------------------
    // Handlers — defined once at the top level, not inside .map()
    // -----------------------------------------------------------------------
    const handleAddFilter = (fieldId: string) => {
        const option = options.find((o) => o.id === fieldId)
        if (!option) return

        const type = option.type || 'text'
        const defaultCondition = FILTER_CONDITIONS[type][0]

        const newFilter: FilterState = {
            id: Math.random().toString(36).substring(7),
            fieldId,
            condition: defaultCondition,
            value: type === 'date' && defaultCondition === 'is between' ? ['', ''] : '',
        }
        onFiltersChange([...filters, newFilter])
    }

    const handleConditionChange = (id: string, newCondition: FilterCondition) => {
        onFiltersChange(
            filters.map((f) => {
                if (f.id !== id) return f
                // reset value when switching to/from 'is between'
                const resetValue = newCondition === 'is between' ? ['', ''] : ''
                return { ...f, condition: newCondition, value: resetValue }
            }),
        )
    }

    const handleValueChange = (id: string, newValue: string | string[]) => {
        onFiltersChange(filters.map((f) => (f.id === id ? { ...f, value: newValue } : f)))
    }

    const removeFilter = (id: string) => {
        onFiltersChange(filters.filter((f) => f.id !== id))
    }

    const clearFilters = () => {
        onFiltersChange([])
    }

    // -----------------------------------------------------------------------
    // Value display helper — what shows on the badge trigger button
    // -----------------------------------------------------------------------
    const displayValue = (filter: FilterState) => {
        if (!filter.value || (Array.isArray(filter.value) && filter.value.every((v) => !v))) {
            return <span className="text-muted-foreground">Any</span>
        }
        if (Array.isArray(filter.value)) {
            return filter.value.filter(Boolean).join(' → ')
        }
        return filter.value
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Filter
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                    {options.map((option) => {
                        const Icon = option.icon
                        return (
                            <DropdownMenuItem key={option.id} onClick={() => handleAddFilter(option.id)}>
                                {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                                {option.label}
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            {filters.map((filter) => {
                const option = options.find((o) => o.id === filter.fieldId)
                if (!option) return null
                const Icon = option.icon
                const type = option.type || 'text'
                const conditionOptions = FILTER_CONDITIONS[type]
                const needsValue = !['is empty', 'is not empty'].includes(filter.condition)
                const isBetween = filter.condition === 'is between'

                return (
                    <Badge
                        key={filter.id}
                        variant="secondary"
                        className="h-auto min-h-[2rem] px-2 py-1 gap-1.5 text-sm font-normal bg-muted/50 border border-border/50"
                    >
                        {/* Field label */}
                        <span className="font-medium flex items-center gap-1.5">
                            {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
                            {option.label}
                        </span>

                        {/* Condition chooser */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer">
                                    {filter.condition}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[180px]">
                                {conditionOptions.map((cond) => (
                                    <DropdownMenuItem
                                        key={cond}
                                        onClick={() => handleConditionChange(filter.id, cond)}
                                        className="flex items-center justify-between"
                                    >
                                        {cond}
                                        {filter.condition === cond && <Check className="h-4 w-4 text-foreground" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Value picker */}
                        {needsValue && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="font-medium bg-background border border-border/40 px-1.5 py-0.5 rounded-sm flex items-center gap-1.5 shadow-sm hover:bg-muted transition-colors cursor-pointer outline-none min-h-[22px]">
                                        {filter.valueIcon && <span className="text-[10px] leading-none">{filter.valueIcon}</span>}
                                        {displayValue(filter)}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className={isBetween ? 'w-[240px] p-3' : 'w-[200px] p-2'}>
                                    {/* TEXT */}
                                    {type === 'text' && (
                                        <Input
                                            autoFocus
                                            placeholder="Value..."
                                            value={filter.value}
                                            onChange={(e) => handleValueChange(filter.id, e.target.value)}
                                            className="h-8"
                                        />
                                    )}

                                    {/* NUMBER */}
                                    {type === 'number' && (
                                        <Input
                                            autoFocus
                                            type="number"
                                            placeholder="Value..."
                                            value={filter.value}
                                            onChange={(e) => handleValueChange(filter.id, e.target.value)}
                                            className="h-8"
                                        />
                                    )}

                                    {/* SELECT */}
                                    {type === 'select' && option.options && (
                                        <div className="flex flex-col gap-1">
                                            {option.options.map((opt) => (
                                                <Button
                                                    key={opt.value}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="justify-start h-8 px-2 font-normal"
                                                    onClick={() => handleValueChange(filter.id, opt.value)}
                                                >
                                                    {filter.value === opt.value && <Check className="mr-2 h-4 w-4" />}
                                                    <span className={filter.value !== opt.value ? 'ml-6' : ''}>{opt.label}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                    {type === 'select' && !option.options && (
                                        <span className="text-xs text-muted-foreground p-2">No options provided</span>
                                    )}

                                    {/* DATE — single */}
                                    {type === 'date' && !isBetween && (
                                        <Input
                                            autoFocus
                                            type="date"
                                            value={filter.value}
                                            onChange={(e) => handleValueChange(filter.id, e.target.value)}
                                            className="h-8"
                                        />
                                    )}

                                    {/* DATE — range (is between) */}
                                    {type === 'date' && isBetween && (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                                                    From
                                                </span>
                                                <Input
                                                    autoFocus
                                                    type="date"
                                                    value={Array.isArray(filter.value) ? filter.value[0] : ''}
                                                    onChange={(e) => {
                                                        const arr = Array.isArray(filter.value) ? [...filter.value] : ['', '']
                                                        arr[0] = e.target.value
                                                        handleValueChange(filter.id, arr)
                                                    }}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                                                    To
                                                </span>
                                                <Input
                                                    type="date"
                                                    value={Array.isArray(filter.value) ? filter.value[1] : ''}
                                                    onChange={(e) => {
                                                        const arr = Array.isArray(filter.value) ? [...filter.value] : ['', '']
                                                        arr[1] = e.target.value
                                                        handleValueChange(filter.id, arr)
                                                    }}
                                                    className="h-8"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* Remove */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                            onClick={() => removeFilter(filter.id)}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove filter</span>
                        </Button>
                    </Badge>
                )
            })}

            {filters.length > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
                    onClick={clearFilters}
                >
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>
    )
}

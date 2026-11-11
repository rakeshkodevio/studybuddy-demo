import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PaginationComp } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SkeletonBox } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useSearchParams } from '@/hooks/use-search-params'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, PaginationState, RowData, RowSelectionState, SortingState, VisibilityState } from '@tanstack/react-table'
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    ChevronDown,
    RotateCcw,
    Rows3,
    SearchX,
    SlidersHorizontal,
    Trash2,
    X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        className?: string
    }
}

export type DataTableColumn<T> = {
    key: string
    header: string
    render: (row: T) => React.ReactNode
    className?: string
    enableSorting?: boolean
    enableHiding?: boolean
    accessor?: keyof T | ((row: T) => unknown)
}

type DataTableState = {
    sorting: SortingState
    pagination: PaginationState
    columnVisibility: VisibilityState
    rowSelection: RowSelectionState
    globalFilter: string
}

export type DataTableSelectionMode = 'none' | 'single' | 'multiple'

export type BulkStatusOption = {
    label: string
    value: string
}

export type DataTableProps<T> = {
    loading?: boolean
    columns: DataTableColumn<T>[]
    data: T[]
    noun?: string
    emptyIcon?: React.ReactNode
    page?: number
    limit?: number
    total?: number
    limitOptions?: number[]
    onReset?: () => void
    state?: Partial<DataTableState>
    onStateChange?: (state: DataTableState) => void
    initialState?: Partial<DataTableState>
    enableRowSelection?: boolean
    selectionMode?: DataTableSelectionMode
    onRowSelectionChange?: (rowSelection: RowSelectionState) => void
    enableColumnVisibility?: boolean
    manualPagination?: boolean
    manualSorting?: boolean
    manualFiltering?: boolean
    getRowId?: (row: T, index: number) => string
    onBulkDelete?: (selectedIds: string[]) => void
    onBulkStatusChange?: (selectedIds: string[], status: string) => void
    bulkStatusOptions?: BulkStatusOption[]
    bulkActionsSlot?: (selectedIds: string[], resetSelection: () => void) => React.ReactNode
    toolbarSlot?: React.ReactNode
    density?: 'compact' | 'normal' | 'relaxed'
}

function DataTable<T>({
    loading = false,
    columns,
    data,
    noun = 'rows',
    emptyIcon,
    page = 1,
    limit = 10,
    total = 0,
    limitOptions = [5, 10, 20],
    onReset,
    state,
    onStateChange,
    initialState,
    enableRowSelection = true,
    selectionMode = 'multiple',
    onRowSelectionChange,
    enableColumnVisibility = true,
    manualPagination = true,
    manualSorting = true,
    manualFiltering = true,
    getRowId,
    onBulkDelete,
    onBulkStatusChange,
    bulkStatusOptions,
    bulkActionsSlot,
    toolbarSlot,
    density: initialDensity = 'normal',
}: DataTableProps<T>) {
    const mergeSearch = useSearchParams()
    const selectionEnabled = selectionMode !== 'none' || enableRowSelection
    const isMultiSelect = selectionMode === 'multiple' || (selectionMode === 'none' && enableRowSelection)
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)
    const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>(initialDensity)

    const defaultGetRowId = useMemo(() => {
        if (getRowId) return getRowId
        return (row: T, index: number) => {
            if (row && typeof row === 'object' && 'id' in row && row.id !== undefined && row.id !== null) {
                return String(row.id)
            }
            return String(index)
        }
    }, [getRowId])

    const defaultState = useMemo<DataTableState>(
        () => ({
            sorting: [],
            pagination: {
                pageIndex: Math.max(page - 1, 0),
                pageSize: limit,
            },
            columnVisibility: {},
            rowSelection: {},
            globalFilter: '',
            ...(initialState ?? {}),
        }),
        [initialState, limit, page],
    )

    const [internalState, setInternalState] = useState<DataTableState>(defaultState)

    useEffect(() => {
        if (state) return
        setInternalState((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                pageIndex: Math.max(page - 1, 0),
                pageSize: limit,
            },
        }))
    }, [limit, page, state])

    const resolvedState = useMemo(() => {
        const base = {
            ...defaultState,
            ...internalState,
            ...(state ?? {}),
        }

        return {
            ...base,
            pagination: {
                pageIndex: Math.max(base.pagination?.pageIndex ?? 0, 0),
                pageSize: base.pagination?.pageSize ?? limit,
            },
        }
    }, [defaultState, internalState, state, limit])

    const updateState = (changes: Partial<DataTableState>) => {
        const nextState = {
            ...resolvedState,
            ...changes,
            pagination: {
                ...resolvedState.pagination,
                ...(changes.pagination ?? {}),
            },
        }

        if (onStateChange) {
            onStateChange(nextState)
            return
        }

        setInternalState(nextState)
    }

    const columnDefs = useMemo<ColumnDef<T, unknown>[]>(
        () =>
            columns.map((col) => ({
                id: col.key,
                accessorFn: (row) => {
                    if (typeof col.accessor === 'function') {
                        return col.accessor(row)
                    }

                    if (typeof col.accessor === 'string') {
                        return row[col.accessor as keyof T]
                    }

                    return (row as Record<string, unknown>)[col.key] ?? undefined
                },
                enableSorting: col.enableSorting ?? col.key !== 'action',
                enableHiding: col.enableHiding ?? (col.key !== 'action' && col.key !== '_select'),
                header: col.header,
                cell: ({ row }) => col.render(row.original),
                meta: { className: col.className },
            })),
        [columns],
    )

    const table = useReactTable<T>({
        data,
        columns: columnDefs,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
        getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
        getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
        state: {
            sorting: resolvedState.sorting,
            pagination: resolvedState.pagination,
            columnVisibility: resolvedState.columnVisibility,
            rowSelection: resolvedState.rowSelection,
            globalFilter: resolvedState.globalFilter,
        },
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === 'function' ? updater(resolvedState.sorting) : updater
            updateState({ sorting: nextSorting })
        },
        onPaginationChange: (updater) => {
            const nextPagination = typeof updater === 'function' ? updater(resolvedState.pagination) : updater
            updateState({ pagination: nextPagination })
        },
        onColumnVisibilityChange: (updater) => {
            const nextVisibility = typeof updater === 'function' ? updater(resolvedState.columnVisibility) : updater
            updateState({ columnVisibility: nextVisibility })
        },
        onRowSelectionChange: (updater) => {
            const nextSelection = typeof updater === 'function' ? updater(resolvedState.rowSelection) : updater
            updateState({ rowSelection: nextSelection })
            onRowSelectionChange?.(nextSelection)
        },
        onGlobalFilterChange: (value) => updateState({ globalFilter: value }),
        manualPagination,
        manualSorting,
        manualFiltering,
        enableRowSelection: selectionEnabled,
        pageCount: manualPagination ? Math.max(1, Math.ceil(total / Math.max(resolvedState.pagination.pageSize, 1))) : undefined,
        getRowId: defaultGetRowId,
    })

    const rows = table.getRowModel().rows
    const selectedRowKeys = Object.keys(resolvedState.rowSelection).filter((k) => resolvedState.rowSelection[k])
    const selectedCount = selectedRowKeys.length

    const resetSelection = () => {
        table.resetRowSelection()
        updateState({ rowSelection: {} })
        onRowSelectionChange?.({})
    }

    if (loading) {
        const rowCount = limit || 10

        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="overflow-x-auto rounded-lg border border-border w-full">
                    <Table className="w-full">
                        <TableHeader className="bg-primary [&_th]:text-primary-foreground [&_th]:text-[11px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wider [&_th:first-child]:rounded-tl-md [&_th:last-child]:rounded-tr-md">
                            <TableRow className="hover:bg-transparent border-0">
                                {selectionEnabled && (
                                    <TableHead className="w-10">
                                        <div className="flex items-center justify-center">
                                            <div className="size-4 rounded border border-primary-foreground/30 opacity-40" />
                                        </div>
                                    </TableHead>
                                )}
                                {columns.map((col) => (
                                    <TableHead key={col.key} className={col.className}>
                                        <div className="flex items-center gap-1 font-semibold text-inherit">
                                            <span>{col.header}</span>
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: rowCount }).map((_, rowIdx) => (
                                <TableRow key={rowIdx}>
                                    {selectionEnabled && (
                                        <TableCell className="w-10">
                                            <SkeletonBox className="size-4 rounded" />
                                        </TableCell>
                                    )}
                                    {columns.map((col, colIdx) => {
                                        const key = col.key.toLowerCase()
                                        const header = col.header.toLowerCase()

                                        if (key === 'action' || key === 'actions' || header.includes('action')) {
                                            return (
                                                <TableCell key={col.key} className={col.className}>
                                                    <div className="flex items-center justify-end gap-1.5 py-0.5">
                                                        <SkeletonBox className="size-8 rounded-lg" />
                                                        <SkeletonBox className="size-8 rounded-lg" />
                                                    </div>
                                                </TableCell>
                                            )
                                        }

                                        if (key.includes('status') || header.includes('status')) {
                                            return (
                                                <TableCell key={col.key} className={col.className}>
                                                    <SkeletonBox className="h-6 w-20 rounded-full" />
                                                </TableCell>
                                            )
                                        }

                                        if (key === 'id' || header === 'id' || header.includes('order id')) {
                                            return (
                                                <TableCell key={col.key} className={col.className}>
                                                    <SkeletonBox className="h-4 w-12 rounded" />
                                                </TableCell>
                                            )
                                        }

                                        if (
                                            key.includes('price') ||
                                            key.includes('amount') ||
                                            key.includes('total') ||
                                            key.includes('revenue')
                                        ) {
                                            return (
                                                <TableCell key={col.key} className={col.className}>
                                                    <SkeletonBox className="h-4 w-16 rounded" />
                                                </TableCell>
                                            )
                                        }

                                        if (key.includes('date') || header.includes('date')) {
                                            return (
                                                <TableCell key={col.key} className={col.className}>
                                                    <SkeletonBox className="h-4 w-24 rounded" />
                                                </TableCell>
                                            )
                                        }

                                        const widths = ['w-3/4', 'w-5/6', 'w-2/3', 'w-4/5', 'w-3/5']
                                        const widthClass = widths[(rowIdx + colIdx) % widths.length]

                                        return (
                                            <TableCell key={col.key} className={col.className}>
                                                <div className="py-1 min-w-28 w-full">
                                                    <SkeletonBox className={cn('h-4 rounded', widthClass)} />
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 w-full py-2">
                    <SkeletonBox className="h-5 w-44 rounded-md" />
                    <div className="flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="hidden md:flex items-center gap-2">
                            <SkeletonBox className="h-4 w-24 rounded" />
                            <SkeletonBox className="h-8 w-16 rounded-md" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <SkeletonBox className="h-8 w-8 rounded-md" />
                            <SkeletonBox className="h-8 w-8 rounded-md" />
                            <SkeletonBox className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="p-3 rounded-full bg-muted/80 text-muted-foreground">{emptyIcon ?? <SearchX className="h-6 w-6" />}</div>
                <div className="max-w-xs">
                    <h3 className="font-semibold text-foreground">No {noun} found</h3>
                    <p className="text-sm text-muted-foreground">
                        No records matched your search query or active filters. Try clearing your parameters!
                    </p>
                </div>
                {onReset && (
                    <Button variant="outline" size="sm" onClick={onReset}>
                        Reset Filters
                    </Button>
                )}
            </div>
        )
    }

    const hideableColumns = table
        .getAllLeafColumns()
        .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide() && column.id !== 'action' && column.id !== '_select')

    const visibleHideableCount = hideableColumns.filter((c) => c.getIsVisible()).length

    const densityClass =
        density === 'compact'
            ? '[&_td]:py-1.5 [&_td]:px-3 [&_th]:py-1.5 [&_th]:px-3 text-xs'
            : density === 'relaxed'
              ? '[&_td]:py-4 [&_td]:px-4 [&_th]:py-3.5 [&_th]:px-4 text-sm'
              : '[&_td]:py-2.5 [&_td]:px-3.5 [&_th]:py-2.5 [&_th]:px-3.5 text-sm'

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Table Utility & Quick Visibility Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-muted/30 border border-border/70 rounded-xl px-3.5 py-2.5">
                {/* Left: Quick Column Toggles ("select and deselect items visualizing now") */}
                <div className="flex items-center flex-wrap gap-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-1 shrink-0 select-none">
                        <SlidersHorizontal className="size-3.5 text-primary" />
                        <span>Columns:</span>
                    </div>

                    {enableColumnVisibility &&
                        hideableColumns.map((col) => {
                            const isVisible = col.getIsVisible()
                            const colDef = columns.find((c) => c.key === col.id)
                            const label = colDef?.header ?? col.id
                            return (
                                <button
                                    key={col.id}
                                    type="button"
                                    onClick={() => col.toggleVisibility(!isVisible)}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border select-none',
                                        isVisible
                                            ? 'bg-card text-foreground border-border/80 shadow-2xs hover:border-primary/40 hover:text-primary'
                                            : 'bg-muted/40 text-muted-foreground/50 border-dashed border-border/60 hover:bg-muted/80 line-through opacity-70',
                                    )}
                                    title={isVisible ? `Click to hide ${label}` : `Click to show ${label}`}
                                >
                                    <span
                                        className={cn(
                                            'size-1.5 rounded-full shrink-0 transition-colors',
                                            isVisible ? 'bg-primary' : 'bg-muted-foreground/30',
                                        )}
                                    />
                                    <span>{label}</span>
                                </button>
                            )
                        })}

                    {enableColumnVisibility && visibleHideableCount < hideableColumns.length ? (
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => table.toggleAllColumnsVisible(true)}
                            className="h-6 px-2 text-[11px] text-primary hover:text-primary font-medium flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw className="size-3" />
                            Show all
                        </Button>
                    ) : enableColumnVisibility && hideableColumns.length > 3 ? (
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                                hideableColumns.forEach((col, idx) => {
                                    if (idx > 2) col.toggleVisibility(false)
                                })
                            }}
                            className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground font-normal"
                        >
                            Minimal
                        </Button>
                    ) : null}
                </div>

                {/* Right: Active Selection Counter & Density Selector & Slot */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Active Selection Pill */}
                    {selectionEnabled && selectedCount > 0 && (
                        <div className="flex items-center gap-2 text-xs bg-primary/10 text-foreground border border-primary/30 px-3 py-1 rounded-lg">
                            <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                                {selectedCount}
                            </span>
                            <span className="font-medium">
                                of {data.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={resetSelection}
                                className="text-primary hover:underline font-semibold cursor-pointer ml-1"
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Table Density Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs font-medium border-border/80 bg-card hover:bg-muted"
                                title="Change row density"
                            >
                                <Rows3 className="size-3.5 text-muted-foreground" />
                                <span className="capitalize">{density}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase font-semibold">
                                Row Spacing
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {(['compact', 'normal', 'relaxed'] as const).map((d) => (
                                <DropdownMenuItem
                                    key={d}
                                    onClick={() => setDensity(d)}
                                    className="text-xs cursor-pointer capitalize flex items-center justify-between"
                                >
                                    <span>{d}</span>
                                    {density === d && <Check className="size-3 text-primary" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {toolbarSlot}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-lg border border-border">
                <Table className={cn('w-full', densityClass)}>
                    <TableHeader className="bg-primary [&_th]:text-primary-foreground [&_th]:text-[11px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wider [&_th:first-child]:rounded-tl-md [&_th:last-child]:rounded-tr-md">
                        <TableRow className="hover:bg-transparent border-0">
                            {selectionEnabled && (
                                <TableHead className="w-10 text-center">
                                    {isMultiSelect ? (
                                        <div className="flex items-center justify-center">
                                            <Checkbox
                                                aria-label="Select all rows on this page"
                                                checked={
                                                    table.getIsAllPageRowsSelected()
                                                        ? true
                                                        : table.getIsSomePageRowsSelected()
                                                          ? 'indeterminate'
                                                          : false
                                                }
                                                onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
                                                className="border-primary-foreground/40 bg-primary/20 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary data-[state=indeterminate]:bg-primary-foreground data-[state=indeterminate]:text-primary"
                                            />
                                        </div>
                                    ) : null}
                                </TableHead>
                            )}
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort()
                                    const sortState = header.column.getIsSorted()
                                    const headerLabel = flexRender(header.column.columnDef.header, header.getContext())
                                    const className = header.column.columnDef.meta?.className

                                    return (
                                        <TableHead key={header.id} className={className}>
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center gap-2">
                                                    {canSort ? (
                                                        <button
                                                            type="button"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className="flex items-center gap-1 font-semibold text-inherit cursor-pointer select-none"
                                                            aria-label={`Sort by ${String(headerLabel)}`}
                                                        >
                                                            <span>{headerLabel}</span>
                                                            {sortState === 'desc' ? (
                                                                <ArrowDown className="size-3.5" />
                                                            ) : sortState === 'asc' ? (
                                                                <ArrowUp className="size-3.5" />
                                                            ) : (
                                                                <ArrowUpDown className="size-3.5 opacity-60" />
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span>{headerLabel}</span>
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    )
                                }),
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => {
                            const isSelected = row.getIsSelected()
                            return (
                                <TableRow
                                    key={row.id}
                                    data-state={isSelected ? 'selected' : undefined}
                                    className={cn(isSelected ? 'bg-primary/5 hover:bg-primary/10 data-[state=selected]:bg-primary/10' : undefined)}
                                >
                                    {selectionEnabled && (
                                        <TableCell className="w-10 text-center">
                                            <div className="flex items-center justify-center">
                                                <Checkbox
                                                    aria-label={`Select row ${row.id}`}
                                                    checked={isSelected}
                                                    onCheckedChange={(val) => row.toggleSelected(!!val)}
                                                />
                                            </div>
                                        </TableCell>
                                    )}
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cell.column.columnDef.meta?.className}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination and Limit Footer */}
            <DataTableFooter
                page={resolvedState.pagination.pageIndex + 1}
                limit={resolvedState.pagination.pageSize}
                total={total}
                onPageChange={(page) => {
                    mergeSearch({ page })
                    updateState({ pagination: { ...resolvedState.pagination, pageIndex: page - 1 } })
                }}
                onLimitChange={(limit) => {
                    mergeSearch({ page: 1, limit })
                    updateState({ pagination: { ...resolvedState.pagination, pageIndex: 0, pageSize: limit } })
                }}
                limitOptions={limitOptions}
                noun={noun}
            />

            {/* Floating Bulk Action Bar */}
            {selectionEnabled && selectedCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 sm:gap-3 bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-full px-4 sm:px-5 py-2.5 text-foreground animate-in fade-in slide-in-from-bottom-5 duration-200">
                    <div className="flex items-center gap-2 pr-2.5 border-r border-border/80">
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                            {selectedCount}
                        </span>
                        <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                            Selected
                        </span>
                    </div>

                    {bulkStatusOptions && bulkStatusOptions.length > 0 && onBulkStatusChange && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs gap-1.5 rounded-full border-border/80 bg-background hover:bg-muted"
                                >
                                    <span>Set Status</span>
                                    <ChevronDown className="size-3 opacity-60" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" side="top" sideOffset={8} className="w-44 shadow-xl">
                                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                                    Change status to
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {bulkStatusOptions.map((opt) => (
                                    <DropdownMenuItem
                                        key={opt.value}
                                        onClick={() => {
                                            onBulkStatusChange(selectedRowKeys, opt.value)
                                            resetSelection()
                                        }}
                                        className="text-xs cursor-pointer gap-2"
                                    >
                                        <Check className="size-3 text-primary opacity-0 group-hover:opacity-100" />
                                        <span>{opt.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {onBulkDelete && (
                        <AlertDialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setIsBulkDeleteModalOpen(true)}
                                className="h-8 text-xs gap-1.5 rounded-full font-medium"
                            >
                                <Trash2 className="size-3.5" />
                                <span>Delete ({selectedCount})</span>
                            </Button>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete {selectedCount} selected {noun}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove the selected {noun} from the system. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            onBulkDelete(selectedRowKeys)
                                            resetSelection()
                                            setIsBulkDeleteModalOpen(false)
                                        }}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete Selected
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {bulkActionsSlot?.(selectedRowKeys, resetSelection)}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetSelection}
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                        title="Deselect all rows"
                    >
                        <X className="size-3.5 mr-1" />
                        <span>Deselect</span>
                    </Button>
                </div>
            )}
        </div>
    )
}

type DataTableFooterProps = {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
    onLimitChange: (limit) => void
    limitOptions?: number[]
    noun?: string
}

function DataTableFooter({
    page,
    limit,
    total,
    onPageChange,
    onLimitChange,
    limitOptions = [5, 10, 20],
    noun = 'rows',
}: DataTableFooterProps) {
    const from = total > 0 ? (page - 1) * limit + 1 : 0
    const to = Math.min(page * limit, total)

    return (
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 w-full">
            <p className="text-sm text-muted-foreground shrink-0 text-center sm:text-left">
                {total > 0 ? (
                    <>
                        Showing <span className="font-semibold text-foreground">{from}</span> to{' '}
                        <span className="font-semibold text-foreground">{to}</span> of{' '}
                        <span className="font-semibold text-foreground">{total}</span> {noun}
                    </>
                ) : (
                    <>No {noun} found</>
                )}
            </p>

            <div className="flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto">
                <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>Rows per page:</span>
                    <Select value={String(limit)} onValueChange={(val) => onLimitChange(Number(val))}>
                        <SelectTrigger size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {limitOptions.map((opt) => (
                                <SelectItem key={opt} value={String(opt)}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <PaginationComp page={page} limit={limit} total={total} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export { DataTable, DataTableFooter }

import type { FilterState } from '@/components/shared/searching'

/**
 * Applies filter conditions to a dataset.
 * This is the shared filter evaluation logic used across all data tables.
 */
export function applyFilters<T>(items: T[], filters: FilterState[], getFieldValue: (item: T, fieldId: string) => unknown): T[] {
    if (filters.length === 0) return items

    return items.filter((item) => {
        for (const filter of filters) {
            const { fieldId, condition, value } = filter
            const itemValue = getFieldValue(item, fieldId)

            if (itemValue === undefined) continue

            const valStr = String(itemValue).toLowerCase()
            const filterValStr = String(value).toLowerCase()

            if (!value && !['is empty', 'is not empty'].includes(condition)) {
                continue
            }

            // Empty checks (apply to all types)
            if (condition === 'is empty') {
                if (valStr.trim() !== '') return false
                continue
            }
            if (condition === 'is not empty') {
                if (valStr.trim() === '') return false
                continue
            }

            // Date-specific conditions
            if (condition === 'is before') {
                if (!value || valStr >= filterValStr) return false
            } else if (condition === 'is after') {
                if (!value || valStr <= filterValStr) return false
            } else if (condition === 'is between') {
                const [from, to] = Array.isArray(value) ? value : [value, '']
                if (from && valStr < from) return false
                if (to && valStr > to) return false
            }
            // Generic conditions
            else if (condition === 'is exactly' || condition === 'is' || condition === '=') {
                if (valStr !== filterValStr) return false
            } else if (condition === 'is not exactly' || condition === 'is not' || condition === '!=') {
                if (valStr === filterValStr) return false
            } else if (condition === 'contains') {
                if (!valStr.includes(filterValStr)) return false
            } else if (condition === 'does not contain') {
                if (valStr.includes(filterValStr)) return false
            } else if (condition === 'starts with') {
                if (!valStr.startsWith(filterValStr)) return false
            } else if (condition === 'ends with') {
                if (!valStr.endsWith(filterValStr)) return false
            }
        }
        return true
    })
}

/**
 * Applies search query to filter items by text fields.
 */
export function applySearch<T>(items: T[], query: string, fields: (keyof T)[]): T[] {
    if (!query.trim()) return items

    const lowerQuery = query.toLowerCase()
    return items.filter((item) =>
        fields.some((field) => {
            const value = item[field]
            return value !== undefined && String(value).toLowerCase().includes(lowerQuery)
        }),
    )
}

/**
 * Paginates an array of items.
 */
export function paginate<T>(items: T[], page: number, limit: number): T[] {
    const from = (page - 1) * limit
    const to = page * limit
    return items.slice(from, to)
}

export const baseURL = (import.meta.env.VITE_APP_SERVER as string) || 'https://api-studybuddy.kodevio.com'
export const apiPrefix = '/api/v1'

export const TOKEN_STORAGE_KEY = 'studybuddy_token'

export type Paginated<T> = {
    data: T[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export type ApiResponse<T> = {
    success?: boolean
    message?: string
    data?: T
    statusCode?: number
}

/**
 * Real HTTP client for StudyBuddy API backend
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = cleanPath.startsWith('http')
        ? cleanPath
        : cleanPath.startsWith('/api')
          ? `${baseURL}${cleanPath}`
          : `${baseURL}${apiPrefix}${cleanPath}`

    const headers = new Headers(init?.headers || {})
    if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json')
    }

    // Attach saved auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(url, {
        ...init,
        headers,
        credentials: 'include', // Support sb_session cookie
    })

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T
    }

    let json: any = null
    try {
        json = await response.json()
    } catch {
        json = null
    }

    if (!response.ok) {
        const errorMsg =
            json?.message ||
            json?.error ||
            (Array.isArray(json?.errors) ? json.errors.join(', ') : `Request failed with status ${response.status}`)
        const err = new Error(errorMsg)
        ;(err as any).statusCode = response.status
        ;(err as any).data = json
        throw err
    }

    return json as T
}

export function toQuery(params: Record<string, string | number | boolean | undefined>) {
    const usp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === '') continue
        usp.set(k, String(v))
    }
    const s = usp.toString()
    return s ? `?${s}` : ''
}

export function resolveImage(image: string | null | undefined): string {
    if (!image) return '/placeholder.jpg'
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    if (image.startsWith('/uploads/')) return `${baseURL}${image}`
    return image
}


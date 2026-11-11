import type { AdminUser, AuthSession, ModulePermissions } from '@/types/user'
import { request, TOKEN_STORAGE_KEY } from './base'

const STORAGE_KEY = 'studybuddy-auth-session'

const DEFAULT_PERMISSIONS: ModulePermissions = {
    dashboard: ['read', 'create', 'update', 'delete'],
    'user-management': ['read', 'create', 'update', 'delete'],
    payments: ['read', 'create', 'update', 'delete'],
    notifications: ['read', 'create', 'update', 'delete'],
    products: ['read', 'create', 'update', 'delete'],
    categories: ['read', 'create', 'update', 'delete'],
    orders: ['read', 'create', 'update', 'delete'],
    inventory: ['read', 'create', 'update', 'delete'],
    'dynamic-pricing': ['read', 'create', 'update', 'delete'],
    reports: ['read', 'create', 'update', 'delete'],
    settings: ['read', 'update'],
}

/** Default administrator profile */
export const MOCK_ADMIN: AdminUser = {
    id: '1',
    name: 'Chorcha Scholar',
    email: 'rakesh.kodevio@gmail.com',
    role: 'ADMIN',
    permissions: DEFAULT_PERMISSIONS,
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=ChorchaAdmin',
    phone: '+880 1711-000100',
    emailVerified: true,
}

function mapApiUserToAdmin(apiUser: any): AdminUser {
    return {
        id: String(apiUser.id || '1'),
        name: apiUser.name || 'User',
        email: apiUser.email || '',
        role: String(apiUser.role || 'student').toUpperCase(),
        permissions: DEFAULT_PERMISSIONS,
        image: apiUser.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(apiUser.name || 'User')}`,
        phone: apiUser.phone || '',
        emailVerified: Boolean(apiUser.emailVerified),
        studentProfile: apiUser.studentProfile || null,
    }
}

/**
 * Live Auth API connected to StudyBuddy backend (https://api-studybuddy.kodevio.com)
 */
export const authApi = {
    /**
     * Sign in with email and password
     */
    signIn: async (email: string, password: string): Promise<AuthSession> => {
        const res = await request<any>('/auth/sign-in', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })

        const userData = res?.data?.user || res?.data || res?.user
        const token = res?.data?.token || res?.token || res?.data?.accessToken || res?.accessToken

        if (token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token)
        }

        const user = userData ? mapApiUserToAdmin(userData) : { ...MOCK_ADMIN, email }
        const session: AuthSession = {
            user,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
        return session
    },

    /**
     * Sign up with name, email and password
     */
    signUp: async (name: string, email: string, password: string): Promise<{ success: boolean; data: any; message?: string }> => {
        const res = await request<any>('/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        })
        return {
            success: true,
            data: res?.data || res,
            message: res?.message || 'Account created successfully. Please verify your email.',
        }
    },

    /**
     * Verify email with 6-digit code
     */
    verifyEmail: async (otp: string, email: string): Promise<{ success: boolean; message?: string }> => {
        const res = await request<any>('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        })
        return {
            success: true,
            message: res?.message || 'Email verified successfully',
        }
    },

    /**
     * Resend verification email code
     */
    resendVerification: async (email: string): Promise<{ success: boolean; message?: string }> => {
        const res = await request<any>('/auth/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
        return {
            success: true,
            message: res?.message || 'Verification code resent successfully',
        }
    },

    /**
     * Request password reset code
     */
    forgotPassword: async (email: string): Promise<{ success: boolean; message?: string }> => {
        const res = await request<any>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
        return {
            success: true,
            message: res?.message || 'Password reset code sent to your email',
        }
    },

    /**
     * Verify password reset OTP to receive reset token
     */
    verifyResetOtp: async (email: string, otp: string): Promise<{ token: string; message?: string }> => {
        const res = await request<any>('/auth/verify-reset-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        })
        const token = res?.data?.token || res?.token || res?.data || 'verified-reset-token'
        return {
            token,
            message: res?.message || 'Code verified',
        }
    },

    /**
     * Reset password with token received from OTP verification
     */
    resetPassword: async (token: string, password: string): Promise<{ success: boolean; message?: string }> => {
        const res = await request<any>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password }),
        })
        return {
            success: true,
            message: res?.message || 'Password reset successfully',
        }
    },

    /**
     * Change password for logged-in user
     */
    changePassword: async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
        const res = await request<any>('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword }),
        })
        return {
            success: true,
            message: res?.message || 'Password changed successfully',
        }
    },

    /**
     * Update user details
     */
    updateUser: async (payload: { name?: string; phone?: string; image?: string }): Promise<AdminUser> => {
        const res = await request<any>('/auth/update-user', {
            method: 'PATCH',
            body: JSON.stringify(payload),
        })
        const updated = mapApiUserToAdmin(res?.data || res)
        const currentSession = authApi.getSessionSync()
        if (currentSession) {
            currentSession.user = { ...currentSession.user, ...updated }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSession))
        }
        return updated
    },

    /**
     * Sign out and clear server and local session
     */
    signOut: async (): Promise<void> => {
        try {
            await request('/auth/sign-out', { method: 'POST' })
        } catch (e) {
            console.warn('Sign-out request warning:', e)
        } finally {
            localStorage.removeItem(STORAGE_KEY)
            localStorage.removeItem(TOKEN_STORAGE_KEY)
        }
    },

    /**
     * Get current session from backend or storage
     */
    getSession: async (): Promise<AuthSession | null> => {
        const local = authApi.getSessionSync()
        try {
            const res = await request<any>('/auth/session')
            const userData = res?.data?.user || res?.data || res?.user
            if (userData) {
                const user = mapApiUserToAdmin(userData)
                const session: AuthSession = {
                    user,
                    token: local?.token,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
                return session
            }
        } catch (err: any) {
            if (err?.statusCode === 401) {
                // If 401, session expired on backend
                localStorage.removeItem(STORAGE_KEY)
                localStorage.removeItem(TOKEN_STORAGE_KEY)
                return null
            }
        }
        return local
    },

    /**
     * Get current session synchronously (for immediate route guards)
     */
    getSessionSync: (): AuthSession | null => {
        if (typeof window === 'undefined') return null
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null

        try {
            const session: AuthSession = JSON.parse(raw)
            if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
                localStorage.removeItem(STORAGE_KEY)
                localStorage.removeItem(TOKEN_STORAGE_KEY)
                return null
            }
            return session
        } catch {
            localStorage.removeItem(STORAGE_KEY)
            return null
        }
    },
}


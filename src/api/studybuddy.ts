import { request, toQuery } from './base'

export interface SubjectItem {
    id: string
    name: string
    code?: string
    image?: string
    gradeLevelId?: string
    createdAt?: string
    updatedAt?: string
}

export interface ExamItem {
    id: string
    title: string
    slug?: string
    examYear?: number
    institutionId?: string
    unitId?: string
    gradeLevelId?: string
    durationMinutes?: number
    totalMarks?: number
    questionCount?: number
}

export interface QuizItem {
    id: string
    title: string
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
    subjectId?: string
    topicId?: string
    isGlobal?: boolean
    questions?: Array<{
        id: string
        text: string
        options: Array<{ id: string; text: string; isCorrect?: boolean }>
        explanation?: string
    }>
}

export interface StreakData {
    currentStreak: number
    longestStreak: number
    lastActiveDate?: string
    calendar?: Array<{ date: string; count: number }>
}

export interface LeaderboardEntry {
    rank: number
    id: string
    name: string
    image?: string
    xpPoints?: number
    score?: number
    college?: string
}

/**
 * Complete typed client for StudyBuddy API (https://api-studybuddy.kodevio.com)
 */
export const studyBuddyApi = {
    // Subjects
    subjects: {
        list: async (params?: { search?: string; gradeLevelId?: string }) => {
            const query = params ? toQuery(params) : ''
            const res = await request<any>(`/subjects${query}`)
            return (res?.data || res) as SubjectItem[]
        },
        getById: async (id: string) => {
            const res = await request<any>(`/subjects/${id}`)
            return (res?.data || res) as SubjectItem
        },
    },

    // Exams
    exams: {
        list: async (params?: {
            institutionId?: string
            unitId?: string
            examYear?: number
            search?: string
            page?: number
            limit?: number
        }) => {
            const query = params ? toQuery(params) : ''
            const res = await request<any>(`/exams${query}`)
            return (res?.data || res) as ExamItem[]
        },
        questions: async (params?: { examId?: string; search?: string }) => {
            const query = params ? toQuery(params) : ''
            const res = await request<any>(`/exams/questions${query}`)
            return res?.data || res
        },
        institutions: async () => {
            const res = await request<any>('/exams/institutions')
            return res?.data || res
        },
    },

    // Quizzes & Attempts
    quizzes: {
        list: async (params?: { search?: string; difficulty?: 'EASY' | 'MEDIUM' | 'HARD'; isGlobal?: boolean }) => {
            const query = params ? toQuery(params) : ''
            const res = await request<any>(`/quizzes${query}`)
            return (res?.data || res) as QuizItem[]
        },
        getById: async (id: string) => {
            const res = await request<any>(`/quizzes/${id}`)
            return (res?.data || res) as QuizItem
        },
        generateWithAi: async (payload: { topicId: string; subjectId?: string; difficulty?: string; questionCount?: number }) => {
            const res = await request<any>('/quizzes/ai/generate', {
                method: 'POST',
                body: JSON.stringify(payload),
            })
            return res?.data || res
        },
        submitAttempt: async (quizId: string, answers: Array<{ questionId: string; selectedOptionId: string }>) => {
            const res = await request<any>(`/quizzes/${quizId}/attempts`, {
                method: 'POST',
                body: JSON.stringify({ answers }),
            })
            return res?.data || res
        },
    },

    // Streaks
    streaks: {
        getMyStreak: async (days: number = 30): Promise<StreakData> => {
            const res = await request<any>(`/streaks/me?days=${days}`)
            return res?.data || res
        },
    },

    // Leaderboard
    leaderboard: {
        list: async (page: number = 1, limit: number = 50) => {
            const res = await request<any>(`/leaderboard?page=${page}&limit=${limit}`)
            return res?.data || res
        },
        getMyRank: async () => {
            const res = await request<any>('/leaderboard/me')
            return res?.data || res
        },
    },

    // Conversations / AI Doubt Solver
    chat: {
        send: async (payload: { message: string; conversationId?: string; subjectId?: string; topicId?: string }) => {
            const res = await request<any>('/conversations/chat', {
                method: 'POST',
                body: JSON.stringify(payload),
            })
            return res?.data || res
        },
    },

    // Grades (Class 9, Class 10, Class 11, Class 12)
    grades: {
        list: async () => {
            const res = await request<any>('/grades')
            return res?.data || res
        },
        getById: async (id: string) => {
            const res = await request<any>(`/grades/${id}`)
            return res?.data || res
        },
    },

    // Marketplace & Resources
    marketplace: {
        listings: async (params?: Record<string, string | number | boolean | undefined>) => {
            const query = params ? toQuery(params) : ''
            const res = await request<any>(`/marketplace/listings${query}`)
            return res?.data || res
        },
        myResources: async () => {
            const res = await request<any>('/marketplace/my-resources')
            return res?.data || res
        },
        purchases: async () => {
            const res = await request<any>('/marketplace/purchases')
            return res?.data || res
        },
    },

    // Student Profile
    profile: {
        getMe: async () => {
            const res = await request<any>('/student-profile/me')
            return res?.data || res
        },
        updateMe: async (payload: Record<string, unknown>) => {
            const res = await request<any>('/student-profile/me', {
                method: 'PATCH',
                body: JSON.stringify(payload),
            })
            return res?.data || res
        },
    },
}


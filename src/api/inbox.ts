import type { Conversation, Message } from '@/types/inbox'

const CURRENT_USER_ID = 'me'

let mockConversations: Conversation[] = [
    {
        id: 'c1',
        contact: {
            id: 'u1',
            name: 'Wade Warren',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Wade',
            status: 'online',
            bookingDetails: 'Room 202 · 5 Nights',
        },
        unreadCount: 2,
        messages: [
            {
                id: 'm1',
                senderId: 'u1',
                text: 'Hi, we will be arriving around 8 PM. Is that okay?',
                timestamp: '10:30 AM',
                status: 'read',
            },
            {
                id: 'm2',
                senderId: CURRENT_USER_ID,
                text: 'Hello Wade! Noted. The reception is open 24/7, so late check-in is perfectly fine.',
                timestamp: '10:35 AM',
                status: 'read',
            },
            {
                id: 'm3',
                senderId: 'u1',
                text: 'Do you offer airport transfer?',
                timestamp: '11:00 AM',
                status: 'read',
            },
            {
                id: 'm4',
                senderId: 'u1',
                text: 'If so, how much is it for 2 people?',
                timestamp: '11:01 AM',
                status: 'delivered',
            },
        ],
    },
    {
        id: 'c2',
        contact: {
            id: 'u2',
            name: 'Dianne Russell',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Dianne',
            status: 'offline',
            lastSeen: '2 hours ago',
            bookingDetails: 'Room 103 · Checkout tomorrow',
        },
        unreadCount: 0,
        messages: [
            {
                id: 'm1',
                senderId: 'u2',
                text: 'Could we get some extra towels to our room?',
                timestamp: 'Yesterday',
                status: 'read',
            },
            {
                id: 'm2',
                senderId: CURRENT_USER_ID,
                text: 'Absolutely! I will send housekeeping up right away.',
                timestamp: 'Yesterday',
                status: 'read',
            },
            {
                id: 'm3',
                senderId: 'u2',
                text: 'Thank you! We got them.',
                timestamp: 'Yesterday',
                status: 'read',
            },
        ],
    },
    {
        id: 'c3',
        contact: {
            id: 'c1',
            name: 'Eleanor Pena',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
            status: 'online',
            bookingDetails: 'Room 302 · Oct 24 - Oct 29',
            notes: 'Requested a quiet room away from the elevator if possible. Also asked about airport transfer options.',
        },
        unreadCount: 1,
        messages: [
            {
                id: 'm1',
                senderId: 'u3',
                text: 'Is the spa open today?',
                timestamp: '09:15 AM',
                status: 'read',
            },
            {
                id: 'm2',
                senderId: CURRENT_USER_ID,
                text: 'Guest seems to have high expectations, ensure we offer priority booking for the spa.',
                timestamp: '09:16 AM',
                status: 'read',
                isInternalNote: true,
            },
            {
                id: 'm3',
                senderId: CURRENT_USER_ID,
                text: 'Yes, the spa is open until 10 PM. Would you like me to book a session for you?',
                timestamp: '09:20 AM',
                status: 'read',
            },
            {
                id: 'm4',
                senderId: 'u3',
                text: 'Yes please, 2 PM would be perfect.',
                timestamp: '09:25 AM',
                status: 'delivered',
            },
        ],
    },
    {
        id: 'c4',
        contact: {
            id: 'u4',
            name: 'Cody Fisher',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Cody',
            status: 'away',
            lastSeen: '15 mins ago',
            bookingDetails: 'Room 112 · Pending confirmation',
        },
        unreadCount: 0,
        messages: [
            {
                id: 'm1',
                senderId: CURRENT_USER_ID,
                text: 'Dear Cody, we need a copy of your ID to confirm the booking.',
                timestamp: 'Monday',
                status: 'read',
            },
            {
                id: 'm2',
                senderId: 'u4',
                text: 'Sure, I will upload it through the portal tonight.',
                timestamp: 'Monday',
                status: 'read',
            },
        ],
    },
    {
        id: 'c5',
        contact: {
            id: 'u5',
            name: 'Jane Cooper',
            avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jane',
            status: 'offline',
            lastSeen: '1 day ago',
            bookingDetails: 'Room 201 · 2 Nights',
        },
        unreadCount: 0,
        messages: [
            {
                id: 'm1',
                senderId: 'u5',
                text: 'Can we get a late checkout?',
                timestamp: 'Sunday',
                status: 'read',
            },
            {
                id: 'm2',
                senderId: CURRENT_USER_ID,
                text: 'We can extend your checkout until 1 PM complimentary. Any later would incur a half-day charge.',
                timestamp: 'Sunday',
                status: 'read',
            },
        ],
    },
]

export const inboxApi = {
    list: async (_params?: Record<string, string | number | boolean | undefined>) => {
        await new Promise((r) => setTimeout(r, 500))
        return {
            data: mockConversations,
            meta: { page: 1, limit: 10, total: mockConversations.length, totalPages: 1 },
        }
    },
    sendMessage: async (conversationId: string, message: Message) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockConversations.findIndex((c) => c.id === conversationId)
        if (index !== -1) {
            mockConversations[index] = {
                ...mockConversations[index],
                messages: [...mockConversations[index].messages, message],
            }
        }
        return { data: mockConversations[index] }
    },
    updateReadStatus: async (conversationId: string) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockConversations.findIndex((c) => c.id === conversationId)
        if (index !== -1) {
            const updatedMessages = [...mockConversations[index].messages]
            const lastMsg = updatedMessages[updatedMessages.length - 1]
            if (lastMsg && lastMsg.senderId === CURRENT_USER_ID) {
                lastMsg.status = 'read'
            }
            mockConversations[index] = { ...mockConversations[index], messages: updatedMessages }
        }
        return { data: mockConversations[index] }
    },
    blockUser: async (conversationId: string) => {
        await new Promise((r) => setTimeout(r, 500))
        mockConversations = mockConversations.filter((c) => c.id !== conversationId)
    },
    updateNote: async (conversationId: string, note: string) => {
        await new Promise((r) => setTimeout(r, 500))
        const index = mockConversations.findIndex((c) => c.id === conversationId)
        if (index !== -1) {
            mockConversations[index] = {
                ...mockConversations[index],
                contact: { ...mockConversations[index].contact, notes: note },
            }
        }
        return { data: mockConversations[index] }
    },
}

export type ContactStatus = 'online' | 'offline' | 'away'

export interface Contact {
    id: string
    name: string
    avatar: string
    status: ContactStatus
    lastSeen?: string
    lastOnline?: string
    bookingDetails?: string
    notes?: string
}

export type MessageStatus = 'sent' | 'delivered' | 'read'

export interface Message {
    id: string
    senderId: string
    text: string
    timestamp: string
    status: MessageStatus
    isInternalNote?: boolean
}

export interface Conversation {
    id: string
    contact: Contact
    messages: Message[]
    unreadCount: number
}

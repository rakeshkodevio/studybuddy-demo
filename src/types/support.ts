export type SupportTicket = {
    id: string
    user: string
    issue: string
    date: string
    status: 'Open' | 'Pending' | 'Resolved'
}

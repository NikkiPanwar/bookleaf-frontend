export interface TicketDetailPageResponse {
    success: boolean;
    message: string;
    data: TicketData;
}

export interface TicketData {
    id: number;
    ticket_number: string;
    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    ai_classification: string;
    ai_priority: string;
    ai_reply_draft: string;

    author_id: string;
    assigned_admin_id: number | null;
    book_id: number | null;

    attachment_url: string | null;
    created_at: string;
    updated_at: string;

    book: TicketBook | null;
    author: TicketAuthor;
    assigned_admin: AssignedAdmin | null;

    replies: TicketReply[];
    internal_notes: TicketInternalNote[];
}

export interface TicketAuthor {
    id: number;
    author_id: string;
    full_name: string;
    email: string;
    phone: string;
    city: string;
    joined_date: string;
    role: string;
    hashed_password: string;
}

export interface TicketBook {
    id: number;
    title: string;
    isbn?: string;
}

export interface AssignedAdmin {
    id: number;
    full_name: string;
    email?: string;
}

export interface TicketReply {
    id: number;
    ticket_id: number;
    message: string;
    created_at: string;
    sender_id?: number;
    sender_role?: string;
    sender_name?: string;
}

export interface TicketInternalNote {
    id: number;
    ticket_id: number;
    note: string;
    created_at: string;
    admin_id?: number;
    admin_name?: string;
}


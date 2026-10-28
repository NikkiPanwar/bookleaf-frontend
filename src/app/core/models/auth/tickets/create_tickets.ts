
export interface CreateTicketRequest {
    subject: string;
    description: string;
    category: string;
    book_id?: string;
}

export interface Ticket {
    id: number;
    ticket_number: string;
    author_id: string;
    assigned_admin_id: number | null;
    book_id: string | null;

    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;

    attachment_url: string | null;

    ai_classification: string | null;
    ai_priority: string | null;
    ai_reply_draft: string | null;

    created_at: string;
    updated_at: string;
}

export interface CreateTicketResponse {
    success: boolean;
    message: string;
    data: Ticket;
}

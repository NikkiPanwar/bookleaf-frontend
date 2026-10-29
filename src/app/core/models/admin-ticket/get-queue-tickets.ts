import type { TicketReply } from '../../services/ticket.service';

export interface TicketQueueResponse {
  success: boolean;
  message: string;
  data: Ticket[];
}

export interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string;

  author_id: string;
  book_id: string | null;
  assigned_admin_id: number | null;

  category: string;
  priority: string;
  status: string;

  ai_classification: string;
  ai_priority: string;
  ai_reply_draft: string;

  attachment_url: string | null;

  created_at: string;
  updated_at: string;

  author: TicketAuthor;
  book: TicketBook | null;
  // Optional display helpers used in list/queue templates
  author_name?: string;
  book_title?: string;

assigned_admin?:string;
  // Replies associated with the ticket (optional)
  replies?: TicketReply[];
}

export interface TicketAuthor {
  id: number;
  author_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  joined_date: string;
}

export interface TicketBook {
  id: number;
  book_id: string;
  author_id: string;
  title: string;
  isbn: string;
  genre: string;
  publication_date: string;
  status: string;
  print_partner: string;
  available_on: string[];
  mrp: number;
  author_royalty_per_copy: number;
  total_copies_sold: number;
  total_royalty_earned: number;
  royalty_paid: number;
  royalty_pending: number;
  last_royalty_payout_date: string;
}

export interface TicketAdmin {
  id: number;
  admin_id?: string;
  full_name?: string;
  email?: string;
  role?: string;
}
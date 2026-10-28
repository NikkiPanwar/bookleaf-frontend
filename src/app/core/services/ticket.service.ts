import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTicketResponse } from '../models/auth/tickets/create_tickets';

export interface TicketReply {
  id: number;
  ticket_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: 'author' | 'admin';
  message: string;
  attachment_url?: string;
  created_at: string;
}

export interface InternalNote {
  id: number;
  ticket_id: number;
  admin_id: number;
  admin_name: string;
  note_text: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  author_id: string;
  author_name?: string;
  book_id?: string;
  book_title?: string;
  subject: string;
  description: string;
  attachment_url?: string;
  category: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  ai_classification?: string;
  ai_priority?: 'Urgent' | 'High' | 'Medium' | 'Low';
  ai_reply_draft?: string;
  assigned_admin_id?: number;
  assigned_admin_name?: string;
  created_at: string;
  updated_at: string;
  replies?: TicketReply[];
  internal_notes?: InternalNote[];
}

export interface TicketFilterParams {
  status?: string;
  category?: string;
  priority?: string;
  date?: string;
  search?: string;
}

/**
 * Ticket Service
 * Manages queries, tickets, replies, internal notes, and AI assistance
 * for both Author and Admin portals.
 */
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private readonly AUTHOR_API = environment.authorTickets;
  private readonly ADMIN_API = 'http://localhost:8000/api/admin/tickets';

  // --- Author Portal Methods ---

  getMyTickets(): Observable<any> {
    return this.http.get<any>(this.AUTHOR_API);
  }

  getTicketById(id: number | string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.AUTHOR_API}/${id}`);
  }

  createTicket(formData: FormData): Observable<CreateTicketResponse> {
    return this.http.post<CreateTicketResponse>(this.AUTHOR_API, formData);
  }

  addReply(ticketId: number | string, message: string): Observable<TicketReply> {
    return this.http.post<TicketReply>(`${this.AUTHOR_API}/${ticketId}/reply`, { message });
  }

  // --- Admin Portal Methods ---

  getTicketQueue(filters: TicketFilterParams = {}): Observable<Ticket[]> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.date) params = params.set('date', filters.date);
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<Ticket[]>(this.ADMIN_API, { params });
  }

  getAdminTicketDetail(id: number | string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.ADMIN_API}/${id}`);
  }

  assignToSelf(id: number | string): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.ADMIN_API}/${id}/assign`, {});
  }

  updateClassificationAndPriority(
    id: number | string,
    category: string,
    priority: string
  ): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.ADMIN_API}/${id}/classification`, { category, priority });
  }

  updateStatus(id: number | string, status: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.ADMIN_API}/${id}/status`, { status });
  }

  addInternalNote(id: number | string, noteText: string): Observable<InternalNote> {
    return this.http.post<InternalNote>(`${this.ADMIN_API}/${id}/notes`, { note_text: noteText });
  }

  sendAdminReply(id: number | string, message: string): Observable<TicketReply> {
    return this.http.post<TicketReply>(`${this.ADMIN_API}/${id}/reply`, { message });
  }

  generateAiDraft(id: number | string): Observable<{ classification: string; priority: string; reply_draft: string }> {
    return this.http.post<{ classification: string; priority: string; reply_draft: string }>(
      `${this.ADMIN_API}/${id}/ai-draft`,
      {}
    );
  }
}

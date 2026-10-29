import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CreateTicketResponse } from '../models/auth/tickets/create_tickets';
import { Ticket, TicketQueueResponse } from '../models/admin-ticket/get-queue-tickets';
import { TicketDetailPageResponse } from '../models/admin-ticket/get-ticket-detail-pages';
import { Observable } from 'rxjs';

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

export interface TicketFilterParams {
  status?: string;
  category?: string;
  priority?: string;
  date?: string;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private readonly AUTHOR_API = environment.authorTickets;
  private readonly ADMIN_API = environment.adminTickets;

  // ---------- Author portal ----------
  getMyTickets(): Observable<any> {
    return this.http.get<any>(this.AUTHOR_API);
  }

  getTicketById(id: number | string): Observable<Ticket> {
    return this.http.get<{ success: boolean; message: string; data: Ticket }>(`${this.AUTHOR_API}/${id}`)
      .pipe(map(res => res.data));
  }

  createTicket(formData: FormData): Observable<CreateTicketResponse> {
    return this.http.post<CreateTicketResponse>(this.AUTHOR_API, formData);
  }

  addReply(ticketId: number | string, message: string): Observable<TicketReply> {
    return this.http.post<TicketReply>(`${this.AUTHOR_API}/${ticketId}/reply`, { message });
  }

  // ---------- Admin portal ----------
  getTicketQueue(filters: TicketFilterParams = {}): Observable<TicketQueueResponse> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.date) params = params.set('date', filters.date);
    if (filters.search) params = params.set('search', filters.search);
    return this.http.get<TicketQueueResponse>(this.ADMIN_API, { params });
  }

  getAdminTicketDetail(id: number | string): Observable<TicketDetailPageResponse> {
    return this.http.get<TicketDetailPageResponse>(`${this.ADMIN_API}/${id}`);
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

// Re‑export models for convenient imports elsewhere
export { Ticket, TicketQueueResponse };
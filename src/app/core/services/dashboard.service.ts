import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthorDashboardStats {
  author_name: string;
  total_books: number;
  total_copies_sold: number;
  total_royalty_earned: number;
  royalty_paid: number;
  royalty_pending: number;
  active_tickets_count: number;
}

/**
 * Dashboard Service
 * Provides quick metric summaries for author dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.dashboardUrl;

  getAuthorDashboard(): Observable<AuthorDashboardStats> {
    return this.http.get<AuthorDashboardStats>(`${this.API_URL}/author`);
  }
}

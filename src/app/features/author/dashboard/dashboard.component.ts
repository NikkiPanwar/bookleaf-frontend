import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, AuthorDashboardStats } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Author Dashboard Component
 * Simple dashboard providing summary statistics:
 * - Books published
 * - Copies sold
 * - Royalty metrics (earned, paid, pending)
 * - Open support tickets
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  user = this.authService.getCurrentUser();
  loading = true;
  stats: AuthorDashboardStats = {
    author_name: this.user?.full_name || 'Author',
    total_books: 0,
    total_copies_sold: 0,
    total_royalty_earned: 0,
    royalty_paid: 0,
    royalty_pending: 0,
    active_tickets_count: 0
  };

  ngOnInit(): void {
    this.dashboardService.getAuthorDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        // Fallback for initial demo state
        this.loading = false;
      }
    });
  }
}

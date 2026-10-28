import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket, TicketFilterParams } from '../../../../core/services/ticket.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * Admin Ticket Queue Component
 * Displays all authors' support queries with filters for:
 * - Status (Open, In Progress, Resolved, Closed)
 * - Category (Royalty, Publishing, Distribution, etc.)
 * - Priority (Urgent, High, Medium, Low)
 * - Date
 *
 * Visually highlights Urgent tickets and the oldest unresolved queries
 * to facilitate prompt SLA handling.
 */
@Component({
  selector: 'app-ticket-queue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  templateUrl: './ticket-queue.component.html',
  styleUrl: './ticket-queue.component.scss'
})
export class TicketQueueComponent implements OnInit {
  private ticketService = inject(TicketService);

  loading = true;
  tickets: Ticket[] = [];

  filters: TicketFilterParams = {
    status: '',
    category: '',
    priority: '',
    date: '',
    search: ''
  };

  categories = [
    'Royalty & Payouts',
    'Publishing & Editing',
    'Distribution & Inventory',
    'Account & Profile',
    'General Inquiry'
  ];

  statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  priorities = ['Urgent', 'High', 'Medium', 'Low'];

  ngOnInit(): void {
    this.fetchQueue();
  }

  fetchQueue(): void {
    this.loading = true;
    this.ticketService.getTicketQueue(this.filters).subscribe({
      next: (data) => {
        this.tickets = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.fetchQueue();
  }

  resetFilters(): void {
    this.filters = {
      status: '',
      category: '',
      priority: '',
      date: '',
      search: ''
    };
    this.fetchQueue();
  }

  /**
   * Helper to flag tickets that are unresolved and created over 48 hours ago
   */
  isOldUnresolved(ticket: Ticket): boolean {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      return false;
    }
    const created = new Date(ticket.created_at).getTime();
    const now = Date.now();
    const hoursElapsed = (now - created) / (1000 * 60 * 60);
    return hoursElapsed >= 48;
  }
}

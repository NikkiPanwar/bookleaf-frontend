import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketService, TicketFilterParams } from '../../../../core/services/ticket.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { finalize, tap } from 'rxjs';
import { Ticket } from '../../../../core/models/admin-ticket/get-queue-tickets';

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
  ticketQueue: Ticket[] = [];

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
    this.getQueueTickets();
  }


  getQueueTickets() {
    this.loading = true;
    this.ticketService.getTicketQueue(this.filters).pipe(
      tap(response => {
        if (response.success) {
          this.ticketQueue = response.data
        }
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe()
  }



  onFilterChange(): void {
    this.getQueueTickets();
  }

  resetFilters(): void {
    this.filters = {
      status: '',
      category: '',
      priority: '',
      date: '',
      search: ''
    };
    this.getQueueTickets();
  }

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

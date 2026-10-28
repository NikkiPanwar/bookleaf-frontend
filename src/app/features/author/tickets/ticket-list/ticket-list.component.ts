import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../../core/services/ticket.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { finalize, tap } from 'rxjs';

/**
 * Author Ticket List Component
 * Lists the author's submitted support queries with their statuses and priorities.
 */
@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);

  loading = true;
  tickets: Ticket[] = [];

  ngOnInit(): void {
    this.getTickets()
  }

  getTickets() {
    this.ticketService.getMyTickets().pipe(
      tap(response => {
        if (response.success) {
          this.tickets = response.data;
        }
      }), 
      finalize(() => {
        this.loading = false;
      })
    ).subscribe()
  }

}

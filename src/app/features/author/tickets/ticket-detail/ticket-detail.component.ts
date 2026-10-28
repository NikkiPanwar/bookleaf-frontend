import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../../core/services/ticket.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * Author Ticket Detail Component
 * Displays the original query, its status/category/priority,
 * and the conversation thread containing admin responses.
 * Also allows the author to submit additional replies.
 */
@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);

  ticketId: string | null = null;
  ticket: Ticket | null = null;
  loading = true;
  replyMessage = '';
  submittingReply = false;

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    if (this.ticketId) {
      this.loadTicket();
    }
  }

  loadTicket(): void {
    if (!this.ticketId) return;
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  submitReply(): void {
    if (!this.ticketId || !this.replyMessage.trim()) return;

    this.submittingReply = true;
    this.ticketService.addReply(this.ticketId, this.replyMessage).subscribe({
      next: (newReply) => {
        if (this.ticket) {
          if (!this.ticket.replies) this.ticket.replies = [];
          this.ticket.replies.push(newReply);
        }
        this.replyMessage = '';
        this.submittingReply = false;
      },
      error: () => {
        this.submittingReply = false;
      }
    });
  }
}

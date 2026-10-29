
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TicketService } from '../../../../core/services/ticket.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { Ticket } from '../../../../core/models/admin-ticket/get-queue-tickets';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    StatusBadgeComponent
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  private pollIntervalTimer: any = null;

  ticketId: string | null = null;
  ticket: Ticket | null = null;

  loading = true;
  submittingReply = false;

  replyMessage = '';
  errorMessage = '';
  replyError = '';
  replySuccess = '';

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');

    if (!this.ticketId) {
      this.loading = false;
      this.errorMessage = 'Invalid ticket ID.';
      return;
    }

    this.loadTicket();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private startPolling(): void {
    this.stopPolling();
    // Poll every 5 seconds to provide near-real-time updates as required by the spec
    this.pollIntervalTimer = setInterval(() => {
      if (this.ticketId && !this.submittingReply) {
        this.ticketService.getTicketById(this.ticketId).subscribe({
          next: (ticket) => {
            if (this.ticket) {
              this.ticket = ticket;
            }
          },
          error: () => {} // Silent fail on background poll
        });
      }
    }, 5000);
  }

  private stopPolling(): void {
    if (this.pollIntervalTimer) {
      clearInterval(this.pollIntervalTimer);
      this.pollIntervalTimer = null;
    }
  }

  loadTicket(): void {
    if (!this.ticketId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load ticket:', error);

        this.ticket = null;
        this.errorMessage =
          'We could not load this ticket. Please try again.';
        this.loading = false;
      }
    });
  }

  submitReply(): void {
    const message = this.replyMessage.trim();

    if (!this.ticketId || !message || this.submittingReply) {
      return;
    }

    if (this.ticket?.status === 'Closed') {
      this.replyError = 'This ticket is closed and cannot accept replies.';
      return;
    }

    this.submittingReply = true;
    this.replyError = '';
    this.replySuccess = '';


    this.ticketService.addReply(this.ticketId, message).subscribe({
      next: () => {
        this.replyMessage = '';
        this.replySuccess = 'Your message was sent successfully.';
        this.submittingReply = false;
        this.loadTicket();
      },
      error: (error) => {
        console.error('Failed to send reply:', error);

        this.replyError =
          'Unable to send your message. Please try again.';
        this.submittingReply = false;
      }
    });
  }

  getAttachmentName(url: string): string {
    const filename = url.split('/').pop() || 'Attached file';

    try {
      return decodeURIComponent(filename);
    } catch {
      return filename;
    }
  }

  getAttachmentHref(url: string): string {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    return url;
  }
}

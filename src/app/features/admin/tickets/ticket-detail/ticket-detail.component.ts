import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { tap } from 'rxjs';
import { TicketData } from '../../../../core/models/admin-ticket/get-ticket-detail-pages';

/**
 * Admin Ticket Detail Component
 * Implements all admin ticket actions:
 *   1. View original query
 *   2. Editable classification & priority
 *   3. AI‑generated reply draft
 *   4. Internal staff notes
 *   5. Assign‑to‑self
 *   6. Status updates
 *   7. Send reply to author
 */
@Component({
  selector: 'app-admin-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class AdminTicketDetailComponent {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);

  ticketId: string | null = null;
  ticket: TicketData | null = null;
  loading = true;
  currentUser = this.authService.getCurrentUser();

  // Editable Classification & Priority
  editableCategory = '';
  editablePriority: 'Urgent' | 'High' | 'Medium' | 'Low' = 'Medium';
  updatingClassification = false;

  // Editable AI Reply Draft
  editableReplyDraft = '';
  generatingAi = false;
  sendingReply = false;
  updatingStatus = false;

  internalNoteText = '';
  submittingNote = false;

  categories = [
    'Royalty & Payouts',
    'Publishing & Editing',
    'Distribution & Inventory',
    'Account & Profile',
    'General Inquiry'
  ];

  priorities: Array<'Urgent' | 'High' | 'Medium' | 'Low'> = ['Urgent', 'High', 'Medium', 'Low'];
  statuses: Array<'Open' | 'In Progress' | 'Resolved' | 'Closed'> = ['Open', 'In Progress', 'Resolved', 'Closed'];

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    if (this.ticketId) {
      this.loadTicket();
    }
  }

  loadTicket(): void {
    if (!this.ticketId) return;
    this.ticketService.getAdminTicketDetail(this.ticketId).pipe(
      tap(response => {
        if (response.success) {
          this.ticket = response.data;
          this.editableCategory = response.data.category || 'General Inquiry';
          const priority = response.data.priority;
          this.editablePriority =
            priority === 'Urgent' ||
              priority === 'High' ||
              priority === 'Medium' ||
              priority === 'Low'
              ? priority
              : 'Medium';
          this.editableReplyDraft = (response.data as any).ai_reply_draft || '';
          this.loading = false;
        }
      })
    ).subscribe();
  }


  assignToSelf(): void {
    if (!this.ticketId) return;

    this.ticketService.assignToSelf(this.ticketId).subscribe({
      next: (updated) => {
        if (this.ticket) {
          this.ticket.assigned_admin_id = updated.assigned_admin_id;
          // this.ticket.assigned_admin = updated.assigned_admin ?? null;
        }
      }
    });
  }

  saveClassificationAndPriority(): void {
    if (!this.ticketId) return;
    this.updatingClassification = true;
    this.ticketService.updateClassificationAndPriority(
      this.ticketId,
      this.editableCategory,
      this.editablePriority
    ).subscribe({
      next: (updated) => {
        if (this.ticket) {
          this.ticket.category = updated.category;
          this.ticket.priority = updated.priority;
        }
        this.updatingClassification = false;
      },
      error: () => {
        this.updatingClassification = false;
      }
    });
  }

  changeStatus(newStatus: string): void {
    if (!this.ticketId) return;
    this.updatingStatus = true;
    this.ticketService.updateStatus(this.ticketId, newStatus).subscribe({
      next: (updated) => {
        if (this.ticket) {
          this.ticket.status = updated.status;
        }
        this.updatingStatus = false;
      },
      error: () => {
        this.updatingStatus = false;
      }
    });
  }


  requestAiDraft(): void {
    if (!this.ticketId) return;

    this.generatingAi = true;

    this.ticketService.generateAiDraft(this.ticketId).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.editableCategory = data.classification;
        this.editablePriority = data.priority;
        this.editableReplyDraft = data.reply_draft;

        this.generatingAi = false;
      },
      error: (err) => {
        console.error('Failed to generate AI draft:', err);
        this.generatingAi = false;
      }
    });
  }

  sendReply(): void {
    if (!this.ticketId || !this.editableReplyDraft.trim()) return;

    this.sendingReply = true;

    this.ticketService
      .sendAdminReply(this.ticketId, this.editableReplyDraft)
      .subscribe({
        next: () => {
          this.editableReplyDraft = '';
          this.sendingReply = false;
          this.loadTicket();
        },
        error: () => {
          this.sendingReply = false;
        }
      });
  }

  addNote(): void {
    if (!this.ticketId || !this.internalNoteText.trim()) return;

    this.submittingNote = true;

    this.ticketService
      .addInternalNote(this.ticketId, this.internalNoteText)
      .subscribe({
        next: () => {
          this.internalNoteText = '';
          this.submittingNote = false;
          this.loadTicket();
        },
        error: () => {
          this.submittingNote = false;
        }
      });
  }

}

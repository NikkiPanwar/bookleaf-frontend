import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../../core/services/ticket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * Admin Ticket Detail Component
 * Fulfills all specified Admin requirements:
 * 1. View Original Query
 * 2. Editable AI Classification & Priority
 * 3. Editable AI Reply Draft
 * 4. Internal Notes (Private to Admin Staff)
 * 5. Assign-to-self Action
 * 6. Status Update (Open, In Progress, Resolved, Closed)
 * 7. Send-Reply Action (Communicated to Author)
 */
@Component({
  selector: 'app-admin-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class AdminTicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);

  ticketId: string | null = null;
  ticket: Ticket | null = null;
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

  // Status update
  updatingStatus = false;

  // Internal Notes
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
    this.ticketService.getAdminTicketDetail(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.editableCategory = ticket.category || 'General Inquiry';
        this.editablePriority = ticket.priority || 'Medium';
        this.editableReplyDraft = ticket.ai_reply_draft || '';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  assignToSelf(): void {
    if (!this.ticketId) return;
    this.ticketService.assignToSelf(this.ticketId).subscribe({
      next: (updated) => {
        if (this.ticket) {
          this.ticket.assigned_admin_id = updated.assigned_admin_id;
          this.ticket.assigned_admin_name = updated.assigned_admin_name || this.currentUser?.full_name;
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
      next: (res) => {
        this.editableCategory = res.classification;
        this.editablePriority = res.priority as any;
        this.editableReplyDraft = res.reply_draft;
        this.generatingAi = false;
      },
      error: () => {
        this.generatingAi = false;
      }
    });
  }

  sendReply(): void {
    if (!this.ticketId || !this.editableReplyDraft.trim()) return;
    this.sendingReply = true;
    this.ticketService.sendAdminReply(this.ticketId, this.editableReplyDraft).subscribe({
      next: (newReply) => {
        if (this.ticket) {
          if (!this.ticket.replies) this.ticket.replies = [];
          this.ticket.replies.push(newReply);
          this.ticket.status = 'In Progress';
        }
        this.editableReplyDraft = '';
        this.sendingReply = false;
      },
      error: () => {
        this.sendingReply = false;
      }
    });
  }

  addNote(): void {
    if (!this.ticketId || !this.internalNoteText.trim()) return;
    this.submittingNote = true;
    this.ticketService.addInternalNote(this.ticketId, this.internalNoteText).subscribe({
      next: (newNote) => {
        if (this.ticket) {
          if (!this.ticket.internal_notes) this.ticket.internal_notes = [];
          this.ticket.internal_notes.push(newNote);
        }
        this.internalNoteText = '';
        this.submittingNote = false;
      },
      error: () => {
        this.submittingNote = false;
      }
    });
  }
}

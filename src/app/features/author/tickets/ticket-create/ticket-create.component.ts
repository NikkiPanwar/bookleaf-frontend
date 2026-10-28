
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { TicketService } from '../../../../core/services/ticket.service';
import { BookService } from '../../../../core/services/book.service';
import { Book, BooksResponse } from '../../../../core/models/books/all-books';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.scss'
})
export class TicketCreateComponent implements OnInit {

  showAiReply = false;
  aiReplyDraft = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  books: Book[] = [];
  submitting = false;
  selectedFile: File | null = null;
  errorMessage = '';

  categories = [
    'Royalty & Payouts',
    'Publishing & Editing',
    'Distribution & Inventory',
    'Account & Profile',
    'General Inquiry'
  ];

  ticketForm = this.fb.group({
    scope: ['general', Validators.required],
    subject: ['', [Validators.required, Validators.maxLength(255)]],
    category: ['Royalty & Payouts', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(5000)]]
  });

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.getMyBooks().subscribe({
      next: (response: BooksResponse) => {
        if (response.success) {
          this.books = response.data;
        }

        const preselectedBook =
          this.route.snapshot.queryParamMap.get('book_id');

        if (
          preselectedBook &&
          this.books.some(book => book.book_id === preselectedBook)
        ) {
          this.ticketForm.patchValue({ scope: preselectedBook });
        }
      },
      error: (error) => {
        console.error('Failed to load books:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.errorMessage = '';
    this.selectedFile = null;

    if (!file) {
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const allowedExtensions = /\.(pdf|png|jpe?g|csv|xlsx)$/i;

    if (
      !allowedExtensions.test(file.name) ||
      !allowedTypes.includes(file.type)
    ) {
      this.errorMessage = 'Please select a PDF, PNG, JPG, CSV, or XLSX file.';
      input.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage = 'File size must not exceed 10 MB.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const value = this.ticketForm.getRawValue();
    const formData = new FormData();

    formData.append('subject', value.subject!.trim());
    formData.append('description', value.description!.trim());
    formData.append('category', value.category!);

    if (value.scope !== 'general') {
      formData.append('book_id', value.scope!);
    }

    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    this.ticketService.createTicket(formData).subscribe({
      next: (response) => {
        this.submitting = false;

        if (response.success) {
          this.aiReplyDraft = response.data.ai_reply_draft || '';
          this.showAiReply = !!this.aiReplyDraft;

          if (this.showAiReply) {
            this.toastTimer = setTimeout(() => {
              this.showAiReply = false;
              this.router.navigate(['/author/tickets']);
            }, 5000);
          }
        } else {
          this.errorMessage = response.message || 'Unable to create ticket.';
        }
      },
      error: (error) => {
        this.submitting = false;
        console.error('Create ticket error:', error);

        this.errorMessage =
          error.error?.detail ||
          error.error?.message ||
          'Failed to submit query. Please try again.';
      }
    });
  }
}

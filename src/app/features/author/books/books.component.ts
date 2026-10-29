import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { finalize, tap } from 'rxjs';
import { Book, BooksResponse } from '../../../core/models/books/all-books';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {
  private bookService = inject(BookService);

  loading = true;
  books: Book[] = [];

  ngOnInit(): void {
    this.getBooks();
  }


  getBooks() {
    this.loading = true;
    this.bookService.getMyBooks().pipe(
      tap((response: BooksResponse) => {
        if (response.success) {
          this.books = response.data
        } else {
          console.log('something went wrong')
        }
      }),
      finalize(() => {
        this.loading = false
      })
    ).subscribe()
  }


  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('published') || s.includes('live')) return 'status-published';
    if (s.includes('review') || s.includes('progress')) return 'status-review';
    return 'status-draft';
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BooksResponse } from '../models/books/all-books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.bookUrl


  getMyBooks(): Observable<BooksResponse> {
    return this.http.get<BooksResponse>(this.API_URL);
  }

  getBookById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }
}

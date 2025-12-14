import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Book, CreateBookRequest } from './models/book.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected readonly title = signal('Library Management System');

  protected books = signal<Book[]>([]);

  protected newBookTitle = signal<string>('');
  protected newBookISBN = signal<string>('');
  protected newBookPublishedYear = signal<number>(2024);
  protected newBookAuthorId = signal<number>(1);
  protected newBookCategoryId = signal<number>(1);

  async ngOnInit() {
    this.books.set(await this.getBooks());
  }

  async getBooks(): Promise<Book[]> {
    try {
      return await lastValueFrom(this.http.get<Book[]>('http://localhost:5279/api/Book'));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  onNewBookTitleChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.newBookTitle.set(value);
  }

  onNewBookISBNChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.newBookISBN.set(value);
  }

  onNewBookPublishedYearChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.newBookPublishedYear.set(value);
  }

  onNewBookAuthorIdChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.newBookAuthorId.set(value);
  }

  onNewBookCategoryIdChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.newBookCategoryId.set(value);
  }

  async addBook(event: Event) {
    event.preventDefault();

    const body: CreateBookRequest = {
      title: this.newBookTitle(),
      isbn: this.newBookISBN(),
      publishedYear: this.newBookPublishedYear(),
      authorId: this.newBookAuthorId(),
      categoryId: this.newBookCategoryId(),
    };

    try {
      const message = await lastValueFrom(
        this.http.post('http://localhost:5279/api/Book', body, {
          responseType: 'text',
        })
      );

      console.log('API mesajı:', message);

      this.books.set(await this.getBooks());

      this.newBookTitle.set('');
      this.newBookISBN.set('');
      this.newBookPublishedYear.set(2024);
      this.newBookAuthorId.set(1);
      this.newBookCategoryId.set(1);
    } catch (error) {
      console.log(error);
    }
  }
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  authorId: number;
  categoryId: number;
  status: number;
}

export interface CreateBookRequest {
  title: string;
  isbn: string;
  publishedYear: number;
  authorId: number;
  categoryId: number;
}

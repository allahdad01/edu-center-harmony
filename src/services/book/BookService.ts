
import { Book } from '@/types';
import { BookQueryService } from './BookQueryService';
import { BookMutationService } from './BookMutationService';
import { DepartmentService } from './DepartmentService';

export class BookService {
  static async getAllBooks(): Promise<Book[]> {
    return BookQueryService.getAllBooks();
  }

  static async getBookById(id: string): Promise<Book> {
    return BookQueryService.getBookById(id);
  }

  static async createBook(book: Partial<Book>): Promise<Book> {
    return BookMutationService.createBook(book);
  }

  static async updateBook(id: string, book: Partial<Book>): Promise<void> {
    return BookMutationService.updateBook(id, book);
  }

  static async deleteBook(id: string): Promise<void> {
    return BookMutationService.deleteBook(id);
  }

  static async getAllDepartments(): Promise<{ id: string; name: string }[]> {
    return DepartmentService.getAllDepartments();
  }
}

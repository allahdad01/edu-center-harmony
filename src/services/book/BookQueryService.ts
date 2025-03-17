
import { Book, Student, Teacher, SalaryType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mapBookFromDatabase } from './bookMappers';

export class BookQueryService {
  static async getAllBooks(): Promise<Book[]> {
    try {
      const { data: books, error } = await supabase
        .from('books')
        .select(`
          *,
          departments:department_id(*),
          teacher_books:teacher_books(
            teacher:teacher_id(*)
          ),
          student_books:student_books(
            student:student_id(*)
          )
        `);

      if (error) throw error;

      return books.map(book => mapBookFromDatabase(book));
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  static async getBookById(id: string): Promise<Book> {
    try {
      const { data: book, error } = await supabase
        .from('books')
        .select(`
          *,
          departments:department_id(*),
          teacher_books:teacher_books(
            teacher:teacher_id(*)
          ),
          student_books:student_books(
            student:student_id(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return mapBookFromDatabase(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }
}

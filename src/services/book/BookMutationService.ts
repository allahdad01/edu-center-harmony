
import { Book } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { DepartmentService } from './DepartmentService';

export class BookMutationService {
  static async createBook(book: Partial<Book>): Promise<Book> {
    // First get department ID from department name
    let departmentId = book.department;
    
    if (typeof book.department === 'string') {
      departmentId = await DepartmentService.getDepartmentIdByName(book.department);
    }
    
    const { data, error } = await supabase
      .from('books')
      .insert({
        name: book.name,
        department_id: departmentId,
        start_date: book.startDate?.toISOString().split('T')[0],
        end_date: book.endDate?.toISOString().split('T')[0],
        fee: book.fee,
        periods: book.periods,
        is_active: book.isActive !== undefined ? book.isActive : true
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating book:', error);
      throw error;
    }
    
    // If teachers are specified, assign them
    if (book.teacherIds && book.teacherIds.length > 0) {
      await BookMutationService.assignTeachersToBook(data.id, book.teacherIds);
    }
    
    return {
      id: data.id,
      name: data.name,
      department: book.department || '',
      startDate: new Date(data.start_date),
      endDate: data.end_date ? new Date(data.end_date) : undefined,
      fee: Number(data.fee),
      periods: data.periods,
      isActive: data.is_active,
      teacherIds: book.teacherIds || [],
      teachers: [],
      students: []
    };
  }

  static async updateBook(id: string, book: Partial<Book>): Promise<void> {
    // First get department ID from department name if it's a string
    let departmentId = book.department;
    
    if (typeof book.department === 'string') {
      departmentId = await DepartmentService.getDepartmentIdByName(book.department);
    }
    
    const { error } = await supabase
      .from('books')
      .update({
        name: book.name,
        department_id: departmentId,
        start_date: book.startDate?.toISOString().split('T')[0],
        end_date: book.endDate?.toISOString().split('T')[0],
        fee: book.fee,
        periods: book.periods,
        is_active: book.isActive
      })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating book:', error);
      throw error;
    }
    
    // If teachers are specified, update assignments
    if (book.teacherIds) {
      await BookMutationService.updateTeacherAssignments(id, book.teacherIds);
    }
  }

  static async deleteBook(id: string): Promise<void> {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  private static async assignTeachersToBook(bookId: string, teacherIds: string[]): Promise<void> {
    if (teacherIds.length === 0) return;
    
    const teacherAssignments = teacherIds.map(teacherId => ({
      book_id: bookId,
      teacher_id: teacherId
    }));
    
    const { error } = await supabase
      .from('teacher_books')
      .insert(teacherAssignments);
      
    if (error) {
      console.error('Error assigning teachers:', error);
      // Don't throw, as the book was created successfully
    }
  }

  private static async updateTeacherAssignments(bookId: string, teacherIds: string[]): Promise<void> {
    // First delete all existing assignments
    const { error: deleteError } = await supabase
      .from('teacher_books')
      .delete()
      .eq('book_id', bookId);
      
    if (deleteError) {
      console.error('Error removing teacher assignments:', deleteError);
      // Continue anyway
    }
    
    // Now add new assignments if there are any
    if (teacherIds.length > 0) {
      await BookMutationService.assignTeachersToBook(bookId, teacherIds);
    }
  }
}


import { Salary } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class SalaryService {
  // Get all salaries
  static async getAllSalaries(filters?: { isPaid?: boolean; month?: string; year?: number }): Promise<Salary[]> {
    try {
      let query = supabase
        .from('salaries')
        .select(`
          *,
          teacher:teacher_id(id, name),
          salary_book_details:salary_book_details!salary_id(
            id,
            book_id,
            days,
            amount,
            book:book_id(id, name)
          )
        `)
        .order('year', { ascending: false })
        .order('month', { ascending: false });
        
      if (filters?.isPaid !== undefined) {
        query = query.eq('is_paid', filters.isPaid);
      }
      
      if (filters?.month) {
        query = query.eq('month', filters.month);
      }
      
      if (filters?.year) {
        query = query.eq('year', filters.year);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((salary: any) => ({
        id: salary.id,
        userId: salary.teacher_id,
        amount: Number(salary.amount),
        month: salary.month,
        year: salary.year,
        isPaid: salary.is_paid || false,
        paidDate: salary.paid_date ? new Date(salary.paid_date) : undefined,
        advanceAmount: salary.advance_amount ? Number(salary.advance_amount) : undefined,
        advanceDate: salary.advance_date ? new Date(salary.advance_date) : undefined,
        teacher: salary.teacher ? {
          id: salary.teacher.id,
          name: salary.teacher.name
        } : undefined,
        bookDetails: salary.salary_book_details?.map((detail: any) => ({
          bookId: detail.book_id,
          bookName: detail.book?.name || 'Unknown Book',
          days: detail.days,
          amount: Number(detail.amount)
        })) || []
      }));
    } catch (error) {
      console.error('Error fetching salaries:', error);
      throw error;
    }
  }
  
  // Create a salary record
  static async createSalary(
    teacherId: string, 
    amount: number, 
    month: string, 
    year: number,
    bookDetails?: { bookId: string; days: number; amount: number; bookName?: string }[]
  ): Promise<Salary> {
    try {
      // Insert salary record
      const { data: salaryData, error: salaryError } = await supabase
        .from('salaries')
        .insert({
          teacher_id: teacherId,
          amount: amount,
          month: month,
          year: year,
          is_paid: false
        })
        .select()
        .single();
        
      if (salaryError) throw salaryError;
      
      // Insert book details if provided
      if (bookDetails && bookDetails.length > 0) {
        const bookDetailsRecords = bookDetails.map(detail => ({
          salary_id: salaryData.id,
          book_id: detail.bookId,
          days: detail.days,
          amount: detail.amount
        }));
        
        const { error: detailsError } = await supabase
          .from('salary_book_details')
          .insert(bookDetailsRecords);
          
        if (detailsError) throw detailsError;
      }
      
      // When returning the data, ensure bookName is included for each book detail
      const processedBookDetails = bookDetails?.map(detail => ({
        bookId: detail.bookId,
        bookName: detail.bookName || 'Unknown Book',
        days: detail.days,
        amount: detail.amount
      })) || [];
      
      return {
        id: salaryData.id,
        userId: salaryData.teacher_id,
        amount: Number(salaryData.amount),
        month: salaryData.month,
        year: salaryData.year,
        isPaid: salaryData.is_paid || false,
        paidDate: salaryData.paid_date ? new Date(salaryData.paid_date) : undefined,
        advanceAmount: salaryData.advance_amount ? Number(salaryData.advance_amount) : undefined,
        advanceDate: salaryData.advance_date ? new Date(salaryData.advance_date) : undefined,
        bookDetails: processedBookDetails
      };
    } catch (error) {
      console.error('Error creating salary record:', error);
      throw error;
    }
  }
  
  // Mark salary as paid
  static async markSalaryAsPaid(id: string, paidDate: Date = new Date()): Promise<void> {
    try {
      const dateStr = paidDate.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('salaries')
        .update({
          is_paid: true,
          paid_date: dateStr
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error marking salary as paid:', error);
      throw error;
    }
  }
  
  // Record salary advance
  static async recordSalaryAdvance(id: string, amount: number, date: Date = new Date()): Promise<void> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('salaries')
        .update({
          advance_amount: amount,
          advance_date: dateStr
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error recording salary advance:', error);
      throw error;
    }
  }
  
  // Delete a salary record
  static async deleteSalary(id: string): Promise<void> {
    try {
      // First delete any book details
      await supabase
        .from('salary_book_details')
        .delete()
        .eq('salary_id', id);
        
      // Then delete the salary record
      const { error } = await supabase
        .from('salaries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting salary record:', error);
      throw error;
    }
  }
}

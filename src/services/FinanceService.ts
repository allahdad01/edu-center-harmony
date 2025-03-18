
import { Invoice, Expense, Salary } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class FinanceService {
  // === INVOICES ===
  
  // Get all invoices
  static async getAllInvoices(filters?: { isPaid?: boolean; dueDate?: Date }): Promise<Invoice[]> {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          student:student_id(id, name),
          book:book_id(id, name)
        `)
        .order('due_date', { ascending: false });
        
      if (filters?.isPaid !== undefined) {
        query = query.eq('is_paid', filters.isPaid);
      }
      
      if (filters?.dueDate) {
        const dateStr = filters.dueDate.toISOString().split('T')[0];
        query = query.lte('due_date', dateStr);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((invoice: any) => ({
        id: invoice.id,
        studentId: invoice.student_id,
        bookId: invoice.book_id,
        amount: Number(invoice.amount),
        isPaid: invoice.is_paid || false,
        dueDate: new Date(invoice.due_date),
        paidDate: invoice.paid_date ? new Date(invoice.paid_date) : undefined,
        student: invoice.student ? {
          id: invoice.student.id,
          name: invoice.student.name
        } : undefined,
        book: invoice.book ? {
          id: invoice.book.id,
          name: invoice.book.name
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }
  
  // Get invoices for a specific student
  static async getStudentInvoices(studentId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          book:book_id(id, name)
        `)
        .eq('student_id', studentId)
        .order('due_date', { ascending: false });
        
      if (error) throw error;
      
      return data.map((invoice: any) => ({
        id: invoice.id,
        studentId: invoice.student_id,
        bookId: invoice.book_id,
        amount: Number(invoice.amount),
        isPaid: invoice.is_paid || false,
        dueDate: new Date(invoice.due_date),
        paidDate: invoice.paid_date ? new Date(invoice.paid_date) : undefined,
        book: invoice.book ? {
          id: invoice.book.id,
          name: invoice.book.name
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching student invoices:', error);
      throw error;
    }
  }
  
  // Create an invoice
  static async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          student_id: invoice.studentId,
          book_id: invoice.bookId,
          amount: invoice.amount,
          is_paid: invoice.isPaid || false,
          due_date: invoice.dueDate?.toISOString().split('T')[0],
          paid_date: invoice.paidDate?.toISOString().split('T')[0]
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        studentId: data.student_id,
        bookId: data.book_id,
        amount: Number(data.amount),
        isPaid: data.is_paid || false,
        dueDate: new Date(data.due_date),
        paidDate: data.paid_date ? new Date(data.paid_date) : undefined
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }
  
  // Update an invoice
  static async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<void> {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          amount: invoice.amount,
          is_paid: invoice.isPaid,
          due_date: invoice.dueDate?.toISOString().split('T')[0],
          paid_date: invoice.paidDate?.toISOString().split('T')[0]
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }
  
  // Mark invoice as paid
  static async markInvoiceAsPaid(id: string, paidDate: Date = new Date()): Promise<void> {
    try {
      const dateStr = paidDate.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('invoices')
        .update({
          is_paid: true,
          paid_date: dateStr
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  }
  
  // Delete an invoice
  static async deleteInvoice(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
  
  // === EXPENSES ===
  
  // Get all expenses
  static async getAllExpenses(filters?: { category?: string; startDate?: Date; endDate?: Date }): Promise<Expense[]> {
    try {
      let query = supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
        
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.startDate) {
        const dateStr = filters.startDate.toISOString().split('T')[0];
        query = query.gte('date', dateStr);
      }
      
      if (filters?.endDate) {
        const dateStr = filters.endDate.toISOString().split('T')[0];
        query = query.lte('date', dateStr);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: Number(expense.amount),
        date: new Date(expense.date),
        category: expense.category
      }));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  }
  
  // Create an expense
  static async createExpense(expense: Partial<Expense>): Promise<Expense> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          description: expense.description,
          amount: expense.amount,
          date: expense.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          category: expense.category
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        description: data.description,
        amount: Number(data.amount),
        date: new Date(data.date),
        category: data.category
      };
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }
  
  // Update an expense
  static async updateExpense(id: string, expense: Partial<Expense>): Promise<void> {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          description: expense.description,
          amount: expense.amount,
          date: expense.date?.toISOString().split('T')[0],
          category: expense.category
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }
  
  // Delete an expense
  static async deleteExpense(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
  
  // === SALARIES ===
  
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
    bookDetails?: { bookId: string; days: number; amount: number }[]
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
        bookDetails: bookDetails || []
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

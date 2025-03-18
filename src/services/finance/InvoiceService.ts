
import { Invoice } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class InvoiceService {
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
}

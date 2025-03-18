
import { Expense } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class ExpenseService {
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
}

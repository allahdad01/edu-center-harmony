import { Teacher, SalaryType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/auth';

export class TeacherService {
  // Fetch all teachers
  static async getAllTeachers(): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
    
    return data.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher',
      isActive: teacher.is_active ?? true,
      createdAt: new Date(teacher.created_at),
      contactNumber: teacher.contact_number || '',
      address: teacher.address || '',
      specialization: teacher.specialization || '',
      salaryType: (teacher.salary_type as SalaryType) || 'fixed',
      salaryAmount: Number(teacher.salary_amount) || 0,
      salaryPercentage: Number(teacher.salary_percentage) || undefined,
      dateOfJoining: teacher.date_of_joining ? new Date(teacher.date_of_joining) : new Date(),
      assignedBooks: []
    }));
  }
  
  // Fetch a single teacher by ID with assigned books
  static async getTeacherById(id: string): Promise<Teacher> {
    // Get basic teacher data
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (teacherError) {
      console.error('Error fetching teacher:', teacherError);
      throw teacherError;
    }
    
    // Get assigned books
    const { data: teacherBooks, error: booksError } = await supabase
      .from('teacher_books')
      .select(`
        book:books (
          id, 
          name, 
          department_id, 
          start_date, 
          end_date, 
          fee, 
          periods, 
          is_active
        )
      `)
      .eq('teacher_id', id);
      
    if (booksError) {
      console.error('Error fetching teacher books:', booksError);
      throw booksError;
    }
    
    // Map books to our app's type
    const assignedBooks = teacherBooks
      .filter(item => item.book)
      .map(item => ({
        id: item.book.id,
        name: item.book.name,
        department: item.book.department_id,
        startDate: new Date(item.book.start_date),
        endDate: item.book.end_date ? new Date(item.book.end_date) : undefined,
        fee: Number(item.book.fee),
        periods: item.book.periods,
        isActive: item.book.is_active ?? true,
        teacherIds: [],
        students: []
      }));
    
    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher',
      isActive: teacher.is_active ?? true,
      createdAt: new Date(teacher.created_at),
      contactNumber: teacher.contact_number || '',
      address: teacher.address || '',
      specialization: teacher.specialization || '',
      salaryType: (teacher.salary_type as SalaryType) || 'fixed',
      salaryAmount: Number(teacher.salary_amount) || 0,
      salaryPercentage: Number(teacher.salary_percentage) || undefined,
      dateOfJoining: teacher.date_of_joining ? new Date(teacher.date_of_joining) : new Date(),
      assignedBooks
    };
  }
  
  // Create a new teacher
  static async createTeacher(teacherData: Partial<Teacher>, password?: string): Promise<Teacher> {
    try {
      // First create the user account if password is provided
      let userId: string | undefined;
      
      if (teacherData.email && password) {
        const { data: authData, error: authError } = await AuthService.signUp(
          teacherData.email,
          password,
          teacherData.name || 'New Teacher'
        );
        
        if (authError) throw authError;
        
        if (authData?.user) {
          userId = authData.user.id;
          // Assign teacher role
          await AuthService.assignRole(authData.user.id, 'teacher');
        }
      }
      
      // Insert into teachers table
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          name: teacherData.name,
          email: teacherData.email,
          specialization: teacherData.specialization,
          contact_number: teacherData.contactNumber,
          address: teacherData.address,
          is_active: teacherData.isActive,
          date_of_joining: teacherData.dateOfJoining?.toISOString().split('T')[0],
          salary_type: teacherData.salaryType,
          salary_amount: teacherData.salaryAmount,
          salary_percentage: teacherData.salaryPercentage,
          user_id: userId || null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: 'teacher',
        isActive: data.is_active ?? true,
        createdAt: new Date(data.created_at),
        contactNumber: data.contact_number || '',
        address: data.address || '',
        specialization: data.specialization || '',
        salaryType: (data.salary_type as SalaryType) || 'fixed',
        salaryAmount: Number(data.salary_amount) || 0,
        salaryPercentage: Number(data.salary_percentage) || undefined,
        dateOfJoining: data.date_of_joining ? new Date(data.date_of_joining) : new Date(),
        assignedBooks: []
      };
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  }
  
  // Update a teacher
  static async updateTeacher(id: string, teacherData: Partial<Teacher>): Promise<void> {
    const { error } = await supabase
      .from('teachers')
      .update({
        name: teacherData.name,
        email: teacherData.email,
        specialization: teacherData.specialization,
        contact_number: teacherData.contactNumber,
        address: teacherData.address,
        is_active: teacherData.isActive,
        date_of_joining: teacherData.dateOfJoining?.toISOString().split('T')[0],
        salary_type: teacherData.salaryType,
        salary_amount: teacherData.salaryAmount,
        salary_percentage: teacherData.salaryPercentage
      })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  }
  
  // Delete a teacher
  static async deleteTeacher(id: string): Promise<void> {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  }
  
  // Assign a teacher to a book
  static async assignTeacherToBook(teacherId: string, bookId: string): Promise<void> {
    const { error } = await supabase
      .from('teacher_books')
      .insert({
        teacher_id: teacherId,
        book_id: bookId
      });
      
    if (error) {
      console.error('Error assigning teacher to book:', error);
      throw error;
    }
  }
  
  // Remove a teacher from a book
  static async removeTeacherFromBook(teacherId: string, bookId: string): Promise<void> {
    const { error } = await supabase
      .from('teacher_books')
      .delete()
      .eq('teacher_id', teacherId)
      .eq('book_id', bookId);
      
    if (error) {
      console.error('Error removing teacher from book:', error);
      throw error;
    }
  }
}

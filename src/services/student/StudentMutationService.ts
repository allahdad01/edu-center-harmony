
import { Student } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class StudentMutationService {
  // Create a new student
  static async createStudent(student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert({
        name: student.name,
        email: student.email,
        father_name: student.fatherName,
        contact_number: student.contactNumber,
        address: student.address,
        is_active: student.isActive
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating student:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email || '',
      fatherName: data.father_name,
      contactNumber: data.contact_number,
      address: data.address || '',
      role: 'student',
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      enrolledBooks: [],
      waitlistedBooks: [],
      attendance: [],
      marks: [],
      invoices: []
    };
  }
  
  // Update a student
  static async updateStudent(id: string, student: Partial<Student>): Promise<void> {
    const { error } = await supabase
      .from('students')
      .update({
        name: student.name,
        email: student.email,
        father_name: student.fatherName,
        contact_number: student.contactNumber,
        address: student.address,
        is_active: student.isActive
      })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }
  
  // Delete a student
  static async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
  
  // Enroll a student in a book
  static async enrollStudentInBook(studentId: string, bookId: string, isWaitlisted: boolean = false): Promise<void> {
    const { error } = await supabase
      .from('student_books')
      .insert({
        student_id: studentId,
        book_id: bookId,
        is_waitlisted: isWaitlisted
      });
      
    if (error) {
      console.error('Error enrolling student in book:', error);
      throw error;
    }
  }
  
  // Remove a student from a book
  static async removeStudentFromBook(studentId: string, bookId: string): Promise<void> {
    const { error } = await supabase
      .from('student_books')
      .delete()
      .eq('student_id', studentId)
      .eq('book_id', bookId);
      
    if (error) {
      console.error('Error removing student from book:', error);
      throw error;
    }
  }
}

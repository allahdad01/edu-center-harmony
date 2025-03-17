
import { supabase } from '@/integrations/supabase/client';
import { Student, Book } from '@/types';

export const StudentService = {
  // Fetch all students
  async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    
    return data.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email || '',
      fatherName: student.father_name,
      contactNumber: student.contact_number,
      address: student.address || '',
      role: 'student',
      isActive: student.is_active,
      createdAt: new Date(student.created_at),
      enrolledBooks: [],
      waitlistedBooks: [],
      attendance: [],
      marks: [],
      invoices: []
    }));
  },
  
  // Fetch a single student by ID with enrolled books
  async getStudentById(id: string): Promise<Student> {
    // Get basic student data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
      
    if (studentError) {
      console.error('Error fetching student:', studentError);
      throw studentError;
    }
    
    // Get enrolled books
    const { data: studentBooks, error: booksError } = await supabase
      .from('student_books')
      .select(`
        id,
        is_waitlisted,
        enrollment_date,
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
      .eq('student_id', id);
      
    if (booksError) {
      console.error('Error fetching student books:', booksError);
      throw booksError;
    }
    
    const enrolledBooks: Book[] = [];
    const waitlistedBooks: Book[] = [];
    
    studentBooks.forEach(item => {
      if (!item.book) return;
      
      const book: Book = {
        id: item.book.id,
        name: item.book.name,
        department: item.book.department_id, // We'll need to fetch department name separately
        startDate: new Date(item.book.start_date),
        endDate: item.book.end_date ? new Date(item.book.end_date) : undefined,
        fee: Number(item.book.fee),
        periods: item.book.periods,
        isActive: item.book.is_active,
        teacherIds: [],
        students: []
      };
      
      if (item.is_waitlisted) {
        waitlistedBooks.push(book);
      } else {
        enrolledBooks.push(book);
      }
    });
    
    // Get attendance records
    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      .select(`
        id,
        date,
        is_present,
        period_number,
        book_id,
        teacher_id
      `)
      .eq('student_id', id);
      
    if (attendanceError) {
      console.error('Error fetching attendance:', attendanceError);
      throw attendanceError;
    }
    
    // Get exam marks
    const { data: marks, error: marksError } = await supabase
      .from('exam_marks')
      .select(`
        id,
        marks,
        date,
        book_id,
        exam_type:exam_types (
          id,
          name,
          max_marks
        )
      `)
      .eq('student_id', id);
      
    if (marksError) {
      console.error('Error fetching marks:', marksError);
      throw marksError;
    }
    
    // Get invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        id,
        amount,
        is_paid,
        due_date,
        paid_date,
        created_at,
        book_id
      `)
      .eq('student_id', id);
      
    if (invoicesError) {
      console.error('Error fetching invoices:', invoicesError);
      throw invoicesError;
    }
    
    return {
      id: student.id,
      name: student.name,
      email: student.email || '',
      fatherName: student.father_name,
      contactNumber: student.contact_number,
      address: student.address || '',
      role: 'student',
      isActive: student.is_active,
      createdAt: new Date(student.created_at),
      enrolledBooks,
      waitlistedBooks,
      attendance: attendance || [],
      marks: marks || [],
      invoices: invoices || []
    };
  },
  
  // Create a new student
  async createStudent(student: Partial<Student>): Promise<Student> {
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
  },
  
  // Update a student
  async updateStudent(id: string, student: Partial<Student>): Promise<void> {
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
  },
  
  // Delete a student
  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
  
  // Enroll a student in a book
  async enrollStudentInBook(studentId: string, bookId: string, isWaitlisted: boolean = false): Promise<void> {
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
  },
  
  // Remove a student from a book
  async removeStudentFromBook(studentId: string, bookId: string): Promise<void> {
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
};

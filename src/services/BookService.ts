
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types';

export const BookService = {
  // Fetch all books
  async getAllBooks(): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        department:departments(name),
        teachers:teacher_books(teacher_id),
        students:student_books(student_id)
      `)
      .order('name');
      
    if (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
    
    return data.map(book => ({
      id: book.id,
      name: book.name,
      department: book.department?.name || book.department_id,
      startDate: new Date(book.start_date),
      endDate: book.end_date ? new Date(book.end_date) : undefined,
      fee: Number(book.fee),
      periods: book.periods,
      isActive: book.is_active,
      teacherIds: book.teachers?.map((t: any) => t.teacher_id) || [],
      // Create minimal Student objects with just the required fields
      students: book.students?.map((s: any) => ({
        id: s.student_id,
        name: '',  // Default empty values for required Student properties
        email: '',
        role: 'student' as const,
        fatherName: '',
        contactNumber: '',
        address: '',
        isActive: true,
        createdAt: new Date(),
        enrolledBooks: [],
        waitlistedBooks: [],
        attendance: [],
        marks: [],
        invoices: []
      })) || []
    }));
  },
  
  // Fetch a single book by ID
  async getBookById(id: string): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        department:departments(name),
        teachers:teacher_books(teacher_id),
        students:student_books(
          student_id,
          is_waitlisted,
          student:students(*)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      department: data.department?.name || data.department_id,
      startDate: new Date(data.start_date),
      endDate: data.end_date ? new Date(data.end_date) : undefined,
      fee: Number(data.fee),
      periods: data.periods,
      isActive: data.is_active,
      teacherIds: data.teachers?.map((t: any) => t.teacher_id) || [],
      students: data.students?.map((s: any) => ({
        id: s.student_id,
        name: s.student?.name || '',
        email: s.student?.email || '',
        role: 'student' as const,
        fatherName: s.student?.father_name || '',
        contactNumber: s.student?.contact_number || '',
        address: s.student?.address || '',
        isActive: true,
        createdAt: new Date(),
        enrolledBooks: [],
        waitlistedBooks: [],
        attendance: [],
        marks: [],
        invoices: []
      })) || []
    };
  },
  
  // Create a new book
  async createBook(book: Partial<Book>): Promise<Book> {
    // First get department ID from department name
    let departmentId = book.department;
    
    if (typeof book.department === 'string') {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('id')
        .eq('name', book.department)
        .single();
        
      if (deptError) {
        console.error('Error fetching department:', deptError);
        throw deptError;
      }
      
      departmentId = deptData.id;
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
      const teacherAssignments = book.teacherIds.map(teacherId => ({
        book_id: data.id,
        teacher_id: teacherId
      }));
      
      const { error: teacherError } = await supabase
        .from('teacher_books')
        .insert(teacherAssignments);
        
      if (teacherError) {
        console.error('Error assigning teachers:', teacherError);
        // Don't throw, as the book was created successfully
      }
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
      students: []
    };
  },
  
  // Update a book
  async updateBook(id: string, book: Partial<Book>): Promise<void> {
    // First get department ID from department name if it's a string
    let departmentId = book.department;
    
    if (typeof book.department === 'string') {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('id')
        .eq('name', book.department)
        .single();
        
      if (deptError) {
        console.error('Error fetching department:', deptError);
        throw deptError;
      }
      
      departmentId = deptData.id;
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
      // First delete all existing assignments
      const { error: deleteError } = await supabase
        .from('teacher_books')
        .delete()
        .eq('book_id', id);
        
      if (deleteError) {
        console.error('Error removing teacher assignments:', deleteError);
        // Continue anyway
      }
      
      // Now add new assignments if there are any
      if (book.teacherIds.length > 0) {
        const teacherAssignments = book.teacherIds.map(teacherId => ({
          book_id: id,
          teacher_id: teacherId
        }));
        
        const { error: teacherError } = await supabase
          .from('teacher_books')
          .insert(teacherAssignments);
          
        if (teacherError) {
          console.error('Error assigning teachers:', teacherError);
          // Don't throw, as the book was updated successfully
        }
      }
    }
  },
  
  // Delete a book
  async deleteBook(id: string): Promise<void> {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },
  
  // Get all departments
  async getAllDepartments(): Promise<{ id: string; name: string }[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name')
      .order('name');
      
    if (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
    
    return data;
  }
};


import { Book, Student, Teacher } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class BookService {
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

      return books.map(book => ({
        id: book.id,
        name: book.name,
        department: book.departments?.name || '',
        startDate: new Date(book.start_date),
        endDate: book.end_date ? new Date(book.end_date) : new Date(),
        fee: Number(book.fee),
        periods: book.periods,
        isActive: book.is_active || false,
        teacherIds: book.teacher_books?.map((tb: any) => tb.teacher_id) || [],
        teachers: book.teacher_books?.map((tb: any) => ({
          id: tb.teacher?.id,
          name: tb.teacher?.name,
          email: tb.teacher?.email,
          isActive: tb.teacher?.is_active,
          role: 'teacher' as const,
          specialization: tb.teacher?.specialization,
          contactNumber: tb.teacher?.contact_number || '',
          address: tb.teacher?.address || '',
          assignedBooks: [],
          salaryType: (tb.teacher?.salary_type as SalaryType) || 'fixed',
          salaryAmount: tb.teacher?.salary_amount || 0,
          salaryPercentage: tb.teacher?.salary_percentage,
          dateOfJoining: tb.teacher?.date_of_joining ? new Date(tb.teacher.date_of_joining) : new Date(),
          createdAt: tb.teacher?.created_at ? new Date(tb.teacher.created_at) : new Date()
        })) || [],
        students: book.student_books?.map((sb: any) => ({
          id: sb.student?.id,
          name: sb.student?.name,
          email: sb.student?.email || '',
          contactNumber: sb.student?.contact_number || '',
          address: sb.student?.address || '',
          role: 'student' as const,
          isActive: sb.student?.is_active || false,
          fatherName: sb.student?.father_name || '',
          isWaitlisted: sb.is_waitlisted || false,
          enrollmentDate: sb.enrollment_date ? new Date(sb.enrollment_date) : new Date(),
          createdAt: sb.student?.created_at ? new Date(sb.student.created_at) : new Date(),
          enrolledBooks: [],
          waitlistedBooks: [],
          attendance: [],
          marks: [],
          invoices: []
        })) || []
      }));
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

      const teachers: Teacher[] = book.teacher_books?.map((tb: any) => ({
        id: tb.teacher?.id,
        name: tb.teacher?.name,
        email: tb.teacher?.email || '',
        isActive: tb.teacher?.is_active || false,
        role: 'teacher' as const,
        specialization: tb.teacher?.specialization || '',
        contactNumber: tb.teacher?.contact_number || '',
        address: tb.teacher?.address || '',
        assignedBooks: [],
        salaryType: (tb.teacher?.salary_type as SalaryType) || 'fixed',
        salaryAmount: tb.teacher?.salary_amount || 0,
        salaryPercentage: tb.teacher?.salary_percentage,
        dateOfJoining: tb.teacher?.date_of_joining ? new Date(tb.teacher.date_of_joining) : new Date(),
        createdAt: tb.teacher?.created_at ? new Date(tb.teacher.created_at) : new Date()
      })) || [];

      const students: Student[] = book.student_books?.map((sb: any) => ({
        id: sb.student?.id,
        name: sb.student?.name,
        email: sb.student?.email || '',
        contactNumber: sb.student?.contact_number || '',
        address: sb.student?.address || '',
        role: 'student' as const,
        isActive: sb.student?.is_active || false,
        fatherName: sb.student?.father_name || '',
        createdAt: sb.student?.created_at ? new Date(sb.student.created_at) : new Date(),
        isWaitlisted: sb.is_waitlisted || false,
        enrollmentDate: sb.enrollment_date ? new Date(sb.enrollment_date) : new Date(),
        enrolledBooks: [],
        waitlistedBooks: [],
        attendance: [],
        marks: [],
        invoices: []
      })) || [];

      return {
        id: book.id,
        name: book.name,
        department: book.departments?.name || '',
        startDate: new Date(book.start_date),
        endDate: book.end_date ? new Date(book.end_date) : new Date(),
        fee: Number(book.fee),
        periods: book.periods,
        isActive: book.is_active || false,
        teacherIds: book.teacher_books?.map((tb: any) => tb.teacher_id) || [],
        teachers,
        students
      };
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  static async createBook(book: Partial<Book>): Promise<Book> {
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
  }

  static async updateBook(id: string, book: Partial<Book>): Promise<void> {
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

  static async getAllDepartments(): Promise<{ id: string; name: string }[]> {
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
}

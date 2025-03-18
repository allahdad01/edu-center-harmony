
import { Student, Attendance, ExamMark, Invoice } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class StudentQueryService {
  // Fetch all students
  static async getAllStudents(): Promise<Student[]> {
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
  }
  
  // Fetch a single student by ID with enrolled books
  static async getStudentById(id: string): Promise<Student> {
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
    
    const enrolledBooks = [];
    const waitlistedBooks = [];
    
    studentBooks.forEach(item => {
      if (!item.book) return;
      
      const book = {
        id: item.book.id,
        name: item.book.name,
        department: item.book.department_id,
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
    
    // Get attendance, marks and invoices
    const attendance = await this.getStudentAttendance(id);
    const marks = await this.getStudentExams(id);
    const invoices = await this.getStudentInvoices(id);
    
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
      attendance,
      marks,
      invoices
    };
  }

  // Get student attendance
  static async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          book:book_id(*),
          teacher:teacher_id(*)
        `)
        .eq('student_id', studentId);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        bookId: item.book_id,
        studentId: item.student_id,
        date: new Date(item.date),
        isPresent: item.is_present,
        periodNumber: item.period_number,
        teacherId: item.teacher_id,
        book: item.book ? {
          id: item.book.id,
          name: item.book.name,
        } : undefined,
        teacher: item.teacher ? {
          id: item.teacher.id,
          name: item.teacher.name,
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      throw error;
    }
  }

  // Get student exams
  static async getStudentExams(studentId: string): Promise<ExamMark[]> {
    try {
      const { data, error } = await supabase
        .from('exam_marks')
        .select(`
          *,
          book:book_id(*),
          exam_type:exam_type_id(*)
        `)
        .eq('student_id', studentId);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        bookId: item.book_id,
        studentId: item.student_id,
        examTypeId: item.exam_type_id,
        marks: Number(item.marks),
        date: new Date(item.date),
        book: item.book ? {
          id: item.book.id,
          name: item.book.name,
        } : undefined,
        examType: item.exam_type ? {
          id: item.exam_type.id,
          name: item.exam_type.name,
          maxMarks: item.exam_type.max_marks,
          weightage: item.exam_type.weightage,
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching student exams:', error);
      throw error;
    }
  }

  // Get student invoices
  static async getStudentInvoices(studentId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          book:book_id(*)
        `)
        .eq('student_id', studentId);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        studentId: item.student_id,
        bookId: item.book_id,
        amount: Number(item.amount),
        isPaid: item.is_paid,
        dueDate: new Date(item.due_date),
        paidDate: item.paid_date ? new Date(item.paid_date) : undefined,
        book: item.book ? {
          id: item.book.id,
          name: item.book.name,
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching student invoices:', error);
      throw error;
    }
  }
}

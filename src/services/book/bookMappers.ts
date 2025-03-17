
import { Book, Student, Teacher, SalaryType } from '@/types';

export function mapBookFromDatabase(book: any): Book {
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
}

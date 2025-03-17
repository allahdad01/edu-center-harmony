export type UserRole = 'student' | 'teacher' | 'finance' | 'controller' | 'admin' | 'superadmin';

export type SalaryType = 'fixed' | 'per-book' | 'percentage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  contactNumber: string;
  address: string;
}

export interface Student extends User {
  role: 'student';
  fatherName: string;
  enrolledBooks: Book[];
  waitlistedBooks: Book[];
  attendance: Attendance[];
  marks: ExamMark[];
  invoices: Invoice[];
}

export interface Teacher extends User {
  role: 'teacher';
  specialization: string;
  assignedBooks: Book[];
  salaryType: SalaryType;
  salaryAmount: number;
  salaryPercentage?: number;
  dateOfJoining: Date;
}

export interface Book {
  id: string;
  name: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  fee: number;
  periods: number;
  isActive: boolean;
  teacherIds: string[];
  teachers?: Teacher[];
  nextBookId?: string;
  students: Student[];
}

export interface Attendance {
  id: string;
  bookId: string;
  studentId: string;
  date: Date;
  isPresent: boolean;
  periodNumber: number;
  teacherId: string;
}

export interface ExamType {
  id: string;
  name: string;
  maxMarks: number;
  weightage: number;
}

export interface ExamMark {
  id: string;
  bookId: string;
  studentId: string;
  examTypeId: string;
  marks: number;
  date: Date;
}

export interface Invoice {
  id: string;
  studentId: string;
  bookId: string;
  amount: number;
  isPaid: boolean;
  dueDate: Date;
  paidDate?: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
}

export interface Salary {
  id: string;
  userId: string;
  amount: number;
  month: string;
  year: number;
  isPaid: boolean;
  paidDate?: Date;
  advanceAmount?: number;
  advanceDate?: Date;
  bookDetails?: {
    bookId: string;
    bookName: string;
    days: number;
    amount: number;
  }[];
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  adminId: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalBooks: number;
  activeBooks: number;
  totalIncome: number;
  totalExpenses: number;
  unpaidInvoices: number;
}

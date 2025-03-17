
import { Database } from '@/integrations/supabase/types';

// Define custom type helpers based on the generated Supabase types
// without modifying the original types file

// These types can be used to extend the existing Supabase types
// with application-specific type information

export type Tables = Database['public']['Tables'];

// Table row types
export type BookRow = Tables['books']['Row'];
export type StudentRow = Tables['students']['Row'];
export type TeacherRow = Tables['teachers']['Row'];
export type DepartmentRow = Tables['departments']['Row'];
export type AttendanceRow = Tables['attendance']['Row'];
export type ExamMarkRow = Tables['exam_marks']['Row'];
export type ExamTypeRow = Tables['exam_types']['Row'];
export type InvoiceRow = Tables['invoices']['Row'];
export type ExpenseRow = Tables['expenses']['Row'];
export type SalaryRow = Tables['salaries']['Row'];

// Define app roles from the Supabase enum
export type AppRole = 'student' | 'teacher' | 'finance' | 'controller' | 'admin' | 'superadmin';

// Common insert and update types
export type BookInsert = Tables['books']['Insert'];
export type BookUpdate = Tables['books']['Update'];
export type StudentInsert = Tables['students']['Insert'];
export type StudentUpdate = Tables['students']['Update'];
export type TeacherInsert = Tables['teachers']['Insert'];
export type TeacherUpdate = Tables['teachers']['Update'];

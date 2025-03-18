
import { Attendance } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class AttendanceService {
  // Get attendance for a specific book
  static async getBookAttendance(bookId: string, date?: Date): Promise<Attendance[]> {
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          student:student_id(id, name),
          teacher:teacher_id(id, name)
        `)
        .eq('book_id', bookId);
        
      if (date) {
        const dateStr = date.toISOString().split('T')[0];
        query = query.eq('date', dateStr);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        id: item.id,
        bookId: item.book_id,
        studentId: item.student_id,
        date: new Date(item.date),
        isPresent: item.is_present,
        periodNumber: item.period_number,
        teacherId: item.teacher_id,
        student: item.student ? {
          id: item.student.id,
          name: item.student.name
        } : undefined,
        teacher: item.teacher ? {
          id: item.teacher.id,
          name: item.teacher.name
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching book attendance:', error);
      throw error;
    }
  }
  
  // Mark student attendance
  static async markAttendance(
    bookId: string, 
    studentId: string, 
    date: Date, 
    isPresent: boolean, 
    periodNumber: number, 
    teacherId: string
  ): Promise<Attendance> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if attendance record already exists
      const { data: existingRecord } = await supabase
        .from('attendance')
        .select('*')
        .eq('book_id', bookId)
        .eq('student_id', studentId)
        .eq('date', dateStr)
        .eq('period_number', periodNumber)
        .maybeSingle();
        
      let result;
      
      if (existingRecord) {
        // Update existing record
        const { data, error } = await supabase
          .from('attendance')
          .update({
            is_present: isPresent,
            teacher_id: teacherId
          })
          .eq('id', existingRecord.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('attendance')
          .insert({
            book_id: bookId,
            student_id: studentId,
            date: dateStr,
            is_present: isPresent,
            period_number: periodNumber,
            teacher_id: teacherId
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return {
        id: result.id,
        bookId: result.book_id,
        studentId: result.student_id,
        date: new Date(result.date),
        isPresent: result.is_present,
        periodNumber: result.period_number,
        teacherId: result.teacher_id
      };
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }
  
  // Mark attendance for multiple students
  static async markBulkAttendance(
    bookId: string,
    date: Date,
    attendanceRecords: {
      studentId: string;
      isPresent: boolean;
      periodNumber: number;
    }[],
    teacherId: string
  ): Promise<void> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      const records = attendanceRecords.map(record => ({
        book_id: bookId,
        student_id: record.studentId,
        date: dateStr,
        is_present: record.isPresent,
        period_number: record.periodNumber,
        teacher_id: teacherId
      }));
      
      // Using upsert to handle both new and existing records
      const { error } = await supabase
        .from('attendance')
        .upsert(records, { 
          onConflict: 'book_id,student_id,date,period_number',
          ignoreDuplicates: false 
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error marking bulk attendance:', error);
      throw error;
    }
  }
  
  // Delete attendance record
  static async deleteAttendance(attendanceId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', attendanceId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  }
}

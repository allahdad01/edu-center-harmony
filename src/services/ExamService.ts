
import { ExamMark, ExamType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class ExamService {
  // Get all exam types
  static async getAllExamTypes(): Promise<ExamType[]> {
    try {
      const { data, error } = await supabase
        .from('exam_types')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return data.map(examType => ({
        id: examType.id,
        name: examType.name,
        maxMarks: examType.max_marks,
        weightage: examType.weightage
      }));
    } catch (error) {
      console.error('Error fetching exam types:', error);
      throw error;
    }
  }
  
  // Create an exam type
  static async createExamType(examType: Partial<ExamType>): Promise<ExamType> {
    try {
      const { data, error } = await supabase
        .from('exam_types')
        .insert({
          name: examType.name,
          max_marks: examType.maxMarks,
          weightage: examType.weightage
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        maxMarks: data.max_marks,
        weightage: data.weightage
      };
    } catch (error) {
      console.error('Error creating exam type:', error);
      throw error;
    }
  }
  
  // Update an exam type
  static async updateExamType(id: string, examType: Partial<ExamType>): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_types')
        .update({
          name: examType.name,
          max_marks: examType.maxMarks,
          weightage: examType.weightage
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating exam type:', error);
      throw error;
    }
  }
  
  // Delete an exam type
  static async deleteExamType(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_types')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting exam type:', error);
      throw error;
    }
  }
  
  // Get exam marks for a book
  static async getBookExamMarks(bookId: string, examTypeId?: string): Promise<ExamMark[]> {
    try {
      let query = supabase
        .from('exam_marks')
        .select(`
          *,
          student:student_id(id, name),
          exam_type:exam_type_id(*)
        `)
        .eq('book_id', bookId);
        
      if (examTypeId) {
        query = query.eq('exam_type_id', examTypeId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        id: item.id,
        bookId: item.book_id,
        studentId: item.student_id,
        examTypeId: item.exam_type_id,
        marks: Number(item.marks),
        date: new Date(item.date),
        student: item.student ? {
          id: item.student.id,
          name: item.student.name
        } : undefined,
        examType: item.exam_type ? {
          id: item.exam_type.id,
          name: item.exam_type.name,
          maxMarks: item.exam_type.max_marks,
          weightage: item.exam_type.weightage
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching book exam marks:', error);
      throw error;
    }
  }
  
  // Record exam marks
  static async recordExamMark(examMark: Partial<ExamMark>): Promise<ExamMark> {
    try {
      // Check if mark already exists
      const { data: existingMark } = await supabase
        .from('exam_marks')
        .select('*')
        .eq('book_id', examMark.bookId)
        .eq('student_id', examMark.studentId)
        .eq('exam_type_id', examMark.examTypeId)
        .maybeSingle();
        
      let result;
      
      if (existingMark) {
        // Update existing mark
        const { data, error } = await supabase
          .from('exam_marks')
          .update({
            marks: examMark.marks,
            date: examMark.date?.toISOString().split('T')[0]
          })
          .eq('id', existingMark.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new mark record
        const { data, error } = await supabase
          .from('exam_marks')
          .insert({
            book_id: examMark.bookId,
            student_id: examMark.studentId,
            exam_type_id: examMark.examTypeId,
            marks: examMark.marks,
            date: examMark.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
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
        examTypeId: result.exam_type_id,
        marks: Number(result.marks),
        date: new Date(result.date)
      };
    } catch (error) {
      console.error('Error recording exam mark:', error);
      throw error;
    }
  }
  
  // Record exam marks for multiple students
  static async recordBulkExamMarks(
    bookId: string,
    examTypeId: string,
    date: Date,
    marks: { studentId: string; marks: number }[]
  ): Promise<void> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      const records = marks.map(mark => ({
        book_id: bookId,
        student_id: mark.studentId,
        exam_type_id: examTypeId,
        marks: mark.marks,
        date: dateStr
      }));
      
      // Using upsert to handle both new and existing records
      const { error } = await supabase
        .from('exam_marks')
        .upsert(records, { 
          onConflict: 'book_id,student_id,exam_type_id',
          ignoreDuplicates: false 
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error recording bulk exam marks:', error);
      throw error;
    }
  }
  
  // Delete an exam mark
  static async deleteExamMark(examMarkId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_marks')
        .delete()
        .eq('id', examMarkId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting exam mark:', error);
      throw error;
    }
  }
}

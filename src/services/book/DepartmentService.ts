
import { supabase } from '@/integrations/supabase/client';

export class DepartmentService {
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

  static async getDepartmentIdByName(departmentName: string): Promise<string> {
    const { data, error } = await supabase
      .from('departments')
      .select('id')
      .eq('name', departmentName)
      .single();
      
    if (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
    
    return data.id;
  }
}

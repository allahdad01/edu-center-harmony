
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

export class AuthRoleService {
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_roles', { user_id: userId });
        
      if (error) throw error;
      return data as UserRole[];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }
  
  static async assignRole(userId: string, role: UserRole): Promise<void> {
    try {
      // Check if user already has this role
      const { data: existingRoles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', role);
        
      if (existingRoles && existingRoles.length > 0) {
        return; // Role already assigned
      }
      
      // Add the new role
      await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role
        });
    } catch (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  }
  
  static async removeRole(userId: string, role: UserRole): Promise<void> {
    try {
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
    } catch (error) {
      console.error('Error removing role:', error);
      throw error;
    }
  }
}

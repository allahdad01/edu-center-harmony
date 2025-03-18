
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { AuthService } from './AuthService';

export class ProfileService {
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      // Get user roles
      const roles = await AuthService.getUserRoles(userId);
      
      if (!roles || roles.length === 0) {
        console.error('No roles found for user');
        return null;
      }
      
      // Determine which table to query based on role
      const isTeacher = roles.includes('teacher');
      const isStudent = roles.includes('student');
      
      let userData = null;
      
      if (isTeacher) {
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        userData = data;
        
        if (userData) {
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: 'teacher',
            isActive: userData.is_active !== false,
            createdAt: new Date(userData.created_at),
            contactNumber: userData.contact_number || '',
            address: userData.address || '',
          };
        }
      } else if (isStudent) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        userData = data;
        
        if (userData) {
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email || '',
            role: 'student',
            isActive: userData.is_active !== false,
            createdAt: new Date(userData.created_at),
            contactNumber: userData.contact_number || '',
            address: userData.address || '',
          };
        }
      }
      
      // If we don't have profile data from teacher or student table
      // Provide a basic user object with role information
      return {
        id: userId,
        name: 'Unknown User',
        email: '',
        role: roles[0] || 'student',
        isActive: true,
        createdAt: new Date(),
        contactNumber: '',
        address: '',
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}

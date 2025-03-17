
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

export class AuthService {
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
  
  static async checkSession() {
    return await supabase.auth.getSession();
  }
  
  static async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  }
  
  static async signUp(email: string, password: string, name: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
  }
  
  static async signOut() {
    return await supabase.auth.signOut();
  }

  // Function to map Supabase user to our app's User type
  static async mapSupabaseUser(supabaseUser: SupabaseUser): Promise<User> {
    try {
      // Get user roles
      const roles = await this.getUserRoles(supabaseUser.id);
      
      // Fetch teacher or student data depending on role
      const isTeacher = roles.includes('teacher');
      const isStudent = roles.includes('student');
      
      let userData = null;
      
      if (isTeacher) {
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .maybeSingle();
          
        if (error) throw error;
        userData = data;
      } else if (isStudent) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .maybeSingle();
          
        if (error) throw error;
        userData = data;
      }
      
      // If we don't have user data, create a minimal user object
      if (!userData) {
        return {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || 'Unknown User',
          email: supabaseUser.email || '',
          role: roles[0] || 'student',
          isActive: true,
          createdAt: new Date(),
          contactNumber: '',
          address: '',
        };
      }
      
      return {
        id: userData?.id || supabaseUser.id,
        name: userData?.name || supabaseUser.user_metadata?.name || 'Unknown User',
        email: userData?.email || supabaseUser.email || '',
        role: roles[0] || 'student',
        isActive: userData?.is_active !== false,
        createdAt: userData?.created_at ? new Date(userData.created_at) : new Date(),
        contactNumber: userData?.contact_number || '',
        address: userData?.address || '',
      };
    } catch (error) {
      console.error('Error mapping user:', error);
      // Return a minimal user object on error
      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || 'Unknown User',
        email: supabaseUser.email || '',
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        contactNumber: '',
        address: '',
      };
    }
  }
  
  // Add methods for user profile operations
  static async updateUserProfile(userId: string, profileData: Partial<User>): Promise<void> {
    try {
      const { data: roles } = await supabase
        .rpc('get_user_roles', { user_id: userId });
        
      if (!roles || roles.length === 0) {
        throw new Error('User has no role assigned');
      }
      
      const isTeacher = roles.includes('teacher');
      const isStudent = roles.includes('student');
      
      if (isTeacher) {
        await supabase
          .from('teachers')
          .update({
            name: profileData.name,
            email: profileData.email,
            contact_number: profileData.contactNumber,
            address: profileData.address,
            is_active: profileData.isActive
          })
          .eq('user_id', userId);
      } else if (isStudent) {
        await supabase
          .from('students')
          .update({
            name: profileData.name,
            email: profileData.email,
            contact_number: profileData.contactNumber,
            address: profileData.address,
            is_active: profileData.isActive
          })
          .eq('user_id', userId);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
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

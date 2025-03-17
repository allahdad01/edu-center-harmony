
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

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
}

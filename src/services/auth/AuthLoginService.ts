
import { supabase } from '@/integrations/supabase/client';

export class AuthLoginService {
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

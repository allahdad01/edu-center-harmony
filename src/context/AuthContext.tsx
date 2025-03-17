
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to map Supabase user to our app's User type
  const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    try {
      // Get user roles
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_roles', { user_id: supabaseUser.id });
      
      if (roleError) throw roleError;
      
      // Fetch teacher or student data depending on role
      const roles = roleData as UserRole[];
      const isTeacher = roles.includes('teacher');
      const isStudent = roles.includes('student');
      
      let userData = null;
      
      if (isTeacher) {
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();
          
        if (error) throw error;
        userData = data;
      } else if (isStudent) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();
          
        if (error) throw error;
        userData = data;
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
      throw error;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const mappedUser = await mapSupabaseUser(session.user);
          setUser(mappedUser);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Session error. Please login again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Setup listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const mappedUser = await mapSupabaseUser(session.user);
            setUser(mappedUser);
          } catch (error) {
            console.error('Error setting user:', error);
            setError('Could not retrieve user data.');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data?.user) {
        const mappedUser = await mapSupabaseUser(data.user);
        setUser(mappedUser);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Logout failed',
        description: 'There was a problem logging out',
        variant: 'destructive'
      });
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';
import { AuthService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await AuthService.checkSession();
        
        if (session?.user) {
          try {
            const mappedUser = await AuthService.mapSupabaseUser(session.user);
            setUser(mappedUser);
          } catch (err) {
            console.error('Error mapping user:', err);
            setError('Session error. Please login again.');
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Session error. Please login again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const mappedUser = await AuthService.mapSupabaseUser(session.user);
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
      const { data, error } = await AuthService.signIn(email, password);
      
      if (error) throw error;
      
      if (data?.user) {
        const mappedUser = await AuthService.mapSupabaseUser(data.user);
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
      const { error } = await AuthService.signUp(email, password, name);
      
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
      await AuthService.signOut();
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
  
  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setIsLoading(true);
      await AuthService.updateUserProfile(user.id, profileData);
      
      setUser(prev => prev ? { ...prev, ...profileData } : null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated'
      });
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err.message || 'Failed to update profile',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
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
    updateProfile,
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

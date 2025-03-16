
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

// Mock user data - in a real app, this would be fetched from an API
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    contactNumber: '+1 (555) 123-4567',
    address: '123 Admin Street, Admin City, AC 12345'
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@example.com',
    role: 'teacher',
    isActive: true,
    createdAt: new Date(),
    contactNumber: '+1 (555) 234-5678',
    address: '456 Teacher Avenue, Teacher Town, TT 23456'
  },
  {
    id: '3',
    name: 'Student User',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
    createdAt: new Date(),
    contactNumber: '+1 (555) 345-6789',
    address: '789 Student Road, Student Village, SV 34567'
  },
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would verify the token with your backend
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Session expired. Please login again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call to your backend
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === 'password') { // In a real app, never check passwords this way
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    error,
    login,
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


import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { hasAccess } from '@/utils/rbac';
import { Navigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * A component that protects routes based on user roles
 * Shows the children only if the user has one of the allowed roles
 * Otherwise redirects to the specified path or shows an unauthorized message
 */
export default function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}: RoleProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated but no user data, something is wrong
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if the user has the required role
  const hasRequiredRole = hasAccess(user.role, allowedRoles);
  
  // If the user doesn't have the required role, redirect
  if (!hasRequiredRole) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page",
      variant: "destructive"
    });
    return <Navigate to={redirectTo} />;
  }
  
  // If the user has the required role, render the children
  return <>{children}</>;
}

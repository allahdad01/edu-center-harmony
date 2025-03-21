
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { getPermittedActions, hasAccess, hasPermission } from '@/utils/rbac';
import { useMemo } from 'react';

/**
 * Custom hook for checking user permissions
 * Makes it easy to check if the current user has access to specific features
 */
export function usePermissions() {
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  
  // Memoize permissions to avoid recalculating on every render
  const permissions = useMemo(() => getPermittedActions(userRole), [userRole]);
  
  // Helper to check if user has access to any of the specified roles
  const checkAccess = (roles: UserRole[]) => hasAccess(userRole, roles);
  
  // Helper to check if user's role is at least the specified minimum role
  const checkPermission = (minimumRole: UserRole) => hasPermission(userRole, minimumRole);
  
  return {
    permissions,
    checkAccess,
    checkPermission,
    role: userRole,
    isStudent: userRole === 'student',
    isTeacher: userRole === 'teacher',
    isFinance: userRole === 'finance',
    isController: userRole === 'controller',
    isAdmin: userRole === 'admin',
    isSuperAdmin: userRole === 'superadmin',
    isStaff: ['teacher', 'finance', 'controller', 'admin', 'superadmin'].includes(userRole),
    canManageBranches: userRole === 'superadmin',
    canManageAllAdmins: userRole === 'superadmin',
    canAccessSystemSettings: userRole === 'superadmin',
  };
}

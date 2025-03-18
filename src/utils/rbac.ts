
import { UserRole } from '@/types';

// Role hierarchy - higher roles have more access
const roleHierarchy: Record<UserRole, number> = {
  student: 0,
  teacher: 1,
  finance: 2,
  controller: 3,
  admin: 4,
  superadmin: 5
};

/**
 * Check if a user has permission to access a feature
 * @param userRole The role of the current user
 * @param requiredRole The minimum role required for access
 * @returns boolean indicating if the user has access
 */
export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  // Check if the user's role is in the hierarchy
  if (!(userRole in roleHierarchy)) {
    return false;
  }
  
  // Check if the required role is in the hierarchy
  if (!(requiredRole in roleHierarchy)) {
    return false;
  }
  
  // Compare role levels
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Check if a user can access certain routes/resources
 * @param userRole The role of the current user
 * @param requiredRoles Array of roles that have access
 * @returns boolean indicating if the user has access
 */
export const hasAccess = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.some(role => userRole === role || hasPermission(userRole, role));
};

/**
 * Get permitted actions for a user based on their role
 * This is a flexible function that can be expanded with specific permissions
 */
export const getPermittedActions = (userRole: UserRole): Record<string, boolean> => {
  const permissions: Record<string, boolean> = {
    // Read permissions
    viewStudents: hasPermission(userRole, 'teacher'),
    viewTeachers: hasPermission(userRole, 'admin'),
    viewFinance: hasPermission(userRole, 'finance'),
    viewReports: hasPermission(userRole, 'controller'),
    
    // Write permissions
    manageStudents: hasPermission(userRole, 'teacher'),
    manageTeachers: hasPermission(userRole, 'admin'),
    manageFinance: hasPermission(userRole, 'finance'),
    manageAttendance: hasPermission(userRole, 'teacher'),
    manageBooks: hasPermission(userRole, 'admin'),
    manageRoles: hasPermission(userRole, 'admin'),
    
    // Admin permissions
    manageBranch: hasPermission(userRole, 'superadmin'),
    manageSystem: hasPermission(userRole, 'superadmin')
  };
  
  return permissions;
};

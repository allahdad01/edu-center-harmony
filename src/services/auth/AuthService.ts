
import { AuthLoginService } from './AuthLoginService';
import { AuthUserService } from './AuthUserService';
import { AuthRoleService } from './AuthRoleService';
import { User } from '@/types';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address?: string;
}

// Re-export all functionality from specialized services
export class AuthService {
  // Session and login methods
  static async checkSession() {
    return await AuthLoginService.checkSession();
  }
  
  static async signIn(email: string, password: string) {
    return await AuthLoginService.signIn(email, password);
  }
  
  static async signUp(email: string, password: string, name: string) {
    return await AuthLoginService.signUp(email, password, name);
  }
  
  static async signOut() {
    return await AuthLoginService.signOut();
  }

  // User role methods
  static async getUserRoles(userId: string) {
    return await AuthRoleService.getUserRoles(userId);
  }
  
  static async assignRole(userId: string, role: any) {
    return await AuthRoleService.assignRole(userId, role);
  }
  
  static async removeRole(userId: string, role: any) {
    return await AuthRoleService.removeRole(userId, role);
  }

  // Super admin methods
  static async checkSuperAdminExists() {
    return await AuthUserService.checkSuperAdminExists();
  }
  
  static async createSuperAdmin(userData: CreateUserRequest) {
    return await AuthUserService.createSuperAdmin(userData);
  }

  // Admin methods
  static async createAdmin(userData: CreateUserRequest, branchId: string) {
    return await AuthUserService.createAdmin(userData, branchId);
  }

  // Staff methods
  static async createStaffUser(userData: CreateUserRequest, role: any) {
    return await AuthUserService.createStaffUser(userData, role);
  }

  // Student methods
  static async createStudent(userData: CreateUserRequest, fatherName: string) {
    return await AuthUserService.createStudent(userData, fatherName);
  }

  // User mapping and profile methods
  static async mapSupabaseUser(supabaseUser: any) {
    return await AuthUserService.mapSupabaseUser(supabaseUser);
  }
  
  static async updateUserProfile(userId: string, profileData: Partial<User>) {
    return await AuthUserService.updateUserProfile(userId, profileData);
  }
}

// Re-export the CreateUserRequest interface as a type to avoid conflicts
export type { CreateUserRequest };

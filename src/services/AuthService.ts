
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address?: string;
}

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

  // Check if super admin exists in the system
  static async checkSuperAdminExists(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('has_any_super_admin');
        
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking for super admin:', error);
      return false;
    }
  }

  // Create a super admin (should only be called once during initial setup)
  static async createSuperAdmin(userData: CreateUserRequest): Promise<User> {
    try {
      // Check if super admin already exists
      const superAdminExists = await this.checkSuperAdminExists();
      if (superAdminExists) {
        throw new Error('Super Admin already exists');
      }

      // Create user account
      const { data: authData, error: authError } = await this.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign superadmin role
      await this.assignRole(authData.user.id, 'superadmin');
      
      // Create admin record in database
      const { data: adminData, error: adminError } = await supabase
        .from('teachers')  // Using teachers table for admin records
        .insert({
          name: userData.name,
          email: userData.email,
          contact_number: userData.contactNumber,
          address: userData.address || null,
          user_id: authData.user.id,
          is_active: true,
          specialization: 'System Administration'
        })
        .select()
        .single();
        
      if (adminError) throw adminError;
      
      return this.mapSupabaseUser(authData.user);
    } catch (error) {
      console.error('Error creating super admin:', error);
      throw error;
    }
  }

  // Create a branch admin
  static async createAdmin(userData: CreateUserRequest, branchId: string): Promise<User> {
    try {
      // Create user account
      const { data: authData, error: authError } = await this.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign admin role
      await this.assignRole(authData.user.id, 'admin');
      
      // Create admin record in database
      const { data: adminData, error: adminError } = await supabase
        .from('teachers')  // Using teachers table for admin records
        .insert({
          name: userData.name,
          email: userData.email,
          contact_number: userData.contactNumber,
          address: userData.address || null,
          user_id: authData.user.id,
          is_active: true,
          specialization: 'Branch Administration'
        })
        .select()
        .single();
        
      if (adminError) throw adminError;
      
      // Assign admin to branch
      const { error: branchAssignError } = await supabase
        .from('branch_admins')
        .insert({
          branch_id: branchId,
          admin_id: adminData.id
        });
        
      if (branchAssignError) throw branchAssignError;
      
      return this.mapSupabaseUser(authData.user);
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  // Create a staff user (teacher, finance, controller)
  static async createStaffUser(userData: CreateUserRequest, role: UserRole): Promise<User> {
    try {
      // Validate role
      if (!['teacher', 'finance', 'controller'].includes(role)) {
        throw new Error(`Invalid role for staff user: ${role}`);
      }

      // Create user account
      const { data: authData, error: authError } = await this.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign role
      await this.assignRole(authData.user.id, role);
      
      // Create staff record in database
      const { data: staffData, error: staffError } = await supabase
        .from('teachers')  // Using teachers table for staff records
        .insert({
          name: userData.name,
          email: userData.email,
          contact_number: userData.contactNumber,
          address: userData.address || null,
          user_id: authData.user.id,
          is_active: true,
          specialization: role === 'teacher' ? 'General' : role.charAt(0).toUpperCase() + role.slice(1)
        })
        .select()
        .single();
        
      if (staffError) throw staffError;
      
      return this.mapSupabaseUser(authData.user);
    } catch (error) {
      console.error(`Error creating ${role}:`, error);
      throw error;
    }
  }

  // Create a student user
  static async createStudent(userData: CreateUserRequest, fatherName: string): Promise<User> {
    try {
      // Create user account
      const { data: authData, error: authError } = await this.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign student role
      await this.assignRole(authData.user.id, 'student');
      
      // Create student record in database
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name: userData.name,
          email: userData.email,
          contact_number: userData.contactNumber,
          address: userData.address || null,
          user_id: authData.user.id,
          father_name: fatherName,
          is_active: true
        })
        .select()
        .single();
        
      if (studentError) throw studentError;
      
      return this.mapSupabaseUser(authData.user);
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
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

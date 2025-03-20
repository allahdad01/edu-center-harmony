
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { CreateUserRequest } from './AuthService';
import { AuthRoleService } from './AuthRoleService';
import { AuthLoginService } from './AuthLoginService';

export class AuthUserService {
  // Check if super admin exists in the system
  static async checkSuperAdminExists(): Promise<boolean> {
    try {
      // Call the RPC function directly
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
      const { data: authData, error: authError } = await AuthLoginService.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign superadmin role
      await AuthRoleService.assignRole(authData.user.id, 'superadmin');
      
      console.log('Creating superadmin record in database...');
      
      // Create a superadmin profile directly in the database with additional logging
      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .insert({
          name: userData.name,
          email: userData.email,
          contact_number: userData.contactNumber,
          address: userData.address || null,
          user_id: authData.user.id,
          is_active: true,
          role: 'superadmin'
        })
        .select()
        .single();
        
      if (adminError) {
        console.error('Database error when creating super admin:', adminError);
        throw new Error(`Failed to create administrator record: ${adminError.message}`);
      }
      
      console.log('Superadmin created successfully:', adminData);
      
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
      const { data: authData, error: authError } = await AuthLoginService.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign admin role
      await AuthRoleService.assignRole(authData.user.id, 'admin');
      
      // Create admin profile directly in the database
      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .insert({
          name: userData.name,
          email: userData.email,
          contact_number: userData.contactNumber,
          address: userData.address || null,
          user_id: authData.user.id,
          is_active: true,
          role: 'admin'
        })
        .select()
        .single();
        
      if (adminError) {
        console.error('Database error:', adminError);
        throw new Error(`Failed to create administrator record: ${adminError.message}`);
      }
      
      // Use direct fetch to call the RPC function since it's not in TypeScript definitions
      const { error: branchAssignError } = await supabase.functions.invoke('assign_admin_to_branch', {
        body: {
          admin_id: adminData.id,
          branch_id: branchId
        }
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
      const { data: authData, error: authError } = await AuthLoginService.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign role
      await AuthRoleService.assignRole(authData.user.id, role);
      
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
      const { data: authData, error: authError } = await AuthLoginService.signUp(
        userData.email, 
        userData.password, 
        userData.name
      );
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Assign student role
      await AuthRoleService.assignRole(authData.user.id, 'student');
      
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
      const roles = await AuthRoleService.getUserRoles(supabaseUser.id);
      
      // Fetch teacher or student data depending on role
      const isTeacher = roles.includes('teacher');
      const isStudent = roles.includes('student');
      const isSuperAdmin = roles.includes('superadmin');
      const isAdmin = roles.includes('admin');
      
      let userData = null;
      
      if (isSuperAdmin || isAdmin) {
        console.log('Fetching administrator data for user:', supabaseUser.id);
        const { data, error } = await supabase
          .from('administrators')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching administrator data:', error);
          throw error;
        }
        userData = data;
        console.log('Administrator data fetched:', userData);
      } else if (isTeacher) {
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
        console.log('No role-specific data found for user, creating minimal user object');
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
      
      const isSuperAdmin = roles.includes('superadmin');
      const isAdmin = roles.includes('admin');
      const isTeacher = roles.includes('teacher');
      const isStudent = roles.includes('student');
      
      if (isSuperAdmin || isAdmin) {
        await supabase
          .from('administrators')
          .update({
            name: profileData.name,
            email: profileData.email,
            contact_number: profileData.contactNumber,
            address: profileData.address,
            is_active: profileData.isActive
          })
          .eq('user_id', userId);
      } else if (isTeacher) {
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
}


import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthService, CreateUserRequest } from '@/services/AuthService';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import PageTransition from '@/components/layout/PageTransition';

// Form schema for creating users
const createUserSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  contactNumber: z.string().min(10, { message: 'Please enter a valid contact number' }),
  address: z.string().optional(),
  role: z.enum(['admin', 'teacher', 'finance', 'controller', 'student']),
  fatherName: z.string().optional(),
  branchId: z.string().optional(),
});

// Form schema for creating branches
const createBranchSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters' }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
type CreateBranchFormValues = z.infer<typeof createBranchSchema>;

export default function UserManagement() {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createBranchOpen, setCreateBranchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<{id: string, name: string, location: string}[]>([]);
  const [users, setUsers] = useState<{id: string, name: string, email: string, role: string}[]>([]);
  const { toast } = useToast();
  const { checkPermission } = usePermissions();
  
  const isSuperAdmin = checkPermission('superadmin');
  const isAdmin = checkPermission('admin');
  
  // User creation form
  const userForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      contactNumber: '',
      address: '',
      role: 'teacher',
    },
  });

  // Branch creation form
  const branchForm = useForm<CreateBranchFormValues>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });
  
  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast({
          title: 'Error',
          description: 'Failed to load branches',
          variant: 'destructive',
        });
      }
    };
    
    fetchBranches();
  }, [toast]);
  
  // Create a new user
  const handleCreateUser = async (data: CreateUserFormValues) => {
    setIsSubmitting(true);
    try {
      // Extract data
      const userData: CreateUserRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        contactNumber: data.contactNumber,
        address: data.address,
      };
      
      // Process based on role
      if (data.role === 'admin' && isSuperAdmin && data.branchId) {
        await AuthService.createAdmin(userData, data.branchId);
      } else if (data.role === 'student') {
        await AuthService.createStudent(userData, data.fatherName || 'Unknown');
      } else if (['teacher', 'finance', 'controller'].includes(data.role)) {
        await AuthService.createStaffUser(userData, data.role as UserRole);
      } else {
        throw new Error(`Invalid role or missing required field for ${data.role}`);
      }
      
      toast({
        title: 'Success',
        description: `${data.role.charAt(0).toUpperCase() + data.role.slice(1)} user created successfully`,
      });
      
      userForm.reset();
      setCreateUserOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to create ${data.role}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Create a new branch
  const handleCreateBranch = async (data: CreateBranchFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('branches')
        .insert({
          name: data.name,
          location: data.location,
          is_active: true,
        });
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Branch created successfully',
      });
      
      branchForm.reset();
      setCreateBranchOpen(false);
      
      // Refresh branches list
      const { data: newBranches, error: fetchError } = await supabase
        .from('branches')
        .select('*')
        .order('name');
        
      if (fetchError) throw fetchError;
      setBranches(newBranches);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create branch',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Role conditional fields
  const selectedRole = userForm.watch('role');
  const showFatherName = selectedRole === 'student';
  const showBranchSelect = selectedRole === 'admin' && isSuperAdmin;
  
  return (
    <PageTransition>
      <div className="container p-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2">
            {(isSuperAdmin || isAdmin) && (
              <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button>Create User</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new user in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(handleCreateUser)} className="space-y-4">
                      <FormField
                        control={userForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Role</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isSuperAdmin && (
                                  <SelectItem value="admin">Admin</SelectItem>
                                )}
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="controller">Controller</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="john@example.com" 
                                type="email" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="********" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userForm.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="123 School St, City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Conditional fields based on role */}
                      {showFatherName && (
                        <FormField
                          control={userForm.control}
                          name="fatherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Father's Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Father's name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {showBranchSelect && (
                        <FormField
                          control={userForm.control}
                          name="branchId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assign to Branch</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a branch" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {branches.map(branch => (
                                    <SelectItem key={branch.id} value={branch.id}>
                                      {branch.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            
            {isSuperAdmin && (
              <Dialog open={createBranchOpen} onOpenChange={setCreateBranchOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Create Branch</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Branch</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new school branch.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...branchForm}>
                    <form onSubmit={branchForm.handleSubmit(handleCreateBranch)} className="space-y-4">
                      <FormField
                        control={branchForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Main Campus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={branchForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Education St, City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating...' : 'Create Branch'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            {(isSuperAdmin || isAdmin) && (
              <TabsTrigger value="branches">Branches</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="users">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map(user => (
                <Card key={user.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between">
                      <span>{user.name}</span>
                      <span className="text-sm bg-primary-100 text-primary px-2 py-1 rounded">
                        {user.role}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{user.email}</p>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {users.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No users found. Create a new user to get started.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="branches">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {branches.map(branch => (
                <Card key={branch.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{branch.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{branch.location}</p>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {branches.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No branches found. Create a new branch to get started.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}

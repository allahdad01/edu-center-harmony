
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/ui-custom/Card';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/use-permissions';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';

const branchSchema = z.object({
  name: z.string().min(3, 'Branch name must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface Branch {
  id: string;
  name: string;
  location: string;
  is_active: boolean;
  created_at: string;
}

export default function Branches() {
  const { isSuperAdmin } = usePermissions();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd }, reset: resetAdd } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit, setValue } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });

  // Fetch branches
  const { data: branches, isLoading, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as Branch[];
    },
  });

  // Add branch
  const handleAddBranch = async (data: BranchFormData) => {
    try {
      const { error } = await supabase
        .from('branches')
        .insert([
          { name: data.name, location: data.location, is_active: true }
        ]);
        
      if (error) throw error;
      
      toast({
        title: 'Branch Added',
        description: `${data.name} branch has been successfully added.`,
      });
      
      resetAdd();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding branch:', error);
      toast({
        title: 'Error',
        description: 'Failed to add branch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Edit branch
  const handleEditClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setValue('name', branch.name);
    setValue('location', branch.location);
    setIsEditDialogOpen(true);
  };

  const handleEditBranch = async (data: BranchFormData) => {
    if (!selectedBranch) return;
    
    try {
      const { error } = await supabase
        .from('branches')
        .update({ name: data.name, location: data.location })
        .eq('id', selectedBranch.id);
        
      if (error) throw error;
      
      toast({
        title: 'Branch Updated',
        description: `${data.name} branch has been successfully updated.`,
      });
      
      resetEdit();
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating branch:', error);
      toast({
        title: 'Error',
        description: 'Failed to update branch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Toggle branch active status
  const toggleBranchStatus = async (branch: Branch) => {
    try {
      const { error } = await supabase
        .from('branches')
        .update({ is_active: !branch.is_active })
        .eq('id', branch.id);
        
      if (error) throw error;
      
      toast({
        title: branch.is_active ? 'Branch Deactivated' : 'Branch Activated',
        description: `${branch.name} branch has been ${branch.is_active ? 'deactivated' : 'activated'}.`,
      });
      
      refetch();
    } catch (error) {
      console.error('Error toggling branch status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update branch status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete branch
  const handleDeleteClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;
    
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', selectedBranch.id);
        
      if (error) throw error;
      
      toast({
        title: 'Branch Deleted',
        description: `${selectedBranch.name} branch has been successfully deleted.`,
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete branch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isSuperAdmin) {
    return (
      <PageTransition>
        <div className="container p-8">
          <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Branch Management</h1>
            <p className="text-muted-foreground">Manage all educational centers</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Branch
          </Button>
        </div>

        <Card className="w-full">
          {isLoading ? (
            <div className="p-8 flex justify-center">Loading branches...</div>
          ) : branches && branches.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>{branch.location}</TableCell>
                    <TableCell>
                      {branch.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(branch.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(branch)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleBranchStatus(branch)}
                      >
                        {branch.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteClick(branch)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Branches Found</h3>
              <p className="text-sm text-muted-foreground">Get started by adding your first branch</p>
            </div>
          )}
        </Card>

        {/* Add Branch Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Create a new educational center branch in the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitAdd(handleAddBranch)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Branch Name</Label>
                  <Input
                    id="name"
                    placeholder="Main Campus"
                    {...registerAdd('name')}
                  />
                  {errorsAdd.name && (
                    <p className="text-sm text-red-500">{errorsAdd.name.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="123 Education St, City"
                    {...registerAdd('location')}
                  />
                  {errorsAdd.location && (
                    <p className="text-sm text-red-500">{errorsAdd.location.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Branch</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Branch Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
              <DialogDescription>
                Update branch details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit(handleEditBranch)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Branch Name</Label>
                  <Input
                    id="edit-name"
                    {...registerEdit('name')}
                  />
                  {errorsEdit.name && (
                    <p className="text-sm text-red-500">{errorsEdit.name.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    {...registerEdit('location')}
                  />
                  {errorsEdit.location && (
                    <p className="text-sm text-red-500">{errorsEdit.location.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Branch</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Branch Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Branch</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedBranch?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteBranch}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types';
import { StudentService } from '@/services/StudentService';
import { Loader2 } from 'lucide-react';

interface StudentFormProps {
  student?: Student;
  onSuccess: () => void;
}

const studentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  fatherName: z.string().min(2, { message: "Father's name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  contactNumber: z.string().min(7, { message: "Please enter a valid contact number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  isActive: z.boolean().default(true),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentForm({ student, onSuccess }: StudentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues: Partial<StudentFormValues> = {
    name: student?.name || '',
    fatherName: student?.fatherName || '',
    email: student?.email || '',
    contactNumber: student?.contactNumber || '',
    address: student?.address || '',
    isActive: student?.isActive ?? true,
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  async function onSubmit(data: StudentFormValues) {
    setIsSubmitting(true);
    
    try {
      if (student?.id) {
        // Update existing student
        await StudentService.updateStudent(student.id, data);
        
        toast({
          title: "Student Updated",
          description: `${data.name}'s information has been updated.`,
        });
      } else {
        // Create new student
        await StudentService.createStudent(data);
        
        toast({
          title: "Student Added",
          description: `${data.name} has been added to the student list.`,
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting student form:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem saving the student information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 py-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ahmad Rahimi" {...field} />
                </FormControl>
                <FormDescription>
                  Student's full name as it appears on official documents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mohammad Rahimi" {...field} />
                </FormControl>
                <FormDescription>
                  Student's father's full name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ahmad.rahimi@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Contact email for student or guardian.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+93 700 123 456" {...field} />
                </FormControl>
                <FormDescription>
                  Primary contact number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter student's residential address"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Set the student's status to active or inactive.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {student ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              student ? 'Update Student' : 'Add Student'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
